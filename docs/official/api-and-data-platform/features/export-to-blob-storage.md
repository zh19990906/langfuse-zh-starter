---
title: 导出到 Blob Storage
description: 导出到 Blob Storage 的中文技术说明与原文示例。
---

# 导出至 Blob Storage

Langfuse 支持将大量追踪及相关数据按计划导出到外部对象存储，用于数据仓库、分析、长期归档及模型训练 Pipeline。对于批量数据，导出流程比逐页查询 API 更合适。

## 概览

配置对象存储集成后，Langfuse 在后台定期生成文件，写入目标 Bucket/Container。应用方可按完成标记或事件触发下游 Pipeline。

## 配置导出

### 创建 Integration

**导出对象路径示意（原文）**

```text
{prefix}{project-id}/
├── observations_v2/
│   └── {timestamp}.{parquet|json|jsonl|csv}[.gz]
├── scores/
│   └── {timestamp}.{parquet|json|jsonl|csv}[.gz]
└── manifests/
    └── {timestamp}.json
```


在项目设置中选择数据导出集成，配置对象存储服务、Bucket、Prefix 与访问权限。Cloud 与自托管支持的 Storage Provider、权限要求和运行时间可能不同。

::: warning
不要把存储 Access Key 放入 Markdown 或代码仓库。建议使用最小权限的 IAM Role、Service Account 或隔离的专用凭据。
:::

### 字段选择

新版导出以 Enriched Observation 为核心，可以选择字段组，在保留业务所需数据的同时控制导出量。

### API 配置

**查询和更新导出集成 API**

```http
GET /api/public/integrations/blob-storage
PUT /api/public/integrations/blob-storage
```


也可通过 Public API 创建或管理数据导出 Integration。Schema 和允许字段组可能随 Langfuse 版本变化，应使用最新 API Reference 验证。

## 消费导出数据

导出的文件适合交给 ETL、Spark、BigQuery、Snowflake 等下游系统。消费时要处理分区、Schema 演进、重复文件和重试。

### 完成标记与 Manifest

不要在文件刚出现时就假设整个导出完成，应读取与该次运行对应的 Manifest 或完成标记，确认所有分片都已写入。

### 触发下游 Pipeline

可以使用对象存储事件、定时任务或官方支持的事件通知机制，在导出完成后启动数据处理；处理程序应幂等。

## 旧版导出升级

Langfuse v4 的 Observation 优先数据模型改变了旧 Trace/Observation 的部分语义。建议迁移到 Enriched Observations，并对比字段差异，确认数据仓库查询不再依赖已弃用的 Trace 级 Input/Output。

### 导出源差异

旧版 Trace 与 Observation 分开的导出可能存在与新模型不同的 ID、IO、Tag 或 Metadata 组织方式；迁移前应对照字段映射。

### 迁移到 Enriched Observations

逐步切换下游读取逻辑与 Schema，再让新 Integration 使用 Enriched Observation 来源。应对历史数据和新导出结果做采样核对。

## 字段参考

### Traces

旧版 `traces/` 文件字段用于兼容历史导出逻辑，不等同于 Observation 优先的完整数据结构。

### Observations

`observations/` 包含模型调用、Span、Tool 等记录，可关联 Trace、Session、User 和 Score。使用官方字段参考设置解析及数据仓库表的列类型。

## FAQ

如导出缺失、延迟或数据不完整，应检查 Integration 状态、Manifest、Bucket 权限、对象存储 Region、导出时间范围以及旧版数据模型是否匹配。



## 导出配置完整说明

### Provider、运行计划和状态

在 **Project Settings → Integrations → Blob Storage** 新建集成，选择 Provider、目标 Bucket/路径、凭据、文件格式、计划、导出模式及字段组。支持 Amazon S3、S3 兼容存储、Azure Blob Storage；Google Cloud Storage 需要通过 **S3 兼容模式**使用 `https://storage.googleapis.com` 及 HMAC 密钥，而非 Service Account。保存前先点击 **Validate** 验证存储访问。

