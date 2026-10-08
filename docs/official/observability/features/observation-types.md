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


## 官方各类型示例（按 SDK 与 API 风格）

Langfuse 的 `span` 既是通用 OTel Span 概念，也是 Observation 的一个具体类型。Python 创建时使用 `as_type`，TypeScript 使用 `asType`；LangChain 的 `@tool` 等集成可自动设置 `tool` 类型。Python SDK 要求至少 v3.3.1 才支持这些类型。

### Python：装饰器与上下文管理器

```python
from langfuse import observe

# Agent workflow
@observe(as_type="agent")
def run_agent_workflow(query):
    # Agent reasoning and tool orchestration
    return process_with_tools(query)

# Tool calls
@observe(as_type="tool")
def call_weather_api(location):
    # External API call
    return weather_service.get_weather(location)
```

```python
from langfuse import get_client

langfuse = get_client()

# Start observation with specific type
with langfuse.start_as_current_observation(
    as_type="embedding",
    name="embedding-generation"
) as obs:
    embeddings = model.encode(["text to embed"])
    obs.update(output=embeddings)

# Start observation with specific type
transform_span = langfuse.start_observation(
    as_type="chain",
    name="transform-text"
)
transformed_text = transform_text(["text to transform"])
transform_span.update(output=transformed_text)
```

### TypeScript：Context Manager

```typescript
import { startActiveObservation } from "@langfuse/tracing";

// Agent workflow
await startActiveObservation(
  "agent-workflow",
  async (agentObservation) => {
    agentObservation.update({
      input: { query: "What's the weather in Paris?" },
      metadata: { strategy: "tool-calling" }
    });

    // Agent reasoning and tool orchestration
    const result = await processWithTools(query);
    agentObservation.update({ output: result });
  },
  { asType: "agent" }
);

// Tool call
await startActiveObservation(
  "weather-api-call",
  async (toolObservation) => {
    toolObservation.update({
      input: { location: "Paris", units: "metric" },
    });

    const weather = await weatherService.getWeather("Paris");
    toolObservation.update({ output: weather });
  },
  { asType: "tool" }
);

// Chain operation
await startActiveObservation(
  "retrieval-chain",
  async (chainObservation) => {
    chainObservation.update({
      input: { query: "AI safety principles" },
    });

    const docs = await retrieveDocuments(query);
    const context = await processDocuments(docs);
    chainObservation.update({ output: { context, documentCount: docs.length } });
  },
  { asType: "chain" }
);
```

```typescript
// LLM Generation
await startActiveObservation(
  "llm-completion",
  async (generationObservation) => {
    generationObservation.update({
      input: [{ role: "user", content: "Explain quantum computing" }],
      model: "gpt-4",
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: "Explain quantum computing" }],
    });

    generationObservation.update({
      output: completion.choices[0].message.content,
      usageDetails: {
        input: completion.usage.prompt_tokens,
        output: completion.usage.completion_tokens,
      },
    });
  },
  { asType: "generation" }
);

// Embedding generation
await startActiveObservation(
  "text-embedding",
  async (embeddingObservation) => {
    const texts = ["Hello world", "How are you?"];
    embeddingObservation.update({
      input: texts,
      model: "text-embedding-ada-002",
    });

    const embeddings = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: texts,
    });

    embeddingObservation.update({
      output: embeddings.data.map(e => e.embedding),
      usageDetails: { input: embeddings.usage.prompt_tokens },
    });
  },
  { asType: "embedding" }
);

// Document retrieval
await startActiveObservation(
  "vector-search",
  async (retrieverObservation) => {
    retrieverObservation.update({
      input: { query: "machine learning", topK: 5 },
    });

    const results = await vectorStore.similaritySearch(query, 5);
    retrieverObservation.update({
      output: results,
      metadata: { vectorStore: "pinecone", similarity: "cosine" },
    });
  },
  { asType: "retriever" }
);
```

### TypeScript：函数包装器

```typescript
import { observe, updateActiveObservation } from "@langfuse/tracing";

// Agent function
const runAgentWorkflow = observe(
  async (query: string) => {
    updateActiveObservation({
      metadata: { strategy: "react", maxIterations: 5 }
    });

    // Agent logic here
    return await processQuery(query);
  },
  {
    name: "agent-workflow",
    asType: "agent"
  }
);

// Tool function
const callWeatherAPI = observe(
  async (location: string) => {
    updateActiveObservation({
      metadata: { provider: "openweather", version: "2.5" }
    });

    return await weatherService.getWeather(location);
  },
  {
    name: "weather-tool",
    asType: "tool"
  }
);

// Evaluation function
const evaluateResponse = observe(
  async (question: string, answer: string) => {
    updateActiveObservation({
      metadata: { criteria: ["relevance", "accuracy", "completeness"] }
    });

    const score = await llmEvaluator.evaluate(question, answer);
    return { score, feedback: "Response is accurate and complete" };
  },
  {
    name: "response-evaluator",
    asType: "evaluator"
  }
);
```

