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

下面是对官方示例的**启动顺序安全修订**：官方片段没有等待异步预取完成，就执行了 `app.listen()`；这里改为先完成预取、成功后启动服务。

```typescript
import express from "express";
import { LangfuseClient } from "@langfuse/client";
const app = express();
const langfuse = new LangfuseClient();

async function fetchPromptsOnStartup() {
  // 先将生产版本写入本实例的本地缓存
  await langfuse.prompt.get("movie-critic");
}

app.get("/get-movie-prompt/:movie", async (req, res) => {
  const movie = req.params.movie;
  const prompt = await langfuse.prompt.get("movie-critic");
  const compiledPrompt = prompt.compile({ criticlevel: "expert", movie });
  res.json({ prompt: compiledPrompt });
});

// 预取成功后才开放端口；失败时记录错误并拒绝启动
fetchPromptsOnStartup()
  .then(() => app.listen(3000, () => console.log("Server ready on port 3000")))
  .catch((error) => {
    console.error("Failed to fetch prompt on startup:", error);
    process.exit(1);
  });
```

::: warning 可用性边界
启动预取只是保障**该实例已加载指定 Prompt**，不是平台对任意时刻、任意 Prompt 的绝对 100% SLA：如果启动失败，实例会拒绝提供服务，需由部署平台健康检查、冗余实例或重新调度处理；如希望新实例在 Langfuse 不可达时仍能启动，还应配置适当的本地 `fallback`。每个进程/实例都需要自己的预取，未预取的 Prompt 不受此机制保护。
:::

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