| 配置项 | 支持方式 |
| --- | --- |
| 文件格式 | Parquet（默认）、CSV、JSON、JSONL；文本格式可用 gzip，Parquet 使用内置压缩 |
| 运行频率 | 每 20 分钟、每小时、每天、每周；一次运行覆盖一个时间窗口 |
| 导出起点 | Full history（最早数据）、From setup date（启用时间）、From custom date（指定日期）；修改导出模式会重置同步位置并重新扫描 |
| 状态 | Active（已同步）、Running（正在执行）、Queued（排队中）、Pending（未首次执行）、Disabled（禁用）、Error（失败，可查看消息与时间） |

**Parquet 注意：** Observation 文件不包含 `input_price`、`output_price`、`total_price`，成本分析请用 `cost_details`、`total_cost`。自托管 ClickHouse 早于 25.11 的环境应升级或改用文本格式，避免不完整的 Parquet 输出未被报告。

### 字段组：Observations

Observation 默认选择全部 **11 组**字段，`core` 为必选；修改字段组仅影响未来导出。以下保留官方完整字段名，避免 ETL 列名变化。

| Group           | Fields                                                                                                                              |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `core`          | `end_time`, `id`, `parent_observation_id`, `project_id`, `start_time`, `trace_id`, `type`                                           |
| `basic`         | `bookmarked`, `environment`, `is_root_observation`, `level`, `name`, `public`, `session_id`, `status_message`, `user_id`, `version` |
| `time`          | `completion_start_time`, `created_at`, `updated_at`                                                                                 |
| `io`            | `input`, `output`                                                                                                                   |
| `metadata`      | `metadata`                                                                                                                          |
| `model`         | `input_price`, `model_id`, `model_parameters`, `output_price`, `provided_model_name`, `total_price`                                 |
| `usage`         | `cost_details`, `total_cost`, `usage_details`, `usage_pricing_tier_id`, `usage_pricing_tier_name`                                   |
| `prompt`        | `prompt_id`, `prompt_name`, `prompt_version`                                                                                        |
| `metrics`       | `latency`, `time_to_first_token`                                                                                                    |
| `trace_context` | `release`, `tags`, `trace_name`                                                                                                     |
| `tools`         | `tool_call_names`, `tool_calls`, `tool_definitions`                                                                                 |


### Scores 固定列

Scores 始终导出，不能配置其字段组。

| Category          | Fields                                                                      |
| ----------------- | --------------------------------------------------------------------------- |
| Identity          | `id`, `project_id`, `timestamp`, `created_at`, `updated_at`                 |
| Context and links | `trace_id`, `observation_id`, `session_id`, `dataset_run_id`, `environment` |
| Score             | `name`, `data_type`, `value`, `string_value`, `source`, `comment`           |


