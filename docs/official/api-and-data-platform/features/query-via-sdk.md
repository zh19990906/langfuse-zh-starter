---
title: 通过 SDK 查询数据
description: 使用 Python 和 TypeScript SDK 查询 Observation、指标、评分及其他 Langfuse 数据。
---
# 通过 SDK 查询 Langfuse 数据

Langfuse 是[开源](https://langfuse.com/open-source)的，使用 Langfuse 收集的数据也可自由查询。Python 和 JavaScript/TypeScript SDK 提供与公开 API 相同的能力，无需手工编写 HTTP 请求。

典型用途：

- 查询 Observation 明细，用于评估 Pipeline、Few-shot 示例或微调数据集；
- 查询成本、用量、延迟、调用量和评分聚合指标，构建仪表盘或计费流程；
- 通过程序创建[数据集](/official/evaluation/experiments/datasets)。

新用户建议先了解[Langfuse 数据模型](/official/observability/data-model)。

::: info
新摄入的数据通常在 **15–30 秒**内可查询，实际处理时间可能波动。遇到异常可检查[官方状态页](https://status.langfuse.com)。
:::

## SDK 与 API 命名空间

Python 和 JS/TS SDK 的 `api` 命名空间基于公开 OpenAPI 自动生成，方法名对应 REST 资源，支持分页和筛选。

::: warning 版本迁移
从 **Python SDK v4** 和 **JS/TS SDK v5** 起，高性能接口成为默认：
- `api.observations`，原为 `api.observations_v_2` / `api.observationsV2`；
- `api.metrics`，原为 `api.metrics_v_2` / `api.metricsV2`。

Score API v3 从 Python **4.8.1+** 起使用 `api.scores_v3`，从 JS/TS **5.5.0+** 起使用 `api.scoresV3`。旧版 `api.scores` v2 读取已弃用。

上述旧 v2 别名已在 Python v4 与 JS/TS v5 中移除。使用 `api.legacy.*` 会调用弃用端点。Cloud 旧端点退役日期由上游动态组件提供，请参阅[最新迁移说明](https://langfuse.com/faq/all/deprecated-api-migration)。
:::

## Python SDK

安装与初始化：

```bash
pip install langfuse
```

```python
from langfuse import get_client
langfuse = get_client()  # 使用环境变量认证
```

### Observation

```python
observations = langfuse.api.observations.get_many(
    trace_id="abcdef1234",
    type="GENERATION",
    limit=100,
    fields="core,basic,usage"
)
```

通过 `trace_id` 获取属于同一 Trace 的 Observation，需要重建树形结构时使用响应中的 `parent_observation_id`。

### Metrics

完整查询 Schema、维度和筛选条件见 [Metrics API v2](/official/metrics/features/metrics-api)。

```python
query = """
{
  "view": "observations",
  "metrics": [{"measure": "totalCost", "aggregation": "sum"}],
  "dimensions": [{"field": "providedModelName"}],
  "filters": [],
  "fromTimestamp": "2025-05-01T00:00:00Z",
  "toTimestamp": "2025-05-13T00:00:00Z"
}
"""
metrics = langfuse.api.metrics.metrics(query=query)
```

### Session

Session 没有专门的查询端点。需获取具有相同 `sessionId` 的 Observation，然后在客户端分组：

```python
import json

session_observations = langfuse.api.observations.get_many(
    filter=json.dumps([
        {"type": "string", "column": "sessionId", "operator": "=", "value": "chat-session-42"},
    ]),
    fields="core,basic,io",
    limit=50,
)
```

详见 [Sessions API 迁移说明](https://langfuse.com/faq/all/deprecated-api-migration#sessions)。

### Scores

```python
# Scores API v3：Python SDK 4.8.1+，推荐
scores = langfuse.api.scores_v3.get_many_v3(id="ScoreId")

# Scores API v2：已弃用；原文注明 2026-11-16 停用
scores = langfuse.api.scores.get_many(score_ids="ScoreId")
```

迁移方法见[弃用 API 说明](https://langfuse.com/faq/all/deprecated-api-migration#scores)。

### Prompt 与 Dataset

获取提示词参阅[提示词管理快速开始](/official/prompt-management/get-started)。

```python
# 数据集相关命名空间
# langfuse.api.datasets.*
# langfuse.api.dataset_items.*
# langfuse.api.experiments.*  (Python SDK 4.13.1+)
```

### 异步版本

每个接口在 `async_api` 中都提供异步版本：

```python
observations = await langfuse.async_api.observations.get_many(
    trace_id="abcdef1234",
    limit=100,
    fields="core,basic,usage",
)
metrics = await langfuse.async_api.metrics.metrics(query=query)
```

Observation 字段筛选与游标分页，参阅 [Observations API v2](/official/api-and-data-platform/features/public-api#observations-api-v2)。

## JavaScript / TypeScript SDK

`langfuse.api` 的方法同样从 API 定义自动生成，支持通过编辑器 IntelliSense 探索其他实体。

```bash
npm install @langfuse/client
```

```typescript
import { LangfuseClient } from "@langfuse/client";
const langfuse = new LangfuseClient();
```

### Observation

```typescript
const observations = await langfuse.api.observations.getMany({
  traceId: "abcdef1234",
  type: "GENERATION",
  limit: 100,
  fields: "core,basic,usage",
});
```

通过 `traceId` 获取同一 Trace 的 Observation，必要时利用 `parentObservationId` 重建树形结构。

### Metrics

```typescript
const query = {
  view: "observations",
  metrics: [{ measure: "totalCost", aggregation: "sum" }],
  dimensions: [{ field: "providedModelName" }],
  filters: [],
  fromTimestamp: "2025-05-01T00:00:00Z",
  toTimestamp: "2025-05-13T00:00:00Z",
};

const metrics = await langfuse.api.metrics.metrics({
  query: JSON.stringify(query),
});
```

### Session

```typescript
const sessionObservations = await langfuse.api.observations.getMany({
  filter: JSON.stringify([
    {
      type: "string",
      column: "sessionId",
      operator: "=",
      value: "chat-session-42",
    },
  ]),
  fields: "core,basic,io",
  limit: 50,
});
```

Session 需要在客户端自行对这些 Observation 分组，不再通过专门端点返回。

### Scores

```typescript
// Scores API v3，JS/TS SDK 5.5.0+，推荐
const scoresV3 = await langfuse.api.scoresV3.getManyV3();

// Scores API v2，已弃用；原文注明 2026-11-16 停用
const scores = await langfuse.api.scores.getMany();
```

### Prompt 与 Dataset

提示词读取见[快速开始](/official/prompt-management/get-started)。

```typescript
// 数据集相关命名空间
// langfuse.api.datasets.*
// langfuse.api.datasetItems.*
// langfuse.api.experiments.* (JS/TS SDK 5.10.0+)
```

更多资源和方法可以使用编辑器对 `langfuse.api` 的补全功能探索。

## 相关资源

- [Observations API v2](/official/api-and-data-platform/features/public-api#observations-api-v2)：从旧版 Trace/Observation 读取接口迁移。
- [Scores API 迁移](https://langfuse.com/faq/all/deprecated-api-migration#scores)：将旧读取迁移至 v3。
- [Metrics API v2](/official/metrics/features/metrics-api)：迁移指标查询。
- [Blob Storage Export](/official/api-and-data-platform/features/export-to-blob-storage)：需要大量数据用于微调、分析时，定期自动导出至 S3、GCS 或 Azure，比逐页 API 查询更合适。
- [UI 导出](/official/api-and-data-platform/features/export-from-ui)：手工导出筛选数据。

---

原文：[Query via SDKs](https://langfuse.com/docs/api-and-data-platform/features/query-via-sdk) · 非官方中文翻译。
