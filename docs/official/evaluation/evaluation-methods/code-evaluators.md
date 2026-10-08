---
title: 代码评估器
description: 代码评估器——Langfuse 官方文档中文整理。
---

# Code Evaluator

Code Evaluator 使用 Python 或 TypeScript 编写确定性检查。适合验证 JSON 格式、必须包含的字段、关键词、业务逻辑和可重复计算的指标。

## 如何使用？

可以将它关联到生产 Rule、历史 Observation Batch 或 Dataset Experiment。和 LLM 裁判相比，代码评估器通常可复现、费用较低，但只适合能明确写出逻辑的评价目标。

## 配置步骤

1. 打开 Evaluators 页面，创建 Code Evaluator。
2. 选择目标对象与语言。
3. 编写符合函数契约的 `evaluate` 函数。
4. 用测试样本运行，检查 Score 与错误信息。
5. 保存并关联 Rule 或 Experiment。

## 函数契约

Evaluator 的输入通常包括 `input`、`output`、`expectedOutput` 及 `metadata`。输出须符合 Langfuse Score Schema，可包含 Name、Value、Type、Reason 或多个 Score。

## 上下文字段

不同评估目标提供的上下文字段可能不同，不能假设 Trace 级别属性自动存在于所有 Observation。应避免对缺失值不加校验直接索引。

## Score 字段

建议将 Score 名称、数据类型与范围保持稳定，便于统计。需要分类或数值范围限制时可使用 ScoreConfig。

## 示例：严格匹配

Exact Match 将 Output 与 Expected Output 比较，完全相同时为 1，否则为 0。它适用于明确的字符串契约，不能代替语义等价评估。

## 调试代码执行

可查看每次 Evaluator Execution 的错误日志与产生的 Score；注意类型不匹配、运行时依赖缺失和无法访问外部服务等问题。

## Runtime 限制

代码在受控环境执行，通常有时间、内存、依赖和网络限制。不要假设拥有任意文件系统、密钥或无限执行时间；详细限制以最新官方说明为准。

## 精校补充：评估对象与函数契约

代码评估器可运行在**生产 Observation**或**离线 Experiment**上。使用 **Is Root Observation** 筛选逻辑根时，根节点可能仍有物理父节点；需要某个具体调用类型时，应额外按 Name 或 Type 筛选。

创建流程：进入 **Evaluators → New evaluator → Code evaluator**，选择 Python 或 TypeScript；定义 `evaluate` 函数，使用样本测试后保存。**代码评估器不需要额外的变量映射步骤**，通过 `ctx` 直接读取数据。保存后可添加 Rule，也可用于 Batch Evaluation 或 Prompt Experiment。

### EvaluationContext 字段

| 字段 | 含义 |
| --- | --- |
| `ctx.observation.input` / `output` / `metadata` | 被评价 Observation 保存的字段 |
| Python `ctx.observation.tool_calls` / TS `ctx.observation.toolCalls` | 有序工具调用；包含 `id`、`name`、`arguments`、`type`、`index`；合法 JSON 参数会解析 |
| `ctx.experiment` | 只在实验场景存在 |
| Python `ctx.experiment.item_expected_output` / TS `itemExpectedOutput` | 实验样本期望输出 |
| Python `ctx.experiment.item_metadata` / TS `itemMetadata` | 实验样本元数据 |

### EvaluationResult 中的 Score 字段

`evaluate(ctx)` 必须返回至少一条 Score。`name`、`value`、`data_type`（Python）或 `dataType`（TS）为必填。类型可以是 `NUMERIC`、`CATEGORICAL`、`BOOLEAN`、`TEXT`。可选字段包括 `comment`、`config_id` / `configId`、`metadata`；指定 ScoreConfig 后必须遵守该配置的限制。

### 运行时硬性限制

| 项目 | 官方限制 |
| --- | --- |
| 语言 | Python 或 TypeScript |
| 自托管 Python 执行器 | 必须使用 `aws-lambda` Dispatcher；`insecure-local` 仅支持 TypeScript/JavaScript |
| TypeScript 语法 | 必须使用可擦除语法；类型注解与 Interface 可用，避免 Enum、Namespace、Decorator 和参数属性 |
| 依赖 | 仅能使用相应语言标准库，**不支持第三方包** |
| 网络 | **禁止访问外部网络** |
| 执行超时 | **2 秒** |
| 返回结果 | 至少 1 个 Score |
| 源码大小 | 小于 **256 KB** |
| 输入 Payload | 源码和选择的变量合计小于 **5.5 MB** |
| 结果大小 | 小于 **256 KB** |

如果遇到超时，先从小样本复现，移除网络访问、减少循环与解析工作量，以及缩小 Input/Output/Metadata 的体积。每次执行会生成调试 Trace，可在 Tracing 中按 Environment `langfuse-code-eval` 筛选。

