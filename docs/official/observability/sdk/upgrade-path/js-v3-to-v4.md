---
title: JS/TS SDK 从 v3 升级到 v4
description: Langfuse JavaScript/TypeScript SDK 的破坏性变更与迁移步骤。
---
# JS/TS SDK v3 → v4

::: info
官方建议仍使用 JS/TS SDK v3 的项目直接升级到 **v5**。需要先完成下文的 v3 → v4 迁移步骤，再参照 [v4 → v5 升级指南](/official/observability/sdk/upgrade-path/js-v4-to-v5)继续迁移。
:::

请逐项检查以下变化。如果升级时遇到问题，可以在 [GitHub Issues](https://github.com/langfuse/langfuse/issues)反馈。

## 初始化

Langfuse 服务地址环境变量由 `LANGFUSE_BASEURL` 改为 `LANGFUSE_BASE_URL`。v4 为兼容旧项目仍接受旧名称，但未来版本不再支持。

## 追踪（Tracing）

v4 基于 OpenTelemetry 重写追踪实现，引入多项破坏性变更：

1. **基于 OTEL 的架构**：必须完成 OpenTelemetry 初始化，在 `NodeSDK` 中注册 [`LangfuseSpanProcessor`](https://langfuse-js-git-main-langfuse.vercel.app/classes/_langfuse_otel.LangfuseSpanProcessor.html)。
2. **全新的追踪函数**：以前的 `langfuse.trace()`、`langfuse.span()` 与 `langfuse.generation()`，改为从 `@langfuse/tracing` 使用 [`startObservation`](https://langfuse-js-git-main-langfuse.vercel.app/functions/_langfuse_tracing.startObservation.html)、[`startActiveObservation`](https://langfuse-js-git-main-langfuse.vercel.app/functions/_langfuse_tracing.startActiveObservation.html) 等函数。
3. **职责分离**：`@langfuse/tracing` 和 `@langfuse/otel` 负责追踪；`@langfuse/client` 与 `LangfuseClient` 只处理评分、提示词管理、数据集等非追踪功能。

更多信息见[官方 SDK 说明](/official/observability/sdk/overview)。

## 提示词管理

现在从 `@langfuse/client` 导入：

```typescript
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();
const prompt = await langfuse.prompt.get("my-prompt");
const compiledPrompt = prompt.compile({ topic: "developers" });
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: compiledPrompt }],
});
```

`version` 由位置参数改为 `langfuse.prompt.get()` 选项对象中的可选属性：

```typescript
const prompt = await langfuse.prompt.get("my-prompt", { version: "1.0" });
```

## OpenAI 集成

新的导入路径：

```typescript
import { observeOpenAI } from "@langfuse/openai";
```

通过 `LANGFUSE_TRACING_ENVIRONMENT` 与 `LANGFUSE_TRACING_RELEASE` 设置环境和发布版本。

## Vercel AI SDK

使用方式与 v3 接近，但将 `langfuse-vercel` 的 `LangfuseExporter` 替换为 `@langfuse/otel` 的 `LangfuseSpanProcessor`。参考[完整 AI SDK 示例](https://langfuse.com/docs/observability/sdk/instrumentation#framework-third-party-telemetry)。

::: warning
传递给 LLM 的工具定义现在映射到 `metadata.tools`，而不再是 `input.tools`。如果评估逻辑读取了工具定义，必须相应修改。
:::

## LangChain 集成

新的导入路径：

```typescript
import { CallbackHandler } from "@langfuse/langchain";
```

同样可以通过 `LANGFUSE_TRACING_ENVIRONMENT` 和 `LANGFUSE_TRACING_RELEASE` 设置环境及发布版本。

## 获取 Trace URL

`langfuseClient.getTraceUrl` 现在是异步方法，返回 Promise：

```typescript
const traceUrl = await langfuseClient.getTraceUrl(traceId);
```

## 评分（Scoring）

通过 `@langfuse/client` 操作评分：

```typescript
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();
await langfuse.score.create({
  traceId: "trace_id_here",
  name: "accuracy",
  value: 0.9,
});
```

其他评分方法参阅[自定义评分说明](https://langfuse.com/docs/evaluation/evaluation-methods/custom-scores)。

## 数据集（Datasets）

数据集相关 API 也有所变化，参阅[官方数据集 SDK 指南](https://langfuse.com/docs/evaluation/dataset-runs/remote-run#setup--run-via-sdk)。

---

原文：[JS/TS v3 → v4](https://langfuse.com/docs/observability/sdk/upgrade-path/js-v3-to-v4) · 非官方中文翻译。
