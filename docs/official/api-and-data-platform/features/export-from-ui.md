---
title: 从界面导出数据
description: 从 Langfuse UI 导出追踪数据，用于分析、微调和外部工具集成。
---
# 从 UI 导出数据

Langfuse 是[开源项目](https://langfuse.com/open-source)，在 Langfuse 中记录的数据可以导出。你可以将可观测性数据用于分析、微调、模型训练或者外部工具集成。

Langfuse 中大多数表格支持**批量导出**。当前对表格应用的筛选条件也会应用于导出结果。

前端自定义列的显示配置**不会影响导出内容**，导出时始终包含全部列。

可用格式：

- CSV
- JSON

[观看 CSV 导出演示](https://static.langfuse.com/docs-videos/export-generations-csv.mp4)。

## 其他方式

也可以通过以下方式导出或查询数据：

- [Blob Storage](https://langfuse.com/docs/api-and-data-platform/features/export-to-blob-storage)：定期自动导出到云存储。
- [SDK / API](https://langfuse.com/docs/api-and-data-platform/features/public-api)：通过 Langfuse SDK 或 API 访问数据。
- [Metrics API](https://langfuse.com/docs/metrics/features/metrics-api)：查询成本、Token 使用量和评分等聚合指标，以供外部 BI 工具使用。

---

原文：[Export from UI](https://langfuse.com/docs/api-and-data-platform/features/export-from-ui) · 非官方中文翻译。