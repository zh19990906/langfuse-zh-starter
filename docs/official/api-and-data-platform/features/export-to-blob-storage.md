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


::: warning 精校待办
官方 Blob Storage 导出文档约 40 KB，包含大量源类型、字段映射和导出流程细节。本中文页仍为摘要稿，只完成示例归位，**不得视为完整翻译或最终验收通过**。如需实施生产 ETL，请优先核对[官方完整字段定义](https://langfuse.com/docs/api-and-data-platform/features/export-to-blob-storage)。
:::
