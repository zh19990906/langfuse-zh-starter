---
title: Decision Model 评估器
description: Decision Model 评估器——Langfuse 官方文档中文整理。
---

# Decision Model 评估器

Decision Model 使用结构化问题对 Observation 给出可机器处理的判断，适合分类、等级评分、布尔检查和明确 Rubric 的场景。

## 工作原理

你定义一个或多个带类型的问题，例如“是否满足合规要求”“类别是什么”，再将目标 Observation 的字段映射为模型输入。模型输出经 Schema 校验后转成 Score。

## 为什么使用？

相比自由文本裁判，类型化结果更容易统计与过滤；可严格约束候选值，减少应用层解析错误。

## OpenAI 与 TypeSafe Jev

可使用支持相应结构化输出模式的 OpenAI 模型，或 TypeSafe Jev。不同 Provider 的连接要求、返回类型与可用题型有所差异。

## 题目类型

常见类型包括 Yes/No、枚举分类、等级、数值等；具体可选题型和校验规则以官方原文为准。

## 配置步骤

1. 配置 [LLM Connection](/official/administration/llm-connection)及所需密钥。
2. 新建 Decision Model Evaluator。
3. 编写各个问题、规则与允许返回值。
4. 将模型输入映射至 Observation 属性。
5. 用具有代表性的历史 Observation 测试。
6. 检查输出字段与 Score 类型后保存。

## 连接 OpenAI

选择支持所需结构化输出的 OpenAI 模型，配置 API Key 与相应连接；执行前检查模型能力。

## 连接 TypeSafe Jev

使用 TypeSafe 或支持该模型的 Vercel AI Gateway、OpenRouter 等网关；检查鉴权、模型名称和 Endpoint。

## Score 写入

每个问题的结构化判断映射为一个或多个 Score，用于 Dashboard、规则和后续统计。

## 调试执行

检查完整 Evaluation Execution，识别输入映射、网络调用或 Schema 解析错误。

## 使用限制

模型输出仍有误判概率，尤其是在模糊条件下。上线前应使用人工标注集校准，控制评估成本与采样比例。


::: info 翻译状态
已完成核心章节中文说明并保留全部代码；原文部分深层细节、表格及动态 FAQ 仍待逐段翻译与复核。此页暂不计入“完整验收”文档。
:::

原文：[Decision Model 评估器](https://langfuse.com/docs/evaluation/evaluation-methods/decision-models)。
