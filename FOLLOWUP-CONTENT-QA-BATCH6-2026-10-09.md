# 内容验收证据补查（六）：风险文档与 Observability 专项（2026-10-09）

> 将上一轮本地暂存的内容 QA 记录同步 GitHub。仅证明指定条款的定点校验，**不等于逐段最终 PASS 或真实服务实测**；不部署。

| 文件（`docs/official/` 相对路径） | 上游 Blob SHA | 核对内容及边界 | 修改提交 |
| --- | --- | --- | --- |
| `security-and-guardrails.md` | `48aeb616a4549081bdd8361b52892e278f3074aa` | 5 组代码；上游 PII 示例误引用 prompt；中文版已改 input；未执行 LLM Guard | 既有修复 |
| `administration/data-deletion.md` | `03ee37d47d2b28140442db4920bf1d4f9c1d7dfb` | Trace / Session 批量删、Cursor、异步删除、历史查询窗口及月间断假设 | 无需新改；未调用删除 API |
| `administration/data-retention.md` | `76447929c6ab1f34e093f6257b140ba9f91b42b8` | Retention 对 Trace、Score、Dataset Item、Audit Log、媒体和 S3 权限的不同作用 | 无需新改 |
| `evaluation/get-started/offline.md` | `d6a0e4d7e7c4ac6b84d99e4c104bb34a4870177f` | 源文与译文 20/20 组代码文本完全一致；仍需真实 SDK 运行 | 无需新改 |
| `prompt-management/features/caching.md` | `35671ae8ecf221dd2b825610ceead2d3ec7ab5d6` | 11/11 代码围栏；Mermaid 图和注释汉化，缓存命中、重验证、未命中及 TTL 已覆盖 | 无需新改 |
| `metrics/features/metrics-api.md` | `26b017616da785b34c8a4d6aa9962d9d103c4230` | 4/4 API 示例文本一致；未请求真实 Metrics API | 无需新改 |
| `observability/data-model.md` | `47a1e968307225ee008f0ad948f024739f2b629f` | 补回短生命周期任务没有 flush() 可能丢失数据的原文图示分支 | 9b1958b |
| `observability/features/url.md` | `5c5e7b8afc62c3e111356bf19279bc85b657642e` | 7/7 代码组；大多是注释/空行差异；未运行 SDK | 无需新改 |
| `observability/features/agent-graphs.md` | `182a96188a869c8a4ccbe75f253bae0aa7ab2ce1` | 聚合/展开模式、LangGraph 行为和 Observation Type 条款核对 | b4a2680 |
| `observability/features/agentic-access.md` | `e440405d175dc5a93c57a06eb01d2d63d1617d24` | Agent Skill/CLI/MCP 动态入口与静态替代说明 | 29bf94a |
| `observability/features/events-table-charts.md` | `49dcca4785f65f464d8d1e2054ee7978fda30cd6` | Visualize 指标、聚合、筛选限制、Dashboard 权限和 v4 | f4d66a2 |
| `observability/features/filter-search-bar.md` | `ff749d3575edd7f5807189441ae03ffac08492c3` | 查询语法、Ask AI 限制、URL 状态及字段别名；围栏 2/4 需区分示例拆分 | 无需新改 |
| `observability/features/full-text-search.md` | `21836a1d2d4ee7c123e7a4f0bff5943d38b7d536` | matches、API v2、大小写和全文索引性能约束 | c45f70a |
| `observability/features/web-callouts.md` | `9eb4fd7d2c5c1b40525bbeda8c04e279609ecfc1` | POST 标识符、5 秒超时、不重试、Headers 和权限限制 | 71f776b |

14 篇均来自前次 27 篇“未有专项文件级报告”的列表。修复包括 Data Model 短任务 flush 失败风险分支及 Observability 内部引用链接。尚未真实运行 SDK、LLM Guard、HTTP、S3、删除或缓存请求；Markdown 检查与内容验收仍是独立门槛。
