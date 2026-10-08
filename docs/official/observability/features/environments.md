---
title: 环境（Environments）
description: 配置环境，以组织不同场景的追踪、观测记录和评分。
---

# 环境

环境用于组织来自生产、预发布和开发等不同上下文中的 Trace、Observation 和 Score。你可以：

- 在同一个项目中区分开发数据与生产数据；
- 按环境筛选和分析数据；
- 跨环境复用数据集与提示词。

## 筛选

在 Langfuse 界面中，可以通过导航栏的环境筛选器筛选事件。该筛选器适用于所有视图。有关通过 API 按环境筛选的细节，参阅[API 参考](https://langfuse.com/docs/api)。

## 管理环境

当第一次接收包含特定 `environment` 值的数据时，Langfuse 会自动创建该环境；环境会持久保留。当前无法通过 UI 删除或重命名环境。

如何在不同项目和阶段之间组织环境，参阅[管理不同环境](https://langfuse.com/faq/all/managing-different-environments)。

## 配置环境

推荐设置环境变量 `LANGFUSE_TRACING_ENVIRONMENT`，也可在初始化客户端时传入 `environment` 参数。如果两者都设置，**初始化参数优先**。都没有设置时默认值为 `default`。

Python SDK 还支持在指定 Trace 作用域内通过 `propagate_attributes(environment="...")` 指定环境。这适用于环境由传入请求决定、而非由服务进程决定的情况，例如一个共享的 LLM 代理需要同时服务开发、预发布、QA 和生产请求。设置 `as_baggage=True` 可将环境跨服务边界传播。

### 命名限制

环境名最长 40 个字符，必须匹配正则表达式 `^(?!langfuse)[a-z0-9-_]+$`，也就是：

- 不能以 `langfuse` 开头；
- 只能包含小写字母、数字、连字符和下划线。

### 数据模型

`environment` 属性存在于以下事件类型上：Trace、Observation、Score 和 Session。参阅[数据模型](/official/observability/data-model)。

## 使用示例

### Python SDK

```python
from langfuse import get_client, observe, propagate_attributes
import os

# 设置环境变量，也可以通过 .env 文件配置
os.environ["LANGFUSE_TRACING_ENVIRONMENT"] = "production"
langfuse = get_client()

with langfuse.start_as_current_observation(as_type="span", name="my-operation") as span:
    pass

@observe
def main():
    return "Hello"

main()

# 按请求单独设置环境
with langfuse.start_as_current_observation(as_type="span", name="proxy-request"):
    with propagate_attributes(environment="staging"):
        pass
```

### JavaScript / TypeScript SDK

设置环境变量：

```bash
export LANGFUSE_TRACING_ENVIRONMENT=production
```

### OpenTelemetry

可以使用以下任一属性设置环境：

- `langfuse.environment`
- `deployment.environment.name`
- `deployment.environment`

全局设置可以使用资源属性，例如 `OTEL_RESOURCE_ATTRIBUTES="langfuse.environment=staging"`。也可以针对单个 Span 设置：

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)
with tracer.start_as_current_span("my-operation") as span:
    span.set_attribute("langfuse.environment", "staging")
    span.set_attribute("deployment.environment.name", "staging")
```

### OpenAI Python 集成

Python SDK 初始化时传入的环境适用于通过该客户端采集的事件，无论使用何种 Langfuse 维护的集成。

```python
import os
from langfuse import Langfuse
from langfuse.openai import openai

os.environ["LANGFUSE_TRACING_ENVIRONMENT"] = "production"
langfuse = Langfuse(environment="production")

completion = openai.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a calculator."},
        {"role": "user", "content": "1 + 1 = "},
    ],
)
```

### OpenAI JavaScript / TypeScript 集成

```bash
LANGFUSE_TRACING_ENVIRONMENT=production
```

```ts
import OpenAI from "openai";
import { observeOpenAI } from "@langfuse/openai";

const openai = observeOpenAI(new OpenAI());
```

参阅 [OpenAI JS/TS 集成](https://langfuse.com/integrations/model-providers/openai-js)。

### LangChain Python 集成

```python
import os
from langfuse.langchain import CallbackHandler

os.environ["LANGFUSE_TRACING_ENVIRONMENT"] = "production"
handler = CallbackHandler()
```

### LangChain JS/TS 集成

环境配置在 `LangfuseSpanProcessor` 中，也可以通过环境变量配置；`CallbackHandler` 创建的 Span 会自动经过该处理器。

```ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";
import { CallbackHandler } from "@langfuse/langchain";

const sdk = new NodeSDK({
  spanProcessors: [
    new LangfuseSpanProcessor({ environment: "production" }),
  ],
});
sdk.start();
const handler = new CallbackHandler();
```

### Vercel AI SDK

```ts
import { registerOTel } from "@vercel/otel";
import { LangfuseSpanProcessor } from "@langfuse/otel";

export function register() {
  registerOTel({
    serviceName: "langfuse-vercel-ai-nextjs-example",
    spanProcessors: [
      new LangfuseSpanProcessor({ environment: "production" }),
    ],
  });
}
```

## 最佳实践

1. **名称一致**：整个应用使用一致的环境名称，便于筛选和分析。
2. **按环境比较**：对比不同部署阶段的指标。
3. **测试隔离**：测试使用独立环境，避免污染生产数据。

官方页面中的 GitHub Discussions 是动态组件，本站不嵌入，查看[原文与讨论入口](https://langfuse.com/docs/observability/features/environments)。

---

原文：[Environments](https://langfuse.com/docs/observability/features/environments) · 非官方中文翻译。