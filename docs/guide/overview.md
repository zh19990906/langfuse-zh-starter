# 什么是 Langfuse？

**Langfuse** 是一个开源 AI 工程平台，帮助团队调试、分析、评估并持续改善大型语言模型（LLM）应用及 AI Agent。

这篇中文入门导览依据 [Langfuse 官方概览](https://langfuse.com/docs) 整理，旨在帮助初学者快速理解核心概念，而非逐段翻译。

## 三大能力

### 可观测性（Observability）

跟踪模型调用与应用流程，包括检索、工具调用、嵌入和 API 请求。你可以检查一次请求的输入输出、执行耗时、Token 与费用，并按用户和会话分析。

### 提示词管理（Prompt Management）

将 Prompt 从散落的代码中集中管理，记录版本，测试不同方案，并通过标签选择生产环境使用的版本。

### 评估（Evaluation）

收集用户反馈、创建测试数据集、运行自动或人工评估，在发布前和生产环境中衡量质量。

## 推荐学习路线

1. 跟着 [Python 快速接入](/guide/python-quickstart) 记录一次模型调用。
2. 在 [可观测性](/features/observability) 中理解 Trace、Observation、Session。
3. 使用 [提示词管理](/features/prompts) 进行版本迭代。
4. 使用 [评估与数据集](/features/evaluations) 衡量效果。

## 与 ChatGPT 的区别

ChatGPT 主要面向终端用户对话；Langfuse 面向开发者，帮助理解和优化幕后运行的模型应用。两者可以配合使用，并非替代关系。
