---
title: Trace ID 与分布式追踪
description: 理解和设置跨服务传播的追踪标识符。
---
# Trace ID 与分布式追踪

Trace ID 用于标识一次完整的请求链路。跨服务调用时，通过传播 Trace Context，可以将不同服务内的 Observation 关联到同一 Trace。

OpenTelemetry 使用标准化的 Trace Context 以实现跨进程、跨服务传播。Langfuse 基于 OpenTelemetry，因此可以与已有埋点基础设施互操作。

## 指定 Trace ID

Trace ID 为 32 位十六进制字符串；父 Span ID 为 16 位十六进制字符串。在 Python SDK 中，可通过 `trace_context` 指定：

```python
from langfuse import get_client
langfuse = get_client()

with langfuse.start_as_current_observation(
    as_type="span",
    name="my-operation",
    trace_context={
        "trace_id": "abcdef1234567890abcdef1234567890",
        "parent_span_id": "fedcba0987654321",
    },
) as observation:
    print(observation.trace_id)
```

## TypeScript 中生成确定性 ID

可以根据外部系统的 ID（例如支持工单号）创建可重复生成的 Trace ID：

```typescript
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
const scoringTraceId = await createTraceId(externalId);
```

手动指定 `parentSpanContext` 后，新 Span 不再继承当前活动 Span 的上下文。给根 Observation 指定任意有效的父 Span ID，只是为了满足 ID 继承要求，不代表该父 Span 在 Trace 中真实存在。

关于跨服务传播和更完整的代码示例，请参阅[官方分布式追踪文档](https://langfuse.com/docs/observability/features/trace-ids-and-distributed-tracing)及[SDK 埋点参考](https://langfuse.com/docs/observability/sdk/instrumentation#trace-ids)。

---

原文：[Trace IDs and Distributed Tracing](https://langfuse.com/docs/observability/features/trace-ids-and-distributed-tracing) · 中文主体翻译，少量集成示例待迁移。


## 官方 Trace ID 与分布式追踪示例

默认 Trace ID 为 32 位十六进制字符，Observation ID 为 16 位。`create_trace_id(seed=...)`（Python）或 `createTraceId(...)`（TypeScript）可用于将外部 Request ID 映射为合法且可重复的 Trace ID。跨服务传播需要传递 Trace Context，而不仅复制一个字符串。

### Python：确定性 ID 与当前 Trace ID

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

### TypeScript：生成和读取 Trace ID

```ts
import { createTraceId, startObservation } from "@langfuse/tracing";

const externalId = "support-ticket-54321";
const langfuseTraceId = await createTraceId(externalId);
```

```ts
import { startObservation, getActiveTraceId } from "@langfuse/tracing";

await startObservation("run", async (span) => {
  const traceId = getActiveTraceId();
  console.log(`Current trace ID: ${traceId}`);
});
```

### Python：自定义 Trace Context 与装饰器

```python
from langfuse import get_client

langfuse = get_client()

# Use a predefined trace ID with trace_context parameter
with langfuse.start_as_current_observation(
    as_type="span",
    name="my-operation",
    trace_context={
        "trace_id": "abcdef1234567890abcdef1234567890",  # Must be 32 hex chars
        "parent_span_id": "fedcba0987654321"  # Optional, 16 hex chars
    }
) as observation:
    print(f"This observation has trace_id: {observation.trace_id}")
    # YOUR APPLICATION CODE HERE
```

```python
from langfuse import observe

@observe()
def my_operation(input):
    # YOUR APPLICATION CODE HERE
    result = call_llm(input)
    return result

process_user_request(
    input="Hello",
    langfuse_trace_id="abcdef1234567890abcdef1234567890" # Must be 32 hex chars
)
```

### TypeScript：显式设置 ID

```typescript
import { createTraceId, startObservation } from "@langfuse/tracing";

const externalId = "support-ticket-54321";

// Generate a valid, deterministic traceId from the external ID
const langfuseTraceId = await createTraceId(externalId);

// You can now start a new trace with this ID
const rootSpan = startObservation(
  "process-ticket",
  {},
  {
    parentSpanContext: {
      traceId: langfuseTraceId,
      spanId: "0123456789abcdef", // A valid 16 hexchar string; value is irrelevant as parent span does not exist but only used for inheritance
      traceFlags: 1, // mark trace as sampled
    },
  }
);

// Later, you can regenerate the same traceId to score or retrieve the trace
const scoringTraceId = await createTraceId(externalId);
// scoringTraceId will be the same as langfuseTraceId
```

::: info 校验说明
此处补齐上游示例；具体依赖和运行环境仍需验证。原文：[trace-ids-and-distributed-tracing](https://langfuse.com/docs/observability/features/trace-ids-and-distributed-tracing)。
:::
