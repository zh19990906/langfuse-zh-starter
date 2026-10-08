---
title: 提示词管理
description: 在 Langfuse 中集中保存、版本管理和获取提示词。
---

# 提示词管理

提示词管理是以系统化方式存储、管理版本和获取 LLM 应用提示词的方法。与将提示词硬编码在应用程序中不同，你可以在 Langfuse 中集中管理提示词。

![Langfuse 提示词管理界面](https://langfuse.com/images/docs/prompt-management.png)

[观看功能演示](https://langfuse.com/watch-demo)，了解如何将 Langfuse 提示词管理接入应用。

### 将提示词更新与代码部署解耦

在大多数 LLM 应用中，**提示词迭代与代码部署由不同人员管理**：产品经理和领域专家迭代提示词，工程师负责代码部署。

如果提示词存在于代码中，即使修改少量文本，也需要工程师参与、代码审查和完整部署流程，原本两分钟的修改可能要等待数小时甚至数天。

提示词保存在 Langfuse 后，非技术成员可以直接在 UI 中修改，应用自动获取最新版。这种**职责分离**意味着提示词更新可以立即生效，不需要重新部署应用。

### 低延迟与可用性

Langfuse SDK 会在客户端缓存提示词，所以从缓存中读取的速度与内存读取相当。详细说明见[缓存文档](https://langfuse.com/docs/prompt-management/features/caching)。

## 开始使用

从[创建第一条提示词](https://langfuse.com/docs/prompt-management/get-started)开始，然后接入应用。你可以在 UI 中直接创建提示词，也可以导入应用已有的提示词。

建议了解以下[核心概念](https://langfuse.com/docs/prompt-management/data-model)：提示词类型、版本管理、标签和配置。

接入后，还可以：

- [将提示词关联到追踪记录](https://langfuse.com/docs/prompt-management/features/link-to-traces)，按版本分析效果。
- [使用版本管理和标签](https://langfuse.com/docs/prompt-management/features/prompt-version-control)，管理不同部署环境。

更多功能见官方 *Features* 导航。

---

原文：[Prompt Management](https://langfuse.com/docs/prompt-management/overview) · 非官方中文翻译
