---
title: SDK 高级功能
description: OpenTelemetry Span 筛选、Masking、采样、多项目、TTFT、日志与调试。
---

# SDK 高级功能

本页介绍 SDK 的进阶配置，适合已经完成基础追踪接入、需要提高数据质量、性能或满足隐私合规要求的项目。

## 按 Instrumentation Scope 筛选

Langfuse 的智能默认过滤器倾向导出 Langfuse 创建的 Span、带 `gen_ai.*` 属性的 Span 和已知 LLM 框架 Span；HTTP、数据库和内部框架 Span 可能被排除。需要保留自定义 Scope 时，在默认过滤逻辑基础上添加自己的判断。

::: warning
强行导出全部 Span 可能增加可观测性噪声与摄入成本。过滤中间父节点还可能使 Trace 树断开；应在测试环境核对父子关系。
:::

## 敏感数据 Masking

可以在发往 Langfuse 之前去除个人信息、秘密令牌或业务敏感内容。Python 的 `mask_otel_spans` 作用于导出批次；相关限制和处理方法见[Masking 专篇](/official/observability/features/masking)。

## Logging 与 Debug

SDK 支持调试日志，用于排查认证、Span 筛选、上下文传播、队列与导出错误。生产环境要避免输出密钥或敏感 Trace 数据。

## Sampling

可以控制 Trace 采样率，减少高吞吐量应用的摄入成本。需要注意对同一 Trace 使用一致采样决策，否则可能只有部分子 Span 进入系统。详见[采样说明](/official/observability/features/sampling)。

## 独立 TracerProvider

如果应用同时使用第三方 OTEL SDK、自动埋点或其他 Span Exporter，可以为 Langfuse 配置独立 TracerProvider，避免修改共享 Provider 或重复上报。

## 多项目设置（实验性）

一个应用可以在不同业务、租户或环境使用不同项目级 Key。调用追踪装饰器、LangChain Handler 等集成时，确保把不同项目上下文正确路由到各自的密钥，不要让不同项目之间出现数据串写。

## TTFT（首 Token 时间）

生成式模型流式返回时，记录首 Token 时间可更准确分析用户体验。调用耗时与 TTFT 不相同；流结束时应完善最终 Token 用量与输出。

## 自签名 SSL 证书

自托管部署若使用自签名 HTTPS 证书，需要将根证书安装到受信任证书存储，或按 SDK 配置指定受信任的 CA。避免在生产环境全局关闭证书校验。

## Sentry、线程池与多进程

Sentry 与 OTEL 可共存，但要避免初始化顺序和重复 Span Exporter 的问题。多进程、Worker、线程池要正确传播 Context；短生命周期 Worker 退出前应 Flush。

## 校验补充：采样配置与行为

Python SDK 初始化时使用 `sample_rate`，范围为 **0.0–1.0**；例如 `Langfuse(sample_rate=0.2)` 表示约 20% 的 Trace。也可设置 `LANGFUSE_SAMPLE_RATE="0.2"`。**未采样的 Trace，其 Observation 及关联 Score 也不会发送到 Langfuse**。

JS/TS SDK 尊重 OpenTelemetry 的采样决定。可在 `NodeSDK` 中使用 `TraceIdRatioBasedSampler(0.2)`，或者通过 `LANGFUSE_SAMPLE_RATE` 设置采样率。两种语言的代码见后面的官方示例，不能把 JS/TS 采样器误用为 Python 的初始化参数。

## 校验补充：隔离 TracerProvider 与多项目风险

独立 TracerProvider 可以使 Langfuse Span 不发送到 Datadog、Jaeger 等其他后端，也阻止第三方库 Span 被 Langfuse 捕获；但**不同 Provider 仍共享 OpenTelemetry 当前 Context**，因而可能出现父节点属于其他 Provider、子节点被导出而父节点缺失的情况。

Python 多项目路由目前为**实验性功能**。Langfuse 自身创建的 Span 携带项目 Public Key，Processor 据此路由；第三方 OpenTelemetry 库生成的 Span 往往没有该 Key。如果它们通过导出过滤，**可能同时发送到多个项目**。在最外层被 `@observe()` 包装的函数调用中传递 `langfuse_public_key`，并验证第三方 Instrumentation 的隔离行为；仅有多个客户端实例不等于完成了租户隔离。

## 官方技术示例（保留原始可执行语法）

以下是源文档中的全部代码块与配置示例，代码保持原文，不自动翻译变量名，以免破坏运行行为。

### 示例 1

```python
from langfuse import Langfuse

# Smart default filter (Langfuse + GenAI/LLM spans)
langfuse = Langfuse()
```

### 示例 2

```python
from langfuse import Langfuse

langfuse = Langfuse(should_export_span=lambda span: True)
```

### 示例 3

