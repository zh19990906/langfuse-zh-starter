---
title: 消息占位符
description: 在聊天提示词中的指定位置动态插入消息列表。
---
# 聊天提示词中的消息占位符

消息占位符允许在聊天提示词的指定位置插入消息数组，例如 `[{role: "...", content: "..."}]`。一个提示词中可定义多个占位符，并在运行时分别提供值。

此功能也支持 [Playground](/official/prompt-management/features/playground) 和提示词实验。

::: info
应用中使用消息占位符至少需要 Python `langfuse >= 3.1.0` 或 JS `langfuse >= 3.38.0`。
:::

## 创建消息占位符

在 UI 中点击 `Add message placeholder`，指定占位符的 `name`，应用使用该名称引用。

![提示词编辑器中的占位符](https://langfuse.com/images/docs/prompt-placeholder.png)

### Python SDK

```python
from langfuse import get_client
langfuse = get_client()
langfuse.create_prompt(
    name="movie-critic-chat",
    type="chat",
    prompt=[
        {"role": "system", "content": "You are an {{criticlevel}} movie critic"},
        {"type": "placeholder", "name": "chat_history"},
        {"role": "user", "content": "What should I watch next?"},
    ],
    labels=["production"],
)
```

### TypeScript SDK

```typescript
import { LangfuseClient } from "@langfuse/client";
const langfuse = new LangfuseClient();
await langfuse.prompt.create({
  name: "movie-critic-chat",
  type: "chat",
  prompt: [
    { role: "system", content: "You are an {{criticlevel}} movie critic" },
    { type: "placeholder", name: "chat_history" },
    { role: "user", content: "What should I watch next?" },
  ],
  labels: ["production"],
});
```

## 运行时填充

`ChatPromptClient` 使用 `.compile(variables, placeholders)` 填充占位符。推荐消息采用包含 `role` 和 `content` 的 `ChatMessage` 格式，但 `compile` 不会严格校验消息格式，因此也允许自定义格式。

### Python

```python
from langfuse import get_client
langfuse = get_client()
prompt = langfuse.get_prompt("movie-critic-chat")
compiled_prompt = prompt.compile(
    criticlevel="expert",
    chat_history=[
        {"role": "user", "content": "I love Ron Fricke movies like Baraka"},
        {"role": "user", "content": "Also, the Korean movie Memories of a Murderer"},
    ],
)
```

结果是系统消息、两条历史消息、最后一条用户问题组成的消息列表。

### TypeScript

```typescript
import { LangfuseClient } from "@langfuse/client";
const langfuse = new LangfuseClient();
const prompt = await langfuse.prompt.get("movie-critic-chat", { type: "chat" });
const compiledPrompt = prompt.compile(
  { criticlevel: "expert" },
  {
    chat_history: [
      { role: "user", content: "I love Ron Fricke movies like Baraka" },
      { role: "user", content: "Also, the Korean movie Memories of a Murderer" },
    ],
  }
);
```

## 与 LangChain 配合

LangChain 能够保留尚未解析的 `MessagesPlaceholder` 对象。

```python
from langfuse import get_client
from langchain_core.prompts import ChatPromptTemplate
langfuse = get_client()
langfuse_prompt = langfuse.get_prompt("movie-critic-chat")
langchain_prompt = ChatPromptTemplate.from_messages(
    langfuse_prompt.get_langchain_prompt()
)
```

```typescript
import { LangfuseClient } from "@langfuse/client";
import { ChatPromptTemplate } from "@langchain/core/prompts";
const langfuse = new LangfuseClient();
const langfusePrompt = await langfuse.prompt.get("movie-critic-chat", { type: "chat" });
const langchainPrompt = ChatPromptTemplate.fromMessages(
  langfusePrompt.getLangchainPrompt()
);
```

另见[变量](/official/prompt-management/features/variables)与[提示词组合](/official/prompt-management/features/composability)。

---

原文：[Message Placeholders](https://langfuse.com/docs/prompt-management/features/message-placeholders) · 非官方中文翻译。
