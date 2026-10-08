---
title: 示例项目
description: 免费体验 Langfuse 共享项目，生成 Trace 并查看用户反馈。
---
# Langfuse 示例项目

Langfuse 示例项目是一个**实时共享项目**，无需先配置个人项目，即可通过真实数据体验平台功能。

## 第 1 步：生成第一条示例 Trace

打开[官方交互式 Demo](https://langfuse.com/docs/demo#generate-your-first-demo-trace)，在示例聊天机器人中输入内容并运行一次请求。此处官方使用动态 `DemoTabs` 组件来运行交互；该组件依赖 Langfuse 官方服务，中文版不伪造可执行的聊天环境，直接提供官方互动入口。

## 第 2 步：在 Langfuse 查看 Trace

在共享项目的 Trace 列表找到刚刚生成的请求，查看模型调用、响应、延迟和用户点赞/点踩。

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
