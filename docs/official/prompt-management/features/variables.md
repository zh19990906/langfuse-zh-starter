---
title: 提示词变量
description: 使用运行时变量向提示词插入动态文本。
---
# 提示词变量

变量是提示词中的动态字符串占位符。它们让你在不修改提示词定义的前提下，运行时生成不同内容的提示词。

所有提示词均使用 `{{variable}}` 语法。通过 Langfuse 获取提示词后，调用 `.compile()` 时提供变量值，SDK 会将其插入模板。

## 创建带变量的提示词

### 界面

在提示词文本中输入双花括号，例如 `{{variable_name}}`，即可定义变量。文本提示词和聊天提示词都支持变量；聊天提示词可以在任意消息内容中使用。

![在 UI 中定义变量](https://langfuse.com/images/docs/playground-variables.png)

### Python

```python
from langfuse import get_client
langfuse = get_client()

langfuse.create_prompt(
    name="movie-critic", type="text",
    prompt="As a {{criticLevel}} movie critic, do you like {{movie}}?",
    labels=["production"],
)

langfuse.create_prompt(
    name="movie-critic-chat", type="chat",
    prompt=[
        {"role": "system", "content": "You are a {{criticLevel}} movie critic."},
        {"role": "user", "content": "What do you think about {{movie}}?"},
    ],
    labels=["production"],
)
```

### JavaScript / TypeScript

```typescript
import { LangfuseClient } from "@langfuse/client";
const langfuse = new LangfuseClient();
await langfuse.prompt.create({
  name: "movie-critic",
  type: "text",
  prompt: "As a {{criticLevel}} movie critic, do you like {{movie}}?",
  labels: ["production"],
});
await langfuse.prompt.create({
  name: "movie-critic-chat",
  type: "chat",
  prompt: [
    { role: "system", content: "You are a {{criticLevel}} movie critic." },
    { role: "user", content: "What do you think about {{movie}}?" },
  ],
  labels: ["production"],
});
```

## 运行时编译变量

调用 `.compile()`，Python 使用关键字参数，JavaScript/TypeScript 使用对象参数。

```python
from langfuse import get_client
langfuse = get_client()
prompt = langfuse.get_prompt("movie-critic")
compiled_prompt = prompt.compile(criticLevel="expert", movie="Dune 2")
response = openai.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": compiled_prompt}],
)
```

```typescript
import { LangfuseClient } from "@langfuse/client";
const langfuse = new LangfuseClient();
const prompt = await langfuse.prompt.get("movie-critic", { type: "text" });
const compiledPrompt = prompt.compile({
  criticLevel: "expert", movie: "Dune 2",
});
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: compiledPrompt }],
});
```

## 与 LangChain 配合

Python 文本提示词：

```python
from langfuse import get_client
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate
langfuse = get_client()
langfuse_prompt = langfuse.get_prompt("movie-critic")
langchain_prompt = PromptTemplate.from_template(langfuse_prompt.get_langchain_prompt())
compiled = langchain_prompt.format(criticLevel="expert", movie="Dune 2")
langfuse_chat_prompt = langfuse.get_prompt("movie-critic-chat")
langchain_chat_prompt = ChatPromptTemplate.from_messages(
    langfuse_chat_prompt.get_langchain_prompt()
)
compiled_messages = langchain_chat_prompt.format_messages(
    criticLevel="expert", movie="Dune 2"
)
```

TypeScript 文本和聊天提示词：

```typescript
import { LangfuseClient } from "@langfuse/client";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";
const langfuse = new LangfuseClient();
const langfusePrompt = await langfuse.prompt.get("movie-critic", { type: "text" });
const langchainPrompt = PromptTemplate.fromTemplate(
  langfusePrompt.getLangchainPrompt()
);
const compiled = await langchainPrompt.format({
  criticLevel: "expert", movie: "Dune 2",
});
const langfuseChatPrompt = await langfuse.prompt.get("movie-critic-chat", { type: "chat" });
const langchainChatPrompt = ChatPromptTemplate.fromMessages(
  langfuseChatPrompt.getLangchainPrompt()
);
const compiledMessages = await langchainChatPrompt.formatMessages({
  criticLevel: "expert", movie: "Dune 2",
});
```

相关功能：[提示词组合](/official/prompt-management/features/composability)、[消息占位符](/official/prompt-management/features/message-placeholders)。原文的动态 FAQ 请通过[官方页面](/official/prompt-management/features/variables)访问。

---

原文：[Variables](https://langfuse.com/docs/prompt-management/features/variables) · 非官方中文翻译。
