---
title: 筛选搜索栏
description: 使用字段、运算符、通配符和全文搜索快速筛选 Trace 与 Observation。
---
# 筛选搜索栏

筛选搜索栏让你在一行文本中筛选 Observation 和 Trace 表格，无需反复操作侧边栏。系统将查询解析为与侧边栏相同的条件，在输入时自动补全字段和值，并把完整查询保存到 URL，方便分享精确的视图。

[观看视频演示](https://static.langfuse.com/docs-videos/2026-06-19-filter-search-bar.mp4)。

```text
level:ERROR type:TOOL environment:production latency:>2 name:*checkout*
```

::: info
此功能基于 [Langfuse v4](/official/v4) 数据模型。Cloud 用户需要启用 v4 预览；自托管环境需[升级到 v4](https://langfuse.com/self-hosting/upgrade/upgrade-guides/upgrade-v3-to-v4)。
:::

搜索栏与现有侧边栏筛选器、时间范围选择器并存，且共享同一筛选状态：输入的条件会显示在侧边栏中，反之亦然。输入字段名会出现运算符和已观察到的值，按 Enter 应用。

筛选完成后，可以直接[绘制图表](/official/observability/features/events-table-charts)，上方的 [Pulse](/official/observability/features/pulse) 也会使用相同筛选条件展示时间异常。

## 查询语法

查询由若干 `field:value` 条件组成，条件之间默认使用 **AND**。

### 字段和值

例如 `level:ERROR`、`environment:production`、`user:alice`。输入字段名时会提示已观察到的字段值。

### 比较运算符

支持 `latency:>2`、`cost:>=0.01`、`startTime:>2026-06-01`。对数字或日期字段可使用 `>`、`>=`、`<` 和 `<=`。

### 通配符与精确匹配

文本字段支持星号通配符：

| 查询 | 含义 |
| --- | --- |
| `name:*checkout*` | 包含 checkout |
| `name:checkout*` | 以 checkout 开头 |
| `name:*checkout` | 以 checkout 结尾 |
| `name:checkout` | 普通词，默认包含匹配 |
| `name:=checkout` | 精确匹配 |

### 排除条件

在条件前加 `-`，例如 `-environment:production`。

### 任一值与所有值

- `level:(ERROR OR WARNING)`：匹配其中一个值。
- `tags:(billing AND urgent)`：匹配数组字段中的全部指定值。

### 元数据与评分

使用点路径查询：

```text
metadata.region:eu
scores.accuracy:>0.8
scores.is_hallucination:false
scores.helpfulness:positive
```

`scores.*` 按名称匹配 Score，不区分其归属层级，因此可以查询 Observation、Trace、Session 和实验级别评分。支持数值、类别和布尔值。

如果键包含空格或特殊字符，使用引号：

```text
scores."Answer Relevance":>=0.9
metadata."my key":eu
```

### 空值检查

`has:endTime` 查询字段已设置的记录；`-has:endTime` 查询字段为 null 的记录。

### 全文搜索

不带字段的词或短语会搜索 ID、名称、输入和输出：

```text
refund failed
```

可以使用 `input:`、`output:` 指定范围，如 `output:"refund failed"`。搜索不区分大小写，按完整单词匹配：`error` 不会匹配 `errors`，多个单词需构成连续短语。详见[全文搜索](/official/observability/features/full-text-search)。

## 字段别名

| 别名 | 对应字段 |
| --- | --- |
| `env` | 环境 |
| `user` | 用户 ID |
| `session` | Session ID |
| `model` | 模型名称 |
| `prompt` | 提示词名称 |
| `cost` | 总成本 |
| `tokens` | 总 Token |
| `tags` | Trace 标签 |
| `status` | 状态消息 |
| `ttft` | 首 Token 延迟 |
| `tps` | 每秒 Token 数 |
| `dataset` | 实验数据集 |
| `experiment` | 实验名称 |

## Ask AI

不了解项目字段名时，可以点击 **Ask AI**，用自然语言描述筛选需求，由 AI 生成可编辑的查询条件。

::: info
Ask AI 仍处于 Beta 阶段，默认关闭，须由组织 Owner 或 Admin [启用](https://langfuse.com/security/ai-features)。自托管使用与 Langfuse Assistant 相同的模型实例，参阅[部署说明](https://langfuse.com/self-hosting/configuration/langfuse-assistant)。
:::

Ask AI 会利用客户端已加载的列、值和元数据键的简要快照，按实际项目结构生成条件。搜索栏为空时从零生成，存在条件时可以添加、修改或移除。它只允许输出受支持的语法，无法识别的列会在应用前被移除；筛选仍使用与侧边栏相同的机制，可以用浏览器返回键撤销。

## 分享和保存查询

完整条件保存在 URL 中，分享链接即可复现相同的筛选视图。由于搜索栏与侧边栏使用相同数据结构，原有的 Saved Views 无需修改。

## 保留词

`!` 以及小写 `and`、`or`、`not` 尚不支持作为运算符，会被标记。排除条件用 `-field:value`，同字段多值用 `field:(A OR B)`。要将保留词作为普通文本搜索，使用引号，如 `"or"`。

## 未完成的条件

单独输入 `type`、`level`、`env` 等字段名还不是有效筛选，完成 `type:TOOL` 等表达式后才会应用。要按这些文字本身搜索，可写 `"type"`。

## 筛选值数量

侧边栏各筛选值旁的计数根据**当前已经启用的所有筛选条件**计算，而不只是时间范围。例如筛选 `environment:production` 后，Level 的数量也会按生产环境重新计算。

官方动态 GitHub Discussions 列表未迁移。

---

原文：[Filter Search Bar](https://langfuse.com/docs/observability/features/filter-search-bar) · 非官方中文翻译。
