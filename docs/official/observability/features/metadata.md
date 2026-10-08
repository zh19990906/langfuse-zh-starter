---
title: 元数据（Metadata）
description: 为 Observation 添加自定义元数据，帮助筛选、分析和关联调用记录。
---

# 元数据

可以为 Observation（参阅[数据模型](/official/observability/data-model)）添加元数据，以更好地理解应用并关联 Langfuse 中的不同观测记录。

Langfuse UI 和 API 均支持按元数据键筛选。

## 传播式元数据

使用 `propagate_attributes()`，可将元数据自动应用到一个上下文内创建的所有 Observation。传播式元数据使用键值对，其值必须是最长 **200 个字符**的字符串，键只能包含字母和数字。超过 200 字符的值会被丢弃。

### Python SDK：装饰器

```python
from langfuse import observe, propagate_attributes

@observe()
def process_data():
    with propagate_attributes(
        metadata={"source": "api", "region": "us-east-1", "user_tier": "premium"}
    ):
        result = perform_processing()
        return result
```

### Python SDK：手动创建 Observation

```python
from langfuse import get_client, propagate_attributes

langfuse = get_client()
with langfuse.start_as_current_observation(as_type="span", name="process-request") as root_span:
    with propagate_attributes(metadata={"request_id": "req_12345", "region": "us-east-1"}):
        with root_span.start_as_current_observation(
            as_type="generation", name="generate-response", model="gpt-4o"
        ) as gen:
            pass
```

### JavaScript / TypeScript：上下文管理

```ts
import { startActiveObservation, propagateAttributes } from "@langfuse/tracing";

await startActiveObservation("context-manager", async (span) => {
  span.update({ input: { query: "What is the capital of France?" } });
  await propagateAttributes(
    { metadata: { source: "api", region: "us-east-1", userTier: "premium" } },
    async () => {
      // 此处的子 Observation 会继承元数据
    }
  );
});
```

### JavaScript / TypeScript：observe 包装器

```ts
import { observe, propagateAttributes } from "@langfuse/tracing";

const processData = observe(
  async (data: string) => {
    return await propagateAttributes(
      { metadata: { source: "api", region: "us-east-1" } },
      async () => {
        const result = await performProcessing(data);
        return result;
      }
    );
  },
  { name: "process-data" }
);
const result = await processData("input");
```

### OpenAI Python 集成

```python
from langfuse import get_client, propagate_attributes
from langfuse.openai import openai

langfuse = get_client()
with langfuse.start_as_current_observation(as_type="span", name="openai-call"):
    with propagate_attributes(metadata={"source": "api", "region": "us-east-1"}):
        completion = openai.chat.completions.create(
            name="test-chat",
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a calculator."},
                {"role": "user", "content": "1 + 1 = "},
            ],
            temperature=0,
        )
```

### OpenAI JavaScript / TypeScript 集成

```ts
import OpenAI from "openai";
import { observeOpenAI } from "@langfuse/openai";
import { startActiveObservation, propagateAttributes } from "@langfuse/tracing";

await startActiveObservation("openai-call", async () => {
  await propagateAttributes(
    { metadata: { source: "api", region: "us-east-1" } },
    async () => {
      const res = await observeOpenAI(new OpenAI()).chat.completions.create({
        messages: [{ role: "system", content: "Tell me a story about a dog." }],
        model: "gpt-3.5-turbo",
        max_tokens: 300,
      });
    }
  );
});
```

### LangChain Python 集成

```python
from langfuse import get_client, propagate_attributes
from langfuse.langchain import CallbackHandler

langfuse = get_client()
langfuse_handler = CallbackHandler()

with langfuse.start_as_current_observation(as_type="span", name="langchain-call"):
    with propagate_attributes(metadata={"foo": "bar", "baz": "qux"}):
        response = chain.invoke(
            {"topic": "cats"},
            config={"callbacks": [langfuse_handler]},
        )
```

### LangChain JS/TS 集成

```ts
import { propagateAttributes } from "@langfuse/tracing";
import { CallbackHandler } from "@langfuse/langchain";

const langfuseHandler = new CallbackHandler();
await propagateAttributes({ metadata: { key: "value" } }, async () => {
  await chain.invoke(
    { input: "<user_input>" },
    { callbacks: [langfuseHandler] }
  );
});
```

### Flowise

Flowise 可以通过覆盖配置设置 `metadata`，详见[官方 Flowise 集成说明](https://langfuse.com/docs/flowise)。

## 非传播式元数据

如果只希望在单个 Observation 上存储元数据，可直接更新该 Observation。

### Python SDK

```python
from langfuse import get_client

langfuse = get_client()
with langfuse.start_as_current_observation(as_type="span", name="process-request") as root_span:
    root_span.update(metadata={"stage": "parsing"})
    langfuse.update_current_span(metadata={"stage": "parsing"})
```

### TypeScript SDK

```ts
import {
  startActiveObservation,
  updateActiveObservation,
} from "@langfuse/tracing";

await startActiveObservation("process-request", async (span) => {
  span.update({ metadata: { stage: "parsing" } });
  updateActiveObservation({ metadata: { stage: "parsing" } });
});
```

原文中的 GitHub Discussions 属于动态组件；可通过[官方文档](https://langfuse.com/docs/observability/features/metadata)继续访问。

---

原文：[Metadata](https://langfuse.com/docs/observability/features/metadata) · 非官方中文翻译。