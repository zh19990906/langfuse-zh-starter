---
title: Web Callouts
description: 从 Langfuse 中的 Trace、Observation 或 Session 手动触发 HTTP 请求。
---
# Web Callouts

Web Callouts 允许项目成员从 Langfuse UI 中的 Trace、Observation 或 Session 发起预先配置的后端 HTTP 请求。可以将调试工作流连接到内部工具、客服系统、事件响应流程或自定义调查服务。

与[提示词 Webhook](/official/prompt-management/features/webhooks-slack-integrations)不同，Web Callouts 是用户在 UI 中**手动触发**的。用户点击操作后，Langfuse 后端同步发送请求。

::: info
Web Callouts 仅发送标识符：Trace、Observation、Session ID 和项目 ID。如果需要其他数据，请在自己的后端通过 Langfuse API 查询。
:::

## 配置 Web Callout

进入 **Project Settings → Integrations → Web Callouts** 创建接口。只有具有 Admin / Owner（`integrations:CRUD`）权限的成员可以配置新的 Callout。

Callout 按项目配置，**项目中的所有用户**都可以触发。

需要设置的内容：

- **Name**：在操作菜单中显示，例如 `Add to Support Tool`。
- **URL**：可接收 `POST` 的 HTTP/HTTPS 地址，支持自定义端口。
- **Success toast message**：接口成功时向用户显示的提示文本。
- **Enabled**：禁用后不再出现在操作菜单里。
- **Request headers**：可选静态请求头，例如 `Authorization: Bearer <token>`。

## 触发 Web Callout

配置完成后，拥有项目读取权限的用户可以从以下位置触发：

- Trace 详情操作菜单；
- Observation 详情操作菜单；
- Session 详情页的顶部操作区域。

用户点击后立即发送请求。只有接口返回 HTTP 2xx，UI 才会显示成功提示。请求超时时间为 **5 秒**，不进行重试，并有速率限制。

## 请求数据

Langfuse 发送以下 JSON 格式的 `POST` 请求：

```json
{
  "version": 1,
  "items": [
    {
      "projectId": "project-id",
      "traceId": "trace-id",
      "observationId": null,
      "sessionId": "session-id"
    }
  ]
}
```

除 `projectId` 外，其他 ID 字段都可以是 `null`。发送请求前，Langfuse 会检查 Trace、Observation 和 Session 是否属于该项目。

## 接口要求

接收端必须：

- 接收 `Content-Type: application/json` 的 `POST` 请求；
- 在 **5 秒**内返回任意 HTTP 2xx 状态码。

非 2xx、网络故障、无效 URL 和超时均视为调用失败，并在界面中显示错误信息。

Web Callouts **不会自动重试，也不保存投递日志**。

## 认证与请求头

可以配置 `Authorization`、`X-API-Key` 等静态请求头用于认证。

请求头的值会被加密存储，并由 Langfuse 后端发送。编辑已有请求头时，如果不修改名称且将值留空，将保留此前加密存储的值。

Langfuse 自动设置 `Content-Type: application/json` 和 `User-Agent: Langfuse/1.0`。

不允许自定义以下请求头：`content-length`、`content-type`、`cookie`、`host`。

---

原文：[Web Callouts](https://langfuse.com/docs/observability/features/web-callouts) · 非官方中文翻译。
