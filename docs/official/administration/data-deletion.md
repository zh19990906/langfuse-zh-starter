---
title: 数据删除
description: 删除 Trace、Session 数据、项目、组织或用户账号，以及异步清理的限制。
---
# 数据删除

有时需要从 Langfuse 删除错误创建的测试 Trace、含 PII 的用户数据或整个项目。若仅想自动保留最近一段时间的数据，可使用[数据保留策略](/official/administration/data-retention)。

Langfuse 支持：

- 删除单条 Trace；
- 批量删除 Trace；
- 通过 API 删除一个 Session 的所有 Trace；
- 删除符合筛选条件的全部 Trace；
- 删除项目、组织或用户账号。

下面分别介绍操作及其保证。

::: warning 删除范围与隐私合规
删除 Trace 会级联清理关联的 Observation 和 Score，但**不会自动删除**同一用户可能保存在 Dataset Item、Prompt 或其他对象中的个人数据。按用户请求彻底清除数据时，需要另行枚举并处理这些对象，必要时删除整个项目。删除是异步操作，通常在请求后约 15 分钟内完成；**没有单独的删除完成通知**，应稍后重新查询验证。API 返回成功不代表所有后端已即时清除。
:::

## 删除 Trace

删除 Trace 会一并删除**所有存储后端中关联的 Observation 和 Score**。

### 单条 Trace

**UI：**打开 Trace 详情，点击 **Delete**，确认删除。

