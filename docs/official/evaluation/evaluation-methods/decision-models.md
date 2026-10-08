---
title: 决策模型评估器
description: 使用 OpenAI 或 TypeSafe Jev 对 Observation 提出类型化问题，生成结构化评分。
---

# 决策模型评估器

::: info
决策模型评估器仍为**实验性功能**。设置流程已趋稳定，但 UI 和评分格式细节可能发生变化。
:::

决策模型（Decision Model）回答预先定义类型的问题，而不是生成自由文本。Langfuse 可使用 OpenAI 的 `gpt-6-luna` 或 [TypeSafe Jev](https://docs.typesafe.ai/introduction)。每一道 Choice、Score 或 Yes / no 问题都会向目标 Observation 写入一条 [Score](/official/evaluation/scores/overview)。

当评估结果是明确的标签、评分等级或真假概率时，选择决策模型；需要详细书面推理或无法提前限定答案空间时，使用 [LLM-as-a-Judge](/official/evaluation/evaluation-methods/llm-as-a-judge)。

## 工作原理

每个决策模型评估器包含三个部分：

1. **模型输入**：将 Observation 数据映射成提供商所需格式。OpenAI 接收名为 `input` 的单个通用状态，Jev 接收包含一个或多个命名字段的 JSON 状态。
2. **一道或多道问题**：每道问题有类型、指令和允许的回答；同一次模型调用回答全部问题。
3. **每题一条 Score**：类型化回答以题目配置的 Score Name 保存；提供商返回的概率和置信度存入 Score Metadata。

因此可以在同一次调用中评价话题、用户挫败程度和是否超出业务范围等不同维度。

## 为什么使用决策模型？

- **成本更低**：Jev 和 `gpt-6-luna` 都只按输入 Token 计费。TypeSafe [声称 Jev 在分类任务中比前沿模型便宜 40–400 倍](https://typesafe.ai/blog/introducing-system-one-models-and-jev)；[OpenAI 定价资料](https://developers.openai.com/api/docs/guides/decisions#pricing-and-availability)列出 `gpt-6-luna` 每百万输入 Token 为 0.10 美元，无输出 Token 费用。价格以提供商实时公告为准。
- **更快**：决策模型不进行自由文本生成。TypeSafe [声称 Jev 快 20–200 倍](https://typesafe.ai/blog/introducing-system-one-models-and-jev)；[OpenAI 资料](https://developers.openai.com/api/docs/guides/decisions)称 Decisions API 相对 Responses API 快约 10 倍。这些是提供商公布的性能描述，不代表每项任务均能实现。
- **可校准**：Yes / no 返回概率；Choice 和 Score 在可用时返回概率分布、置信度。
- **一致性**：输出被限定在事先定义的答案空间，更适合回归测试和长期质量指标。

## OpenAI 与 TypeSafe Jev 的区别

- **OpenAI**：只有一个名为 `input` 的整体 State。问题采用自然语言指令，不能直接引用 State 的特定子字段。
- **TypeSafe Jev**：State 是具有命名字段的 JSON。问题可以使用反引号引用字段，例如“Compare `output` with `expectedOutput`”。

二者都支持 Choice、Score、Yes / no 三种问题。

## 问题类型

| 类型 | 模型输出 | Langfuse Score | 示例 |
| --- | --- | --- | --- |
| **Choice** | 从 **2–255 个**固定选项中选一个，可选包含概率与置信度 | `CATEGORICAL`，Value 为选中的选项 | 工单转给 `billing`、`technical` 还是 `sales` |
| **Score** | 从 **2–10 个**有序等级中得到期望等级，可选概率分布与置信度 | `NUMERIC`，范围 `0` 到 `levels - 1` | 挫败程度从 `0` 冷静到 `3` 愤怒 |
| **Yes / no** | 断言为真的概率，TypeSafe 称为 [Noul](https://docs.typesafe.ai/primitives/noul) | `NUMERIC`，值为 `P(true)`，在 `0–1` 之间 | 是否请求退款：`0.93` |

**Choice** 适合路由与分类，如意图、失败模式、应该选择哪个工具。每个选项应写简短描述，并提供 `other` 或 `unclear` 等兜底选项。

**Score** 适合严重程度、挫败程度、回答完整性等 Rubric。等级按低到高排列并写明含义。输出是按概率加权的期望等级，因此 `1.7` 表示介于 1 和 2 之间、接近 2，并不意味着选中了一个整数等级。

**Yes / no** 适合护栏与标记，例如超出范围、包含 PII、用户不同意或违反政策。可明确什么情况算 True/False，并选择符合业务风险的阈值，或将结果分为自动处理、人工复核、忽略三个区间。

::: tip
每道问题应**只判断一件事**。例如“回答是否正确且礼貌”应拆成两道问题；仍可以在一次调用中一起求值。
:::

## 逐步设置

### 第 1 步：连接模型

打开 **Settings → LLM Connections**，新建 [OpenAI](#连接-openai) 或 [TypeSafe Jev](#连接-typesafe-jev) 连接，也可以选择已有的兼容连接。

### 第 2 步：创建评估器

打开 [Evaluators 页面](https://cloud.langfuse.com/project/~/evals)，点击 **New evaluator → New decision model evaluator**，选择模型连接与模型。

也可以选择模板：

- **Assign Input Topic（Choice）**：按自己定义的主题体系分类用户主要意图。
- **Flag Out-of-Scope Request（Yes / no）**：判断请求是否超出助手的职责。
- **Rate Customer Frustration（Score）**：用四级量表衡量用户挫败程度。
- **User Conversation Signal（7 道 Yes / no）**：一次检查聊天中的改写、纠错、请求人工转接、重复、错误引用、挫败感和成功确认，详见[官方文章](https://langfuse.com/blog/2026-09-23-catching-conversation-signals-in-langfuse)。

模板已预填输入与问题，通常只需选择相应模型连接。

### 第 3 步：定义问题

每个评价标准对应一道问题：

1. 选择 Choice、Score 或 Yes / no。
2. 输入问题；指令格式因提供商而异。
3. 配置允许回答：Choice 的选项和描述、Score 的有序等级、Yes / no 的 True/False 判定说明。
4. 设置 Score Name；Langfuse 会根据问题建议一个名称，但可以修改。

### 第 4 步：映射模型输入

选择要评估的 Observation 字段，映射到所选提供商的 State。OpenAI 和 Jev 的 State 结构不同，见下方的提供商配置说明。

### 第 5 步：测试评估器

在右侧筛选有代表性的 Observation，选择一条并运行。测试面板按问题展示答案、概率分布与置信度（如可用），以及估算费用。可以在 **Raw output** 查看发送给提供商的原始请求。修改题目或映射，直到样本结果符合预期。

### 第 6 步：保存并应用

保存后可以：

- 使用测试时的筛选条件创建 [Rule](/official/evaluation/core-concepts)，或关联已有 Rule，自动评估新到达的 Observation；
- 不配置 Rule，继续用于[历史批量评估](/official/evaluation/core-concepts)或[提示词实验](/official/evaluation/experiments/experiments-via-ui)。

每道问题的 Score 都可像其他评分一样参与筛选、图表和告警。

## 连接 OpenAI

添加包含有效 Key 的 **OpenAI** LLM Connection，选择可以使用 `gpt-6-luna` 的账号。Langfuse 会通过 OpenAI Decisions API 调用它。

Observation 数据映射到唯一的通用 `input` State；各问题以普通自然语言描述整体 State，**不能引用 State 的独立字段**。Score 等级必须有标签，可选填描述。

预览面板显示发往 OpenAI 的输入和问题。如果 OpenAI 拒绝回答任何一道问题，则**整个评估器运行失败，不写入任何 Score**。

## 连接 TypeSafe Jev

新增 Adapter 为 **typesafe** 的连接，选择 Jev 上游并填写 API Key：

| 上游 | API Key 来源 | 计费 |
| --- | --- | --- |
| TypeSafe | [TypeSafe Console](https://console.typesafe.ai/settings/keys) | TypeSafe |
| Vercel AI Gateway | [AI Gateway Key](https://vercel.com/docs/ai-gateway/authentication-and-byok) | AI Gateway |
| OpenRouter | [OpenRouter Key](https://openrouter.ai/settings/keys) | OpenRouter |

三个上游暴露 TypeSafe API，评估器使用方式一致。不需要额外 Base URL 或 Header。可以用 `jev-latest` 跟进新模型，也可固定 `jev-1.13.0` 等版本，确保长期阈值保持相对稳定。

在 JSON State 中配置命名字段，可映射 Observation Input、Output、Metadata、Tool Calls、Expected Output 和 Experiment Item Metadata。题目可用反引号引用这些字段。Jev 的 Score 等级**必须有描述**。

TypeSafe 连接仅适用于决策模型评估器，因为 Jev 不能生成自由文本。

## 决策模型写入的 Score

每题在被评价 Observation 上写入一条 Score。**Value 始终是问题的答案本身**，概率和置信度只保存在额外字段，不能混为一谈。

| 字段 | 内容 |
| --- | --- |
| `name` | 题目配置的 Score Name |
| `value` / `dataType` | Choice：选中项的 `CATEGORICAL`；Score：期望等级的 `NUMERIC`；Yes / no：`P(true)` 的 `NUMERIC` |
| `comment` | 答案的简短可读摘要，例如 `ready (p=0.91); confidence 0.82` 或 `P(true)=0.97` |
| `metadata.openai` / `metadata.typesafe` | `questionId`、类型、实际模型和（如可用）概率、置信度、评分等级说明 |

决策模型返回的是结构化结论，不是书面推理。因此 Comment 概括概率分布；分数明显有误时，应检查输入映射、判定条件并收紧题目或新增兜底选项。

## 调试评估执行

每次 Evaluator Run 都会在内部环境 `langfuse-llm-as-a-judge` 中创建一条名为 `Execute evaluator: <evaluator name>` 的 Trace。该 Trace 含有一条 Generation，记录精确的输入 State、问题、返回答案、Token 使用量和 Cost；运行产生的 Score 会关联到它。

内部环境默认不出现在 Trace 列表。可以将筛选条件设为 `environment = langfuse-llm-as-a-judge`，也可以通过 Score 打开对应的执行 Trace。

## 使用限制

| 项目 | 限制 |
| --- | --- |
| 每个评估器的问题数 | **1–50**，一次调用统一回答 |
| Choice 选项数 | **2–255**，Value 必须唯一 |
| Score 等级数 | **2–10**，有序 |
| Input 大小 | TypeSafe State 加最长问题约 **32k Token**；其他提供商也应控制输入大小 |
| 推理说明 | 不产生完整自然语言推理；需要解释应使用 LLM 裁判 |
| 拒绝作答 | OpenAI 可拒绝其中一道题，此时整次执行失败且不写 Score；Jev 总会选一项，因此不确定场景应提供 `other`、`unclear` |
| 数据处理 | 题目和数据发往选定的 OpenAI 或 TypeSafe 上游；敏感数据需检查相应服务条款并考虑[脱敏](/official/observability/features/masking) |

## 常见问题

### 什么时候使用决策模型而不是 LLM 裁判？

当答案空间事先确定（路由、分类、等级、护栏）时使用决策模型；需要文字解释或开放式判断时使用 LLM 裁判。也可以先对大量样本使用决策模型，再对标记样本运行 LLM 裁判。

### 为什么 Yes / no Score 是数字而不是布尔值？

返回的是**断言为真的概率**，不是硬性的 Yes/No 标签。Langfuse 将它存为 **0–1 的 Numeric Score**，因此可按业务风险设置阈值，例如 `>= 0.7`。需要布尔式判断时，可以使用带 `yes`、`no` 两个选项的 Choice 问题，但它会写入 Categorical Score。

### 决策模型能用于实验和批量评估吗？

可以。Evaluator 可通过 Rule 作用于新增 Observation，通过 Batch Evaluation 作用于历史 Observation，也可用于 Prompt Experiment。应把所需的 Experiment 字段映射到 Provider State。

### 在哪里获取 TypeSafe API Key？

在 [TypeSafe](https://typesafe.ai) 注册并从 [Console](https://console.typesafe.ai/settings/keys)生成。官方说明其直连访问仍有 Waitlist；已经使用 Vercel AI Gateway 或 OpenRouter 的用户，可选择相应上游的 Key，而无需注册 TypeSafe 账号。

## 相关阅读

- [用户对话信号识别](https://langfuse.com/blog/2026-09-23-catching-conversation-signals-in-langfuse)
- [使用 TypeSafe Jev 评估](https://langfuse.com/blog/2026-09-18-using-typesafes-jev-for-evals)
- [TypeSafe Jev 可观测性](https://langfuse.com/integrations/model-providers/typesafe)
- [如何编写可靠的评估器](https://langfuse.com/academy/evaluate/writing-evaluators)
- [TypeSafe 文档](https://docs.typesafe.ai/introduction)

官方 GitHub Discussions 属于运行时内容，请通过[原文](https://langfuse.com/docs/evaluation/evaluation-methods/decision-models)查看。

---

原文：[Decision model evaluators](https://langfuse.com/docs/evaluation/evaluation-methods/decision-models) · 本页已根据官方静态正文逐节补译。
