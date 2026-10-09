---
title: 可观测性与应用追踪
description: 了解 Langfuse 如何追踪 LLM 应用的请求、延迟、成本和运行步骤。
---

# 可观测性与应用追踪

生成式 AI 系统天然具有非确定性。缺乏可观测性工具时，调试应用几乎只能依靠猜测。完善的 AI 可观测性能帮助你了解应用内部发生了什么、为什么发生，并为评估提供真实的生产追踪记录，以便持续测量和改善系统。

核心能力是**应用追踪（Tracing）**：以结构化方式记录每一次请求，包括实际发送的提示词、模型响应、Token 用量、延迟，以及中间调用的工具和检索步骤。

![Langfuse 追踪示例](https://langfuse.com/images/docs/tracing-overview.png)

## 开始使用

首先[创建第一条追踪记录](/official/observability/get-started)，随后阅读[最佳实践](/official/observability/best-practices)。如果刚接触 AI 可观测性，建议先理解[核心概念](/official/observability/data-model)。

## 使用追踪数据

收集到追踪数据后，下一步是分析这些数据，并将分析结果用于改进 Agent。Langfuse Academy 的[监控课程](https://langfuse.com/academy/monitoring)介绍了具体做法。

常见的使用场景包括：

- 追踪[模型使用量与成本](/official/observability/features/token-and-cost-tracking)。
- 使用[评分](/official/evaluation/scores/overview)监控应用质量。
- 通过[自定义仪表盘](/official/metrics/features/custom-dashboards)分析成本、延迟、请求量和质量。
- 为超出阈值的指标设置[告警](/official/observability/features/alerts)。

## 常见问题

### 可观测性与追踪有什么区别？

**可观测性**指通过系统输出理解其内部状态的整体能力，涵盖追踪、指标和日志。**追踪**是一种具体技术，用于记录请求经过系统的过程，并保留各项操作之间的因果关系。对 LLM 应用而言，追踪尤为重要，因为它包含提示词、模型响应、工具调用及它们之间的关系。

### 什么是应用追踪？

应用追踪记录请求在系统中的完整生命周期：LLM 调用、检索、工具执行、自定义业务逻辑，以及各步骤的耗时、输入、输出和元数据。它让调试、性能优化和质量监控有据可依。

### Langfuse 和其他追踪解决方案有什么不同？

Langfuse 专为 LLM 应用设计，原生理解 Token 使用量、模型参数、提示词与补全内容、评估分数等概念。除了通用追踪，还提供 [LLM-as-a-Judge 评估](/official/evaluation/evaluation-methods/llm-as-a-judge)、[提示词管理](/official/prompt-management/overview)、[实验与数据集](/official/evaluation/experiments/datasets)以及[自定义仪表盘](/official/metrics/features/custom-dashboards)。它也是开源的，支持自托管。

### Langfuse 会增加应用延迟吗？

通常不会显著影响响应时间。Langfuse SDK 在后台异步发送追踪数据：事件先在本地排队，再批量发送。详情参阅[队列与批处理](/official/observability/features/queuing-batching)。

---

原文：[Observability & Application Tracing](https://langfuse.com/docs/observability/overview) · 非官方中文翻译
