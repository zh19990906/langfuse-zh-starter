---
title: 评估核心概念
description: 理解 Score、评估器、规则、在线评估、批量评估及实验。
---
# 评估核心概念

本文介绍 Langfuse 的评估概念与具体能力。如果还没决定**评估什么**，可学习 [如何选择评估目标](https://langfuse.com/academy/evaluate/choosing-what-to-evaluate)与[如何编写可靠的评估器](https://langfuse.com/academy/evaluate/writing-evaluators)。

从这些任务开始：

- [为生产 Trace 配置在线评估](/official/evaluation/get-started/online)
- [创建 Dataset](/official/evaluation/experiments/datasets)，持续衡量应用表现
- [运行实验](#experiments)，了解应用整体性能
- [配置 LLM-as-a-Judge](/official/evaluation/evaluation-methods/llm-as-a-judge)
- [使用 Decision Model](/official/evaluation/evaluation-methods/decision-models)得到类型化判断
- [创建代码评估器](/official/evaluation/evaluation-methods/code-evaluators)执行确定性检查

## 评估循环

LLM 应用通常需要持续[测试与监控](https://langfuse.com/academy/ai-engineering-loop)。

**离线评估**在部署前用固定数据集测试新 Prompt 或模型，查看 Score、不断迭代，确认效果后再部署。Langfuse 中通过 Experiment 完成。

**在线评估**对实时 Trace 评分，发现真实流量中的问题。当生产环境出现数据集未覆盖的边界案例时，将其加入 Dataset，让之后的离线实验也能发现问题。

**示例：客服机器人改进流程**

1. 调整 Prompt，让回答不那么正式。
2. 部署前对客户问题 Dataset 运行实验（离线评估）。
3. 检查 Score 和 Output，发现语气改善，但回答过长且遗漏重要链接。
4. 再次修改 Prompt 并运行实验。
5. 确认结果达到预期后，部署到生产。
6. 通过在线评估监控新问题。
7. 发现法语提问收到英文答复。
8. 将法语问题加入 Dataset。
9. 增加法语支持，再运行一次实验。

随着时间推移，Dataset 从少量例子不断增长为多样化、具有代表性的真实测试案例集。

## Score

[Score](/official/evaluation/scores/overview)是 Langfuse 存储评估结果的通用对象，人工标注、LLM 裁判、程序检查与用户反馈的评价结果均使用 Score 保存。

Score 可关联 Trace、Observation、Session 或 Dataset Run，包含**名称、值和数据类型**：`NUMERIC`、`CATEGORICAL`、`BOOLEAN`、`TEXT`。详见[数据类型](/official/evaluation/scores/overview#score-数据类型)、[创建方法](/official/evaluation/scores/overview)与 [Score Analytics](/official/evaluation/scores/score-analytics)。

## 评估方式

| 方式 | 用途 | 适合场景 |
| --- | --- | --- |
| [LLM-as-a-Judge](/official/evaluation/evaluation-methods/llm-as-a-judge) | 使用 LLM 按自定义标准判断输出 | 大规模主观质量评估，如语气、准确性、帮助程度 |
| [Decision Model](/official/evaluation/evaluation-methods/decision-models) | TypeSafe Jev 或 OpenAI 回答类型化问题 | 分类、评分等级、是/否判断 |
| [代码评估器](/official/evaluation/evaluation-methods/code-evaluators) | 自定义 Python/TypeScript 程序 | 确定性规则、结构化输出验证、业务检查 |
| [UI 评分](/official/evaluation/evaluation-methods/scores-via-ui) | 手动对 Trace 增加 Score | 快速抽查、审阅单条 Trace |
| [标注队列](/official/evaluation/evaluation-methods/annotation-queues) | 结构化人工审核 | 构建 Ground Truth、系统标注、团队协作 |
| [API/SDK 评分](/official/evaluation/evaluation-methods/scores-via-sdk) | 应用通过代码写入 Score | 自定义 Pipeline、自动化流程 |

引入新评估器后，可通过 [Score Analytics](/official/evaluation/scores/score-analytics)判断评分分布和可信度。

## 在线评估

配置规则筛选新到达的生产 Observation。规则触发与其关联的评估器，后者对 Observation 评分，从而发现真实流量中的问题。[生产流量评估指南](/official/evaluation/get-started/online)提供 UI 操作步骤。

### Evaluator 和 Rule

**Evaluator** 定义“如何评分”，可复用于批量评估（历史 Observation）、在线评估（挂到 Rule）以及 Prompt 实验。

**Rule** 定义“哪些新 Observation 需要评分”，包含筛选条件、采样率和一个或多个 Evaluator。

一个 Evaluator 可以复用于多个 Rule。对 LLM-as-a-Judge，Langfuse 会针对符合 Rule 的 Observation 检查默认变量映射；若某个 Rule 的数据结构不同，可单独覆盖映射。

### 对历史 Observation 运行 Evaluator

保存 Evaluator 时，可启用 **Also run on past observations**，对符合规则的既有数据进行补评分。可以选择预设或自定义时间段，**最多六个月、25,000 条 Observation**。执行前应核对 LLM 费用预估。

只想一次性评分 Trace 表中选出的 Observation，可以使用[批量评估](#批量评估)。

### 监控 Evaluator 结果

使用[自定义仪表盘](/official/metrics/features/custom-dashboards)追踪评分和业务性能。想在某个 Evaluator 的成本或分数越过阈值时收到通知，打开该 Evaluator，点击 **Add alert**。

可创建的预填告警：

- **Score 阈值**：数值与布尔输出默认监控**一天的平均分**；类别输出监控**一天的评分数量**。对于代码评估器，使用第一个声明的数值、布尔或类别输出；如果第一个输出为文本 Score，则没有快速告警入口。
- **Cost 阈值**：可针对单个 LLM-as-a-Judge Evaluator；在 Evaluators 页面点击 Add alert，可以监控**全部 Evaluator 的合计成本**。

Langfuse 会自动填入指标、评估器筛选和 Tag，并排除测试运行。保存前仍应检查阈值、时间窗口和通知等配置。

Add alert 菜单还能显示最多 **20 条**已关联告警，以及当前等级、触发条件和最近触发时间。可点击查看或使用 **See all alerts** 打开筛选后的告警表。详见[告警指南](/official/observability/features/alerts)。

## 批量评估

批量评估用于对已摄入的**选定历史 Observation**打分，适合用既有生产数据测试新建或修改后的 Evaluator。

使用 LLM-as-a-Judge 进行批量评估，应先为 Evaluator 启用 [Langfuse v4 Preview](/official/v4)。若希望同一 Evaluator 实时评分新数据，需要 Python SDK **≥4.7.0** 或 JS/TS SDK **≥5.4.0**。直接通过 OTEL 摄入时，需要在 Span Exporter 中设置 `x-langfuse-ingestion-version: 4`。

操作：

1. 打开 Traces 表。
2. 筛选目标时间范围及 Trace 条件。
3. 选择匹配记录。
4. 点击 **Actions → Evaluate**。
5. 选择 Evaluator 并执行。

![批量评估筛选](https://langfuse.com/images/docs/llm-as-a-judge/observation-backfill.png)

Score 会关联到所选 Trace 内匹配的 Observation。

## Experiments

Experiment 对 Dataset 执行应用任务并评估输出，适合在发布前测试更改。

### 对象定义

| 对象 | 含义 |
| --- | --- |
| Dataset | 测试案例集合，由多个 DatasetItem 组成，可用于多次实验 |
| DatasetItem | 一个输入场景，可选包含 Expected Output |
| Task | 每个 DatasetItem 会执行的应用代码，其输出将被评价 |
| Evaluation Method | 给实验输出评分的函数，包括 Code Evaluator、API/SDK Score、LLM-as-a-Judge |
| Score | 评估函数的输出，支持多种数据类型 |
| Experiment Run | 在所有 DatasetItem 上执行一次 Task，产生对应输出与 Score |

更多信息见[实验数据模型](/official/evaluation/experiments/data-model)。

### 对象如何协作？

当你在某个 Dataset 上运行 Experiment 时，每个 DatasetItem 都作为输入送入用户定义的 Task 函数（通常是待测试的应用 LLM 调用），得到各自的输出。这就是 Experiment Run。输入项与其输出的关联记录构成实验结果。

之后可用评估函数把 DatasetItem 和 Task 输出作为输入，按照自定义标准生成 Score。这些 Score 让团队从所有测试样本的角度衡量应用整体表现。

![Experiment 流程图](https://langfuse.com/images/docs/evaluation/experiments-flow.jpg)

还可以比较多个实验，验证新 Prompt 是否提高 Score，或者找出应用不擅长的具体输入，从而决定是否准备好进入生产。

### 运行实验的三种方式

**SDK 实验**：在 Python 或 JS/TS 应用里以代码运行，完全控制 Task、评估逻辑与运行时环境。

**UI 实验**：从 Dataset 页面选择 Prompt 和版本，在 Langfuse 中直接运行，适合快速迭代而无需额外开发。

**OpenTelemetry 实验**：已经通过 OTEL 上报 Trace，但未使用 Python/JS SDK 时，可在 Span 上设置实验属性，让 Langfuse 将其识别为 Experiment Run。

| Dataset 来源 | Langfuse 平台执行 | 本地/CI 执行 |
| --- | --- | --- |
| Langfuse Dataset | [通过 UI 运行](/official/evaluation/experiments/experiments-via-ui) | [通过 SDK](/official/evaluation/experiments/experiments-via-sdk)或 [OTEL](/official/evaluation/experiments/experiments-via-opentelemetry) |
| Local Dataset | 不支持 | 通过 SDK 或 OTEL |

虽然可以使用本地 Dataset，但通常建议在 Langfuse 托管测试集，因为这支持同一数据集的多次实验在 UI 中并排比较，也便于根据生产/测试 Trace 持续完善案例集。

---

原文：[Evaluation Core Concepts](https://langfuse.com/docs/evaluation/core-concepts) · 非官方中文翻译。
