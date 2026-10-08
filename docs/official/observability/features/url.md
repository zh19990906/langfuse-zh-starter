---
title: Trace 链接
description: 获取、访问与共享 Langfuse Trace 的唯一 URL。
---
# Trace URL

每条 Trace 都有唯一的 URL，可用于直接打开或与他人共享。

## 获取 Trace URL

你可以在 SDK 中获取 Trace URL，例如写入日志，或者在 Notebook 中运行实验时直接跳转查看。

### Python SDK：装饰器

```python
from langfuse import observe, get_client

@observe()
def process_data():
    langfuse = get_client()
    trace_url = langfuse.get_trace_url()
    print(f"View trace at: {trace_url}")

    trace_id = langfuse.get_current_trace_id()
    trace_url = langfuse.get_trace_url(trace_id=trace_id)
```

### Python SDK：上下文管理器

```python
from langfuse import get_client

langfuse = get_client()
with langfuse.start_as_current_observation(as_type="span", name="process-request") as span:
    trace_url = langfuse.get_trace_url()
    print(f"View trace at: {trace_url}")

    trace_id = langfuse.get_current_trace_id()
    trace_url = langfuse.get_trace_url(trace_id=trace_id)
```

### JavaScript / TypeScript

```ts
import { LangfuseClient } from "@langfuse/client";
import { startObservation } from "@langfuse/tracing";

const langfuse = new LangfuseClient();
const rootSpan = startObservation("my-trace");
const traceUrl = await langfuse.getTraceUrl(rootSpan.traceId);
console.log("Trace URL: ", traceUrl);
```

### LangChain（JavaScript / TypeScript）

可通过 Langfuse SDK 与 LangChain 集成的互操作能力获取 Trace URL，参阅[互操作文档](https://langfuse.com/integrations/frameworks/langchain#interoperability)。

```ts
import { CallbackHandler } from "@langfuse/langchain";
import { startActiveObservation } from "@langfuse/tracing";
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();
const langfuseHandler = new CallbackHandler();

await startActiveObservation("langchain-call", async (span) => {
  await chain.invoke(
    { input: "<user_input>" },
    { callbacks: [langfuseHandler] },
  );
  const traceUrl = await langfuse.getTraceUrl(span.traceId);
  console.log("Trace URL: ", traceUrl);
});
```

## 通过 URL 分享 Trace

默认情况下，只有 Langfuse 项目成员可以查看 Trace。

可以将 Trace 设为 `public`，通过公共链接分享，无需访问者登录或加入项目。

示例：[公开 Trace](https://cloud.langfuse.com/project/clkpwwm0m000gmm094odg11gi/traces/2d6b96f2-0a4d-4366-99a5-1ad558c66e99)。

### 从 Langfuse UI 分享

[观看操作演示](https://static.langfuse.com/docs-videos/share-trace.mp4)。

### Python SDK

使用 `@observe()` 装饰器：

```python
from langfuse import observe, get_client

@observe()
def process_data():
    langfuse = get_client()
    langfuse.set_current_trace_as_public()
```

使用上下文管理器：

```python
from langfuse import get_client

langfuse = get_client()
with langfuse.start_as_current_observation(as_type="span", name="process-request") as span:
    span.set_trace_as_public()
    trace_id = langfuse.get_current_trace_id()
    trace_url = langfuse.get_trace_url(trace_id=trace_id)
    print(f"Share this trace at: {trace_url}")
```

### JavaScript / TypeScript

```ts
import { startObservation } from "@langfuse/tracing";

const rootSpan = startObservation("my-trace");
rootSpan.setTraceAsPublic();
rootSpan.end();
```

---

原文：[Trace URLs](https://langfuse.com/docs/observability/features/url) · 非官方中文翻译。
