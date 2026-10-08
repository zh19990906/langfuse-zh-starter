---
title: 通过 API/SDK 写入评分
description: 通过 API/SDK 写入评分 的中文技术说明与原文示例。
---

# 通过 API/SDK 写入 Score

Score 是可附着于 Trace、Observation、Session 或 DatasetRun 的质量结果，数据类型包括 Numeric、Categorical、Boolean、Text。除了 UI 和自动 Evaluator，也可以从应用的 API/SDK 主动写入。

## 创建 Trace 和 Observation Score

Python 与 TypeScript SDK 支持通过明确的 Trace ID / Observation ID 创建 Score；也可在活动追踪上下文中为当前 Observation 或 Trace 打分。

- **低层方法**：明确传入目标 ID，适合异步评估 Pipeline。
- **当前 Observation**：直接在活动 Context 中评分，适合执行期的业务逻辑。
- **当前上下文**：利用上下文传播来定位目标，无须重复传递 ID。


### Trace / Observation 评分的完整代码

以下按 Python、TypeScript 和 REST API 分组展示官方的低层创建方法、当前 Observation 评分及当前 Context 评分。注意各语言 SDK 的方法名称和异步 Flush 方式不同。

**Python SDK · 示例 1**

```python
from langfuse import get_client
langfuse = get_client()

# Method 1: Score via low-level method
langfuse.create_score(
    name="correctness",
    value=0.9,
    trace_id="trace_id_here",
    observation_id="observation_id_here", # optional
    data_type="NUMERIC", # optional, inferred if not provided
    comment="Factually correct", # optional
)

# Method 2: Score current observation (within context)
with langfuse.start_as_current_observation(as_type="span", name="my-operation") as span:
    # Score the current observation
    span.score(
        name="correctness",
        value=0.9,
        data_type="NUMERIC",
        comment="Factually correct"
    )

    # Score the trace
    span.score_trace(
        name="overall_quality",
        value=0.95,
        data_type="NUMERIC"
    )


# Method 3: Score via the current context
with langfuse.start_as_current_observation(as_type="span", name="my-operation"):
    # Score the current observation
    langfuse.score_current_span(
        name="correctness",
        value=0.9,
        data_type="NUMERIC",
        comment="Factually correct"
    )

    # Score the trace
    langfuse.score_current_trace(
        name="overall_quality",
        value=0.95,
        data_type="NUMERIC"
    )
```

**Python SDK · 示例 2**

```python
from langfuse import get_client
langfuse = get_client()

# Method 1: Score via low-level method
langfuse.create_score(
    name="accuracy",
    value="partially correct",
    trace_id="trace_id_here",
    observation_id="observation_id_here", # optional
    data_type="CATEGORICAL", # optional, inferred if not provided
    comment="Some factual errors", # optional
)

# Method 2: Score current observation (within context)
with langfuse.start_as_current_observation(as_type="span", name="my-operation") as span:
    # Score the current observation
    span.score(
        name="accuracy",
        value="partially correct",
        data_type="CATEGORICAL",
        comment="Some factual errors"
    )

    # Score the trace
    span.score_trace(
        name="overall_quality",
        value="partially correct",
        data_type="CATEGORICAL"
    )

# Method 3: Score via the current context
with langfuse.start_as_current_observation(as_type="span", name="my-operation"):
    # Score the current observation
    langfuse.score_current_span(
        name="accuracy",
        value="partially correct",
        data_type="CATEGORICAL",
        comment="Some factual errors"
    )

    # Score the trace
    langfuse.score_current_trace(
        name="overall_quality",
        value="partially correct",
        data_type="CATEGORICAL"
    )
```

**Python SDK · 示例 3**

```python
from langfuse import get_client
langfuse = get_client()

# Method 1: Score via low-level method
langfuse.create_score(
    name="helpfulness",
    value=0, # 0 or 1
    trace_id="trace_id_here",
    observation_id="observation_id_here", # optional
    data_type="BOOLEAN", # required, numeric values without data type would be inferred as NUMERIC
    comment="Incorrect answer", # optional
)

# Method 2: Score current observation (within context)
with langfuse.start_as_current_observation(as_type="span", name="my-operation") as span:
    # Score the current observation
    span.score(
        name="helpfulness",
        value=1, # 0 or 1
        data_type="BOOLEAN",
        comment="Very helpful response"
    )

    # Score the trace
    span.score_trace(
        name="overall_quality",
        value=1, # 0 or 1
        data_type="BOOLEAN"
    )
# Method 3: Score via the current context
with langfuse.start_as_current_observation(as_type="span", name="my-operation"):
    # Score the current observation
    langfuse.score_current_span(
        name="helpfulness",
        value=1, # 0 or 1
        data_type="BOOLEAN",
        comment="Very helpful response"
    )

    # Score the trace
    langfuse.score_current_trace(
        name="overall_quality",
        value=1, # 0 or 1
        data_type="BOOLEAN"
    )
```

