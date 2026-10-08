---
title: 版本与兼容性
description: Langfuse 各版本、GA 状态、SDK 与服务端功能兼容矩阵。
---

# 版本与兼容性

Langfuse 的 Cloud、Self-hosted Server、Python SDK 与 JS/TS SDK 使用独立的版本号。升级前需要同时核对 SDK 与服务端的版本兼容性，特别是 Observation、Metrics 和 Score API 的版本切换。

## Langfuse 版本

Cloud 由官方负责更新，自托管环境由运维团队控制升级时间。不同 SDK 主版本有不同的 API 路径与数据模型。

## GA 版本

GA（General Availability，正式可用）表示官方已发布稳定版本。新功能是否可在旧版 SDK 或自托管实例使用，应查看原文实时维护的 GA 版本与最低要求。

## 功能可用性矩阵

不同 SDK/Server 组合不保证拥有相同能力。例如以 Observation 为核心的新数据查询和 Metrics v2 依赖 Langfuse v4 服务端；旧版服务端必须使用对应 Legacy API 路径。

::: warning
兼容矩阵可能随 SDK 发布更新。准备生产升级时，应以[官方实时矩阵](https://langfuse.com/docs/compatibility#sdk-server)核对确切版本，不应只依赖历史页面中的数字。
:::

## 常见问题

跨主版本迁移推荐依次执行官方迁移步骤，并在测试项目验证 Span 导出、Trace 结构、评分与数据集运行。

- [Python v2 → v3](/official/observability/sdk/upgrade-path/python-v2-to-v3)
- [Python v3 → v4](/official/observability/sdk/upgrade-path/python-v3-to-v4)
- [JS/TS v3 → v4](/official/observability/sdk/upgrade-path/js-v3-to-v4)
- [JS/TS v4 → v5](/official/observability/sdk/upgrade-path/js-v4-to-v5)


::: info 翻译状态
本页已完成主要章节的中文整理，并保存官方代码块；源文档的复杂表格、FAQ 和部分细节尚需逐段精校，因此当前标记为**待完善译稿**，不应视为完整质量验收。
:::

原文：[版本与兼容性](https://langfuse.com/docs/compatibility)。
