---
title: 审计日志
description: 跟踪组织与项目内的重要操作，支持安全与合规审查。
---
# 审计日志

Langfuse 的审计日志系统记录系统中的重要活动：谁执行了什么操作、何时发生，以及发生了哪些数据变化。它适用于企业安全、合规和事件调查。

官方标注该功能适用于 Enterprise 和符合条件的自托管 Enterprise 版本。

## 什么是审计日志？

审计日志是 Langfuse 组织和项目中重要操作的**不可变记录**，包括：

- **谁**：发起操作的用户或 API Key；
- **做什么**：创建、更新或删除等具体行为；
- **何时**：精确时间戳；
- **何处**：所属组织和项目；
- **详情**：修改前后的完整资源状态。

这些记录为安全监控、合规报告和取证分析提供审计依据。

## 查看审计日志

Enterprise 版的审计日志查看器支持：

![审计日志界面](https://langfuse.com/images/changelog/2025-01-21-audit-logs.png)

### 访问控制

- 用户需要具备 `auditLogs:read` 权限；
- 通常由项目 OWNER 和 ADMIN 访问；
- 具体权限受 Langfuse 基于角色的访问控制约束。

### 筛选和导航

- 按时间段查看日志；
- 按项目筛选活动；
- 使用分页浏览大型审计记录集合。

## 导出审计日志

可以直接从 UI 导出审计日志，用于外部分析或备份：

1. 打开审计日志表格。
2. 点击右上角的导出按钮。

## 事件类型和记录范围

### 可审计资源

| 资源 | 记录的操作 |
| --- | --- |
| Annotation Queue | create、delete、update |
| Annotation Queue Item | complete、create、delete |
| API Key | create、delete、update |
| Batch Action | create、delete |
| Batch Export | create |
| Blob Storage Integration | update |
| Comment | create、delete |
| Dataset | create、delete、update |
| Dataset Item | create、delete、update |
| Dataset Run | delete |
| Evaluation Template | create |
| Job | create、delete、update |
| LLM API Key | create、delete |
| Membership | create、delete |
| Membership Invitation | create、delete |
| Model | create、delete、update |
| Organization | create、delete、update |
| Organization Membership | create、delete、update |
| PostHog Integration | delete、update |
| Project | create、delete、transfer、update |
| Project Membership | create、delete、update |
| Prompt | create、delete、promote、setLabel、update、updateTags |
| Prompt Protected Label | create |
| Score | create、delete、update |
| Score Config | create、update |
| Session | bookmark、publish |
| Stripe Checkout Session | create |
| Trace | bookmark、delete、publish、updateTags |

### 修改前后状态

对于更新操作，Langfuse 会记录：

- **Before State**：修改前的完整资源状态；
- **After State**：修改后的完整资源状态。

这些状态以 JSON 格式保存，以提供完整的变更上下文。

### 操作来源

审计日志区分两类操作主体：

- **USER**：认证用户通过网页界面执行；
- **API_KEY**：通过 API Key 发起的程序化操作。

每条记录还包含相应用户 ID 或 API Key ID、组织 ID，以及操作发生时用户的组织和项目角色。

官方页面的 GitHub Discussions 是动态模块，本站未复制。

---

原文：[Audit Logs](https://langfuse.com/docs/administration/audit-logs) · 非官方中文翻译。
