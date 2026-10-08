---
title: 提示词 A/B 测试
description: 使用 Langfuse 的提示词标签，对不同版本进行流量分配和指标比较。
---
# LLM 提示词 A/B 测试

[Langfuse 提示词管理](/official/prompt-management/overview)支持为提示词的不同版本添加标签（例如 `prod-a`、`prod-b`），从而开展 A/B 测试。应用可随机选择不同版本，Langfuse 则按版本追踪响应延迟、成本、Token 使用量和评估指标。

::: info 什么时候适合 A/B 测试？
A/B 测试适合了解不同提示词版本在真实场景中的表现，是数据集离线测试的补充。比较适合以下情况：

- 应用具有可靠的成功衡量标准，输入种类广泛，能够承受一定的性能波动，例如低风险的消费类应用。
- 已经在测试数据上充分验证变更，希望在全面推广前先向少量用户开放（即金丝雀发布）。
:::

## 实现方法

### 1. 标记提示词版本

为要比较的版本分别添加 `prod-a` 和 `prod-b` 等标签。

### 2. 获取提示词并运行 A/B 测试

#### Python SDK

```python
from langfuse import get_client
import random
from langfuse.openai import openai

langfuse = get_client()

# 获取两个提示词版本
prompt_a = langfuse.get_prompt("my-prompt-name", label="prod-a")
prompt_b = langfuse.get_prompt("my-prompt-name", label="prod-b")

# 随机选择一个版本
selected_prompt = random.choice([prompt_a, prompt_b])

# 在 LLM 调用中使用该提示词
response = openai.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": selected_prompt.compile(variable="value")}],
    langfuse_prompt=selected_prompt,
)
result_text = response.choices[0].message.content
```

#### JavaScript / TypeScript SDK

```js
import { LangfuseClient } from "@langfuse/client";
import { observeOpenAI } from "@langfuse/openai";
import OpenAI from "openai";

const langfuse = new LangfuseClient();
const openai = observeOpenAI(new OpenAI());

const promptA = await langfuse.prompt.get("my-prompt-name", {
  label: "prod-a",
});
const promptB = await langfuse.prompt.get("my-prompt-name", {
  label: "prod-b",
});

const selectedPrompt = Math.random() < 0.5 ? promptA : promptB;

const completion = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "user",
      content: selectedPrompt.compile({ variable: "value" }),
    },
  ],
  langfusePrompt: selectedPrompt,
});
const resultText = completion.choices[0].message.content;
```

有关获取和使用提示词的更多方法，请参阅[提示词管理官方说明](https://langfuse.com/docs/prompt-management/get-started)。

### 3. 分析结果

在 Langfuse UI 中比较各版本提示词的指标：

[查看提示词指标演示](https://static.langfuse.com/docs-videos/prompt-metrics.mp4)。

可比较的关键指标包括：

- 响应延迟和 Token 使用量；
- 每次请求的成本；
- 质量评估评分；
- 你自行定义的自定义指标。

## 相关资源

如果需要用数据集评估整个应用的行为，而不仅仅是比较提示词版本，可以使用[实验（Experiments）](https://langfuse.com/docs/evaluation/core-concepts#experiments)。

---

原文：[A/B Testing](https://langfuse.com/docs/prompt-management/features/a-b-testing) · 非官方中文翻译。
