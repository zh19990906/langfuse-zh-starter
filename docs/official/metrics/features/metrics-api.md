---
title: Metrics API
description: 从 Langfuse 查询自定义指标，构建分析报表和监控系统。
---
# Metrics API

```http
GET /api/public/v2/metrics
```

**Metrics API** 能从 Langfuse 数据中获取自定义分析结果。可以指定维度、指标、筛选条件和时间粒度，为 LLM 应用构建报表与仪表盘。

## 能做什么？

- 聚合成本、Token 使用量、请求量、延迟和评分；
- 按模型或 Trace 属性等维度分组；
- 筛选数据并分析随时间变化的趋势；
- 支持自定义报表、仪表盘、计费和监控工作流。

支持的视图、字段、查询参数、响应 Schema 与交互示例请参阅 [Metrics API v2 Reference](https://api.reference.langfuse.com/#tag/metricsv2/GET/api/public/v2/metrics)；Python 实践可参考 [Metrics API v2 Cookbook](https://langfuse.com/guides/cookbook/example_metrics_api_v2)。

::: info
旧版 `GET /api/public/metrics` 与 `GET /api/public/metrics/daily` 已弃用。参阅[弃用 API 迁移说明](https://langfuse.com/faq/all/deprecated-api-migration)。
:::

## Metrics API v2

官方支持 Hobby、Core、Pro、Enterprise 及自托管 v4。自托管 v3 使用 [Metrics API v1](https://langfuse.com/faq/all/deprecated-api-migration#metrics-v1)；查看[自托管版本兼容矩阵](https://langfuse.com/self-hosting/upgrade/versioning#sdk-server)。

```http
GET /api/public/v2/metrics
```

v2 采用基于宽 Observation 表的优化数据架构，减少每次查询的数据库工作量，因此性能明显改善。

### 与 v1 的重要变化

**v2 不再提供 `traces` 视图。** 请改用功能更强、性能更好的 `observations` 视图。

### 支持的视图

| 视图 | 用途 |
| --- | --- |
| `observations` | 查询 Observation 级别数据，并可选择聚合 Trace 级别信息 |
| `scores-numeric` | 查询数值评分 |
| `scores-categorical` | 查询类别（字符串）评分 |
| `scores-boolean` | 查询布尔评分，可按 `booleanValue` 分组或筛选，也可计算 `value` 平均值得到 True 比率 |

::: info Score BOOLEAN 与 Metrics 聚合
Metrics v2 的 `scores-boolean` 视图提供 `booleanValue` 用于分组和筛选，并能对数值化的 `value` 做平均计算 True 比率。此处的指标聚合字段语义不同于 Scores API v3 返回的 JSON 布尔 `value`；集成时请按各端点的 Schema 单独解析。
:::

### 返回行数限制

默认 `config.row_limit` 为 **100 行/查询**。可以手动覆盖，最大 **1,000 行**。

### 高基数维度

`id`、`traceId`、`userId` 和 `sessionId` 不能用于 v2 指标分组，因为其基数太高，代价大且通常没有必要。但仍可以作为**筛选条件**。

### 逻辑根 Observation

v2 特有的 `isRootObservation` 布尔维度用于标记应用入口。

`true` 不仅包含没有父节点的顶层根节点，也包括父节点因 SDK 过滤而未导出的应用根节点。这让你可以正确统计、筛选和分组应用入口。

例如：

```json
[
  {
    "column": "isRootObservation",
    "operator": "=",
    "value": true,
    "type": "boolean"
  }
]
```

关于物理根节点和逻辑根节点的区别，参阅[逻辑根 Observation](/official/api-and-data-platform/features/public-api)。

### 按指标排序

按聚合指标排序时，使用响应字段名 `{aggregation}_{measure}`；例如 `{ "measure": "totalCost", "aggregation": "sum" }` 对应 `sum_totalCost`。按时间维度排序使用 `time_dimension`。

### 示例：查询成本最高的模型

```bash
curl \
  -H "Authorization: Basic <BASIC AUTH HEADER>" \
  -G \
  --data-urlencode 'query={
    "view": "observations",
    "metrics": [{"measure": "totalCost", "aggregation": "sum"}],
    "dimensions": [{"field": "providedModelName"}],
    "filters": [],
    "fromTimestamp": "2025-12-01T00:00:00Z",
    "toTimestamp": "2025-12-16T00:00:00Z",
    "orderBy": [{"field": "sum_totalCost", "direction": "desc"}],
    "config": {"row_limit": 1000}
  }' \
  https://cloud.langfuse.com/api/public/v2/metrics
```

::: info 数据新鲜度
官方页面通过动态组件展示数据延迟说明，本站不复制实时状态。应以[原文 Metrics API](/official/metrics/features/metrics-api)为准。
:::

---

原文：[Metrics API](/official/metrics/features/metrics-api) · 非官方中文翻译。
