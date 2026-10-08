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

### 首轮技术精校与导航检查（2026-10-08，未部署）

- 对照上游逐段复核 `observability/sdk/overview.md`，已将原概要稿替换成 SDK 版本、快速开始、OTEL、客户端初始化、前端安全以及跨语言说明的中文正文。
- 检查 VitePress 配置中的 114 个 `/official/` 导航引用：均可对应仓库中的 `.md` 页面；这只是文件存在性检查，不代表页面锚点和外部链接全部有效。
- 修正 `prompt-management/get-started.md` 的英文 Frontmatter 标题和包含 `MOVED TO R2` 的明显无效视频 URL（改为官方教程入口），并调整内部数据模型链接。
- 修正 SDK 概览内部分章节锚点链接，减少无效跳转风险。
- 未运行全量 VitePress Build、未验证所有代码示例或外部资源；其他概要式译稿仍需逐篇校对。

### 第二轮 SDK 技术校验（2026-10-08，未部署）

- `observability/sdk/advanced-features.md`：上游共 31 个代码块，中文版保留数量一致；校验并补充 Python 与 JS/TS Sampling、独立 TracerProvider 共享上下文和 Python 多项目路由的第三方 Span 交叉发送风险。
- `observability/sdk/instrumentation.md`：上游共 33 个代码块，中文版保留数量一致；补充 Context Manager、Decorator、手动 Observation `.end()`、Python Environment 属性/跨服务 Baggage、Python Flush/Shutdown 与 JS/TS Serverless `forceFlush()` 的重要行为。
- 两篇的原有代码仍集中在“官方示例”部分，尚未与中文步骤逐一重排，已添加明显的工作译稿提示。因此**不标记为完整译文验收通过**。
- 未执行 VitePress 全量构建，也未部署。

### 第三轮技术校验：Public API、Score 与 SDK 实验（2026-10-08，未部署）

- `api-and-data-platform/features/public-api.md`：补齐官方 API 认证示例、Observations v2 Cursor 限制（默认 50、上限 1000、降序）、Scores v3 返回值类型（BOOLEAN 为 boolean，不是数字）、可选字段组、Python/JS 版本兼容和旧 Ingestion API 迁移说明。
- `evaluation/evaluation-methods/scores-via-sdk.md`：澄清创建/读取评分 API、稳定评分 ID 与名称的区别、Browser 端密钥安全与 Score v3 读取类型。
- `evaluation/experiments/experiments-via-sdk.md`：澄清 Runner 执行位置、逐项和 Run-level Evaluator、Dataset 固定版本及 UI Webhook 外部执行的关系。
- 以上为局部技术修正，仍需把原来的按编号排列代码块逐一对应中文说明。尚未执行构建或部署，不标为整篇完整验收。

### 全库验收阻塞清单（2026-10-08）

- 已确认源仓库和中文仓库的官方页面文件数均为 **113**；该数量只能证明源文件映射，不是正文翻译验收。
- 对 12 篇高风险长文进行结构抽查，**12/12 仍明确包含“待精校/工作译稿”提示**，其中 10 篇含集中编号的代码示例；当前不能认定代码示例与说明一一对应。
- 高风险页面包括：`compatibility`、`observability/sdk/{advanced-features,instrumentation}`、`observability/features/{multi-modality,token-and-cost-tracking}`、`evaluation/experiments/{datasets,experiments-via-sdk,experiments-ci-cd}`、`evaluation/evaluation-methods/{scores-via-sdk,llm-as-a-judge,decision-models}`、`api-and-data-platform/features/public-api`。
- 本轮 12 篇抽查代码围栏数量均为偶数；**这不是语法编译或示例运行通过**。
- 尚未完成全部 113 篇的逐句比对、所有站内锚点与外链验证、SDK 示例运行及 VitePress 全量构建。本项目 **禁止因 113/113 页面映射而宣称全量验收成功**。
- 由于当前执行环境无法直接连接 GitHub 克隆仓库，且可用 GitHub 接口无法触发构建验证工作流，因此本阶段无法在本机完成真实构建；部署维持关闭。

