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

**当前已建立中文版页面：113 / 113（其中疑难解答页的动态 FAQ 内容未复制，属于部分翻译）**。另外 V0.1 原有 6 篇中文导览属于独立编写的概念说明，不计入逐页翻译数量。

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
- `observability/features/sampling.mdx` → `docs/official/observability/features/sampling.md`（**部分翻译 / 待补充 SDK 示例**）
- `observability/features/pulse.mdx` → `docs/official/observability/features/pulse.md`（正文已补齐，发布前待验收）
- `observability/features/events-table-charts.mdx` → `docs/official/observability/features/events-table-charts.md`（正文已补齐，发布前待验收）
- `observability/features/user-feedback.mdx` → `docs/official/observability/features/user-feedback.md`（正文已补齐，发布前待验收）
- `observability/features/trace-ids-and-distributed-tracing.mdx` → `docs/official/observability/features/trace-ids-and-distributed-tracing.md`（**部分翻译 / 待补充 SDK 示例**）
- `administration/audit-logs.mdx` → `docs/official/administration/audit-logs.md`（正文已翻译；发布前仍需验收）
- `metrics/features/metrics-api.mdx` → `docs/official/metrics/features/metrics-api.md`（正文已翻译；发布前仍需验收）
- `evaluation/experiments/compare-experiments.mdx` → `docs/official/evaluation/experiments/compare-experiments.md`（正文已翻译；发布前仍需验收）

**重要：50 / 113 表示有中文映射文件，并非 50 篇完成翻译。** 本轮 11 篇中 Pulse、事件表格与图表、用户反馈已补齐原文正文和技术示例。采样与 Trace ID 页仍有部分 SDK / 框架示例待移植。发布前必须逐页检查，不应把上述页面算作完整译文。

### 本轮新增第 51–60 个中文页面（未部署）

- `api-and-data-platform/features/agent-skill.mdx` → `docs/official/api-and-data-platform/features/agent-skill.md`（部分翻译/组件或示例待补）
- `api-and-data-platform/features/cli.mdx` → `docs/official/api-and-data-platform/features/cli.md`（正文翻译，尚未最终验收）
- `api-and-data-platform/overview.mdx` → `docs/official/api-and-data-platform/overview.md`（正文翻译，尚未最终验收）
- `prompt-management/get-started.mdx` → `docs/official/prompt-management/get-started.md`（创建/使用共享组件的主要示例已迁移；动态 FAQ 未迁移）
- `prompt-management/data-model.mdx` → `docs/official/prompt-management/data-model.md`（正文已补齐，发布前待验收）
- `observability/features/log-levels.mdx` → `docs/official/observability/features/log-levels.md`（部分翻译/组件或示例待补）
- `observability/features/sessions.mdx` → `docs/official/observability/features/sessions.md`（正文与 SDK 示例已补充；动态讨论未迁移）
- `observability/features/users.mdx` → `docs/official/observability/features/users.md`（正文与 SDK 示例已补充；动态讨论未迁移）
- `observability/features/tags.mdx` → `docs/official/observability/features/tags.md`（主要 SDK 集成示例已补齐，发布前待验收）
- `observability/features/observation-types.mdx` → `docs/official/observability/features/observation-types.md`（部分翻译/组件或示例待补）

**113 / 113 是中文映射页数量，不是完整翻译验收数量。** 本轮部分长篇 SDK 文档采用精简翻译，必须在后续补齐全部示例，才能标为完成。

### 翻译补齐批次（未部署）

- 已将 `prompt-management/data-model` 从概要扩展为对应上游完整正文：Text/Chat、动态渲染、缓存、版本、标签、发布与回滚。
- 已为 `observability/features/tags` 补充 Python / TypeScript 的 OpenAI、LangChain 与手动 Observation 使用示例。
- 中文映射总数仍为 **113 / 113**；这次是补齐已有页面，而非新增篇数。

### 本轮继续补齐（未部署）

- `observability/features/sessions.md` 补入 Python、TypeScript、OpenAI、LangChain 等完整上下文传播示例。
- `observability/features/users.md` 补入手动 Observation、TypeScript 包装器、OpenAI 与 LangChain 接入示例。
- `prompt-management/get-started.md` 从官方 `components-mdx/prompt-create.mdx` 与 `components-mdx/prompt-use.mdx` 迁入创建提示词和运行时使用示例，包含 Python、TypeScript、HTTP API、OpenAI、LangChain 和 Vercel AI SDK；动态 FAQ 仍须链接官方。
- **中文映射页面数仍为 113 / 113。** 此轮是补齐，不新增映射。

### 新增官方译文（未部署）
- `observability/sdk/upgrade-path/js-v3-to-v4.mdx` → `docs/official/observability/sdk/upgrade-path/js-v3-to-v4.md`（正文及代码迁移示例已翻译）
- `v4.mdx` → `docs/official/v4.md`（正文已翻译；交互时间线和图示未复刻）

**中文映射页面总计 113 / 113；这不代表 62 篇全部完成技术验收。**

