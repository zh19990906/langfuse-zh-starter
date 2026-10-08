---
title: 通过 SDK 运行实验
description: 通过 SDK 运行实验——Langfuse 官方文档中文整理。
---

# 通过 SDK 运行实验

Langfuse Experiment Runner 可以在 Python 或 TypeScript 代码中运行自己的 LLM/Agent 应用，将每次 Task 输出、Trace 和评估分数关联到实验结果。适合复杂 Agent、工具调用和业务依赖较多的场景。

## 为什么通过 SDK 运行？

任务代码运行在你控制的环境中，可以复用现有业务服务、密钥、检索器和工具，并通过 CI/CD 集成自动化回归测试。

## Experiment Runner

Task 函数接收 DatasetItem 或本地样本，返回模型执行结果。Evaluator 使用 Output、Expected Output、Input 和 Metadata 计算 Score。SDK 负责追踪、关联、并发与结果汇总。

### 基础使用

可先使用本地样本列表运行实验。定义 Task 和 Evaluator 后，调用 Experiment Runner，使用结果格式化函数输出总结。

### 使用托管 Dataset

先从 Langfuse 获取 Dataset，再运行 `dataset.run_experiment()`（Python）或 `dataset.runExperiment()`（JS/TS），产生可在 UI 比较的实验记录。

## 高级功能

### Evaluator

可配置多种逐项 Evaluator，包括确定性匹配、业务规则和 LLM 裁判。Evaluator 应返回明确定义的 Score。

### Run-level Evaluator

Run Evaluator 处理整次实验的输出，计算平均质量、成功率或自定义汇总指标，Score 关联整个 DatasetRun。

### 多模态实验

任务可以处理图像或其他媒体，使用媒体引用和支持该类型的模型。

### Async Task 与 Evaluator

异步任务可并发执行，要控制 Provider 限流、费用和共享状态。

### 配置参数

Runner 通常支持任务函数、Evaluator、实验名、描述、元数据以及并发等参数，确切字段参阅 SDK Reference。

## Autoevals 集成

可以结合 Autoevals 等外部评分库，把结果写入 Langfuse Score。

## 可选：从 UI 触发 SDK 实验

在 Dataset 设置中配置 Webhook，点击 UI 按钮触发外部执行服务。Webhook 接收请求后启动自有应用 Runner，并写回 Langfuse；注意认证、幂等、重试和执行状态。

[相关实验比较](/official/evaluation/experiments/compare-experiments)。

## 原文中的技术示例

以下保留源文档所有代码与配置块，以避免翻译程序标识符造成错误。

### 官方示例 1

```python
from langfuse import get_client
from langfuse.openai import OpenAI

# Initialize client
langfuse = get_client()

# Define your task function
def my_task(*, item, **kwargs):
    question = item["input"]
    response = OpenAI().chat.completions.create(
        model="gpt-4.1", messages=[{"role": "user", "content": question}]
    )

    return response.choices[0].message.content


# Run experiment on local data
local_data = [
    {"input": "What is the capital of France?", "expected_output": "Paris"},
    {"input": "What is the capital of Germany?", "expected_output": "Berlin"},
]

result = langfuse.run_experiment(
    name="Geography Quiz",
    description="Testing basic functionality",
    data=local_data,
    task=my_task,
)

# Use format method to display results
print(result.format())
```


### 官方示例 2

```typescript
import { OpenAI } from "openai";
import { NodeSDK } from "@opentelemetry/sdk-node";

import {
  LangfuseClient,
  ExperimentTask,
  ExperimentItem,
} from "@langfuse/client";
import { observeOpenAI } from "@langfuse/openai";
import { LangfuseSpanProcessor } from "@langfuse/otel";

// Initialize OpenTelemetry
const otelSdk = new NodeSDK({ spanProcessors: [new LangfuseSpanProcessor()] });
otelSdk.start();

// Initialize client
const langfuse = new LangfuseClient();

// Run experiment on local data
const localData: ExperimentItem[] = [
  { input: "What is the capital of France?", expectedOutput: "Paris" },
  { input: "What is the capital of Germany?", expectedOutput: "Berlin" },
];

// Define your task function
const myTask: ExperimentTask = async (item) => {
  const question = item.input;

  const response = await observeOpenAI(new OpenAI()).chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "user",
        content: question,
      },
    ],
  });

  return response.choices[0].message.content;
};

// Run the experiment
const result = await langfuse.experiment.run({
  name: "Geography Quiz",
  description: "Testing basic functionality",
  data: localData,
  task: myTask,
});

// Print formatted result
console.log(await result.format());

// Important: shut down OTEL SDK to deliver traces
await otelSdk.shutdown();
```


### 官方示例 3

