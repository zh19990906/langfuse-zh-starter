---
title: Langfuse Assistant
description: 在 Langfuse 界面内探索项目数据并在批准后执行操作。
---
# Langfuse Assistant

Assistant 适用于 Langfuse Cloud 的 Hobby、Core、Pro 和 Enterprise。自托管从 **v4.28.0** 起以 Public Beta 形式提供，要求配置实例级 Langfuse AI 模型和 Worker 队列消费端，详见[自托管设置](https://langfuse.com/self-hosting/configuration/langfuse-assistant)。

Langfuse Assistant 是内置于产品的 AI 助手，可以查询项目中的 Trace、Observation、Session、指标，也能在你批准后创建数据集、仪表盘等资源。每次运行都在后台进行；完成、失败或需要输入与批准时，系统会通知你。

[观看 Assistant 演示](https://static.langfuse.com/docs-videos/in-app-agent.mp4)。

## 能做什么？

可以询问项目数据或 Langfuse 的使用方法，例如：

- “昨天哪些 Trace 的延迟最高？”
- “显示过去一小时失败的 Generation。”
- “按模型汇总本周的 Token 支出。”
- “如何配置评估器？”

也可以要求它执行工作：

- “把上周失败的 Generation 创建为数据集。”
- “创建过去七天错误率和 p95 延迟的仪表盘。”
- “按照最新实践检查并改进这条提示词。”
- “获取过去七天数百条失败的 Observation，并通过代码聚类主要错误。”
- “为友好程度建立数值评分配置。”
- “打开筛选为今日错误的 Trace 表。”

## 工作原理

Assistant 使用 Langfuse MCP Server 以及其他工具回答问题、检查项目数据和协助执行操作。它可以：

- 通过 Langfuse 工具查询 Trace、Observation、Session 和 Metrics；
- 在沙箱里用代码处理大型 Observation 集合，避免全部载入模型上下文；
- 搜索 Langfuse 文档；
- 提供指向 Trace、Session、Dashboard、Prompt、Dataset、Experiment、Evaluation、Alert 和项目设置的链接；
- 创建或更新 Dataset、Dashboard、Widget、Prompt、Score Config 等资源。

默认安全规则：

- 修改数据或配置前，会暂停并请求批准**具体操作**。
- 如果对某工具选择 **Always approve**，此对话后续使用该工具将不再每次询问。
- Assistant 只能执行当前用户在当前项目本来就有权限的操作；批准不会扩大账号权限。

Assistant 还能感知当前打开的 Trace、Observation、Session 或 Dashboard，以及姓名、浏览器语言、时区等上下文信息，以提供更相关的回答与操作建议。

## 后台运行

运行不依赖浏览器页面持续打开。你可以继续使用 Langfuse，或者开始其他对话；运行完成、失败或需要用户参与时会收到通知。适合无人值守的工具可在当前对话中选择 **Always approve**。

## 数据隐私与安全

Assistant 遵循其他 Langfuse AI 功能的数据处理机制，细节见 [AI Features](https://langfuse.com/security/ai-features)。

- Cloud 的模型请求使用位于[项目数据区域](https://langfuse.com/security/data-regions)的 Langfuse 托管 Amazon Bedrock；自托管使用自行配置的实例级 AI 模型。
- 数据访问限于已认证用户及当前项目。
- 修改类操作要求批准，并受已登录用户权限约束。
- 组织 Owner 和 Admin 可以独立开启或关闭用于产品与服务改进的 AI 功能追踪。

## 对话历史

Assistant 对话按用户和项目保存，可返回先前的对话。

## 反馈

可以对回答点赞或点踩。如果启用了 AI 功能追踪，反馈可能被用于产品和服务改进。也可在[反馈讨论区](https://github.com/orgs/langfuse/discussions/14196)提出意见。

## 限制

Assistant 可能误解问题或返回不完整的结果。对重要回答应进行核查，并在批准动作前审查操作细节。

## 相关资料

- [自托管 Assistant 配置](https://langfuse.com/self-hosting/configuration/langfuse-assistant)
- [AI 功能安全说明](https://langfuse.com/security/ai-features)
- [Langfuse MCP Server](https://langfuse.com/docs/api-and-data-platform/features/mcp-server)
- [Agent Skill](/official/api-and-data-platform/features/agent-skill)
- [Assistant Public Beta 公告](https://langfuse.com/changelog/2026-06-19-langfuse-assistant-public-beta)

---

原文：[Langfuse Assistant](https://langfuse.com/docs/langfuse-assistant) · 非官方中文翻译。
