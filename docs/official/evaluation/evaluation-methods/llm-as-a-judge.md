---
title: LLM-as-a-Judge 评估
description: 利用 LLM 评价 Observation 与实验，设置评分规则、模型连接、变量映射和在线评估。
---

# LLM-as-a-Judge

LLM-as-a-Judge 让一个大语言模型充当“裁判”，对其他 LLM 应用的输出进行质量评估。可衡量事实准确性、相关性、帮助程度、毒性或业务定义的质量标准。

## 工作原理

将应用原始输入、生成输出以及评分标准（Rubric）发送给裁判模型。模型根据 Rubric 返回[评分](/official/evaluation/scores/overview)与判断理由。

一般需要四类信息：

1. **评分标准**：解释每个得分的含义，例如完全错误为 1 分、准确且引用充分为 5 分。
2. **输入上下文**：原始用户问题或 Prompt。
3. **被评价的输出**：实际的模型响应。
4. **可选参考答案**：Ground Truth 或 Expected Output。

## 为什么使用？

- **可扩展**：可以对大量生产调用自动评价，减少全面人工标注的工作量。
- **能够处理细微差别**：比严格匹配更适合相关性、语气与帮助程度等任务。
- **方便重复比较**：固定评分标准和模型后，可在相同任务上重复评估。

