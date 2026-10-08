---
title: 使用数据集进行离线评估
description: 创建 Langfuse Dataset，使用 Python 或 TypeScript 执行实验、检查评分并比较提示词改动。
---
# 使用 Dataset 进行评估

本指南介绍如何配置 Dataset、运行实验及评估输出，适合在部署到生产之前检查改动。如果还不知道如何挑选指标，可阅读 [选择评估目标](https://langfuse.com/academy/evaluate/choosing-what-to-evaluate)；概念背景见 [Dataset](https://langfuse.com/academy/datasets)和 [Experiment](https://langfuse.com/academy/experiments)。

::: info
本指南演示[通过 SDK 运行实验](https://langfuse.com/docs/evaluation/experiments/experiments-via-sdk)：从 Langfuse 获取 Dataset，在外部运行应用/Agent，然后将结果上报平台。还可以[通过 UI 运行 Prompt Experiment](/official/evaluation/experiments/experiments-via-ui)、[UI 手工评分](/official/evaluation/evaluation-methods/scores-via-ui)或[标注队列](/official/evaluation/evaluation-methods/annotation-queues)。
:::

## Agent 安装方式

安装 [Langfuse Agent Skill](https://github.com/langfuse/skills)，让编程助手设置离线评估。

**直接告诉 Agent：**

```text
Install the Langfuse Agent Skill from github.com/langfuse/skills
and use it to create a first dataset for this application
with Langfuse.
```

**Cursor 插件**：[安装 Langfuse Cursor 插件](https://cursor.com/marketplace/langfuse)，然后提示：

```text
Set up offline evaluation for this application with Langfuse.
```

**通过 Skills CLI 安装：**

```bash
npx skills add langfuse/skills --skill "langfuse"
```

**指定 Agent：**

```bash
npx skills add langfuse/skills --skill "langfuse" --agent "<agent-id>"
```

**手动克隆并建立软链接：**

```bash
git clone https://github.com/langfuse/skills.git /path/to/langfuse-skills
```


```bash
mkdir -p /path/to/<agent-skill-root>/skills
```


```bash
ln -s /path/to/langfuse-skills/skills/langfuse /path/to/<agent-skill-root>/skills/langfuse
```

之后要求 Agent：

```text
Set up offline evaluation for this application with Langfuse.
```


## 手动配置

测试应用效果包含三个基本元素：

- **Dataset**：测试输入及期望输出；
- **Experiment Condition**：待测应用变体或模型调用；
- **Evaluator**：对输出打分的函数。

::: info
本指南使用当前的 **Python SDK v4** 与 **JS/TS SDK v5**，都基于 OpenTelemetry 追踪。使用旧版本时参阅 [Python v3 → v4](/official/observability/sdk/upgrade-path/python-v3-to-v4)或 [JS/TS v4 → v5](/official/observability/sdk/upgrade-path/js-v4-to-v5)。
:::

### 第 1 步：创建项目并获取 Key

1. [注册 Langfuse Cloud](https://langfuse.com/cloud)或[自托管](https://langfuse.com/self-hosting)。
2. 创建 Project，在 **Settings → API Keys** 中生成密钥。
3. 创建所用模型提供商的 Key；示例使用 [OpenAI](https://platform.openai.com/api-keys)。

配置环境变量：

```bash
export LANGFUSE_PUBLIC_KEY="pk-lf-..."
export LANGFUSE_SECRET_KEY="sk-lf-..."
export LANGFUSE_BASE_URL="https://cloud.langfuse.com"
export OPENAI_API_KEY="sk-..."
```

`LANGFUSE_BASE_URL` 应指向 Cloud 所在数据区域或自托管服务。

### 第 2 步：安装 SDK

**Python：**

```bash
pip install langfuse openai
```

**TypeScript：**

```bash
# pnpm
pnpm add @langfuse/client @langfuse/openai @langfuse/otel @opentelemetry/sdk-node openai tsx

# npm
npm install @langfuse/client @langfuse/openai @langfuse/otel @opentelemetry/sdk-node openai tsx
```


### 第 3 步：创建 Dataset

Dataset 是测试样例集合，每条 Item 有 Input 和可选的 Expected Output，可用于 Evaluator 对比。初始数据集可以只包含几个典型案例，然后逐渐加入发现的问题。

下面创建 **5 道旧金山景点问题**。

**Python：**首次运行 `seed_dataset.py`：

```python
from langfuse import get_client

langfuse = get_client()
dataset_name = "san-francisco-sites"

langfuse.create_dataset(
    name=dataset_name,
    description="Questions and expected answers about sites in San Francisco",
)

items = [
    {
        "id": "evaluation-quickstart-sf-golden-gate-bridge",
        "input": {
            "question": "Which red-orange suspension bridge connects San Francisco with Marin County?"
        },
        "expected_output": "Golden Gate Bridge",
    },
    {
        "id": "evaluation-quickstart-sf-alcatraz-island",
        "input": {
            "question": "Which island in San Francisco Bay is home to a former federal prison?"
        },
        "expected_output": "Alcatraz Island",
    },
    {
        "id": "evaluation-quickstart-sf-palace-of-fine-arts",
        "input": {
            "question": "Which Beaux-Arts landmark in the Marina District features a rotunda beside a lagoon?"
        },
        "expected_output": "Palace of Fine Arts",
    },
    {
        "id": "evaluation-quickstart-sf-coit-tower",
        "input": {
            "question": "Which Art Deco tower stands on Telegraph Hill?"
        },
        "expected_output": "Coit Tower",
    },
    {
        "id": "evaluation-quickstart-sf-lombard-street",
        "input": {
            "question": "Which San Francisco street is famous for a steep block with eight hairpin turns?"
        },
        "expected_output": "Lombard Street",
    },
]

for item in items:
    langfuse.create_dataset_item(dataset_name=dataset_name, **item)

print(f"Created {dataset_name} with {len(items)} items")
```

执行：

```bash
python seed_dataset.py
```

**TypeScript：**首次运行 `seed-dataset.ts`：

```typescript
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();
const datasetName = "san-francisco-sites";

const items = [
  {
    id: "evaluation-quickstart-sf-golden-gate-bridge",
    input: {
      question:
        "Which red-orange suspension bridge connects San Francisco with Marin County?",
    },
    expectedOutput: "Golden Gate Bridge",
  },
  {
    id: "evaluation-quickstart-sf-alcatraz-island",
    input: {
      question:
        "Which island in San Francisco Bay is home to a former federal prison?",
    },
    expectedOutput: "Alcatraz Island",
  },
  {
    id: "evaluation-quickstart-sf-palace-of-fine-arts",
    input: {
      question:
        "Which Beaux-Arts landmark in the Marina District features a rotunda beside a lagoon?",
    },
    expectedOutput: "Palace of Fine Arts",
  },
  {
    id: "evaluation-quickstart-sf-coit-tower",
    input: {
      question: "Which Art Deco tower stands on Telegraph Hill?",
    },
    expectedOutput: "Coit Tower",
  },
  {
    id: "evaluation-quickstart-sf-lombard-street",
    input: {
      question:
        "Which San Francisco street is famous for a steep block with eight hairpin turns?",
    },
    expectedOutput: "Lombard Street",
  },
];

async function main() {
  await langfuse.api.datasets.create({
    name: datasetName,
    description: "Questions and expected answers about sites in San Francisco",
  });

  for (const item of items) {
    await langfuse.dataset.createItem({
      datasetName,
      ...item,
    });
  }

  console.log(`Created ${datasetName} with ${items.length} items`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

执行：

```bash
npx tsx seed-dataset.ts
```

**UI：**进入 [Datasets](https://cloud.langfuse.com/project/~/datasets)，点击 **+ New dataset**。如果需要直接运行下一步的示例，名称填写 `san-francisco-sites`。

![新建数据集](https://langfuse.com/images/docs/create_dataset.png)

可以逐条添加 Item、上传 CSV，或从已有 Trace 中添加。每条 `input` 是问题、`expected output` 是景点名称。更多说明见[数据集与版本](https://langfuse.com/docs/evaluation/experiments/datasets)。

- [添加单条 Item 演示](https://static.langfuse.com/docs-videos/dataset-item-create.mp4)
- [CSV 导入演示](https://static.langfuse.com/docs-videos/dataset-item-upload.mp4)
- [从 Trace 添加演示](https://static.langfuse.com/docs-videos/datasets-add-from-trace.mp4)

使用 SDK 创建 Item 时，ID 稳定，因此重复传入**相同 ID 会更新该项**，不会生成重复项。

### 第 4 步：运行实验

SDK 会对每个 DatasetItem 执行应用。应用仍在自己的运行环境中运行，因此可以正常使用已有工具、检索逻辑与依赖库。Task 函数负责将测试项转换成应用输入，并返回待评价的输出。

如果只是比较 Prompt 和 Model，也可以直接通过 [UI 实验](/official/evaluation/experiments/experiments-via-ui)完成；甚至可以通过[Webhook](https://langfuse.com/docs/evaluation/experiments/experiments-via-sdk#configure-webhook)从 UI 触发外部 SDK 实验。

以下使用简单的 `answer_question` / `answerQuestion` 函数，实际项目应改为调用**与生产环境相同的应用路径**。Evaluator 采用严格匹配：输出与 Expected Output 完全相同时返回 `1`，否则返回 `0`。

**Python：**保存为 `sf_sites.py`：

```python
from langfuse import Evaluation, get_client
from langfuse.openai import OpenAI

langfuse = get_client()
client = OpenAI()


def answer_question(question: str):
    # Sample application. Replace with an import of your existing application.
    response = client.responses.create(
        model="gpt-5-mini",
        input=[
            {
                "role": "system",
                "content": "Answer the question about a site in San Francisco.",
            },
            {"role": "user", "content": question},
        ],
    )
    return response.output_text


def application_task(*, item, **kwargs):
    # Adapt the dataset input to your application's function signature.
    return answer_question(item.input["question"])


def exact_match(*, output, expected_output, **kwargs):
    return Evaluation(
        name="exact_match",
        value=1.0 if output == expected_output else 0.0,
    )


try:
    dataset = langfuse.get_dataset("san-francisco-sites")
    result = dataset.run_experiment(
        name="San Francisco sites",
        run_name="San Francisco sites v1",
        description="First prompt for answering questions about San Francisco sites",
        task=application_task,
        evaluators=[exact_match],
    )

    print(result.format())
finally:
    # Required for short-lived processes so all traces reach Langfuse.
    langfuse.flush()
```

执行：

```bash
python sf_sites.py
```

**TypeScript：**保存为 `sf-sites.ts`：

```typescript
import { LangfuseClient, type Evaluator } from "@langfuse/client";
import { observeOpenAI } from "@langfuse/openai";
import { LangfuseSpanProcessor } from "@langfuse/otel";
import { NodeSDK } from "@opentelemetry/sdk-node";
import OpenAI from "openai";

const otelSdk = new NodeSDK({
  spanProcessors: [new LangfuseSpanProcessor()],
});
otelSdk.start();

const langfuse = new LangfuseClient();
const client = observeOpenAI(new OpenAI());

// Sample application. Replace with an import of your existing application.
async function answerQuestion(question: string): Promise<string> {
  const response = await client.responses.create({
    model: "gpt-5-mini",
    input: [
      {
        role: "system",
        content: "Answer the question about a site in San Francisco.",
      },
      { role: "user", content: question },
    ],
  });
  return response.output_text;
}

const exactMatch: Evaluator = async ({ output, expectedOutput }) => ({
  name: "exact_match",
  value: output === expectedOutput ? 1 : 0,
});

async function main() {
  const dataset = await langfuse.dataset.get("san-francisco-sites");

  const result = await dataset.runExperiment({
    name: "San Francisco sites",
    runName: "San Francisco sites v1",
    description:
      "First prompt for answering questions about San Francisco sites",
    task: async (item) => {
      const { question } = item.input as { question: string };
      // Adapt the dataset input to your application's function signature.
      return answerQuestion(question);
    },
    evaluators: [exactMatch],
  });

  console.log(await result.format({ includeItemResults: true }));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  // Required for short-lived processes so all traces reach Langfuse.
  .finally(() => otelSdk.shutdown());
```

执行：

```bash
npx tsx sf-sites.ts
```

Experiment Runner 负责并发运行、创建各次 Task Trace、关联 Evaluator Score，以及生成可以在 Langfuse 中检查和比较的 Dataset Run。

完整工程实例参阅[评估已有应用](https://langfuse.com/resources/engineering/evaluate-existing-application)，包括确定性校验、对比不同应用版本和 CI Gate。

### 第 5 步：查看结果

Terminal 格式化输出包含 Experiment 摘要与 Dataset Run 链接。也可以打开 Langfuse [Experiments 页面](https://cloud.langfuse.com/project/~/experiments)。

每个 Item 都可以查看：

- Dataset Input 与 Expected Output；
- 模型响应；
- Exact Match 分数；
- 对应的 OpenAI Trace，包括延迟、Token 用量与成本。

### 第 6 步：改进 Prompt 并比较

Exact Match 有意采用严格规则。如果期望是 `Coit Tower`，而模型回答 `The answer is Coit Tower.`，就会得到 **0 分**，因为字符串不完全相同。

将 Run Name 改为 `San Francisco sites v2`，并将 System Message 改成：

```text
Answer the question about a site in San Francisco. Return only the site's official name, with no additional text or punctuation.
```

重新执行脚本。两次运行使用相同 Dataset，因此可以在 Experiments 页面并排比较聚合 Score 与每个样本的 Output。

## FAQ

### Dataset 已存在怎么办？

初始化脚本仅应运行一次。如果 `san-francisco-sites` 已存在，可以跳过创建 Dataset 的调用，只重新执行添加 Item 的循环。稳定的 Item ID 让重复执行安全地更新对应项。

### 为什么实验缺少 Trace？

检查环境变量。Python 短进程结尾应执行 `langfuse.flush()`；JS/TS 应执行 `otelSdk.shutdown()`，确保缓冲区数据在进程结束前发送。

### 为什么一些 Exact Match Score 为零？

打开对应 Item 对比模型输出和 Expected Output。大小写、额外单词、标点差异都使严格匹配失败。对于确定性输出契约很有用；语义正确性需使用 [LLM-as-a-Judge](https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge)。

## 下一步

- 使用[数据集和数据集版本](https://langfuse.com/docs/evaluation/experiments/datasets)实现可复现测试。
- 直接在 [UI 实验](/official/evaluation/experiments/experiments-via-ui)中对比 Prompt 和模型。
- 深入了解[Experiment Runner SDK](https://langfuse.com/docs/evaluation/experiments/experiments-via-sdk)，包括异步 Evaluator、并发与 Run 级指标。
- 将[实验加入 CI/CD](https://langfuse.com/docs/evaluation/experiments/experiments-ci-cd)，部署前捕获回退。
- 学习[可靠评估器编写](https://langfuse.com/academy/evaluate/writing-evaluators)。
- 为应用选择[代码评估器](https://langfuse.com/docs/evaluation/evaluation-methods/code-evaluators)、LLM-as-a-Judge 或人工审阅。

---

原文：[Evaluate with Datasets](https://langfuse.com/docs/evaluation/get-started/offline) · 非官方中文翻译，全部示例保留官方代码。
