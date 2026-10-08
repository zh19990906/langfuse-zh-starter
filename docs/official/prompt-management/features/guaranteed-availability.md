---
title: 提示词高可用保障
description: 通过启动时预取及回退提示词，降低网络故障影响。
---
# 提示词高可用保障

::: warning
通常无需额外实现此机制，否则会增加应用复杂度。Langfuse 提示词管理本身依赖多层[缓存](/official/prompt-management/features/caching)提供较高可用性，并持续监测[服务状态](https://status.langfuse.com)。仅当业务要求极严格的可用性时才考虑下列方案。
:::

Langfuse API 可用性较高，SDK 也会将提示词[缓存在本地](/official/prompt-management/features/caching)，以缓解网络故障。

但是，以下两个条件**同时**成立时，`get_prompt()` / `getPrompt()` 仍可能抛出异常：

1. 没有可用的本地缓存（包括新鲜或过期缓存），例如全新的应用实例第一次加载提示词；
2. 网络请求重试后仍失败，例如网络问题或 Langfuse API 故障。

要进一步保障可用性，有两种方法：

1. 启动时预取提示词，获取失败则拒绝启动；
2. 提供 `fallback` 回退提示词。

## 方案一：启动时预取

### Flask / Python

```python
import sys
from flask import Flask, jsonify
from langfuse import Langfuse

app = Flask(__name__)
langfuse = Langfuse()

def fetch_prompts_on_startup():
    try:
        langfuse.get_prompt("movie-critic")
    except Exception as e:
        print(f"Failed to fetch prompt on startup: {e}")
        sys.exit(1)

fetch_prompts_on_startup()

@app.route("/get-movie-prompt/<movie>", methods=["GET"])
def get_movie_prompt(movie):
    prompt = langfuse.get_prompt("movie-critic")
    compiled_prompt = prompt.compile(criticlevel="expert", movie=movie)
    return jsonify({"prompt": compiled_prompt})

if __name__ == "__main__":
    app.run(debug=True)
```

### Express / TypeScript

```typescript
import express from "express";
import { LangfuseClient } from "@langfuse/client";
const app = express();
const langfuse = new LangfuseClient();

async function fetchPromptsOnStartup() {
  try {
    await langfuse.prompt.get("movie-critic");
  } catch (error) {
    console.error("Failed to fetch prompt on startup:", error);
    process.exit(1);
  }
}

fetchPromptsOnStartup();
app.get("/get-movie-prompt/:movie", async (req, res) => {
  const movie = req.params.movie;
  const prompt = await langfuse.prompt.get("movie-critic");
  const compiledPrompt = prompt.compile({ criticlevel: "expert", movie });
  res.json({ prompt: compiledPrompt });
});
app.listen(3000);
```

## 方案二：回退提示词

### Python SDK

```python
from langfuse import Langfuse
langfuse = Langfuse()

prompt = langfuse.get_prompt(
    "movie-critic",
    fallback="Do you like {{movie}}?"
)

chat_prompt = langfuse.get_prompt(
    "movie-critic-chat",
    type="chat",
    fallback=[{"role": "system", "content": "You are an expert on {{movie}}"}]
)

prompt.is_fallback
```

### TypeScript SDK

```typescript
import { LangfuseClient } from "@langfuse/client";
const langfuse = new LangfuseClient();

const prompt = await langfuse.prompt.get("movie-critic", {
  fallback: "Do you like {{movie}}?",
});
const chatPrompt = await langfuse.prompt.get("movie-critic-chat", {
  type: "chat",
  fallback: [{ role: "system", content: "You are an expert on {{movie}}" }],
});
prompt.isFallback;
```

使用回退提示词时不会建立正式提示词版本与 Trace 的关联，参阅[提示词关联说明](/official/prompt-management/features/link-to-traces)。

---

原文：[Guaranteed Availability](https://langfuse.com/docs/prompt-management/features/guaranteed-availability) · 非官方中文翻译。