![代码评估器执行记录](https://langfuse.com/images/docs/code-evaluators/debugging.png)

## 原文中的技术示例

以下保留源文档所有代码与配置块，以避免翻译程序标识符造成错误。

### 官方示例 1

```python
from dataclasses import dataclass, field
from typing import Any


@dataclass
class ToolCall:
    id: str = ""
    name: str = ""
    arguments: Any = None
    type: str = ""
    index: int = 0


@dataclass
class ObservationContext:
    input: Any = None
    output: Any = None
    metadata: Any = None
    tool_calls: list[ToolCall] = field(default_factory=list)


@dataclass
class ExperimentContext:
    item_expected_output: Any = None
    item_metadata: Any = None


@dataclass
class EvaluationContext:
    observation: ObservationContext
    experiment: ExperimentContext | None = None


@dataclass
class Score:
    name: str
    value: int | float | str | bool
    data_type: str
    comment: str | None = None
    config_id: str | None = None
    metadata: dict[str, Any] | None = None


@dataclass
class EvaluationResult:
    scores: list[Score]


def evaluate(ctx: EvaluationContext) -> EvaluationResult:
    output_present = ctx.observation.output is not None

    return EvaluationResult(
        scores=[
            Score(
                name="Output present",
                value=output_present,
                data_type="BOOLEAN",
                comment=(
                    "Observation output is present."
                    if output_present
                    else "Observation output is missing."
                ),
                metadata={"rule": "output_present"},
            )
        ]
    )
```


### 官方示例 2

```ts
type ToolCall = {
  id: string;
  name: string;
  arguments: unknown;
  type: string;
  index: number;
};

type EvaluationContext = {
  observation: {
    input: any;
    output: any;
    metadata: any;
    toolCalls: ToolCall[];
  };
  experiment:
    | {
        itemExpectedOutput: any;
        itemMetadata: any;
      }
    | undefined;
};

type ScoreBase = {
  name: string;
  comment?: string;
  configId?: string | null;
  metadata?: Record<string, unknown>;
};

type NumericScore = ScoreBase & {
  dataType: "NUMERIC";
  value: number;
};

type BooleanScore = ScoreBase & {
  dataType: "BOOLEAN";
  value: boolean;
};

type CategoricalScore = ScoreBase & {
  dataType: "CATEGORICAL";
  value: string;
};

type TextScore = ScoreBase & {
  dataType: "TEXT";
  value: string;
};

type Score = NumericScore | BooleanScore | CategoricalScore | TextScore;

type EvaluationResult = {
  scores: Score[];
};

function evaluate({
  observation: { input, output, metadata, toolCalls },
  experiment,
}: EvaluationContext): EvaluationResult {
  const itemExpectedOutput = experiment?.itemExpectedOutput;
  const itemMetadata = experiment?.itemMetadata;
  const outputPresent = output != null;

  return {
    scores: [
      {
        name: "Output present",
        value: outputPresent,
        dataType: "BOOLEAN",
        comment: outputPresent
          ? "Observation output is present."
          : "Observation output is missing.",
        metadata: {
          rule: "output_present",
          hasInput: input != null,
          hasObservationMetadata: metadata != null,
          toolCallCount: toolCalls.length,
          hasExpectedOutput: itemExpectedOutput != null,
          hasExperimentMetadata: itemMetadata != null,
        },
      },
    ],
  };
}
```


### 官方示例 3

```python
def evaluate(ctx: EvaluationContext) -> EvaluationResult:
    """Evaluates one observation and returns one or more Langfuse scores."""
    expected_output = (
        ctx.experiment.item_expected_output if ctx.experiment is not None else None
    )
    matches_expected_output = (
        expected_output is not None and ctx.observation.output == expected_output
    )

    return EvaluationResult(
        scores=[
            Score(
                name="Exact match",
                value=matches_expected_output,
                data_type="BOOLEAN",
                comment=(
                    "Output exactly matches the expected output."
                    if matches_expected_output
                    else "Output does not match the expected output."
                ),
            )
        ]
    )
```


### 官方示例 4

```ts
/**
 * Evaluates one observation and returns one or more Langfuse scores.
 */
function evaluate({
  observation: { input, output, metadata },
  experiment,
}: EvaluationContext): EvaluationResult {
  const itemExpectedOutput = experiment?.itemExpectedOutput;
  const itemMetadata = experiment?.itemMetadata;
  const matchesExpectedOutput =
    itemExpectedOutput != null && output === itemExpectedOutput;

  return {
    scores: [
      {
        name: "Exact match",
        value: matchesExpectedOutput,
        dataType: "BOOLEAN",
        comment: matchesExpectedOutput
          ? "Output exactly matches the expected output."
          : "Output does not match the expected output.",
        metadata: {
          hasInput: input != null,
          hasObservationMetadata: metadata != null,
          hasExperimentMetadata: itemMetadata != null,
        },
      },
    ],
  };
}
```

::: info 翻译状态
已完成核心章节中文说明并保留全部代码；原文部分深层细节、表格及动态 FAQ 仍待逐段翻译与复核。此页暂不计入“完整验收”文档。
:::

原文：[代码评估器](https://langfuse.com/docs/evaluation/evaluation-methods/code-evaluators)。