**Python SDK · 示例 4**

```python
from langfuse import get_client
langfuse = get_client()

# Method 1: Score via low-level method
langfuse.create_score(
    name="reviewer_notes",
    value="The response was helpful but could be more concise.",
    trace_id="trace_id_here",
    observation_id="observation_id_here", # optional
    data_type="TEXT", # optional, inferred if not provided
    comment="Reviewed by QA team", # optional
)

# Method 2: Score current observation (within context)
with langfuse.start_as_current_observation(as_type="span", name="my-operation") as span:
    # Score the current observation
    span.score(
        name="reviewer_notes",
        value="The response was helpful but could be more concise.",
        data_type="TEXT",
        comment="Reviewed by QA team"
    )

    # Score the trace
    span.score_trace(
        name="overall_notes",
        value="Good quality overall, minor formatting issues.",
        data_type="TEXT"
    )

# Method 3: Score via the current context
with langfuse.start_as_current_observation(as_type="span", name="my-operation"):
    # Score the current observation
    langfuse.score_current_span(
        name="reviewer_notes",
        value="The response was helpful but could be more concise.",
        data_type="TEXT",
        comment="Reviewed by QA team"
    )

    # Score the trace
    langfuse.score_current_trace(
        name="overall_notes",
        value="Good quality overall, minor formatting issues.",
        data_type="TEXT"
    )
```

**TypeScript SDK · 示例 5**

```ts
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

langfuse.score.create({
  id: "unique_id", // optional, can be used as an idempotency key to update the score subsequently
  traceId: message.traceId,
  observationId: message.generationId, // optional
  name: "correctness",
  value: 0.9,
  dataType: "NUMERIC", // optional, inferred if not provided
  comment: "Factually correct", // optional
});

// Flush the scores in short-lived environments
await langfuse.flush();
```

**TypeScript SDK · 示例 6**

```ts
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

langfuse.score.create({
  id: "unique_id", // optional, can be used as an idempotency key to update the score subsequently
  traceId: message.traceId,
  observationId: message.generationId, // optional
  name: "accuracy",
  value: "partially correct",
  dataType: "CATEGORICAL", // optional, inferred if not provided
  comment: "Factually correct", // optional
});

// Flush the scores in short-lived environments
await langfuse.flush();
```

**TypeScript SDK · 示例 7**

```ts
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

langfuse.score.create({
  id: "unique_id", // optional, can be used as an idempotency key to update the score subsequently
  traceId: message.traceId,
  observationId: message.generationId, // optional
  name: "helpfulness",
  value: 0, // 0 or 1
  dataType: "BOOLEAN", // required, numeric values without data type would be inferred as NUMERIC
  comment: "Incorrect answer", // optional
});

// Flush the scores in short-lived environments
await langfuse.flush();
```

**TypeScript SDK · 示例 8**

```ts
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

langfuse.score.create({
  id: "unique_id", // optional, can be used as an idempotency key to update the score subsequently
  traceId: message.traceId,
  observationId: message.generationId, // optional
  name: "reviewer_notes",
  value: "The response was helpful but could be more concise.",
  dataType: "TEXT", // optional, inferred if not provided
  comment: "Reviewed by QA team", // optional
});

// Flush the scores in short-lived environments
await langfuse.flush();
```

**REST API · 示例 9**

```bash
curl -X POST https://cloud.langfuse.com/api/public/scores \
  -u "pk-lf-...":"sk-lf-..." \
  -H "Content-Type: application/json" \
  -d '{
    "traceId": "trace_id_here",
    "observationId": "observation_id_here",
    "name": "correctness",
    "value": 0.9,
    "dataType": "NUMERIC",
    "comment": "Factually correct"
  }'
```

**REST API · 示例 10**

```bash
curl -X POST https://cloud.langfuse.com/api/public/scores \
  -u "pk-lf-...":"sk-lf-..." \
  -H "Content-Type: application/json" \
  -d '{
    "traceId": "trace_id_here",
    "observationId": "observation_id_here",
    "name": "accuracy",
    "value": "partially correct",
    "dataType": "CATEGORICAL",
    "comment": "Some factual errors"
  }'
```

**REST API · 示例 11**

