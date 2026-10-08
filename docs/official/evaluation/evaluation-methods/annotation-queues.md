---
title: 标注队列
description: 使用 Langfuse 标注队列为 Trace、Observation、Session 组织人工评分和审核任务。
---
# 标注队列（Annotation Queues）

标注队列是一种人工[评估方法](https://langfuse.com/docs/evaluation/core-concepts#evaluation-methods)，供领域专家对 Trace、Observation 或 Session 添加[评分](https://langfuse.com/docs/evaluation/scores/overview)和评论。

[观看标注队列演示](https://static.langfuse.com/docs-videos/2025-12-19-annotation-queues.mp4)。

## 为什么使用标注队列？

- 人工检查应用输出并添加评分与评论；
- 邀请领域专家审核选定的一部分追踪；
- 添加[纠正后的输出](/official/observability/features/corrections)，记录模型本应生成的内容；
- 将 LLM-as-a-Judge 评估与人工标注对齐，通过[评分分析](https://langfuse.com/docs/evaluation/scores/score-analytics#human-vs-ai-annotation-agreement)测量一致性，并根据审核标签[校准裁判模型](https://langfuse.com/guides/llm-as-a-judge-calibration-skill)。

## 配置步骤

### 1. 创建标注队列

1. 点击 `New Queue` 创建队列。
2. 选择该队列使用的 [Score Config](https://langfuse.com/docs/evaluation/scores/data-model#score-config)。
3. 设置 `Queue name` 和可选的 `Description`。
4. 按需分配审核用户。

::: info
标注队列必须关联 Score Config，以定义标注任务使用的评分维度。详见[创建和管理评分配置](https://langfuse.com/faq/all/manage-score-configs#create-a-score-config)。
:::

### 2. 将 Trace、Observation 或 Session 加入队列

创建队列后，可以按单条或批量方式分配任务。

**批量添加：**

1. 在列表中通过复选框选择 Trace、Observation 或 Session。
2. 点击 **Actions** 下拉菜单。
3. 点击 `Add to queue`。
4. 选择目标队列。

![批量加入标注队列](https://langfuse.com/images/docs/add_multiple_items_to_queue.png)

**添加单条记录：**

1. 点击 `Annotate` 下拉菜单。
2. 选择目标队列。

![添加单条记录](https://langfuse.com/images/docs/add_to_queue.png)

### 3. 处理标注任务

队列中的每条记录对应一个标注任务：

1. 在 `Annotate` 卡片中，对指定维度进行评分。
2. 点击 `Complete + next` 完成当前任务并进入下一条，或结束队列。

## 键盘快捷键

标注队列可通过键盘完成操作，遵循“先导航，后编辑”的交互模式。在文本输入框中输入或打开对话框、下拉菜单时，快捷键会暂停生效。在队列中按 `?` 可查看快捷键提示。

| 快捷键 | 操作 |
| --- | --- |
| `→` / `←` | 下一条 / 上一条任务 |
| `↑` / `↓` | 切换评分字段，支持首尾循环 |
| `1`～`9` | 选择类别或布尔字段的第 N 个选项 |
| `Enter` | 确认当前值或打开下拉框 |
| `Esc` | 离开文本字段，返回字段导航 |
| `Cmd/Ctrl + Enter` | 完成当前任务并进入下一条 |
| `?` | 打开快捷键速查表 |

当类别字段获得焦点时，选项会显示数字标记；**Mark Completed** 按钮也会显示 `⌘↵` / `Ctrl↵` 提示。

字段级快捷键（上下方向键、数字、Enter、Esc）也能用于 Trace、Observation 和 Session 页内的标注抽屉；队列导航快捷键仅适用于处理队列时。

## 通过 API 管理标注队列

可以通过 [Annotation Queues API](https://api.reference.langfuse.com/#tag/annotationqueues/GET/api/public/annotation-queues)管理队列，以便扩展或自动化审核工作流，或者以 Langfuse 为基础构建[自定义标注工具](https://langfuse.com/blog/2025-11-25-vibe-coding-custom-annotation-ui)。

---

原文：[Annotation Queues](https://langfuse.com/docs/evaluation/evaluation-methods/annotation-queues) · 非官方中文翻译。
