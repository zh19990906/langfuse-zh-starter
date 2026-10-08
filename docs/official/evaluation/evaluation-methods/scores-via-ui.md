---
title: 通过 UI 手动评分
description: 在 Langfuse 界面中为 Trace、Session 和 Observation 添加人工评估分数。
---
# 通过 UI 手动评分

在 Langfuse UI 中添加[评分（Score）](/official/evaluation/scores/overview)是一种人工[评估方法](/official/evaluation/core-concepts)，用于协作标注 Trace、Session 和 Observation。

[观看手动评分演示](https://static.langfuse.com/docs-videos/2025-12-19-manual-scoring.mp4)。

::: info
如果需要审核大批量 Trace、Session 和 Observation，可以使用[标注队列](/official/evaluation/evaluation-methods/annotation-queues)，提高审核效率。
:::

## 为什么通过界面手动评分？

- 支持多位成员协作审核数据，结合不同专长提高准确性。
- 统一的 Score 配置与评分标准可确保不同流程、评分类型的标签一致。
- 人工标注建立质量基准，可用于比较其他自动评分，并从生产日志筛选高质量数据集。

## 配置步骤

### 1. 创建评分配置（Score Config）

要在界面中添加 Score，至少需要提前配置一种 Score Config。参阅[创建与管理评分配置](https://langfuse.com/faq/all/manage-score-configs)。

### 2. 添加评分

打开 Trace、Session 或 Observation 详情页面，点击 `Annotate`，打开标注表单。

![打开标注窗口](https://langfuse.com/images/docs/trigger_annotation.png)

### 3. 选择 Score Config

![选择评分配置](https://langfuse.com/images/docs/select_score_configs.png)

### 4. 填写分数

![设置分值](https://langfuse.com/images/docs/set_score_values.png)

### 5. 添加评分备注（可选）

![添加评分备注](https://langfuse.com/images/docs/scores_comment.png)

### 6. 查看评分

要查看新添加的评分，请进入 Trace 或 Observation 详情页面，点击 `Scores` 标签页。

![查看已创建的评分](https://langfuse.com/images/docs/see_created_scores.png)

## 给实验结果添加评分

运行 [UI 实验](/official/evaluation/experiments/experiments-via-ui)或 [SDK 实验](/official/evaluation/experiments/experiments-via-sdk)后，可直接在实验比较视图中标注结果。

::: info 前提条件
- 已为要评估的维度配置 [Score Config](https://langfuse.com/faq/all/manage-score-configs)。
- 已通过 UI 或 SDK 运行实验，并生成可供审核的结果。
:::

![在实验比较视图中标注](https://langfuse.com/images/changelog/2025-10-23-annotate-compare-view-overview.png)

比较视图在审核每个测试项时仍会保留完整实验上下文，包括输入、输出和自动评分。随着人工评分添加，汇总指标会同步更新，便于跟踪审核进度。

官方页面的 GitHub Discussions 为动态模块，静态中文版不复制该讨论列表。

---

原文：[Scores via UI](https://langfuse.com/docs/evaluation/evaluation-methods/scores-via-ui) · 非官方中文翻译。
