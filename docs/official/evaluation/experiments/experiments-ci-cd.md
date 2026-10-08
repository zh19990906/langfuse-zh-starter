---
title: 在 CI/CD 中运行实验
description: 在 CI/CD 中运行实验——Langfuse 官方文档中文整理。
---

# CI/CD 中的 Langfuse 实验

把离线评估放入持续集成流水线，可以在合并或部署前检测 Prompt、模型、Agent 与工具调用链的质量回退。它是传统单元测试的补充，而非替代。

## 选择发布策略

可以检查平均 Score、失败样本数、成本、延迟，或与已批准的 Baseline 比较。选择适合业务风险的阈值，并明确随机性、采样量与结果波动对判定的影响。

## GitHub Actions Workflow

**GitHub Actions Workflow：官方代码示例**

```yaml
name: Langfuse experiment gate

on:
  # Run the gate for every pull request. Change this to `push`, `release`, or another
  # trigger if you want to run experiments at a different point in your workflow.
  pull_request:

permissions:
  # Required to check out the repository.
  contents: read
  # Required to post or update the experiment result comment on pull requests.
  pull-requests: write
  # Optional: lets the result link to this specific job's logs.
  # Without this permission, the action falls back to the workflow-run URL.
  actions: read

jobs:
  experiment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      # Add this only if your experiments use the Python SDK
      - uses: actions/setup-python@v6
        with:
          python-version: "3.14"

      # Add this only if your experiments use the JS/TS SDK
      - uses: actions/setup-node@v6
        with:
          node-version: "24"

      - uses: langfuse/experiment-action@<release tag>
        with:
          # the credentials for Langfuse
          langfuse_public_key: ${{ secrets.LANGFUSE_PUBLIC_KEY }}
          langfuse_secret_key: ${{ secrets.LANGFUSE_SECRET_KEY }}
          langfuse_base_url: https://cloud.langfuse.com

          # the location of your experiment scripts
          experiment_path: experiments/support-agent-gate

          # the dataset to run the experiment against
          dataset_name: support-agent-regression-set

          # GitHub token so that the action can comment on PRs
          github_token: ${{ github.token }}
```


可在 GitHub Actions 中调用 Langfuse 实验工具，使用 Repository Secrets 保存 Langfuse 和模型 Provider Key。不要把敏感 Key 写入 YAML。


### 定义实验

**实验定义：官方代码示例**

```python
from langfuse import RunnerContext
from langfuse.api import DatasetItem


# Define a task that calls your agent with each dataset item.
def my_task(item: DatasetItem, **kwargs):
    ...


def experiment(context: RunnerContext):
    return context.run_experiment(
        name="PR gate",
        task=my_task,
    )
```

```ts
import type { ExperimentTaskParams, RunnerContext } from "@langfuse/client";

// Define a task that calls your agent with each dataset item.
async function myTask(item: ExperimentTaskParams) {
  // ...
}

export async function experiment(context: RunnerContext) {
  return await context.runExperiment({
    name: "PR gate",
    task: myTask,
  });
}
```


Task 调用真实 Agent，并对每个 DatasetItem 运行。Evaluator 返回 Score；实验执行应尽量使用稳定 Dataset 版本。


### Action 的 Input 与 Output

可通过 Action Input 指定实验配置、数据集、基线和阈值；从 Output 读取实验 ID、质量指标及对比结果，形成 CI 报告。

### 失败策略

**回退阈值：官方代码示例**

```python
from langfuse import Evaluation, RegressionError, RunnerContext


THRESHOLD = 0.95


def experiment(context: RunnerContext):
    result = context.run_experiment(
        name="PR gate: support agent",
        task=answer_support_question,
        evaluators=[exact_match],
        run_evaluators=[avg_accuracy],
    )

    accuracy = next(
        (
            evaluation.value
            for evaluation in result.run_evaluations
            if evaluation.name == "avg_accuracy"
        ),
        None,
    )

    if not isinstance(accuracy, (int, float)) or accuracy < THRESHOLD:
        raise RegressionError(
            # Attach the result so the action can include scores in the PR comment and `result_json` output.
            result=result,
            metric="avg_accuracy",
            value=float(accuracy) if isinstance(accuracy, (int, float)) else 0.0,
            threshold=THRESHOLD,
        )

    return result


def answer_support_question(item, **kwargs):
    # Replace this stub with your application logic.
    return item.input["question"]


def exact_match(*, output, expected_output, **kwargs):
    passed = output.strip() == (expected_output or "").strip()
    return Evaluation(
        name="exact_match",
        value=1.0 if passed else 0.0,
        comment="match" if passed else "mismatch",
    )


def avg_accuracy(*, item_results, **kwargs):
    scores = [
        evaluation.value
        for item in item_results
        for evaluation in item.evaluations
        if evaluation.name == "exact_match" and isinstance(evaluation.value, (int, float))
    ]
    return Evaluation(name="avg_accuracy", value=sum(scores) / len(scores) if scores else 0.0)
```

