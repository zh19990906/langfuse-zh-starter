---
title: 提示词管理快速开始
description: Langfuse 官方文档的中文翻译与适配。
---

# 提示词管理快速开始

本指南介绍如何创建、读取和使用 Langfuse 提示词。如需了解原理，先阅读[提示词管理概览](/official/prompt-management/overview)与[数据模型](/official/prompt-management/data-model)。

## 使用编码 Agent 安装

可安装 [Langfuse Agent Skill](https://github.com/langfuse/skills)，让编程助手迁移提示词：

```text
Install the Langfuse Agent Skill from github.com/langfuse/skills
and use it to migrate the prompts in this codebase to Langfuse.
```

Cursor 用户可使用 [Langfuse 插件](https://cursor.com/marketplace/langfuse)。

手动安装：

```bash
npx skills add langfuse/skills --skill "langfuse"
# 指定 Agent
npx skills add langfuse/skills --skill "langfuse" --agent "<agent-id>"
```

也可以克隆仓库，并将 `skills/langfuse` 链接到 Agent 的 Skill 目录。

## 手动接入

1. 注册 [Langfuse Cloud](https://langfuse.com/cloud) 或[自托管](https://langfuse.com/self-hosting)。
2. 在项目设置中创建 API 密钥。
3. 在 Langfuse UI 创建文本或聊天提示词，配置标签。
4. 在代码中使用 Langfuse SDK 获取并编译提示词。

```python
from langfuse import get_client
langfuse = get_client()
prompt = langfuse.get_prompt("my-prompt")
compiled = prompt.compile(name="Alice")
```

原文的详细创建与使用示例来自复用 MDX 组件，需在后续补齐，参见[官方快速开始](https://langfuse.com/docs/prompt-management/get-started)。

::: info
Langfuse SDK 会在客户端缓存提示词，首次获取后通常从内存返回，避免增加请求延迟。全新实例需要更严格的可用性保障时，参阅[回退提示词](/official/prompt-management/features/guaranteed-availability)。
:::

## 创建提示词：官方共享示例

在 UI 中创建或更新提示词时，需要选择 **Text** 或 **Chat** 类型。创建后不能更改类型。[查看 UI 操作视频](https://langfuse.com/docs/prompt-management/get-started)（官方原始视频链接）。

### Python SDK

```bash
pip install langfuse
```

先配置 `LANGFUSE_PUBLIC_KEY`、`LANGFUSE_SECRET_KEY` 和 `LANGFUSE_BASE_URL`。

```python
from langfuse import get_client
langfuse = get_client()

langfuse.create_prompt(
    name="movie-critic", type="text",
    prompt="As a {{criticlevel}} movie critic, do you like {{movie}}?",
    labels=["production"]
)
langfuse.create_prompt(
    name="movie-critic-chat", type="chat",
    prompt=[
        {"role": "system", "content": "You are an {{criticlevel}} movie critic"},
        {"role": "user", "content": "Do you like {{movie}}?"},
    ],
    labels=["production"]
)
```

若已存在相同 `name` 的提示词，创建操作会生成一个新版本。

### TypeScript SDK

```bash
npm i @langfuse/client
```

```typescript
import { LangfuseClient } from "@langfuse/client";
const langfuse = new LangfuseClient();

await langfuse.prompt.create({
  name: "movie-critic", type: "text",
  prompt: "As a {{criticlevel}} critic, do you like {{movie}}?",
  labels: ["production"]
});
await langfuse.prompt.create({
  name: "movie-critic-chat", type: "chat",
  prompt: [
    { role: "system", content: "You are an {{criticlevel}} movie critic" },
    { role: "user", content: "Do you like {{movie}}?" }
  ],
  labels: ["production"]
});
```

### HTTP API

```bash
curl -X POST "https://cloud.langfuse.com/api/public/v2/prompts" \
  -u "your-public-key:your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "chat", "name": "movie-critic",
    "prompt": [
      {"role": "system", "content": "You are an {{criticlevel}} movie critic"},
      {"role": "user", "content": "Do you like {{movie}}?"}
    ]
  }'
```

已有硬编码提示词可以使用 [Langfuse Agent Skill](/official/api-and-data-platform/features/agent-skill) 自动迁移，也可通过公开 API 批量导入。迁移时需注意[变量、提示词引用与消息占位符](/official/prompt-management/data-model)的特殊语法。

## 在代码中读取提示词：官方共享示例

运行时通常通过 `production` 标签读取经批准的版本。可使用特定版本号代替标签。

### Python：Text 与 Chat

```python
from langfuse import get_client
langfuse = get_client()

prompt = langfuse.get_prompt("movie-critic")
compiled_prompt = prompt.compile(criticlevel="expert", movie="Dune 2")

chat_prompt = langfuse.get_prompt("movie-critic-chat", type="chat")
compiled_chat_prompt = chat_prompt.compile(criticlevel="expert", movie="Dune 2")
```

Text 返回字符串，Chat 返回消息对象数组。

### TypeScript：Text 与 Chat

```typescript
import { LangfuseClient } from "@langfuse/client";
const langfuse = new LangfuseClient();

const prompt = await langfuse.prompt.get("movie-critic");
const compiledPrompt = prompt.compile({ criticlevel: "expert", movie: "Dune 2" });

const chatPrompt = await langfuse.prompt.get("movie-critic-chat", { type: "chat" });
const compiledChatPrompt = chatPrompt.compile({ criticlevel: "expert", movie: "Dune 2" });
```

### API：按标签或版本获取

```bash
curl "https://cloud.langfuse.com/api/public/v2/prompts/movie-critic?label=production" \
  -u "your-public-key:your-secret-key"

curl "https://cloud.langfuse.com/api/public/v2/prompts/movie-critic?version=1" \
  -u "your-public-key:your-secret-key"
```

### OpenAI SDK：Python

```python
import openai
from langfuse import get_client
langfuse = get_client()

prompt = langfuse.get_prompt("movie-critic")
compiled = prompt.compile(criticlevel="expert", movie="Dune 2")
completion = openai.chat.completions.create(
    model="gpt-4o", messages=[{"role": "user", "content": compiled}]
)

chat_prompt = langfuse.get_prompt("movie-critic-chat", type="chat")
completion = openai.chat.completions.create(
    model="gpt-4o",
    messages=chat_prompt.compile(criticlevel="expert", movie="Dune 2")
)
```

### OpenAI SDK：TypeScript

```typescript
import { observeOpenAI } from "@langfuse/openai";
import { LangfuseClient } from "@langfuse/client";
import OpenAI from "openai";

const langfuse = new LangfuseClient();
const openai = observeOpenAI(new OpenAI());
const prompt = await langfuse.prompt.get("movie-critic", { type: "text" });
const compiledPrompt = prompt.compile({ criticlevel: "expert", movie: "Dune 2" });
await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: compiledPrompt }]
});
```

### LangChain

Langfuse 变量使用 `{{variable}}`，而 LangChain 使用 `{variable}`，应通过 `get_langchain_prompt()`（Python）或 `getLangchainPrompt()`（TypeScript）转换。

```python
from langfuse import Langfuse
from langchain_core.prompts import ChatPromptTemplate
langfuse = Langfuse()
prompt = langfuse.get_prompt("movie-critic")
text_template = ChatPromptTemplate.from_template(prompt.get_langchain_prompt())
chat = langfuse.get_prompt("movie-critic-chat", type="chat")
chat_template = ChatPromptTemplate.from_messages(chat.get_langchain_prompt())
```

```typescript
import { LangfuseClient } from "@langfuse/client";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";
const langfuse = new LangfuseClient();
const textPrompt = await langfuse.prompt.get("movie-critic");
const textTemplate = PromptTemplate.fromTemplate(textPrompt.getLangchainPrompt());
const chatPrompt = await langfuse.prompt.get("movie-critic-chat", { type: "chat" });
const chatTemplate = ChatPromptTemplate.fromMessages(
  chatPrompt.getLangchainPrompt().map(msg => [msg.role, msg.content])
);
```

### Vercel AI SDK

```typescript
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();
const prompt = await langfuse.prompt.get("movie-critic", { type: "text" });
const result = await generateText({
  model: openai("gpt-4o"),
  prompt: prompt.compile({ criticlevel: "expert", movie: "Dune 2" }),
  experimental_telemetry: { isEnabled: true },
});
```

Chat 类型则将 `chatPrompt.compile(...)` 传入 `generateText({ messages: ... })`。

## 后续步骤

- [把提示词关联到 Trace](/official/prompt-management/features/link-to-traces)，分析不同版本的效果；
- [通过实验评估提示词](https://langfuse.com/docs/evaluation/experiments/experiments-via-ui)；
- [使用标签与版本控制发布](https://langfuse.com/docs/prompt-management/features/prompt-version-control#protected-prompt-labels)。

原文中的动态 FAQ 组件不在此站复制，可通过[官方 FAQ](https://langfuse.com/docs/prompt-management/get-started)获取。


原文：[Get Started](https://langfuse.com/docs/prompt-management/get-started)。共享创建与使用组件的主要示例已迁移，动态 FAQ 未迁移。
