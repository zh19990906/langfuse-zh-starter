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
