---
title: 将提示词关联到追踪
description: 将 Langfuse 提示词版本与 Trace 关联，分析不同版本的效果。
---
# 将提示词关联到追踪

将提示词关联到 [Trace（追踪）](/official/observability/overview)，就能按提示词版本跟踪指标和评估结果。这是持续提升提示词质量的基础。

关联完成后，在 Langfuse 中打开某条生成类 [Observation](/official/observability/data-model) 时，可以看到产生该响应时使用的提示词。要查看统计指标，请进入相应提示词并打开 `Metrics` 标签页。

[观看提示词关联演示](https://static.langfuse.com/docs-videos/prompt-linking.mp4)。

## 如何建立关联

官方文档使用可复用的 MDX 交互组件展示不同 SDK 的关联方法。你可以在[原文的操作示例](/official/prompt-management/features/link-to-traces)查看完整代码。本页的组件示例尚未移植。

::: info
如果实际使用的是[回退提示词（Fallback Prompt）](/official/prompt-management/features/guaranteed-availability)，则不会创建关联。
:::

## 指标参考

提示词关联到追踪后，Langfuse 会自动按提示词版本聚合以下指标。可以在 UI 的 `Metrics` 标签页比较不同版本：

- 生成延迟中位数；
- 生成输入 Token 数中位数；
- 生成输出 Token 数中位数；
- 生成成本中位数；
- 生成次数；
- [评分](/official/evaluation/scores/data-model)中位数；
- 首次与最近一次生成的时间戳。

---

原文：[Link to Traces](https://langfuse.com/docs/prompt-management/features/link-to-traces) · 非官方中文翻译；SDK 动态示例尚待迁移。