```ts
import {
  RegressionError,
  type Evaluation,
  type ExperimentTaskParams,
  type RunnerContext,
} from "@langfuse/client";

const THRESHOLD = 0.95;

export async function experiment(context: RunnerContext) {
  const result = await context.runExperiment({
    name: "PR gate: support agent",
    task: answerSupportQuestion,
    evaluators: [exactMatch],
    runEvaluators: [avgAccuracy],
  });

  const accuracy = result.runEvaluations.find(
    (evaluation) => evaluation.name === "avg_accuracy",
  )?.value;

  if (typeof accuracy !== "number" || accuracy < THRESHOLD) {
    throw new RegressionError({
      // Attach the result so the action can include scores in the PR comment and `result_json` output.
      result,
      metric: "avg_accuracy",
      value: typeof accuracy === "number" ? accuracy : 0,
      threshold: THRESHOLD,
    });
  }

  return result;
}

async function answerSupportQuestion(item: ExperimentTaskParams) {
  const { question } = item.input as { question: string };

  // Replace this with your application logic, for example calling your agent.
  return await supportAgent(question);
}

async function supportAgent(question: string) {
  return question;
}

async function exactMatch({
  output,
  expectedOutput,
}: {
  output: string;
  expectedOutput?: string;
}): Promise<Evaluation> {
  const passed = output.trim() === expectedOutput?.trim();
  return { name: "exact_match", value: passed ? 1 : 0 };
}

async function avgAccuracy({
  itemResults,
}: {
  itemResults: Array<{ evaluations: Evaluation[] }>;
}): Promise<Evaluation> {
  const scores = itemResults
    .flatMap((item) => item.evaluations)
    .filter((evaluation) => evaluation.name === "exact_match")
    .map((evaluation) => Number(evaluation.value))
    .filter((score) => Number.isFinite(score));

  return {
    name: "avg_accuracy",
    value: scores.length
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0,
  };
}
```


质量回退超过允许范围时使用非零退出码使 Job 失败；阈值应考虑评价器的统计噪声。


### Action 输出

**Action 输出：官方代码示例**

```yaml
- uses: langfuse/experiment-action@<release tag>
  id: experiment
  with:
    # ...

- name: Store experiment result
  if: always()
  env:
    RESULT_JSON: ${{ steps.experiment.outputs.result_json }}
  run: printf '%s' "$RESULT_JSON" > experiment-result.json
```


可以保存实验链接、逐项失败明细和汇总指标，便于 PR 审核者对比。


### 额外 Secrets

**额外 Secret：官方代码示例**

```yaml
- uses: langfuse/experiment-action@<release tag>
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  with:
    langfuse_public_key: ${{ secrets.LANGFUSE_PUBLIC_KEY }}
    langfuse_secret_key: ${{ secrets.LANGFUSE_SECRET_KEY }}
    experiment_path: experiments/support-agent-gate
    dataset_name: support-agent-regression-set
```


给 CI 分配最小权限，限制 API Key 的读写范围，并使用 GitHub Secret 或等效密钥管理器。


## 与批准的 Baseline 比较

**基线比较：官方代码示例**

```json
{
  "run": "reviewed-release-run-id",
  "dataset_version": "2026-07-01T00:00:00Z",
  "evaluator_version": "refund-window-v1",
  "cases": { "standard": true, "sale": false }
}
```

