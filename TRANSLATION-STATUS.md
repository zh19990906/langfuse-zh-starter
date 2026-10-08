# Langfuse 中文文档翻译计划

本项目是非官方中文文档镜像。站点采用 **VitePress**；翻译内容来自 [Langfuse 官方文档仓库](https://github.com/langfuse/langfuse-docs) 的 `content/docs` 目录。

## 翻译进度

2026-10-08 核对上游：113 个 Markdown/MDX 正文文件、18 个 meta.json 导航文件。并非所有路由或嵌入组件都在这些文件中。

目前已按官方源页面翻译并整理：
- `observability/overview.mdx` → `docs/official/observability/overview.md`
- `prompt-management/overview.mdx` → `docs/official/prompt-management/overview.md`
- `evaluation/overview.mdx` → `docs/official/evaluation/overview.md`
- `observability/data-model.mdx` → `docs/official/observability/data-model.md`
- `observability/troubleshooting-and-faq.mdx` → `docs/official/observability/troubleshooting-and-faq.md`（静态文字翻译，动态组件未翻译）
- `observability/features/environments.mdx` → `docs/official/observability/features/environments.md`
- `observability/features/metadata.mdx` → `docs/official/observability/features/metadata.md`

**当前已建立中文版页面：50 / 113（其中疑难解答页的动态 FAQ 内容未复制，属于部分翻译）**。另外 V0.1 原有 6 篇中文导览属于独立编写的概念说明，不计入逐页翻译数量。

## 翻译约定

- 中文文件映射原始文档的相对路径，保留原文 URL。
- Markdown 链接可在对应中文版发布后从官方英文链接切换为中文站内链接。
- 将 MDX 特有的 JSX 和交互组件转换成适配 VitePress 的 Markdown 或 Vue 组件；代码样例不可随意改写。
- 对每一批翻译运行 `npm run build` 检查链接与 Markdown 编译。
- 完整翻译完成之前，不标注为“全站已汉化”。
- 后续维护上游源提交 SHA、变更检测、译文状态清单。

## 发布

仅在一个文档板块完成并经过复核后，手动运行 `.github/workflows/deploy.yml` 发布 GitHub Pages；提交译文不自动部署。历史 Next.js 静态发布流程已停止自动部署，以免冲突。

## 许可

Langfuse 官方文档仓库使用 MIT License，转载与翻译时须保留该许可证和版权声明；对品牌与第三方资源需另行核查。

## 新增翻译批次（尚未部署）

- `observability/features/mcp-tracing.mdx`
- `observability/features/agentic-access.mdx`
- `observability/sdk/upgrade-path/index.mdx`
- `prompt-management/features/folders.mdx`
- `prompt-management/features/composability.mdx`
- `prompt-management/features/link-to-traces.mdx`（嵌入式 SDK 示例需迁移）
- `prompt-management/features/agentic-access.mdx`
- `prompt-management/features/n8n-node.mdx`
- `evaluation/experiments/experiments-via-opentelemetry.mdx`
- `evaluation/agentic-access.mdx`
- `api-and-data-platform/features/export-from-ui.mdx`
- `administration/spend-alerts.mdx`
- `docs-mcp.mdx`（安装组件尚未迁移）
- `ask-ai.mdx`（交互式组件未迁移）

注意：21 篇指已经建立对应中文 Markdown 文件的页面数，**不是 21 篇都经过完整内容验收**。嵌入的动态 MDX 组件需要单独迁移或明确链接到官方实现。计划累积到约 50 篇并复核后再统一部署。

### 本次追加（未部署）
- `observability/features/agent-graphs.mdx` → `docs/official/observability/features/agent-graphs.md`（正文完整，动态讨论组件不迁移）
- `administration/troubleshooting-and-faq.mdx` → `docs/official/administration/troubleshooting-and-faq.md`（动态 FAQ 待迁移）
- `evaluation/troubleshooting-and-faq.mdx` → `docs/official/evaluation/troubleshooting-and-faq.md`（动态 FAQ 与讨论待迁移）
- `prompt-management/troubleshooting-and-faq.mdx` → `docs/official/prompt-management/troubleshooting-and-faq.md`（动态 FAQ 与讨论待迁移）

### 后续新增四篇（尚未部署）
- `observability/features/full-text-search.mdx` → `docs/official/observability/features/full-text-search.md`
- `observability/features/queuing-batching.mdx` → `docs/official/observability/features/queuing-batching.md`
- `metrics/overview.mdx` → `docs/official/metrics/overview.md`
- `evaluation/evaluation-methods/scores-via-ui.mdx` → `docs/official/evaluation/evaluation-methods/scores-via-ui.md`

### 追加四篇（未部署）
- `administration/billable-units.mdx` → `docs/official/administration/billable-units.md`
- `observability/features/url.mdx` → `docs/official/observability/features/url.md`
- `observability/features/web-callouts.mdx` → `docs/official/observability/features/web-callouts.md`
- `prompt-management/features/a-b-testing.mdx` → `docs/official/prompt-management/features/a-b-testing.md`

### 新增（未部署）
- `observability/features/comments.mdx` → `docs/official/observability/features/comments.md`
- `observability/features/corrections.mdx` → `docs/official/observability/features/corrections.md`
- `observability/sdk/troubleshooting-and-faq.mdx` → `docs/official/observability/sdk/troubleshooting-and-faq.md`

### 新增三篇（未部署）
- `prompt-management/features/playground.mdx` → `docs/official/prompt-management/features/playground.md`
- `administration/data-retention.mdx` → `docs/official/administration/data-retention.md`
- `evaluation/evaluation-methods/annotation-queues.mdx` → `docs/official/evaluation/evaluation-methods/annotation-queues.md`

### 新增第 40–50 个中文映射页面（本批未部署）

- `prompt-management/features/variables.mdx` → `docs/official/prompt-management/features/variables.md`（正文已翻译；发布前仍需验收）
- `prompt-management/features/message-placeholders.mdx` → `docs/official/prompt-management/features/message-placeholders.md`（正文已翻译；发布前仍需验收）
- `prompt-management/features/guaranteed-availability.mdx` → `docs/official/prompt-management/features/guaranteed-availability.md`（正文已翻译；发布前仍需验收）
- `observability/features/sampling.mdx` → `docs/official/observability/features/sampling.md`（**部分翻译 / 待补充完整技术内容**）
- `observability/features/pulse.mdx` → `docs/official/observability/features/pulse.md`（**部分翻译 / 待补充完整技术内容**）
- `observability/features/events-table-charts.mdx` → `docs/official/observability/features/events-table-charts.md`（**部分翻译 / 待补充完整技术内容**）
- `observability/features/user-feedback.mdx` → `docs/official/observability/features/user-feedback.md`（**部分翻译 / 待补充完整技术内容**）
- `observability/features/trace-ids-and-distributed-tracing.mdx` → `docs/official/observability/features/trace-ids-and-distributed-tracing.md`（**部分翻译 / 待补充完整技术内容**）
- `administration/audit-logs.mdx` → `docs/official/administration/audit-logs.md`（正文已翻译；发布前仍需验收）
- `metrics/features/metrics-api.mdx` → `docs/official/metrics/features/metrics-api.md`（正文已翻译；发布前仍需验收）
- `evaluation/experiments/compare-experiments.mdx` → `docs/official/evaluation/experiments/compare-experiments.md`（正文已翻译；发布前仍需验收）

**重要：50 / 113 表示有中文映射文件，并非 50 篇完成翻译。** 本轮 11 篇中 3 篇（Pulse、事件表格与图表、用户反馈）目前仅为中文导览，未翻译完整原文；采样与 Trace ID 页也仍有部分框架示例待迁移。发布前必须逐页检查，不应把上述页面算作完整译文。
