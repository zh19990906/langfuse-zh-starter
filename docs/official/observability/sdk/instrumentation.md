---
title: SDK 埋点与 Observation
description: Context Manager、装饰器、手动 Observation、嵌套、更新属性、Trace ID 与 Flush。
---

# SDK 埋点

Instrumentation（埋点）用于记录应用正在执行的步骤，并以 Trace/Observation 形式发送到 Langfuse。

## 自定义埋点

**对应的官方代码示例（7 组）**

```python
from langfuse import get_client, propagate_attributes

langfuse = get_client()

with langfuse.start_as_current_observation(
    as_type="span",
    name="user-request-pipeline",
    input={"user_query": "Tell me a joke"},
) as root_span:
    with propagate_attributes(user_id="user_123", session_id="session_abc"):
        with langfuse.start_as_current_observation(
            as_type="generation",
            name="joke-generation",
            model="gpt-4o",
        ) as generation:
            generation.update(output="Why did the span cross the road?")

    root_span.update(output={"final_joke": "..."})
```

```ts
import { startActiveObservation, startObservation } from "@langfuse/tracing";

await startActiveObservation("user-request", async (span) => {
  span.update({ input: { query: "Capital of France?" } });

  const generation = startObservation(
    "llm-call",
    { model: "gpt-4", input: [{ role: "user", content: "Capital of France?" }] },
    { asType: "generation" }
  );
  generation.update({ output: { content: "Paris." } }).end();

  span.update({ output: "Answered." });
});
```

```python
from langfuse import observe

@observe()
def my_data_processing_function(data, parameter):
    return {"processed_data": data, "status": "ok"}

@observe(name="llm-call", as_type="generation")
async def my_async_llm_call(prompt_text):
    return "LLM response"
```

```ts
import { observe, updateActiveObservation } from "@langfuse/tracing";

async function fetchData(source: string) {
  updateActiveObservation({ metadata: { source: "API" } });
  return { data: `some data from ${source}` };
}

const tracedFetchData = observe(fetchData, {
  name: "fetch-data",
  asType: "span",
});

const result = await tracedFetchData("API");
```

```python
from langfuse import get_client

langfuse = get_client()

span = langfuse.start_observation(name="manual-span")
span.update(input="Data for side task")
child = span.start_observation(name="child-span", as_type="generation")
child.end()
span.end()
```

```python
from langfuse import get_client

langfuse = get_client()

# This outer span establishes an active context.
with langfuse.start_as_current_observation(as_type="span", name="main-operation") as main_operation_span:
    # 'main_operation_span' is the current active context.

    # 1. Create a "manual" span using langfuse.start_observation().
    #    - It becomes a child of 'main_operation_span'.
    #    - Crucially, 'main_operation_span' REMAINS the active context.
    #    - 'manual_side_task' does NOT become the active context.
    manual_side_task = langfuse.start_observation(name="manual-side-task")
    manual_side_task.update(input="Data for side task")

    # 2. Start another operation that DOES become the active context.
    #    This will be a child of 'main_operation_span', NOT 'manual_side_task',
    #    because 'manual_side_task' did not alter the active context.
    with langfuse.start_as_current_observation(as_type="span", name="core-step-within-main") as core_step_span:
        # 'core_step_span' is now the active context.
        # 'manual_side_task' is still open but not active in the global context.
        core_step_span.update(input="Data for core step")
        # ... perform core step logic ...
        core_step_span.update(output="Core step finished")
    # 'core_step_span' ends. 'main_operation_span' is the active context again.

    # 3. Complete and end the manual side task.
    # This could happen at any point after its creation, even after 'core_step_span'.
    manual_side_task.update(output="Side task completed")
    manual_side_task.end() # Manual end is crucial for 'manual_side_task'

    main_operation_span.update(output="Main operation finished")
# 'main_operation_span' ends automatically here.

# Expected trace structure in Langfuse:
# - main-operation
#   |- manual-side-task
#   |- core-step-within-main
#     (Note: 'core-step-within-main' is a sibling to 'manual-side-task', both children of 'main-operation')
```

