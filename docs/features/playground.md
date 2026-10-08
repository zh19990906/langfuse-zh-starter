# LLM Playground

来源：[Langfuse 官方 Playground 功能介绍](https://langfuse.com/docs/prompt-management/features/playground)。

Playground 是用于交互式测试 Prompt 和模型配置的界面。你可以在不修改应用代码的前提下快速尝试不同的参数与输入。

## 可以做什么？

- 调整 Prompt 内容、模板变量与模型参数。
- 并排运行不同的 Prompt 变体并比较结果。
- 从 Prompt Management 打开已有 Prompt。
- 将满意的实验版本保存到 Prompt Management。

## 一个简单的测试方法

用同一组问题，对比两个不同的 Prompt：一个侧重回答简短，另一个侧重解释充分。观察输出是否符合需求，同时检查响应时间及 Token 消耗。

> [!NOTE]
> Playground 是 Langfuse 应用平台中的功能；本站只是介绍它的使用方法，并未提供一个能实际调用 LLM 的 Playground 后端。
