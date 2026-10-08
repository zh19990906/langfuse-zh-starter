---
title: log levels
description: Langfuse 官方文档的中文翻译与适配。
---

# 日志级别

通过 `level` 属性区分 Observation 的重要性，控制追踪详情中显示的信息，并突出错误及警告。

支持四个值：`DEBUG`、`DEFAULT`、`WARNING`、`ERROR`。还可以设置 `statusMessage` 补充上下文。

![日志级别](https://langfuse.com/images/docs/trace-log-level.png)

## Python SDK

```python
from langfuse import observe, get_client

@observe()
def my_function():
    langfuse = get_client()
    langfuse.update_current_span(
        level="WARNING", status_message="This is a warning"
    )
```

也可以在创建 Observation 时传入 `level` 与 `status_message`，或者稍后使用 `span.update()` 更新。Generation 同样支持这些属性。

## JavaScript / TypeScript

```typescript
import { startObservation } from "@langfuse/tracing";
const span = startObservation("manual-observation", {
  input: { query: "What is the capital of France?" },
});
span.update({ level: "WARNING", statusMessage: "This is a warning" });
span.update({ output: "Paris" }).end();
```

OpenAI 和 LangChain 集成通常会根据上游 API 响应或工作流状态自动设置级别和状态消息。

## 存储与映射

级别按上述**字符串**保存，无数值编码。未设置时默认为 `DEFAULT`，API、导出与筛选均采用相同字符串。

通过 OpenTelemetry 接入时依次判断：

1. 如果存在 `langfuse.observation.level`，优先使用它，不区分大小写。别名 `TRACE`、`VERBOSE` 映射到 `DEBUG`；`INFO`、`LOG`、`NOTICE`、`OK`、`SUCCESS` 映射到 `DEFAULT`；`WARN` 映射到 `WARNING`；`FATAL`、`CRITICAL` 映射到 `ERROR`。
2. 否则，如果 OpenTelemetry Span 状态为 ERROR，则为 `ERROR`。
3. 其他情况为 `DEFAULT`。

`statusMessage` 优先读取 `langfuse.observation.status_message`，否则回退到 OTEL 状态消息。不会使用 OTEL 日志的 `SeverityNumber` 或 `SeverityText`。

在单个 Trace 页面可按日志级别筛选 Observation。[查看演示](https://static.langfuse.com/docs-videos/250210-trace-log-level-filter.mp4)。

原文：[Log Levels](https://langfuse.com/docs/observability/features/log-levels)。部分框架示例省略，后续复核。


## 官方日志等级代码示例

可用等级为 `DEBUG`、`DEFAULT`、`WARNING`、`ERROR`，并可添加 `statusMessage`（TS）或 `status_message`（Python）。可按 Level 筛选 Trace / Observation。

### Python：装饰器、Context Manager 与 Generation

```python
from langfuse import observe, get_client

@observe()
def my_function():
    langfuse = get_client()

    # ... processing logic ...
    # Update the current observation with a warning level
    langfuse.update_current_span(
        level="WARNING",
        status_message="This is a warning"
    )
```

```python
from langfuse import get_client

langfuse = get_client()

# Using context managers (recommended)
with langfuse.start_as_current_observation(as_type="span", name="my-operation") as span:
    # Set level and status message on creation
    with span.start_as_current_observation(
        name="potentially-risky-operation",
        level="WARNING",
        status_message="Operation may fail"
    ) as risky_span:
        # ... do work ...

        # Or update level and status message later
        risky_span.update(
            level="ERROR",
            status_message="Operation failed with unexpected input"
        )

# You can also update the currently active observation without a direct reference
with langfuse.start_as_current_observation(as_type="span", name="another-operation"):
    # ... some processing ...
    langfuse.update_current_span(
        level="DEBUG",
        status_message="Processing intermediate results"
    )
```

```python
langfuse = get_client()

with langfuse.start_as_current_observation(
    as_type="generation",
    name="llm-call",
    model="gpt-4o",
    level="DEFAULT"  # Default level
) as generation:
    # ... make LLM call ...

    if error_detected:
        generation.update(
            level="ERROR",
            status_message="Model returned malformed output"
        )
```

### TypeScript：Context Manager、observe 包装器和手动创建

```ts
import { startActiveObservation, startObservation } from "@langfuse/tracing";

await startActiveObservation("context-manager", async (span) => {
  span.update({
    input: { query: "What is the capital of France?" },
  });

  updateActiveObservation({
    level: "WARNING",
    statusMessage: "This is a warning",
  });
});
```

```ts
import { observe, updateActiveObservation } from "@langfuse/tracing";

// An existing function
async function fetchData(source: string) {
  updateActiveObservation({
    level: "WARNING",
    statusMessage: "This is a warning",
  });

  // ... logic to fetch data
  return { data: `some data from ${source}` };
}

// Wrap the function to trace it
const tracedFetchData = observe(fetchData, {
  name: "observe-wrapper",
});

const result = await tracedFetchData("API");
```

```ts
import { startObservation } from "@langfuse/tracing";

const span = startObservation("manual-observation", {
  input: { query: "What is the capital of France?" },
});

span.update({
  level: "WARNING",
  statusMessage: "This is a warning",
});

span.update({ output: "Paris" }).end();
```

::: info 校验说明
此处补齐上游示例；具体依赖和运行环境仍需验证。原文：[log-levels](https://langfuse.com/docs/observability/features/log-levels)。
:::
