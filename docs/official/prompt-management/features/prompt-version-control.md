---
title: 提示词版本控制
description: 使用版本与标签进行提示词发布、回滚和访问保护。
---
# 提示词版本控制

Langfuse 通过 `versions` 和 `labels` 管理提示词的版本控制与部署。

## 实现方式

### 版本与标签

每个提示词版本都会自动分配一个 **Version ID**。还可以给版本添加 **Label**，以便遵循自己的版本管理策略。标签可以代表环境（`staging`、`production`）、租户（`tenant-1`、`tenant-2`）或实验变体（`prod-a`、`prod-b`）。

### Langfuse UI

在界面中为提示词版本指定标签：[观看部署演示](https://static.langfuse.com/docs-videos/deploy-prompt.mp4)。

### Python SDK

创建新版本时添加标签：

```python
langfuse.create_prompt(
    name="movie-critic",
    type="text",
    prompt="As a {{criticlevel}} movie critic, do you like {{movie}}?",
    labels=["production"],
)
```

也可以更新已有版本的标签：

```python
from langfuse import Langfuse
langfuse = Langfuse()
langfuse.update_prompt(
    name="movie-critic",
    version=1,
    new_labels=["john", "doe"],
)
```

### JavaScript / TypeScript

创建新版本：

```typescript
import { LangfuseClient } from "@langfuse/client";
const langfuse = new LangfuseClient();
await langfuse.prompt.create({
  name: "movie-critic",
  type: "text",
  prompt: "As a {{criticlevel}} critic, do you like {{movie}}?",
  labels: ["production"],
});
```

更新已有版本：

```typescript
await langfuse.prompt.update({
  name: "movie-critic",
  version: 1,
  newLabels: ["john", "doe"],
});
```

## 按版本或标签获取提示词

应用可以固定获取某个版本，也可以通过标签获取。要把版本“部署”到生产，应将 `production` 或自定义环境标签指向它。

- `latest` 始终指向最新创建的版本。
- 不指定标签时，默认返回带 `production` 标签的版本。
- 请求的标签不存在时返回 `404 Not Found`，**不会**自动回退到 `production` 或 `latest`。

### Python

```python
from langfuse import get_client
langfuse = get_client()
prompt = langfuse.get_prompt("movie-critic", version=1)
prompt = langfuse.get_prompt("movie-critic", label="staging")
prompt = langfuse.get_prompt("movie-critic", label="latest")
```

### TypeScript

```typescript
import { LangfuseClient } from "@langfuse/client";
const langfuse = new LangfuseClient();
const versionPrompt = await langfuse.prompt.get("movie-critic", { version: 1 });
const stagingPrompt = await langfuse.prompt.get("movie-critic", { label: "staging" });
const latestPrompt = await langfuse.prompt.get("movie-critic", { label: "latest" });
```

### 标签解析规则

SDK 调用的接口为 `GET /api/public/v2/prompts/{name}`。以下规则适用于直接 API 以及 Python `get_prompt` / JS `prompt.get`：

| 提供的参数 | Langfuse 的响应 |
| --- | --- |
| 不提供 `label` 或 `version` | 返回带 `production` 的版本；没有该标签则 404 |
| `label="staging"` | 返回当前带 `staging` 的版本；不存在则 404，不会回退 |
| `version=3` | 返回版本 3，不考虑其标签 |
| 同时提供 `label` 和 `version` | 返回 400，两者互斥 |

不存在的标签会直接报错，而不会悄悄返回错误环境的提示词。若配置了[回退提示词](/official/prompt-management/features/guaranteed-availability)，SDK 可使用回退内容，否则异常传给应用代码。

查看标签有哪些，可调用 `GET /api/public/v2/prompts`（返回每个 Prompt 的 `labels` 数组）；`GET /api/public/v2/prompts?label=staging` 仅返回有版本带 `staging` 标签的提示词。UI 版本列表同样展示标签。

## 运维流程

### 回滚

如果生产使用带 `production` 标签的版本，只需在 UI 中把该标签重新指向此前的版本，SDK 默认就会读取旧版本。

### 提示词差异对比

版本 Diff 视图展示提示词随时间的变化，帮助定位问题、理解调整历史和评估修改影响。

[观看版本 Diff 演示](https://static.langfuse.com/docs-videos/prompt-changes.mp4)。

### 受保护标签

官方可用性标注：Hobby、Core 不提供；Pro 需 Team Add-on；Enterprise 完整支持；自托管需要 Enterprise Edition。

受保护标签允许项目 Admin 和 Owner（详见 [RBAC](https://langfuse.com/docs/administration/rbac)）限制修改或删除重要标签，从而保护提示词部署。

将 `production` 标记为受保护后：

- `viewer` 和 `member` 不能修改或删除此标签，无法改变生产版指向，同时也会阻止删除整个 Prompt；
- `admin` 与 `owner` 仍可以修改、删除标签，从而更改生产版本。

管理员和所有者可在项目设置中调整保护状态。

[观看受保护标签演示](https://static.langfuse.com/docs-videos/250402-protected-prompt-labels.mp4)。

## 相关资源

- Prompt 按项目隔离：不同环境位于不同项目时，参阅[跨环境同步](https://langfuse.com/faq/all/managing-different-environments)。
- 将候选版本提升到生产标签前，可以先运行[实验](https://langfuse.com/docs/evaluation/core-concepts#experiments)。

---

原文：[Prompt Version Control](https://langfuse.com/docs/prompt-management/features/prompt-version-control) · 非官方中文翻译。
