---
title: 事件队列与批量发送
description: 配置 Langfuse 追踪数据的后台队列、批量发送与退出前刷新。
---
# 事件队列与批量发送

Langfuse 客户端 SDK 和集成默认在后台排队并批量发送请求，以降低 API 调用和网络开销。批次由时间和大小共同决定，包括事件数量及批次体积。

## 配置

各集成都提供合理的默认值，你也可以自行调整批量发送行为。

| Python SDK 参数 / 环境变量 | JavaScript 参数 | 作用 |
| --- | --- | --- |
| `flush_at` / `LANGFUSE_FLUSH_AT` | `flushAt` | 一个批次在发送前最多累计多少事件 |
| `flush_interval` / `LANGFUSE_FLUSH_INTERVAL`（秒） | `flushInterval`（秒） | 最长等待多少秒才发送批次 |

例如，设置 `flushAt=1` 可每产生一条事件就发送；设置 `flushInterval=1` 可每秒发送一次。

## 手动刷新

::: info
在 Serverless 等短生命周期环境中，例如 Vercel Functions 或 AWS Lambda，必须在进程退出或运行环境冻结前显式刷新追踪数据；否则可能丢失事件。
:::

需要立即发送批次时，可以调用客户端的 `flush` 方法。如果遇到网络问题，flush 会记录错误并重试该批次，而不会抛出异常。

### Python SDK

```python
from langfuse import get_client

langfuse = get_client()
langfuse.flush()
```

如果应用即将退出，使用 `shutdown` 等待缓冲区内的请求全部发送并结束客户端。成功执行后，不会再向 Langfuse API 发送事件。

```python
from langfuse import get_client

langfuse = get_client()
langfuse.shutdown()
```

### JavaScript / TypeScript SDK

`LangfuseSpanProcessor` 会缓冲事件并批量发送，因此结束前执行强制刷新可避免丢失数据。

首先在 OpenTelemetry 初始化文件中导出 Processor：

```ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";

export const langfuseSpanProcessor = new LangfuseSpanProcessor();

const sdk = new NodeSDK({
  spanProcessors: [langfuseSpanProcessor],
});
sdk.start();
```

然后在 Serverless 处理函数退出前执行：

```ts
import { langfuseSpanProcessor } from "./instrumentation";

export async function handler(event, context) {
  // 应用逻辑
  await langfuseSpanProcessor.forceFlush();
}
```

### OpenAI SDK（Python）

```python
from langfuse import get_client

langfuse = get_client()
langfuse.flush()
```

### LangChain（Python）

```python
from langfuse import get_client

langfuse = get_client()
langfuse.flush()
langfuse_handler.client.flush()
```

### LangChain（JavaScript）

```javascript
await langfuseHandler.flushAsync();
```

退出应用时，可以调用 `shutdownAsync` 等待发送并结束客户端：

```javascript
await langfuseHandler.shutdownAsync();
```

---

原文：[Event Queuing/Batching](https://langfuse.com/docs/observability/features/queuing-batching) · 非官方中文翻译。
