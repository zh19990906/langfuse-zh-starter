---
title: 数据保留策略
description: 配置项目数据的保留时间，理解 Trace、审计日志、数据集和媒体的清理范围。
---
# 数据保留策略

Langfuse 的 Data Retention 功能用于控制事件数据在 Langfuse 中保存多久，包括 Trace、Observation、Score 和媒体文件。

官方标注的可用方案为 **Pro、Enterprise，以及符合条件的自托管 Enterprise**；Hobby 和 Core 不提供此功能。以[官方定价与版本说明](https://langfuse.com/pricing)为准。

**项目数据保留策略不会删除审计日志或数据集项。** 如果将 Trace 添加到数据集，即使源 Trace 到期，其保存的数据集项仍然可以使用；但添加到数据集不会阻止源 Trace 被删除。

## 配置

数据保留策略按**项目**设置，以天为单位，最短 **3 天**。

项目 Owner 和 Admin 可以进入 **Project Settings → Data Retention** 修改设置。

::: info
未配置保留策略时，Langfuse 不会自动删除事件数据。自托管实例默认无限期存储。Langfuse Cloud 各方案仍具有数据访问窗口：根据本文所译官方说明，Hobby 为 30 天、Core 为 90 天、Pro 和 Enterprise 为 3 年。访问窗口和实际删除策略并非同一概念，请以[最新定价页面](https://langfuse.com/pricing)为准。
:::

![配置数据保留策略](https://langfuse.com/images/docs/data-retention.png)

也可以通过[组织管理 API](/official/administration/scim-and-org-api)配置保留策略。

这是项目级设置，不存在组织或团队级统一保留策略。需要统一管理多个项目时，必须在各项目分别设置。自托管实例可以使用 `LANGFUSE_INIT_PROJECT_RETENTION` 配置启动时创建的项目。

## 清理细节

Langfuse 每晚筛选超过保留期限的 Trace、Observation、Score 和媒体资源并删除；与已保存数据集项关联的媒体除外。

判断各类数据是否过期所使用的字段：

| 数据对象 | 时间字段 |
| --- | --- |
| Trace | `timestamp` |
| Observation | `start_time` |
| Score | `timestamp` |
| 媒体资源 | `created_at` |

**删除的数据不能恢复。** 如果需要在保留期限之外保存数据，可以配置 [Blob Storage Export](/official/api-and-data-platform/features/export-to-blob-storage)，定期将 Trace、Observation 和 Score 同步到 S3、GCS 或 Azure。

## 项目数据保留策略会删除什么？

| 数据 | 处理方式 |
| --- | --- |
| Trace、Observation、Score | 超过期限后删除，包括与数据集、实验关联的记录 |
| 审计日志 | 不受项目保留策略影响 |
| 数据集与数据集项 | 不受影响；保存的输入、预期输出和元数据继续可用 |
| 数据集运行和运行项 | 运行记录仍在，但关联的 Trace、Observation 和 Score 可能过期 |
| Langfuse 托管媒体 | 过期后删除，除非与已保存的数据集项关联 |

### 将 Trace 加入数据集后，数据集项会删除吗？

**不会。** 在 Trace 视图中将 Trace 或 Observation 保存为数据集项时，Langfuse 会复制所选输入、预期输出和元数据，并保存对源对象的引用。

例如保留期限为 30 天，当源 Trace 过期并删除后：

- 数据集项及其中保存的数据仍可用于未来的实验；
- 指向源 Trace 的链接可能失效，无法再通过该链接查看原始 Observation、时间信息等细节。

把已存在的旧 Trace 加入数据集，也不会重置它的保留期限。

### 实验结果会受到什么影响？

实验产生的 Trace、Observation 和 Score 也遵循项目保留策略。数据集运行与运行项记录无法阻止相关数据过期；即使实验记录还在，过期后的 Trace 详情及评分仍不可用。

### 数据集媒体

与已保存数据集项关联的 Langfuse 托管媒体不受保留删除影响，即使源 Trace 过期也是如此。详见[多模态数据集项](https://langfuse.com/docs/evaluation/experiments/datasets#multi-modal-dataset-items)。

外部 URL 仅是引用。将外部 URL 存入数据集不会复制文件，也无法保证外部文件持续可用。

::: warning 保留策略不是备份与全域删除策略
项目 Retention 删除到期 Trace、Observation、Score 和部分媒体，但不会清除 Audit Log 或 Dataset Item。它也不能保证删除已经导出至外部对象存储的数据；外部导出和备份应单独配置生命周期及删除机制。对于启用版本控制的 S3，删除标记和非当前版本还需额外生命周期规则。
:::

## 自托管实例

自托管环境中启用数据保留功能，需要为 Langfuse IAM 角色授予所有相关存储桶的 `s3:DeleteObject` 权限。参阅 [Blob Storage（S3）文档](https://langfuse.com/self-hosting/deployment/infrastructure/blobstorage)。

Langfuse 只发出删除请求。如果存储桶启用了版本控制，删除标记和非当前版本仍需手动清除或通过生命周期规则清理。

---

原文：[Data Retention](https://langfuse.com/docs/administration/data-retention) · 非官方中文翻译。