```typescript
import { startObservation } from "@langfuse/tracing";

// Start a root observation for a user request
const span = startObservation(
  // name
  "user-request",
  // params
  {
    input: { query: "What is the capital of France?" },
  }
);

// Create a nested observation for, e.g., a tool call
const toolCall = span.startObservation(
  // name
  "fetch-weather",
  // params
  {
    input: { city: "Paris" },
  },
  // Specify observation type in asType
  // This will type the attributes argument accordingly
  // Default is 'span'
  { asType: "tool" }
);

// Simulate work and end the tool call observation
await new Promise((resolve) => setTimeout(resolve, 100));
toolCall.update({ output: { temperature: "15°C" } }).end();

// Create a nested generation for the LLM call
const generation = span.startObservation(
  "llm-call",
  {
    model: "gpt-4",
    input: [{ role: "user", content: "What is the capital of France?" }],
  },
  { asType: "generation" }
);

generation.update({
  usageDetails: { input: 10, output: 5 },
  output: { content: "The capital of France is Paris." },
});

generation.end();

// End the root observation
span.update({ output: "Successfully answered user request." }).end();
```


可以使用三种主要方法：

- **Context Manager**：Python 中使用 `with langfuse.start_as_current_observation(...)` 自动结束 Span。
- **Observe Wrapper / 装饰器**：对函数使用 `@observe()`，自动跟踪函数的执行。
- **Manual Observation**：显式创建、更新和结束对象，适合不能改函数结构的低层集成。

## 嵌套 Observation

**对应的官方代码示例（4 组）**

```python
from langfuse import observe

@observe
def my_data_processing_function(data, parameter):
    # ... processing logic ...
    return {"processed_data": data, "status": "ok"}


@observe
def main_function(data, parameter):
    return my_data_processing_function(data, parameter)
```

```python
from langfuse import get_client

langfuse = get_client()

with langfuse.start_as_current_observation(as_type="span", name="outer-process") as outer_span:
    # outer_span is active

    with langfuse.start_as_current_observation(as_type="generation", name="llm-step-1") as gen1:
        # gen1 is active, child of outer_span
        gen1.update(output="LLM 1 output")

    with outer_span.start_as_current_observation(name="intermediate-step") as mid_span:
        # mid_span is active, also a child of outer_span
        # This demonstrates using the yielded span object to create children

        with mid_span.start_as_current_observation(as_type="generation", name="llm-step-2") as gen2:
            # gen2 is active, child of mid_span
            gen2.update(output="LLM 2 output")

        mid_span.update(output="Intermediate processing done")

    outer_span.update(output="Outer process finished")
```

```python
from langfuse import get_client

langfuse = get_client()

parent = langfuse.start_observation(name="manual-parent")

child_span = parent.start_observation(name="manual-child-span")
# ... work ...
child_span.end()

child_gen = parent.start_observation(name="manual-child-generation", as_type="generation")
# ... work ...
child_gen.end()

parent.end()
```

```ts
import { startActiveObservation } from "@langfuse/tracing";

await startActiveObservation("outer-process", async () => {
  await startActiveObservation("llm-step-1", async (span) => {
    span.update({ output: "LLM 1 output" });
  });

  await startActiveObservation("intermediate-step", async (span) => {
    await startActiveObservation("llm-step-2", async (child) => {
      child.update({ output: "LLM 2 output" });
    });

    span.update({ output: "Intermediate processing done" });
  });
});
```


内层 Observation 应继承当前 Context，从而建立可读的父子结构。手动创建时要管理 Span 生命周期，避免出现孤立节点。Python 与 JS/TS 的 Context Propagation 实现细节有所不同。

## 更新 Observation

**对应的官方代码示例（2 组）**

```python
from langfuse import get_client

langfuse = get_client()

with langfuse.start_as_current_observation(as_type="generation", name="llm-call", model="gpt-5-mini") as gen:
    gen.update(input={"prompt": "Why is the sky blue?"})

    # ... make LLM call ...
    response_text = "Rayleigh scattering..."

    gen.update(
        output=response_text,
        usage_details={"input_tokens": 5, "output_tokens": 50},
        metadata={"confidence": 0.9}
    )

# Alternatively, update the current observation in context:
with langfuse.start_as_current_observation(as_type="span", name="data-processing"):
    # ... some processing ...
    langfuse.update_current_span(metadata={"step1_complete": True})
    # ... more processing ...
    langfuse.update_current_span(output={"result": "final_data"})
```

