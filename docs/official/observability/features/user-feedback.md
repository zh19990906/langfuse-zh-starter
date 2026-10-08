---
title: 用户反馈
description: 收集真实用户对 LLM 或 Agent 输出的评价，并用于数据集和质量改进。
---
# 用户反馈

用户反馈可以衡量 AI 是否真正帮助了用户。它能帮助团队发现质量问题、建立更好的评估数据集，并根据真实体验确定改进优先级。在 Langfuse 中，反馈作为 [Score（评分）](https://langfuse.com/docs/evaluation/scores/overview)存储并关联到 Trace。

![用户反馈示例](https://langfuse.com/images/docs/observability/user-feedback-example.png)

![反馈评分分析](https://langfuse.com/images/docs/observability/user-feedback-score.png)

## 反馈类型

### 显式反馈

用户直接使用点赞/点踩、星级评价或评论给回答评分。

| 优势 | 局限 |
| --- | --- |
| 明确表达满意度 | 响应率通常偏低 |
| 实现简单 | 不满意的用户更可能回应 |
| 容易据此采取行动 | 需要用户主动操作 |

### 隐式反馈

从用户行为中推断，例如阅读停留时长、复制回答、接受建议或重复提问。

| 优势 | 局限 |
| --- | --- |
| 每次交互都能产生大量数据 | 实现难度较高 |
| 无需用户额外操作 | 信号具有歧义 |
| 能反映真实使用情况 | 需要分析解读 |

两种类型都可以作为 Langfuse 的 Score。你可以按 Score 筛选 Trace、创建[标注队列](/official/evaluation/evaluation-methods/annotation-queues)，或使用这些数据作为自动化评估的真实标签。

## 快速开始

下面的示例展示如何在使用 Next.js 和 AI SDK 构建的聊天应用中采集显式反馈。完整实现可查看 [Langfuse 示例仓库](https://github.com/langfuse/langfuse-examples/tree/main/applications/user-feedback)。

### 1. 将 Trace ID 返回给前端

后端将 Trace ID 作为消息 ID 返回，使前端反馈可以关联到相应 Trace。

```typescript
// app/api/chat/route.ts
import { getActiveTraceId } from "@langfuse/tracing";

export const POST = observe(async (req: Request) => {
  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse({
    generateMessageId: () => getActiveTraceId() || "",
  });
});
```

上述代码片段保留官方示例的关键逻辑，其余导入、`messages` 数据准备与路由实现见完整示例。

### 2. 前端收集反馈

使用 Langfuse Browser SDK 把反馈发送为 Score。**浏览器 SDK 仅需要 Public Key，绝不能在前端暴露 Secret Key。**

```typescript
import { LangfuseBrowserClient } from "@langfuse/browser";

const langfuse = new LangfuseBrowserClient({
  publicKey: process.env.NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY!,
  baseUrl: process.env.NEXT_PUBLIC_LANGFUSE_BASE_URL,
});

function FeedbackButtons({ messageId }: { messageId: string }) {
  const handleFeedback = async (value: number, comment?: string) => {
    await langfuse.score({
      traceId: messageId,
      id: `user-feedback-${messageId}`,
      name: "user-feedback",
      value,
      dataType: "BOOLEAN",
      comment,
    });
  };

  return (
    <div>
      <button onClick={() => handleFeedback(1)}>👍</button>
      <button onClick={() => handleFeedback(0)}>👎</button>
    </div>
  );
}
```

### 3. 在 Langfuse 中查看反馈

反馈会显示为 Trace 上的 Score。可以通过 `user-feedback < 1` 筛选低评分回答。

![反馈分析界面](https://langfuse.com/images/docs/observability/user-feedback-score.png)

## 服务端反馈

需要在问卷调查或后续交互后记录反馈时，可以从服务端提交 Score。工单关闭或任务成功也可作为隐式反馈信号。

```python
from langfuse import get_client
langfuse = get_client()

ticket_status = checkIfTicketClosed(ticket_id="ticket-456")
if ticket_status.is_closed:
    langfuse.create_score(
        trace_id=ticket_status.trace_id,
        name="ticket-resolution",
        value=1,
        comment=f"Ticket closed successfully after {ticket_status.resolution_time}"
    )
else:
    langfuse.create_score(
        trace_id=ticket_status.trace_id,
        name="ticket-resolution",
        value=0,
        comment="Ticket escalated to human agent"
    )
```

## 使用 LLM-as-a-Judge 采集隐式反馈

还可以通过 LLM 裁判自动判断用户情绪、满意度或参与程度，无需用户操作即可大规模获得质量信号。

![LLM-as-a-Judge 反馈评估](https://langfuse.com/images/docs/observability/llm-as-a-judge-feedback.png)

实现方式见 [LLM-as-a-Judge 评估器](https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge)。

## 示例应用

[用户反馈完整示例](https://github.com/langfuse/langfuse-examples/tree/main/applications/user-feedback)包含：

- OpenTelemetry 追踪；
- 带可选评论的点赞/点踩；
- 跨对话 Session 追踪。

## 相关资料

- [构建用户反馈闭环](https://langfuse.com/guides/user-feedback-loop)
- [将用户反馈转化为评估数据集](https://langfuse.com/resources/engineering/user-feedback-to-evaluation-datasets)

---

原文：[User Feedback](https://langfuse.com/docs/observability/features/user-feedback) · 非官方中文翻译。