```python
from langfuse import Langfuse
from langfuse.span_filter import is_default_export_span

langfuse = Langfuse(
    should_export_span=lambda span: (
        is_default_export_span(span)
        or (
            span.instrumentation_scope is not None
            and span.instrumentation_scope.name.startswith("my_framework")
        )
    )
)
```

### 示例 4

```python
from langfuse import Langfuse
from langfuse.span_filter import is_langfuse_span

langfuse = Langfuse(should_export_span=is_langfuse_span)
```

### 示例 5

```python
from langfuse import Langfuse

langfuse = Langfuse(
    should_export_span=lambda span: True,
    blocked_instrumentation_scopes=["sqlalchemy", "psycopg"],
)
```

### 示例 6

```ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";

const sdk = new NodeSDK({
  // Smart default filter (Langfuse + GenAI/LLM spans)
  spanProcessors: [new LangfuseSpanProcessor()],
});

sdk.start();
```

### 示例 7

```ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor, ShouldExportSpan } from "@langfuse/otel";

const shouldExportSpan: ShouldExportSpan = ({ otelSpan }) =>
  otelSpan.instrumentationScope.name !== "express";

const sdk = new NodeSDK({
  spanProcessors: [new LangfuseSpanProcessor({ shouldExportSpan })],
});

sdk.start();
```

### 示例 8

```ts
import { isDefaultExportSpan, type ShouldExportSpan } from "@langfuse/otel";

const shouldExportSpan: ShouldExportSpan = ({ otelSpan }) =>
  isDefaultExportSpan(otelSpan) ||
  otelSpan.instrumentationScope.name.startsWith("my-framework");
```

### 示例 9

```ts
new LangfuseSpanProcessor({ shouldExportSpan: () => true });
```

### 示例 10

```python
import re
from typing import Optional

from langfuse import Langfuse
from langfuse.types import (
    MaskOtelSpansParams,
    MaskOtelSpansResult,
    OtelSpanPatch,
)

email_pattern = re.compile(r"\b[\w.-]+?@[\w.-]+?\.\w+?\b")


def mask_otel_spans(
    *, params: MaskOtelSpansParams
) -> Optional[MaskOtelSpansResult]:
    patches = {}

    for identifier, span in params.spans.items():
        replacements = {}

        for key, value in span.attributes.items():
            if isinstance(value, str):
                masked_value = email_pattern.sub("[EMAIL_REDACTED]", value)

                if masked_value != value:
                    replacements[key] = masked_value

        if replacements:
            patches[identifier] = OtelSpanPatch(set_attributes=replacements)

    return MaskOtelSpansResult(span_patches=patches)


langfuse = Langfuse(mask_otel_spans=mask_otel_spans)
```

### 示例 11

```ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";

const spanProcessor = new LangfuseSpanProcessor({
  mask: ({ data }) =>
    data.replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, "***MASKED_CREDIT_CARD***"),
});

const sdk = new NodeSDK({ spanProcessors: [spanProcessor] });

sdk.start();
```

### 示例 12

```bash
export LANGFUSE_DEBUG="True"
```

### 示例 13

```python
import logging

langfuse_logger = logging.getLogger("langfuse")
langfuse_logger.setLevel(logging.DEBUG)
```

### 示例 14

```bash
export LANGFUSE_LOG_LEVEL="DEBUG"
```

### 示例 15

```typescript
import { configureGlobalLogger, LogLevel } from "@langfuse/core";

// Set the log level to DEBUG to see all log messages
configureGlobalLogger({ level: LogLevel.DEBUG });
```

### 示例 16

```python
from langfuse import Langfuse

# Sample approximately 20% of traces
langfuse_sampled = Langfuse(sample_rate=0.2)
```

### 示例 17

```bash
export LANGFUSE_SAMPLE_RATE="0.2"
```

### 示例 18

```ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";
import { TraceIdRatioBasedSampler } from "@opentelemetry/sdk-trace-base";

const sdk = new NodeSDK({
  sampler: new TraceIdRatioBasedSampler(0.2),
  spanProcessors: [new LangfuseSpanProcessor()],
});

sdk.start();
```

### 示例 19

```bash
export LANGFUSE_SAMPLE_RATE="0.2"
```

### 示例 20

```python
from opentelemetry.sdk.trace import TracerProvider
from langfuse import Langfuse

langfuse_tracer_provider = TracerProvider() # do not set to global tracer provider to keep isolation
langfuse = Langfuse(tracer_provider=langfuse_tracer_provider)
langfuse.start_observation(name="myspan").end() # Span will be isolated from remaining OTEL instrumentation
```

### 示例 21

```ts
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { setLangfuseTracerProvider } from "@langfuse/tracing";

// Create a new TracerProvider and register the LangfuseSpanProcessor
// do not set this TracerProvider as the global TracerProvider
const langfuseTracerProvider = new NodeTracerProvider({
  spanProcessors: [new LangfuseSpanProcessor()],
})

// Register the isolated TracerProvider
setLangfuseTracerProvider(langfuseTracerProvider)
```

