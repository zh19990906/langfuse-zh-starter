---
title: sessions
description: Langfuse 官方文档的中文翻译与适配。
---

# 会话（Sessions）

LLM 应用的一次交互可能跨越多条 Trace。Langfuse 的 Session 可以把这些 Trace 关联起来，并提供**会话重放**，方便调试和分析整个对话。

![Session 视图](https://langfuse.com/images/docs/session.png)

在 Session 页面，可以重放交互、生成公开分享链接、收藏会话，还可以通过人工 Score 对会话评分。

## 设置 Session

通过 Observation 传播 `sessionId`。Session ID 是少于 **200 个字符**的 US-ASCII 字符串；超长值会被丢弃。同一 ID 的 Observation 及对应 Trace 被归为同一 Session。

### Python

```python
from langfuse import observe, propagate_attributes

@observe()
def process_request():
    with propagate_attributes(session_id="your-session-id"):
        return process_chat_message()
```

手动创建 Observation：

```python
from langfuse import get_client, propagate_attributes
langfuse = get_client()
with langfuse.start_as_current_observation(as_type="span", name="process-chat-message"):
    with propagate_attributes(session_id="chat-session-123"):
        pass
```

### JavaScript / TypeScript

```typescript
import { startActiveObservation, propagateAttributes } from "@langfuse/tracing";

await startActiveObservation("conversation", async () => {
  await propagateAttributes({ sessionId: "session-123" }, async () => {
    // 在这里创建的子 Observation 自动继承 Session ID
  });
});
```

### OpenAI / LangChain / Flowise

在 OpenAI 或 LangChain 的追踪上下文中同样可使用 `propagate_attributes(session_id=...) `（Python）或 `propagateAttributes({ sessionId: ... })`（JS/TS）。Flowise 集成自动将 `chatId` 映射到 Session ID，要求 Flowise **1.4.10 或以上**。

可通过 SDK/API 为 Session 添加评分，参阅[通过 API/SDK 评分](https://langfuse.com/docs/evaluation/evaluation-methods/scores-via-sdk)和[会话评估](https://langfuse.com/resources/engineering/evaluating-sessions-conversations)。

与把多条 Trace 合并到一个 Session 不同，跨服务共用一条 Trace 应使用[Trace ID 与分布式追踪](/official/observability/features/trace-ids-and-distributed-tracing)。

## 各集成的详细设置示例

### Python：嵌套 Observation

```python
from langfuse import get_client, propagate_attributes

langfuse = get_client()
with langfuse.start_as_current_observation(as_type="span", name="process-chat-message") as root_span:
    with propagate_attributes(session_id="chat-session-123"):
        with root_span.start_as_current_observation(
            as_type="generation", name="generate-response", model="gpt-4o"
        ) as gen:
            pass
```

### TypeScript：`observe` 包装器

```typescript
import { observe, propagateAttributes } from "@langfuse/tracing";

const processChatMessage = observe(
  async (message: string) => {
    return await propagateAttributes({ sessionId: "session-123" }, async () => {
      const result = await processMessage(message);
      return result;
    });
  },
  { name: "process-chat-message" },
);
const result = await processChatMessage("Hello!");
```

### Python：OpenAI

```python
from langfuse import get_client, propagate_attributes
from langfuse.openai import openai

langfuse = get_client()
with langfuse.start_as_current_observation(as_type="span", name="openai-call"):
    with propagate_attributes(session_id="your-session-id"):
        completion = openai.chat.completions.create(
            name="test-chat",
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a calculator."},
                {"role": "user", "content": "1 + 1 = "}
            ],
            temperature=0,
        )
```

### Python：LangChain

```python
from langfuse import get_client, propagate_attributes
from langfuse.langchain import CallbackHandler

langfuse = get_client()
handler = CallbackHandler()
with langfuse.start_as_current_observation(as_type="span", name="langchain-call"):
    with propagate_attributes(session_id="your-session-id"):
        chain.invoke({"animal": "dog"}, config={"callbacks": [handler]})
```

### TypeScript：LangChain

```typescript
import { startActiveObservation, propagateAttributes } from "@langfuse/tracing";
import { CallbackHandler } from "@langfuse/langchain";

const langfuseHandler = new CallbackHandler();
await startActiveObservation("langchain-call", async () => {
  await propagateAttributes({ sessionId: "your-session-id" }, async () => {
    await chain.invoke(
      { input: "<user_input>" },
      { callbacks: [langfuseHandler] },
    );
  });
});
```

官方文档中的属性传播限制说明由复用组件渲染，可参考[原文 Session 文档](https://langfuse.com/docs/observability/features/sessions)。GitHub Discussions 为动态列表，未复制。

原文：[Sessions](https://langfuse.com/docs/observability/features/sessions)。正文及各框架 SDK 示例已补齐。
