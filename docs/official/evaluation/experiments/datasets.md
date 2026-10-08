---
title: 数据集（Datasets）
description: 数据集（Datasets）——Langfuse 官方文档中文整理。
---

# 数据集（Datasets）

Dataset 是可重复使用的测试样本集合，每个 DatasetItem 包含 Input、可选的 Expected Output、Metadata 等字段。结合 Experiment，团队可以在同一批数据上比较 Prompt、模型和应用代码的变更。

## 为什么需要数据集？

离线评估可以在部署前验证质量。线上发现的异常 Trace 也可以加入 Dataset，形成持续增长的回归样本。

## 创建 Dataset

可在 Langfuse UI 的 Datasets 页面创建，或使用 Python、JS/TS SDK 及公开 API。建议按业务场景分类，并为样本设计稳定 ID。

## 创建与上传 Item

支持手工添加、批量 CSV 导入、从生产 Trace 添加。输入结构应与 Task 或 Prompt 模板的变量契约一致，期望输出应适合所选 Evaluator。


## 多模态 Item

**多模态 DatasetItem：官方代码示例**

```python
from langfuse import get_client
from langfuse.media import LangfuseMedia

langfuse = get_client()

langfuse.create_dataset_item(
    dataset_name="visual-qa",
    input={
        "question": "What is shown in this image?",
        "image": LangfuseMedia(
            file_path="./example.jpg",
            content_type="image/jpeg",
        ),
    },
    expected_output={"label": "invoice"},
)

dataset = langfuse.get_dataset("visual-qa")
```

```ts
import { LangfuseClient, LangfuseMedia } from "@langfuse/client";
import fs from "node:fs";

const langfuse = new LangfuseClient();

await langfuse.dataset.createItem({
  datasetName: "visual-qa",
  input: {
    question: "What is shown in this image?",
    image: new LangfuseMedia({
      source: "bytes",
      contentBytes: fs.readFileSync("./example.jpg"),
      contentType: "image/jpeg",
    }),
  },
  expectedOutput: { label: "invoice" },
});

const dataset = await langfuse.dataset.get("visual-qa");
```


数据集可以保存媒体引用，在实验中重新解析。媒体的访问权限和签名链接可能过期，需要使用 SDK 的媒体解析机制。


## Dataset Folder

**创建和读取文件夹中的 Dataset：官方代码示例**

```python
dataset_name = "evaluation/qa-dataset"

# When creating a dataset, use the full dataset name
langfuse.create_dataset(
    name=dataset_name,
)

# When fetching a dataset in a folder, use the full dataset name
langfuse.get_dataset(
    name=dataset_name
)

```

```ts
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

const datasetName = "evaluation/qa-dataset";
const encodedName = encodeURIComponent(datasetName); // "evaluation%2Fqa-dataset"

// When creating a dataset, use the full dataset name
await langfuse.dataset.create(datasetName);

// When fetching a dataset in a folder, use the encoded name
await langfuse.dataset.get(encodedName);
```


Dataset 名称可以通过路径组织，例如按团队、功能或评估任务分层；通过 SDK 创建/获取时使用完整名称。


## 版本控制

**读取版本化 Dataset：官方代码示例**

```python
from langfuse import get_client
from datetime import datetime, timezone

langfuse = get_client()

# Capture dataset state as of 2025-12-15 at 06:30:00 UTC
version_timestamp = datetime(2025, 12, 15, 6, 30, 0, tzinfo=timezone.utc)

# Fetch dataset at version timestamp
dataset_at_version = langfuse.get_dataset(
    name="my-dataset",
    version=version_timestamp
)

# Fetch latest version
dataset_latest = langfuse.get_dataset(name="my-dataset")
```

```typescript
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

// Capture the timestamp (use item's createdAt)
const versionTimestamp = new Date("2025-12-15T06:30:00Z").toISOString();

// Fetch dataset at version timestamp
const datasetAtVersion = await langfuse.dataset.get("my-dataset", {
  version: versionTimestamp
});

// Fetch latest version
const datasetLatest = await langfuse.dataset.get("my-dataset");
```


**运行固定版本实验：官方代码示例**

