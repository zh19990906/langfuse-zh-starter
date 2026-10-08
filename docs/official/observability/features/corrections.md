---
title: 输出纠正
description: 在 Trace 或 Observation 上保存更理想的模型输出，构建训练数据和质量改进反馈。
---
# 输出纠正（Corrections）

输出纠正功能允许你直接在 Trace 和 Observation 详情中记录改进后的 LLM 输出。领域专家可以写下模型原本应该生成的内容，为微调数据集和持续质量改进提供基础。

![纠正输出与差异对比](https://langfuse.com/images/docs/corrections-diff-view.png)

## 为什么使用输出纠正？

- **领域专家反馈**：由专家提供符合业务知识的理想输出；
- **微调数据集**：导出原始输入及纠正后的输出，构建高质量训练数据；
- **质量基准**：比较实际输出和预期输出，发现系统性问题；
- **人工审核**：在审查流程中记录纠正，尤其适合[标注队列](/official/evaluation/evaluation-methods/annotation-queues)。

## 工作原理

可以通过 UI 或 API 给任意 Trace 或 Observation 添加纠正内容。纠正输出与原始输出一起展示，并提供差异（diff）视图。**每个 Trace 或 Observation 只能保存一条纠正输出。**

## 添加纠正

### 从 UI 添加

在 Trace 或 Observation 详情页：

1. 找到原始输出下方的 **Corrected Output** 字段；
2. 点击添加或编辑；
3. 输入改进后的输出；
4. 根据数据格式选择 **JSON 校验模式** 或 **纯文本模式**；
5. 使用 **diff** 查看原始输出与纠正输出之间的变化。

![从界面添加纠正](https://langfuse.com/images/docs/corrections-add-ui.png)

编辑器会在输入过程中自动保存，并在 JSON 模式下提供实时校验反馈。

### 使用 API / SDK

纠正内容以 Score 形式创建，`dataType` 为 `CORRECTION`，`name` 为 `output`。

#### Python

```python
from langfuse import Langfuse

langfuse = Langfuse()

# 为 Trace 添加纠正
langfuse.create_score(
    trace_id="trace-123",
    name="output",
    value="The corrected output text here",
    data_type="CORRECTION"
)

# 为 Observation 添加纠正
langfuse.create_score(
    trace_id="trace-123",
    observation_id="obs-456",
    name="output",
    value="The corrected output text here",
    data_type="CORRECTION"
)
```

#### TypeScript

```typescript
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

langfuse.score.create({
  traceId: "trace-123",
  name: "output",
  value: "The corrected output text here",
  dataType: "CORRECTION"
});

langfuse.score.create({
  traceId: "trace-123",
  observationId: "obs-456",
  name: "output",
  value: "The corrected output text here",
  dataType: "CORRECTION"
});
```

#### HTTP

```bash
curl -X POST https://cloud.langfuse.com/api/public/scores \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic <base64_encoded_credentials>" \
  -d '{
    "traceId": "trace-123",
    "observationId": "obs-456",
    "name": "output",
    "value": "The corrected output text here",
    "dataType": "CORRECTION"
  }'
```

## 获取纠正数据

纠正输出以 Score 存储，可以通过程序获取，用于构建数据集或分析模型表现。在 [Scores API](/official/api-and-data-platform/features/public-api#scores-api-v3) 中使用 `dataType=CORRECTION` 筛选，纠正后的内容位于 `value` 字段。

#### Python

```python
from langfuse import get_client

langfuse = get_client()
corrections = langfuse.api.scores_v3.get_many_v3(
    data_type="CORRECTION",
    fields="subject,details",
)
```

#### TypeScript

```typescript
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();
const corrections = await langfuse.api.scoresV3.getManyV3({
  dataType: "CORRECTION",
  fields: "subject,details",
});
```

#### HTTP

```bash
curl -X GET "https://cloud.langfuse.com/api/public/v3/scores?dataType=CORRECTION&fields=subject,details" \
  -H "Authorization: Basic <base64_encoded_credentials>"
```

---

原文：[Corrections](https://langfuse.com/docs/observability/features/corrections) · 非官方中文翻译。