```ts
import { startActiveObservation } from "@langfuse/tracing";

await startActiveObservation("user-request", async (span) => {
  span.update({
    input: { path: "/api/process" },
    output: { status: "success" },
  });
});
```


创建时可以记录 Name、Input、Model 等字段，在 LLM 返回后再补充 Output、Usage、Cost 等。结束后不应依赖无界更新以修正历史数据。

## 添加属性

**对应的官方代码示例（3 组）**

```python
from langfuse import get_client, propagate_attributes

langfuse = get_client()

with langfuse.start_as_current_observation(as_type="span", name="user-workflow"):
    with propagate_attributes(
        user_id="user_123",
        session_id="session_abc",
        metadata={"experiment": "variant_a"},
        version="1.0",
        environment="staging",
        trace_name="user-workflow",
    ):
        with langfuse.start_as_current_observation(as_type="generation", name="llm-call"):
            pass
```

```python
from langfuse import observe, propagate_attributes

@observe()
def my_llm_pipeline(user_id: str, session_id: str):
    # Propagate early in the trace
    with propagate_attributes(
        user_id=user_id,
        session_id=session_id,
        metadata={"pipeline": "main"}
    ):
        # All nested @observe functions inherit these attributes
        result = call_llm()
        return result

@observe()
def call_llm():
    # This automatically has user_id, session_id, metadata from parent
    pass
```

```ts
import { startActiveObservation, propagateAttributes, startObservation } from "@langfuse/tracing";

await startActiveObservation("user-workflow", async () => {
  await propagateAttributes(
    {
      userId: "user_123",
      sessionId: "session_abc",
      metadata: { experiment: "variant_a", env: "prod" },
      version: "1.0",
      traceName: "user-workflow",
    },
    async () => {
      const generation = startObservation("llm-call", { model: "gpt-4" }, { asType: "generation" });
      generation.end();
    }
  );
});
```


User ID、Session ID、Tag、Metadata、Environment 和 Version 便于查询、筛选与评估。在新版 SDK 中，这些关联属性通过 `propagate_attributes()` 或 `propagateAttributes()` 传播到子 Observation；仅修改根 Trace 不等同于传播。

## 跨服务传播

**对应的官方代码示例（2 组）**

```python
from langfuse import get_client, propagate_attributes
import requests

langfuse = get_client()

with langfuse.start_as_current_observation(as_type="span", name="api-request"):
    with propagate_attributes(
        user_id="user_123",
        session_id="session_abc",
        environment="staging",
        as_baggage=True,
    ):
        requests.get("https://service-b.example.com/api")
```

```ts
import { propagateAttributes, startActiveObservation } from "@langfuse/tracing";

await startActiveObservation("api-request", async () => {
  await propagateAttributes(
    {
      userId: "user_123",
      sessionId: "session_abc",
      asBaggage: true,
    },
    async () => {
      await fetch("https://service-b.example.com/api");
    }
  );
});
```


分布式服务需要在 HTTP、消息或 RPC 调用时传播 OpenTelemetry Trace Context。跨服务同一 Trace 的 Span 才能正确聚合。使用 Python `propagate_attributes(..., as_baggage=True)` 还会通过 OTel Baggage 传播属性，其中 `environment` 使用 **`langfuse_environment`** Baggage 键；在下游继承的 Context 内，该值优先于下游进程本地的 `LANGFUSE_TRACING_ENVIRONMENT` 或 Client 环境配置。Python SDK 的 `environment` 是映射到 `langfuse.environment` 的独立属性，不是普通 Trace Metadata。

## Trace 的输入输出

**对应的官方代码示例（3 组）**