### 本轮补齐：兼容性与决策模型（2026-10-08，未部署）

- `docs/official/compatibility.md`：原先只有摘要，现已补齐 GA 主版本、生命周期、Cloud v3/v4 功能矩阵、旧 SDK/接口的迁移边界及 FAQ；动态切换日期继续引用官方实时页面。
- `docs/official/evaluation/evaluation-methods/decision-models.md`：原先为概要稿，现已逐节补齐 Choice、Score、Yes/no 类型及边界、OpenAI 与 TypeSafe 区别、输入映射、调试、Score 字段、限制和 FAQ。特别澄清 Yes/no 为数值概率而非 Boolean Score。
- 本轮两页仍未运行 VitePress 全量构建或示例运行；剩余长篇工作稿继续保留待验收标记，**不因本轮补齐两篇而宣称全库完整**。


### Issue #2 逐篇验收记录（2026-10-08，禁止部署）

验收状态必须以逐篇证据为准；本段与前述“映射数量”互不等价。上游基线 `langfuse/langfuse-docs@e72be49bedf5172a5224acbdf39d102ca02496d5`。

| 文档 | 上游 Blob SHA | 译文 Commit SHA | 已完成检查 | 状态 / 阻塞 |
| --- | --- | --- | --- | --- |
| `evaluation/evaluation-methods/decision-models` | `d90d018b407990aacd65ace229e37183f9ce9029` | `1fec22ea54c3e3dc8d0d2ffeebeddab2ea92e15c` | 对照上游静态正文、3 类问题、配置表与 Score 表、四则 FAQ；补齐 Score comment 完整示例、具体 Rule/Batch 锚点，并明确讨论组件的静态替代 | **BLOCKED**：尚未取得本次构建、站内锚点与外链自动验证结果，不能标 PASS |
| `compatibility` | 待独立登记 | 无本轮提交 | 已有扩译稿，但未完成动态矩阵独立核对 | **BLOCKED**：待完整技术验收 |

