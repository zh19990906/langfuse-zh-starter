---
title: 评估生产流量
description: 在 Langfuse 中为实时 Observation 配置自动评估器和规则。
---
# 评估生产流量

本指南说明如何为 Langfuse 中的实时生产 Trace 添加评分。如果还不知道该评价什么，可以先读[选择评估目标](https://langfuse.com/academy/evaluate/choosing-what-to-evaluate)。评估器、Score、Rule 之间的关系见[核心概念](https://langfuse.com/docs/evaluation/core-concepts)。

## Agent 安装方式

安装 [Langfuse Agent Skill](https://github.com/langfuse/skills)，让编程助手配置在线评估。

**要求编程助手安装：**

```text
Install the Langfuse Agent Skill from github.com/langfuse/skills
and use it to set up online evaluation for this application
with Langfuse.
```

**Cursor 插件**：可以使用[官方 Langfuse Cursor 插件](https://cursor.com/marketplace/langfuse)，然后发出指令：

```text
Set up online evaluation for this application with Langfuse.
```

**手动安装：**

```bash
npx skills add langfuse/skills --skill "langfuse"
# 指定 Agent
npx skills add langfuse/skills --skill "langfuse" --agent "<agent-id>"
```

或者手动克隆并软链接 Skill：

```bash
git clone https://github.com/langfuse/skills.git /path/to/langfuse-skills
mkdir -p /path/to/<agent-skill-root>/skills
ln -s /path/to/langfuse-skills/skills/langfuse /path/to/<agent-skill-root>/skills/langfuse
```

安装后让 Agent 为应用配置在线评估即可。

## 在 UI 中手动配置

流程是先创建**评估器（怎么评分）**，使用真实 Observation 测试，再关联**规则（哪些新到达的 Observation 需要评分）**。

[观看在线评估功能演示](https://static.langfuse.com/docs-videos/2026-08-22-new-eval-experience.mp4)。

### 1. 创建评估器

打开 [Evaluators 页面](https://cloud.langfuse.com/project/~/evals)，点击 **New evaluator**，选择模板或从零创建。

![创建评估器](https://langfuse.com/images/docs/evaluation/create-evaluator.png)

可选评估器：

- **[LLM-as-a-Judge](https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge)**：利用 LLM 评价相关性、语气、请求是否超出范围等需要语言理解的质量。需提前建立 [LLM Connection](https://langfuse.com/docs/administration/llm-connection)。
- **[Decision-model evaluator](https://langfuse.com/docs/evaluation/evaluation-methods/decision-models)**：使用 TypeSafe Jev 或 OpenAI 的类型化问题生成标签、评分档次或真假标记。该功能仍为实验性，需要 TypeSafe 或受支持的 OpenAI 连接。
- **[Code evaluator](https://langfuse.com/docs/evaluation/evaluation-methods/code-evaluators)**：执行 Python / TypeScript `evaluate` 函数，检查 JSON 格式、必需字段或关键词等确定性规则。

### 2. 用样本 Observation 测试

在右侧筛选具有代表性的生产 Observation，选择一条并执行评估器。不断迭代，直到评分结果符合预期。

![测试 LLM 评估器](https://langfuse.com/images/docs/evaluation/test-llm-evaluator.png)

### 3. 关联流量规则

保存评估器后，可以利用测试时的筛选条件创建 [Rule](https://langfuse.com/docs/evaluation/core-concepts#evaluators-and-rules)，也可以挂到已有规则上。

Rule 定义**哪些**新 Observation 接受评价，包括筛选条件、采样率，以及一个或多个评估器。应查看过去七天匹配的数据量；使用 LLM 裁判时，还应核算估计成本，并按需降低采样率。

### 4. 查看生产环境的 Score

新的匹配 Observation 到来时会被评分。打开评分后的 Observation，可查看分数和 LLM 裁判推理解释。使用 [Score Analytics](https://langfuse.com/docs/evaluation/scores/score-analytics)或[自定义 Dashboard](https://langfuse.com/docs/metrics/features/custom-dashboards)观察指标随时间的变化。

还可以通过[批量评估](https://langfuse.com/docs/evaluation/core-concepts#batch-evaluation)将同一评估器应用到选定历史 Observation。

遇到评估器未执行问题，参阅[官方 FAQ](https://langfuse.com/faq/all/observation-eval-not-executing)。

## 对在线流量评分的其他方式

自动评估器适合持续评估生产数据，但也可以选择：

| 需求 | 适用方式 |
| --- | --- |
| 人工检查部分 Trace | [UI 评分](/official/evaluation/evaluation-methods/scores-via-ui)、[标注队列](/official/evaluation/evaluation-methods/annotation-queues) |
| 采集用户点赞/点踩等反馈 | [用户反馈](/official/observability/features/user-feedback) |
| 从应用、Agent 或自有 Pipeline 推送评分 | [API/SDK 评分](https://langfuse.com/docs/evaluation/evaluation-methods/scores-via-sdk) |

## 后续步骤

- 学习 [Langfuse Academy 评估模块](https://langfuse.com/academy/evaluate)，选择可靠指标、编写可验证的评估器。
- 在 Score 低于阈值时[建立告警](https://langfuse.com/docs/observability/features/alerts)。
- 使用[自定义仪表盘](https://langfuse.com/docs/metrics/features/custom-dashboards)分析质量指标。

---

原文：[Evaluate Production Traffic](https://langfuse.com/docs/evaluation/get-started/online) · 非官方中文翻译。
