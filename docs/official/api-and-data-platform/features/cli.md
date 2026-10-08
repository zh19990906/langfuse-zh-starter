---
title: cli
description: Langfuse 官方文档的中文翻译与适配。
---

# Langfuse CLI

Langfuse CLI 将[公开 API](https://langfuse.com/docs/api-and-data-platform/features/public-api)包装为命令行工具，适合 AI 编程 Agent 和习惯终端的开发者。如果不能执行命令或安装软件，可以改用 [MCP Server](https://langfuse.com/docs/api-and-data-platform/features/mcp-server)。

![CLI 示例](https://langfuse.com/images/changelog/2026-02-17-langfuse-cli.jpg)

完整文档：[langfuse-cli](https://github.com/langfuse/langfuse-cli)。

```bash
npx @langfuse/cli api <resource> <action>
```

原包名 `langfuse-cli` 仍暂时维护，但官方推荐使用 `@langfuse/cli`：

```bash
npm uninstall --global langfuse-cli
npm install --global @langfuse/cli
# 或
bun remove --global langfuse-cli
bun add --global @langfuse/cli
```

迁移后继续使用相同的 `langfuse` 命令。

## 认证

在 **Project Settings → API Keys** 生成项目密钥，通过环境变量传入：

```bash
export LANGFUSE_PUBLIC_KEY="pk-lf-..."
export LANGFUSE_SECRET_KEY="sk-lf-..."
export LANGFUSE_BASE_URL="https://cloud.langfuse.com"
```

欧盟默认地址为 `https://cloud.langfuse.com`，美国为 `https://us.cloud.langfuse.com`，日本为 `https://jp.cloud.langfuse.com`，HIPAA 区为 `https://hipaa.cloud.langfuse.com`；自托管使用自己的服务地址。

CLI 自动读取密钥，不需要单独登录；不同项目需使用不同的密钥对。

## 支持的操作

根据 OpenAPI 规范生成命令，可访问 Trace、Observation、Prompt、Dataset、Score、Session、Metrics 等所有公开 API 资源。

错误退出码：用法 2、配置 3、网络 4、HTTP 5、本地错误 6，便于 Agent 判断失败原因。

它适合让 Agent 管理 Langfuse、在 CI/CD 中导出追踪或批量评分、快速查询最近 Trace 与提示词版本，并可与 [Agent Skill](/official/api-and-data-platform/features/agent-skill)结合。

原文：[CLI](https://langfuse.com/docs/api-and-data-platform/features/cli)。
