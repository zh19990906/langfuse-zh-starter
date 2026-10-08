---
title: 用户追踪
description: 按用户汇总 Langfuse Trace、Token 用量、成本与反馈，了解 userId 传播限制。
---

# 用户追踪

Langfuse 的 **Users** 页面汇总所有用户，并提供单个用户的详细分析。只需在 Observation 中传播 `userId`，就能关联数据并按用户统计 Token 使用量、调用成本、Trace 数及反馈。

`userId` 可为用户名、电子邮箱或其他唯一标识，属于可选属性。如果目的是收集终端用户评价，参阅[用户反馈](/official/observability/features/user-feedback)。

## 查看所有用户

用户列表支持按 Token 用量、Trace 数量和用户反馈分析。

![用户列表](https://langfuse.com/images/docs/users-list.png)

## 单个用户

详情页可查看用户的聚合指标、全部 Trace 和反馈。

![用户详情](https://langfuse.com/images/docs/user-detail-view.png)

## Python SDK

```python
from langfuse import observe, propagate_attributes

@observe()
def process_user_request(user_query):
    with propagate_attributes(user_id="user_12345"):
        return process_query(user_query)
```

手动 Observation 同样在 `start_as_current_observation` 内部调用 `propagate_attributes(user_id=...)`。

## JavaScript / TypeScript

```typescript
import { startActiveObservation, propagateAttributes } from "@langfuse/tracing";

await startActiveObservation("process-user-request", async () => {
  await propagateAttributes({ userId: "user-123" }, async () => {
    // 子 Observation 自动继承用户 ID
  });
});
```

OpenAI、LangChain 的追踪包装器也可在相同上下文中继承用户 ID。

## 深度链接

用户页面的 URL 格式为：

```text
https://<hostname>/project/{projectId}/users/{userId}
```

还可以通过[自定义仪表盘](https://langfuse.com/docs/metrics/features/custom-dashboards)和 [Metrics API](/official/metrics/features/metrics-api)查询每用户成本、Token 数与 Trace 数。

## 多框架接入示例

### Python：直接创建 Observation

```python
from langfuse import get_client, propagate_attributes

langfuse = get_client()
with langfuse.start_as_current_observation(
    as_type="span", name="process-user-request"
) as root_span:
    with propagate_attributes(user_id="user_12345"):
        with root_span.start_as_current_observation(
            as_type="generation", name="generate-response", model="gpt-4o"
        ) as gen:
            pass
```

### TypeScript：`observe` 包装器

```typescript
import { observe, propagateAttributes } from "@langfuse/tracing";

const processUserRequest = observe(
  async (userQuery: string) => {
    return await propagateAttributes({ userId: "user-123" }, async () => {
      return await processQuery(userQuery);
    });
  },
  { name: "process-user-request" }
);
const result = await processUserRequest("some query");
```

### Python：OpenAI 集成

```python
from langfuse import get_client, propagate_attributes
from langfuse.openai import openai

langfuse = get_client()
with langfuse.start_as_current_observation(as_type="span", name="openai-call"):
    with propagate_attributes(user_id="user_12345"):
        completion = openai.chat.completions.create(
            name="test-chat", model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a calculator."},
                {"role": "user", "content": "1 + 1 = "}
            ], temperature=0,
        )
```

### Python：LangChain 集成

```python
from langfuse import get_client, propagate_attributes
from langfuse.langchain import CallbackHandler

langfuse = get_client()
handler = CallbackHandler()
with langfuse.start_as_current_observation(as_type="span", name="langchain-call"):
    with propagate_attributes(user_id="user_12345"):
        chain.invoke({"animal": "dog"}, config={"callbacks": [handler]})
```

### TypeScript：LangChain 集成

```typescript
import { startActiveObservation, propagateAttributes } from "@langfuse/tracing";
import { CallbackHandler } from "@langfuse/langchain";

const langfuseHandler = new CallbackHandler();
await startActiveObservation("langchain-call", async () => {
  await propagateAttributes({ userId: "user-123" }, async () => {
    await chain.invoke(
      { input: "<user_input>" },
      { callbacks: [langfuseHandler] }
    );
  });
});
```

## 用户 ID 属性传播限制

官方页面的 `PropagationRestrictionsCallout` 组件规定了 `userId` 的以下约束；中文版在此展开关键内容，而不再将其隐藏在动态组件中：

- `userId` **必须是字符串，最长 200 个字符**。
- 应在 Trace 执行流程**尽早**调用 `propagate_attributes(user_id=...)` 或 `propagateAttributes({ userId: ... }, callback)`；它影响当前上下文内的 Observation，不会自动回填之前已创建的 Observation。过晚传播可能使按用户聚合的指标不完整。
- 不合法的传播值会被丢弃并产生警告。排查用户指标缺失时，先确认值的类型、长度及调用位置。
- 详细用法参阅[SDK 属性传播](/official/observability/sdk/instrumentation#添加属性)。

官方动态 GitHub Discussions 未嵌入，参阅[用户追踪原文](https://langfuse.com/docs/observability/features/users)。

原文：[User Tracking](https://langfuse.com/docs/observability/features/users)。正文及各框架 SDK 示例已补齐。
