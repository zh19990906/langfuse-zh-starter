# Langfuse 中文文档最终内容验收记录

> 2026-10-08，目标范围：`docs/official/` 113 篇。**验收尚未通过（BLOCKED）**，不得据此部署。本文记录可重复核实的现有证据和后续验收条件。

## 与结构检查的边界

GitHub Actions 已成功构建 VitePress，站内路径、导航和代码围栏静态检查为零错误。但构建通过**不能**证明逐段内容完整、SDK 示例可执行，或者与不断变化的上游完全一致。

## 本轮实际进行的内容对照

逐篇读取 Langfuse 官方同名 MDX 与中文 Markdown，并对照文件篇幅、代码块与重要功能语义。本轮覆盖以下 **14 篇（113 篇中的抽样）**：

| 页面 | 中文/英文字符量近似比例 | 官方 / 中文代码块 | 内容验收 |
| --- | ---: | ---: | --- |
| observability/features/sessions | 61% | 7 / 8 | 待逐段核对 |
| evaluation/evaluation-methods/scores-via-sdk | 57% | 29 / 29 | 待验证 SDK 语义 |
| observability/sdk/instrumentation | 53% | 33 / 33 | 待验证示例运行 |
| observability/sdk/advanced-features | 48% | 31 / 31 | 待验证多租户/OTel 行为 |
| evaluation/experiments/experiments-ci-cd | 54% | 13 / 13 | 文中明示仍待完整验收 |
| api-and-data-platform/features/export-to-blob-storage | 74% | 2 / 2 | 字段列表中部分解释仍为英文 |
| observability/sdk/overview | 42% | 12 / 13 | 待完整性验收 |
| evaluation/experiments/datasets | 44% | 14 / 14 | 文中明示仍待完整验收 |
| evaluation/get-started/online | 47% | 8 / 4 | 代码块合并，需逐项逐行比较 |
| administration/rbac | 44% | 1 / 1 | 动态权限表逐项复核待做 |
| prompt-management/features/caching | 57% | 11 / 11 | 待完整性验收 |
| metrics/features/metrics-api | 57% | 4 / 4 | 待 API 真实契约测试 |
| evaluation/scores/data-model | 36% | 2 / 2 | 待完整性验收 |
| api-and-data-platform/features/public-api | 28% | 21 / 23 | **高优先级：正文缩写明显**，已补充 Score v3 筛选及 Observation v2 分页契约 |

篇幅比例只是**风险排查信号，不是翻译覆盖率**：英文源有 MDX UI、JSX 组件和重复内容，中文句子通常也更短。即使代码块数量一致，也不能证明代码原样、位置、上下文与完整说明准确。

## 此轮已修复

- `api-and-data-platform/features/public-api.md`：恢复 `Scores API v3` 的 `value` 五类数据类型、`subject.kind` 关联类型、筛选器 OR/AND 关系、互斥条件、时间边界及 Cursor 限额；补充 `Observations API v2` 分页规则。提交 `d007cbd`。
- **尚未**把 14 篇或其他 99 篇标记 PASS。

## 发布前验收闸门

1. 将全部 113 篇与固定的上游 Commit 对齐，建立每篇原文分节 → 中文章节的逐项映射；保留非文本 UI 组件的替代说明。
2. 消除省略译文、英文说明未翻译、复制代码附录及重复示例；核对配置字段、API 类型、版本约束与限制条款。
3. 对 Python、JS/TS、curl、JSON、Mermaid 等示例完成语法与版本校验；需凭据或外部服务的场景标记为未实测。
4. 每篇单独标记 PASS / PARTIAL / BLOCKED，记录上游提交、检查项、验收日期；只有全部通过既定标准才允许正式部署。
5. 在最终内容修订后重新运行 `npm run qa:docs` 和 `npm run build`。

**当前结论：内容验收 BLOCKED；仓库构建通过不等于可正式发布。未部署。**

### 指定清单 12+8 篇定点复查（2026-10-08）

按用户指定顺序，已完成**第一优先级 12 篇 + 第二优先级 8 篇**的源文/中文稿定点对照，源 Blob SHA、逐篇核对结果及修复 Commit 见 [`PRIORITY-CONTENT-QA-2026-10-08.md`](PRIORITY-CONTENT-QA-2026-10-08.md)（commit `6829abc`）。累计重点修复包括 Public API Observation v2 filter 优先级、Compatibility 最低 Server 版本、RBAC 项目角色方案限制（组织/项目十组 Scope 列表一致）、SDK OTel/过滤/环境属性传播、Experiment Action 完整输入输出表、Dataset 版本语义、UI Webhook 签名和异步返回条件、评分类型限制、Blob 导出 114 处字段说明汉化，以及第二优先级 Webhook TS 正则错误、LLM Judge Rule 示例、Token/Cost 优先级与外部 S3 预览限制。

最新文档修订提交 `b3b4187` 的 GitHub Actions [run 37769093730](https://github.com/zh19990906/langfuse-zh-starter/actions/runs/37769093730) **success**：扫描官方译文 113 篇，总 Markdown 121 篇，Errors 0、anchor warnings 0，VitePress Build 成功。**20/20 只代表这轮定点项目已有检查证据，不能宣称整篇最终内容 PASS**：深层全文翻译、真实 SDK/API/存储服务运行和其他动态内容仍需独立验收。保留 BLOCKED 发布门槛，未部署。
