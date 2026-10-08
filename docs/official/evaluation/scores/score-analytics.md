---
title: Score Analytics
description: 分析 Score 分布、时间趋势以及不同评估器或人工评分的一致性。
---
# Score Analytics

Score Analytics 无需额外配置即可分析评估数据。不论是验证不同 LLM 裁判的一致性、比较人工与自动评分，还是探索分布和趋势，都能帮助团队提高评估的可信度。

[观看功能演示](https://www.youtube.com/watch?v=HSpayZnwHdw)。

## 为什么使用？

- **轻量配置**：Score 摄入后无需配置即可分析。
- **快速验证**：比较不同来源（如 GPT-4 与 Gemini 裁判）的评分一致性。
- **开箱即用**：无需自定义 Dashboard，即可查看分布、趋势和相关性。
- **统计指标**：内置 Pearson 相关系数、Cohen's Kappa、F1 等指标及说明。

复杂自定义指标或多路分析可使用[实验 SDK](/official/evaluation/overview)进一步研究。

## 快速开始

### 准备数据

确保项目已通过任意方式创建 [Score](/official/evaluation/scores/overview)，例如人工标注、LLM-as-a-Judge、代码评估器，或 SDK/API 自定义评分。

### 进入 Score Analytics

1. 打开 Langfuse 项目。
2. 左侧导航点击 **Scores**。
3. 选择 **Analytics**。

### 分析单个 Score

1. 在第一个下拉菜单中选择 Score。
2. 指定对象类型：Trace、Observation、Session 或 Dataset Run Item。
3. 用日期选择器指定区间，例如过去 90 天。
4. 查看 Statistics：总数、均值/众数、标准差。
5. 查看 Distribution 图表的数值分布。
6. 查看 Trend Over Time 时间趋势。

![单 Score 分析](https://langfuse.com/images/docs/score-analytics-boolean-single.png)

### 比较两个 Score

1. 在第二个下拉菜单中选择**相同数据类型**的 Score。
2. 检查 Statistics：
   - 匹配对数（两种评分是否属于同一个父对象）；
   - Pearson、Spearman 相关性；
   - 数值评分 MAE、RMSE 误差；
   - 类别和布尔评分 Cohen's Kappa、F1、总体一致率。
3. 检查 Heatmap：主对角线聚集表示一致性高，反对角线聚集表示负相关，散点表示一致性低。
4. 对比 Matched 和 All 选项卡中的分布。
5. 查看二者随时间是否同步变化。

![布尔 Score 对比](https://langfuse.com/images/docs/score-analytics-boolean-compare.png)

## 主要功能

### 按数据类型适配图表

::: info
自由文本型 [TEXT Score](/official/evaluation/scores/overview) 不支持 Score Analytics，因为自由文本无法有效聚合或比较。
:::

| Score 类型 | 分布视图 | 两个 Score 对比 | 指标 |
| --- | --- | --- | --- |
| 数值 | 10 个区间的直方图 | 10×10 Heatmap | Pearson、Spearman、MAE、RMSE |
| 类别 | 每类数量柱状图 | N×M 混淆矩阵 | Cohen's Kappa、F1、总体一致率 |
| 布尔 | 两类柱状图 | 2×2 混淆矩阵 | Cohen's Kappa、F1、总体一致率 |

### Matched 与 All 数据

**Matched（默认）**：只显示同时拥有两种 Score 的父对象。只有 Score 指向**相同父对象**（Trace、Observation、Session 或 Dataset Run Item）才形成一对，用于有意义的相关性和一致性比较。

**All**：分别展示每个 Score 的完整分布，可衡量覆盖范围（多少父对象实际有该 Score），发现评估采样缺口。

### 时间趋势

- 自定义区间：5 分、30 分、1 小时、3 小时、1 天、7 天、30 天、90 天、1 年；
- 根据日期范围自动选择推荐粒度；
- 缺失的时间区间以 0 补齐，使图表时间轴连续；
- 副标题显示当前范围总体均值。

### 统计指标解释

**Pearson 相关系数**：衡量数值评分之间的线性相关关系，范围 **-1 到 1**（-1 完全负相关，1 完全正相关）。

| 绝对相关系数范围 | 原文解释 |
| --- | --- |
| 0.9–1.0 | Very Strong（非常强） |
| 0.7–0.9 | Strong（强） |
| 0.5–0.7 | Moderate（中等） |
| 低于 0.5 | Weak（弱） |

**Spearman 相关系数**：衡量单调、基于秩次的相关性，较 Pearson 更能抵御离群值。

**MAE（平均绝对误差）**：两个评分绝对差值的均值，越小越好。

**RMSE（均方根误差）**：差值平方均值的平方根，比 MAE 对大误差惩罚更重。

**Cohen's Kappa**：扣除随机一致性后的分类一致度，范围 **-1 到 1**。

| Kappa 范围 | 原文解释 |
| --- | --- |
| 0.81–1.00 | Almost Perfect（近乎完全一致） |
| 0.61–0.80 | Substantial（高度一致） |
| 0.41–0.60 | Moderate（中等一致） |
| 低于 0.41 | Fair to Slight（有限一致） |

**F1**：Precision 与 Recall 的调和平均，范围 0 到 1，越高越好。

**Overall Agreement**：分类完全相同的百分比，**没有**扣除偶然一致的影响。

## 使用场景

### 验证 LLM 裁判可靠性

场景：GPT-4 和 Gemini 都对 Helpfulness 评分，想知道结果是否一致。

1. Score 1 选 `helpfulness_gpt4-NUMERIC-EVAL`。
2. Score 2 选 `helpfulness_gemini-NUMERIC-EVAL`。
3. 统计卡显示 Pearson **0.984**，属于 Very Strong。
4. 热力图主对角线明显。
5. 结论：这两个裁判在该示例数据上有较高一致性。

### 人工与 AI 标注是否一致？

1. Score 1 选 `quality-CATEGORICAL-ANNOTATION`。
2. Score 2 选 `quality-CATEGORICAL-EVAL`。
3. 混淆矩阵主对角线集中表示一致。
4. 示例 Kappa 为 **0.85**，属于 Almost Perfect。
5. 说明示例中 AI 与人工判断高度一致。

如果一致性低，应依据人工标注的例子[校准裁判提示词](https://langfuse.com/guides/llm-as-a-judge-calibration-skill)，再比较 Score。人工评分可通过[标注队列](/official/evaluation/evaluation-methods/annotation-queues)录入。

### 识别负相关

比较 `has_tool_use-BOOLEAN-EVAL` 与 `has_hallucination-BOOLEAN-EVAL`。如果混淆矩阵集中于反对角线，可能说明 Agent 使用工具时幻觉更少，需要进一步核查因果关系。

### 评估覆盖率

比较 Distribution 的 All 与 Matched：原文示例中单项 Score 1 有 **1143** 条，而配对成功仅 **567** 条，表明约一半父对象同时拥有两个评分。

### 发现质量回退

选择质量 Score，将时间范围设为覆盖部署前后，检查 Trend Over Time 是否出现明显下降，再调查根因。

## 当前限制

::: warning
**Beta 功能**。当前约束：

- 每次最多比较 **两个 Score**，多路分析需要两两比较。
- 只支持同类型 Score 的比较。
- 预计任一 Score 查询超过 **100,000** 条时，为性能会自动启用近似随机采样；界面显示采样指示。需要完整数据可缩小时间或对象类型范围。
:::

## 最佳实践

**选择 Score：**只能对比同一数据类型；不同评分量纲可以计算相关性，但 MAE、RMSE 会受量纲影响；应选取衡量相似维度的 Score。

**解读 Heatmap：**主对角线集中表示一致，反对角线表示负相关，散点表示弱相关或噪声，单元格颜色越深通常代表样本数量越多。

**Matched 的含义：**每个 Score 总是关联到一个父对象；只有属于同一父对象才匹配。若匹配数量明显少于单独数量，通常说明覆盖率不足；一些评估方案本来就只标注边界案例。

## 相关资料

- [校准 LLM 裁判](https://langfuse.com/guides/llm-as-a-judge-calibration-skill)
- [自定义 Dashboard](https://langfuse.com/docs/metrics/features/custom-dashboards)
- [Metrics API](/official/metrics/features/metrics-api)

动态 GitHub Discussions 未迁移。

---

原文：[Score Analytics](https://langfuse.com/docs/evaluation/scores/score-analytics) · 非官方中文翻译。
