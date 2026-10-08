---
title: 追踪采样
description: 配置客户端采样率，控制发送到 Langfuse 的追踪数据量。
---
# 采样（Sampling）

采样用于控制 Langfuse 收集的 Trace 数量，在**客户端**执行。

通过环境变量 `LANGFUSE_SAMPLE_RATE` 或 SDK 的 `sample_rate` / `sampleRate` 参数配置，取值为 **0 到 1**。默认值为 `1`，表示全部采集；`0.2` 表示约 20% 的 Trace 会被采集。SDK 按 Trace 级别采样，同一 Trace 下的 Observation 和 Score 也遵循这次采样决定。

## Python SDK

可以通过环境变量或客户端参数设置采样率：

```python
from langfuse import Langfuse, get_client
import os

os.environ["LANGFUSE_SAMPLE_RATE"] = "0.5"
langfuse = get_client()

# 另一种方式：在初始化时传入
Langfuse(sample_rate=0.5)
langfuse = get_client()
```

装饰器的例子：

```python
from langfuse import observe, Langfuse
Langfuse(sample_rate=0.3)

@observe()
def process_data():
    # 大约 30% 的调用会产生追踪
    pass
```

如果某条 Trace 未被采样，其下的 Observation 及 Score 也不会发送，可降低高流量系统的数据量。

## JavaScript / TypeScript SDK

Langfuse 尊重 OpenTelemetry 的采样决定。可以在 OTEL SDK 中配置 Sampler 来控制要发送的 Trace。对于嵌套的 Span，应使采样策略遵循父 Span 的决定。完整 SDK 初始化示例与集成差异参阅[官方采样说明](https://langfuse.com/docs/observability/features/sampling)。

## OpenAI、LangChain 和 Vercel AI SDK

这些集成通常依赖底层 Langfuse SDK / OpenTelemetry 的采样配置。针对 JavaScript 集成，需要检查 OTEL TracerProvider 的 Sampler，而不应假定 Python 环境变量直接作用于所有 JavaScript 集成。

**注意**：采样减少数据量，也可能丢失重要的低频错误。对需要完整审计的场景应谨慎使用。

---

原文：[Sampling](https://langfuse.com/docs/observability/features/sampling) · 中文主体翻译；上游部分 JS/TS 框架初始化示例仍需逐项移植。


## 分场景采样的官方实现

采样在客户端完成，取值 **0–1**，默认 `1`（100%）；`0.2` 约表示收集 20% 的 Trace。采样以 Trace 为单位，关联的 Observation 和 Score 随 Trace 一起保留或丢弃。Python 可设置 `LANGFUSE_SAMPLE_RATE` 或 `Langfuse(sample_rate=...)`；JS/TS 应结合 OpenTelemetry Sampler 配置，不能机械照搬 Python 构造参数。

### Python SDK 环境变量、初始化与 @observe

```python
from langfuse import Langfuse, get_client
import os

# Method 1: Set environment variable
os.environ["LANGFUSE_SAMPLE_RATE"] = "0.5"  # As string in env var
langfuse = get_client()

# Method 2: Initialize with constructor parameter then get client
Langfuse(sample_rate=0.5)  # 50% of traces will be sampled
langfuse = get_client()
```

```python
from langfuse import observe, Langfuse, get_client

# Initialize the client with sampling
Langfuse(sample_rate=0.3)  # 30% of traces will be sampled

@observe()
def process_data():
    # Only ~30% of calls to this function will generate traces
    # The decision is made at the trace level (first observation)
    pass
```

### JS/TS OpenTelemetry Trace Sampler

```ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";
import { TraceIdRatioBasedSampler } from "@opentelemetry/sdk-trace-base";

const sdk = new NodeSDK({
  // Sample 20% of all traces
  sampler: new TraceIdRatioBasedSampler(0.2),
  spanProcessors: [new LangfuseSpanProcessor()],
});
```

```ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";
import { TraceIdRatioBasedSampler } from "@opentelemetry/sdk-trace-base";

const sdk = new NodeSDK({
  // Sample 20% of all traces
  sampler: new TraceIdRatioBasedSampler(0.2),
  spanProcessors: [new LangfuseSpanProcessor()],
});
```

### OpenAI JS/TS 集成

```ts
import OpenAI from "openai";
import { observeOpenAI } from "@langfuse/openai";

const openai = observeOpenAI(new OpenAI());
```

```ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";
import { TraceIdRatioBasedSampler } from "@opentelemetry/sdk-trace-base";

const sdk = new NodeSDK({
  // Sample 20% of all traces
  sampler: new TraceIdRatioBasedSampler(0.2),
  spanProcessors: [new LangfuseSpanProcessor()],
});
```

### LangChain JS/TS 集成

```ts
import { CallbackHandler } from "@langfuse/langchain";

const handler = new CallbackHandler();
```

### Vercel AI SDK / Next.js

```ts
import { registerOTel } from "@vercel/otel";
import { LangfuseSpanProcessor } from "@langfuse/otel";
import { TraceIdRatioBasedSampler } from "@opentelemetry/sdk-trace-base";

export function register() {
  registerOTel({
    serviceName: "langfuse-vercel-ai-nextjs-example",
    traceSampler: new TraceIdRatioBasedSampler(0.5),
    spanProcessors: [new LangfuseSpanProcessor()],
  });
}
```

::: info 校验说明
此处补齐上游示例；具体依赖和运行环境仍需验证。原文：[sampling](https://langfuse.com/docs/observability/features/sampling)。
:::