```bash
curl -X POST https://cloud.langfuse.com/api/public/scores \
  -u "pk-lf-...":"sk-lf-..." \
  -H "Content-Type: application/json" \
  -d '{
    "traceId": "trace_id_here",
    "observationId": "observation_id_here",
    "name": "helpfulness",
    "value": 0,
    "dataType": "BOOLEAN",
    "comment": "Incorrect answer"
  }'
```

**REST API · 示例 12**

```bash
curl -X POST https://cloud.langfuse.com/api/public/scores \
  -u "pk-lf-...":"sk-lf-..." \
  -H "Content-Type: application/json" \
  -d '{
    "traceId": "trace_id_here",
    "observationId": "observation_id_here",
    "name": "reviewer_notes",
    "value": "The response was helpful but could be more concise.",
    "dataType": "TEXT",
    "comment": "Reviewed by QA team"
  }'
```

## 浏览器评分

收集用户点赞、点踩时，应让浏览器向自己可信的后端发送评分，后端再使用项目密钥写入 Langfuse。不要在浏览器内暴露 Langfuse Secret Key。


### 前端用户评分的完整代码

浏览器集成只应使用公开凭据，不能嵌入 Secret Key；下面依次是官方安装命令及客户端代码。

**REST API · 示例 13**

```bash
npm install @langfuse/browser
```

**TypeScript SDK · 示例 14**

```ts
import { LangfuseBrowserClient } from "@langfuse/browser";

const langfuse = new LangfuseBrowserClient({
  publicKey: process.env.NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY!,
  baseUrl: process.env.NEXT_PUBLIC_LANGFUSE_BASE_URL, // optional, defaults to https://cloud.langfuse.com
});

await langfuse.score({
  traceId: message.traceId,
  observationId: message.generationId, // optional
  id: `user-feedback-${message.traceId}`, // optional, use as an idempotency key
  name: "user-feedback",
  value: 1, // 1 for positive, 0 for negative
  dataType: "BOOLEAN",
  comment: "Helpful answer", // optional
});
```

## Session 级 Score

跨多轮对话的质量结果，可以关联 Session ID。例如评价整个客服对话是否解决问题，而不是只评价一条消息。


### Session 评分的完整代码

以下分别是 Python、TypeScript 与 REST API 的官方示例。Session Score 评价整个会话，而不是单条模型调用。

**Python SDK · 示例 15**

```python
from langfuse import get_client
langfuse = get_client()

langfuse.create_score(
    name="session_quality",
    value=0.85,
    session_id="session_id_here",
    data_type="NUMERIC",
    comment="Overall conversation quality"
)
```

**TypeScript SDK · 示例 16**

```ts
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

langfuse.score.create({
  name: "session_quality",
  value: 0.85,
  sessionId: "session_id_here",
  dataType: "NUMERIC",
  comment: "Overall conversation quality",
});

await langfuse.flush();
```

**REST API · 示例 17**

```bash
curl -X POST https://cloud.langfuse.com/api/public/scores \
  -u "pk-lf-...":"sk-lf-..." \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_id_here",
    "name": "session_quality",
    "value": 0.85,
    "dataType": "NUMERIC",
    "comment": "Overall conversation quality"
  }'
```

## 高级功能

### 防止重复评分

可以为 Score 指定稳定 ID 以便幂等创建或更新。注意同一 Score 名称不一定意味着同一条评分记录。


### 带 ScoreConfig 的类型化评分示例

以下提供 Numeric、Categorical、Boolean 和 Text 类型，按照 Python、TypeScript 和 REST API 分组。示例保留原文的创建方式；ScoreConfig 可以用来校验评分的类型和允许值。

**Python SDK · 示例 18**

```python
from langfuse import get_client
langfuse = get_client()

# Method 1: Score via low-level method
langfuse.create_score(
    trace_id="trace_id_here",
    observation_id="observation_id_here", # optional
    session_id="session_id_here", # optional, ID of the session the score relates to
    name="accuracy",
    value=0.9,
    comment="Factually correct", # optional
    score_id="unique_id", # optional, can be used as an idempotency key to update the score subsequently
    config_id="78545-6565-3453654-43543", # optional, to ensure that the score follows a specific min/max value range
    data_type="NUMERIC" # optional, possibly inferred
)

# Method 2: Score within context
with langfuse.start_as_current_observation(as_type="span", name="my-operation") as span:
    span.score(
        name="accuracy",
        value=0.9,
        comment="Factually correct",
        config_id="78545-6565-3453654-43543",
        data_type="NUMERIC"
    )
```

**Python SDK · 示例 19**

