---
title: Langfuse MCP Server
description: 为 Claude Code、Codex、Cursor、Pi 等客户端接入需要身份认证的 Langfuse 数据平台 MCP 服务。
---
# Langfuse MCP Server

Langfuse 内置符合 [Model Context Protocol](https://modelcontextprotocol.io) 规范的 MCP Server，让 AI 助手和 Agent 可以用程序查询、管理 Langfuse 项目数据。

反馈和新工具提议可提交至[官方讨论](https://github.com/orgs/langfuse/discussions/10605)。

::: info
如果编程 Agent 可以安装 CLI 并执行 Bash，官方更推荐[Langfuse Agent Skill](/official/api-and-data-platform/features/agent-skill)而不是 MCP Server。

这里介绍的是**需要身份认证的数据平台 MCP Server**。另外还有公开的[Langfuse 文档 MCP](https://langfuse.com/docs/docs-mcp)，用途不同。
:::

## MCP 参考文档

[MCP Reference](https://mcp.reference.langfuse.com) 是服务器列表、安装配置、工具、输入 Schema 和请求示例的权威实时来源。

**默认同时提供读写工具**。如果只需要查询，必须在 MCP 客户端通过工具 Allowlist 限制写操作，避免 Agent 意外更改数据。

## 配置连接

Langfuse MCP Server 是无状态服务，每对 API Key 作用于一个项目。使用 **`streamableHttp`** 传输、通过 Authorization Header 实施 Basic Auth。

### 各地域服务地址

| 区域 | MCP URL |
| --- | --- |
| Cloud EU | `https://cloud.langfuse.com/api/public/mcp` |
| Cloud US | `https://us.cloud.langfuse.com/api/public/mcp` |
| Cloud Japan | `https://jp.cloud.langfuse.com/api/public/mcp` |
| HIPAA US | `https://hipaa.cloud.langfuse.com/api/public/mcp` |
| 自托管 | `https://your-domain.com/api/public/mcp` |

自托管反向代理环境，尤其是 Langfuse Assistant Worker 经 Docker/Kubernetes 内部域名访问 MCP 时，需要保留公网 `Host` 头，或者将额外的确切主机名/Origin 以逗号分隔写入 `LANGFUSE_MCP_ALLOWED_HOSTS`；否则可能返回 `403`。参阅[自托管说明](https://langfuse.com/self-hosting/configuration/langfuse-assistant#langfuse-mcp)。

### 1. 获取 Authorization Header

1. 在项目设置中创建或复制**项目级 API Key**：Public Key 为 `pk-lf-...`，Secret Key 为 `sk-lf-...`。
2. 使用 Base64 编码：

```bash
echo -n "pk-lf-your-public-key:sk-lf-your-secret-key" | base64
```

后续示例中的 `{your-base64-token}` 即上一步的输出。

### 2. 配置 MCP 客户端

所有客户端都使用上表相同的区域 URL、`Authorization: Basic {your-base64-token}`。

#### Claude Code

通过一条命令添加：

```bash
# EU
claude mcp add --transport http langfuse https://cloud.langfuse.com/api/public/mcp \
  --header "Authorization: Basic {your-base64-token}"

# US
claude mcp add --transport http langfuse https://us.cloud.langfuse.com/api/public/mcp \
  --header "Authorization: Basic {your-base64-token}"

# Japan
claude mcp add --transport http langfuse https://jp.cloud.langfuse.com/api/public/mcp \
  --header "Authorization: Basic {your-base64-token}"

# HIPAA
claude mcp add --transport http langfuse https://hipaa.cloud.langfuse.com/api/public/mcp \
  --header "Authorization: Basic {your-base64-token}"

# 自托管（推荐 HTTPS）
claude mcp add --transport http langfuse https://your-domain.com/api/public/mcp \
  --header "Authorization: Basic {your-base64-token}"

# 本地开发
claude mcp add --transport http langfuse http://localhost:3000/api/public/mcp \
  --header "Authorization: Basic {your-base64-token}"
```

可以询问 Claude Code “list all prompts in the project” 来验证。正确连接时应使用 `listPrompts` 工具返回列表。

#### Codex

编辑 `~/.codex/config.toml`：

```toml
[mcp_servers.langfuse]
url = "https://cloud.langfuse.com/api/public/mcp"
http_headers = { "Authorization" = "Basic {your-base64-token}" }
```

根据地域替换 URL：US、Japan、HIPAA、自托管地址见上表。重启 Codex 后执行 `codex mcp list`，再询问“list all prompts in the project”，确认调用 `listPrompts`。

#### Cursor

1. 打开 Cursor Settings（`Cmd/Ctrl + Shift + J`）。
2. 进入 **Tools & Integrations**。
3. 点击 **Add Custom MCP**。
4. 添加 MCP 配置：

```json
{
  "mcp": {
    "servers": {
      "langfuse": {
        "url": "https://cloud.langfuse.com/api/public/mcp",
        "headers": {
          "Authorization": "Basic {your-base64-token}"
        }
      }
    }
  }
}
```

将 URL 替换为目标地区或自托管地址，保存并重启 Cursor。MCP 设置中绿色指示标志表示服务器活跃。

#### Pi Agent

[Pi](https://pi.dev) 默认不内置 MCP，需要社区维护的 [pi-mcp-adapter](https://github.com/nicobailon/pi-mcp-adapter)，通过一个 Proxy Tool 暴露 MCP 工具。

安装并重启：

```bash
pi install npm:pi-mcp-adapter
```

编辑 `~/.pi/agent/mcp.json`：

```json
{
  "mcpServers": {
    "langfuse": {
      "url": "https://cloud.langfuse.com/api/public/mcp",
      "headers": {
        "Authorization": "Basic {your-base64-token}"
      }
    }
  }
}
```

同样可用上表任一地域 URL，重启 Pi，尝试让它“list all prompts in the project”。Pi 将通过 MCP Proxy 使用 `listPrompts`。

#### 其他 MCP 客户端

- Transport：`streamableHttp`
- 认证：Authorization Header 中的 Basic Auth，格式为 `Authorization: Basic {your-base64-token}`。

## 各 MCP 客户端配置核对

官方英文页对 Claude Code、Codex、Cursor、Pi Agent 以及其他 MCP 客户端使用多个地域 Tab。中文版把地域 URL 汇总在前面的表中；下列核对表明确各客户端的**配置结构和验证步骤**，避免误把不同客户端格式混用。

| 客户端 | 接入方式或配置路径 | 认证字段 | 验证方式 |
| --- | --- | --- | --- |
| Claude Code | `claude mcp add --transport http ... --header ...` | 命令行 `--header "Authorization: Basic ..."` | 让 Agent 调用 `listPrompts` |
| Codex | `~/.codex/config.toml` 中的 `[mcp_servers.langfuse]` | `http_headers = { "Authorization" = "Basic ..." }` | 重启后运行 `codex mcp list`，再执行 `listPrompts` |
| Cursor | Settings → Tools & Integrations → Add Custom MCP → `mcp.json` | `mcp.servers.langfuse.headers.Authorization` | 保存、重启后检查 MCP 状态 |
| Pi Agent | 安装社区 `pi-mcp-adapter`；`~/.pi/agent/mcp.json` | `mcpServers.langfuse.headers.Authorization` | 重启 Pi，经 MCP Proxy 调用 `listPrompts` |
| 其他 MCP 客户端 | HTTP MCP Server，Transport 为 `streamableHttp` | HTTP Header `Authorization: Basic ...` | 通过客户端读取工具清单并执行只读查询 |

所有客户端的端点路径都是 `/api/public/mcp`，须按 Langfuse 项目所在区域替换主机名。Basic Token 是 **Base64 编码的 `publicKey:secretKey`**，编码**不是加密**；不要将真实 Token 提交到公开配置仓库、截图或日志中。

::: warning 读写工具与凭据权限
MCP Server 默认可以暴露读写工具。用于检索/排查的 Agent 应优先在客户端配置工具 Allowlist，仅开放必要的只读工具；任何写操作都应经过单独权限审核。项目密钥只应保存在可信环境，示例中的占位符绝不可当作真实凭据。
:::

### 配置完成后的核验清单

- [ ] 选择正确区域 URL、项目级 Public Key 与 Secret Key，并验证 Basic Authorization Header。
- [ ] 确保客户端使用 `streamableHttp` 或其 HTTP MCP 传输选项，而不是误配到 Stdio。
- [ ] Codex、Cursor、Pi 分别采用 TOML、`mcp.servers` JSON、`mcpServers` JSON 的正确结构。
- [ ] 重启客户端并通过 `listPrompts` 确认连接成功。
- [ ] 对只需查询的 Agent 禁用不需要的写工具；自托管出现 Host/Origin `403` 时检查反向代理和 `LANGFUSE_MCP_ALLOWED_HOSTS`。

## 筛选逻辑根 Observation

Observation 工具区分**逻辑根**与**物理父节点**：

- `listObservations` 支持可选布尔筛选 `isRootObservation`。设为 `true`，匹配没有物理父节点的 Observation，或者被 SDK 明确标记为应用根节点的 Observation。
- 物理父节点筛选独立存在。即使 Observation 有物理父节点，只要被标记为应用根节点，也可能满足 `isRootObservation: true`。
- `isRootObservation` 包含在 `listObservations` 默认返回字段中。
- `getObservationFilterValues` 支持以 `isRootObservation` 作为列查询筛选值，因此可与其他条件组合。

完整 Schema 与工具使用示例参阅 [MCP Reference](https://mcp.reference.langfuse.com)。

## 反馈

欢迎在[GitHub Discussions](https://github.com/orgs/langfuse/discussions/10605)分享体验、建议和用例。

## 相关资料

- [MCP Reference](https://mcp.reference.langfuse.com)
- [Agentic Prompt Management](/official/prompt-management/features/agentic-access)
- [提示词管理概览](/official/prompt-management/overview)
- [Public API](/official/api-and-data-platform/features/public-api)
- [Agent Skill](/official/api-and-data-platform/features/agent-skill)
- [Langfuse for Agents](https://langfuse.com/agents)

---

原文：[Langfuse MCP Server](https://langfuse.com/docs/api-and-data-platform/features/mcp-server) · 非官方中文翻译；地域配置与客户端步骤已覆盖，重复配置合并为可替换地址。
