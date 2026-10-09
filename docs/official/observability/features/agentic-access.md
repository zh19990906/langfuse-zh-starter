---
title: Agent 访问可观测性数据
description: 使用 Agent Skill、CLI 或 MCP Server，让 AI Agent 分析 Langfuse 追踪和指标。
---
# 通过 AI Agent 访问可观测性数据

AI Agent 可以直接在 Langfuse 中分析生产环境的应用行为。Agent 能通过 [Agent Skill](/official/api-and-data-platform/features/agent-skill)、CLI 或 MCP Server 等方式访问数据。具体操作方式参见[官方动态组件说明](https://langfuse.com/docs/observability/features/agentic-access)。

## 工作流示例

你可以要求 Agent：

- 查找特定环境中发生错误或延迟过高的 Observation；
- 比较不同模型和发布版本的 Token 使用量、成本或延迟；
- 检查问题 Observation 的输入、输出、元数据和评分；
- 添加评论或评分，记录调查结果。

## 跨 Langfuse 功能协作

Agent 也可以[管理提示词](/official/prompt-management/features/agentic-access)，或[执行评估工作流](/official/evaluation/agentic-access)。

## 相关资料

- [通过编码 Agent 使用无界面的 Langfuse](https://langfuse.com/guides/videos/headless-langfuse)：为应用添加埋点、分析追踪、构建数据集并开展评估。
- [利用 Agent 审查生产基础设施](https://langfuse.com/blog/2026-06-05-agentic-setup-for-operational-work)：借助仓库内 Skill、MCP Server 和可查询的生产数据开展定期工程检查。

---

原文：[Agentic Access to Observability](https://langfuse.com/docs/observability/features/agentic-access) · 非官方中文翻译；官方交互式组件未迁移。