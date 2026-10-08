---
title: 支出提醒
description: 当组织的 Langfuse Cloud 支出超过预设金额时接收通知。
---
# 支出提醒

此功能适用于 Langfuse Cloud 的 Core、Pro 和 Enterprise 方案，不适用于 Hobby 和自托管版本。实际功能可用性请以官方最新定价为准。

你可以配置支出提醒，在 **Langfuse Cloud** 账单金额超过预设阈值时接收邮件通知。它监控的是向 Langfuse 支付的 Cloud 服务费用，**不是**可观测性中记录的 LLM 或模型调用成本。后者请参阅 [LLM 成本管理](https://langfuse.com/resources/engineering/llm-cost-management)。

通过组织设置中的 **Billing（账单）** 标签页进行配置。

![在 Langfuse 中配置支出提醒](https://langfuse.com/images/docs/spend-alerts.png)

## 工作方式

支出提醒会监控组织的 Langfuse Cloud 订阅总支出。你可以使用组织的账单币种设置自定义阈值。当支出超过阈值时，会收到邮件。

**阈值计算**：根据预计总账单评估支出，包含基础费用、按使用量计算的费用、折扣及税费。

**监控频率**：系统每 60–90 分钟检查一次各组织的使用情况，以便及时通知。

**通知对象**：具有 **Owner（所有者）** 或 **Admin（管理员）** 角色的全部组织成员。为了避免频繁通知，每条已配置的提醒在一个账单周期中最多触发一次。

---

原文：[Spend Alerts](https://langfuse.com/docs/administration/spend-alerts) · 非官方中文翻译。