```python
from langfuse import get_client
langfuse = get_client()

# Method 1: Score via low-level method
langfuse.create_score(
    trace_id="trace_id_here",
    observation_id="observation_id_here", # optional
    name="correctness",
    value="correct",
    comment="Factually correct", # optional
    score_id="unique_id", # optional, can be used as an idempotency key to update the score subsequently
    config_id="12345-6565-3453654-43543", # optional, to ensure that the score maps to a specific category defined in a score config
    data_type="CATEGORICAL" # optional, possibly inferred
)

# Method 2: Score within context
with langfuse.start_as_current_observation(as_type="span", name="my-operation") as span:
    span.score(
        name="correctness",
        value="correct",
        comment="Factually correct",
        config_id="12345-6565-3453654-43543",
        data_type="CATEGORICAL"
    )
```

**Python SDK · 示例 20**

```python
from langfuse import get_client
langfuse = get_client()

# Method 1: Score via low-level method
langfuse.create_score(
    trace_id="trace_id_here",
    observation_id="observation_id_here", # optional
    name="helpfulness",
    value=1,
    comment="Factually correct", # optional
    score_id="unique_id", # optional, can be used as an idempotency key to update the score subsequently
    config_id="93547-6565-3453654-43543", # optional, can be used to infer the score data type and validate the score value
    data_type="BOOLEAN" # optional, possibly inferred
)

# Method 2: Score within context
with langfuse.start_as_current_observation(as_type="span", name="my-operation") as span:
    span.score(
        name="helpfulness",
        value=1,
        comment="Factually correct",
        config_id="93547-6565-3453654-43543",
        data_type="BOOLEAN"
    )
```

**Python SDK · 示例 21**

```python
from langfuse import get_client
langfuse = get_client()

# Method 1: Score via low-level method
langfuse.create_score(
    trace_id="trace_id_here",
    observation_id="observation_id_here", # optional
    name="reviewer_notes",
    value="The response was helpful but could be more concise.",
    comment="Reviewed by QA team", # optional
    score_id="unique_id", # optional, can be used as an idempotency key to update the score subsequently
    config_id="24680-6565-3453654-43543", # optional
    data_type="TEXT" # optional, possibly inferred
)

# Method 2: Score within context
with langfuse.start_as_current_observation(as_type="span", name="my-operation") as span:
    span.score(
        name="reviewer_notes",
        value="The response was helpful but could be more concise.",
        comment="Reviewed by QA team",
        config_id="24680-6565-3453654-43543",
        data_type="TEXT"
    )
```

**TypeScript SDK · 示例 22**

```ts
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

langfuse.score.create({
  traceId: message.traceId,
  observationId: message.generationId, // optional
  name: "accuracy",
  value: 0.9,
  comment: "Factually correct", // optional
  id: "unique_id", // optional, can be used as an idempotency key to update the score subsequently
  configId: "78545-6565-3453654-43543", // optional, to ensure that the score follows a specific min/max value range
  dataType: "NUMERIC", // optional, possibly inferred
});

// Flush the scores in short-lived environments
await langfuse.flush();
```

**TypeScript SDK · 示例 23**

```ts
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

langfuse.score.create({
  traceId: message.traceId,
  observationId: message.generationId, // optional
  name: "correctness",
  value: "correct",
  comment: "Factually correct", // optional
  id: "unique_id", // optional, can be used as an idempotency key to update the score subsequently
  configId: "12345-6565-3453654-43543", // optional, to ensure that a score maps to a specific category defined in a score config
  dataType: "CATEGORICAL", // optional, possibly inferred
});

// Flush the scores in short-lived environments
await langfuse.flush();
```

**TypeScript SDK · 示例 24**

```ts
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

langfuse.score.create({
  traceId: message.traceId,
  observationId: message.generationId, // optional
  name: "helpfulness",
  value: 1,
  comment: "Factually correct", // optional
  id: "unique_id", // optional, can be used as an idempotency key to update the score subsequently
  configId: "93547-6565-3453654-43543", // optional, can be used to infer the score data type and validate the score value
  dataType: "BOOLEAN", // optional, possibly inferred
});

// Flush the scores in short-lived environments
await langfuse.flush();
```

**TypeScript SDK · 示例 25**

```ts
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

langfuse.score.create({
  traceId: message.traceId,
  observationId: message.generationId, // optional
  name: "reviewer_notes",
  value: "The response was helpful but could be more concise.",
  comment: "Reviewed by QA team", // optional
  id: "unique_id", // optional, can be used as an idempotency key to update the score subsequently
  configId: "24680-6565-3453654-43543", // optional
  dataType: "TEXT", // optional, possibly inferred
});

// Flush the scores in short-lived environments
await langfuse.flush();
```

