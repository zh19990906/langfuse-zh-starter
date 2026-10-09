---
title: 全文搜索
description: 在 Trace 和 Observation 的输入、输出与元数据中查找关键词和短语。
---
# 全文搜索

全文搜索可以在 Trace 和 Observation 的输入、输出与元数据中查找特定关键词或短语。当你记得某段内容，却不记得它属于哪条 Trace 时，这一功能尤其适合调试复杂应用。

[观看功能演示](https://static.langfuse.com/docs-videos/full-text-search-launch.mp4)。

## 在界面中搜索

使用 Trace 和 Observation 表格上方的搜索栏，可搜索 `input` 与 `output` 内容。匹配的结果会返回到表格中，还可以与已有筛选条件和时间范围组合使用。

在 v4 版 Observation 与 Trace 表格中，也能通过[筛选搜索栏](/official/observability/features/filter-search-bar)直接使用全文搜索，并与 `level:ERROR`、`latency:>2` 等结构化条件组合。

## 性能

该功能基于 [ClickHouse 全文搜索](https://clickhouse.com/docs/engines/table-engines/mergetree-family/textindexes)。文本索引能在读取完整 Observation 数据之前跳过不可能匹配的记录，因此即使项目具有大量 Trace，也可以保持较好的搜索速度。详见 [ClickHouse 正式版公告](https://clickhouse.com/blog/full-text-search-ga-release)。

索引采用 Token 匹配：搜索的是完整单词，而不是其中的子字符串。比如 `error` 能匹配 `error`，但不能匹配 `errors`；多词查询需要匹配连续的短语。

## 通过 API 搜索

[Observations API v2](/official/api-and-data-platform/features/public-api)支持 `matches` 运算符，对 `input`、`output` 及字符串类型的 `metadata` 执行基于 Token 的全文搜索。

使用 `/api/public/v2/observations` 构建筛选条件时：已知精确值时优先使用 `=`，需要 Token 搜索时使用 `matches`。

- 对 `input` 和 `output`，`matches` **不区分大小写**，如 `refund failed` 可匹配 `Refund Failed`。
- 对元数据，`matches` **区分大小写**，作用于所选元数据键的字符串值。
- `input`、`output` 不支持 `contains`、`starts with`、`ends with` 等子字符串运算符；这种请求会返回 HTTP `400`，因为它们需要进行缓慢的全文扫描。

### 搜索 Observation 输出的示例

```json
[
  {
    "type": "string",
    "column": "output",
    "operator": "matches",
    "value": "refund failed"
  }
]
```

### 精确匹配元数据的示例

```json
[
  {
    "type": "stringObject",
    "column": "metadata",
    "key": "environment",
    "operator": "=",
    "value": "production"
  }
]
```

把 JSON 数组进行 URL 编码，作为 `GET /api/public/v2/observations` 的 `filter` 查询参数传入。完整筛选 Schema 见 [Observations API v2](/official/api-and-data-platform/features/public-api)和 [API Reference](https://api.reference.langfuse.com/#tag/observations/GET/api/public/v2/observations)。

官方页面还提供 GitHub Discussions 动态讨论模块，静态中文版暂未嵌入。

---

原文：[Full-Text Search](https://langfuse.com/docs/observability/features/full-text-search) · 非官方中文翻译。
