---
title: 告警（Alerts）
description: 对 LLM 应用指标设置阈值，并通过 Slack、Webhook 或 GitHub Actions 发送通知。
---
# 告警（Alerts）

Langfuse Cloud 的 Hobby、Core、Pro、Enterprise 均支持告警；自托管要求 v4。Cloud 每个组织的告警数量上限依次为 **2、20、50、100**；自托管 v4 不设数量限制。

告警可以帮助你在成本或质量问题影响用户之前发现异常，并通过 Slack、GitHub Actions 或自定义 Webhook 通知。

![告警列表](https://langfuse.com/images/docs/monitors-list.png)

## 创建告警

进入项目的 [Alerts](https://cloud.langfuse.com/project/~/monitors) 页面，点击 **New Alert**。

### 1. 配置指标

| 字段 | 说明 |
| --- | --- |
| Data source | `Observations`、`Scores (numeric)`、`Scores (categorical)`、`Scores (boolean)` |
| Metric | 聚合方式和度量值，如 `avg latency`、`count`、`p95 cost` |
| Filters | 按模型、Tag、用户 ID、环境、布尔值等筛选 |

对于布尔 Score，平均值就是 `true` 的比例，可用于监控合规检查通过率或幻觉检测比例。

### 2. 设置告警条件

| 字段 | 说明 |
| --- | --- |
| Operator | `>`、`≥`、`<`、`≤`、`=`、`≠` |
| Alert threshold | 必填，越过该值后 Severity 为 `ALERT` |
| Warning threshold | 可选，越过警告阈值后 Severity 为 `WARNING` |
| Window | 每次计算的回溯窗口，如 1 小时、1 天、1 周 |

### 3. 高级设置（可选）

无数据时的处理方式：

| 模式 | 行为 |
| --- | --- |
| Treat missing data as 0（默认） | 将空值当作 0，与阈值比较 |
| Keep the previous severity | 保持之前等级，不发送通知 |
| Show severity NO_DATA | 记录 `NO_DATA` 等级，不通知 |
| Notify after sustained NO_DATA | 持续无数据达到配置时长后通知 |

重复通知（Renotify）：

| 模式 | 行为 |
| --- | --- |
| Off（默认） | 每次等级转换只发送一次 |
| Every N minutes | 高等级持续时每 N 分钟重新通知，范围 1–10,080 分钟 |

### 4. 选择通知通道

从 **Automations** 中选择一个或多个自动化。告警触发时，Langfuse 将事件发布给每个自动化，再执行配置的 Slack、Webhook 等动作。

### 5. 命名并保存

设置最多 **200 字符**的名称和可选 Tag，然后点击 **Save**；也可留空标题，由配置自动生成。告警保存后立即变为 **ACTIVE**，并计划首次计算。

### 无数据处理与通知边界

查询没有数据时，可按配置选择无数据状态或持续无数据后通知。**`NO_DATA` 不等于告警阈值被触发**；仅配置 **Notify after sustained NO_DATA** 的情况会将相关无数据状态变化纳入通知。实际告警还可能处于 `OK`、`WARNING`、`ALERT`、`UNKNOWN` 等状态，应在自动化中区分处理。

Webhook 动作通过 HTTP POST 发送带 HMAC 签名的 JSON；签名校验规则请参考[官方 Webhook 安全示例](https://langfuse.com/docs/prompt-management/features/webhooks-slack-integrations)。不要仅凭接收到请求就认定来自 Langfuse。

## 告警状态

| Severity | 含义 |
| --- | --- |
| `UNKNOWN` | 初始状态，尚未计算 |
| `OK` | 指标在允许范围内 |
| `WARNING` | 越过警告阈值 |
| `ALERT` | 越过正式告警阈值 |
| `NO_DATA` | 没有数据，且采用 NO_DATA 相关处理模式 |
| `PAUSED` | 已暂停，不进行计算 |

**通知发送规则：**

- 违规：`UNKNOWN / OK → WARNING / ALERT`，总会通知。
- 恢复：`WARNING / ALERT → OK`，总会通知。
- 无数据：与 `NO_DATA` 互相转换，仅在“持续无数据后通知”模式下通知。
- 持续同等级：`WARNING → WARNING`、`ALERT → ALERT`，仅启用 Renotify 时再次通知。

## 暂停、恢复或删除

可在列表或详情页的行操作菜单中选择 **Pause**、**Resume**。暂停后不再计算，等级固定为 `PAUSED`；恢复后重新进入 `ACTIVE`，并安排下一次计算。

永久删除需要在详情页点击垃圾桶图标并确认 **Delete alert**，**不可撤销**。

## Automations

Automation 将告警等级变化的**触发器**连接到外部通知动作：

| 通道 | 操作 |
| --- | --- |
| Slack | 向指定频道发送格式化告警消息 |
| Webhook | 对自有接口 POST 带 HMAC 签名的 JSON |
| GitHub Actions | 向 GitHub 仓库发送 `workflow_dispatch` 事件 |

### 创建告警自动化

1. 进入 [Automations](https://cloud.langfuse.com/project/~/automations)，点击 **Create Automation**。
2. Event Source 选择 **Alert**。
3. Action 选择 **Slack**、**Webhook** 或 **GitHub Actions**。
4. 配置 Slack 频道、Webhook URL，或 GitHub dispatch URL、事件类型及 Personal Access Token。
5. 填写名称，保存。

### 将告警与自动化关联

1. 创建或编辑 Alert 类型的自动化。
2. 创建或编辑告警。
3. 在通知区域的 **Automations** 面板选中自动化。
4. 保存。此后告警等级变更时，将执行每个关联自动化。

::: warning
连续 **5 次**投递失败后，Langfuse 自动禁用该 Automation 的触发器。恢复接口后需要在 Automations 页面手动重新启用。
:::

### Webhook 数据格式

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2024-07-10T10:30:00Z",
  "type": "monitor-alert",
  "apiVersion": "v1",
  "payload": {
    "monitorId": "monitor_abc123",
    "projectId": "proj_xyz789",
    "permalink": "https://cloud.langfuse.com/project/proj_xyz789/monitors/monitor_abc123",
    "message": {
      "title": "avg latency crossed alert threshold",
      "body": "avg latency is 1234 ms (threshold: 1000 ms) over the last 1 hour"
    },
    "severity": "ALERT",
    "timestamp": "2024-07-10T10:30:00Z",
    "fromTimestamp": "2024-07-10T09:30:00Z",
    "toTimestamp": "2024-07-10T10:30:00Z",
    "view": "observations",
    "filters": [],
    "window": "1h"
  }
}
```

为了兼容旧集成，Payload 保留 `monitor` 命名（`type`、`monitorId`、`permalink`）。

签名校验方式与提示词 Webhook 完全一致，详见 [Webhook 的 HMAC 校验代码](/official/prompt-management/features/webhooks-slack-integrations)。

## 从评估器创建告警

可在 Evaluator 页面直接创建 Score 或成本告警。Langfuse 自动填入指标、筛选器，排除评估器测试运行，并展示已关联的告警。参阅[监控评估器结果](https://langfuse.com/docs/evaluation/core-concepts#monitor-evaluator-results)。

官方动态 GitHub Discussions 未嵌入，可通过[原文](https://langfuse.com/docs/observability/features/alerts)访问。

---

原文：[Alerts](https://langfuse.com/docs/observability/features/alerts) · 非官方中文翻译。