::: warning
裁判模型不是天然正确的。使用前应通过[人工标注样本校准](https://langfuse.com/guides/llm-as-a-judge-calibration-skill)，并使用 [Score Analytics](/official/evaluation/scores/score-analytics)对比裁判与人工评分的一致性。即使 Rubric 固定，模型输出仍可能发生波动。
:::

## 选择评价目标

Langfuse 支持在**单个 Observation**或**Experiment**上运行裁判。生产环境建议使用 Observation 级评估器；旧的 Trace 级评估器已经弃用。

| 评价目标 | 使用场景 | 可用数据 |
| --- | --- | --- |
| Observation | 生产调用、LLM Generation、工具步骤、检索结果等 | 匹配 Observation 的 Input、Output、Metadata、Tool Calls |
| Experiment | 离线数据集上的 Prompt/模型对比 | 实验执行数据、Expected Output、Experiment Item Metadata |

### Observation 评估器读取什么？

评估器只读取**被匹配的 Observation**，不能自动读取同一 Trace 的兄弟节点或子节点。

如果评价整个 Agent 的输入输出，应选择记录完整请求与答案的**逻辑根 Observation**。逻辑根是没有物理父节点，或者被 SDK 标记为应用根节点的 Observation，因此它也可能有物理父节点。

可以在 Rule 中使用 **Is Root Observation** 筛选逻辑根。但即使筛选根节点，子节点内容也不会自动合并进去；如果裁判需要全局摘要或检索证据，应由应用主动写入目标 Observation 的字段中。

### 在线还是离线？

- 想持续监控新到达的流量：在 Observation 上创建 Evaluator，使用 **Rule** 指定筛选和采样。
- 想检查历史 Observation：使用[批量评估](/official/evaluation/core-concepts)。
- 想对比 Prompt、模型或 Agent 版本：使用[实验](/official/evaluation/experiments/experiments-via-ui)。

## 逐步配置

### 1. 设置模型连接

先在 [LLM Connections](/official/administration/llm-connection) 中配置用于裁判的模型 Provider、密钥和 URL。

### 2. 创建评估器

进入 **Evaluators → New evaluator**，选择 **LLM-as-a-Judge**，从空白 Prompt 创建，或使用 Langfuse 提供的模板。模板会复制成可修改的新评估器，不会修改原模板。

![创建评估器](https://langfuse.com/images/docs/evaluation/create-evaluator.png)

### 3. 定义模型、Rubric 与 Score

Evaluator 定义**如何打分**，Rule 定义**哪些新到达的 Observation 需要打分**。

1. 选择项目默认模型，或者为该 Evaluator 单独选择模型。
2. 编写带变量的裁判 Prompt，例如 `{{input}}`、`{{output}}`、`{{ground_truth}}`。
3. 选择 Score 类型：`NUMERIC`（数值）、`CATEGORICAL`（分类）、`BOOLEAN`（布尔）。分类评分需要定义允许的类别，可在适用情形下允许多项匹配。

### 4. 映射 Prompt 变量

在 UI 中将每个 Prompt 变量映射到其要读取的字段。在线 Observation 评估可以使用 Input、Output、Metadata 和 Tool Calls。Prompt Experiment 另外提供 Expected Output 和 Experiment Item Metadata。

### 5. 测试

在右侧筛选代表性 Observation，选一条执行。检查实际 Score 和 Reasoning，反复调整模型、Prompt、评分定义或字段映射，直到与预期样本一致。

![测试评估器](https://langfuse.com/images/docs/evaluation/test-llm-evaluator.png)

### 6. 保存并应用

保存后可以：

- 利用测试的 Filter 创建 Rule，或者将 Evaluator 加入已有 Rule，评价新到达的 Observation。
- 不配置 Rule，留待历史数据批量评估或 Prompt Experiment 使用。

## 裁判 Prompt 的消息角色

裁判调用按照消息排列顺序发送给模型。简单场景只用一条 User 消息也可以。

| Role | 用途 |
| --- | --- |
| **System** | 放置稳定的评价标准、约束和长期规则；System 消息必须排在最前面 |
| **User** | 提供待评价的 Input、Output 以及实际问题 |
| **Assistant** | 需要复现对话上下文时使用 |

避免把待评价内容中的指令当成可信的系统规则，尤其应当防范 Prompt Injection。

## 多模态评估

LLM-as-a-Judge 可以读取包含图像、音频、文件等媒体的 Observation。将 `{{input}}`、`{{output}}` 等变量映射到媒体字段后，Langfuse 会解析[媒体引用](/official/observability/features/multi-modality)，与周围文本一起提交给裁判模型。

典型任务：比较图片描述和原图、比较语音 Agent 回答和原始音频、验证答案是否基于附带 PDF。

所选模型与 Provider **必须支持媒体类型**，否则 Evaluator 返回错误。自托管环境可以通过 [`LANGFUSE_EVALUATOR_MEDIA_...` 相关配置](https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge#multi-modal-evaluation)管理传输与大小限制。

## Evaluator 在哪里运行？

托管 LLM-as-a-Judge 由 Langfuse 的 **Worker** 从队列中接收匹配的 Observation，渲染 Prompt，通过项目 LLM Connection 调用裁判模型，再将评分写回。**它不在业务应用、浏览器或 Web 容器内执行。**

自托管时，必须确保 Worker 容器能够访问模型 Provider/网关。SSRF 的 Host/IP Allowlist 同样适用。可通过 `QUEUE_CONSUMER_EVAL_EXECUTION_QUEUE_IS_ENABLED` 将 Evaluator 执行分配到特定 Worker，通过 `LANGFUSE_EVAL_EXECUTION_WORKER_CONCURRENCY` 调整并发，默认 **5**。

## 项目默认模型

Evaluator 未指定独立模型时使用 Project Default Model。修改项目默认值后，所有依赖它的评估器都将使用新模型。此变化可能影响新旧 Score 的可比性。

## 通过 API 管理

使用 Evaluators 与 Evaluation Rules API 可以程序化创建、读取、修改评估器并将其附加到 Rule。Observation 级 Rule 可用布尔字段 `isRootObservation` 和 `=`、`<>` 运算符筛选逻辑根 Observation；下面是官方示例：

```json
{
  "type": "boolean",
  "column": "isRootObservation",
  "operator": "=",
  "value": true
}
```

详见 [Evaluators API](https://api.reference.langfuse.com/#tag/evaluators) 和 [Evaluation Rules API](https://api.reference.langfuse.com/#tag/evaluationrules) 的最新请求字段与响应 Schema。

除了 UI，还可以通过 [Public API](/official/api-and-data-platform/features/public-api)管理：

- **Evaluators**：保存裁判 Prompt、变量、默认映射、结构化 Score 定义及可选模型配置。每个 Evaluator 有稳定 ID，更新定义会产生新版本；已启用 Rule 使用最新版本。
- **Evaluation Rules**：定义筛选条件、采样率和一个或多个 Evaluator 分配。每条分配可使用默认映射或覆盖映射。Tool Calls 的映射在 API 中有特定字段要求，应对照[原文 API 部分](https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge#api)。

## 高级配置与迁移

### 配置 Score 输出

在 Advanced 部分，可为 Score 增加 Description 与 Reasoning 要求，进一步说明模型应该返回的结构化结果。

### 从 Trace 级迁移到 Observation 级

Trace 级 Evaluator 已弃用。迁移时需要重新选择评价对象并检查变量来源，参阅[官方迁移指南](https://langfuse.com/faq/all/llm-as-a-judge-migration)。

### Observation 级 Evaluator 未执行

检查是否有匹配的 Observation、Rule Filter、采样率、模型连接、Worker 状态和变量映射。[官方排障说明](https://langfuse.com/faq/all/observation-eval-not-executing)。

### Model configuration not valid for evaluation

保存时，Langfuse 会用当前 Score Schema 向模型发送短测试请求。如果失败，会阻止保存并显示 `Model configuration not valid for evaluation` 和 Provider 错误信息。

常见原因：

- 模型或前置代理**不支持 JSON Schema 结构化输出**，如错误中提到 `response_format`。
- Model Name 不存在、API Key 无效或 LLM Connection Base URL 不正确。

请修正连接、选择支持结构化输出的模型或直接调用 Provider，再次保存。

### 对历史 Observation 补评分

通过[批量评估](/official/evaluation/core-concepts)对历史 Observation 执行 Evaluator。

## 调试评估器执行

每次 LLM-as-a-Judge 执行都会创建完整 Trace，可查看 Prompt、模型返回内容、Token 用量、成本及失败原因。

内部 Trace 使用 Environment `langfuse-llm-as-a-judge`。在 Tracing 表按该 Environment 筛选：

![Evaluator 执行 Trace](https://langfuse.com/images/docs/evaluation/llm-as-a-judge-debug-traces.png)

## 常见问题

### LLM-as-a-Judge 是什么？

使用另一个 LLM，依据预先定义的 Rubric 为业务应用的回答打分，并返回评分理由；它结合了对自然语言细微差异的理解能力与批量自动化的扩展性。

### 能在生产环境自动评估吗？

可以。为 Observation Evaluator 添加 Rule，选择目标 Observation、筛选条件和采样率，即可在新数据到达时异步评分。实际执行由 Langfuse Worker 完成。

### 如何提高评分可靠性？

使用清晰、单一维度的 Rubric，固定或记录裁判版本，准备人工标注 Ground Truth，通过 [Score Analytics](/official/evaluation/scores/score-analytics)比较人工与自动评分的一致性，并定期复核失败案例。

### 与代码评估器有什么区别？

代码评估器适合确定性规则、格式与精确匹配；LLM 裁判适合相关性、帮助程度、解释质量等需要语义判断的维度。两者可以组合使用。

## 相关阅读

- [Langfuse Academy：Evaluation](https://langfuse.com/academy/evaluate)
- [编写可靠的评价器](https://langfuse.com/academy/evaluate/writing-evaluators)
- [选择评估目标](https://langfuse.com/academy/evaluate/choosing-what-to-evaluate)
- [校准 LLM-as-a-Judge](https://langfuse.com/guides/llm-as-a-judge-calibration-skill)
- [Score Analytics](/official/evaluation/scores/score-analytics)

官方动态 GitHub Discussions 组件未迁入，可在[原文](https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge)查看。

---

原文：[LLM-as-a-Judge](https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge)。
