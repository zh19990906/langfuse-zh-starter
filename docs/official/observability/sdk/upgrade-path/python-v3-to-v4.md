---
title: Python SDK v3 升级 v4
description: Langfuse Python SDK v4 数据模型、Span 导出、追踪方法与 API 迁移。
---
# Python SDK v3 → v4

Python SDK v4 引入[Observation 优先数据模型](/official/observability/data-model)。在该模型中，`user_id`、`session_id`、`metadata`、`tags` 等关联属性会传播到**每个 Observation**，不再只保存在 Trace 上，因此查询可以避免昂贵的 Join。

Trace 属性的设置方式由命令式的 `update_current_trace()` 改为 Context Manager `propagate_attributes()`，对上下文内当前和子 Observation 自动生效。

::: warning
v4 默认**不再导出全部 OpenTelemetry Span**。依赖 HTTP、DB、Queue 等非 LLM Span 的项目应在升级前检查筛选规则。
:::

## 破坏性变更

### 智能 Span 筛选

此前导出全部非黑名单 OpenTelemetry Span 容易引入大量 HTTP、数据库或框架内部噪声。v4 默认仅导出满足任一条件的 Span：

- Langfuse `langfuse-sdk` 创建；
- 具有 `gen_ai.*` 属性；
- Instrumentation Scope 与已知 LLM 前缀匹配，如 `openinference`、`langsmith`、`haystack`、`litellm`。

**维持旧版全部导出行为：**

```python
from langfuse import Langfuse

langfuse = Langfuse(should_export_span=lambda span: True)
```

**与默认过滤组合自定义规则：**

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

#### `blocked_instrumentation_scopes` 即将弃用

v4 仍支持 `blocked_instrumentation_scopes`，但已弃用，未来会移除。可以用 `should_export_span` 实现等效黑名单：

```python
from langfuse import Langfuse
from langfuse.span_filter import is_default_export_span

blocked = {"sqlite", "requests"}

langfuse = Langfuse(
    should_export_span=lambda span: (
        is_default_export_span(span)
        and (
            span.instrumentation_scope is None
            or span.instrumentation_scope.name not in blocked
        )
    )
)
```

如果同时配置 `blocked_instrumentation_scopes` 和 `should_export_span`，前者仍会执行硬性拒绝，优先级更高。

