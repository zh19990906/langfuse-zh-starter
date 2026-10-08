---
title: LLM Playground
description: 在 Langfuse Playground 中测试、迭代与比较不同提示词和模型。
---
# LLM Playground

你可以直接在 Langfuse 的 Prompt Playground 中测试与迭代提示词，调整提示词内容及模型参数，观察不同模型对输入变更的响应。无需在工具之间来回切换，也不需要编写代码，就能快速优化 LLM 应用的效果。

![LLM Playground](https://langfuse.com/images/docs/playground-overview.png)

## 核心功能

### 并排比较视图

可将多个提示词变体放在一起比较：同时执行所有变体，或者只执行其中一个。每个变体都有独立的 LLM 设置、变量、工具定义和占位符，便于直观比较变更影响。

[观看并排比较演示](https://static.langfuse.com/docs-videos/playground-side-by-side-comparison.mp4)。

### 在 Playground 中打开提示词

通过 [Langfuse 提示词管理](https://langfuse.com/docs/prompt-management/get-started)创建的提示词可以直接在 Playground 中打开。

[观看操作演示](https://static.langfuse.com/docs-videos/playground-open-prompt.mp4)。

### 保存到提示词管理

测试结果满意后，点击保存按钮，将当前提示词保存到 Prompt Management。

[观看保存演示](https://static.langfuse.com/docs-videos/playground-save-prompt.mp4)。

### 在 Playground 中打开 Generation

在 [Langfuse 可观测性](/official/observability/overview)中打开 Generation 详情，点击 `Open in Playground`，即可在 Playground 中继续调试。

[观看演示](https://static.langfuse.com/docs-videos/playground-open-prompt.mp4)。

### 工具调用与结构化输出

Playground 支持工具调用和结构化输出 Schema，可以定义、测试和验证依赖工具执行且必须满足特定响应格式的 LLM 调用。

::: info
当前只有采用 OpenAI ChatML 格式的 Tool 类型 Observation 可以直接从追踪中在 Playground 打开。其他格式的支持需求可提交到[公开路线图](https://langfuse.com/ideas)。
:::

[观看工具调用和结构化输出视频](https://www.youtube.com/watch?v=IkSK5Kz-Pt8)。

**工具调用（Tool Calling）：**

- 用 JSON Schema 定义自定义工具；
- 模拟工具响应，实时测试依赖工具的提示词；
- 将工具定义保存到项目中。

**结构化输出（Structured Output）：**

- 使用 JSON Schema 强制约束响应格式；
- 将 Schema 保存到项目中；
- 从包含结构化输出的 OpenAI Generation 跳转进入 Playground。

### 添加提示词变量

通过变量模拟不同输入条件下的提示词表现。

![添加提示词变量](https://langfuse.com/images/docs/playground-variables.png)

### 使用你喜欢的模型

在 Langfuse 项目设置中添加模型提供商的 API Key，就可以使用相应模型。详见 [LLM Connection 配置](https://langfuse.com/docs/administration/llm-connection)。

![选择模型](https://langfuse.com/images/docs/playground-model-selection.png)

很多提供商允许传入额外参数；可以在模型选择菜单打开 **Additional Options**，传入对应参数。参阅[高级配置说明](https://langfuse.com/docs/administration/llm-connection#advanced-configurations)。

## 相关资料

如果希望通过数据集系统性地进行提示词和模型变体的回归测试，请使用[实验（Experiments）](https://langfuse.com/docs/evaluation/core-concepts#experiments)。

官方页面的 GitHub Discussions 为动态组件，本站暂不嵌入。

---

原文：[LLM Playground](https://langfuse.com/docs/prompt-management/features/playground) · 非官方中文翻译。