```python
from langfuse import get_client

langfuse = get_client()

# Using the context manager
with langfuse.start_as_current_observation(
    as_type="span",
    name="user-request",
    input={"query": "What is the capital of France?"}  # This becomes the trace input
) as root_span:

    with langfuse.start_as_current_observation(
        as_type="generation",
        name="llm-call",
        model="gpt-4o",
        input={"messages": [{"role": "user", "content": "What is the capital of France?"}]}
    ) as gen:
        response = "Paris is the capital of France."
        gen.update(output=response)
        # LLM generation input/output are separate from trace input/output

    root_span.update(output={"answer": "Paris"})  # This becomes the trace output
```

```python
from langfuse import get_client

langfuse = get_client()

with langfuse.start_as_current_observation(as_type="span", name="complex-pipeline") as root_span:
    # Root observation has its own input/output
    root_span.update(input="Step 1 data", output="Step 1 result")

    # But trace should have different input/output (e.g., for LLM-as-a-judge)
    root_span.set_trace_io(
        input={"original_query": "User's actual question"},
        output={"final_answer": "Complete response", "confidence": 0.95}
    )

    # Now trace input/output are independent of root observation input/output

# Using the observe decorator
@observe()
def process_user_query(user_question: str):
    # LLM processing...
    answer = call_llm(user_question)

    # Explicitly set trace input/output for evaluation features
    langfuse.set_current_trace_io(
        input={"question": user_question},
        output={"answer": answer}
    )

    return answer
```

```ts
import { propagateAttributes, startObservation } from "@langfuse/tracing";

const userId = "user-123";
const sessionId = "session-abc";

propagateAttributes(
  {
    userId: userId,
    sessionId: sessionId,
    tags: ["authenticated-user"],
    metadata: { plan: "premium" },
  },
  () => {
    const rootSpan = startObservation("data-processing");

    const generation = rootSpan.startObservation(
      "llm-call",
      {},
      { asType: "generation" }
    );

    generation.end();

    rootSpan.end();
  }
);
```


新的 Observation 优先模型通常使用**根 Observation** 的 Input/Output 作为整条 Trace 的输入输出。旧的 Trace 级别 IO API 是兼容方案，逐步弃用；新项目优先更新根 Observation。

## Trace 和 Observation ID

**对应的官方代码示例（6 组）**

```python
from langfuse import get_client, Langfuse
langfuse = get_client()

external_request_id = "req_12345"
deterministic_trace_id = langfuse.create_trace_id(seed=external_request_id)
```

```python
from langfuse import get_client, Langfuse
langfuse = get_client()

with langfuse.start_as_current_observation(as_type="span", name="my-op") as current_op:
    trace_id = langfuse.get_current_trace_id()
    observation_id = langfuse.get_current_observation_id()
    print(trace_id, observation_id)
```

```ts
import { createTraceId, startObservation } from "@langfuse/tracing";

const externalId = "support-ticket-54321";

const langfuseTraceId = await createTraceId(externalId);

const rootSpan = startObservation(
  "process-ticket",
  {},
  {
    parentSpanContext: {
      traceId: langfuseTraceId,
      spanId: "0123456789abcdef",
      traceFlags: 1,
    },
  }
);
```

```ts
import { startObservation, getActiveTraceId } from "@langfuse/tracing";

await startObservation("run", async (span) => {
  const traceId = getActiveTraceId();
  console.log(`Current trace ID: ${traceId}`);
});
```

```python
from langfuse import get_client

langfuse = get_client()

existing_trace_id = "abcdef1234567890abcdef1234567890"
existing_parent_span_id = "fedcba0987654321"

with langfuse.start_as_current_observation(
    as_type="span",
    name="process-downstream-task",
    trace_context={
        "trace_id": existing_trace_id,
        "parent_span_id": existing_parent_span_id,
    },
):
    pass
```

```ts
import { startObservation } from "@langfuse/tracing";

const span = startObservation(
  "downstream-task",
  {},
  {
    parentSpanContext: {
      traceId: "abcdef1234567890abcdef1234567890",
      spanId: "fedcba0987654321",
      traceFlags: 1,
    },
  }
);

span.end();
```


ID 应符合 OpenTelemetry / W3C Trace Context 的要求；希望关联外部 Request ID，可以使用 SDK 的确定性 Trace ID Helper，而不是设置任意不合法 ID。

## 客户端生命周期与 Flush