### 示例 22

```python
from langfuse import Langfuse

# Initialize clients for different projects
project_a_client = Langfuse(
    public_key="pk-lf-project-a-...",
    secret_key="sk-lf-project-a-...",
    base_url="https://cloud.langfuse.com"
)

project_b_client = Langfuse(
    public_key="pk-lf-project-b-...",
    secret_key="sk-lf-project-b-...",
    base_url="https://cloud.langfuse.com"
)
```

### 示例 23

```python
from langfuse import observe

@observe
def nested():
    # get_client call is context aware
    # if it runs inside another decorated function that has
    # langfuse_public_key passed, it does not need passing here again


@observe
def process_data_for_project_a(data):
    # passing `langfuse_public_key` here again is not necessarily
    # as it is stored in execution context
    nested()

    return {"processed": data}

@observe
def process_data_for_project_b(data):
    # passing `langfuse_public_key` here again is not necessarily
    # as it is stored in execution context
    nested()

    return {"enhanced": data}

# Route to Project A
# Top-most decorated function needs `langfuse_public_key` kwarg
result_a = process_data_for_project_a(
    data="input data",
    langfuse_public_key="pk-lf-project-a-..."
)

# Route to Project B
# Top-most decorated function needs `langfuse_public_key` kwarg
result_b = process_data_for_project_b(
    data="input data",
    langfuse_public_key="pk-lf-project-b-..."
)
```

### 示例 24

```python
from langfuse.openai import openai

client = openai.OpenAI()

# Route to Project A
response_a = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello from Project A"}],
    langfuse_public_key="pk-lf-project-a-..."
)

# Route to Project B
response_b = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello from Project B"}],
    langfuse_public_key="pk-lf-project-b-..."
)
```

### 示例 25

```python
from langfuse.langchain import CallbackHandler
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

# Create handlers for different projects
handler_a = CallbackHandler(public_key="pk-lf-project-a-...")
handler_b = CallbackHandler(public_key="pk-lf-project-b-...")

llm = ChatOpenAI(model_name="gpt-4o")
prompt = ChatPromptTemplate.from_template("Tell me about {topic}")
chain = prompt | llm

# Route to Project A
response_a = chain.invoke(
    {"topic": "machine learning"},
    config={"callbacks": [handler_a]}
)

# Route to Project B
response_b = chain.invoke(
    {"topic": "data science"},
    config={"callbacks": [handler_b]}
)
```

### 示例 26

```ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";

const sdk = new NodeSDK({
  spanProcessors: [
    new LangfuseSpanProcessor({
      publicKey: "pk-lf-public-key-project-1",
      secretKey: "sk-lf-secret-key-project-1",
    }),
    new LangfuseSpanProcessor({
      publicKey: "pk-lf-public-key-project-2",
      secretKey: "sk-lf-secret-key-project-2",
    }),
  ],
});

sdk.start();
```

### 示例 27

```python
from langfuse import get_client
import datetime, time

langfuse = get_client()

with langfuse.start_as_current_observation(as_type="generation", name="TTFT-Generation") as generation:
    time.sleep(3)
    generation.update(
        completion_start_time=datetime.datetime.now(),
        output="some response",
    )

langfuse.flush()
```

### 示例 28

```ts
import { startActiveObservation } from "@langfuse/tracing";

startActiveObservation("llm-call", async (span) => {
  span.update({
    completionStartTime: new Date().toISOString(),
  });
});
```

### 示例 29

```bash
OTEL_EXPORTER_OTLP_TRACES_CERTIFICATE="/path/to/my-selfsigned-cert.crt"
```

### 示例 30

```python
import os

import httpx

from langfuse import Langfuse

httpx_client = httpx.Client(verify=os.environ["OTEL_EXPORTER_OTLP_TRACES_CERTIFICATE"])

langfuse = Langfuse(httpx_client=httpx_client)
```

### 示例 31

```python
from opentelemetry.instrumentation.threading import ThreadingInstrumentor

ThreadingInstrumentor().instrument()
```


::: info 翻译状态
本页已完成主要章节的中文整理，并保存官方代码块；源文档的复杂表格、FAQ 和部分细节尚需逐段精校，因此当前标记为**待完善译稿**，不应视为完整质量验收。
:::


## 精校索引：代码示例与原文章节

此页目前保留 **31 组官方代码块**，但“示例 1～31”尚未逐一映射到对应的中文操作步骤。**因此本页目前是工作译稿，不应作为已经完整校验的 SDK 操作指南。**

在完成逐节重排前，请配合[官方原文](https://langfuse.com/docs/observability/sdk/advanced-features)确认每段示例的前提条件、适用 SDK 版本及执行顺序。特别注意初始化 OpenTelemetry、Context 传播、Span 结束和短进程 Flush。

原文：[SDK 高级功能](https://langfuse.com/docs/observability/sdk/advanced-features)。