### 本轮新增两篇（未部署）
- `observability/features/filter-search-bar.mdx` → `docs/official/observability/features/filter-search-bar.md`（正文和语法示例已翻译）
- `prompt-management/features/webhooks-slack-integrations.mdx` → `docs/official/prompt-management/features/webhooks-slack-integrations.md`（正文、签名验证代码及 Slack 步骤已翻译）

**113 / 113 为中文页面映射数量，不等于完整验收数量。**

### 本次新增 10 篇完整正文译文（未部署）

- `content/docs/roadmap.mdx` → `docs/official/roadmap.md`
- `content/docs/langfuse-assistant.mdx` → `docs/official/langfuse-assistant.md`
- `content/docs/prompt-management/features/caching.mdx` → `docs/official/prompt-management/features/caching.md`
- `content/docs/prompt-management/features/prompt-version-control.mdx` → `docs/official/prompt-management/features/prompt-version-control.md`
- `content/docs/prompt-management/features/config.mdx` → `docs/official/prompt-management/features/config.md`
- `content/docs/observability/features/releases-and-versioning.mdx` → `docs/official/observability/features/releases-and-versioning.md`
- `content/docs/evaluation/scores/overview.mdx` → `docs/official/evaluation/scores/overview.md`
- `content/docs/evaluation/scores/data-model.mdx` → `docs/official/evaluation/scores/data-model.md`
- `content/docs/evaluation/get-started/online.mdx` → `docs/official/evaluation/get-started/online.md`
- `content/docs/api-and-data-platform/features/query-via-sdk.mdx` → `docs/official/api-and-data-platform/features/query-via-sdk.md`

10 篇正文中的表格、代码、提示与主要静态内容均已翻译；外部视频保留链接、上游运行时动态内容以官方实时来源替代。**累计映射页 113 / 113**，完整验收仍独立进行。本批次未触发 Pages 部署。

### 新增两篇官方完整正文译文（未部署）
- `administration/scim-and-org-api.mdx` → `docs/official/administration/scim-and-org-api.md`（组织 API、SCIM、Okta 设置与故障排除）
- `evaluation/experiments/experiments-via-ui.mdx` → `docs/official/evaluation/experiments/experiments-via-ui.md`（数据集映射、配置与实验比较）

**累计 113 / 113 个中文映射页；部分旧页仍待补齐，尚未统一验收。**

### 本轮新增 10 篇中文译文（未部署）

- `content/docs/administration/authentication-and-sso.mdx` → `docs/official/administration/authentication-and-sso.md`（身份认证与 SSO，译文已提交；待最终构建和技术验收）
- `content/docs/observability/features/alerts.mdx` → `docs/official/observability/features/alerts.md`（告警 Alerts，译文已提交；待最终构建和技术验收）
- `content/docs/administration/data-deletion.mdx` → `docs/official/administration/data-deletion.md`（数据删除，译文已提交；待最终构建和技术验收）
- `content/docs/security-and-guardrails.mdx` → `docs/official/security-and-guardrails.md`（LLM 安全与防护栏，译文已提交；待最终构建和技术验收）
- `content/docs/observability/sdk/upgrade-path/js-v4-to-v5.mdx` → `docs/official/observability/sdk/upgrade-path/js-v4-to-v5.md`（JS/TS v4 → v5 升级，译文已提交；待最终构建和技术验收）
- `content/docs/prompt-management/features/github-integration.mdx` → `docs/official/prompt-management/features/github-integration.md`（提示词 GitHub 集成，译文已提交；待最终构建和技术验收）
- `content/docs/api-and-data-platform/features/mcp-server.mdx` → `docs/official/api-and-data-platform/features/mcp-server.md`（Langfuse MCP Server，译文已提交；待最终构建和技术验收）
- `content/docs/evaluation/scores/score-analytics.mdx` → `docs/official/evaluation/scores/score-analytics.md`（Score Analytics，译文已提交；待最终构建和技术验收）
- `content/docs/observability/features/masking.mdx` → `docs/official/observability/features/masking.md`（敏感数据 Masking，译文已提交；待最终构建和技术验收）
- `content/docs/metrics/features/custom-dashboards.mdx` → `docs/official/metrics/features/custom-dashboards.md`（自定义 Dashboard，译文已提交；待最终构建和技术验收）

说明：本轮对静态正文、表格、流程、接口参数和技术代码进行了迁移。上游动态 GitHub Discussions、视频等保留外部入口；部分重复的 MCP 地区配置合并为地区 URL 表。**113 / 113 为源文件映射数量，不代表 86 篇都经过正式质量验收。**

### 2026-10-08 本轮新增 10 篇中文译文（未部署）

