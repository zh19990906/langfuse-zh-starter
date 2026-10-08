---
title: 提示词配置
description: 在提示词中同时管理模型参数、结构化输出 Schema 与工具定义。
---
# Prompt Config

Langfuse 的提示词 `config` 是一个**可选、任意结构的 JSON 对象**，与提示词绑定，供执行 LLM 请求的应用代码读取。

常见用途：

- 存储模型调用参数，例如 `model`、`temperature`、`max_tokens`；
- 存储[结构化输出 Schema](#结构化输出)，例如 `response_format`；
- 存储[函数或工具定义](#函数调用)，例如 `tools`、`tool_choice`。

因为配置与提示词**一起版本化**，可以集中管理全部参数，不需要改动应用代码就能切换模型、更新 Schema 或调整模型行为。

![Prompt Config](https://langfuse.com/images/docs/prompt-management-config.png)

## 设置 Config

### 通过 UI

1. 打开 Langfuse 中的 **Prompt Management**。
2. 选择或创建提示词。
3. 在编辑器中找到 **Config** JSON 编辑器。
4. 输入合法的 JSON 对象。
5. 保存后，配置与该提示词版本一同保存。

[观看 Config 演示](https://static.langfuse.com/docs-videos/2025-12-16-prompt-config.mp4)。

### Python SDK

创建或更新提示词时传入 `config`：

```python
from langfuse import get_client

langfuse = get_client()

config = {
    "model": "gpt-4o",
    "temperature": 0
}

langfuse.create_prompt(
    name="invoice-extractor",
    type="chat",
    prompt=[
        {
            "role": "system",
            "content": "Extract structured data from invoices."
        }
    ],
    config=config
)
```

### JavaScript / TypeScript

```typescript
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();
const config = {
  model: "gpt-4o",
  temperature: 0
};

await langfuse.prompt.create({
  name: "invoice-extractor",
  type: "chat",
  prompt: [
    { role: "system", content: "Extract structured data from invoices." }
  ],
  config: config
});
```

可以直接通过 [Playground](/official/prompt-management/features/playground)测试提示词及其配置。

## 使用 Config

获取提示词后读取 `config` 属性，将字段传给实际的 LLM 请求。

### Python

以下使用 Langfuse OpenAI 集成提供追踪，但追踪不是使用 Config 的必要条件；也可以使用原生 OpenAI SDK 或其他提供商。

```python
from langfuse import get_client
from langfuse.openai import OpenAI

client = OpenAI()
langfuse = get_client()
prompt = langfuse.get_prompt("invoice-extractor")

cfg = prompt.config
model = cfg.get("model")
temperature = cfg.get("temperature")

client.chat.completions.create(
    model=model,
    temperature=temperature,
    messages=prompt.prompt
)
```

### TypeScript

```typescript
import { LangfuseClient } from "@langfuse/client";
import OpenAI from "openai";
import { observeOpenAI } from "@langfuse/openai";

const client = observeOpenAI(new OpenAI());
const langfuse = new LangfuseClient();
const prompt = await langfuse.prompt.get("invoice-extractor");

const cfg = prompt.config;
const model = cfg.model;
const temperature = cfg.temperature;

client.chat.completions.create({
  model,
  temperature,
  messages: prompt.prompt
});
```

## 应用场景

### 结构化输出

需要模型严格返回特定 JSON 结构时，将 Schema 放在 Config 中，这样可以与提示词版本一起维护。

::: info
官方最佳实践：使用 `response_format`，设置 `type: "json_schema"` 与 `strict: true` 来约束输出格式。如果使用 Pydantic，可以通过 `type_to_response_format_param` 转换，详见 [OpenAI Structured Outputs](https://langfuse.com/docs/integrations/openai/python/structured-outputs)。
:::

```python
from langfuse import get_client
from langfuse.openai import OpenAI

langfuse = get_client()
client = OpenAI()
prompt = langfuse.get_prompt("invoice-extractor")
system_message = prompt.compile()
cfg = prompt.config

# 提示词配置示例：
# {
#   "response_format": {
#     "type": "json_schema",
#     "json_schema": {
#       "name": "invoice_schema",
#       "schema": {
#         "type": "object",
#         "properties": {
#           "invoice_number": { "type": "string" },
#           "total": { "type": "number" }
#         },
#         "required": ["invoice_number", "total"],
#         "additionalProperties": false
#       },
#       "strict": true
#     }
#   }
# }

response_format = cfg.get("response_format")

res = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": system_message},
        {"role": "user", "content": "Extract invoice number and total from: ..."},
    ],
    response_format=response_format,
    langfuse_prompt=prompt,
)

content = res.choices[0].message.content
```

这里 `langfuse_prompt=prompt` 会将 Generation 关联到相应提示词版本。

### 函数调用

对于 Agent 和工具型应用，可把工具定义与提示词一起存入 Config，以便统一版本化并更新工具能力。

::: info
建议把包含 JSON Schema 参数的工具定义放在 `tools`，工具选择策略放在 `tool_choice` 中。添加、修改或移除工具时就不一定需要重新部署应用代码。
:::

```python
from langfuse import get_client
from langfuse.openai import OpenAI

langfuse = get_client()
client = OpenAI()
prompt = langfuse.get_prompt("weather-agent")
system_message = prompt.compile()
cfg = prompt.config

# Config 示例：
# {
#   "tools": [
#     {
#       "type": "function",
#       "function": {
#         "name": "get_current_weather",
#         "description": "Get the current weather in a given location",
#         "parameters": {
#           "type": "object",
#           "properties": {
#             "location": { "type": "string", "description": "City and country" },
#             "unit": { "type": "string", "enum": ["celsius", "fahrenheit"] }
#           },
#           "required": ["location"],
#           "additionalProperties": false
#         }
#       }
#     }
#   ],
#   "tool_choice": { "type": "auto" }
# }

tools = cfg.get("tools", [])
tool_choice = cfg.get("tool_choice")

res = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": system_message},
        {"role": "user", "content": "What's the weather in Berlin?"},
    ],
    tools=tools,
    tool_choice=tool_choice,
    langfuse_prompt=prompt,
)
```

更多端到端示例参阅 [OpenAI Functions Cookbook](https://langfuse.com/guides/cookbook/prompt_management_openai_functions)和[结构化输出文档](https://langfuse.com/integrations/model-providers/openai-py#structured-output)。

---

原文：[Prompt Config](https://langfuse.com/docs/prompt-management/features/config) · 非官方中文翻译。
