---
title: 通过 OpenTelemetry 运行实验
description: 在 Span 上附加实验和测试项属性，使 Langfuse 将 Trace 组织为实验。
---
# 通过 OpenTelemetry 运行实验

在 [OpenTelemetry](https://langfuse.com/integrations/native/opentelemetry) Span 上附加实验元数据，Langfuse 就能将相关 Trace 组织为一次实验运行。

::: info 使用 Python 或 TypeScript？
建议使用 [SDK 实验](https://langfuse.com/docs/evaluation/experiments/experiments-via-sdk)。Langfuse SDK 会自动设置相关属性。
:::

参阅[实验数据模型](https://langfuse.com/docs/evaluation/experiments/data-model)，了解数据集、实验运行、测试项、Trace 与 Score 之间的关系。

## 接入实验 Span

在 OpenTelemetry Span 中设置实验与测试项属性，Langfuse 就能把这些追踪聚合为一次实验。完整的属性列表、Baggage 传播方式和逐项循环示例见：

[通过 OpenTelemetry 接入实验 Span](https://langfuse.com/integrations/native/opentelemetry/experiments)

Trace 数据接入后，可以通过 [Experiments API](https://langfuse.com/docs/api-and-data-platform/features/public-api#experiments)列举实验运行记录并获取测试项。

---

原文：[Experiments via OpenTelemetry](https://langfuse.com/docs/evaluation/experiments/experiments-via-opentelemetry) · 非官方中文翻译。