![删除单条 Trace](https://langfuse.com/images/docs/delete-single-trace.png)

**API：**

```http
DELETE /api/public/traces/{traceId}
```

[API 参考](https://api.reference.langfuse.com/#tag/trace/DELETE/api/public/traces/%7BtraceId%7D)。

### 批量删除

**UI：**在 Trace 表中勾选多条记录，选择 **Actions → Delete**。

![批量删除](https://langfuse.com/images/docs/delete-trace-batch.png)

**API：**

```http
DELETE /api/public/traces
```

[API 参考](https://api.reference.langfuse.com/#tag/trace/DELETE/api/public/traces)。

### 通过 API 删除 Session 中的 Trace

适用于所有 Cloud 方案；自托管要求 v4。流程：

1. 从当前月开始，使用 [`GET /api/public/v2/observations`](https://api.reference.langfuse.com/#tag/observationsv2/GET/api/public/v2/observations)，按 `sessionId` 和每月时间窗口向过去查询，直到出现完整日历月没有匹配 Observation。**必须先完成这一只读步骤**，确定查询的时间边界。
2. 在确定的完整时间范围中设置 `limit=100`，按 `meta.cursor` 翻页，直到不再有 Cursor。
3. 提取每页唯一的 **`traceId`**，不要使用 Observation ID。
4. 每累积 **1000 个**唯一 Trace ID，调用 `DELETE /api/public/traces`，JSON 请求体为 `{"traceIds": [...]}`。最后一页之后也要提交剩余 ID。

下面示例使用 `requests`（`pip install requests`）。设置 `LANGFUSE_BASE_URL` 为部署地域地址或自托管 URL，`LANGFUSE_PUBLIC_KEY` 和 `LANGFUSE_SECRET_KEY` 为项目 API 密钥，并替换 Session ID。

算法从当前不完整月份向过去逐月扫描；时间窗口**包含开始，不包含结束**，不会重叠。

::: warning
该示例假设：在 API 可访问历史中，只要遇到一个**完整的、没有匹配 Observation 的日历月**，更早的月份就没有需要删除的该 Session 数据。因此**不适用于有超过一个月中断后继续使用的 Session**。当前不完整月份没有数据也不能作为结束条件。

Cloud 的 Observations API v2 可读取窗口：Hobby **30 天**，Core **90 天**；Pro、Team、Enterprise 和自托管不受此 API 窗口限制。项目 Retention 策略仍可能缩短历史范围。此流程只能识别 API 返回的数据。
:::

在分页期间，应固定原来的 `fromStartTime` 和 `toStartTime`。不要把排他性的结束时间改为上一页最后一个 Observation 的时间戳，否则可能跳过同时间戳的其他记录。Cursor 会记录时间边界和 ID，适合在删除异步执行时继续分页。

### Python 完整示例

```python
import os
from datetime import datetime, timedelta, timezone

import requests

session_id = "your-session-id"
scan_end = datetime.now(timezone.utc)
base_url = os.environ["LANGFUSE_BASE_URL"].rstrip("/")


def previous_window(window_end):
    month_start = window_end.replace(
        day=1, hour=0, minute=0, second=0, microsecond=0,
    )
    if month_start == window_end:
        month_start = (month_start - timedelta(days=1)).replace(day=1)
        return month_start, window_end, True
    return month_start, window_end, False


def delete_batch(client, trace_ids):
    response = client.delete(
        f"{base_url}/api/public/traces",
        json={"traceIds": trace_ids},
        timeout=60,
    )
    response.raise_for_status()


with requests.Session() as client:
    client.auth = (
        os.environ["LANGFUSE_PUBLIC_KEY"],
        os.environ["LANGFUSE_SECRET_KEY"],
    )

    # Find the first originally empty full month before deleting anything.
    window_end = scan_end
    while True:
        window_start, current_window_end, full_month = previous_window(window_end)
        response = client.get(
            f"{base_url}/api/public/v2/observations",
            params={
                "sessionId": session_id,
                "fromStartTime": window_start.isoformat(),
                "toStartTime": current_window_end.isoformat(),
                "fields": "core",
                "limit": 1,
            },
            timeout=60,
        )
        response.raise_for_status()
        if not response.json()["data"] and full_month:
            scan_start = current_window_end
            break
        window_end = window_start

    seen_trace_ids = set()
    pending_trace_ids = []
    submitted = 0
    params = {
        "sessionId": session_id,
        "fromStartTime": scan_start.isoformat(),
        "toStartTime": scan_end.isoformat(),
        "fields": "core",
        "limit": 100,
    }

    while True:
        response = client.get(
            f"{base_url}/api/public/v2/observations",
            params=params,
            timeout=60,
        )
        response.raise_for_status()
        page = response.json()
        for observation in page["data"]:
            trace_id = observation["traceId"]
            if not trace_id or trace_id in seen_trace_ids:
                continue
            seen_trace_ids.add(trace_id)
            pending_trace_ids.append(trace_id)
            if len(pending_trace_ids) == 1000:
                delete_batch(client, pending_trace_ids)
                submitted += len(pending_trace_ids)
                pending_trace_ids = []

        cursor = page["meta"].get("cursor")
        if not cursor:
            break
        params["cursor"] = cursor

    if pending_trace_ids:
        delete_batch(client, pending_trace_ids)
        submitted += len(pending_trace_ids)

print(f"Submitted {submitted} traces for deletion.")
```

每次删除都会删除整条 Trace 及其关联 Observation、Score，**包括超出当前查询时间范围的 Observation**。删除是异步执行的，参阅下文限制。

该流程不会阻止相同 `sessionId` 继续产生新数据。如果目标是删除当前全部 Trace，应先暂停该 Session 的数据摄入，并等待已在传输中的数据可查询，再采集 ID；读取之后新增的数据可能需要重复删除流程。

### 按查询筛选删除

在 Trace 列表设置筛选条件。选中当前页全部项后，再从顶部栏扩展为**全部匹配项**，点击 **Actions → Delete**。

![按筛选条件删除 Trace](https://langfuse.com/images/docs/delete-filtered-traces.png)

### 删除限制

::: info
删除某用户的 Trace（如根据 `userId` 满足数据删除请求）会删除相关 Observation、Score，但**不会删除同时存放在 Dataset 等其他对象中的个人数据**。要彻底清除用户数据，需要额外删除其他对象，或[删除整个项目](#删除项目)。
:::

普通 Langfuse 删除通常立即生效，但 Trace 删除是例外。删除数据仓库中的 Trace 较耗资源，系统限制同时处理的删除数量。

一般来说，Trace 在发出删除请求后的 **15 分钟内**从系统清除。Langfuse 不发送删除完成通知；如需验证，应再次查询。

定期清理历史数据建议使用[数据保留策略](/official/administration/data-retention)，自动清理超过天数限制的 Trace、Observation、Score 和媒体资源。

## 删除项目

在项目设置 **General → Danger Zone** 中确认删除。此操作会**立即撤销所有 API Key**，并将项目加入异步删除队列。所需时间随项目大小增长。

::: warning
项目删除不可恢复，全部数据都会移除。特别大的项目可能需要**数天**完成删除；若远超预期，可联系[官方支持](https://langfuse.com/support)。
:::

## 删除组织

只有组织 **Owner** 可删除组织，而且必须先删除或转移组织中的所有项目。

在组织设置 **General → Danger Zone** 中确认删除。组织及关联用户信息会从系统中移除。

可能遇到两类错误：

- `Please delete or transfer all projects before deleting the organization.`：仍有项目属于当前组织。
- `Deletion of your projects is still being processed, please try deleting the organization later`：项目删除已发起，但后台清理尚未结束。并非权限问题；数据清理完成后重试。

## 删除用户账号：Cloud

用户在右下角菜单进入 **Account Settings**，可以自行删除账号。

若你是组织唯一 Owner，需要先将组织所有权转给其他用户，或删除该组织。

![删除账号](https://langfuse.com/images/docs/delete-account-settings.png)

## 删除用户账号：自托管

从数据库的 `users` 表删除对应用户记录，并使用 `CASCADE` 处理关联外键。此操作应由具备相应数据库权限的管理员谨慎执行。

---

原文：[Data Deletion](https://langfuse.com/docs/administration/data-deletion) · 非官方中文翻译；Python 示例保持官方代码不变。