**对应的官方代码示例（6 组）**

```python
from langfuse import get_client

langfuse = get_client()
# ... create traces and observations ...
langfuse.flush() # Ensures all pending data is sent
```

```python
from langfuse import get_client

langfuse = get_client()
# ... application logic ...

# Before exiting:
langfuse.shutdown()
```

```ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";

// Export the processor to be able to flush it
export const langfuseSpanProcessor = new LangfuseSpanProcessor({
  exportMode: "immediate" // optional: configure immediate span export in serverless environments
});

const sdk = new NodeSDK({
  spanProcessors: [langfuseSpanProcessor],
});

sdk.start();
```

```ts
import { langfuseSpanProcessor } from "./instrumentation";

export async function handler(event, context) {
  // ... your application logic ...

  // Flush before exiting
  await langfuseSpanProcessor.forceFlush();
}
```

```ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";

// Export the processor to be able to flush it
export const langfuseSpanProcessor = new LangfuseSpanProcessor();

const sdk = new NodeSDK({
  spanProcessors: [langfuseSpanProcessor],
});

sdk.start();
```

```ts
import { after } from "next/server";

import { langfuseSpanProcessor } from "./instrumentation.ts";

export async function POST() {
  // ... existing request logic ...

  // Schedule flush after request has completed
  after(async () => {
    await langfuseSpanProcessor.forceFlush();
  });

  // ... send response ...
}
```


Python 短进程结束前执行 `langfuse.flush()`；JS/TS 应适当地 `shutdown()` OpenTelemetry NodeSDK。长运行服务需在退出钩子中清理 Exporter。详细代码保留在后附的原文示例。

## 校验补充：不同埋点方式的生命周期

**Python Context Manager**：`with langfuse.start_as_current_observation(...)` 会自动设置活跃上下文并在离开 `with` 时结束 Observation。通过 `as_type="generation"` 等参数选择类型；内部创建的 Observation 自动继承父子关系。

**JS/TS Context Manager**：`startActiveObservation(name, async (span) => {...})` 会让新 Span 在回调期间生效，处理跨异步调用的上下文，并在回调结束时自动结束。

**装饰器/包装器**：Python 使用 `@observe()`，TypeScript 使用 `observe()` 包装函数，自动记录输入、输出、耗时和错误。输入输出可能很大，Python 可通过 `capture_input=False`、`capture_output=False` 或 `LANGFUSE_OBSERVE_DECORATOR_IO_CAPTURE_ENABLED` 关闭自动采集。

**手动 Observation**：必须明确调用 `.end()`；单纯更新 Output 不代表已结束。

## 校验补充：属性传播与跨服务上下文

可传播的常用属性包括 User ID、Session ID、Metadata、Version、Tag 与 Trace Name。Python `propagate_attributes()` 还支持请求级 `environment`，会映射到 `langfuse.environment`，**不是普通 Metadata**。JS/TS 使用 `propagateAttributes()`。

跨服务传播可以使用 OpenTelemetry Baggage；Python 的 `as_baggage=True` 还可以传递 Environment。在传播上下文中，Baggage 中的 `langfuse_environment` 优先于下游本地环境变量或客户端默认 Environment。必须在子调用开始前设置属性，不应期待它追溯修改已创建的 Span。

## 校验补充：Flush 与 Shutdown

Langfuse SDK 的追踪数据通常异步批量导出。Python `flush()` 会等待缓冲数据处理；`shutdown()` 除了刷新，还会等待摄入及媒体上传工作线程退出。SDK 通常注册 `atexit` Hook，但 Serverless、强制退出或守护进程仍建议显式处理。

JS/TS 通用 Serverless 函数可持有 `LangfuseSpanProcessor`，在函数结束前执行 `await langfuseSpanProcessor.forceFlush()`；Node 进程结束时则正确 Shutdown OpenTelemetry SDK。不能认为函数返回时后台导出一定已完成。


::: info 精校状态
原先堆在文末的 33 组代码已按官方章节归位；仍需逐段校验正文说明和 SDK 示例的实际运行，不等于完整验收。
:::

原文：[instrumentation](https://langfuse.com/docs/observability/sdk/instrumentation)。
