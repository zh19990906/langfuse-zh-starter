---
title: 在 UI 中运行提示词实验
description: 使用数据集测试提示词版本与模型，并通过自动评分比较实验结果。
---
# 通过 UI 运行实验（Prompt Experiments）

在 Langfuse UI 中直接运行提示词实验，测试来自[提示词管理](/official/prompt-management/overview)的不同提示词版本或语言模型，并排比较结果。

可以选择附加 [LLM-as-a-Judge](/official/evaluation/evaluation-methods/llm-as-a-judge) 或[代码评估器](/official/evaluation/evaluation-methods/code-evaluators)，根据预期输出自动评分，并从聚合层面分析效果。

[观看提示词实验演示](https://static.langfuse.com/docs-videos/prompt-experiments.mp4)。

## 为什么使用提示词实验？

- 快速测试不同提示词版本或模型。
- 使用数据集组织统一测试案例。
- 在 UI 中快速迭代提示词。
- 使用 LLM 裁判或代码评估器与预期结果比较。
- 提示词变更后运行测试，避免质量回退。

配置实验时可以选择 **Dataset Version**，将运行固定在历史数据集状态。不选则使用最新版。详见[版本化数据集](/official/evaluation/experiments/datasets)。

## 前提条件

### 1. 创建可用于实验的提示词

先[创建提示词](/official/prompt-management/get-started)。

::: info
提示词中的变量名必须与实验使用的数据集项输入 JSON 的键一致，才能正确映射。
:::

**示例：提示词变量和数据集键的映射**

提示词：

```text
You are a Langfuse expert. Answer based on:
{{documentation}}

Question: {{question}}
```

数据集项：

```json
{
  "documentation": "Langfuse is an AI Engineering Platform",
  "question": "What is Langfuse?"
}
```

`{{documentation}}` 对应 `documentation`，`{{question}}` 对应 `question`。这两个键都必须存在于数据集项的输入 JSON 中。

**示例：Chat Message Placeholder 映射**

Chat Prompt 中的占位符命名为 `message_history`。对应数据集项：

```json
{
  "message_history": [
    {
      "role": "user",
      "content": "What is Langfuse?"
    },
    {
      "role": "assistant",
      "content": "Langfuse is a tool for tracking and analyzing the performance of language models."
    }
  ],
  "question": "What is Langfuse?"
}
```

占位符 `message_history` 映射到输入 JSON 的同名键，普通变量 `{{question}}` 映射到 `question`。**消息占位符内部的变量不会被进一步解析**。两项都必须存在，实验才能正确运行。

### 2. 创建可用于实验的数据集

[创建数据集](/official/evaluation/experiments/datasets)，包含想要测试的输入及预期输出。

::: info
可用的数据集要求：数据集项的 `input` 是 JSON 对象，且键名与提示词的变量或占位符名称匹配。例如上面的 `documentation` 与 `question`。
:::

### 3. 配置 LLM Connection

每个数据集项都会触发一次提示词执行，因此需要在项目设置中配置 [LLM Connection](/official/administration/llm-connection)。

### 4. 可选：配置评估器

可以创建 [LLM-as-a-Judge](/official/evaluation/evaluation-methods/llm-as-a-judge) 评估语义质量，也可以创建[代码评估器](/official/evaluation/evaluation-methods/code-evaluators)执行确定性检查。记得将目标设置为 Experiments，并筛选要使用的数据集。

## 从 UI 触发实验

### 第 1 步：打开数据集

当前需要从数据集详情页启动实验：

- 进入 **Your Project → Datasets**。
- 点击要用于实验的数据集。

![进入数据集](https://langfuse.com/images/docs/navigate-to-dataset.png)

### 第 2 步：打开配置页

点击 **Start Experiment**。

![启动实验](https://langfuse.com/images/docs/trigger-process.png)

再点击 **Prompt Experiment** 下方的 **Create**。

![新建 Prompt Experiment](https://langfuse.com/images/docs/trigger-process-2.png)

### 第 3 步：配置实验

1. 设置 Experiment 名称。
2. 选择要测试的 Prompt。
   - 如果只有一段动态内容，建议使用静态 System Prompt 与动态 User Message 的 Chat Prompt，将整段用户输入作为变量。
   - 如果存在多个动态字段，建议在 Prompt 中为每个字段分别定义变量，便于与数据集项映射。
3. 创建或选择 LLM Connection。
4. 选择数据集。
5. **可选：结构化输出**。启用后强制响应符合 JSON Schema，可选择项目中已有 Schema 或新建 Schema。
   - 可以在 [Playground](/official/prompt-management/features/playground) 创建和保存 Schema，再在实验中复用。
   - 点击 Schema 选择器旁的眼睛图标查看或编辑。
6. 可选选择要使用的评估器。
7. 点击 **Create** 启动实验。

![配置实验](https://langfuse.com/images/docs/configure_dataset_run.png)

::: info
结构化输出确保响应符合指定的 JSON Schema，有利于保持结果一致、方便解析与后续评估。Playground 中保存的 Schema 也可直接用于实验。
:::

创建后会跳转到 Experiments 页面。根据提示词复杂度和数据集大小，实验可能需要数秒至数分钟。

### 第 4 步：比较实验运行

每次实验结束后，可以在 Experiments 表格查看聚合评分，并排比较结果。[比较实验](/official/evaluation/experiments/compare-experiments)介绍如何选择基线、检查回退及逐项审查输出。

[观看实验对比演示](https://static.langfuse.com/docs-videos/datasets-compare.mp4)。

## 相关资料

- 如果要评估完整应用或 Agent 逻辑（包括自定义运行时配置），应使用[通过 SDK 运行实验](/official/evaluation/experiments/experiments-via-sdk)。也可以通过 [Webhook](/official/evaluation/experiments/experiments-via-sdk) 在 UI 触发基于 SDK 的评估运行。
- 如果自定义 Pipeline 或其他语言通过 OpenTelemetry 上报 Trace，使用[通过 OpenTelemetry 运行实验](/official/evaluation/experiments/experiments-via-opentelemetry)。

官方 GitHub Discussions 是动态内容，未嵌入本站。

---

原文：[Experiments via UI](https://langfuse.com/docs/evaluation/experiments/experiments-via-ui) · 非官方中文翻译。
