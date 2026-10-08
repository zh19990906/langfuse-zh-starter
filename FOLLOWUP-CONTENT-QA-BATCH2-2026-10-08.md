# 后续内容证据核销（二）：2026-10-08

本批仅补查以下 **8 篇**未在上一批报告核销的文档。逐篇读取官方 MDX 与中文 Markdown。表中的“官方 / 中文代码块”仅报告围栏数量，并不自动代表功能或全文通过；动态区域配置合并的页面单独说明。**未执行 SDK 或网络服务测试；未部署**。

| 中文文档（`docs/official/` 下） | 上游 Blob SHA | 代码块（官方 / 中文） | 本轮核对证据 | 修复提交 |
| --- | --- | --- | --- | --- |
| `administration/scim-and-org-api.md` | `fadc9983837626d00c22bb4d9b945878e2fbf432` | 1 / 3 | 逐项检查 19 处上游端点/动词引用在中文稿中的覆盖；Okta 双应用、NONE 角色覆盖、账号密码与 SSO 条件已写明。修正中文 RBAC 入口。 | `71cd608` |
| `administration/audit-logs.md` | `2b1aeb21f33eaae59e05405cdb7f35319fdc35d5` | 0 / 0 | 核对 28 个审计资源及对应动作（全角分隔符归一化后逐项匹配），权限 auditLogs:read、修改前后 JSON 状态和操作主体已说明。 | 本轮无需改动 |
| `api-and-data-platform/features/cli.md` | `6fae03ae84aac9a95c269ce498f94e76f55ec712` | 5 / 4 | 检查新旧 CLI 包名迁移、Basic Auth 环境变量、地域、错误退出码 2–6；清除迁移说明重复文字。部分命令已合并排版。 | `9888223` |
| `prompt-management/features/guaranteed-availability.md` | `36ddf047996b512f6092810480ae76337a187010` | 4 / 4 | 发现官方原样示例/中文稿在 Express 中未 await 异步预取就 app.listen；重排代码为预取成功后才开放端口，添加适用边界与 fail-start 说明。中文版示例明确标记为安全修订。 | `5e3cd38` |
| `observability/features/queuing-batching.md` | `f1cd7e9064b98a2b72bed41b9642773bf22e5105` | 8 / 8 | 核对 flushAt/flushInterval、Python flush/shutdown、JS SpanProcessor.forceFlush 与 serverless 生命周期；注释/排版中文化。 | 本轮无需改动 |
| `observability/features/masking.md` | `0133686fb47af95419e5ff07ce7dc2f2913d4b5f` | 7 / 7 | 7 组代码正文匹配；核对 mask_otel_spans、mask 的作用范围及导出副本注意事项。 | 本轮无需改动 |
| `api-and-data-platform/features/mcp-server.md` | `08b82927b28d1ce60541dca4dc9fe089ee5169c7` | 15 / 6 | 原文 15 组中多组为三种客户端×五个部署区域的重复配置，中文版仅保留各客户端配置结构并把地域 URL 汇总表格；MCP 凭据/权限边界已说明。 | 本轮无需改动 |
| `observability/features/metadata.md` | `407791626a874b9f562fcfda4d831b446608c60a` | 10 / 10 | 核对章节和 10 组示例均存在；中文注释致源代码非文本完全一致；仍未逐个运行各集成。 | 本轮无需改动 |

## 明确发现并修复的可用性问题

`prompt-management/features/guaranteed-availability.md` 原有 Express 示例在调用异步 `fetchPromptsOnStartup()` 后立即 `app.listen(3000)`，会出现预取未结束就对外服务的窗口，不能满足文字提出的“预取成功后才启动”。已重排顺序为在 Promise 成功后启动监听、失败则退出，并说明多实例缓存及部署健康检查边界。该代码**未做 Langfuse 真实环境运行验证**，不能宣称实现绝对 100% SLA。

## 抽查方法与剩余边界

- 审计日志：从官方 MDX 和中文 Markdown 提取 28 条 Resource/Action 表格并归一化全角逗号，28/28 逐条一致。
- SCIM：核对组织级 API 路由和 `/api/public/scim` 端点、Okta OIDC 登录 + 独立 SAML 预配约束及 IdP 角色覆盖风险。
- MCP：15 个官方重复地域代码围栏对应中文“地域 URL 表 + 客户端专用配置模板”；此为有意合并，不把 6/15 当作内容丢失。
- Python/TS 代码没有执行；尚未核对联网实际响应、外部 IdP 配置权限或敏感数据的多 Exporter 行为。

**本批结论：指定 8 篇的这些定点缺口已核销；不是 8 篇整篇全文 PASS。** 全站内容验收状态仍应以现有 Issue #2 的明确范围与未完成项目为准。继续禁止部署。
