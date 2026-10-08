---
title: SCIM 与组织 API
description: 使用组织级 API Key、SCIM 和 Okta 自动管理项目、成员及用户配置。
---
# SCIM 与组织级 API 路由

该功能适用于 **Enterprise** 和自托管 **Enterprise Edition**；Hobby、Core、Pro 不提供。

组织级 API Key 可以管理项目、用户、项目及组织成员关系，详见[角色权限文档](/official/administration/rbac)。可以使用这些接口将 Langfuse 组织的管理工作自动化。本页包含组织管理接口、符合 SCIM 的用户预配，以及 Okta 配置指南。

::: info
自托管部署还可以使用 [Instance Management API](https://langfuse.com/self-hosting/administration/instance-management-api)管理单个实例中的多个组织。
:::

## 认证

通过 [HTTP Basic Auth](https://en.wikipedia.org/wiki/Basic_access_authentication) 认证。组织级 API Key 可从 Langfuse UI 的 Organization Settings 创建，也可使用 Instance Management API。

```bash
curl -u public-key:secret-key https://cloud.langfuse.com/api/public/projects/{projectId}/apiKeys
```

## 组织管理 API

以下端点需要组织级 API Key：

```http
POST /api/public/projects
PUT /api/public/projects/{projectId}
DELETE /api/public/projects/{projectId}
GET /api/public/projects/{projectId}/apiKeys
POST /api/public/projects/{projectId}/apiKeys
DELETE /api/public/projects/{projectId}/apiKeys/{apiKeyId}
PUT /api/public/organizations/memberships
GET /api/public/organizations/memberships
PUT /api/public/projects/{projectId}/memberships
DELETE /api/public/projects/{projectId}/memberships
```

详细参数见[公开 API 参考](https://api.reference.langfuse.com)。

## 使用 SCIM 管理用户

Langfuse 实现了符合 [SCIM](https://datatracker.ietf.org/doc/html/rfc7642) 的端点，基础路径为 `/api/public/scim`。

使用 `POST /Users` 可以在邮箱尚不存在时创建新用户，并把用户加入组织。默认组织角色为 `NONE`；如请求携带 `roles`，则使用该属性指定的角色。之后可通过组织或项目 Membership API 更新角色。

::: warning
SCIM 取消预配后再次预配用户时（例如初次启用 SCIM、身份提供商同步），组织角色可能被 SCIM `roles` 覆盖，默认值是 `NONE`。启用 SCIM 之前，请在 IdP 中正确配置 `roles`，尤其是组织 Owner 的 `OWNER`，避免意外降权。
:::

使用 `DELETE /Users/{id}` 可将用户从组织移除，**不会删除用户账号本身**。

SCIM **不会设置用户密码**。为兼容 Okta，即使请求中含有 `password` 占位字段，Langfuse 也会忽略。用户应通过 SSO 登录，或者使用验证邮箱所有权的“Forgot password”流程自行设置密码。

预配用户通过 SSO 登录时：

- **Cloud**：配置 [Enterprise SSO](https://langfuse.com/security/auth)。
- **自托管**：为 SSO 提供商配置 `AUTH_<PROVIDER>_ALLOW_ACCOUNT_LINKING`，保证用户账号正确关联，详见[认证配置](https://langfuse.com/self-hosting/security/authentication-and-sso#additional-configuration)。

支持的 SCIM 端点：

```http
GET /ServiceProviderConfig
GET /ResourceTypes
GET /Schemas
GET /Users
POST /Users
GET /Users/{id}
DELETE /Users/{id}
```

## SCIM 厂商指南：Okta

::: info
**Okta 需要两个独立应用。** Okta 不支持直接对[自定义 OIDC 应用启用 SCIM](https://support.okta.com/help/s/article/configure-scim-for-a-custom-oidc-app?language=en_US)。

应分别配置：

1. **OIDC 应用**：用于实际 SSO 登录，参阅[Okta SSO](https://langfuse.com/docs/administration/authentication-and-sso#okta)。
2. **SAML 应用**：专门用于 SCIM 预配。该 SAML 应用的 SSO 配置无需实际生效，登录仍通过 OIDC 应用完成。
:::

[观看 Okta SCIM 配置演示](https://static.langfuse.com/docs-videos/2025-08-06-okta-scim-setup.mov.mp4)。

Langfuse 支持 **SCIM 2.0**。在 OIDC 应用配置完成后，创建第二个 Okta 应用。

### 1. 创建用于 SCIM 的 SAML 应用

1. 登录 Okta 管理控制台，进入 **Applications → Create App Integration**。
2. 选择 **SAML 2.0**，点击 Next。
3. 使用自托管域名或 Langfuse Cloud 域名填写：
   - **App name**：`Langfuse SCIM`
   - **Single sign-on URL**：`https://your-langfuse-domain.com`（只作为占位，实际认证使用 OIDC）
   - **Audience URI**：`langfuse`
4. 点击 Next、Finish。

### 2. 配置 SCIM Connection

1. 在 **General** 页将 Provisioning 设置为 **SCIM**。
2. 在 **Provisioning** 页编辑 **SCIM Connection**。
3. 填写：
   - **SCIM connector base URL**：`https://your-langfuse-domain.com/api/public/scim`
   - **Unique identifier field for users**：`userName`
   - **Supported provisioning actions**：`Import new Users and Profile Updates`、`Push New Users`、`Push Profile Updates`
   - **Basic Auth Username**：组织设置中的 Public Key
   - **Basic Auth Password**：组织设置中的 Secret Key
4. 测试 API 凭据，然后 Save。

### 3. 启用用户预配

在 **Provisioning** 中打开：

- **Create Users**
- **Update User Attributes**
- **Deactivate Users**

点击 Save。

### 4. 添加默认权限（可选）

在 **Provisioning → Profile Editor** 新增 `roles` 属性：

| 设置 | 值 |
| --- | --- |
| Data type | `string array` |
| Display Name | `Langfuse Roles` |
| Variable Name | `roles` |
| External Name | `roles` |
| External Namespace | `urn:ietf:params:scim:schemas:core:2.0:User` |
| Attribute members | `NONE`、`VIEWER`、`MEMBER`、`ADMIN`、`OWNER` |
| Attribute type | `Personal` |

随后在 Provisioning 中修改该属性的默认值。可以为应用的所有用户指定默认角色，也可以在个人分配中覆盖。

### 5. 分配用户

1. 进入 **Assignments**。
2. 点击 **Assign → Assign to People**。
3. 选择需要加入 Langfuse SCIM 应用的用户，必要时覆盖角色。
4. 点击 Done、Save。
5. 用户应出现在 Langfuse 的组织成员列表中。

## 疑难排查

**预配后用户是 NONE / VIEWER，而不是预期角色：**通常因为 `roles` 属性的 Attribute type 配成了 `Group`，应设为 `Personal`。

**启用 SCIM 后用户角色丢失：**初次同步时，如果账号被取消预配并再次预配，Langfuse 会使用 IdP 中的 `roles` 覆盖原角色；未配置时默认为 `NONE`。启用预配前，应在 IdP 中正确设置角色，包括组织所有者的 `OWNER`。

---

原文：[SCIM and Org API](https://langfuse.com/docs/administration/scim-and-org-api) · 非官方中文翻译。
