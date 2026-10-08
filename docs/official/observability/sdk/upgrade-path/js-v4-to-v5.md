---
title: JS/TS SDK v4 升级到 v5
description: 新版 Observation 优先数据模型、Span 筛选和追踪 API 的迁移指南。
---
# JS/TS SDK v4 → v5

JS/TS SDK v5 引入[以 Observation 为中心的数据模型](/official/observability/data-model)。用于关联数据的 `userId`、`sessionId`、`metadata` 和 `tags` 不再只存在于 Trace，而是传播到每个 Observation，让大规模查询无需昂贵的 Join。

因此，设置 Trace 属性不再采用 `updateActiveTrace()` 命令式更新，而改用 `propagateAttributes()` 包装回调，让回调内创建的全部子 Observation 自动继承属性。

::: warning
v5 修改了默认 OpenTelemetry 导出行为：Langfuse 引入**智能 Span 筛选**。如果以前依赖导出所有 Span（包括非 LLM Span），务必先检查以下破坏性变更。
:::

## 破坏性变更

### 智能 Span 筛选取代默认全部导出

旧版默认导出全部 OpenTelemetry Span，造成 HTTP、数据库、队列、框架内部等非 LLM Span 噪声。v5 默认仅在以下任一条件满足时导出：

- Span 由 Langfuse `langfuse-sdk` 创建；
- Span 具有 `gen_ai.*` 属性；
- Instrumentation Scope 属于已知 LLM 前缀，如 `openinference`、`langsmith`、`haystack`、`litellm`。

此前如果没有自定义 `shouldExportSpan`，通常会导出全部 Span。

**保持旧版全部导出行为：**

```typescript
import { LangfuseSpanProcessor } from "@langfuse/otel";

const spanProcessor = new LangfuseSpanProcessor({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
  secretKey: process.env.LANGFUSE_SECRET_KEY!,
  shouldExportSpan: () => true,
});
```

**在默认行为上叠加自定义规则：**

v5 的 `shouldExportSpan` 是完全覆盖；要在默认过滤基础上扩展，应与 `isDefaultExportSpan` 组合。

```typescript
import { LangfuseSpanProcessor, isDefaultExportSpan } from "@langfuse/otel";

const spanProcessor = new LangfuseSpanProcessor({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
  secretKey: process.env.LANGFUSE_SECRET_KEY!,
  shouldExportSpan: ({ otelSpan }) =>
    isDefaultExportSpan(otelSpan) ||
    otelSpan.instrumentationScope.name.startsWith("my_framework"),
});
```

