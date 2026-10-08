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


## 更多集成示例

### Python：手动 Observation

```python
from langfuse import get_client, propagate_attributes
langfuse = get_client()
with langfuse.start_as_current_observation(as_type="span", name="my-operation") as root_span:
    with propagate_attributes(tags=["tag-1", "tag-2"]):
        with root_span.start_as_current_observation(
            as_type="generation", name="llm-call", model="gpt-4o"
        ) as gen:
            pass
```

### Python：OpenAI 集成

```python
from langfuse import get_client, propagate_attributes
from langfuse.openai import openai
langfuse = get_client()
with langfuse.start_as_current_observation(as_type="span", name="openai-call"):
    with propagate_attributes(tags=["tag-1", "tag-2"]):
        completion = openai.chat.completions.create(
            name="test-chat", model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a calculator."},
                {"role": "user", "content": "1 + 1 = "},
            ],
            temperature=0,
        )
```

也可以在不创建外层 Observation 时，给 OpenAI 调用传入 `metadata={"langfuse_tags": ["tag-1", "tag-2"]}`。

### TypeScript：OpenAI 集成

```typescript
import OpenAI from "openai";
import { observeOpenAI } from "@langfuse/openai";
import { startActiveObservation, propagateAttributes } from "@langfuse/tracing";

await startActiveObservation("openai-call", async () => {
  await propagateAttributes({ tags: ["tag-1", "tag-2"] }, async () => {
    await observeOpenAI(new OpenAI()).chat.completions.create({
      messages: [{ role: "system", content: "Tell me a story about a dog." }],
      model: "gpt-3.5-turbo", max_tokens: 300,
    });
  });
});
```

### Python：LangChain 集成

```python
from langfuse import get_client, propagate_attributes
from langfuse.langchain import CallbackHandler
langfuse = get_client()
langfuse_handler = CallbackHandler()
with langfuse.start_as_current_observation(as_type="span", name="langchain-call"):
    with propagate_attributes(tags=["tag-1", "tag-2"]):
        response = chain.invoke(
            {"topic": "cats"}, config={"callbacks": [langfuse_handler]}
        )
```

也可以在 LangChain 的 `config.metadata` 中设置 `langfuse_tags`。

### TypeScript：LangChain 集成

```typescript
import { propagateAttributes } from "@langfuse/tracing";
import { CallbackHandler } from "@langfuse/langchain";
const handler = new CallbackHandler();
await propagateAttributes({ tags: ["tag-1", "tag-2"] }, async () => {
  await chain.invoke({ input: "<user_input>" }, { callbacks: [handler] });
});
```

另外可通过 `new CallbackHandler({ tags: ["tag-1", "tag-2"] })` 设置，或在 `chain.invoke()` 的配置中传入 `tags`。

## 相关资源

- [筛选搜索栏](https://langfuse.com/docs/observability/features/filter-search-bar)
- [Score 与 Tag 的区别](https://langfuse.com/docs/evaluation/scores/overview#scores-vs-tags)
- [追踪最佳实践](https://langfuse.com/docs/observability/best-practices)

原文：[Tags](https://langfuse.com/docs/observability/features/tags)。正文与主要 SDK 示例已翻译。
