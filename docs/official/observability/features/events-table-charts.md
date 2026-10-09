---
title: 将表格转换成图表
description: 使用相同筛选条件将 Observation 表格切换为图表，并保存到仪表盘。
---
# 将表格转换成图表

Observation 表格工具栏提供 **Table | Chart** 开关。切换到 **Chart** 后，当前经过筛选的行就会按照同一查询绘制成图表；切回 **Table**，仍然展示相同的数据，只是变回列表。筛选条件和时间范围不变。

当前视图及图表类型、指标、聚合方式和分组都会保存在 URL 中，因此可分享链接并重现相同的图表与筛选条件。只有不同于默认值的配置才会写入 URL，避免链接过长。

如果你只想快速找异常峰值，可以使用 [Pulse](/official/observability/features/pulse)，它是表格上方的紧凑图表，不需要替换整张表格。

::: info
图表视图基于 [Langfuse v4](/official/v4) 数据模型。在 Langfuse Cloud 中需要启用 v4 预览；自托管环境需要[升级到 v4](https://langfuse.com/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4)。
:::

## Visualize 面板

切换到 Chart 后，**Visualize** 面板控制图表展示方式。它由四类选择组成，还会显示当前配置的自然语言摘要，例如“按模型统计延迟均值随时间的变化”。

### 图表类型

- **Line、Area、Bars**：按时间显示数值；
- **Ranked**：按照数值从高到低水平排列分组；
- **Pie**：显示不同分组在整体中的占比；
- **Number**：在整个时间范围内显示一个数值，不使用分组。

Ranked 与 Pie 是类别图表，显示所选分组的主要取值。

### 指标

可选择 **Count**（记录数量）、**Latency**（延迟）、**Cost**（成本）和 **Tokens**（Token 数），默认为 Count。

### 聚合方式

| 指标 | 可用聚合 |
| --- | --- |
| Count | Count |
| Latency | Average、Median（p50）、p95、p99、Max、Min |
| Cost | Sum、Average、p95、Max |
| Tokens | Sum、Average、p95、Max |

切换指标时，会自动将聚合方式重置为该指标支持的选项。

### 分组（Breakdown）

可以选择 **Total（不分组）**、**Model**、**Name**、**Level**、**Type** 或 **Environment**。每个分组值在图表中形成独立的曲线、柱条或扇区。

例如选择 Line + Latency + p95 + Model，就是“各模型 p95 延迟随时间的变化”。保持其他设置不变，改为 Count 就可以查看各模型请求数量。

时间桶根据所选时间范围自动调整。如果时间范围太短、不足以生成图表，Langfuse 会建议扩大时间范围。

## 无法应用的筛选条件

图表沿用表格的大多数筛选器，包括环境、类型、名称、级别、模型、Trace 名称、用户、Session、版本、提示词名称、标签、工具名称和实验字段。

以下条件不能直接用于聚合时间序列：

- 按延迟、成本或 Token 数量筛选行；它们仍可作为图表指标；
- Score、Metadata 和 Comment 筛选；
- 全文搜索及 `input:`、`output:` 字段文本搜索；
- `has:` 与 `-has:` 存在性筛选。

图表不会悄悄忽略这些条件：不兼容的侧边栏项会变暗，搜索栏对应条件会变暗并加删除线。悬停可看到解释：该条件仍作用于表格，但不作用于图表。图表仍然可见，同时明确告诉你哪些筛选参与了聚合。

## 添加到仪表盘

点击 **Add to dashboard**，可以把当前图表及其类型、指标、聚合、分组、适用筛选条件保存为[自定义仪表盘](https://langfuse.com/docs/metrics/features/custom-dashboards)中的组件。

选择目标仪表盘后，Langfuse 会创建组件并跳转到仪表盘以便摆放。它与手工创建的仪表盘组件没有区别，呈现相同指标值。

**图表的时间范围不会随组件保存**，而是使用所属仪表盘的时间范围。添加图表要求具备项目中编辑仪表盘的权限。

## 与筛选搜索栏的关系

[筛选搜索栏](https://langfuse.com/docs/observability/features/filter-search-bar)用于选择要看的数据子集，图表用于展示该子集的趋势。先输入筛选条件，再切到 Chart，最后按需保存至仪表盘。

官方页面的实时 GitHub 讨论组件未复制。

---

原文：[Chart Any Table](https://langfuse.com/docs/observability/features/events-table-charts) · 非官方中文翻译。