```python
from langfuse import get_client
from langfuse.openai import OpenAI

# Initialize client
langfuse = get_client()

# Define your task function
def my_task(*, item, **kwargs):
    question = item.input # `run_experiment` passes a `DatasetItem` to the task function. The input of the dataset item is available as `item.input`.
    response = OpenAI().chat.completions.create(
        model="gpt-4.1", messages=[{"role": "user", "content": question}]
    )

    return response.choices[0].message.content

# Get dataset from Langfuse
dataset = langfuse.get_dataset("my-evaluation-dataset")

# Run experiment directly on the dataset
result = dataset.run_experiment(
    name="Production Model Test",
    description="Monthly evaluation of our production model",
    task=my_task # see above for the task definition
)

# Use format method to display results
print(result.format())
```


### 官方示例 4

```typescript
// Get dataset from Langfuse
const dataset = await langfuse.dataset.get("my-evaluation-dataset");

// Run experiment directly on the dataset
const result = await dataset.runExperiment({
  name: "Production Model Test",
  description: "Monthly evaluation of our production model",
  task: myTask, // see above for the task definition
});

// Use format method to display results
console.log(await result.format());

// Important: shut down OpenTelemetry to ensure traces are sent to Langfuse
await otelSdk.shutdown();
```


### 官方示例 5

```python
from langfuse import Evaluation

# Define evaluation functions
def accuracy_evaluator(*, input, output, expected_output, metadata, **kwargs):
    if expected_output and expected_output.lower() in output.lower():
        return Evaluation(name="accuracy", value=1.0, comment="Correct answer found")

    return Evaluation(name="accuracy", value=0.0, comment="Incorrect answer")

def length_evaluator(*, input, output, **kwargs):
    return Evaluation(name="response_length", value=len(output), comment=f"Response has {len(output)} characters")

# Use multiple evaluators
result = langfuse.run_experiment(
    name="Multi-metric Evaluation",
    data=test_data,
    task=my_task,
    evaluators=[accuracy_evaluator, length_evaluator]
)

print(result.format())
```


### 官方示例 6

```typescript
// Define evaluation functions
const accuracyEvaluator = async ({ input, output, expectedOutput }) => {
  if (
    expectedOutput &&
    output.toLowerCase().includes(expectedOutput.toLowerCase())
  ) {
    return {
      name: "accuracy",
      value: 1.0,
      comment: "Correct answer found",
    };
  }
  return {
    name: "accuracy",
    value: 0.0,
    comment: "Incorrect answer",
  };
};

const lengthEvaluator = async ({ input, output }) => {
  return {
    name: "response_length",
    value: output.length,
    comment: `Response has ${output.length} characters`,
  };
};

// Use multiple evaluators
const result = await langfuse.experiment.run({
  name: "Multi-metric Evaluation",
  data: testData,
  task: myTask,
  evaluators: [accuracyEvaluator, lengthEvaluator],
});

console.log(await result.format());
```


### 官方示例 7

```python
from langfuse import Evaluation

def average_accuracy(*, item_results, **kwargs):
    """Calculate average accuracy across all items"""
    accuracies = [
        eval.value for result in item_results
        for eval in result.evaluations
        if eval.name == "accuracy"
    ]

    if not accuracies:
        return Evaluation(name="avg_accuracy", value=None)

    avg = sum(accuracies) / len(accuracies)

    return Evaluation(name="avg_accuracy", value=avg, comment=f"Average accuracy: {avg:.2%}")

result = langfuse.run_experiment(
    name="Comprehensive Analysis",
    data=test_data,
    task=my_task,
    evaluators=[accuracy_evaluator],
    run_evaluators=[average_accuracy]
)

print(result.format())
```


### 官方示例 8

```typescript
const averageAccuracy = async ({ itemResults }) => {
  // Calculate average accuracy across all items
  const accuracies = itemResults
    .flatMap((result) => result.evaluations)
    .filter((evaluation) => evaluation.name === "accuracy")
    .map((evaluation) => evaluation.value as number);

  if (accuracies.length === 0) {
    return { name: "avg_accuracy", value: null };
  }

  const avg = accuracies.reduce((sum, val) => sum + val, 0) / accuracies.length;

  return {
    name: "avg_accuracy",
    value: avg,
    comment: `Average accuracy: ${(avg * 100).toFixed(1)}%`,
  };
};

const result = await langfuse.experiment.run({
  name: "Comprehensive Analysis",
  data: testData,
  task: myTask,
  evaluators: [accuracyEvaluator],
  runEvaluators: [averageAccuracy],
});

console.log(await result.format());
```


### 官方示例 9