- `content/docs/evaluation/experiments/data-model.mdx` → `docs/official/evaluation/experiments/data-model.md`（实验数据模型；已迁移主要正文、表格及官方示例）
- `content/docs/observability/best-practices.mdx` → `docs/official/observability/best-practices.md`（Trace 最佳实践；已迁移主要正文、表格及官方示例）
- `content/docs/index.mdx` → `docs/official/index.md`（Langfuse 文档概览；已迁移主要正文、表格及官方示例）
- `content/docs/evaluation/core-concepts.mdx` → `docs/official/evaluation/core-concepts.md`（评估核心概念；已迁移主要正文、表格及官方示例）
- `content/docs/administration/llm-connection.mdx` → `docs/official/administration/llm-connection.md`（LLM Connections；已迁移主要正文、表格及官方示例）
- `content/docs/observability/get-started.mdx` → `docs/official/observability/get-started.md`（追踪快速开始；已迁移主要正文、表格及官方示例）
- `content/docs/administration/rbac.mdx` → `docs/official/administration/rbac.md`（RBAC 访问控制；已迁移主要正文、表格及官方示例）
- `content/docs/observability/sdk/upgrade-path/python-v3-to-v4.mdx` → `docs/official/observability/sdk/upgrade-path/python-v3-to-v4.md`（Python v3 → v4 升级；已迁移主要正文、表格及官方示例）
- `content/docs/observability/sdk/upgrade-path/python-v2-to-v3.mdx` → `docs/official/observability/sdk/upgrade-path/python-v2-to-v3.md`（Python v2 → v3 升级；已迁移主要正文、表格及官方示例）
- `content/docs/evaluation/get-started/offline.mdx` → `docs/official/evaluation/get-started/offline.md`（数据集离线评估；已迁移主要正文、表格及官方示例）

本批技术示例：保留 Tracing 快速开始的官方共享 SDK 代码、离线评估的 Python/TS 全部命令和代码、Python 升级迁移代码、完整组织和项目 Scope。原文交互式 FAQ、动态视觉组件改为文字/外部入口；旧页尚有部分待完整复核。**累计 113 / 113 是中文源映射页数，未代表最终质量验收完成。** 未部署网站。

### 2026-10-08 最后 17 个官方文档映射（未部署）

- `content/docs/glossary.mdx` → `docs/official/glossary.md`（术语表）
- `content/docs/demo.mdx` → `docs/official/demo.md`（互动示例项目）
- `content/docs/compatibility.mdx` → `docs/official/compatibility.md`（版本兼容性）
- `content/docs/observability/sdk/overview.mdx` → `docs/official/observability/sdk/overview.md`（SDK 概览）
- `content/docs/observability/sdk/advanced-features.mdx` → `docs/official/observability/sdk/advanced-features.md`（SDK 高级功能）
- `content/docs/observability/sdk/instrumentation.mdx` → `docs/official/observability/sdk/instrumentation.md`（SDK 埋点）
- `content/docs/observability/features/multi-modality.mdx` → `docs/official/observability/features/multi-modality.md`（多模态附件）
- `content/docs/observability/features/token-and-cost-tracking.mdx` → `docs/official/observability/features/token-and-cost-tracking.md`（Token 与成本）
- `content/docs/evaluation/experiments/datasets.mdx` → `docs/official/evaluation/experiments/datasets.md`（数据集 Datasets）
- `content/docs/evaluation/experiments/experiments-via-sdk.mdx` → `docs/official/evaluation/experiments/experiments-via-sdk.md`（SDK 实验）
- `content/docs/evaluation/experiments/experiments-ci-cd.mdx` → `docs/official/evaluation/experiments/experiments-ci-cd.md`（CI/CD 实验）
- `content/docs/evaluation/evaluation-methods/llm-as-a-judge.mdx` → `docs/official/evaluation/evaluation-methods/llm-as-a-judge.md`（LLM-as-a-Judge）
- `content/docs/evaluation/evaluation-methods/decision-models.mdx` → `docs/official/evaluation/evaluation-methods/decision-models.md`（Decision Model）
- `content/docs/evaluation/evaluation-methods/code-evaluators.mdx` → `docs/official/evaluation/evaluation-methods/code-evaluators.md`（Code Evaluator）
- `content/docs/evaluation/evaluation-methods/scores-via-sdk.mdx` → `docs/official/evaluation/evaluation-methods/scores-via-sdk.md`（SDK 写入 Score）
- `content/docs/api-and-data-platform/features/public-api.mdx` → `docs/official/api-and-data-platform/features/public-api.md`（Public API）
- `content/docs/api-and-data-platform/features/export-to-blob-storage.mdx` → `docs/official/api-and-data-platform/features/export-to-blob-storage.md`（Blob Storage 导出）

**重要：113/113 只代表已建立中文页面映射，不代表 113 篇完整翻译。** 本轮短篇 Demo、Glossary 进行了内容迁移；其余大型技术页面目前为**中文主要章节+源代码完整保留的工作译稿**，英文源的复杂表格、FAQ、完整示例解读和部分细节仍需逐段翻译、人工核对。以前的译文也存在待补齐组件。以上工作尚未执行统一 VitePress Build，也未部署网站，不能宣称“全部翻译完成”。

### SDK 精校批次（未部署）
- `observability/sdk/overview.mdx` → `docs/official/observability/sdk/overview.md`：已对照官方源文补齐完整中文正文、安装配置、OTEL 关系、浏览器注意事项和代码示例，替换旧概要式工作稿。其余工作稿仍待逐篇精校。
