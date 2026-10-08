---
title: 比较实验
description: 通过基线对比、逐项审查和 CI 门禁判断模型与提示词变更是否可以发布。
---
# 比较实验

比较实验运行结果，判断提示词、模型、检索流程或代码变更是否可以上线。先检查整体评分，再查看质量下降的案例，并打开相应 Trace 调查原因。

实验可以使用 Langfuse 数据集或本地数据。参阅[评估现有应用](https://langfuse.com/resources/engineering/evaluate-existing-application)，在 Python 或 TypeScript 中生成可比的两次运行，也可以使用[示例项目](https://langfuse.com/docs/demo)。

## 选择可比较的运行

打开 [Experiments](https://cloud.langfuse.com/project/~/experiments)，选中需要比较的运行并进入比较视图。应选择已经审查并批准的发布版本作为基线。

![选择多个实验运行](https://langfuse.com/images/docs/experiment-comparison-selection.png)

对发布决策，应让基线与候选版本使用同一数据集版本和相同评估器定义，并在元数据中记录应用提交、提示词/模型版本及评估器版本。固定数据集并不代表模型输出具有确定性。

不同来源的实验也能比较，但必须先确认测试项代表相同输入与预期输出。**缺失的测试项不能当作通过。** 本地测试数据应保留案例 ID，以便 CI 精确匹配。

在分析结果前先确定[发布规则](https://langfuse.com/docs/evaluation/experiments/experiments-ci-cd#release-policy)：是否要求所有必需案例通过？还是不允许已批准通过的案例回退？已知失败需要明确接受，新运行不能自动成为批准基线。

## 检查评分与输出

比较 Score、成本与延迟，识别权衡。平均质量提升可能掩盖关键案例退化。

| 案例 | 基线 | 候选 | 决策 |
| --- | --- | --- | --- |
| 常规退款政策 | 通过 | 失败 | 调查质量回退 |
| 特价商品退款政策 | 失败 | 通过 | 检查改进 |

这两次运行的准确率都是 50%，仅看平均数无法判断候选版本能否安全上线。

在比较视图用评分阈值缩小范围，然后并排检查基线与候选输出，并对照评估器给出的理由。如果评估器运行失败或没有返回结果，应先解决这些问题，再把比较视为完成。

![实验比较视图](https://langfuse.com/images/docs/experiment-comparison.png)

## 调查和审核失败

打开失败项的 Trace，检查应用输出及中间检索结果、模型调用和工具调用。例如退款期限错误可能来自过时的检索文档，也可能是模型忽略了正确政策。

![在比较表旁打开实验项 Trace](https://langfuse.com/images/docs/experiment-comparison-peek-view.png)

要区分**应用问题**与**评估器误判**：合理的改写可能不满足字符串匹配，而表达流畅的答案仍可能含有未经支持的事实。使用[人工评分](/official/evaluation/evaluation-methods/scores-via-ui)记录审核结果及原因；多人协作时使用[标注队列](/official/evaluation/evaluation-methods/annotation-queues)。

如果审核后修改评估器，需要用相同的新定义重新评估两个版本。保留原始实验元数据，以便复现决策。

## 与审核者分享结果

通过[组织邀请和角色权限](https://langfuse.com/docs/administration/rbac)给审核者开通项目访问。**Viewer** 可以查看结果；**Member** 可以添加评分与评论。仅发送链接不会自动授予权限。

分享时提供基线和候选运行名称、版本标识、需要审核的案例及发布规则，并注明筛选条件，让审核者能复现比较。

如果由 QA 团队审核答案，可以把相应实验项的 Observation 添加到[标注队列](https://langfuse.com/docs/evaluation/evaluation-methods/annotation-queues#review-experiment-answers)，并提供必要的来源材料与参考答案。审核者无需执行代码即可评分、解释失败原因并给出纠正建议。

## 将决策转化为 CI 规则

显式批准基线并记录其 ID、数据集与评估器版本。不要把每个成功的候选运行自动替换为新基线。有效的 CI 策略通常同时检查最低整体评分、关键案例是否新出现失败、结果是否完整。

参阅[实验 CI/CD](https://langfuse.com/docs/evaluation/experiments/experiments-ci-cd#approved-baseline)的示例。基线批准与门禁规则属于你的代码仓库；在 UI 中选择基线并不会自动配置 CI 门禁。

---

原文：[Compare Experiments](https://langfuse.com/docs/evaluation/experiments/compare-experiments) · 非官方中文翻译。