**树形结构可能断裂：**中间或父 Span 被筛掉而子 Span 保留时，Trace 树会断开。设置 `LANGFUSE_DEBUG="true"` 或 `LANGFUSE_LOG_LEVEL="DEBUG"` 查看丢弃记录，再把所需 Instrumentation Scope 加入允许列表。参阅[SDK 高级功能](/official/observability/sdk/advanced-features)及[OTEL 排障](https://langfuse.com/faq/all/existing-otel-setup#unwanted-spans-in-langfuse)。

### `updateActiveTrace()` 拆成三个函数

`propagateAttributes()` 将属性应用于当前及回调中创建的子 Span，但**不会追溯修改回调开始之前创建的 Span**。

**v4：**

```typescript
import { updateActiveTrace, startActiveObservation } from "@langfuse/tracing";

await startActiveObservation("my-operation", async (span) => {
  updateActiveTrace({
    name: "user-workflow",
    userId: "user-123",
    sessionId: "session-456",
    tags: ["production"],
    public: true,
    metadata: { testRun: "server-export" },
    input: { query: "hello" },
    output: { response: "world" },
  });
});
```

**v5：**

```typescript
import {
  propagateAttributes,
  startActiveObservation,
  setActiveTraceIO,
  setActiveTraceAsPublic,
} from "@langfuse/tracing";

await propagateAttributes(
  {
    traceName: "user-workflow", // was "name"
    userId: "user-123",
    sessionId: "session-456",
    tags: ["production"],
    metadata: { testRun: "server-export" },
  },
  async () => {
    await startActiveObservation("my-operation", async (span) => {
      setActiveTraceIO({
        input: { query: "hello" },
        output: { response: "world" },
      });
      setActiveTraceAsPublic();
    });
  },
);
```

关键差异：

| 属性 | v4 | v5 |
| --- | --- | --- |
| `name` | `updateActiveTrace({name: ...})` | `propagateAttributes({traceName: ...}, cb)` |
| `userId`、`sessionId`、`tags`、`version` | `updateActiveTrace({...})` | `propagateAttributes({...}, cb)` |
| `metadata` | `updateActiveTrace({metadata: any})` | `propagateAttributes({metadata: Record<string,string>}, cb)` |
| `input`、`output` | `updateActiveTrace({...})` | `setActiveTraceIO({...})`（已弃用） |
| `public` | `updateActiveTrace({public: true})` | `setActiveTraceAsPublic()` |
| `release` | `updateActiveTrace({release: ...})` | 移除，使用 `LANGFUSE_RELEASE` |
| `environment` | `updateActiveTrace({environment: ...})` | 移除，使用 `LANGFUSE_TRACING_ENVIRONMENT` |

::: warning
`setActiveTraceIO()` 仅为兼容依赖 Trace 级输入输出的旧版 [LLM-as-a-Judge](/official/evaluation/evaluation-methods/llm-as-a-judge) 保留，已弃用。**新代码应直接为根 Observation 设置输入输出。**
:::

### `.updateTrace()` 替换为 `.setTraceIO()` 和 `.setTraceAsPublic()`

同样适用于 `LangfuseSpan`、`LangfuseGeneration` 等 Observation Wrapper。

**v4：**

```typescript
import { startObservation } from "@langfuse/tracing";

const span = startObservation("my-op");
span.updateTrace({
  name: "my-trace",
  userId: "user-123",
  sessionId: "session-456",
  tags: ["prod"],
  public: true,
  input: { query: "hello" },
  output: { response: "world" },
});
```

**v5：**

```typescript
import { propagateAttributes, startObservation } from "@langfuse/tracing";

propagateAttributes(
  {
    traceName: "my-trace",
    userId: "user-123",
    sessionId: "session-456",
    tags: ["prod"],
  },
  () => {
    const span = startObservation("my-op");
    span.setTraceIO({
      input: { query: "hello" },
      output: { response: "world" },
    });
    span.setTraceAsPublic();
    span.end();
  },
);
```

`.setTraceIO()` 与 `setActiveTraceIO()` 一样，只用于旧版 Trace 级 LLM-as-a-Judge 的向后兼容，已弃用。

### Public API 命名空间变化

v5 将高性能公开 API 设为默认资源，移除了 v2 别名。

| v4 或过渡名称 | v5 名称 |
| --- | --- |
| `langfuse.api.observationsV2` | `langfuse.api.observations` |
| `langfuse.api.scoreV2` | `langfuse.api.scores` |
| `langfuse.api.metricsV2` | `langfuse.api.metrics` |
| `langfuse.api.observations`（旧 v1） | `langfuse.api.legacy.observationsV1` |
| `langfuse.api.score`（旧 v1） | `langfuse.api.legacy.scoreV1` |
| `langfuse.api.metrics`（旧 v1） | `langfuse.api.legacy.metricsV1` |

若 JS/TS v5 客户端暂时需要访问自托管 Langfuse v3，请使用 `langfuse.api.legacy.*V1`。

::: warning
默认 `api.observations` 与 `api.metrics` 使用 Observations v2、Metrics v2 服务端接口，要求 **Langfuse v4**。自托管 v3 应使用 `api.legacy.observationsV1` 和 `api.legacy.metricsV1`。详见[兼容性矩阵](https://langfuse.com/self-hosting/upgrade/versioning#sdk-server)。
:::

**公开 API 端点弃用**与 SDK v5 破坏性变更不同。部分 JS v5 方法虽然仍可调用，但底层访问的服务端接口已被弃用，如 `langfuse.api.trace.list()`、`langfuse.api.sessions.list()`、`langfuse.api.scores.getMany()`。升级时应核对[弃用 API 的 SDK 方法映射](https://langfuse.com/faq/all/deprecated-api-migration#sdk-method-quick-reference)。

### `@langfuse/langchain` 内部变化

`CallbackHandler` 现在使用 `propagateAttributes()` 设置 Trace 属性。会影响：

- 继承 `CallbackHandler` 的应用；
- 依赖内部 Span 创建细节的代码；
- 原本向 `traceMetadata` 传递非字符串值的代码。现在非字符串值先经 `JSON.stringify` 序列化，再传给只接受 `Record<string,string>` 的 `propagateAttributes`。

### `@langfuse/openai` 内部变化

`traceMethod` Wrapper 现在使用 `propagateAttributes()` 包装被追踪的调用，设置 `userId`、`sessionId`、`tags`、`traceName`，而不再在 Observation 上调用 `.updateTrace()`。如需让父 Observation 也继承属性，应将整个执行流程包装在 `propagateAttributes()` 中。

### 移除的属性

| 已移除 | 替代方案 |
| --- | --- |
| `release` | `LANGFUSE_RELEASE` 环境变量 |
| `environment` | `LANGFUSE_TRACING_ENVIRONMENT` 环境变量 |
| `public` | `setActiveTraceAsPublic()` / `.setTraceAsPublic()` |

## 迁移检查清单

1. 检查依赖非 LLM OTEL Span 的 Trace 和 Dashboard，这些 Span 在 v5 默认过滤器下可能消失。
2. 若需要维持全部 Span 导出，在 `LangfuseSpanProcessor` 配置 `shouldExportSpan: () => true`。
3. 自定义过滤器若想保留默认逻辑，应组合 `isDefaultExportSpan`。
4. 查找 `updateActiveTrace`，拆分为 `propagateAttributes()`、仅旧兼容场景使用的 `setActiveTraceIO()`、`setActiveTraceAsPublic()`。
5. 查找 `.updateTrace(`，改用 `propagateAttributes()`、`.setTraceIO()`、`.setTraceAsPublic()`。
6. 确保 Metadata 符合 `Record<string,string>`，值长度不超过 **200 字符**。
7. `release`、`environment` 改为 `LANGFUSE_RELEASE`、`LANGFUSE_TRACING_ENVIRONMENT`。
8. 将 `api.observationsV2`、`api.scoreV2`、`api.metricsV2` 更新为 `api.observations`、`api.scores`、`api.metrics`。
9. 旧 v1 的 `api.observations`、`api.score`、`api.metrics` 分别移至 `api.legacy.observationsV1`、`api.legacy.scoreV1`、`api.legacy.metricsV1`。
10. 自托管 v3 使用上述 Legacy API；默认 Observations / Metrics 要求 v4。
11. 删除全部剩余的 `*V2` 别名引用（v5 已移除）。

---

原文：[JS/TS v4 → v5](https://langfuse.com/docs/observability/sdk/upgrade-path/js-v4-to-v5) · 非官方中文翻译；代码示例保持上游原样。
