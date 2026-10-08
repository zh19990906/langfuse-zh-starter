---
title: users
description: Langfuse 官方文档的中文翻译与适配。
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

原文：[User Tracking](https://langfuse.com/docs/observability/features/users)。部分框架示例待补充。
