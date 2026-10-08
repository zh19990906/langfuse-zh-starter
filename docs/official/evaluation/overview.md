---
title: LLM 应用评估
description: 使用线上追踪、离线数据集、人工审核和自动评分持续改善应用质量。
---

# 评估概览

评估（Evals）可以对 LLM 应用的行为进行可重复的检查。你可以用数据代替猜测，在变更上线之前发现质量退化。

![Langfuse 评分分析仪表盘](https://langfuse.com/images/docs/score-analytics-full-dashboard.png)

评估贯穿 [AI 工程循环](https://langfuse.com/academy/ai-engineering-loop)：对生产环境的追踪记录评分，从实际案例创建数据集，运行实验比较变更，再通过人工或自动评估器判断结果。评估既可在生产环境对实时请求进行（**在线评估**），也可在发布之前进行（**离线评估**）。

[观看 Langfuse 评估功能演示](https://langfuse.com/watch-demo)。

## 开始使用

你可以评估两类对象：

- [实时接入的生产追踪](https://langfuse.com/docs/evaluation/get-started/online)：监控实际运行质量及其长期变化。
- [基于预定义数据集的现有应用](https://langfuse.com/docs/evaluation/get-started/offline)：在发布前确认改动是否达到要求。

关于评估器、评分、数据集和实验的关系，参阅[核心概念](https://langfuse.com/docs/evaluation/core-concepts)。

如果希望在上线之前拦截质量回退，可在 CI 中运行实验：把 [`langfuse/experiment-action`](https://langfuse.com/docs/evaluation/experiments/experiments-ci-cd) 加入 `pull_request` 工作流；当实验脚本发现分数低于阈值时抛出 `RegressionError`，即可让任务失败。该功能支持 Langfuse Cloud 和自托管版本。

## 常见需求与对应功能

| 想完成的任务 | 推荐功能 |
| --- | --- |
| 人工审核并评分 | [标注队列](https://langfuse.com/docs/evaluation/evaluation-methods/annotation-queues)、[UI 评分](https://langfuse.com/docs/evaluation/evaluation-methods/scores-via-ui) |
| 将实验答案交给 QA 团队 | [审核实验答案](https://langfuse.com/docs/evaluation/evaluation-methods/annotation-queues#review-experiment-answers)、[分享比较结果](https://langfuse.com/docs/evaluation/experiments/compare-experiments#share-results) |
| 收集真实用户反馈 | [用户反馈](https://langfuse.com/docs/observability/features/user-feedback) |
| 给追踪记录添加文字意见 | [文本评分](https://langfuse.com/docs/evaluation/scores/overview#score-types)、[标注队列](https://langfuse.com/docs/evaluation/evaluation-methods/annotation-queues) |
| 构建可复用的测试集 | [数据集](https://langfuse.com/docs/evaluation/experiments/datasets) |
| 并排比较提示词、模型和代码变更 | [界面实验](https://langfuse.com/docs/evaluation/experiments/experiments-via-ui)、[SDK 实验](https://langfuse.com/docs/evaluation/experiments/experiments-via-sdk) |
| 质量回退时阻止部署 | [CI/CD 实验](https://langfuse.com/docs/evaluation/experiments/experiments-ci-cd) |
| 复用应用与 CI 中的质量检查 | [评估现有应用](https://langfuse.com/resources/engineering/evaluate-existing-application) |
| 运行确定性检查 | [代码评估器](https://langfuse.com/docs/evaluation/evaluation-methods/code-evaluators) |
| 自动评估在线生产追踪 | [LLM-as-a-Judge](https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge)、[决策模型评估器](https://langfuse.com/docs/evaluation/evaluation-methods/decision-models)、[API/SDK 评分](https://langfuse.com/docs/evaluation/evaluation-methods/scores-via-sdk) |
| 检验 AI 裁判与人工标注是否一致 | [裁判模型校准](https://langfuse.com/guides/llm-as-a-judge-calibration-skill)、[评分分析](https://langfuse.com/docs/evaluation/scores/score-analytics#human-vs-ai-annotation-agreement) |
| 查看分数随时间的变化 | [评分分析](https://langfuse.com/docs/evaluation/scores/score-analytics)、[自定义仪表盘](https://langfuse.com/docs/metrics/features/custom-dashboards) |

你也可以浏览官方文档中的 *Evaluation Methods* 和 *Experiments* 分类，了解更多功能。

---

原文：[Evaluation Overview](https://langfuse.com/docs/evaluation/overview) · 非官方中文翻译
