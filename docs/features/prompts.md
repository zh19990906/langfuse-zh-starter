# 提示词管理

来源：[Langfuse 官方 Prompt Management 入门](https://langfuse.com/docs/prompt-management/get-started)。

## 为什么集中管理 Prompt？

把 Prompt 写死在代码里，会让协作、审查、版本回滚和 A/B 实验变得复杂。Langfuse 可以把 Prompt 当作带有版本号、配置和部署标签的资源进行管理。

## 基本工作流

1. 在 UI、SDK 或 API 中创建 Prompt。
2. 修改 Prompt 时创建新版本，保留历史记录。
3. 在 Playground 中填入变量并测试效果。
4. 使用标签指向准备部署的版本。
5. 将 Prompt 与实际模型 Trace 关联，观察延迟、费用和评估指标。

## Text 与 Chat Prompt

- **Text Prompt**：通常是一个文本模板。
- **Chat Prompt**：通常由多条带角色的消息组成，可包含系统消息、用户消息等。

Prompt 模板可以包含变量。应用执行前应正确填充变量，并谨慎处理来自不可信来源的输入。

## 建议

以少量高价值 Prompt 为起点，先建立版本管理和回滚机制，再考虑复杂实验。
