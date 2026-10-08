---
title: tags
description: Langfuse 官方文档的中文翻译与适配。
---

# 标签（Tags）

标签可用于分类和筛选 Langfuse 的 Trace 与 Observation。每个标签是最长 **200 个字符**的字符串，单个 Observation 可以拥有多个标签。超过长度限制的标签会被丢弃。

一条 Trace 中全部 Observation 的标签会被自动合并到 Trace 对象。

## 界面中的用途

- 按一个或多个标签筛选 Trace 和 Observation，例如 `tags:(billing AND urgent)`。
- 在[自定义仪表盘](https://langfuse.com/docs/metrics/features/custom-dashboards)或 [Metrics API](/official/metrics/features/metrics-api)中按标签分析成本、延迟等指标。
- 按业务功能、API 端点或工作流分类，而不混淆环境、用户和 Session 属性。

![Trace 标签表格](https://langfuse.com/images/docs/tags-traces-table.png)

## 标签不能事后修改

Langfuse 的 Observation 使用不可变数据模型，因此不能在创建之后通过 UI 添加或编辑标签。

## Python SDK

```python
from langfuse import observe, propagate_attributes

@observe()
def my_function():
    with propagate_attributes(tags=["tag-1", "tag-2"]):
        return process_data()
```

## JavaScript / TypeScript

```typescript
import { startActiveObservation, propagateAttributes } from "@langfuse/tracing";

await startActiveObservation("my-operation", async () => {
  await propagateAttributes({ tags: ["tag-1", "tag-2"] }, async () => {
    // 子 Observation 继承标签
  });
});
```

OpenAI、LangChain 集成同样可以通过属性传播和框架回调配置标签。另请查看[元数据](/official/observability/features/metadata)和[环境](/official/observability/features/environments)。

原文：[Tags](https://langfuse.com/docs/observability/features/tags)。部分集成代码示例仍待补齐。
