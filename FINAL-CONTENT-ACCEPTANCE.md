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