```typescript
// Generation wrapper
const generateCompletion = observe(
  async (messages: any[], model: string = "gpt-4") => {
    updateActiveObservation({
      model,
      metadata: { temperature: 0.7, maxTokens: 1000 }
    }, { asType: "generation" });

    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    updateActiveObservation({
      usageDetails: {
        input: completion.usage.prompt_tokens,
        output: completion.usage.completion_tokens,
      }
    }, { asType: "generation" });

    return completion.choices[0].message.content;
  },
  {
    name: "llm-completion",
    asType: "generation"
  }
);

// Chain wrapper
const processDocumentChain = observe(
  async (documents: string[]) => {
    updateActiveObservation({
      metadata: { documentCount: documents.length }
    });

    const summaries = await Promise.all(
      documents.map(doc => summarizeDocument(doc))
    );

    return await combineAndRank(summaries);
  },
  {
    name: "document-processing-chain",
    asType: "chain"
  }
);

// Guardrail wrapper
const contentModerationCheck = observe(
  async (content: string) => {
    updateActiveObservation({
      metadata: { provider: "openai-moderation", version: "stable" }
    });

    const moderation = await openai.moderations.create({
      input: content,
    });

    const flagged = moderation.results[0].flagged;
    updateActiveObservation({
      output: { flagged, categories: moderation.results[0].categories }
    });

    if (flagged) {
      throw new Error("Content violates usage policies");
    }

    return { safe: true, content };
  },
  {
    name: "content-guardrail",
    asType: "guardrail"
  }
);
```

### TypeScript：手动创建 Observation

```typescript
import { startObservation } from "@langfuse/tracing";

// Agent observation
const agentSpan = startObservation(
  "multi-step-agent",
  {
    input: { task: "Book a restaurant reservation" },
    metadata: { agentType: "planning", tools: ["search", "booking"] }
  },
  { asType: "agent" }
)

// Nested tool calls within the agent
const searchTool = agentSpan.startObservation(
  "restaurant-search",
  {
    input: { location: "New York", cuisine: "Italian", date: "2024-01-15" }
  },
  { asType: "tool" }
);

searchTool.update({
  output: { restaurants: ["Mario's", "Luigi's"], count: 2 }
});
searchTool.end();

const bookingTool = agentSpan.startObservation(
  "make-reservation",
  {
    input: { restaurant: "Mario's", time: "7:00 PM", party: 4 }
  },
  { asType: "tool" }
);

bookingTool.update({
  output: { confirmed: true, reservationId: "RES123" }
});
bookingTool.end();

agentSpan.update({
  output: { success: true, reservationId: "RES123" }
});
agentSpan.end();
```

```typescript
// Embedding observation
const embeddingObs = startObservation(
  "document-embedding",
  {
    input: ["Document 1 content", "Document 2 content"],
    model: "text-embedding-ada-002"
  },
  { asType: "embedding" }
);

const embeddings = await generateEmbeddings(documents);
embeddingObs.update({
  output: embeddings,
  usageDetails: { input: 150 }
});
embeddingObs.end();

// Retriever observation
const retrieverObs = startObservation(
  "semantic-search",
  {
    input: { query: "What is machine learning?", topK: 10 },
    metadata: { index: "knowledge-base", similarity: "cosine" }
  },
  { asType: "retriever" }
);

const searchResults = await vectorDB.search(query, 10);
retrieverObs.update({
  output: { documents: searchResults, scores: searchResults.map(r => r.score) }
});
retrieverObs.end();

// Evaluator observation
const evalObs = startObservation(
  "hallucination-check",
  {
    input: {
      context: "The capital of France is Paris.",
      response: "The capital of France is London."
    },
    metadata: { evaluator: "llm-judge", model: "gpt-4" }
  },
  { asType: "evaluator" }
);

const evaluation = await checkHallucination(context, response);
evalObs.update({
  output: {
    score: 0.1,
    reasoning: "Response contradicts the provided context",
    verdict: "hallucination_detected"
  }
});
evalObs.end();

// Guardrail observation
const guardrailObs = startObservation(
  "safety-filter",
  {
    input: { userMessage: "How to make explosives?" },
    metadata: { policy: "content-safety-v2" }
  },
  { asType: "guardrail" }
);

const safetyCheck = await contentFilter.check(userMessage);
guardrailObs.update({
  output: {
    blocked: true,
    reason: "harmful_content",
    category: "dangerous_instructions"
  }
});
guardrailObs.end();
```

::: info 校验说明
此处补齐上游示例；具体依赖和运行环境仍需验证。原文：[observation-types](https://langfuse.com/docs/observability/features/observation-types)。
:::