```python
from langfuse import get_client
from langfuse.media import LangfuseMediaReference

langfuse = get_client()

dataset = langfuse.get_dataset("visual-qa")

def my_multi_modal_task(*, item, **kwargs):
    image = item.input["image"]
    assert isinstance(image, LangfuseMediaReference)

    # Use the format expected by your model provider.
    image_data_uri = image.fetch_data_uri()

    # Call your multi-modal application here.
    return run_visual_qa(
        question=item.input["question"],
        image=image_data_uri,
    )

result = dataset.run_experiment(
    name="Visual QA",
    task=my_multi_modal_task,
)
```


### 官方示例 10

```typescript
import {
  LangfuseClient,
  LangfuseMediaReference,
} from "@langfuse/client";

const langfuse = new LangfuseClient();

const dataset = await langfuse.dataset.get("visual-qa");

const result = await dataset.runExperiment({
  name: "Visual QA",
  task: async (item) => {
    const image = item.input.image as LangfuseMediaReference;

    // Use the format expected by your model provider.
    const imageDataUri = await image.fetchDataUri();

    // Call your multi-modal application here.
    return runVisualQa({
      question: item.input.question,
      image: imageDataUri,
    });
  },
});
```


### 官方示例 11

```python
import asyncio
from langfuse.openai import AsyncOpenAI

async def async_llm_task(*, item, **kwargs):
    """Async task using OpenAI"""
    client = AsyncOpenAI()
    response = await client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": item["input"]}]
    )

    return response.choices[0].message.content

# Works seamlessly with async functions
result = langfuse.run_experiment(
    name="Async Experiment",
    data=test_data,
    task=async_llm_task,
    max_concurrency=5  # Control concurrent API calls
)

print(result.format())
```


### 官方示例 12

```typescript
import OpenAI from "openai";

const asyncLlmTask = async (item) => {
  // Async task using OpenAI
  const client = new OpenAI();
  const response = await client.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: item.input }],
  });

  return response.choices[0].message.content;
};

// Works seamlessly with async functions
const result = await langfuse.experiment.run({
  name: "Async Experiment",
  data: testData,
  task: asyncLlmTask,
  maxConcurrency: 5, // Control concurrent API calls
});

console.log(await result.format());
```


### 官方示例 13

```python
result = langfuse.run_experiment(
    name="Configurable Experiment",
    run_name="Custom Run Name", # will be dataset run name if dataset is used
    description="Experiment with custom configuration",
    data=test_data,
    task=my_task,
    evaluators=[accuracy_evaluator],
    run_evaluators=[average_accuracy],
    max_concurrency=10,  # Max concurrent executions
    metadata={  # Attached to all traces
        "model": "gpt-4",
        "temperature": 0.7,
        "version": "v1.2.0"
    }
)

print(result.format())
```


### 官方示例 14

```typescript
const result = await langfuse.experiment.run({
  name: "Configurable Experiment",
  runName: "Custom Run Name", // will be dataset run name if dataset is used
  description: "Experiment with custom configuration",
  data: testData,
  task: myTask,
  evaluators: [accuracyEvaluator],
  runEvaluators: [averageAccuracy],
  maxConcurrency: 10, // Max concurrent executions
  metadata: {
    // Attached to all traces
    model: "gpt-4",
    temperature: 0.7,
    version: "v1.2.0",
  },
});

console.log(await result.format());
```


### 官方示例 15

```python
from langfuse.experiment import create_evaluator_from_autoevals
from autoevals.llm import Factuality

evaluator = create_evaluator_from_autoevals(Factuality())

result = langfuse.run_experiment(
    name="Autoevals Integration Test",
    data=test_data,
    task=my_task,
    evaluators=[evaluator]
)

print(result.format())
```


### 官方示例 16

```typescript
import { Factuality, Levenshtein } from "autoevals";
import { createEvaluatorFromAutoevals } from "@langfuse/client";

// Convert AutoEvals evaluators to Langfuse-compatible format
const factualityEvaluator = createEvaluatorFromAutoevals(Factuality());
const levenshteinEvaluator = createEvaluatorFromAutoevals(Levenshtein());

// Use with additional parameters
const customFactualityEvaluator = createEvaluatorFromAutoevals(
  Factuality,
  { model: "gpt-4o" } // Additional AutoEvals parameters
);

const result = await langfuse.experiment.run({
  name: "AutoEvals Integration Test",
  data: testDataset,
  task: myTask,
  evaluators: [
    factualityEvaluator,
    levenshteinEvaluator,
    customFactualityEvaluator,
  ],
});

console.log(await result.format());
```

::: info 翻译状态
已完成核心章节中文说明并保留全部代码；原文部分深层细节、表格及动态 FAQ 仍待逐段翻译与复核。此页暂不计入“完整验收”文档。
:::

原文：[通过 SDK 运行实验](https://langfuse.com/docs/evaluation/experiments/experiments-via-sdk)。
