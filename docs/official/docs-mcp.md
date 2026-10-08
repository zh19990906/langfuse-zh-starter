---
title: 文档 MCP 服务器
description: 通过 Langfuse Docs MCP Server 让 AI Agent 和编码助手访问官方文档。
---
# Langfuse Docs MCP Server

Langfuse Docs MCP Server 可以让 AI Agent 访问 Langfuse 文档。

**典型用途**：让 Cursor 或其他 AI 编码 Agent 自动为代码库集成 Langfuse Tracing。详细操作和提示词示例见[快速开始](https://langfuse.com/docs/get-started)。

::: info
这里介绍的是**公开文档 MCP 服务器**。Langfuse 还提供需要认证的 MCP 服务器，用于访问数据平台中的其他功能，见[数据平台 MCP 文档](https://langfuse.com/docs/api-and-data-platform/features/mcp-server)。
:::

### 与 Agent Skill 配合使用

如果同时安装 [Langfuse Agent Skill](https://langfuse.com/docs/api-and-data-platform/features/agent-skill)，通常能得到更好的编码辅助效果。可从 [GitHub](https://github.com/langfuse/skills) 安装。

## 安装

官方安装步骤通过交互式 MDX 组件展示。请参阅[官方安装指南](https://langfuse.com/docs/docs-mcp#install)。本站尚未迁移该组件。

## 基本信息

- Endpoint：`https://langfuse.com/api/mcp`
- Transport：`streamableHttp`
- 认证：无需认证

MCP 工具、输入 Schema 和请求示例的权威来源是 [MCP Reference](https://mcp.reference.langfuse.com)。

## 相关资源

- [MCP 服务端实现源码](https://github.com/langfuse/langfuse-docs/blob/main/app/api/mcp/route.ts)
- [MCP Reference](https://mcp.reference.langfuse.com)
- [Langfuse Agent Skill](https://github.com/langfuse/skills)
- [Agent 入门](https://langfuse.com/docs/get-started)
- [Ask AI](https://langfuse.com/docs/ask-ai)
- [llms.txt](https://langfuse.com/llms.txt)：概要以及详细内容索引，包括 [Docs](https://langfuse.com/llms-docs.txt)、[Integrations](https://langfuse.com/llms-integrations.txt) 和 [Self-hosting](https://langfuse.com/llms-self-hosting.txt)。

## REST 接口

MCP 内部使用的文档搜索工具 `searchLangfuseDocs` 也可通过独立的 REST API 调用：

`https://langfuse.com/api/search-docs`

```bash
curl "https://langfuse.com/api/search-docs?query=Langfuse+Docs+MCP+Server"
```

如果不需要 MCP，只希望在应用中进行轻量级语义搜索，可以直接使用这个接口。

---

原文：[Docs MCP Server](https://langfuse.com/docs/docs-mcp) · 非官方中文翻译；交互式安装组件待迁移。