```python
import json
from datetime import datetime
from pathlib import Path

from langfuse import RegressionError

EVALUATOR_VERSION = "refund-window-v1"


def parse_version(value: str | datetime) -> datetime:
    parsed = (
        datetime.fromisoformat(value.replace("Z", "+00:00"))
        if isinstance(value, str)
        else value
    )
    if parsed.utcoffset() is None:
        raise ValueError("Dataset version must include a timezone")
    return parsed


def check_approved_baseline(result, *, dataset_version: str | datetime):
    baseline = json.loads(Path("experiments/approved-baseline.json").read_text())
    if (
        parse_version(baseline["dataset_version"])
        != parse_version(dataset_version)
        or baseline["evaluator_version"] != EVALUATOR_VERSION
    ):
        raise ValueError(
            "Dataset or evaluator version differs from the approved baseline"
        )
    approved = baseline["cases"]
    if not approved or any(type(value) is not bool for value in approved.values()):
        raise ValueError("Baseline must contain reviewed boolean verdicts")

    current = {}
    for row in result.item_results:
        item = row.item
        metadata = item.get("metadata") if isinstance(item, dict) else item.metadata
        case_id = (metadata or {}).get("case_id")
        scores = [e.value for e in row.evaluations if e.name == "refund_window"]
        if (
            not isinstance(case_id, str)
            or case_id in current
            or len(scores) != 1
            or scores[0] not in (0, 1)
        ):
            raise ValueError("Incomplete, duplicate, or invalid case result")
        current[case_id] = scores[0] == 1
    if current.keys() != approved.keys():
        raise ValueError("Candidate and baseline contain different cases")

    regressions = [
        case_id for case_id in approved if approved[case_id] and not current[case_id]
    ]
    if regressions:
        print("Newly failing cases:", ", ".join(regressions))
        raise RegressionError(
            result=result,
            metric="newly_failing_cases",
            value=float(len(regressions)),
            threshold=0.0,
        )
```

```typescript
import { readFileSync } from "node:fs";
import { RegressionError, type ExperimentResult } from "@langfuse/client";

const EVALUATOR_VERSION = "refund-window-v1";

export function checkApprovedBaseline(
  result: ExperimentResult,
  datasetVersion: string,
) {
  const baseline = JSON.parse(
    readFileSync("experiments/approved-baseline.json", "utf8"),
  );
  if (
    !Number.isFinite(Date.parse(datasetVersion)) ||
    Date.parse(baseline.dataset_version) !== Date.parse(datasetVersion) ||
    baseline.evaluator_version !== EVALUATOR_VERSION
  ) {
    throw new Error(
      "Dataset or evaluator version differs from the approved baseline",
    );
  }
  const approved = baseline.cases as Record<string, boolean>;
  if (
    !approved ||
    Object.keys(approved).length === 0 ||
    Object.values(approved).some((value) => typeof value !== "boolean")
  ) {
    throw new Error("Baseline must contain reviewed boolean verdicts");
  }

  const current = new Map<string, boolean>();
  for (const row of result.itemResults) {
    const metadata = row.item.metadata as { case_id?: unknown } | undefined;
    const caseId = metadata?.case_id;
    const scores = row.evaluations.filter((e) => e.name === "refund_window");
    if (
      typeof caseId !== "string" ||
      current.has(caseId) ||
      scores.length !== 1 ||
      (scores[0].value !== 0 && scores[0].value !== 1)
    ) {
      throw new Error("Incomplete, duplicate, or invalid case result");
    }
    current.set(caseId, scores[0].value === 1);
  }
  if (
    current.size !== Object.keys(approved).length ||
    Object.keys(approved).some((id) => !current.has(id))
  ) {
    throw new Error("Candidate and baseline contain different cases");
  }

  const regressions = Object.keys(approved).filter(
    (id) => approved[id] && !current.get(id),
  );
  if (regressions.length) {
    console.error("Newly failing cases:", regressions.join(", "));
    throw new RegressionError({
      result,
      metric: "newly_failing_cases",
      value: regressions.length,
      threshold: 0,
    });
  }
}
```


选定已发布或人工确认的 Baseline Run，不应每次运行时无条件重置 Baseline。按同一 Dataset 版本比较，降低结果偏差。


## 其他 CI/CD 系统

**其他 CI/CD 系统：官方代码示例**

```json
[
  {
    "id": "standard-refund",
    "input": { "question": "What is the standard refund window?" },
    "expected_output": { "refund_days": 30 }
  }
]
```

