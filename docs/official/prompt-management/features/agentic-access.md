---
title: Agent 提示词管理
description: 通过 Agent Skill、CLI 或 MCP Server，让 AI Agent 获取、创建和更新 Langfuse 提示词。
---
# Agent 提示词管理

AI 编程 Agent 可以在修改应用程序代码的同时操作你的 Langfuse 提示词库。可以通过 [Agent Skill](https://langfuse.com/docs/api-and-data-platform/features/agent-skill)、CLI 和 MCP Server 访问。不同方式的操作步骤请参阅[官方页面](https://langfuse.com/docs/prompt-management/features/agentic-access)。

## 工作流示例

你可以要求 Agent：

- 将代码库中硬编码的提示词迁移到 Langfuse；
- 读取某条提示词并比较它的最新版本；
- 创建新的文本提示词或聊天提示词版本；
- 更新部署标签，把已测试的提示词版本提升为正式版本。

## 跨 Langfuse 功能协作

Agent 还可以[调查生产环境的运行情况](/official/observability/features/agentic-access)，以及[执行评估流程](/official/evaluation/agentic-access)。

## 相关资料

- [通过 Agent Skill 自动改进提示词](https://langfuse.com/blog/2026-02-16-prompt-improvement-claude-skills)
- [通过编码 Agent 使用无界面的 Langfuse](https://langfuse.com/guides/videos/headless-langfuse)

---

原文：[Agentic Prompt Management](https://langfuse.com/docs/prompt-management/features/agentic-access) · 非官方中文翻译；官方交互式组件未迁移。