---
title: Pulse 异常峰值图
description: 在 Observation 表上方查看数量、成本和延迟峰值，并快速定位异常时间段。
---
# Pulse

Pulse 是位于 Observation 表格上方的一条紧凑图表带。每个柱条代表一个时间段，默认显示该时间段内的 Observation 数量，也可以显示总成本或 p95 延迟。要寻找异常峰值，只需查看突然变高的柱条，不必先给表格排序。点击或拖动柱条，就能把表格缩小到对应时间窗口。

[观看 Pulse 演示](https://static.langfuse.com/changelog-videos/2025-07-28-pulse.mp4)。

::: info
Pulse 依赖 [Langfuse v4](https://langfuse.com/docs/v4) 以 Observation 为中心的数据模型，位于主 Observation 表格上方。当表格限定为单个用户或 Session 时不会显示。自托管部署需要[升级到 Langfuse v4](https://langfuse.com/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4)。
:::

Pulse 在 Observation 表格上方持续可用。

## 每个柱条显示什么？

一个柱条对应一个**时间桶**，高度表示该时间桶中事件的某个聚合指标。较高的柱条对应高请求量、高成本或高延迟时间段。

柱条覆盖所选的完整时间范围。没有事件的时间桶会显示为基线上的间隙，而非被省略，因此低活动期呈现平坦的基线，峰值明显突出。

高度使用**平方根比例尺**：真实异常峰值可能达到基线的很多倍，线性比例尺会让其他柱条几乎看不见；平方根缩放能同时保留普通负载和异常峰值的可读性。

时间桶宽度会根据时间范围和图表可用宽度自动调整，最细一分钟、最粗一周。

悬停在柱条上会显示时间范围、指标值和事件数量。如果某个时间桶有事件，但没有当前指标值，会显示淡淡的活动刻度，避免误认为没有事件。如果时间范围内完全没有事件，显示 **No events in range**；存在事件但没有相应指标时，显示 **No [metric] data in range**。

## 指标模式

图表左侧的下拉菜单可以切换：

- **Count**：每个时间桶内的 Observation 数量，默认选项；
- **Cost**：每个时间桶的总成本；
- **Latency**：延迟，默认 p95，也可以在第二个菜单中选择中位数 p50。

指标和聚合方式的选择会在后续访问中保留。

## 定位异常时间段

- **点击柱条**：将表格时间范围缩小到该时间桶；
- **拖动多个柱条**：选择更长时间范围，松开后应用；
- **浏览器返回**：回到此前的时间范围。

点击空时间桶不会跳转。

触屏设备上，轻触或拖动会先展示固定的提示框，并提供 **Explore this window** 操作，不会立即更改范围，减少误触。

## 可继承的筛选器

Pulse 使用下方 Observation 表格的相同筛选查询，包括时间范围、侧边栏筛选项和[筛选搜索栏](https://langfuse.com/docs/observability/features/filter-search-bar)。

某些条件无法按时间聚合，因此不能应用到 Pulse：

- 以延迟、成本、Token 数值作为行筛选条件（但仍能将成本和延迟作为图表指标）；
- **Score、Metadata、Comment** 筛选；
- **全文搜索**及限定字段的 `input:`、`output:` 文本搜索；
- **存在性检查** `has:` 和 `-has:`。

启用这些条件时，Pulse 会禁用图表带，而不是显示与表格筛选不一致的聚合数据；表格本身仍照常应用全部筛选。

## Pulse 与表格图表的区别

Pulse 和[将表格转换成图表](/official/observability/features/events-table-charts)都使用 Observation 表的数据，但目的不同。

**Pulse** 是常驻表格上方的异常查找工具，每个时间桶一根柱条，点击即可深入对应时间段。**表格图表**会把整个表格切换成可配置的图表，可选择图表类型、指标、聚合和分组，还可保存到仪表盘。

需要快速定位峰值时用 Pulse；需要构造并保留分析视图时用表格图表。

## 相关资料

- [表格图表](/official/observability/features/events-table-charts)
- [筛选搜索栏](https://langfuse.com/docs/observability/features/filter-search-bar)

---

原文：[Pulse](https://langfuse.com/docs/observability/features/pulse) · 非官方中文翻译。
