---
title: Langfuse 概览
description: 开源 AI 工程平台，帮助团队调试、分析并持续迭代 AI Agent 应用。
---
# Langfuse 概览

Langfuse 是[开源 AI 工程平台](https://github.com/langfuse/langfuse)，帮助团队协作调试、分析和迭代 AI Agent 应用。各项功能原生集成，改善开发与改进流程。它是开放、可自托管、可扩展的平台，参阅[为什么使用 Langfuse](https://langfuse.com/why)。

## 可观测性

[可观测性](/official/observability/overview)有助于理解和调试 AI Agent 应用。不同于传统软件，Agent 工作流包含复杂、非确定性行为，难以直接监控。Langfuse 提供全面的 Trace 追踪，帮助理解应用各步骤。

- Trace 可包含 LLM 与非 LLM 调用，例如检索、Embedding、API 请求等。
- 支持把多轮对话按 Session 归类，关联用户。
- 可以用图形展示 Agent。
- 可通过 Python、JS 原生 SDK、100 多种库与框架集成、OpenTelemetry 或 LiteLLM 等 LLM Gateway 摄入追踪。
- 基于 OpenTelemetry，提高兼容性并减少厂商锁定。

可以先体验[交互式 Demo](/official/demo)，或[观看完整演示](https://langfuse.com/watch-demo)。

官方此处使用的动态 Trace 动画组件可在[原文](https://langfuse.com/docs#observability)查看。

## 提示词管理

[Prompt Management](/official/prompt-management/overview)是构建有效 AI 应用的重要部分。Langfuse 帮助团队在开发生命周期中管理、版本化和优化提示词。

- 通过[入门教程](/official/prompt-management/get-started)配置提示词管理。
- 集中管理 Prompt、控制版本并进行优化。
- 在 [Playground](/official/prompt-management/features/playground)中交互测试。
- 通过[实验](/official/evaluation/experiments/experiments-via-ui)在数据集上比较新 Prompt 版本。

也可[观看完整演示](https://langfuse.com/watch-demo)。官方 Prompt 管理 GIF 概览见[原文](https://langfuse.com/docs#prompts)。

## 评估

[Evaluation](/official/evaluation/overview)有助于保证 LLM 应用质量与可靠性，无论是开发期测试还是生产流量监控，Langfuse 都提供灵活的评价手段。

- [评估生产流量](/official/evaluation/get-started/online)，给在线 Trace 打分。
- 使用 LLM-as-a-Judge、代码评估器、用户反馈、人工标注或自定义 Pipeline 等[评估方式](/official/evaluation/overview)。
- 在生产数据上评估，及早发现问题。
- 创建和管理[Dataset](https://langfuse.com/docs/evaluation/experiments/datasets)，系统地覆盖不同情景。
- 执行[Experiment](https://langfuse.com/docs/evaluation/core-concepts#experiments)，比较应用变更。

[观看完整演示](https://langfuse.com/watch-demo)。官方 Evaluation GIF 概览可在[原文](https://langfuse.com/docs#evaluation)查看。

## 从哪里开始？

构建完整流程通常需要先接入在线 Trace，再配置提示词管理、生产评估与数据集上的离线评估。这些环节形成持续改进循环。官方完整交互流程图见[原文](https://langfuse.com/docs#where-to-start)。

如果刚接触 AI 工程，可在 [Langfuse Academy](https://langfuse.com/academy)学习概念、方案取舍和最佳实践。已明确任务则可直接使用下方快速入门指南。

::: info
也可以让 Coding Agent 使用 [Agent Skill](/official/api-and-data-platform/features/agent-skill)、[CLI](/official/api-and-data-platform/features/cli)或 [MCP Server](/official/api-and-data-platform/features/mcp-server)来配置、使用 Langfuse。Cloud 用户还可以直接在界面中询问 [Langfuse Assistant](/official/langfuse-assistant)。
:::

## 快速入门

1. [接入 LLM 应用 / Agent Trace](https://langfuse.com/docs/observability/get-started)
2. [配置提示词管理](/official/prompt-management/get-started)
3. [建立评估](/official/evaluation/get-started/online)

## 为什么使用 Langfuse？

- **开源**：完全开源，并提供公共 API 供自定义集成。
- **适合生产**：设计目标之一是尽量降低性能开销。
- **优秀的 SDK**：提供 Python 与 JavaScript 原生 SDK。
- **框架支持**：集成 OpenAI SDK、LangChain、LlamaIndex 等常见框架。
- **多模态**：可追踪文本、图像等类型。
- **完整平台**：覆盖 LLM 应用开发的全生命周期。

## 社区与联系

Langfuse 与社区持续进行[开源开发](https://langfuse.com/open-source)：

- 参与[路线图讨论](/official/roadmap)与投票。
- 在 [GitHub Discussions](https://langfuse.com/gh-support)提问，或使用[专属支持渠道](https://langfuse.com/support)。
- 通过 [GitHub Issues](https://langfuse.com/issue)报告问题。
- 加入 [Discord](https://langfuse.com/discord)。
- 参与[社区活动](https://langfuse.com/events)，向团队提问。
- 阅读[选择 Langfuse 的理由](https://langfuse.com/why)。

Langfuse 更新较快，可以查看[更新日志](https://langfuse.com/changelog)；新功能邮件订阅入口见[官方概览](https://langfuse.com/docs)。

---

原文：[Langfuse Overview](https://langfuse.com/docs) · 非官方中文翻译；交互动画、订阅组件保留原文入口。
