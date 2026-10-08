---
title: 身份认证与 SSO
description: Langfuse 邮箱密码、第三方登录和 Enterprise OIDC SSO 的设置指南。
---
# 身份认证与 SSO

Langfuse 默认支持邮箱/密码、Google、GitHub、Microsoft 第三方登录，以及 ClickHouse Cloud 登录。需要更严格安全管理时，还可通过 OIDC 配置 Enterprise SSO，例如 Okta、Authentik、GitHub Enterprise、OneLogin、Azure AD、Keycloak、JumpCloud 等。

授权机制见 [RBAC](https://langfuse.com/docs/administration/rbac)；自托管配置参阅[自托管认证与 SSO](https://langfuse.com/self-hosting/security/authentication-and-sso)。

## 邮箱和密码

默认采用邮箱和密码登录，并执行标准密码复杂度要求。通过第三方账号注册的用户，也可以通过登录页面的“Reset password”链接设置密码。

## 社交及其他提供商登录

支持 Google、GitHub、Microsoft（Azure AD / Entra ID）、ClickHouse Cloud。

出于安全考虑，Langfuse 不支持在 Google、GitHub 和 Microsoft 登录之间切换，也不支持先通过邮箱密码注册后再改用这些第三方登录方式。**ClickHouse Cloud 是例外**，支持显式账号关联。

### ClickHouse Cloud 登录

Langfuse Cloud 全部区域均支持使用 [ClickHouse Cloud](https://clickhouse.com/cloud)账号登录。

- **账号关联**：如果 ClickHouse Cloud 登录邮箱已存在 Langfuse 账号，系统会关联两个账号，原项目、成员关系和 API Key 都保留。
- **操作**：在登录页点击 **Sign in with ClickHouse Cloud**，使用 ClickHouse Cloud 账号认证。

## Enterprise SSO 与强制登录

Enterprise SSO 仅支持 **OIDC**，不支持 SAML。可用性：Hobby、Core 不提供；Pro 需 Team Add-on；Enterprise 和自托管支持。

- **迁移**：启用 Enterprise SSO 后，已使用邮箱密码或社交登录的用户会自动迁移到该 SSO 提供商。
- **授权**：SSO 不会自动给新用户分配组织角色。应在 UI 的 Settings → Members 邀请，或使用 [SCIM API](/official/administration/scim-and-org-api)预配。
- **登录**：输入邮箱并点击 Continue，然后跳转到对应的 Enterprise SSO 提供商认证。

![SSO 登录流程](https://langfuse.com/images/security/sso-signin.png)

## 在 Langfuse Cloud 配置 Enterprise SSO

组织管理员可在 **Organization Settings → SSO** 完成。

### 1. 验证域名

1. 打开 **Organization Settings → SSO**。
2. 在 **Verify Domain** 区域点击 **Add Domain**，输入要验证的域名。
3. 将 Langfuse 提供的 DNS TXT 记录添加到 DNS 服务商。
4. 等待 DNS 传播，点击 **Verify**。

::: info
必须先完成域名验证，才能配置 SSO。这可确保只有实际控制域名的组织能为它配置 SSO。

若验证失败，核对 TXT 记录名称和值是否完全一致，移除外围引号，等待传播后再试。大多数 DNS 服务商需要几分钟，极端情况下可达 **24 小时**。
:::

### 2. 配置 SSO

1. 在 **SSO Configuration** 中，对已验证域名点击 **Configure SSO**。
2. 复制 Langfuse 提供的 Callback URL，将其加入 IdP 应用的重定向/回调允许列表。
3. 填写 IdP Issuer URL、Client ID、Client Secret 并保存。
4. 使用已验证域名中的用户测试登录。

::: warning
GitHub 和 GitHub Enterprise 不提供标准 OIDC Discovery 端点，Langfuse 无法在配置时预验证 Issuer URL。必须仔细检查 Issuer 和 Callback URL，并在保存后立即测试登录。
:::

## FAQ 与防止锁定

### 开启强制 SSO 后如何避免锁定自己？

启用强制 SSO **不会结束已有登录会话**。可保留当前浏览器会话，在独立浏览器或隐身窗口测试新 SSO。若失败，使用仍登录的会话撤销配置，避免影响其他用户。

### 支持 Break-Glass 应急账号吗？

当前**不支持**在被强制 SSO 的域名下设置例外账号。一旦启用强制 SSO，该域名的账号无法继续使用邮箱密码登录。相关功能提议见[官方讨论](https://github.com/orgs/langfuse/discussions/14532)。

### IdP 的 Email Claim 与验证域名不一致怎么办？

每个 SSO 域名必须由单个组织独占，不能使用承包商、咨询公司等共享域名。登录身份邮箱必须匹配已验证域名，以防止账号接管。

部分 IdP（尤其 Azure AD / Entra）返回的 `email` 域名可能不同于已验证域名。对于 Azure AD / Entra，如果 `preferred_username` 或 `upn` 是配置域名下的有效邮箱，Langfuse 可以回退使用；没有任何匹配值则拒绝登录。

应在 IdP 中配置正确声明，或额外验证实际拥有的域名，确保 Langfuse 使用的邮箱归属于已验证域名（如 `user@external.yourdomain.com`），而非外部共享域名。

## 提供商指南：Okta

### 第 1 步：在 Okta 创建 OIDC 应用

1. 登录 Okta Admin Console。
2. 进入 **Applications → Applications**，点击 **Create App Integration**。
3. Sign-in Method 选择 **OIDC - OpenID Connect**。
4. Application Type 选择 **Web Application**，点击 Next。

### 第 2 步：配置应用

1. 设置应用名称（例如 `Langfuse`）。
2. **Sign-in redirect URI** 设置为 `https://<langfuse-url>/api/auth/callback/<domain>.okta`。例如 `https://cloud.langfuse.com/api/auth/callback/example.com.okta`。
3. 按需设置 Sign-out redirect URI。
4. Langfuse 认证时不使用 Scope。
5. 在 **Assignments** 中选择分配方式，点击 Save。

### 第 3 步：获取认证信息

1. 在应用的 **General** 页复制 **Client ID** 和 **Client Secret**。
2. 记录 Okta **Issuer URL**，例如 `https://example.okta.com`。

### 第 4 步：验证 Langfuse 中的域名

1. 进入 **Organization Settings → SSO**。
2. 点击 **Add Domain**，输入应使用 Okta 的域名。
3. 将 Langfuse 提供的 DNS TXT 记录加入 DNS。
4. 传播完成后点击 Verify。

### 第 5 步：在 Langfuse 配置 SSO

1. 在 **SSO Configuration** 找到已验证域名，点击 Configure SSO。
2. 提供商选择 **Okta**。
3. 将 Langfuse 显示的 Callback URL 加入 Okta 的 Sign-in redirect URI 允许列表。
4. 填写 Issuer URL、Client ID、Client Secret，保存。

### 第 6 步：分配用户

在 Okta 的 Langfuse 应用 **Assignments** 中分配获准使用的用户或用户组。

### IdP 发起的 SSO

Langfuse 支持直接从 Okta 发起登录（IdP-initiated SSO）。

[观看流程视频](https://static.langfuse.com/docs-videos/idp-initiated-sign-in.mp4)。

将 Okta 配置为重定向至：

```text
https://cloud.langfuse.com/auth/sso-initiate?provider=<PROVIDER>
```

`<PROVIDER>` 应替换为 Callback URL 的末段，如 `example.com.okta`。Okta 中选择 **Redirect to app to initiate login (OIDC Compliant)**。

### SCIM 用户预配

Okta 不支持在自定义 OIDC 应用中直接启用 SCIM，因此除了上述 OIDC 应用，还需要一个专门用于 SCIM 的**第二个 Okta 应用**。参阅 [Okta SCIM 配置](/official/administration/scim-and-org-api)。

---

原文：[Authentication & SSO](https://langfuse.com/docs/administration/authentication-and-sso) · 非官方中文翻译。
