---
title: 评论
description: 在 Trace、Observation、Session 和 Prompt 上添加评论，协作排查问题。
---
# 评论

评论功能允许团队直接在 Langfuse 的 Trace、Observation、Session 和 Prompt 上添加上下文说明和讨论。你可以用它：

- 标记 Trace 中的问题或异常；
- 分享对特定模型输出的见解；
- 记录边界情况与调试备注；
- 协作改进提示词；
- 在开发和审查阶段留下反馈。

![带 @ 提及和表情回应的评论](https://langfuse.com/images/changelog/2025-10-29-comment-mentions.png)

## 支持的对象

- **Trace**：讨论完整执行流程；
- **Observation**：为某次 LLM 调用、工具调用等具体步骤添加备注；
- **Session**：讨论用户交互模式；
- **Prompt**：针对提示词版本与改进开展协作。

## 添加评论

### 通过 Langfuse 界面

每类支持的对象页面都有评论按钮。按钮显示当前评论数量（超过 99 条时显示 `99+`）；没有读取权限时会被禁用；可查看或创建评论时处于可用状态。

点击按钮会打开侧边抽屉，其中包括：

1. **评论线程**：按时间顺序显示已有评论；
2. **编辑器**：有写入权限时可创建新评论；
3. **Markdown**：支持基础 Markdown 格式；
4. **@ 提及**：在评论中提及团队成员；
5. **表情回应**：使用 Emoji 对评论作出回应。

::: info
评论作者只能删除自己的评论。项目管理员也不能通过 UI 删除其他用户的评论。
:::

### 通过 API

Comments API 支持以编程方式创建和获取评论，使用 Langfuse 标准 API 方式：

```http
GET /api/public/comments
GET /api/public/comments/{commentId}
POST /api/public/comments
```

参阅[评论 API 参考](https://api.reference.langfuse.com/#tag/comments/post/api/public/comments)。

## @ 提及

使用 `@mentions` 可以通知团队成员关注某条 Trace、Observation 或具体问题。

### 如何提及成员

1. 在评论输入框中键入 `@`；
2. 自动补全菜单列出项目成员；
3. 选择成员，或继续输入筛选；
4. 系统将提及插入为可点击标记。

### 邮件通知

被提及的成员会收到含评论内容及上下文的邮件，邮件中也包含指向对应对象（Trace、Observation、Session 或 Prompt）的链接。每位成员可按项目配置通知偏好。

### 管理通知偏好

在项目设置中启用或禁用提及通知；设置适用于该项目未来的所有提及。

::: info
只有当前项目成员可以被提及。自动补全列表也只会显示有权访问该项目的成员。
:::

## 表情回应

将鼠标悬停在评论上，点击回应按钮并选择 Emoji，即可添加回应。回应会显示在评论旁，并关联回应者姓名。再次点击自己添加过的回应可将其移除。

表情回应有利于在无需额外回复的情况下快速表示确认、赞同或感谢。

## 对特定文本发表评论

你还可以在 Trace 或 Observation 的输入、输出或元数据中，针对选中的文本发表评论，类似 Google Docs：

1. 切换到 Trace 或 Observation 的 **JSON Beta** 视图；
2. 选中需要评论的文本；
3. 点击出现的评论按钮；
4. 评论会锚定到所选文本，鼠标悬停时显示。

如果创建评论后 Trace 或 Observation 的数据发生改变，该评论可能变为“已脱离锚点”状态，并显示提示，说明引用位置可能已经变化。

---

原文：[Comments](https://langfuse.com/docs/observability/features/comments) · 非官方中文翻译。
