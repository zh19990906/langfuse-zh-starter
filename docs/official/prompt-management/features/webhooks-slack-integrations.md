---
title: Webhook 与 Slack 集成
description: 提示词版本创建、更新、删除时发送 Webhook 或 Slack 通知。
---
# Webhook 与 Slack 集成

通过 Webhook，可在 Langfuse 中创建、更新或删除提示词版本时接收实时通知。这样可以自动触发 CI/CD、同步提示词目录，或无需轮询 API 就能审计变更。

## 为什么使用？

- **生产监控**：提示词更新时发出提醒。
- **团队协作**：同步提示词变更信息。
- **系统同步**：把提示词目录同步到其他系统。

## 开始配置

1. 进入 `Prompts`，点击 `Automations`。

   ![自动化入口](https://langfuse.com/images/docs/webhook-navigation.png)

2. 点击 `Create Automation`。

   ![创建自动化](https://langfuse.com/images/docs/webhook-create.png)

3. 选择要监听的事件。

   ![事件触发条件](https://langfuse.com/images/docs/webhook-trigger.png)

事件包括：

- **Created**：新增提示词版本；
- **Updated**：标签或 Tag 改变。可能触发两个事件：一个对应获得标签的版本，另一个对应失去标签的版本；
- **Deleted**：删除某个版本。

还可以选择只监听特定提示词。

## Webhook 请求

### 配置接口

![Webhook 配置](https://langfuse.com/images/docs/webhook-action.png)

- **URL**：可接收 POST 的 HTTPS 接口；
- **默认请求头**：`Content-Type: application/json`、`User-Agent: Langfuse/1.0`；
- **签名请求头**：`x-langfuse-signature: t=<timestamp>,v1=<signature>`；
- 可以额外配置静态请求头。

### 请求数据

接收接口会收到如下 JSON：

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2024-07-10T10:30:00Z",
  "type": "prompt-version",
  "apiVersion": "v1",
  "action": "created",
  "prompt": {
    "id": "prompt_abc123",
    "name": "movie-critic",
    "version": 3,
    "projectId": "xyz789",
    "labels": ["production", "latest"],
    "prompt": "As a {{criticLevel}} movie critic, rate {{movie}} out of 10.",
    "type": "text",
    "config": { "key": "value" },
    "commitMessage": "Improved critic persona",
    "tags": ["entertainment"],
    "createdAt": "2024-07-10T10:30:00Z",
    "updatedAt": "2024-07-10T10:30:00Z"
  }
}
```

### 确认接收

服务端必须返回 HTTP 2xx，才能确认成功。处理程序应该具备**幂等性**，因为 Langfuse 在没有收到成功响应时会按照指数退避策略重试。

### 验证签名（推荐）

每次请求都通过 `x-langfuse-signature` 携带 HMAC SHA-256 签名。创建 Webhook 时获取签名密钥，之后也可以重新生成。

**Python 示例：**

```python
import hmac
import hashlib

def verify_langfuse_signature(
    raw_body: str,
    signature_header: str,
    secret: str,
) -> bool:
    # 拆分 t=timestamp,v1=signature
    try:
        ts_pair, sig_pair = signature_header.split(",", 1)
    except ValueError:
        return False

    if "=" not in ts_pair or "=" not in sig_pair:
        return False

    timestamp = ts_pair.split("=", 1)[1]
    received_sig_hex = sig_pair.split("=", 1)[1]

    message = f"{timestamp}.{raw_body}".encode("utf-8")
    expected_sig_hex = hmac.new(
        secret.encode("utf-8"), message, hashlib.sha256
    ).hexdigest()

    try:
        return hmac.compare_digest(
            bytes.fromhex(received_sig_hex),
            bytes.fromhex(expected_sig_hex)
        )
    except ValueError:
        return False
```

签名计算必须使用**原始请求体**，不能先重排或重新格式化 JSON；比较时使用常量时间比较以降低时间侧信道风险。

**TypeScript 示例（与官方一致）：**

```typescript
import crypto from "crypto";

export function verifyLangfuseSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string
): boolean {
  const [tsPair, sigPair] = signatureHeader.split(",");
  if (!tsPair || !sigPair) return false;

  const timestamp = tsPair.split("=")[1];
  const receivedSig = sigPair.split("=")[1];
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`, "utf8")
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(receivedSig, "hex"),
    Buffer.from(expectedSig, "hex")
  );
}
```

::: warning
使用前应检查签名格式和长度；Node.js 的 `timingSafeEqual` 要求两个 Buffer 长度一致，恶意请求可能触发异常。生产环境还应按业务需要验证时间戳的有效期，防止重放。
:::

## Slack 消息

### 1. 将 Slack 连接到 Langfuse

![Slack 认证](https://langfuse.com/images/docs/slack/slack-connection-auth-init.png)

Langfuse 通过 OAuth 连接 Slack，并在数据库中加密保存 Slack 相关密钥。

### 2. 选择通知频道

![选择频道](https://langfuse.com/images/docs/slack/slack-connection-channel-select.png)

选择接收消息的频道，并可以通过模拟发送（Dry Run）确认消息成功到达。

### 3. 查看 Slack 通知

![Slack 提示词变更通知](https://langfuse.com/images/docs/slack/slack-prompt-message.png)

---

原文：[Webhooks & Slack Integration](https://langfuse.com/docs/prompt-management/features/webhooks-slack-integrations) · 非官方中文翻译。
