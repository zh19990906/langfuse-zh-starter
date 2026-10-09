---
title: LLM Connections
description: 配置 Langfuse Playground、LLM-as-a-Judge 和提示词实验使用的模型连接。
---
# LLM Connections

LLM Connection 用于在 Langfuse Playground 中调用模型，以及执行 LLM-as-a-Judge 评估。

**它不会影响已摄入 Trace 的 Token 价格**，因为 Langfuse 根据[模型定义](/official/observability/features/token-and-cost-tracking)推断成本。对于内置定义不包含的模型，应[添加自定义模型定义](/official/observability/features/token-and-cost-tracking)，必要时配置[价格层级](/official/observability/features/token-and-cost-tracking)。

## 设置连接

### 通过 UI

1. 打开 **Project Settings → LLM Connections**，点击 **Add new LLM API key**。
2. 输入连接名称，以及对应模型提供商的 API Key。

[观看创建连接演示](https://static.langfuse.com/docs-videos/2026-03-06-add-llm-connection-v3.mp4)。

### 通过 API

也可使用[公开 API](https://langfuse.com/docs/api-and-data-platform/features/public-api)管理：

```http
GET /api/public/llm-connections
PUT /api/public/llm-connections
```

## 支持的提供商

Langfuse 当前提供以下适配器：

- OpenAI
- Azure OpenAI
- Anthropic
- Google AI Studio
- Google Vertex AI
- Amazon Bedrock
- TypeSafe（实验性），可直连或经 Vercel AI Gateway、OpenRouter，用于 [Jev Evaluator](https://langfuse.com/docs/evaluation/evaluation-methods/decision-models#connect-typesafe-jev)。

### 官方默认模型列表

创建 LLM API Key 时也可以添加自定义模型名称，例如代理网关或私有模型。

支持 OpenAI API Schema 的服务（Groq、OpenRouter、Vercel AI Gateway、LiteLLM、Hugging Face 等），可通过适当的 Base URL 和 API Key 连接。

**openAI：**

`o3`、`o3-2025-04-16`、`o4-mini`、`o4-mini-2025-04-16`、`gpt-4.1`、`gpt-4.1-2025-04-14`、`gpt-4.1-mini-2025-04-14`、`gpt-4.1-nano-2025-04-14`、`gpt-4o`、`gpt-4o-2024-08-06`、`gpt-4o-2024-05-13`、`gpt-4o-mini`、`gpt-4o-mini-2024-07-18`、`o3-mini`、`o3-mini-2025-01-31`、`o1-preview`、`o1-preview-2024-09-12`、`o1-mini`、`o1-mini-2024-09-12`、`gpt-4-turbo-preview`、`gpt-4-1106-preview`、`gpt-4-0613`、`gpt-4-0125-preview`、`gpt-4`、`gpt-3.5-turbo-16k-0613`、`gpt-3.5-turbo-16k`、`gpt-3.5-turbo-1106`、`gpt-3.5-turbo-0613`、`gpt-3.5-turbo-0301`、`gpt-3.5-turbo-0125`、`gpt-3.5-turbo`。

**anthropic：**

`claude-3-7-sonnet-20250219`、`claude-3-5-sonnet-20241022`、`claude-3-5-sonnet-20240620`、`claude-3-opus-20240229`、`claude-3-sonnet-20240229`、`claude-3-5-haiku-20241022`、`claude-3-haiku-20240307`、`claude-2.1`、`claude-2.0`、`claude-instant-1.2`。

**vertexAI：**

`gemini-2.5-pro-exp-03-25`、`gemini-2.0-pro-exp-02-05`、`gemini-2.0-flash-001`、`gemini-2.0-flash-lite-preview-02-05`、`gemini-2.0-flash-exp`、`gemini-1.5-pro`、`gemini-1.5-flash`、`gemini-1.0-pro`。

**googleAIStudio：**

`gemini-2.5-pro-exp-03-25`、`gemini-2.0-flash`、`gemini-2.0-flash-lite-preview-02-05`、`gemini-2.0-flash-thinking-exp-01-21`、`gemini-1.5-pro`、`gemini-1.5-flash`、`gemini-1.5-flash-8b`。

**Amazon Bedrock：**支持 Bedrock 上所有模型，AWS 权限需要 `bedrock:InvokeModel` 和 `bedrock:InvokeModelWithResponseStream`。

如果第三方厂商兼容上述某个 Provider Adapter 的 API Schema，也可使用对应适配器。例如使用 OpenAI Adapter 连接 Mistral 的 OpenAI 兼容接口。

## 高级配置

### 额外的 Provider Options

::: info
Provider Options **不是**在 Project Settings → LLM Connections 页面配置，而是在 [Playground](/official/prompt-management/features/playground)选择连接时，或设置 [LLM-as-a-Judge](https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge)时设置。
:::

除 `temperature`、`top_p` 和 `max_tokens` 等标准参数外，模型提供商还可能支持 `reasoning_effort`、`service_tier` 等专有字段。可以在模型参数页面底部的 **Provider Options** 输入 JSON 键值，以便在 LLM 请求中传递。

各厂商可用字段参阅 [Anthropic Messages API](https://docs.anthropic.com/en/api/messages)、[OpenAI Chat Completions API](https://platform.openai.com/docs/api-reference/chat/create)、[Google Gemini API](https://ai.google.dev/api)和[Google Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference)。

目前 Provider Options 支持 Anthropic、OpenAI、Google AI Studio、Google Vertex AI 和 AWS（Bedrock）。

例如在 OpenAI GPT-5 请求中将 Reasoning Effort 强制为 `minimal`：

![Provider Options](https://langfuse.com/images/docs/llm-connection-provider-options.png)

Google AI Studio / Vertex AI 的 Thinking 参数示例：

```json
{
  "thinkingLevel": "MEDIUM",
  "thinkingBudget": 2048
}
```

`thinkingLevel` 控制推理深度，`thinkingBudget` 指定 Thinking Token Budget。只有支持 Thinking 的 Google 模型才接受这些选项。

### 排查 Blocked IP address detected

Langfuse 在代用户调用 LLM URL 前，使用 SSRF 拒绝列表检查 Base URL。检查发生在保存或测试连接时，也发生在 Playground、LLM-as-a-Judge 和 Experiment 的每次出站请求及重定向时。

当主机名解析至私有、环回、链路本地或保留地址时会报 `Blocked IP address detected` 或 `Blocked hostname detected`。包括 IPv4 `10.0.0.0/8`、`172.16.0.0/12`、`192.168.0.0/16`、`127.0.0.0/8`、`169.254.0.0/16` 与相应 IPv6 地址，或 `localhost`、`*.internal`、`host.docker.internal` 等名称。未解析的 Host 也被拒绝。公网 IP 与公开域名不在默认拦截之列。

**Cloud：**始终执行拒绝列表，不可关闭；Base URL 必须是 HTTPS。应使用公网可解析端点，例如带公开域名的网关。

**自托管：**可以显式允许特定内部端点，设置以下以逗号分隔的变量：

- `LANGFUSE_LLM_CONNECTION_WHITELISTED_HOST`
- `LANGFUSE_LLM_CONNECTION_WHITELISTED_IPS`
- `LANGFUSE_LLM_CONNECTION_WHITELISTED_IP_SEGMENTS`

`_HOST` 命中后跳过 IP 检查；`_IPS` 与 `_IP_SEGMENTS` 会检查该域名解析到的全部 IP。没有禁用所有目标检查的全局开关。白名单目标会豁免 SSRF 防护，应逐项审慎配置。Webhook 与 Blob Storage 另有自己的白名单变量，参阅[出站 URL 允许列表](https://langfuse.com/self-hosting/configuration/hardening#outbound-url-allowlists)。

### 使用 LLM Gateway

如果模型调用通过兼容 OpenAI 的网关，例如 [LiteLLM](https://langfuse.com/integrations/gateways/litellm)、[OpenRouter](https://langfuse.com/integrations/gateways/openrouter) 或 [Portkey](https://langfuse.com/integrations/gateways/portkey)，可以将其作为 Playground 和 LLM 裁判的连接：

1. 打开 **Project Settings → LLM Connections → Add new LLM API key**。
2. Provider 选择 **OpenAI**。
3. 输入网关 API Key。
4. 在 **Advanced Settings** 中将 Base URL 设置为网关地址，如 `https://your-litellm-instance.com/v1`。
5. 添加网关提供的自定义模型名称。

::: info
要执行 LLM-as-a-Judge，网关必须支持 OpenAI 格式的 [Tool Calling](https://platform.openai.com/docs/guides/function-calling)。
:::

以下是网关必须能够处理的 OpenAI Tool Calling 请求示例：

```bash
curl -X POST 'https://<host set in project settings>/chat/completions' \
-H 'accept: application/json' \
-H 'content-type: application/json' \
-H 'authorization: Bearer <api key entered in project settings>' \
-H 'x-test-header-1: <custom header set in project settings>' \
-H 'x-test-header-2: <custom header set in project settings>' \
-d '{
  "model": "<model set in project settings>",
  "temperature": 0,
  "top_p": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0,
  "max_tokens": 256,
  "n": 1,
  "stream": false,
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "extract",
        "parameters": {
          "type": "object",
          "properties": {
            "score": {
              "type": "string"
            },
            "reasoning": {
              "type": "string"
            }
          },
          "required": [
            "score",
            "reasoning"
          ],
          "additionalProperties": false,
          "$schema": "http://json-schema.org/draft-07/schema#"
        }
      }
    }
  ],
  "tool_choice": {
    "type": "function",
    "function": {
      "name": "extract"
    }
  },
  "messages": [
    {
      "role": "user",
      "content": "Evaluate the correctness of the generation on a continuous scale from 0 to 1. A generation can be considered correct (Score: 1) if it includes all the key facts from the ground truth and if every fact presented in the generation is factually supported by the ground truth or common sense.\n\nExample:\nQuery: Can eating carrots improve your vision?\nGeneration: Yes, eating carrots significantly improves your vision, especially at night. This is why people who eat lots of carrots never need glasses. Anyone who tells you otherwise is probably trying to sell you expensive eyewear or does not want you to benefit from this simple, natural remedy. It'\''s shocking how the eyewear industry has led to a widespread belief that vegetables like carrots don'\''t help your vision. People are so gullible to fall for these money-making schemes.\nGround truth: Well, yes and no. Carrots won'\''t improve your visual acuity if you have less than perfect vision. A diet of carrots won'\''t give a blind person 20/20 vision. But, the vitamins found in the vegetable can help promote overall eye health. Carrots contain beta-carotene, a substance that the body converts to vitamin A, an important nutrient for eye health.  An extreme lack of vitamin A can cause blindness. Vitamin A can prevent the formation of cataracts and macular degeneration, the world'\''s leading cause of blindness. However, if your vision problems aren'\''t related to vitamin A, your vision won'\''t change no matter how many carrots you eat.\nScore: 0.1\nReasoning: While the generation mentions that carrots can improve vision, it fails to outline the reason for this phenomenon and the circumstances under which this is the case. The rest of the response contains misinformation and exaggerations regarding the benefits of eating carrots for vision improvement. It deviates significantly from the more accurate and nuanced explanation provided in the ground truth.\n\n\n\nInput:\nQuery: {{query}}\nGeneration: {{generation}}\nGround truth: {{ground_truth}}\n\n\nThink step by step."
    }
  ]
}'
```

### OpenAI Responses API

部分兼容 OpenAI 的 Provider 只公开 [Responses API](https://platform.openai.com/docs/api-reference/responses)，而不是 Chat Completions。此时可在 OpenAI LLM Connection 上打开 **Use Responses API**，让 Playground、LLM-as-a-Judge 和 Prompt Experiment 经 Responses API 请求。

例如经 Amazon Bedrock Mantle 调用 OpenAI 模型：

1. 打开 **Project Settings → LLM Connections**，点击 **Add new LLM API key**。
2. 选择 **OpenAI**。
3. 输入 [Bedrock API Key](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html)。
4. Advanced Settings 中将 Base URL 设为 `https://bedrock-mantle.<aws-region>.api.aws/openai/v1`。
5. 开启 **Use Responses API**。
6. 添加 Bedrock 账号支持的 Custom Model Name，如 `openai.gpt-5.5`、`openai.gpt-5.4`。

---

原文：[LLM Connections](https://langfuse.com/docs/administration/llm-connection) · 非官方中文翻译。 
