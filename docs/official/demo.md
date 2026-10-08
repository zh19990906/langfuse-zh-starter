---
title: 示例项目
description: 免费体验 Langfuse 共享项目，生成 Trace 并查看用户反馈。
---
# Langfuse 示例项目

Langfuse 示例项目是一个**实时共享项目**，无需先配置个人项目，即可通过真实数据体验平台功能。

## 体验前须知

- 官方示例项目是**多人共享的实时演示环境**，无需信用卡即可体验；不要提交真实个人信息、API Key 或其他机密内容。
- 演示交互会产生真实 Trace，包含请求、模型回答与用户反馈；由于项目共享，示例数据可能被其他访问者看到。
- 中文站没有官方的交互式 `DemoTabs` 运行环境，因此提供官方 Demo 入口，不使用虚构的按钮或本地 Trace URL。

## 第 1 步：生成第一条示例 Trace

打开[官方交互式 Demo](https://langfuse.com/docs/demo#generate-your-first-demo-trace)，在示例聊天机器人中输入内容并运行一次请求。此处官方使用动态 `DemoTabs` 组件来运行交互；该组件依赖 Langfuse 官方服务，中文版不伪造可执行的聊天环境，直接提供官方互动入口。

## 第 2 步：在 Langfuse 查看 Trace

运行互动后，从官方演示项目进入 Tracing 列表，找到最新的一次请求。点击相应 Trace 可以查看各个 Observation、模型输入输出、响应耗时，以及点赞或点踩等反馈。演示项目并非你的私有生产项目，不要将其当作数据持久存储环境。

## 第 3 步：探索整个示例项目

从[官方示例页面](https://langfuse.com/docs/demo)进入共享项目，可以继续查看真实 Trace、评分和其他功能。喜欢视频可[观看完整流程演示](https://langfuse.com/watch-demo)。

## 示例的实现与评估方式

- [Q&A 聊天机器人实现说明](https://langfuse.com/blog/qa-chatbot-for-langfuse-docs)
- [文档聊天机器人评估方案](https://langfuse.com/blog/2026-07-16-steal-our-eval-setup)

## 下一步

1. [开始接入 Tracing](/official/observability/get-started)：给自己的 LLM 应用添加可观测性。
2. [配置提示词管理](/official/prompt-management/get-started)：从应用代码中抽离提示词。
3. [评估生产流量](/official/evaluation/get-started/online)：对在线 Trace 评分。

---

原文：[Example Project](https://langfuse.com/docs/demo) · 非官方中文翻译；交互执行依赖官方 Demo 页面。
