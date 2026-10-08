---
title: LLM 指标与分析
description: 通过质量、成本、延迟、请求量等指标分析 LLM 应用。
---
# 指标（Metrics）

Langfuse 从[可观测性](/official/observability/overview)和[评估](/official/evaluation/overview)的追踪数据中提取可执行的洞察。

可以通过[自定义仪表盘](https://langfuse.com/docs/metrics/features/custom-dashboards)和 [Metrics API](https://langfuse.com/docs/metrics/features/metrics-api)按不同维度细分、聚合指标。还可以配置[告警](https://langfuse.com/docs/observability/features/alerts)，在指标跨越阈值时收到通知。

有关应该追踪哪些指标，以及如何把分析结果转化为改进措施，请参阅 Langfuse Academy 的[监控课程](https://langfuse.com/academy/monitoring)和[错误分析](https://langfuse.com/academy/monitoring/error-analysis)。

![LLM 指标分析](https://langfuse.com/images/docs/llm-analytics.png)

## 功能

- [自定义仪表盘](https://langfuse.com/docs/metrics/features/custom-dashboards)：组合并查看不同维度的指标。
- [Metrics API](https://langfuse.com/docs/metrics/features/metrics-api)：通过 API 查询指标数据。
- [导出到 PostHog](https://langfuse.com/integrations/analytics/posthog)。
- [导出到 Mixpanel](https://langfuse.com/integrations/analytics/mixpanel)。

## 指标与维度

### 指标类型

- **质量（Quality）**：根据用户反馈、基于模型的评分、人工审核与通过 SDK/API 提交的自定义 Score 衡量。可以按时间、提示词版本、模型和用户分析质量。
- **成本和延迟（Cost & Latency）**：按用户、会话、地区、功能、模型和提示词版本分析成本与延迟。
- **请求量（Volume）**：根据接入的 Trace 数量和 Token 使用量统计。

### 分析维度

- **Trace 名称**：为 Trace 设置 `name`，区分使用场景和功能。
- **用户**：在 Trace 中添加 `userId`，按用户统计用量和费用。参阅[用户追踪](https://langfuse.com/docs/observability/features/users)。
- **标签**：为 Trace 添加[标签](https://langfuse.com/docs/observability/features/tags)，便于按场景、功能等条件筛选。
- **发布与版本**：分析 LLM 应用变更对指标的影响。

精确的指标定义请参阅 [Metrics API 文档](https://langfuse.com/docs/metrics/features/metrics-api)。

---

原文：[Metrics](https://langfuse.com/docs/metrics/overview) · 非官方中文翻译。
