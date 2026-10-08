---
title: 追踪快速开始
description: 使用 Langfuse Cloud 或自托管，在 Python、TypeScript、OpenAI、LangChain、Vercel AI SDK 和 OTEL 中摄入第一条 Trace。
---
# 开始使用 Langfuse Tracing

本指南帮助你向 Langfuse 发送第一条 Trace。如果想先理解追踪的意义，请阅读[可观测性概览](/official/observability/overview)；追踪数据结构参阅[数据模型](/official/observability/data-model)。

Langfuse 开源，可使用有免费层的 [Langfuse Cloud](https://langfuse.com/cloud)或[自行部署](https://langfuse.com/self-hosting)。两者的埋点代码相同。

## 使用 Agent 安装

如果让 Coding Agent 自动接入，可安装 [Langfuse Agent Skill](https://github.com/langfuse/skills)。若 Agent 支持 MCP，也可添加不需要认证的文档 MCP（`https://langfuse.com/api/mcp`），便于在工作时查询最新文档。

告诉 Agent：

```text
Install the Langfuse Agent Skill from github.com/langfuse/skills
and use it to add tracing to this application with Langfuse
following best practices.
```

Cursor 可以安装[官方插件](https://cursor.com/marketplace/langfuse)，再要求“Add tracing to this application with Langfuse following best practices.”

手动安装 Skill：

```bash
npx skills add langfuse/skills --skill "langfuse"
npx skills add langfuse/skills --skill "langfuse" --agent "<agent-id>"
```

或者克隆后软链接：

```bash
git clone https://github.com/langfuse/skills.git /path/to/langfuse-skills
mkdir -p /path/to/<agent-skill-root>/skills
ln -s /path/to/langfuse-skills/skills/langfuse /path/to/<agent-skill-root>/skills/langfuse
```

## 手动安装

### 1. 获取 API Key

1. [注册 Cloud 账号](https://cloud.langfuse.com/auth/sign-up)或[自托管](https://langfuse.com/self-hosting)。
2. 在 Project Settings 创建 API Key。
3. 在应用中配置凭据：


```bash
LANGFUSE_SECRET_KEY="sk-lf-..."
LANGFUSE_PUBLIC_KEY="pk-lf-..."
LANGFUSE_BASE_URL="https://cloud.langfuse.com"
```


其他 Region：US `https://us.cloud.langfuse.com`；Japan `https://jp.cloud.langfuse.com`；HIPAA `https://hipaa.cloud.langfuse.com`。自托管使用自己的 Host。

### 2. 摄入第一条 Trace

根据框架或 SDK 选择下面的方案。若应用已经输出 OTEL Span，请优先使用 OTEL 指南。

#### Python OpenAI SDK

将标准 OpenAI 客户端改为 Langfuse 的 Drop-in Wrapper，就能自动记录 Prompt、Model 与 Output 并异步发送 Trace。
```bash
pip install langfuse
```


```python
from langfuse.openai import openai
```


```python
completion = openai.chat.completions.create(
  name="test-chat",
  model="gpt-4o",
  messages=[
      {"role": "system", "content": "You are a very accurate calculator. You output only the result of the calculation."},
      {"role": "user", "content": "1 + 1 = "}],
  metadata={"someMetadataKey": "someValue"},
)
```


#### JavaScript / TypeScript OpenAI

安装 Wrapper，设置上述环境变量，并先初始化 OpenTelemetry：
```bash
npm install @langfuse/openai
```


```typescript
import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";
const sdk = new NodeSDK({ spanProcessors: [new LangfuseSpanProcessor()] });
sdk.start();
```

用 `observeOpenAI` 包装普通 OpenAI Client，后续调用自动上报：
```typescript
import OpenAI from "openai";
import { observeOpenAI } from "@langfuse/openai";

const openai = observeOpenAI(new OpenAI());

const res = await openai.chat.completions.create({
    messages: [{ role: "system", content: "Tell me a story about a dog." }],
    model: "gpt-4o",
    max_tokens: 300,
});
```


#### Vercel AI SDK

Langfuse 基于 OpenTelemetry 集成 AI SDK 7。安装依赖并配置环境变量：
```bash
npm install ai @ai-sdk/openai @langfuse/vercel-ai-sdk @langfuse/tracing @langfuse/otel @opentelemetry/sdk-node
```

在应用启动时注册 Telemetry：
```typescript
import { registerTelemetry } from "ai";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";
import { LangfuseVercelAiSdkIntegration } from "@langfuse/vercel-ai-sdk";

const sdk = new NodeSDK({
  spanProcessors: [new LangfuseSpanProcessor()],
});

sdk.start();

registerTelemetry(new LangfuseVercelAiSdkIntegration());
```

注册后默认产生 Telemetry，可使用 `telemetry` 配置函数名、运行时属性或单次关闭：
```typescript
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai("gpt-5.1"),
  prompt: "What is the weather like today?",
  telemetry: {
    functionId: "weather-chat",
  },
});
```

详细文档：[Vercel AI SDK 集成](https://langfuse.com/integrations/frameworks/vercel-ai-sdk)。

#### Python LangChain

LangChain 通过 Callback Handler 将 Chain、Agent、LLM 事件记录为 Langfuse Trace。安装并配置：
```bash
pip install langfuse langchain-openai
```

初始化 Handler：
```python
from langfuse.langchain import CallbackHandler

langfuse_handler = CallbackHandler()
```

将其加入 `chain.invoke(..., config={"callbacks": [...]})`：
```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

llm = ChatOpenAI(model_name="gpt-4o")
prompt = ChatPromptTemplate.from_template("Tell me a joke about {topic}")
chain = prompt | llm

response = chain.invoke(
    {"topic": "cats"},
    config={"callbacks": [langfuse_handler]})
```

参考 [LangChain 集成](https://langfuse.com/integrations/frameworks/langchain)与[Notebook](https://colab.research.google.com/github/langfuse/langfuse-docs/blob/main/cookbook/integration_langchain.ipynb)。

#### TypeScript LangChain

安装 Langfuse SDK 与 LangChain 集成，设置环境变量并初始化 OTEL：
```bash
npm install @langfuse/core @langfuse/langchain
```


```typescript
import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";
const sdk = new NodeSDK({ spanProcessors: [new LangfuseSpanProcessor()] });
sdk.start();
```

创建 CallbackHandler：
```typescript
import { CallbackHandler } from "@langfuse/langchain";

// Initialize the Langfuse CallbackHandler
const langfuseHandler = new CallbackHandler();
```

在 Agent 调用配置中传入 Handler：
```typescript
import { createAgent, tool } from "@langchain/core/agents";
import * as z from "zod";

const getWeather = tool(
  (input) => `It's always sunny in ${input.city}!`,
  {
    name: "get_weather",
    description: "Get the weather for a given city",
    schema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
  }
);

const agent = createAgent({
  model: "openai:gpt-5-mini",
  tools: [getWeather],
});

console.log(
    await agent.invoke(
        { messages: [{ role: "user", content: "What's the weather in San Francisco?" }] },
        { callbacks: [langfuseHandler] }
    )
);
```


#### Python 原生 SDK

Python SDK 可以精确控制 Observation 的创建，也能配合其他框架。安装包：
```bash
pip install langfuse
```

配置凭据后可选择 Context Manager、`@observe()` 装饰器或手动创建 Observation。以下示例使用 Context Manager：
```python
from langfuse import get_client

langfuse = get_client()

# Create a span using a context manager
with langfuse.start_as_current_observation(as_type="span", name="process-request") as span:
    # Your processing logic here
    span.update(output="Processing complete")

    # Create a nested generation for an LLM call
    with langfuse.start_as_current_observation(as_type="generation", name="llm-response", model="gpt-3.5-turbo") as generation:
        # Your LLM call logic here
        generation.update(output="Generated response")

# All spans are automatically closed when exiting their context blocks


# Flush events in short-lived applications
langfuse.flush()
```

退出上下文会自动结束 Span；短生命周期程序调用 `langfuse.flush()`。![Python SDK 首条 Trace](https://langfuse.com/images/docs/observability/first-trace-python.png)
[查看示例 Trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/b8789d62464dc7627016d9748a48ad0d?observation=5c7c133ec919ded7&timestamp=2025-12-03T14:56:19.285Z)。

#### JS/TS 原生 SDK

安装 `@langfuse/tracing`、`@langfuse/otel` 与 OpenTelemetry Node SDK：
```bash
npm install @langfuse/tracing @langfuse/otel @opentelemetry/sdk-node
```

配置环境变量，最先初始化 OTEL：
```typescript
import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";
const sdk = new NodeSDK({ spanProcessors: [new LangfuseSpanProcessor()] });
sdk.start();
```

使用 `startActiveObservation()` 和 `startObservation()` 添加父子 Span/Generation：
```typescript
import { startActiveObservation, startObservation } from "@langfuse/tracing";

// startActiveObservation creates a trace for this block of work.
// Everything inside automatically becomes part of that trace.
await startActiveObservation("user-request", async (span) => {
  span.update({
    input: { query: "What is the capital of France?" },
  });

  // This generation will automatically be a child of "user-request" because of the startObservation function.
  const generation = startObservation(
    "llm-call",
    {
      model: "gpt-4",
      input: [{ role: "user", content: "What is the capital of France?" }],
    },
    { asType: "generation" },
  );

  // ... your real LLM call would happen here ...

  generation
    .update({
      output: { content: "The capital of France is Paris." }, // update the output of the generation
    })
    .end(); // mark this nested observation as complete

  // Add final information about the overall request
  span.update({ output: "Successfully answered." });
});
```


#### 直接发送 OpenTelemetry (OTLP)

已经有 OpenTelemetry 埋点时，可使用 SDK、Collector，甚至 `curl` 将 Span 直接发送到 Langfuse OTLP API。Langfuse 将这些 Span 称为 Observation，而 `span` 也是一种特定 Observation 类型。

```bash
export LANGFUSE_PUBLIC_KEY="pk-lf-..."
export LANGFUSE_SECRET_KEY="sk-lf-..."
export LANGFUSE_HOST="https://cloud.langfuse.com" # EU region

TRACE_ID=$(openssl rand -hex 16)
SPAN_ID=$(openssl rand -hex 8)
START=$(($(date +%s) * 1000000000))

curl -X POST "$LANGFUSE_HOST/api/public/otel/v1/traces" \
  -u "$LANGFUSE_PUBLIC_KEY:$LANGFUSE_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -H "x-langfuse-ingestion-version: 4" \
  --data-binary @- <<JSON
{"resourceSpans": [{"scopeSpans": [{"spans": [{
  "traceId": "$TRACE_ID",
  "spanId": "$SPAN_ID",
  "name": "hello-langfuse",
  "startTimeUnixNano": "$START",
  "endTimeUnixNano": "$((START + 1000000))",
  "attributes": [
    {
      "key": "langfuse.observation.input",
      "value": {"stringValue": "Hello, Langfuse!"}
    },
    {
      "key": "langfuse.observation.output",
      "value": {"stringValue": "Hello from curl!"}
    }
  ]
}]}]}]}
JSON
```

将 `LANGFUSE_HOST` 替换为实际的 Cloud Region 或自托管地址。模型、Token、User、Session 等 Attribute 的映射详见[OpenTelemetry 属性映射](https://langfuse.com/integrations/native/opentelemetry#property-mapping)。[OTLP API 参考](https://api.reference.langfuse.com/#tag/opentelemetry/POST/api/public/otel/v1/traces)。

#### 更多集成

Langfuse 还支持 [OpenTelemetry](https://langfuse.com/integrations/native/opentelemetry)、[Vercel AI SDK](https://langfuse.com/integrations/frameworks/vercel-ai-sdk)、[LlamaIndex](https://langfuse.com/integrations/frameworks/llamaindex)、[CrewAI](https://langfuse.com/integrations/frameworks/crewai)、[Ollama](https://langfuse.com/integrations/model-providers/ollama)、[LiteLLM](https://langfuse.com/integrations/gateways/litellm)、[AutoGen](https://langfuse.com/integrations/frameworks/autogen)、[Google ADK](https://langfuse.com/integrations/frameworks/google-adk) 等。查看[全部集成](https://langfuse.com/integrations)。

### 3. 在 Langfuse 中查看 Trace

运行应用后打开 Langfuse UI，查看刚刚创建的 Trace。[LangGraph 示例 Trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/7d5f970573b8214d1ca891251e42282c)。

[观看 Trace UI 演示](https://static.langfuse.com/docs-videos/trace-new-ui.mp4)。

[良好的 Trace 应该是什么样？](/official/observability/best-practices)

## 出现问题？

如果 Trace 太复杂或令人难以理解，可能需要调整埋点结构。先对照[最佳实践](/official/observability/best-practices)。官方动态 FAQ 列表可在[原文](https://langfuse.com/docs/observability/get-started)查询。

## 后续步骤

可以学习 [Langfuse Academy Monitoring](https://langfuse.com/academy/monitoring)，或直接使用：

- [Session](/official/observability/features/sessions)：多轮对话；
- [User ID](/official/observability/features/users)：按用户分析；
- [Tag](/official/observability/features/tags)：筛选属性；
- [Token 和 Cost Tracking](https://langfuse.com/docs/observability/features/token-and-cost-tracking)；
- [Score](/official/evaluation/scores/overview)：质量监控；
- [Alert](/official/observability/features/alerts)：指标告警；
- [自定义 Dashboard](/official/metrics/features/custom-dashboards)：成本、延迟、调用量和质量分析。

---

原文：[Get Started with Tracing](https://langfuse.com/docs/observability/get-started) · 非官方中文翻译；已迁入 7 个共享 SDK 示例组件，动态 FAQ 保留官方链接。
