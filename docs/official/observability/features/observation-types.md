---
title: observation types
description: Langfuse 官方文档的中文翻译与适配。
---

# Observation 类型

Langfuse 使用 Observation 类型为记录提供更丰富的语义，并支持按类型筛选。Observation 是所有追踪步骤的统称，而 `span` 也是其中一种特定类型。

## 可用类型

包括 `span`、`event`、`generation`、`agent`、`tool`、`chain`、`retriever`、`embedding`、`evaluator`、`guardrail` 等。官方完整类型列表由动态组件维护，请参阅[原文](https://langfuse.com/docs/observability/features/observation-types)。

Agent 框架的集成通常自动设置类型，例如 LangChain 的 `@tool` 会将对应步骤标记为 `tool`。也可以手动设置。

## Python SDK

需要 Python SDK **3.3.1 或以上**。使用 `as_type`：

```python
from langfuse import observe

@observe(as_type="agent")
def run_agent_workflow(query):
    return process_with_tools(query)

@observe(as_type="tool")
def call_weather_api(location):
    return weather_service.get_weather(location)
```

手动创建：

```python
from langfuse import get_client
langfuse = get_client()
with langfuse.start_as_current_observation(
    as_type="embedding", name="embedding-generation"
) as obs:
    embeddings = model.encode(["text to embed"])
    obs.update(output=embeddings)
```

## TypeScript SDK

类型功能从 TypeScript SDK **4.0.0** 起支持。通过 `asType` 指定：

```typescript
import { startActiveObservation } from "@langfuse/tracing";

await startActiveObservation(
  "weather-api-call",
  async (observation) => {
    observation.update({ input: { location: "Paris" } });
    const weather = await weatherService.getWeather("Paris");
    observation.update({ output: weather });
  },
  { asType: "tool" }
);
```

`observe()` 包装器及手动 Observation 同样支持 `asType`。可使用 `generation`、`retriever` 等准确表示 LLM 生成和检索操作。

原文：[Observation Types](https://langfuse.com/docs/observability/features/observation-types)。动态类型列表和更多 TS 示例待迁移。
