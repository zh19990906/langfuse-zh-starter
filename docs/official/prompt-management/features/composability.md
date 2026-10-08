---
title: 提示词组合
description: 使用引用标记，在提示词中复用其他提示词。
---
# 提示词组合

创建的提示词越多，就越可能在不同提示词中重复使用相同的文本片段或指令。为了避免重复，可以通过引用其他提示词来组合提示词。

[查看官方演示视频](https://langfuse.com/images/docs/prompt-composition.mp4)。

## 为什么使用组合提示词？

- 构建模块化的**提示词组件**，在多个提示词间复用。
- 在一个位置**维护**通用指令、示例或上下文。
- 基础提示词发生变化时，自动**更新依赖它的提示词**。

## 开始使用

### Langfuse 界面

创建提示词时，使用 `Add prompt reference`（添加提示词引用）按钮，即可插入对其他提示词的引用。

[查看界面演示](https://static.langfuse.com/docs-videos/prompt-composability.mp4)。

### SDK / API

可以在提示词中按以下格式引用其他**文本提示词**：

```text
@@@langfusePrompt:name=PromptName|version=1@@@
```

也可以用标签代替固定版本，让系统动态解析：

```text
@@@langfusePrompt:name=PromptName|label=production@@@
```

## 相关功能

- [变量](https://langfuse.com/docs/prompt-management/features/variables)：将动态文本插入提示词。
- [消息占位符](https://langfuse.com/docs/prompt-management/features/message-placeholders)：插入完整消息数组，而不只是字符串。

官方动态 FAQ 组件可在[英文原文](https://langfuse.com/docs/prompt-management/features/composability)中查看。

---

原文：[Prompt Composability](https://langfuse.com/docs/prompt-management/features/composability) · 非官方中文翻译。