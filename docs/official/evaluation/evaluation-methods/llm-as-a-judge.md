---
title: LLM-as-a-Judge 自动评估
description: LLM-as-a-Judge 自动评估——Langfuse 官方文档中文整理。
---

# LLM-as-a-Judge

LLM-as-a-Judge 通过另一轮模型调用，按照预先定义的标准评价应用输出，例如事实正确性、相关性、完整性、语气或有害内容。这种评估不应视为绝对真值，需要与人工标注及已知测试样本校准。

## 工作原理

Evaluator 将待评价的 Observation 输入、输出和可选 Ground Truth、Metadata 映射到评价 Prompt。裁判模型返回 Score 和解释，Langfuse 把结果关联到目标 Observation 或实验项。

## 为什么使用？

适合大规模、需要自然语言理解的质量指标，可作为生产监控与离线实验的共同评价方式。主观结果可能受到提示词、裁判模型版本和提供商影响。

## 如何选择评估目标？

可以评价单个 Observation、整条 Trace 的根 Observation，或 Experiment Output。不同对象可读取的字段不同；要按实际评估目标设计变量映射。

## 配置步骤

1. 通过 [LLM Connection](/official/administration/llm-connection)接入裁判模型。
2. 在 Evaluators 页面创建 LLM-as-a-Judge。
3. 编写包含评价标准和输出要求的 Prompt。
4. 将变量映射到 Observation Input/Output、Metadata 或 Expected Output。
5. 选择代表性的样本测试 Score 和解释。
6. 保存 Evaluator，并根据用途关联在线 Rule 或离线 Experiment。

## Prompt Message Role

System、User 等不同角色会影响裁判行为，应合理放置评价标准与待审阅文本，并防范被评价内容中隐藏的 Prompt Injection。

## 多模态评价

对于图像或其他多模态数据，需要确保裁判模型支持相关媒体，并通过媒体引用正确传入输入变量。

## Evaluator 运行位置

可以在线对匹配 Rule 的 Observation 评分，也可以批量对历史数据运行，或在实验执行时评分。应理解触发时机、采样和 Provider 限流。

## Project 默认模型

团队可以配置默认评价模型，降低重复配置。升级默认模型可能改变历史 Score 的分布。

## 通过 API 配置

可以通过公共 API 管理评价器与相关设置，字段结构请参照最新 API Reference。

## 高级 Score Config

可以设置数值区间、分类标签和布尔值，保证不同 Evaluator 产出的 Score 可比较。

## 从 Trace 级迁移到 Observation 级

Langfuse v4 将评估重点转向 Observation，旧 Trace 输入输出可能不再作为唯一数据来源。迁移时核对评价对象、变量与 SDK 版本。

## 排查问题

遇到模型配置不合法、未触发评分或映射失败，应检查 Provider Key、变量类型、Rule 匹配、时间窗口和 Ingestion Version。

## 历史数据回填与调试

可在支持的窗口对历史 Observation 执行补评分，查看 Evaluator Execution 的请求、输出及失败原因，并估算模型费用。

## 原文中的技术示例

以下保留源文档所有代码与配置块，以避免翻译程序标识符造成错误。

### 官方示例 1

```json
{
  "type": "boolean",
  "column": "isRootObservation",
  "operator": "=",
  "value": true
}
```

::: info 翻译状态
已完成核心章节中文说明并保留全部代码；原文部分深层细节、表格及动态 FAQ 仍待逐段翻译与复核。此页暂不计入“完整验收”文档。
:::

原文：[LLM-as-a-Judge 自动评估](https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge)。
