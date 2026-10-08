---
title: Python SDK v2 升级 v3
description: OpenTelemetry 架构、Decorator、OpenAI、LangChain、LlamaIndex 与底层埋点的迁移指南。
---
# Python SDK v2 → v3

::: info
官方建议 v2 用户最终升级到 Python SDK **v4**。应先完成本页 v2 → v3 变更，再阅读 [v3 → v4 指南](/official/observability/sdk/upgrade-path/python-v3-to-v4)。[v2 历史文档快照](https://python-sdk-v2.docs-snapshot.langfuse.com/docs/observability/sdk/python/decorators)仍可访问。
:::

Python SDK v3 与 v2 **不完全向后兼容**，最主要的变化是基于 OpenTelemetry 的架构、根 Observation 派生 Trace Input/Output、通过 Metadata 或外层 Span 设置 Trace 属性，以及自动的 [OTEL 上下文传播](https://opentelemetry.io/docs/concepts/context-propagation/)。

::: warning
升级后可能摄入其他 OTEL Instrumentation 产生的 HTTP、数据库与框架 Span，增加大量噪声和摄入成本。上线前应检查 Trace，按 [Instrumentation Scope 筛选](https://langfuse.com/docs/observability/sdk/advanced-features#filtering-by-instrumentation-scope)移除无关 Span。
:::

## 按集成方式迁移

### `@observe` 装饰器

**v2：**

```python
from langfuse.decorators import langfuse_context, observe

@observe()
def my_function():
    # This was the trace
    langfuse_context.update_current_trace(user_id="user_123")
    return "result"
```

**v3：**

```python
from langfuse import observe, get_client # new import

@observe()
def my_function():
    # This is now the root span, not the trace
    langfuse = get_client()

    # Update trace explicitly
    langfuse.update_current_trace(user_id="user_123")
    return "result"
```

v3 的装饰器创建的是根 Span，不再等同于 v2 的 Trace；使用 `from langfuse import observe, get_client`。

### OpenAI

**v2：**

```python
from langfuse.openai import openai

response = openai.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
    # Trace attributes directly on the call
    user_id="user_123",
    session_id="session_456",
    tags=["chat"],
    metadata={"source": "app"}
)
```

如果未使用自定义 Trace 属性，不必修改。否则可选择：

**在 Metadata 中设置（较少改动）：**

```python
from langfuse.openai import openai

response = openai.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
    metadata={
        "langfuse_user_id": "user_123",
        "langfuse_session_id": "session_456",
        "langfuse_tags": ["chat"],
        "source": "app"  # Regular metadata still works
    }
)
```

**使用外层 Span：**

```python
from langfuse import get_client, propagate_attributes
from langfuse.openai import openai

langfuse = get_client()

with langfuse.start_as_current_observation(as_type="span", name="chat-request") as span:

    with propagate_attributes(
        user_id="user_123",
        session_id="session_456",
        tags=["chat"],
    ):

        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": "Hello"}],
            metadata={"source": "app"}
        )

        # Set trace input and output explicitly
        span.update_trace(
            output={"response": response.choices[0].message.content},
            input={"query": "Hello"},
            )
```

::: warning
上述 `span.update_trace()` 在 Python v4 已弃用，进一步升级时应改用[替代方法](/official/observability/sdk/upgrade-path/python-v3-to-v4)。
:::

### LangChain

**v2：**

```python
from langfuse.callback import CallbackHandler

handler = CallbackHandler(
    user_id="user_123",
    session_id="session_456",
    tags=["langchain"]
)

response = chain.invoke({"input": "Hello"}, config={"callbacks": [handler]})
```

**v3 使用 Chain Metadata：**

```python
from langfuse.langchain import CallbackHandler

handler = CallbackHandler()

response = chain.invoke(
    {"input": "Hello"},
    config={
        "callbacks": [handler],
        "metadata": {
            "langfuse_user_id": "user_123",
            "langfuse_session_id": "session_456",
            "langfuse_tags": ["langchain"]
        }
    }
)
```

**v3 使用外层 Span：**

```python
from langfuse import get_client, propagate_attributes
from langfuse.langchain import CallbackHandler

langfuse = get_client()

with langfuse.start_as_current_observation(as_type="span", name="langchain-request") as span:

    with propagate_attributes(
        user_id="user_123",
        session_id="session_456",
        tags=["langchain"],
    ):

        handler = CallbackHandler()
        response = chain.invoke({"input": "Hello"}, config={"callbacks": [handler]})

        # Set trace input and output explicitly
        span.update_trace(
            input={"query": "Hello"},
            output={"response": response}
            )
```

此处 `span.update_trace()` 同样只适用于 v3 迁移，v4 已弃用。

### LlamaIndex

**v2：**

```python
from langfuse.llama_index import LlamaIndexCallbackHandler

handler = LlamaIndexCallbackHandler()
Settings.callback_manager = CallbackManager([handler])

response = index.as_query_engine().query("Hello")
```

**v3：**

```python
from langfuse import get_client, propagate_attributes
from openinference.instrumentation.llama_index import LlamaIndexInstrumentor

# Use third-party OTEL instrumentation
LlamaIndexInstrumentor().instrument()

langfuse = get_client()

with langfuse.start_as_current_observation(as_type="span", name="llamaindex-query") as span:

    with propagate_attributes(
        user_id="user_123",
    ):
        response = index.as_query_engine().query("Hello")

    span.update_trace(
        input={"query": "Hello"},
        output={"response": str(response)}
        )
```

新实现使用 `openinference.instrumentation.llama_index.LlamaIndexInstrumentor` 等第三方 OpenTelemetry Instrumentation，而非 Langfuse LlamaIndex Callback。安装 `pip install openinference-instrumentation-llama-index`。

### 底层 SDK

**v2：**

```python
from langfuse import Langfuse

langfuse = Langfuse()

trace = langfuse.trace(
    name="my-trace",
    user_id="user_123",
    input={"query": "Hello"}
)

generation = trace.generation(
    name="llm-call",
    model="gpt-4o"
)
generation.end(output="Response")
```

**v3：**

```python
from langfuse import get_client, propagate_attributes

langfuse = get_client()

# Use context managers instead of manual objects
with langfuse.start_as_current_observation(
    as_type="span",
    name="my-trace",
    input={"query": "Hello"}  # Becomes trace input automatically
) as root_span:

    # Propagate trace attributes to all child observations
    with propagate_attributes(
        user_id="user_123",
    ):

        with langfuse.start_as_current_observation(
            as_type="generation",
            name="llm-call",
            model="gpt-4o"
        ) as generation:
            generation.update(output="Response")

        # If needed, override trace output
        root_span.update_trace(
            input={"query": "Hello"},
            output={"response": "Response"}
            )
```

v3 中手动创建的 Span、Generation 必须 `.end()`。使用 `with` Context Manager 可自动结束并处理嵌套关系。

## 迁移检查清单

1. **更新导入**：`get_client` 使用环境变量获取全局客户端；`Langfuse` 使用构造参数新建实例；`observe` 直接从 `langfuse` 导入；LangChain Handler 从 `langfuse.langchain` 导入。
2. **Trace 属性**：在集成调用的 Metadata 中使用 `langfuse_user_id`、`langfuse_session_id`、`langfuse_tags`，或用 `propagate_attributes()`。
3. **Input/Output**：对依赖特定 Trace Input/Output 的 LLM-as-a-Judge，显式设置，避免根 Observation 自动推导与预期不同。
4. **Context Manager**：从 `langfuse.trace()`、`trace.span()` 迁移到 `with langfuse.start_as_current_observation()`；手动方式需主动结束。
5. **LlamaIndex**：使用第三方 OTEL Instrumentation，安装 `openinference-instrumentation-llama-index`。
6. **ID 管理**：不再支持自定义 Observation ID。Trace ID 为 **32 位小写十六进制字符串**（16 字节），可通过 `Langfuse.create_trace_id(seed=external_id)` 创建与外部 ID 相关联的确定性 Trace ID：

```python
from langfuse import Langfuse, observe
external_request_id = "req_12345"
trace_id = Langfuse.create_trace_id(seed=external_request_id)

@observe(langfuse_trace_id=trace_id)
def my_function():
    pass
```

7. **初始化参数**：`enabled` 更名为 `tracing_enabled`，`threads` 更名为 `media_upload_thread_count`。
8. **Dataset**：v2 DatasetItem 的 `link` 变为 v3 的 `run()` Context Manager，负责创建 Trace 和连接 DatasetItem；后续 v4 又会改为 Experiment SDK。参阅[Dataset 说明](https://langfuse.com/docs/evaluation/experiments/experiments-via-sdk)。

## 详细变化

- **OpenTelemetry**：采用 OTEL 标准以提升兼容性。
- **Trace I/O**：v2 可由集成调用直接设置；v3 默认从根 Observation 推导，必要时使用 `span.update_trace()` 覆盖。
- **Trace 属性位置**：v2 直接传入集成调用；v3 使用 Metadata 或外层 `start_as_current_observation()`。
- **Observation**：v2 使用 `trace()`、`span()`、`generation()`；v3 推荐 Context Manager，必须保证结束。
- **ID 与上下文**：采用 W3C Trace Context，使用 `langfuse.get_current_trace_id()` 替代 `get_trace_id()`。
- **事件大小**：v2 SDK 限制 Event 最大 **1MB**；v3 SDK 不再强制 Event 大小上限。

## v2 未来支持

官方仍计划在可预见时期提供关键问题和安全补丁，但不再新增功能。[v2 文档快照](https://python-sdk-v2.docs-snapshot.langfuse.com/docs/observability/sdk/python/decorators)。

## 原文附带的 JS/TS v3 → v4 章节

上游 Python 迁移文档末尾还重复附有 JS/TS v3 → v4 迁移指南。相关内容已翻译为独立的[JS/TS SDK v3 → v4](/official/observability/sdk/upgrade-path/js-v3-to-v4)页面，涵盖：

- `LANGFUSE_BASEURL` 更名为 `LANGFUSE_BASE_URL`；
- `NodeSDK` 与 `LangfuseSpanProcessor`，以及新版 `@langfuse/tracing` 调用；
- 追踪与非追踪客户端分离，Prompt/Score/Dataset 使用 `LangfuseClient`；
- OpenAI、Vercel AI SDK、LangChain 集成的新导入路径；
- Tool 定义从 `input.tools` 移至 `metadata.tools`；
- `getTraceUrl()` 异步化，以及新的评分和数据集操作。

为了避免同一套迁移示例在两个页面维护出不一致的版本，这里链接已翻译的专篇。

---

原文：[Python v2 → v3](https://langfuse.com/docs/observability/sdk/upgrade-path/python-v2-to-v3) · 非官方中文翻译，保留 Python 的全部 12 段迁移代码。
