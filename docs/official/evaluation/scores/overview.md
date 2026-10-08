---
title: Score 评分概览
description: Langfuse 统一的评估数据对象、评分类型、创建方法与 Tag 的区别。
---
# Score（评分）

Score 是 Langfuse 存储评估结果的通用数据对象。无论质量判断来自[人工标注](/official/evaluation/evaluation-methods/scores-via-ui)、[LLM 裁判](/official/evaluation/evaluation-methods/llm-as-a-judge)、[程序化检查](/official/evaluation/evaluation-methods/scores-via-sdk)还是最终用户反馈，都保存为 Score。

每条 Score 都包含**名称**（例如 `correctness` 或 `helpfulness`）、**值**、**数据类型**，还可选填**评论**。Score 可关联 Trace、Observation、Session 或 Dataset Run，最常见的是对整次 Trace 交互评分。

Score 可用于[评分分析](/official/evaluation/scores/score-analytics)、[自定义仪表盘](/official/metrics/features/custom-dashboards)，也可以通过 [API](/official/api-and-data-platform/features/public-api)查询。

## 何时使用 Score？

当你不仅想观察“应用做了什么”，还要衡量“做得如何”时，就应使用 Score：

- **收集用户反馈**：记录点赞/点踩、星级评分，附加到 Trace。详见[用户反馈](/official/observability/features/user-feedback)。
- **监测生产质量**：使用 LLM-as-a-Judge 自动评估幻觉、相关性、语气等指标。
- **运行安全护栏**：评价 PII 检测、格式校验、内容安全策略是否通过。
- **比较实验结果**：更换提示词、模型或 Pipeline 后，对数据集运行实验并打分。

## Score 数据类型

| 类型 | 值 | 适用情况 |
| --- | --- | --- |
| `NUMERIC` | 浮点数，如 `0.9` | 准确性、相关性、相似度等连续评分 |
| `CATEGORICAL` | 预定义类别中的字符串，如 `correct` | 可能类别预先已知的离散分类 |
| `BOOLEAN` | `0` 或 `1` | 幻觉检测、格式校验等通过/失败判断 |
| `TEXT` | 1–500 字符的自由文本 | 审核备注和定性反馈，常用于[开放式编码](https://en.wikipedia.org/wiki/Open_coding)，再通过[轴心编码](https://en.wikipedia.org/wiki/Axial_coding)转为可量化分类 |

::: info
TEXT Score 用于开放式定性标注。由于自由文本无法有效聚合或比较，因此 **TEXT 不支持用于实验、LLM-as-a-Judge 和评分分析**。
:::

::: info BOOLEAN 的写入和读取格式
创建 Score 的示例常以数字 `0`/`1` 表示布尔结果；通过 **Scores API v3** 读取 `BOOLEAN` Score 时，`value` 返回的是 JSON 布尔值 `false`/`true`，不是数字。不要把写入示例与 v3 读取响应视为相同的数据类型契约。
:::

## 创建 Score 的五种方式

1. **LLM-as-a-Judge**：创建自动化评估器，按自定义标准对 Trace 或实验结果打数值/类别分，并可附带推理理由。参阅[LLM-as-a-Judge](/official/evaluation/evaluation-methods/llm-as-a-judge)。
2. **代码评估器**：在 Langfuse 中运行自定义 Python 或 TypeScript 评估器，实现精确匹配、JSON 校验和业务规则检查。[代码评估器](/official/evaluation/evaluation-methods/code-evaluators)。
3. **UI 手动评分**：团队成员直接在 Trace、Observation 或 Session 上打分，事先需要创建 Score Config。[UI 手动评分](/official/evaluation/evaluation-methods/scores-via-ui)。
4. **标注队列**：让审核者批量处理结构化审核任务。[标注队列](/official/evaluation/evaluation-methods/annotation-queues)。
5. **API / SDK 评分**：应用代码主动添加 Score，适用于点赞、星级、护栏结果与自定义评估流程。[SDK/API 评分](/official/evaluation/evaluation-methods/scores-via-sdk)。

## 选用 Score 还是 Tag？

| 对比 | Score | Tag |
| --- | --- | --- |
| 目的 | 衡量质量“好不好” | 描述对象“是什么” |
| 数据 | 数值、类别、布尔或文本 | 简单字符串 |
| 添加时机 | Trace 创建之后任意时间也可添加 | 追踪期间设置，创建后不能修改 |
| 用途 | 质量指标、分析、实验 | 筛选、细分、组织数据 |

一般来说，追踪时已经知道的类别（例如来源业务功能、API 端点）使用 [Tag](/official/observability/features/tags)；需要事后评价或分类的结果使用 Score。

## Score 评论

每条 Score 可附带 `comment`，用于记录 LLM 裁判为什么给出该分数、人工审核备注或背景说明。Langfuse UI 会将评论和 Score 一同显示。

如果要保存独立的定性反馈，应使用 [TEXT Score](#score-数据类型)，而不只是 Score 的评论字段；评论更适合作为已有评分的解释。

---

原文：[Scores Overview](/official/evaluation/scores/overview) · 非官方中文翻译。