**构建执行准备：** 将 `.github/workflows/validate-docs.yml` 改成在 `master` 的 `docs/**` 变更时自动运行仅构建的 CI（Commit `edea273715c20d530df608f3ac1765c317dbffc8`）。该 workflow 不含 Pages 部署步骤；`deploy.yml` 仍只支持手动 `workflow_dispatch`。本地工作环境无法解析 GitHub 域名，无法克隆安装依赖，不能以本机编译成功作为证据。**CI 实测结果：PASS**。GitHub Actions [Validate Chinese Docs Build #37761467429](https://github.com/zh19990906/langfuse-zh-starter/actions/runs/37761467429) 已完成，结论 `success`，对应 Commit `edea273715c20d530df608f3ac1765c317dbffc8`；该提交包含此前 `decision-models` 修复。构建通过不代表 113 篇翻译或链接验收通过。

**未完成总验收：** 113 篇尚未逐页取得 PASS。高级 SDK 与其他高风险概要工作稿仍需把示例移回原文位置；不能以代码数量或 Markdown 页面存在视为通过。没有部署 GitHub Pages。

### evaluation/evaluation-methods 文件夹校验批次（2026-10-08）

- 范围：`docs/official/evaluation/evaluation-methods/`（6 篇：annotation-queues、scores-via-ui、decision-models、llm-as-a-judge、code-evaluators、scores-via-sdk）。
- **本批完成修复**：`llm-as-a-judge.md` 从简略工作稿改为按原文章节组织的中文说明（评估目标、变量映射、多模态、Worker、API、故障排查、FAQ）；`code-evaluators.md` 增补 Context/Score 字段、执行器限制、超时和调试信息。
- `decision-models.md` 已在此前批次补齐正文，`scores-via-sdk.md` 已修正关键 API 类型；但它们**尚未完成全部代码段上下文映射和运行验证**。
- `annotation-queues.md`、`scores-via-ui.md` 仍需最终逐段核对；本批未给整个文件夹标记 PASS。
- 未执行 VitePress Build，未部署。

### Scores via SDK 专项代码重排（2026-10-08）

- `evaluation/evaluation-methods/scores-via-sdk.md`：29 组上游示例已经从独立的“官方示例 1～29”尾部附录移回 Trace/Observation、浏览器、Session、ScoreConfig 等对应的中文正文章节，并标注语言与用途。
- 静态检查：29 组代码块，围栏成对，尾部原编号标题已清除。尚未调用真实 API 或执行 SDK 示例，暂不标记最终 PASS。
- 未部署网站。

### ## evaluation/experiments/ 目录阶段校验（2026-10-08）

已将 `datasets.md` 的 14 个、`experiments-via-sdk.md` 的 16 个、`experiments-ci-cd.md` 的 13 个上游代码块，重新按对应功能章节归位；复核过代码围栏数分别为 28、32、26 条。最终修正提交：`b1f07e8`、`0487859`、`3fab1d6`。本轮**仅完成示例结构和数量的静态核对**，尚需逐段技术内容对照、真实 SDK 测试和构建。因此该文件夹继续标记 PARTIAL，禁止部署。

### ## evaluation/experiments/ 目录第二轮（2026-10-08）

检查了剩余的 `compare-experiments.md`、`data-model.md`、`experiments-via-opentelemetry.md` 和 `experiments-via-ui.md` 与官方页面结构。原文包含的代码块：Compare 0、Data Model 3、OTEL 0、UI 5（其中 UI 两组为相同 Prompt/Dataset JSON 的重复展示；中文合并后保留 3 个不重复的示例）。检查中修复了 4 篇文档的中文站内交叉链接，避免继续指向相同内容的英文文档和可能失效的章节锚点。提交：`d73aff6`、`eac300a`、`00eca44`、`97d222a`。

说明：此轮检查的是章节/示例数量和链接位置，不代表四篇逐句完全一致；整个 experiments 目录暂继续标记 PARTIAL，构建与真实 SDK 执行仍待测试，不部署。

### ## observability/features/ 目录专项（2026-10-08）

本目录共 27 篇。优先检查了两篇大体量、原有“编号示例尾部附录”的工作稿：`multi-modality.md`（13 组官方代码示例）与 `token-and-cost-tracking.md`（10 组）。已把各组代码按外部媒体、附件、引用解析、S3；以及成本流程、模型定义、手动成本上报、OpenAI Usage 兼容的章节重新归位，静态确认围栏数量一致。提交：`163f263`、`4a736b4`。

这只是目录的**第一批结构校验**，其余 25 篇及两篇所有段落、动态组件与运行验证仍需逐篇复核。未执行 VitePress 构建、未部署，目录状态 PARTIAL。

### ## observability/features/ 第二批范围校验（2026-10-08）

对照官方全文核对 8 篇较短的功能文档：`agent-graphs`、`agentic-access`、`observation-types`、`sampling`、`queuing-batching`、`trace-ids-and-distributed-tracing`、`mcp-tracing`、`log-levels`。其中 `observation-types` 原文 8 组代码而旧译稿只有 3 组、`sampling` 8 vs 2、`trace-ids` 7 vs 2、`log-levels` 6 vs 2；已向四篇补充按 SDK 场景分组的官方完整示例和关键用法说明。注意：因旧示例可能已有重写版本，**新旧示例存在重复内容，待下一轮整合**；本轮不能把追加示例视为页面 PASS。其他四篇未发现同类示例缺失，但仍未逐句验收。提交：`de0bbea`、`3444d68`、`49c75ef`、`921f449`。未运行构建/SDK 测试，未部署。

### ## observability/features/ 第三批校验（2026-10-08）

本批检查：`alerts`、`comments`、`corrections`、`environments`、`events-table-charts`、`filter-search-bar`、`full-text-search`、`masking`（8 篇）。上游代码块数量分别为 1、1、6、9、0、2、2、7；中文版对应为 1、1、6、9、0、4、2、7。`filter-search-bar` 的额外代码块仍需逐条核对，不能直接据此判为漏译或错误。

已直接修复三篇的重要说明：`masking.md` 明确 Python `mask_otel_spans` 与旧 `mask` 的执行阶段、覆盖范围、异常/批次丢弃和其他 Exporter 独立脱敏风险（`c7a9d6c`）；`alerts.md` 增补 NO_DATA 通知边界与 Webhook HMAC 校验要求（`3c666e2`）；`filter-search-bar.md` 补充语法类型及 UI 版本注意事项（`412e469`）。

本轮是目录结构及技术风险校验，仍未完成八篇逐句完整验收；没有运行 VitePress 构建，未部署，状态 PARTIAL。

### ## observability/features/ 第四批目录范围检查（2026-10-08）

检查剩余 9 篇：metadata、pulse、releases-and-versioning、sessions、tags、url、user-feedback、users、web-callouts。原文/中文版代码块数量分别为：metadata 10/10、pulse 0/0、releases 12/11、sessions 7/8、tags 12/7、url 7/7、user-feedback 3/3、users 7/8、web-callouts 1/1。数量差异可能包含合并或改写示例，不能直接认定运行错误。

已在 `tags.md` 补入 5 组官方 SDK 标签传播用法（commit `6512b87`），覆盖 Python Decorator / 手动 Observation、TypeScript Context / observe 包装器、LangChain CallbackHandler。提醒：这仍可能与原先译写示例重复，需最终编辑整合。

**至此 27/27 篇 features 页面已至少完成一轮结构/代码量扫描，但 0 篇被本任务据此正式标记 PASS。** 目录仍未执行逐句完整验收、示例运行和 VitePress Build；继续标记 PARTIAL，不部署。

### ## observability/sdk/ 第一批精校（2026-10-08）

范围总计 9 篇（SDK 基础页与 Upgrade Path）。优先修复两个高风险的大型工作稿：`advanced-features.md` 的 31 个官方代码块、`instrumentation.md` 的 33 个官方代码块从文末集中编号附录重排回对应中文主题章节，保留原始代码文本和语言标识。提交分别为 `3bb11dd47e12d6f2b949ce530bfaa9a093326932` 和 `d6fdae667a3efa95f578a95c91d28175fc37db39`。静态检查两篇示例数量分别为 31 和 33，代码围栏均成对。本次不视为逐段完整翻译或 SDK 运行测试通过，目录状态 PARTIAL；无构建、无部署。

### observability/sdk/ 第二批校验（2026-10-08）

- 对照官方原文检查 SDK Overview、Troubleshooting/FAQ、Upgrade Path Index、JS v3→v4、JS v4→v5、Python v2→v3、Python v3→v4，共 **7 篇**。
- 静态代码块数量（英文/中文）：Overview 12/13、Troubleshooting 0/0、Index 0/0、JS v3→v4 0/6、JS v4→v5 6/6、Python v2→v3 12/13、Python v3→v4 11/11。数量差异必须结合内容判断，不能等价为验收通过或代码丢失。
- 修正 JS v3→v4 升级指南中的 SDK Overview 与后续 v4→v5 指南链接，改为本站中文页面（commit `4edaf52c7b61595af776dc09c5b4e521c6b8431c`）。
- 特别注意：官方 Python v2→v3 源页面含 JS/TS v3→v4 的追加迁移章节，中文版本也保留此部分；这属于上游结构，暂不擅自删除。
- 本轮属于目录结构、迁移关键点和示例数量核对，尚未完成逐句独立 PASS、实际 SDK 测试或 VitePress 构建；不部署。
