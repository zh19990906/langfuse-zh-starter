---
title: SDK 常见问题与排查
description: Python 和 JavaScript/TypeScript SDK 的认证、追踪缺失及上下文问题排查。
---
# SDK 疑难解答与常见问题

如果下列内容没有解决你的问题，可以使用[官方 Ask AI](https://langfuse.com/docs/ask-ai)、提交 [GitHub Issue](https://github.com/langfuse/langfuse/issues)或联系[官方支持](https://langfuse.com/support)。

## 认证问题

- 检查 `LANGFUSE_PUBLIC_KEY`、`LANGFUSE_SECRET_KEY` 和 `LANGFUSE_BASE_URL` 环境变量是否已配置；也可以在初始化 `Langfuse()` 时传入相应参数。
- 初始化阶段可调用 `langfuse.auth_check()` 检查连通性，但不要在生产请求过程中重复调用。

## 没有出现 Trace

- 查阅[追踪缺失常见原因](https://langfuse.com/faq/all/missing-traces)。
- 确认 `tracing_enabled` 为 `True`，且 `sample_rate` 不是 `0.0`。
- 在短时任务中执行 `langfuse.flush()`，退出应用时执行 `langfuse.shutdown()`，确保队列数据被导出。
- 打开调试日志查看导出器输出。Python 使用 `debug=True` 或 `LANGFUSE_DEBUG="True"`；JS/TS 使用 `LANGFUSE_DEBUG="true"` 或 `LANGFUSE_LOG_LEVEL="DEBUG"`。

## Observation 嵌套不正确或记录缺失

- 自托管用户使用基于 OpenTelemetry 的 SDK，平台版本应为 **3.63.0 或以上**。
- 优先使用 `with langfuse.start_as_current_observation(...)` 等上下文管理器保持 OTEL 上下文。
- 如果通过 `langfuse.start_observation()` 手动创建 Observation，记得调用 `.end()`。
- 在异步代码中使用 Langfuse 提供的上下文辅助方法，以免跨 `await` 丢失上下文。
- 如果某条 Observation 引用了未被 Langfuse 接收的父 Observation，它会显示在 Trace 根部，而不是预期父节点下。父节点被过滤、丢弃或根本没有发送都可能导致这种情况；请检查所有被引用的父节点是否确实已导出。

## LangChain / OpenAI 集成问题

- 确认调用 API 之前已经初始化 Langfuse 包装器（如 `from langfuse.openai import openai` 或 `LangfuseCallbackHandler`）。
- 检查 Langfuse、LangChain 和模型 SDK 之间的版本兼容性。

## 媒体内容未显示

- 对图像、音频等负载使用 `LangfuseMedia` 对象，并通过调试日志检查上传错误。媒体上传在后台线程执行。

## 使用 `@vercel/otel` 时追踪缺失

- 使用 **`@vercel/otel` v2 或以上**。v2 之前使用 OpenTelemetry JS SDK v1，而 `LangfuseSpanProcessor` 基于 OpenTelemetry JS SDK v2，因此旧版无法正确使用它。参阅 [vercel/otel#154](https://github.com/vercel/otel/issues/154)。
- 在 v2 以上版本中，`registerOTel({ spanProcessors: [new LangfuseSpanProcessor()] })` 应能正常导出追踪。
- 也可通过 `NodeSDK` 手动设置 OpenTelemetry 并注册 `LangfuseSpanProcessor`。参阅 [TypeScript 埋点说明](https://langfuse.com/docs/observability/sdk/instrumentation#framework-third-party-telemetry)。

---

原文：[SDK Troubleshooting & FAQ](https://langfuse.com/docs/observability/sdk/troubleshooting-and-faq) · 非官方中文翻译。