**可能的 Trace 树断裂：**父 Span 或中间 Span 被筛掉而子 Span 保留时会出现孤立节点。使用 `Langfuse(debug=True)` 或 `LANGFUSE_DEBUG="True"` 检查丢弃记录，在自定义过滤器中允许必要 Scope。参考[高级功能](https://langfuse.com/docs/observability/sdk/advanced-features)与[OTEL 排障](https://langfuse.com/faq/all/existing-otel-setup#unwanted-spans-in-langfuse)。

### `update_current_trace()` 拆成三个方法

关联属性 `user_id`、`session_id`、`metadata`、`tags` 和请求级 `environment` 应保存在每条 Observation 上，因此通过 `propagate_attributes()` 传播。

**v3：**

```python
langfuse.update_current_trace(
    name="trace-name",
    user_id="user-123",
    session_id="session-abc",
    version="1.0",
    input={"query": "hello"},
    output={"result": "world"},
    metadata={"key": "value"},
    tags=["tag1"],
    public=True,
)
```

**v4：**

```python
from langfuse import observe, propagate_attributes, get_client

langfuse = get_client()

@observe()
def my_function():
    # (a) Correlating attributes → propagate_attributes() context manager
    with propagate_attributes(
        trace_name="trace-name",  # note: 'name' is now 'trace_name'
        user_id="user-123",
        session_id="session-abc",
        version="1.0",
        metadata={"key": "value"},
        tags=["tag1"],
        environment="staging",
    ):
        result = call_llm("hello")

    # (b) Trace I/O (deprecated, only for legacy trace-level LLM-as-a-judge configurations)
    langfuse.set_current_trace_io(input={"query": "hello"}, output={"result": result})

    # (c) Public flag
    langfuse.set_current_trace_as_public()
```

| 属性 | v3 | v4 |
| --- | --- | --- |
| `name` | `update_current_trace(name=...)` | `propagate_attributes(trace_name=...)` |
| `user_id`、`session_id`、`tags`、`version` | `update_current_trace(...)` | `propagate_attributes(...)` |
| `metadata` | 接受任意 Metadata | `dict[str,str]` |
| `input`、`output` | `update_current_trace(...)` | `set_current_trace_io(...)`（已弃用） |
| `public` | `update_current_trace(public=True)` | `set_current_trace_as_public()` |
| `release` | `update_current_trace(release=...)` | 移除，使用 `LANGFUSE_RELEASE` |
| `environment` | `update_current_trace(environment=...)` | 进程级设置用 `LANGFUSE_TRACING_ENVIRONMENT` 或 `Langfuse(environment=...)`；请求级用 `propagate_attributes(environment=...)` |

::: warning
`set_current_trace_io()` 已弃用，仅为旧的 Trace 级 LLM-as-a-Judge 评价器保留。新代码应直接在**根 Observation**上设置 Input/Output。
:::

### `span.update_trace()` 同样拆成三个方法

**v3：**

```python
span.update_trace(
    name="trace-name",
    user_id="user-123",
    session_id="session-abc",
    input={"query": "hello"},
    output={"result": "world"},
    public=True,
)
```

**v4：**

```python
from langfuse import get_client, propagate_attributes

langfuse = get_client()

with langfuse.start_as_current_observation(as_type="span", name="my-operation") as span:
    with propagate_attributes(trace_name="trace-name", user_id="user-123", session_id="session-abc"):
        result = call_llm("hello")

    span.set_trace_io(input={"query": "hello"}, output={"result": result})  # deprecated
    span.set_trace_as_public()
```

对 LangChain、OpenAI 等集成而言，传入的 Trace 属性现在只向**子节点**传播，不会向上汇总到 Trace。

### 公开 API 命名空间映射

v4 默认使用高性能接口，移除 v2 别名：

| v3 / 过渡名称 | v4 名称 |
| --- | --- |
| `api.observations_v_2` | `api.observations` |
| `api.score_v_2` | `api.scores` |
| `api.metrics_v_2` | `api.metrics` |
| `api.observations`（旧 v1） | `api.legacy.observations_v1` |
| `api.score`（旧 v1） | `api.legacy.score_v1` |
| `api.metrics`（旧 v1） | `api.legacy.metrics_v1` |

**自托管 v3 兼容性：**新的默认 `api.observations` 与 `api.metrics` 使用 v2 服务端接口，要求 Langfuse v4；连接自托管 v3 时须使用 `api.legacy.observations_v1`、`api.legacy.metrics_v1`。参阅[兼容矩阵](https://langfuse.com/self-hosting/upgrade/versioning#sdk-server)。

::: info
服务器公共 API 端点弃用和 Python v4 SDK 破坏性变更是不同的两件事。部分方法依旧存在，但访问已弃用端点，如 `langfuse.api.trace.list()`、`langfuse.api.sessions.list()`、`langfuse.api.scores.get_many()`。详见[弃用接口迁移指南](https://langfuse.com/faq/all/deprecated-api-migration#sdk-method-quick-reference)。
:::

### `start_span()` / `start_generation()` 改为 `start_observation()`

Observation 成为统一基础概念，通过 `as_type` 区分类型：

| v3 | v4 |
| --- | --- |
| `langfuse.start_span(name="x")` | `langfuse.start_observation(name="x")` |
| `langfuse.start_as_current_span(name="x")` | `langfuse.start_as_current_observation(name="x")` |
| `langfuse.start_generation(name="x", model="gpt-4")` | `langfuse.start_observation(name="x", as_type="generation", model="gpt-4")` |
| `langfuse.start_as_current_generation(name="x", model="gpt-4")` | `langfuse.start_as_current_observation(name="x", as_type="generation", model="gpt-4")` |
| `span.start_span(name="x")` | `span.start_observation(name="x")` |
| `span.start_as_current_span(name="x")` | `span.start_as_current_observation(name="x")` |
| `span.start_generation(name="x")` | `span.start_observation(name="x", as_type="generation")` |
| `span.start_as_current_generation(name="x")` | `span.start_as_current_observation(name="x", as_type="generation")` |

### 移除 `DatasetItemClient.run()`

改用 [Experiment SDK](https://langfuse.com/docs/evaluation/experiments/experiments-via-sdk) 的 `dataset.run_experiment()`，自动传播运行 Metadata 与 DatasetItem 关联关系。

**v3：**

```python
for item in dataset.items:
    with item.run(run_name="my-run", run_metadata={...}) as span:
        result = my_llm(item.input)
        span.update(output=result)
```

**v4：**

```python
from langfuse import get_client

dataset = get_client().get_dataset("my-dataset")

def my_task(*, item, **kwargs):
    return my_llm(item.input)

dataset.run_experiment(name="my-run", task=my_task)
```

`DatasetItem` 仍保留 `id`、`input`、`expected_output`、`metadata` 等字段，但移除 `run()` 方法。

### LangChain `CallbackHandler` 移除 `update_trace`

Handler 现在内部使用 `propagate_attributes()`，传入旧版 `update_trace` 参数会引发 `TypeError`。

**v3：**

```python
from langfuse.langchain import CallbackHandler

handler = CallbackHandler(update_trace=True, trace_context={...})
```

**v4：**

```python
handler = CallbackHandler(trace_context={...})
```

仍可以在外层 Observation 中使用 `propagate_attributes()` 向 LangChain 子节点传播 User、Session、Tag 等属性，详见[属性配置](https://langfuse.com/docs/observability/sdk/instrumentation#add-attributes)。

### 移除的类型

- `TraceMetadata`：此前包含 Name、User、Session、Version、Release、Metadata、Tag、Public 的 TypedDict。
- `ObservationParams`：继承 TraceMetadata 并添加 Observation 字段的 TypedDict。
- `MapValue`、`ModelUsage`、`PromptClient`：不再从 `langfuse.types` 导出，改从 `langfuse.model` 导入。

### 不再支持 Pydantic v1

SDK 要求 **Pydantic v2**。旧版程序如需继续调用 v1 功能，应使用 [`pydantic.v1` 兼容层](https://docs.pydantic.dev/latest/migration/#continue-using-pydantic-v1-features)。

### 参数校验变化

- `metadata` 必须是 `dict[str,str]`，值最长 **200 字符**；非字符串自动转成字符串，超长值丢弃并给出 Warning。
- `user_id`、`session_id` 必须是字符串，最长 **200 字符**，超长会丢弃并警告。

## 迁移检查清单

1. 检查依赖非 LLM OTEL Span 的 Trace 与 Dashboard。
2. 必要时配置 `should_export_span=lambda span: True`，维持全量导出。
3. 将 `blocked_instrumentation_scopes` 迁移到 `should_export_span`。
4. 搜索 `update_current_trace`，分拆为 `propagate_attributes()`、仅旧兼容使用的 `set_current_trace_io()`、`set_current_trace_as_public()`。
5. 搜索 `.update_trace(`，对 Observation 执行类似迁移。
6. `start_span` / `start_generation` 改为 `start_observation`。
7. `item.run(` 改为 `dataset.run_experiment()`。
8. 移除 `CallbackHandler(update_trace=...)` 参数。
9. 检查 Metadata 为 `dict[str,str]`，值不超过 200 字符。
10. 升级 Pydantic 至 v2。
11. 将 `api.observations_v_2` / `api.score_v_2` / `api.metrics_v_2` 改为默认 `api.observations` / `api.scores` / `api.metrics`。
12. 原来使用 v1 的 `api.observations` / `api.score` / `api.metrics` 移至 `api.legacy.*_v1`。
13. 自托管 v3 服务必须使用 `api.legacy.observations_v1` / `api.legacy.metrics_v1`；默认接口要求 v4。
14. 清理全部 `*_v_2` 别名。

---

原文：[Python SDK v3 → v4](https://langfuse.com/docs/observability/sdk/upgrade-path/python-v3-to-v4) · 非官方中文翻译，保留全部 11 段代码示例。