```python
from datetime import datetime, timezone
from langfuse import Langfuse

langfuse = Langfuse()

version_timestamp = datetime(2025, 12, 15, 6, 30, 0, tzinfo=timezone.utc)

# Fetch versioned dataset
versioned_dataset = langfuse.get_dataset("qa-dataset", version=version_timestamp)

# Run experiment on the versioned dataset
def my_llm_application(*, item, **kwargs):
    # Your LLM application logic here
    # For this example, we'll just return the expected output
    return item.expected_output

result = versioned_dataset.run_experiment(
    name="Baseline Experiment v1",
    description="Running on dataset v1",
    task=my_llm_application
)
```

```typescript
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

// Capture the version timestamp
const versionTimestamp = new Date("2025-12-15T06:30:00Z").toISOString();

// Fetch versioned dataset
const versionedDataset = await langfuse.dataset.get("qa-dataset", {
  version: versionTimestamp
});
// Run experiment on the versioned dataset
const result = await versionedDataset.runExperiment({
  name: "Baseline Experiment v1",
  description: "Running on dataset v1",
  task: async (item) => {
    // Your LLM application logic here
    // For this example, we'll just return the expected output
    return item.expectedOutput;
  }
});
```


可以按历史时间戳获取 Dataset 的特定状态，保证多轮 Experiment 使用相同版本。归档与编辑 Item 会影响最新状态，比较实验时需固定版本。


## Schema 约束

**Dataset Schema：官方代码示例**

```python
langfuse.create_dataset(
    name="qa-conversations",
    input_schema={
        "type": "object",
        "properties": {
            "messages": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "role": {"type": "string", "enum": ["user", "assistant", "system"]},
                        "content": {"type": "string"}
                    },
                    "required": ["role", "content"]
                }
            }
        },
        "required": ["messages"]
    },
    expected_output_schema={
        "type": "object",
        "properties": {"response": {"type": "string"}},
        "required": ["response"]
    }
)
```

```typescript
await langfuse.createDataset({
  name: "qa-conversations",
  inputSchema: {
    type: "object",
    properties: {
      messages: {
        type: "array",
        items: {
          type: "object",
          properties: {
            role: { type: "string", enum: ["user", "assistant", "system"] },
            content: { type: "string" }
          },
          required: ["role", "content"]
        }
      }
    },
    required: ["messages"]
  },
  expectedOutputSchema: {
    type: "object",
    properties: { response: { type: "string" } },
    required: ["response"]
  }
});
```


通过 Schema Enforcement 检查 DatasetItem 的 Input 和 Expected Output，减少无效数据进入实验。


## 合成数据与生产数据

**从 Trace 生成样本：官方代码示例**

```python
langfuse.create_dataset_item(
    dataset_name="<dataset_name>",
    input={ "text": "hello world" },
    expected_output={ "text": "hello world" },
    # link to a trace
    source_trace_id="<trace_id>",
    # optional: link to a specific observation
    source_observation_id="<observation_id>"
)
```

```ts
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

await langfuse.dataset.createItem({
  datasetName: "<dataset_name>",
  input: { text: "hello world" },
  expectedOutput: { text: "hello world" },
  // link to a trace
  sourceTraceId: "<trace_id>",
  // optional: link to a specific observation
  sourceObservationId: "<observation_id>",
});
```


既可以生成合成测试样本，也可以从生产 Observation 选择真实失败案例，并进行必要的隐私脱敏。


## 批量加入与归档

**修改或归档样本：官方代码示例**

```python
langfuse.create_dataset_item(
    dataset_name="<dataset_name>",
    id="<item_id>",
    # example: update status to "ARCHIVED"
    status="ARCHIVED"
)
```

```ts
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

await langfuse.dataset.createItem({
  datasetName: "<dataset_name>",
  id: "<item_id>",
  // example: update status to "ARCHIVED"
  status: "ARCHIVED",
});
```


大批量追加样本时，应管理稳定 ID 和版本变化；不再有效的案例可归档，而不必永久删除。


## Dataset Run

Dataset Run 关联某一次实验执行的输入项、Trace、输出与评分，详见[实验数据模型](/official/evaluation/experiments/data-model)。


::: info 翻译状态
已将原文代码块按章节位置重新整理，仍待执行版本兼容与构建验证。此页暂不计入“完整验收”文档。
:::

原文：[数据集（Datasets）](https://langfuse.com/docs/evaluation/experiments/datasets)。
