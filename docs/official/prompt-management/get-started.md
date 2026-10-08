---
title: get started
description: Langfuse 官方文档的中文翻译与适配。
---

# 提示词管理快速开始

本指南介绍如何创建、读取和使用 Langfuse 提示词。如需了解原理，先阅读[提示词管理概览](/official/prompt-management/overview)与[数据模型](https://langfuse.com/docs/prompt-management/data-model)。

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

原文：[Get Started](https://langfuse.com/docs/prompt-management/get-started)。**部分翻译：共享组件中的完整示例待迁移。**