**REST API · 示例 26**

```bash
curl -X POST https://cloud.langfuse.com/api/public/scores \
  -u "pk-lf-...":"sk-lf-..." \
  -H "Content-Type: application/json" \
  -d '{
    "id": "unique_id",
    "traceId": "trace_id_here",
    "observationId": "observation_id_here",
    "name": "accuracy",
    "value": 0.9,
    "dataType": "NUMERIC",
    "configId": "78545-6565-3453654-43543",
    "comment": "Factually correct"
  }'
```

**REST API · 示例 27**

```bash
curl -X POST https://cloud.langfuse.com/api/public/scores \
  -u "pk-lf-...":"sk-lf-..." \
  -H "Content-Type: application/json" \
  -d '{
    "id": "unique_id",
    "traceId": "trace_id_here",
    "observationId": "observation_id_here",
    "name": "correctness",
    "value": "correct",
    "dataType": "CATEGORICAL",
    "configId": "12345-6565-3453654-43543",
    "comment": "Factually correct"
  }'
```

**REST API · 示例 28**

```bash
curl -X POST https://cloud.langfuse.com/api/public/scores \
  -u "pk-lf-...":"sk-lf-..." \
  -H "Content-Type: application/json" \
  -d '{
    "id": "unique_id",
    "traceId": "trace_id_here",
    "observationId": "observation_id_here",
    "name": "helpfulness",
    "value": 1,
    "dataType": "BOOLEAN",
    "configId": "93547-6565-3453654-43543",
    "comment": "Factually correct"
  }'
```

**REST API · 示例 29**

```bash
curl -X POST https://cloud.langfuse.com/api/public/scores \
  -u "pk-lf-...":"sk-lf-..." \
  -H "Content-Type: application/json" \
  -d '{
    "id": "unique_id",
    "traceId": "trace_id_here",
    "observationId": "observation_id_here",
    "name": "reviewer_notes",
    "value": "The response was helpful but could be more concise.",
    "dataType": "TEXT",
    "configId": "24680-6565-3453654-43543",
    "comment": "Reviewed by QA team"
  }'
```

### ScoreConfig

ScoreConfig 约束 Name、Type、范围与允许类别，统一不同来源的评分契约。如果团队已经创建了配置，API/SDK 可通过 Config ID 关联。

### Score 字段推断

SDK 可能根据传入 Value 或 Config 自动决定 Score DataType；生产系统推荐明确约定类型，避免随请求内容改变。

## 更新已有 Score

Score 的更新通常需要已知 ID 和对应 API 路径。请区分“创建新评分”“幂等写入”与“修改既有评分”，并确认相应 SDK 版本与服务器接口。

## 相关内容

- [Score 概览](/official/evaluation/scores/overview)
- [Score 数据模型](/official/evaluation/scores/data-model)
- [用户反馈](/official/observability/features/user-feedback)
- [评分分析](/official/evaluation/scores/score-analytics)

## 精校补充：评分创建与读取的区别

创建评分应使用 SDK Score Helper 或 `POST /api/public/scores`；读取评分可使用 `GET /api/public/v3/scores`。**Scores API v3 的读取 `value` 是类型化数据**：数值为 number、布尔为 boolean、类别与文本为 string；不要把新版读取的布尔型值直接当作 0/1。

在 Python v4.8.1+ 中，v3 读取位于 `langfuse.api.scores_v3`；JS/TS v5.5.0+ 中位于 `langfuse.api.scoresV3`。旧的 `api.scores` v2 读取已经弃用。

### 幂等写入与关联

同一评分写入流程可为 Score 指定稳定 ID，在重试场景避免重复记录。但 **Score Name 并非唯一 ID**，也不能单凭同名确定要更新的记录。Trace、Observation、Session 和 DatasetRun 属于不同关联层级，创建时应明确指定正确对象。

### 浏览器中写入用户反馈

前端应使用官方 [`@langfuse/browser`](https://www.npmjs.com/package/@langfuse/browser) 的受支持方式，只配置 Public Key；**不能把 Langfuse Secret Key 暴露给网页**。浏览器包只能发送客户端评分，不负责创建 Trace 和 Observation。完整签名、限制与示例需以原文的 Browser Score Ingestion 章节为准。


::: info 代码验收说明
以上 29 组示例与上游代码块数量一致，已按用途重新归位；未在当前环境实际执行 SDK/HTTP 请求，不能据此视为运行测试通过。
:::

原文：[Scores via SDK](https://langfuse.com/docs/evaluation/evaluation-methods/scores-via-sdk)。
