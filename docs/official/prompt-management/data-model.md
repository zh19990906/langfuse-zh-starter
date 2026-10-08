---
title: data model
description: Langfuse 官方文档的中文翻译与适配。
---

# 提示词管理数据模型

Langfuse 的提示词管理提供集中存储、版本控制、标签和参数配置，帮助应用在无需重新部署代码的情况下切换提示词版本。

## 核心对象

**Prompt** 是提示词的逻辑名称；**Version** 是不可变的历史版本；**Label**（例如 `production`）将稳定的调用名称映射到特定版本。应用使用 SDK 按名称和标签获取提示词，再通过变量编译得到调用模型所需的内容。

提示词支持文本类型和聊天消息类型，并可在提示词中配置变量、消息占位符与引用其他提示词。

## 版本与标签

同名提示词每次更新形成新版本。生产标签可在测试后移动到新版本，实现提示词更新与应用部署解耦。

```python
from langfuse import get_client
langfuse = get_client()
prompt = langfuse.get_prompt("movie-critic", label="production")
compiled = prompt.compile(movie="Dune 2")
```

## 相关功能

- [提示词变量](/official/prompt-management/features/variables)
- [消息占位符](/official/prompt-management/features/message-placeholders)
- [组合提示词](/official/prompt-management/features/composability)
- [提示词与 Trace 关联](/official/prompt-management/features/link-to-traces)
- [回退与高可用](/official/prompt-management/features/guaranteed-availability)

::: warning 翻译状态
本页目前为官方数据模型的中文概要，**并非完整逐段翻译**；详细数据模型、缓存与标签规则请先看[官方原文](https://langfuse.com/docs/prompt-management/data-model)。
:::

原文：[Prompt Management Core Concepts](https://langfuse.com/docs/prompt-management/data-model)。
