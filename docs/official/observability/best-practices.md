---
title: 良好的 Trace 应当是什么样？
description: 关于 Trace 范围、Observation 层级、命名、输入输出和属性的最佳实践。
---
# 良好的 Trace 应当是什么样？

Langfuse 已经显示出 Trace，但如何判断埋点是否合理？可以从结构、命名、输入输出和属性几方面检查。

Trace 结构不只是视觉效果，还会影响后续功能：

- [LLM-as-a-Judge](https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge)按 Observation 名称与类型定位对象，并读取输入输出。
- [Dashboard](/official/metrics/features/custom-dashboards)按 Trace、Observation 名称筛选和聚合。
- [数据集实验](https://langfuse.com/docs/evaluation/experiments)比较不同实验运行的输入和输出。
- Trace 表的 Saved View 引用名称和属性。

良好结构让当前排障更快，而稳定名称和有意义的输入输出能确保应用持续迭代时评估器、仪表盘和实验正常工作。

## 一条 Trace 的边界是什么？

[数据模型](/official/observability/data-model)分为三层：Observation 表示单个步骤，按 `trace_id` 汇总成 Trace，多条 Trace 可按 `session_id` 汇总为 Session。

**Trace 代表应用中一个相对独立的工作单元**，例如：

- 聊天机器人一轮交互：用户发消息、应用检索上下文、调用模型、返回响应。
- 一次 Agent 执行：接受任务、推理、调用工具、生成结果。
- 一次 Pipeline：文档进入，分块、Embedding 并保存。

多个独立工作单元串联时，应该通过 [Session](/official/observability/features/sessions)关联。例如聊天应用**每轮对话一条 Trace，整段对话一个 Session**，因为无法提前知道对话何时结束。这样每条 Trace 规模较小，更容易从 Session 页面阅读。

Trace 在 UI 中可以查看 Trace Tree 与 [Agent Graph](/official/observability/features/agent-graphs)。

![Trace Tree](https://langfuse.com/images/docs/faq/good-trace-tree.png)

![Agent Graph](https://langfuse.com/images/docs/faq/good-trace-agent-graph.png)

## 检查 Trace Tree

### 是否包含正确的步骤？

LLM、工具和其他关键步骤都应该在树中出现，并有正确的 [Observation 类型](/official/observability/features/observation-types)。

- LLM 调用应记录为 `generation`，以便携带成本、Token 与模型信息。
- 工具调用应记录为 `tool`，这样 LLM-as-a-Judge 可专门筛选工具步骤。

框架集成通常自动指定这些类型。手动埋点则使用 Python `as_type` 或 JS/TS `asType`。

### 是否正确嵌套？

Tool 调用应嵌套在执行该步骤的 `agent` 或 `span` 下，通常与请求该工具调用的 `generation` 作为兄弟节点，而不应都散落在 Trace 根部。

框架集成通常自动完成；手动埋点参阅[嵌套 Observation](https://langfuse.com/docs/observability/sdk/instrumentation#nesting-observations)。

**避免将整个 Agent 循环聚合为一次 LLM 调用。** 每一次模型调用都应是独立的 `generation`，并与 `tool` 调用交错展示。否则无法：

- 查看 Agent 在每次工具结果后如何决策；
- 查看每一步的 Thinking；
- 找出哪个工具调用占用了大量上下文 Token，从而优化成本。

**不推荐：整个循环使用单一 Generation，仅显示总成本与最终结果。**

![合并的 Generation](https://langfuse.com/images/docs/faq/good-trace-agent-collapsed-generation.png)

**推荐：每次模型调用单独记录 Generation。**

![交错记录 LLM 与工具调用](https://langfuse.com/images/docs/faq/good-trace-agent-interleaved-generations.png)

### 是否保存 Thinking？

推理模型在答复或调用工具前会产生 Thinking/Reasoning。应尽可能在每个 `generation` 中记录它，这对排查 Agent 为什么选择某个工具、端点或决策十分重要。

### 是否存在无用噪声？

不是每条 Observation 都对理解业务流程有价值。HTTP、数据库查询或框架内部 Span 往往增加噪声。可参阅[过滤无关 Span](https://langfuse.com/faq/all/unwanted-http-database-spans)。

![包含噪声的 Trace](https://langfuse.com/images/docs/faq/good-trace-noisy-spans.png)

## 选择合适的名称

Observation 和 Trace 名称用于评估器定位、仪表盘聚合、Trace 表导航等，应**像 API 一样对待名称**。修改后，引用旧名称的评估器、Dashboard 和已保存筛选器可能不再匹配，而且不一定有明显报错。

**使用动词起始的动作名称：**`classify-intent`、`retrieve-context`、`generate-response`、`summarize-results`。

**不要将动态值放入名称：**使用 `process-order`，而不是 `process-order-8945`；使用 `generate-response`，而非 `generate-response-retry-2`。运行期数据应保存在 [Metadata](/official/observability/features/metadata)，保持名称的低基数特性。

::: warning
不建议使用模型名（`gpt-4o`、`claude-sonnet`）作为 Observation 名称。更换模型后引用该名称的评估器、筛选器和仪表盘都会失效。Generation 本身已有独立 Model 属性。
:::

## 设置有意义的 Input 与 Output

通常操作应至少包含 Input 或 Output。如果两者都没有，应判断是否真的需要记录这条 Observation。

**根 Observation 最重要**：Trace 级输入输出由根节点派生，Trace 表会展示它们，评估器读取它们，数据集实验也用它们比较结果。对聊天应用，应将用户消息设为 Input，助手回答设为 Output，而不是直接塞入函数参数的原始 JSON。调试所需的原始 Payload 可放在 Metadata。

对于最常被查看的 Observation，应特别设计简洁、易理解的输入输出，因为团队可能为其创建预设筛选视图。

![Trace 表中的输入与输出](https://langfuse.com/images/docs/faq/good-trace-tracing-table-io.png)

Generation 的典型输入输出：

- 聊天应用：用户消息 / 助手响应；
- RAG：查询 / 生成的答案；
- 文本分类：待分类文本 / 预测标签。

::: info
大多数输入输出可以渲染为带 Role 的消息列表，而非 JSON 原文。建议使用标准 OpenAI 消息格式，每条消息有 `role` 和 `content`。如果希望工具调用显示为卡片，应将其放在 Assistant 消息的 `tool_calls` 数组中，并把各调用的 `arguments` 写为 JSON 编码字符串，如 `"{\"location\": \"Paris\"}"`。
:::

若 Input/Output 意外为空，参阅[空 Trace 输入输出排查](https://langfuse.com/faq/all/empty-trace-input-and-output)。

## 实用属性

### 用 Metadata 记录上下文

[Metadata](/official/observability/features/metadata)是 Observation 上的灵活键值存储，适合不属于名称、Input 和 Output 的背景信息，例如：

- **评估上下文**：Ground Truth、期望行为、评估器所需的其他条件。LLM-as-a-Judge 可在变量映射中引用 Metadata。
- **请求上下文**：内部 Request ID、API Route、应用版本、实验变体、Feature Flag。
- **检索上下文**：RAG 数据源、检索块数量、使用的索引，便于排查检索效果。
- **原始 Payload**：不适合显示在 Input/Output 中、但偶尔需要调试的完整请求与响应。
- **标注上下文**：人工审核者判断所需的额外信息。

Langfuse UI 支持按 Metadata Key 筛选。

### 在 Generation 中记录模型、Token 与成本

要按模型、用户或业务功能计算成本，需要在 `generation` 中提供：

- **Model 名称**：Langfuse 根据[模型价格表](https://langfuse.com/docs/observability/features/token-and-cost-tracking)查询价格。名称不匹配时无法自动计算成本。
- **Usage**：输入 Token、输出 Token，以及可选 Cached Token。
- **Cost**（可选）：在自有定价合约等场景下，明确覆盖自动计算结果。

大部分[集成](https://langfuse.com/integrations)会自动收集，手动埋点参阅 [Token/Cost Tracking](https://langfuse.com/docs/observability/features/token-and-cost-tracking)。

![Generation 属性](https://langfuse.com/images/docs/faq/good-trace-generation-attributes.png)

### 使用 Tag 表示业务维度

[Tag](/official/observability/features/tags)支持按业务维度筛选和拆解指标，例如比较 `web` 与 `api` 用户的延迟。

Tag **不可变，必须在 Observation 创建时设置**。适合请求来源、功能等预先确定的类别；对于事后才知道的质量结果，应使用 [Score](/official/evaluation/scores/overview)，而不是 Tag。

### 把 Prompt 关联到 Trace

使用[提示词管理](/official/prompt-management/overview)时，应把 Prompt [关联到 Generation](/official/prompt-management/features/link-to-traces)，便于确定某条 Trace 使用了哪个版本，并比较不同版本的指标变化。

### 设置 Environment

设置 [Environment](/official/observability/features/environments)，例如 `production`、`staging`、`development`，避免测试 Trace 干扰生产 Dashboard 与评估。

### 使用 User ID 追踪用户

[User ID](/official/observability/features/users)帮助把 Trace 关联到用户，从而回答：

- 哪些用户成本最高？
- 不同用户的质量有何差异？
- 特定用户的使用模式是什么？

### 用 Session ID 关联多条 Trace

业务中具有逻辑连续性的 Trace 应用 [Session](/official/observability/features/sessions)关联，以便按顺序重放完整交互，例如：

- 聊天应用的每轮消息分别成 Trace，整个对话一条 Session；
- 多个 Agent 协作生成报告；
- 跨多次请求并带人工审批步骤的流程。

如果应用完全是单次请求和响应，没有跨请求状态，可能不需要 Session。

![Session 页面](https://langfuse.com/images/docs/faq/good-trace-sessions-view.png)

---

原文：[What does a good trace look like?](https://langfuse.com/docs/observability/best-practices) · 非官方中文翻译。
