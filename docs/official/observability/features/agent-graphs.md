---
title: Agent 图
description: 利用聚合视图和展开的有向无环图分析复杂 Agent 工作流。
---
# Agent 图

Langfuse 的 Agent 图以可视化方式展示复杂 AI Agent 工作流，帮助开发者理解并调试多步骤推理过程和 Agent 交互。

[查看公开示例追踪](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/8ed12d68-353f-464f-bc62-720984c3b6a0)。

[观看视图模式演示](https://static.langfuse.com/changelog-videos/2026-07-13-graph-view-modes.mp4)。

## 开始使用

一条 Trace 可以通过两种方式显示为图：

1. **根据 Observation 推断**：当 Trace 中存在除 `span`、`event`、`generation` 之外类型的 Observation 时，Langfuse 会将其识别为 Agent 工作流，并根据各 Observation 的时间和嵌套关系自动生成图。
2. **通过 LangGraph 集成**：使用 LangGraph 集成后，系统会自动展示对应图结构。

参阅[Observation 类型](/official/observability/features/observation-types)了解如何设置类型；[LangGraph 集成指南](https://langfuse.com/integrations/frameworks/langgraph)提供完整示例。

## 两种视图：聚合与展开

在图左上角使用 **Aggregated / Expanded** 开关切换，选择会在不同 Trace 之间保留。

| 对比维度 | Aggregated 聚合（默认） | Expanded 展开 |
| --- | --- | --- |
| 节点代表 | 一个**唯一的步骤名称** | 一次**具体调用** |
| 重复调用 | 合并为一个节点并显示计数 | 分别显示 |
| 循环 | 画成环形边 | 按执行顺序展开为无环图（DAG） |
| 表达内容 | Agent 工作流的整体结构 | 具体一次执行的流程 |
| 适合场景 | 快速理解结构与复杂度 | 追查某次执行中的特定问题 |

### Aggregated（聚合视图）

同名步骤合并成单个节点，并附带次数。例如 `retrieve_docs (3/3)` 表示该步骤执行了三次。重复调用工具的循环表现为环，而非漫长的调用链。这样即使 Agent 执行步骤很多，也能清楚看出有多少种不同的步骤、这些步骤如何连接。

当你想知道“这个 Agent 的整体工作方式和复杂度如何”时，聚合视图最合适。

### Expanded（展开视图）

展开视图展示实际执行过程。每一次调用都对应自己的节点。例如三次 `litellm_request` 会呈现为三个节点，循环按照执行顺序展开为有向无环图。这种视图更接近 Trace 树，适合追踪一次运行、定位某一步发生的问题。对于大型 Trace，展开视图自然会比聚合视图有更多节点。

两种视图没有绝对优劣：**聚合视图用于理解结构，展开视图用于检查执行过程**。

## 社区讨论

官方页面提供与 Agent 图相关的动态 GitHub Discussions，参阅[官方原文](https://langfuse.com/docs/observability/features/agent-graphs)。

---

原文：[Agent Graphs](https://langfuse.com/docs/observability/features/agent-graphs) · 非官方中文翻译。
