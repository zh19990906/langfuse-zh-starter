---
title: Langfuse 版本与兼容性
description: Langfuse Cloud、自托管 Server、Python 和 JS/TS SDK 的版本生命周期与能力矩阵。
---

# Langfuse 版本与兼容性

本页说明 Langfuse Server、SDK 和 API 的版本关系，适用于 Langfuse Cloud 和自托管部署。

[Langfuse v4](/official/v4) 已正式可用。自托管用户参阅 [v3 → v4 升级指南](https://langfuse.com/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4)。Cloud 自 2026 年 3 月起陆续预览 v4，官方将在切换日仅保留 v4，并移除剩余的旧版 API 与摄入路径。具体切换日期通过官方动态组件维护，请以[原文](https://langfuse.com/docs/compatibility)实时信息为准。

**兼容性原则：**每个 Server 主版本尽量支持各语言当前和前一个 SDK 主版本；但较新的 SDK 功能可能需要更新的 Server。v4 存在向后不兼容的地方，不能只按原则判断是否可以无风险升级。

| 部署方式 | 版本管理 |
| --- | --- |
| **Langfuse Cloud** | Server 由 Langfuse 持续更新；用户主要关心 SDK 版本和所调用的 API 端点。公布的移除日期对 Cloud 生效。 |
| **自托管（OSS / Enterprise）** | 用户决定何时升级 Server；Cloud 可能领先于最新自托管版。应按[自托管 SDK ↔ Server 兼容矩阵](https://langfuse.com/self-hosting/upgrade/versioning#sdk-server)核对各功能的最低版本。 |

## 版本生命周期

| 阶段 | 含义 |
| --- | --- |
| **Preview（预览）** | 面向生产使用的新功能，但界面/API 契约可能调整 |
| **GA（正式可用）** | 官方推荐并提供完整支持，包括安全补丁 |
| **Deprecated（已弃用）** | 仍可使用，但已有替代方案，计划移除 |
| **End of life（停止维护）** | 不再提供支持或安全补丁 |

## 正式可用的主版本

| 组件 | GA 版本 | 技术要求与说明 |
| --- | --- | --- |
| [Server](https://github.com/langfuse/langfuse/releases) | **v4** | Observation 优先数据模型；自托管 v3 安全补丁支持截至 **2027-01-31**，之后停止维护 |
| [Python SDK](https://pypi.org/project/langfuse/) | **v4** | Python **3.9+**；自 v3 基于 OpenTelemetry |
| [JS/TS SDK](https://www.npmjs.com/package/@langfuse/tracing) | **v5** | Node.js **20+**；自 v4 基于 OpenTelemetry |
| 其他语言 | 无指定官方 SDK 主版本 | 通过 [OpenTelemetry](https://langfuse.com/integrations/native/opentelemetry) 发送数据 |

## Cloud 功能兼容矩阵

原文提供交互式筛选矩阵，下面将静态表格内容译为 Markdown。**Cloud v3 栏已弃用**；在官方 Cloud v4 切换后，表内已弃用能力会移除。自托管应使用[单独的兼容矩阵](https://langfuse.com/self-hosting/upgrade/versioning#sdk-server)。

| 功能 | Cloud v3（已弃用） | Cloud v4（GA） |
| --- | --- | --- |
| Python SDK v4 | 完整支持 | 完整支持 |
| Python SDK v3 | 完整支持 | 已弃用 |
| Python SDK v2 | 完整支持 | 已弃用 |
| Python SDK v1 | 不支持 | 不支持 |
| JS/TS SDK v5 | 完整支持 | 完整支持 |
| JS/TS SDK v4 | 完整支持 | 已弃用 |
| JS/TS SDK v3 / v2 | 完整支持 | 已弃用 |
| JS/TS SDK v1 | 不支持 | 不支持 |
| OpenTelemetry `/api/public/otel/v1/traces` | 完整支持 | 完整支持 |
| 直接写 Score：`/api/public/scores` | 完整支持 | 完整支持 |
| SDK 通过旧 Ingestion API 发送 `score-create` | 完整支持 | 完整支持 |
| 旧 Trace/Observation Ingestion Events | 完整支持 | 已弃用 |
| Observations API v2 与 Metrics API v2 | 完整支持 | 完整支持 |
| Scores API v3 | 完整支持 | 完整支持 |
| 旧读 API（Trace、Observation、Session、Score、Metrics、Dataset Run） | 完整支持 | 已弃用 |
| Blob Storage 导出 | Trace + Observation | Enriched Observation |
| PostHog 集成 | Trace + Observation | Enriched Observation |
| Mixpanel 集成 | Trace + Observation | Enriched Observation |
| 旧 Export Source | 完整支持 | 已弃用 |
| Observation 级评估器 | 完整支持 | 完整支持 |
| Trace 级评估器 | 完整支持 | 已弃用 |

## 各能力的迁移限制

### Python SDK v3

已弃用，建议升级至 [v4](/official/observability/sdk/upgrade-path/python-v3-to-v4)。

在 Cloud v4 下，旧版 OpenTelemetry 追踪仍能工作，但数据可能延迟最多 **15 分钟**，需要 Python SDK v4 **≥4.7.0** 才能获得相应实时能力。旧 SDK 只支持 Dataset，实验需要 v4。其旧版读取 API 会在 Cloud 切换时停用。

### Python SDK v2

已弃用，应依次执行[v2 → v3](/official/observability/sdk/upgrade-path/python-v2-to-v3)、[v3 → v4](/official/observability/sdk/upgrade-path/python-v3-to-v4)迁移。

v2 使用旧 Batch Ingestion，在 Cloud v4 切换后无法再摄入 Trace/Observation；**Score 写入仍支持**。Dataset 功能可用，但新版实验功能需要 Python SDK v4。旧读 API 随 Cloud 切换停用。

### JS/TS SDK v4

已弃用，建议升级 [v5](/official/observability/sdk/upgrade-path/js-v4-to-v5)。旧 OpenTelemetry Trace 在 Cloud v4 可能最多延迟 **15 分钟**；JS/TS SDK v5 **≥5.4.0** 才能满足对应实时评估需求。旧 SDK 只有 Dataset 功能，Experiments 需要 v5。旧读 API 将在切换时停用。

### JS/TS SDK v3 / v2

这些版本的旧 Trace Ingestion 将在 Cloud v4 切换后移除，不能依赖旧接口继续追踪。Score 写入仍支持，旧 Dataset 功能与实验功能的界限需遵循 SDK 主版本要求。建议先阅读[升级路径](/official/observability/sdk/upgrade-path/index)。

### OpenTelemetry

`POST /api/public/otel/v1/traces` 是推荐的 Trace 摄入接口，在 Cloud v3/v4 中均受支持。第三方 OTEL Instrumentation 应根据 [OTEL 属性映射](https://langfuse.com/integrations/native/opentelemetry)传递模型、Token 和其他信息；v4 优先按 Observation 组织数据。

### 旧 Trace/Observation Ingestion

旧的 `POST /api/public/ingestion` 上报 Trace 与 Observation Events 已弃用；Cloud 切换后仅保留相应 Score 事件支持。迁移到 [OTLP Endpoint](https://langfuse.com/integrations/native/opentelemetry/migration-to-v4)，不要将旧摄入端点作为新接入的默认方案。

### Observations API v2、Metrics API v2

新版高性能读取适用于 Cloud v3/v4；自托管使用需要核对 Server 版本。新 Python v4 与 JS/TS v5 客户端默认访问新版资源。旧自托管 Server 应使用 `api.legacy.*` 兼容路径。参阅[Public API](/official/api-and-data-platform/features/public-api)及[自托管矩阵](https://langfuse.com/self-hosting/upgrade/versioning#sdk-server)。

### 已弃用的读 API

旧 Trace、Observation、Session、Score、Metrics、Dataset Run 读取接口在 Cloud v4 切换时移除。应用应迁移到新版 Observations API、Scores API v3、Metrics API v2 以及 Experiments API。使用分页和字段组控制查询成本。

### Trace 级评估器

v4 优先使用 Observation 级 Evaluator。Trace 级 Legacy Evaluator 将停用，应将目标、变量映射与规则迁移到根 Observation 或相应业务步骤，避免原 Trace 级 IO 字段不再可用。

### 旧导出源

v3 中导出 Trace 与 Observation；v4 推荐 Enriched Observations。迁移 Blob Storage、PostHog、Mixpanel 时核对 Schema 和下游 ETL，避免沿用旧对象与旧字段名称。[Blob Storage 导出说明](/official/api-and-data-platform/features/export-to-blob-storage)。

## 常见问题

### 使用 Langfuse Cloud，需要关心哪些版本？

Server 自动由官方更新，主要需要确认 SDK 主版本和所使用的 API 接口。使用 GA SDK 版本，并在官方公布的移除日期前迁移已弃用的 API。

### 自托管 v3 搭配最新 Python v4 / JS v5，能用哪些功能？

不能仅按 SDK 版本判断，必须核对[自托管最低 Server 版本](https://langfuse.com/self-hosting/upgrade/versioning#sdk-server)。旧 Server 不具备 Observation 优先模型的全部新读 API，可能需要 `api.legacy.*`；一些新功能仅在 v4 Server 上可用。

### 为什么 Trace 过了几分钟才出现在 UI？

旧 SDK 的数据可能走兼容摄入路径，在 Cloud v4 中最多延迟约 **15 分钟**。如果需要实时 Observation 评估，升级到符合最低补丁要求的 GA SDK，并检查导出链路。

### Cloud 的旧 SDK 什么时候停止工作？

旧 SDK 中依赖旧 Trace/Observation Ingestion 的部分，会在官方 Cloud v4 切换日停止工作。切换日期由官方动态组件提供，应查看[兼容性原文](https://langfuse.com/docs/compatibility)，避免使用已经过时的静态日历信息。

### 升级自托管 Server 会破坏原来的 SDK 吗？

Server 通常支持当前与前一个 SDK 主版本，但 v3 → v4 有明确的破坏性变化，旧 Python v2 / JS v3 的 Trace 摄入不再受支持；其他旧 SDK 可能失去实时可见性。升级前必须核对 [SDK ↔ Server 矩阵](https://langfuse.com/self-hosting/upgrade/versioning#sdk-server)。

---

原文：[Versions & Compatibility](https://langfuse.com/docs/compatibility) · 已翻译静态矩阵、版本生命周期和常见迁移说明；原站动态日期与交互筛选须以官方实时页面为准。
