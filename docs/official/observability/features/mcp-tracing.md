---
title: MCP 追踪
description: 使用 Langfuse 对 MCP 客户端和服务器进行端到端追踪。
---
# MCP 追踪

[模型上下文协议（MCP）](https://modelcontextprotocol.io/)让 AI Agent 能与外部工具及数据源交互。默认情况下，MCP 客户端和服务器会产生独立的 Trace，这有助于明确服务边界。

如果希望统一查看完整请求流，也可以将追踪上下文从客户端传递到服务器，把两侧的 Trace 连接起来。

## 独立追踪与关联追踪

**独立追踪**：客户端和服务器各自生成 Trace。当它们由不同团队维护，或需要清晰的服务边界时很有用。

**关联追踪**：利用 MCP 的 `_meta` 字段传递追踪上下文，从客户端、服务器一直到外部 API，组成一条连续的追踪记录。

## 传播追踪上下文

MCP 支持通过 `_meta` 字段传递上下文。将 OpenTelemetry 上下文（W3C Trace Context 格式）注入工具调用后，就能关联两端的追踪：

1. 客户端提取当前 Trace Context。
2. 将上下文注入 MCP 工具调用的 `_meta` 字段。
3. 服务器提取并恢复该上下文。
4. 服务器上的后续操作继承客户端追踪上下文。

![MCP Trace 示例](https://langfuse.com/images/docs/mcp-server-trace.png)

[在 Langfuse 中查看示例追踪](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/a7706e389c0f8d7f2f71d8d187bdf22c?timestamp=2025-10-15T12%3A32%3A49.362Z&observation=a4a1419ad946722c)

## 实现方式

[langfuse-examples 示例仓库](https://github.com/langfuse/langfuse-examples/tree/main/applications/mcp-tracing)提供了使用 OpenAI、Exa API 和 Langfuse 完成端到端 MCP 追踪的实现。

---

原文：[MCP Tracing](https://langfuse.com/docs/observability/features/mcp-tracing) · 非官方中文翻译。