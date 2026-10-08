---
title: 产品路线图
description: Langfuse 目前的产品研发方向与近期发布入口。
---
# Langfuse 产品路线图

Langfuse 是[开源](https://langfuse.com/open-source)项目，希望透明地分享未来的发展方向。本页概述当前投入的产品领域。

::: info
路线图只反映方向，不构成某项功能或发布日期的交付承诺。社区反馈可能改变优先级。
:::

Langfuse 每季度举办 Town Hall，演示新功能并讨论下一步计划。[观看演讲录像](https://www.youtube.com/watch?v=h2PvNRhDTcU)，或[订阅活动日历](https://langfuse.com/events)。

## 正在开发与后续规划

### 新能力

**Langfuse Gateway**
- 提供轻量的自带密钥（Bring Your Own Key）网关，面向 Cloud 和自托管部署支持虚拟密钥、访问控制。
- 将请求直接关联 Langfuse 追踪与成本统计，清晰查看模型使用和支出。

**主动发现问题**
- 构建 Topics，识别海量 Trace 中重复出现的用户意图、行为和失败模式。
- 展示聚类、异常值和代表性示例，减少逐条检查的工作量。

**Agent 对话转录**
- 在 Trace 和 Session 上推广统一的 Transcript 表示，使长时间运行的 Agent 交互更易阅读。
- 为 Topics 和其他持续改进流程打下基础。

**产品内 Agent 改进**
- 通过更强的沙箱工具帮助用户完成 LLM-as-a-Judge 校准等工作流。

**多 Span、Session 与轨迹评估**
- 利用 Observation 优先的数据模型评价完整的 Agent 交互过程。

**Skill 管理**
- 管理和版本化 Agent Skills，并追踪 Agent 如何使用这些技能。

**安全与身份认证改进**
- 为 API Key 增加细粒度权限，包括网关专用访问控制。
- 支持用户所有和服务账号所有的 API Key。
- 为 MCP Server 增加 OAuth 身份验证，以遵循用户级权限。

**组织级仪表盘**
- 在组织多个项目之间聚合展示成本、质量等指标。

**用量可见性与成本控制**
- 让组织管理员按项目、环境、Span 名称查看用量。
- 通过筛选器、采样和使用量限制控制数据摄入。

**自定义 Trace 查看器**
- 使用编码 Agent 构建和调整追踪查看器。

### 自托管改进

- 批量处理更多 S3 摄入事件，降低成本。
- 分阶段将摄入工作迁移到 Rust，减少延迟和成本。
- 扩展[政府环境加固](https://langfuse.com/self-hosting/configuration/hardening#hardening-for-government)，提供符合 FIPS 的部署支持和加固镜像。

## 最近发布

官方页面会从 Changelog 动态展示**最近 10 条更新**。为避免静态中文页面上的条目过期，直接查看[最新 Changelog](https://langfuse.com/changelog)，与原文的实时列表效果一致。

可以订阅官方产品更新邮件，接收不定期的新功能通知：[活动与订阅入口](https://langfuse.com/events)。

## 参与规划

- 在[功能建议页](https://langfuse.com/ideas)提交或投票支持改进建议。
- [报告 Bug](https://langfuse.com/new-issue)。
- 在 [Discord](https://langfuse.com/discord)交流实际使用案例。
- 参加[社区活动](https://langfuse.com/events)，与 Langfuse 团队讨论。

---

原文：[Roadmap](https://langfuse.com/docs/roadmap) · 非官方中文翻译；实时发布列表以官方 Changelog 为准。
