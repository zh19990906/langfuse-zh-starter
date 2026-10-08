# 后续内容检查与站内引用核对（2026-10-08）

> 继续核销 Issue #2 的已有验收证据。本报告记录另外 18 篇与官方 MDX 对照的结果、代码保留情况、已修复内容。**这里的 18/18 表示这一批已执行所述范围的检查，不是 18 篇完整逐段验收 PASS**。不部署。

## 上游对照与遗留项目

| 译文路径（`docs/official/` 下） | 上游 Blob SHA | 原文 / 中文代码块 | 本轮实际核对范围 |
| --- | --- | --- | --- |
| `evaluation/experiments/experiments-via-opentelemetry.md` | `0b1ec18cde513dad1a5f4474f0104313803d3cf2` | 0 / 0 | 教程主体在官方 OTel Integration 页面，中文版已有链接 |
| `prompt-management/features/folders.md` | `bc53f16058ddae2f24a1076c70413c3b9510534e` | 0 / 0 | 对照目录语义与 Python >=3.0.2 限制及视频说明 |
| `api-and-data-platform/features/agent-skill.md` | `4d47d13e613abfbe2273481a04cedfe5b9c632e0` | 0 / 0 | Skill 结构与渐进加载说明一致；安装 UI 组件明确链接官方 |
| `prompt-management/features/agentic-access.md` | `7245d0c902d6879aeced0a630abf10c59c0ac422` | 0 / 0 | 首轮结构对照；仍需严格全文核对 |
| `observability/features/mcp-tracing.md` | `9a9a260c94edeb5b6422d2a0878e63afc1f27d2c` | 0 / 0 | 已对照 _meta / W3C Context 传递四步和实现链接 |
| `api-and-data-platform/features/query-via-sdk.md` | `a0925d49722befb1ba5a0a6f28cbde3ee5ac273d` | 15 / 15 | 15 组示例存在；7 组无法文本全等主要由注释汉化或格式调整解释，核对了两端原代码 |
| `evaluation/agentic-access.md` | `809075a9f518624368dd1f5bc61414244b76dd9c` | 0 / 0 | 初步结构对照，需逐段精校 |
| `prompt-management/features/n8n-node.md` | `2827782b1914b754c68b22963e3b31d735cdce65` | 0 / 0 | 初步结构对照，需逐段精校 |
| `api-and-data-platform/features/export-from-ui.md` | `603e7a6ecb8c69782ebc1df7bdd98ad05d50b0eb` | 0 / 0 | 初步结构对照，需逐段精校 |
| `observability/features/log-levels.md` | `f6d5d3bfaecdea5e838d99de499d978a96076f9a` | 6 / 8 | 源六组全部被中文保留，另外两组为中文补充 |
| `observability/features/sampling.md` | `1daefc3b4b74cb15582a6f734ba52c179053a0b0` | 8 / 10 | 上游八组代码均保留，另有补充示例 |
| `observability/features/trace-ids-and-distributed-tracing.md` | `c6e8396f0427d5e6ff1aff43592ef229dbd70413` | 7 / 9 | 上游七组代码均保留，另有补充示例 |
| `prompt-management/data-model.md` | `da9e9b60f90b9a9f411d4641acd362b855963cba` | 3 / 3 | Chat JSON 排版压缩、Mermaid 图已本地化；主要语义已对照 |
| `evaluation/experiments/compare-experiments.md` | `4f9570174a5b22d7d57a6ccdb4f18297abbe9696` | 0 / 0 | 已对照五节基线、失败回溯、审阅与 CI 门禁说明 |
| `observability/features/alerts.md` | `33b6ea1d6c0f8dbb5422cd33e6aeade3c6acf4df` | 1 / 1 | 告警级别、重通知、自动化和 Payload 定点核对；保留此前安全补充 |
| `metrics/features/custom-dashboards.md` | `d263b7cd12830a67e2ae9798db035ab34c9d241a` | 0 / 0 | Widget、筛选优先级、JSON 导入导出及 Unstable API 核对 |
| `api-and-data-platform/overview.md` | `ff6e80ba48e3893794a99938fcd45e44c14e0921` | 1 / 1 | Mermaid 图语义本地化；数据平台入口逐一有对应页面 |
| `evaluation/core-concepts.md` | `1d7a2a20cbeafbc2c666b923ebffb1c4cbe68196` | 0 / 0 | 对照评估循环、Rule、回填限额、告警与实验对照表 |

## 本轮实际修复

对以下四篇中仍指向 **已存在中文等价页面** 的正文引用改用本地 `/official/` 路由。带有旧英文锚点 `#v2`、`#experiments` 的链接对应改为目标中文页面实际使用的 `#observations-api-v2`、`#experiments-api`；保留尾部的官方原文引用链接。

- `api-and-data-platform/overview.md`：12 处，commit `ef25b187`。
- `api-and-data-platform/features/query-via-sdk.md`：4 处，commit `1f3b2fc`。
- `evaluation/core-concepts.md`：9 处，commit `884ca44d`。
- `prompt-management/data-model.md`：3 处，commit `271a67d4`。

合计 **28 处站内交叉引用修复**，本轮未发现丢失的可执行示例代码；部分代码片段与上游并非字节完全相同（中文注释、格式压缩、Mermaid 本地化），需按实际语义判断。

## CI 和内容验收边界

此轮 GitHub Actions [run 37770543384](https://github.com/zh19990906/langfuse-zh-starter/actions/runs/37770543384) 成功：`qa:docs` 扫描官方译文 113 页、全部 Markdown 121 页，Errors 0、锚点提示 0，VitePress Build 成功。以上属于结构和可构建性验证，**没有运行 SDK、MCP、外部 REST 或跨服务示例**。

下一步继续依照 Issue #2 对其余尚未取得证据的文档进行**定点核对**；特别关注 MDX 动态组件替代、SDK 版本约束和表格字段，只有完整逐节证据后才能按约定标记 PASS。未部署。