**API 配置契约：** `GET /api/public/integrations/blob-storage` 获取配置，`PUT /api/public/integrations/blob-storage` 更新配置。`exportFieldGroups` 若指定必须包含 `core`；省略该属性表示保持原有字段选择。`compressed` 仅适用于 CSV/JSON/JSONL。Provider 凭据与完整 Schema 见 [REST API](https://api.reference.langfuse.com/#tag/blobstorageintegrations)。

## Manifest、增量消费与失败重试

一次导出只有在 `{prefix}{project-id}/manifests/{timestamp}.json` 写出之后才算完成，Langfuse 会等待所有数据文件上传成功后再写 Manifest。若文件上传失败则不会写 Manifest，重试会覆盖相同 Key 的数据对象。

1. 监听或轮询 `manifests/` 前缀，读取新 Manifest 的 `files[]`。
2. 按 **`files[].key` 完整对象 Key**逐个下载，不要根据时间戳猜测数据文件名，也不要仅扫描 `observations_v2/` 目录。
3. 根据记录的 `id` 幂等去重：相邻导出窗口共用**包含边界**，相同记录可能出现在相邻文件中。
4. Manifest 的 `window.minTimestamp/maxTimestamp` 表示本次时间窗；`exportSource`、`tables` 表示来源与表；`files[]` 记录 Key、表、格式、压缩方式、大小和行数。Parquet 的 `files[].rowCount` 为 `null`，应从 Parquet Metadata 获取行数。解析器应忽略未知 Manifest 字段。

触发方式：S3 Event Notifications / EventBridge、GCS Pub/Sub 的 `OBJECT_FINALIZE`、Azure Event Grid 的 `Microsoft.Storage.BlobCreated`、MinIO Bucket Notifications 或 Backblaze B2 Event Notifications。事件可能重复投递，必须按 Manifest Key 做幂等处理。没有对象创建事件的兼容存储可按文件名时间顺序轮询并持久化 Checkpoint。

## 从旧版导出迁移

旧来源产生 `traces/` + `observations/`，下游需要通过 `trace_id` Join；新版 Enriched 来源写入 `observations_v2/`，每条 Observation 已带 Trace Context，另有 `scores/`。

| 字段组 | 新版 `observations_v2/` | 旧版 `observations/` |
| --- | --- | --- |
| `basic` | 包括 `bookmarked`、`is_root_observation`、`public`、`session_id`、`user_id` 等 | 只有 `environment`、`level`、`name`、`status_message`、`version` |
| `usage` | 包括 `usage_pricing_tier_id` | 无 `usage_pricing_tier_id` |
| `trace_context` | `release`、`tags`、`trace_name` | 无效；旧版这些属性存储于 `traces/`，其中 `trace_name` 对应 `name` |

旧 Trace 级 `input`、`output`、`metadata`、`timestamp`、`version` 与新 Observation 同名字段**语义不同**，不能直接映射覆盖。

自托管 v4 在启用 Enriched Export 之前，应完成数据迁移，并确认服务器写入 v4 Events 表：`legacy` 模式不支持 Enriched，`events_only` 模式不支持旧导出；仅 `dual` 同时支持。迁移步骤为：更新消费端以读取每个 Manifest 的 `observations_v2/` 和 `scores/` → 切换为 **Enriched observations (recommended)** → 验证下一次成功运行 → 停止旧消费逻辑。

可在 `dual` 模式短暂同时导出旧、新格式进行验证，但**只对后续时间窗口生效，不会回填历史**；不要将两种 Observation 数据同时导入同一张生产表。切换后旧目录不会再产生新文件（包括空文件），应只用 Manifest 判断运行完成。Cloud 切换日期采用上游动态配置，请查看[官方兼容矩阵](https://langfuse.com/docs/compatibility)，不要以静态日期推断。

## 导出字段完整参考

以下表格保留上游的**字段名、数据类型与原始字段解释**，以确保 Schema 信息完整；字段解释中的英文可与上面的中文语义说明配合使用。类型对应 JSON/JSONL；时间戳统一 UTC，形式为 `YYYY-MM-DD HH:MM:SS.ffffff`。

### 文件类别

| File               | When it is exported      | Schema                                          |
| ------------------ | ------------------------ | ----------------------------------------------- |
| `observations_v2/` | Current enriched export  | [Enriched observations](#enriched-observations) |
| `scores/`          | Every export             | [Scores](#scores)                               |
| `traces/`          | Deprecated legacy export | [Legacy exports](#legacy-export-paths)          |
| `observations/`    | Deprecated legacy export | [Legacy exports](#legacy-export-paths)          |


### Enriched Observations：`observations_v2/`

一行表示一个 Observation，同时附带 Trace 上下文，受上方字段组控制，`core` 必选。

| Field                     | Type                       | Description                                                                                                                       |
| ------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `id`                      | string                     | Unique observation identifier.                                                                                                    |
| `trace_id`                | string                     | Trace identifier shared by related observations and scores.                                                                       |
| `project_id`              | string                     | Langfuse project identifier.                                                                                                      |
| `environment`             | string                     | Environment label.                                                                                                                |
| `type`                    | string                     | Observation type: `SPAN`, `GENERATION`, `EVENT`, `AGENT`, `TOOL`, `CHAIN`, `RETRIEVER`, `EVALUATOR`, `EMBEDDING`, or `GUARDRAIL`. |
| `parent_observation_id`   | string                     | Parent observation identifier; empty for a root observation.                                                                      |
| `is_root_observation`     | boolean                    | Whether the observation is a logical root.                                                                                        |
| `start_time`              | string (timestamp)         | When the observation started.                                                                                                     |
| `end_time`                | string (timestamp) or null | When the observation ended.                                                                                                       |
| `name`                    | string                     | User-defined observation name.                                                                                                    |
| `metadata`                | object                     | User-supplied observation metadata.                                                                                               |
| `level`                   | string                     | `DEBUG`, `DEFAULT`, `WARNING`, or `ERROR`.                                                                                        |
| `status_message`          | string                     | Status or error message.                                                                                                          |
| `version`                 | string                     | User-defined version.                                                                                                             |
| `input`                   | string                     | Observation input; may contain plain text or JSON.                                                                                |
| `output`                  | string                     | Observation output; may contain plain text or JSON.                                                                               |
| `provided_model_name`     | string                     | Model name supplied by the SDK or user.                                                                                           |
| `model_parameters`        | string                     | Model parameters encoded as JSON.                                                                                                 |
| `usage_details`           | object (string → integer)  | Token usage by category, such as `input`, `output`, and `total`.                                                                  |
| `cost_details`            | object (string → number)   | Cost in USD by category.                                                                                                          |
| `completion_start_time`   | string (timestamp) or null | When the first streamed token was generated.                                                                                      |
| `prompt_name`             | string                     | Langfuse prompt name.                                                                                                             |
| `prompt_version`          | integer or null            | Langfuse prompt version.                                                                                                          |
| `total_cost`              | number                     | Total observation cost in USD; `0` when no cost was recorded.                                                                     |
| `latency`                 | number or null             | Duration in seconds.                                                                                                              |
| `time_to_first_token`     | number or null             | Time to first token in seconds.                                                                                                   |
| `model_id`                | string                     | Matched Langfuse model definition identifier.                                                                                     |
| `created_at`              | string (timestamp)         | Row creation time.                                                                                                                |
| `updated_at`              | string (timestamp)         | Last row update time.                                                                                                             |
| `prompt_id`               | string                     | Langfuse prompt identifier.                                                                                                       |
| `tool_calls`              | array of strings           | Tool calls encoded as JSON strings.                                                                                               |
| `tool_call_names`         | array of strings           | Names of called tools.                                                                                                            |
| `tool_definitions`        | object                     | Tool or function schemas supplied to the model.                                                                                   |
| `usage_pricing_tier_id`   | string or null             | Pricing tier identifier used for cost calculation.                                                                                |
| `usage_pricing_tier_name` | string or null             | Pricing tier name used for cost calculation.                                                                                      |
| `input_price`             | string or null             | Matched per-unit input price; omitted from Parquet.                                                                               |
| `output_price`            | string or null             | Matched per-unit output price; omitted from Parquet.                                                                              |
| `total_price`             | string or null             | Matched flat per-call price; omitted from Parquet.                                                                                |
| `user_id`                 | string                     | End-user identifier from the trace.                                                                                               |
| `session_id`              | string                     | Session identifier from the trace.                                                                                                |
| `trace_name`              | string                     | Trace name.                                                                                                                       |
| `tags`                    | array of strings           | Trace tags.                                                                                                                       |
| `release`                 | string                     | Trace release.                                                                                                                    |
| `bookmarked`              | boolean                    | Whether the trace is bookmarked.                                                                                                  |
| `public`                  | boolean                    | Whether the trace is public.                                                                                                      |


**重要单位差异：**2026-04-01 起创建的集成，其 `latency` 和 `time_to_first_token` 单位为**秒**；更早创建的集成为兼容旧使用方式，单位为**毫秒**。不能直接混算。

### Scores：`scores/`

包含 `NUMERIC`、`BOOLEAN`、`CATEGORICAL`、`TEXT` 评分，**不包含** `CORRECTION` 数据类型；`TEXT` 的数值 `value` 为 0，真实文字见 `string_value`。

| Field            | Type               | Description                                            |
| ---------------- | ------------------ | ------------------------------------------------------ |
| `id`             | string             | Unique score identifier.                               |
| `timestamp`      | string (timestamp) | Score creation time.                                   |
| `project_id`     | string             | Langfuse project identifier.                           |
| `environment`    | string             | Environment label.                                     |
| `trace_id`       | string or null     | Associated trace identifier.                           |
| `observation_id` | string or null     | Associated observation identifier.                     |
| `session_id`     | string or null     | Associated session identifier.                         |
| `dataset_run_id` | string or null     | Associated dataset run identifier.                     |
| `name`           | string             | Score name.                                            |
| `value`          | number             | Numeric value; `TEXT` scores use `0`.                  |
| `source`         | string             | `API`, `ANNOTATION`, or `EVAL`.                        |
| `comment`        | string or null     | Optional comment or evaluator reasoning.               |
| `data_type`      | string             | `NUMERIC`, `BOOLEAN`, `CATEGORICAL`, or `TEXT`.        |
| `string_value`   | string or null     | Category label or text value; null for numeric scores. |
| `created_at`     | string (timestamp) | Row creation time.                                     |
| `updated_at`     | string (timestamp) | Last row update time.                                  |


### Legacy Traces：`traces/`

固定 Schema，不受字段组影响；不包括 `total_cost`、`latency`、`observations`、`scores` 或 `html_path`。

| Field         | Type               | Description                      |
| ------------- | ------------------ | -------------------------------- |
| `id`          | string             | Unique trace identifier.         |
| `timestamp`   | string (timestamp) | Trace creation time.             |
| `name`        | string             | User-defined trace name.         |
| `environment` | string             | Environment label.               |
| `project_id`  | string             | Langfuse project identifier.     |
| `metadata`    | object             | Trace metadata.                  |
| `user_id`     | string or null     | End-user identifier.             |
| `session_id`  | string or null     | Session identifier.              |
| `release`     | string or null     | Application release.             |
| `version`     | string or null     | User-defined version.            |
| `public`      | boolean            | Whether the trace is public.     |
| `bookmarked`  | boolean            | Whether the trace is bookmarked. |
| `tags`        | array of strings   | Trace tags.                      |
| `input`       | string or null     | Trace input.                     |
| `output`      | string or null     | Trace output.                    |
| `created_at`  | string (timestamp) | Row creation time.               |
| `updated_at`  | string (timestamp) | Last row update time.            |


### Legacy Observations：`observations/`

每行是一个不带 Trace Context 的 Observation，需要与 `traces/` 按 `trace_id` 关联。

| Field                     | Type                       | Description                                                                                                                       |
| ------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `id`                      | string                     | Unique observation identifier.                                                                                                    |
| `trace_id`                | string                     | Trace identifier shared by related observations and scores.                                                                       |
| `project_id`              | string                     | Langfuse project identifier.                                                                                                      |
| `environment`             | string                     | Environment label.                                                                                                                |
| `type`                    | string                     | Observation type: `SPAN`, `GENERATION`, `EVENT`, `AGENT`, `TOOL`, `CHAIN`, `RETRIEVER`, `EVALUATOR`, `EMBEDDING`, or `GUARDRAIL`. |
| `parent_observation_id`   | string or null             | Parent observation identifier; null for a root observation.                                                                       |
| `start_time`              | string (timestamp)         | When the observation started.                                                                                                     |
| `end_time`                | string (timestamp) or null | When the observation ended.                                                                                                       |
| `name`                    | string                     | User-defined observation name.                                                                                                    |
| `metadata`                | object                     | User-supplied observation metadata.                                                                                               |
| `level`                   | string                     | `DEBUG`, `DEFAULT`, `WARNING`, or `ERROR`.                                                                                        |
| `status_message`          | string or null             | Status or error message.                                                                                                          |
| `version`                 | string or null             | User-defined version.                                                                                                             |
| `input`                   | string or null             | Observation input; may contain plain text or JSON.                                                                                |
| `output`                  | string or null             | Observation output; may contain plain text or JSON.                                                                               |
| `provided_model_name`     | string or null             | Model name supplied by the SDK or user.                                                                                           |
| `model_parameters`        | string or null             | Model parameters encoded as JSON.                                                                                                 |
| `usage_details`           | object (string → integer)  | Token usage by category, such as `input`, `output`, and `total`.                                                                  |
| `cost_details`            | object (string → number)   | Cost in USD by category.                                                                                                          |
| `completion_start_time`   | string (timestamp) or null | When the first streamed token was generated.                                                                                      |
| `prompt_name`             | string or null             | Langfuse prompt name.                                                                                                             |
| `prompt_version`          | integer or null            | Langfuse prompt version.                                                                                                          |
| `total_cost`              | number or null             | Total observation cost in USD.                                                                                                    |
| `latency`                 | number or null             | Duration in seconds.                                                                                                              |
| `time_to_first_token`     | number or null             | Time to first token in seconds.                                                                                                   |
| `model_id`                | string or null             | Matched Langfuse model definition identifier.                                                                                     |
| `created_at`              | string (timestamp)         | Row creation time.                                                                                                                |
| `updated_at`              | string (timestamp)         | Last row update time.                                                                                                             |
| `prompt_id`               | string or null             | Langfuse prompt identifier.                                                                                                       |
| `tool_calls`              | array of strings           | Tool calls encoded as JSON strings.                                                                                               |
| `tool_call_names`         | array of strings           | Names of called tools.                                                                                                            |
| `tool_definitions`        | object                     | Tool or function schemas supplied to the model.                                                                                   |
| `usage_pricing_tier_name` | string or null             | Pricing tier name used for cost calculation.                                                                                      |
| `input_price`             | string or null             | Matched per-unit input price; omitted from Parquet.                                                                               |
| `output_price`            | string or null             | Matched per-unit output price; omitted from Parquet.                                                                              |
| `total_price`             | string or null             | Matched flat per-call price; omitted from Parquet.                                                                                |


### 旧版 null 在新版中的表示

| Value in `observations_v2/` | Fields                                                                                                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `""` (empty string)         | `input`, `model_id`, `model_parameters`, `output`, `parent_observation_id`, `prompt_id`, `prompt_name`, `provided_model_name`, `status_message`, `version`       |
| `null`                      | `completion_start_time`, `end_time`, `input_price`, `latency`, `output_price`, `prompt_version`, `time_to_first_token`, `total_price`, `usage_pricing_tier_name` |
| `0`                         | `total_cost`                                                                                                                                                     |


新版某些空字符串来自 v4 Events 表不可空列；`total_cost` 从 `cost_details['total']` 读取，因此数值 0 不一定代表真实零成本，可能只是没有成本信息。

### Parquet 专项

Parquet 不使用 gzip；Observation 文件省略 `input_price`、`output_price`、`total_price`，Trace 与 Score 字段在各种格式间一致。

::: info 验收范围
本页已补全官方字段清单、类型、Manifest 语义和迁移规则。代码及 Schema 尚未接入真实 Bucket、执行 ETL 或进行 VitePress 构建；这不等于生产验证通过。
:::
