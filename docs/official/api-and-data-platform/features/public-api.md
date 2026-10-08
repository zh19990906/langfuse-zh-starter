---
title: Langfuse Public API
description: Langfuse Public API 的中文技术说明与原文示例。
---

# Langfuse 公共 API

Langfuse Public API 用于摄入 Trace、查询 Observation 和 Score、分析 Metrics、管理 Dataset、Prompt 与实验相关数据。API 基于 HTTP，可通过 OpenAPI Reference 查阅全部参数。

## API Reference

[官方 API Reference](https://api.reference.langfuse.com)提供最新 Endpoint、Request Schema、Response Schema 及版本说明。

## 快速开始

### 获取 Key

在 Project Settings 创建 Public Key 和 Secret Key，通过 HTTP Basic Authentication 访问项目 API。不要将 Secret Key 暴露给浏览器或公共仓库。

### 区域地址

| 地区 | Base URL |
| --- | --- |
| Europe | `https://cloud.langfuse.com` |
| US | `https://us.cloud.langfuse.com` |
| Japan | `https://jp.cloud.langfuse.com` |
| HIPAA US | `https://hipaa.cloud.langfuse.com` |
| Self-hosted | 自有实例 URL |

### 发送认证请求

通过 `curl -u "$LANGFUSE_PUBLIC_KEY:$LANGFUSE_SECRET_KEY"` 设置 Basic Auth。需要注意分页、限流、API 版本与错误响应。

## 通过 SDK 查询

Python 与 TypeScript 的 `langfuse.api` 提供类型化生成客户端，可访问 Observation、Metric、Score 等接口，详见[通过 SDK 查询](/official/api-and-data-platform/features/query-via-sdk)。

## 摄入 Trace

可直接调用 API 或 OTLP Endpoint 上报 Span。对高吞吐量应用，推荐使用经过批处理的 SDK、OpenTelemetry Exporter 或 Ingestion API，避免手工管理重试和追踪 Context。

## 读取 Observation

### Observations API v2

用于按 Trace、Session、Name、Time、Type 等筛选并读取 Observation。对应自托管 Langfuse v4 的新数据模型。

### 从旧 API 迁移

不要在升级 SDK 后继续依赖已弃用的旧 Trace/Observation 读取语义。新版 API 以 Observation 为一等对象，Trace 由相关 Observation 关联而成。

### 逻辑根 Observation

逻辑根不一定与物理父 Span 缺失完全相同；过滤时需要理解 `isRootObservation` 及父节点关系。

### 选择字段组

可以通过 `fields` 参数只读取所需列，降低响应体大小和查询开销。

### Filter 和分页

支持结构化 Filter、时间范围以及 Cursor Pagination。分页时固定筛选条件，传回上一页的 Cursor，直到没有新 Cursor 为止；不要用时间戳替代 Cursor 避免丢数据。

## Scores API v3

新版 Score 接口支持区分 Numeric、Categorical、Boolean、Text，并通过 `subject` 关联评分所属对象。读取时可用字段组和 Filter 减少数据量。

## Experiments API

用于读取实验运行、实验 Item 和对应 Score，适合自动生成实验报告。Experiment Run 的创建通常由 SDK Runner 或 UI/OTEL 实现，而非直接调用旧的 DatasetRunItem 写入接口。

## 其他数据访问方式

- [Metrics API](/official/metrics/features/metrics-api)适合聚合分析；
- [导出至 Blob Storage](/official/api-and-data-platform/features/export-to-blob-storage)适合大批量异步数据；
- [UI 导出](/official/api-and-data-platform/features/export-from-ui)适合一次性手动导出。

## 常见问题

核对 API Base URL 是否对应项目 Region，检查认证、版本兼容性、分页和数据摄入延迟。遇到不支持的读取字段，请升级 SDK 或使用匹配服务端的 Legacy API。

## 精校补充：具体 API 契约与版本约束

### 公共 API 认证验证

```bash
curl -u public-key:secret-key https://cloud.langfuse.com/api/public/projects
```

请求成功时返回项目列表，通常包含 `data` 数组，每个项目有 `id`、`name` 和 `organization` 等字段。

### SDK 命名空间与服务端版本

| 资源 | Python SDK | JS/TS SDK | 服务端要求 |
| --- | --- | --- | --- |
| Observations API v2 | `langfuse.api.observations`，Python v4 | `langfuse.api.observations`，JS/TS v5 | Cloud 或自托管 v4 |
| Metrics API v2 | `langfuse.api.metrics`，Python v4 | `langfuse.api.metrics`，JS/TS v5 | Cloud 或自托管 v4 |
| Scores API v3 | `langfuse.api.scores_v3`，Python **4.8.1+** | `langfuse.api.scoresV3`，JS/TS **5.5.0+** | Cloud 或自托管 **v3.179+** |

旧 `api.scores` v2 **读取接口已弃用**；旧 v1 资源迁至 `api.legacy.*`。自托管 v3 应使用兼容的 Legacy Observation/Metrics API。具体迁移见[官方弃用 API 指南](https://langfuse.com/faq/all/deprecated-api-migration)。

### Observation v2 的 Cursor 分页

`GET /api/public/v2/observations` 支持 `limit`（默认 **50**、最大 **1000**），按 `startTime` **降序**返回。下一页 Cursor 位于 `meta.cursor`。持续将该值传入后续请求的 `cursor` 参数，直到不存在或为 `null`。Cloud 调用受组织级 API Rate Limit 约束；自托管不强制执行该平台限流。

```bash
curl -u public-key:secret-key \
  "https://cloud.langfuse.com/api/public/v2/observations?traceId=your-trace-id&fields=core,basic,usage&limit=100"
```

### Scores API v3 的类型和值

`GET /api/public/v3/scores` 用于**读取**评分，创建评分则使用 `POST /api/public/scores` 或 SDK Score Helper。

| `dataType` | 返回 `value` 类型 |
| --- | --- |
| `NUMERIC` | number |
| `BOOLEAN` | boolean |
| `CATEGORICAL` | string |
| `TEXT` | string |
| `CORRECTION` | string；无修正时为空字符串 |

**不要将 Scores API v3 的 `BOOLEAN` 读返回值当成 0/1 数字。** API v3 的 `value` 是依类型区分的字段。

可通过 `fields=details,subject,annotation` 获取额外内容；基本字段始终返回，未知字段组返回 HTTP **400**。

| 字段组 | 额外字段 |
| --- | --- |
| `details` | `comment`、`configId`、`metadata` |
| `subject` | `subject`（评分关联对象） |
| `annotation` | `authorUserId`、`queueId` |

### Trace 摄入端点

**新接入应使用 OpenTelemetry OTLP/HTTP Endpoint**：`POST /api/public/otel/v1/traces`。旧 `POST /api/public/ingestion` 的 Trace/Observation 事件已弃用；Cloud 切换时间应核对[官方迁移指南](https://langfuse.com/integrations/native/opentelemetry/migration-to-v4)。当前 Score Helper 仍通过旧端点发送 `score-create`，该事件在切换后继续受支持。不能把旧 Ingestion API 作为新项目推荐方案。

## 官方代码与请求示例

以下示例保留原文代码内容和请求字段，尚未逐一运行验证。

### 官方示例 1

```text
/api/public
```

### 官方示例 2

```text
https://us.cloud.langfuse.com/api/public
```

### 官方示例 3

```text
https://cloud.langfuse.com/api/public
```

### 官方示例 4

```text
https://jp.cloud.langfuse.com/api/public
```

### 官方示例 5

```text
https://hipaa.cloud.langfuse.com/api/public
```

### 官方示例 6

```bash
curl -u public-key:secret-key https://cloud.langfuse.com/api/public/projects
```

### 官方示例 7

```json
{
  "data": [
    {
      "id": "clxxxx",
      "name": "My Project",
      "organization": {
        "id": "clyyyy",
        "name": "My Org"
      }
    }
  ]
}
```

### 官方示例 8

```python
from langfuse import get_client

langfuse = get_client()

# Retrieve row-level observations via Observations API v2
observations = langfuse.api.observations.get_many(
    trace_id="trace-id",
    fields="core,basic,usage",
    limit=100,
)

# Retrieve aggregates via Metrics API v2
metrics = langfuse.api.metrics.metrics(query="""
{
  "view": "observations",
  "metrics": [{"measure": "totalCost", "aggregation": "sum"}],
  "dimensions": [{"field": "providedModelName"}],
  "filters": [],
  "fromTimestamp": "2025-05-01T00:00:00Z",
  "toTimestamp": "2025-05-13T00:00:00Z"
}
""")

# explore more endpoints via Intellisense
langfuse.api.*
await langfuse.async_api.*
```

### 官方示例 9

```ts
import { LangfuseClient } from '@langfuse/client';

const langfuse = new LangfuseClient();

// Retrieve row-level observations via Observations API v2
const observations = await langfuse.api.observations.getMany({
  traceId: "trace-id",
  fields: "core,basic,usage",
  limit: 100,
});

// Retrieve aggregates via Metrics API v2
const metrics = await langfuse.api.metrics.metrics({
  query: JSON.stringify({
    view: "observations",
    metrics: [{ measure: "totalCost", aggregation: "sum" }],
    dimensions: [{ field: "providedModelName" }],
    filters: [],
    fromTimestamp: "2025-05-01T00:00:00Z",
    toTimestamp: "2025-05-13T00:00:00Z"
  })
});

// explore more endpoints via Intellisense
langfuse.api.*
```

### 官方示例 10

```xml
<dependencies>
  <dependency>
    <groupId>com.langfuse</groupId>
    <artifactId>langfuse-java</artifactId>
    <version>0.0.1-SNAPSHOT</version>
  </dependency>
</dependencies>

<repositories>
  <repository>
    <id>github</id>
    <name>GitHub Package Registry</name>
    <url>https://maven.pkg.github.com/langfuse/langfuse-java</url>
  </repository>
</repositories>
```

### 官方示例 11

```java
import com.langfuse.client.LangfuseClient;
import com.langfuse.client.resources.prompts.types.PromptMetaListResponse;
import com.langfuse.client.core.LangfuseClientApiException;

LangfuseClient client = LangfuseClient.builder()
  .url("https://cloud.langfuse.com") // 🇪🇺 EU data region
  // Other Langfuse data regions:
  // .url("https://us.cloud.langfuse.com") // 🇺🇸 US
  // .url("https://jp.cloud.langfuse.com") // 🇯🇵 Japan
  // .url("https://hipaa.cloud.langfuse.com") // ⚕️ HIPAA
  // .url("http://localhost:3000") // 🏠 Local deployment
  .credentials("pk-lf-...", "sk-lf-...")
  .build();

try {
  PromptMetaListResponse prompts = client.prompts().list();
} catch (LangfuseClientApiException error) {
  System.out.println(error.getBody());
  System.out.println(error.getStatusCode());
}
```

### 官方示例 12

```text
GET /api/public/v2/observations
```

### 官方示例 13

```text
?fields=core,basic,usage
```

### 官方示例 14

```bash
curl -G \
  -H "Authorization: Basic <BASIC AUTH HEADER>" \
  "https://cloud.langfuse.com/api/public/v2/observations" \
  --data-urlencode 'fromStartTime=2025-12-15T00:00:00Z' \
  --data-urlencode 'toStartTime=2025-12-16T00:00:00Z' \
  --data-urlencode 'filter=[{"type":"string","column":"name","operator":"does not contain","value":"healthcheck"}]'
```

### 官方示例 15

```bash
# Fetch a page for one trace
curl \
  -H "Authorization: Basic <BASIC AUTH HEADER>" \
  "https://cloud.langfuse.com/api/public/v2/observations?fields=core,basic,usage&traceId=your-trace-id&limit=100"

# Response includes: "meta": { "cursor": "eyJsYXN0..." }
# Pass it back to fetch the next page
curl \
  -H "Authorization: Basic <BASIC AUTH HEADER>" \
  "https://cloud.langfuse.com/api/public/v2/observations?fields=core,basic,usage&traceId=your-trace-id&limit=100&cursor=eyJsYXN0..."
```

### 官方示例 16

```bash
curl \
  -H "Authorization: Basic <BASIC AUTH HEADER>" \
  "https://cloud.langfuse.com/api/public/v2/observations?isRootObservation=true&fromStartTime=2025-12-15T00:00:00Z&toStartTime=2025-12-16T00:00:00Z"
```

### 官方示例 17

```text
GET /api/public/v3/scores
```

### 官方示例 18

```text
?fields=details,subject,annotation
```

### 官方示例 19

```json
{ "kind": "observation", "id": "obs-1", "traceId": "trace-1" }
```

### 官方示例 20

```bash
curl \
  -H "Authorization: Basic <BASIC AUTH HEADER>" \
  "https://cloud.langfuse.com/api/public/v3/scores?name=hallucination,toxicity&dataType=NUMERIC&valueMax=0.5"
```

### 官方示例 21

```bash
curl \
  -H "Authorization: Basic <BASIC AUTH HEADER>" \
  "https://cloud.langfuse.com/api/public/v3/scores?traceId=trace-1,trace-2&fields=details,subject"
```

::: info 翻译状态
已提供主要章节的中文说明并保留官方代码块。原文完整字段参考、复杂示例说明和部分表格仍需要逐段精校，此页暂不计入“完整验收”。
:::

原文：[Langfuse Public API](https://langfuse.com/docs/api-and-data-platform/features/public-api)。
