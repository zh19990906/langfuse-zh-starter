---
title: Agent 访问评估功能
description: 使用 AI Agent 操作评分、数据集、实验、评估器与人工标注队列。
---
# 通过 AI Agent 访问评估功能

AI Agent 可以协助调查质量问题，并在 Langfuse 中执行评估工作流。访问方式包括 Agent Skill、CLI 和 MCP Server，具体方法见[官方说明](https://langfuse.com/docs/evaluation/agentic-access)。

测试应用时，可以从[使用数据集进行评估](https://langfuse.com/docs/evaluation/get-started/offline)开始，随后[比较实验](https://langfuse.com/docs/evaluation/experiments/compare-experiments)，最后[配置 CI 质量门禁](https://langfuse.com/docs/evaluation/experiments/experiments-ci-cd)。这些示例可复用 Python 或 TypeScript 编写的应用函数及评分器。

## 工作流示例

你可以要求 Agent：

- 查找低评分的 Observation，并将代表性案例加入数据集；
- 创建或更新评分配置并记录评分；
- 审查实验结果，识别性能或质量回退；
- 配置评估器与评估规则；
- 创建和管理人工审核的标注队列。

## 跨 Langfuse 功能协作

Agent 也可以[调查生产运行情况](/official/observability/features/agentic-access)和[管理提示词](/official/prompt-management/features/agentic-access)。

## 相关资料

- [校准 LLM-as-a-Judge](https://langfuse.com/guides/llm-as-a-judge-calibration-skill)
- [评估 AI Agent Skill](https://langfuse.com/blog/2026-02-26-evaluate-ai-agent-skills)
- [通过编码 Agent 使用无界面的 Langfuse](https://langfuse.com/guides/videos/headless-langfuse)

---

原文：[Agentic Access to Evaluation](https://langfuse.com/docs/evaluation/agentic-access) · 非官方中文翻译；官方交互式组件未迁移。