```python
import hashlib
import json
import os
from pathlib import Path

from langfuse import Evaluation, get_client
from my_app import run_application  # Replace with your application's import.
from my_checks import grade  # Reuse your existing boolean grader.


def test_application_checks():
    case_file = Path("cases.json").read_bytes()
    cases = json.loads(case_file)
    ids = [case["id"] for case in cases]
    assert ids and all(ids) and len(set(ids)) == len(ids), "Invalid case IDs"

    def task(*, item, **kwargs):
        return run_application(item["input"])

    def evaluator(*, output, expected_output, **kwargs):
        passed = grade(output, expected_output)
        if type(passed) is not bool:
            raise ValueError("grade must return a boolean")
        return Evaluation(name="existing_checks", value=int(passed))

    langfuse = get_client()
    try:
        result = langfuse.run_experiment(
            name="Application checks",
            data=[{
                "input": case["input"],
                "expected_output": case["expected_output"],
                "metadata": {"case_id": case["id"]},
            } for case in cases],
            task=task,
            evaluators=[evaluator],
            metadata={
                "application_version": os.environ["APP_VERSION"],
                "cases_sha256": hashlib.sha256(case_file).hexdigest(),
                "evaluator_version": "existing-checks-v1",
            },
        )
        print(result.format())  # Includes the experiment link.
        returned_ids = [item.item["metadata"]["case_id"] for item in result.item_results]
        assert sorted(returned_ids) == sorted(ids), "Incomplete results"
        for item in result.item_results:
            assert item.output is not None, "Missing application output"
            scores = [e for e in item.evaluations if e.name == "existing_checks"]
            assert len(scores) == 1 and scores[0].value == 1, (
                f"Failed or missing check: {item.item['metadata']['case_id']}"
            )
    finally:
        langfuse.flush()
```

```typescript
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { it, expect } from "vitest";
import { LangfuseClient } from "@langfuse/client";
import { LangfuseSpanProcessor } from "@langfuse/otel";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { runApplication } from "../src/app"; // Replace with your application's import.
import { grade } from "../src/checks"; // Reuse your existing boolean grader.

it("passes every required application check", async () => {
  const caseFile = readFileSync("cases.json");
  const cases: { id: string; input: unknown; expected_output: unknown }[] =
    JSON.parse(caseFile.toString("utf8"));
  const ids = cases.map((item) => item.id);
  expect(ids.length).toBeGreaterThan(0);
  expect(ids.every(Boolean)).toBe(true);
  expect(new Set(ids).size).toBe(ids.length);
  const applicationVersion = process.env.APP_VERSION;
  if (!applicationVersion) throw new Error("Set APP_VERSION");

  const otel = new NodeSDK({ spanProcessors: [new LangfuseSpanProcessor()] });
  otel.start();
  try {
    const langfuse = new LangfuseClient();
    const result = await langfuse.experiment.run({
      name: "Application checks",
      data: cases.map((item) => ({
        input: item.input,
        expectedOutput: item.expected_output,
        metadata: { case_id: item.id },
      })),
      task: async (item) => runApplication(item.input),
      evaluators: [async ({ output, expectedOutput }) => {
        const passed = await grade(output, expectedOutput);
        if (typeof passed !== "boolean") throw new Error("grade must return a boolean");
        return { name: "existing_checks", value: Number(passed) };
      }],
      metadata: {
        application_version: applicationVersion,
        cases_sha256: createHash("sha256").update(caseFile).digest("hex"),
        evaluator_version: "existing-checks-v1",
      },
    });
    console.log(await result.format()); // Includes the experiment link.
    expect(result.itemResults.map((item) =>
      (item.item.metadata as { case_id: string }).case_id,
    ).sort())
      .toEqual([...ids].sort());
    for (const item of result.itemResults) {
      expect(item.output).not.toBeNull();
      expect(item.output).not.toBeUndefined();
      const scores = item.evaluations.filter((score) => score.name === "existing_checks");
      expect(scores).toHaveLength(1);
      expect(scores[0].value).toBe(1);
    }
  } finally {
    await otel.shutdown();
  }
}, 60_000); // Adjust for the runtime of your application and case set.
```


同样的实验命令也可以在 GitLab CI、Jenkins、Buildkite 等系统运行；核心是执行 SDK Task、采集 Score、比较阈值并返回成功或失败状态。


::: info 翻译状态
已将原文代码块按章节位置重新整理，仍待执行版本兼容与构建验证。此页暂不计入“完整验收”文档。
:::

原文：[在 CI/CD 中运行实验](https://langfuse.com/docs/evaluation/experiments/experiments-ci-cd)。
