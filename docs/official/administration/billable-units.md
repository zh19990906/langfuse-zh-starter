---
title: 计费单位
description: 了解 Langfuse 计费单位的定义与计算方式。
---
# 计费单位

Langfuse 的[定价](https://langfuse.com/pricing)依据每个计费周期内摄入的单位数量。单位包括 [Trace](/official/observability/data-model)、Observation 和 [Score](/official/evaluation/scores/data-model)。

**单位总数 = Trace 数量 + Observation 数量 + Score 数量。**

## Langfuse Cloud

使用[定价计算器](https://langfuse.com/pricing?calculatorOpen=true)可以根据预计使用量估算每月费用。

## 自托管（OSS / Enterprise）

MIT 许可下的自托管开源版 Langfuse 免费，不按使用量计费。对于自托管 Enterprise，计费单位则是定价因素之一。

即使不需要计费，上述单位定义仍有助于量化数据规模，例如估算迁移到 Cloud 的费用或规划自托管资源容量。

可以在 Langfuse 内置的 **Langfuse Usage Management** 仪表盘中直接查看单位数量。该看板属于 Langfuse 提供的预置仪表盘，详情见[自定义仪表盘](/official/metrics/features/custom-dashboards)。

## 查看使用量

1. 进入 Langfuse 项目的 **Dashboards** 页面，打开 **Langfuse Usage Management**。
2. 将时间范围设为最近 **30 天**。
3. 汇总 **Total Trace Count**、**Total Observation Count** 和 **Total Score Count**。Score 需要将数值与类别两种统计项相加。

![Langfuse Usage Management 仪表盘列表](https://langfuse.com/images/docs/self-hosted-usage-management-dashboards-list.png)

![使用量看板](https://langfuse.com/images/docs/self-hosted-usage-management-dashboard.png)

例如：

```text
20,070 Traces + 119,500 Observations + 561 Scores
= 140,131 units / month
≈ 1,681,572 units / year
```

## 常见问题

### 如何查看 Langfuse Cloud 使用量？

通过 Dashboards 里的 **Usage Monitoring Report** 分析项目使用量。组织级别的费用管理可以使用[支出提醒](/official/administration/spend-alerts)。

### Langfuse 自身功能产生的单位也会计费吗？

会。只要 Trace、Observation 或 Score 存储在 Langfuse 中，就计为单位，无论它来自你的应用，还是 LLM-as-a-Judge、标注队列或实验等 Langfuse 功能。

### 如何降低 Cloud 使用成本？

参阅[降低使用成本指南](https://langfuse.com/faq/all/cutting-costs)。

---

原文：[Billable Units](https://langfuse.com/docs/administration/billable-units) · 非官方中文翻译。
