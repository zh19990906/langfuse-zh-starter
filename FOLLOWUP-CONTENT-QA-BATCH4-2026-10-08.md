# 内容证据补查（四）：Prompt、UI 实验及相关说明（2026-10-08）

本轮在先前验收台账基础上，对另 16 篇官方 MDX 和中文稿做定点内容审查。表中的“完成”指本轮列示的核对项，不等于全文最终 PASS；没有执行 SDK 或外部服务测试，没有部署。

| 文件（docs/official 下） | 上游 Blob SHA 前缀 | 源/译代码块 | 核对重点及修复 | 提交 |
| --- | --- | --- | --- | --- |
| `observability/features/observation-types.md` | `94e351f` | 8/11 | 8 个官方代码示例均存在，SDK 最低版本与动态组件界限核对 | `ae4a0c5` |
| `evaluation/experiments/experiments-via-ui.md` | `81d4a9e` | 5/3 | 重复变量映射实例已合并；版本选择和 JSON Schema 说明存在 | `无需改` |
| `prompt-management/features/playground.md` | `0515a76` | 0/0 | 并排对比、保存 Prompt、Generation、工具调用和模型选择小节已核对 | `无需改` |
| `prompt-management/overview.md` | `21d18d9` | 0/0 | 职责分离/客户端缓存说明，五条已有中文页链接修复 | `20a6e14` |
| `prompt-management/features/config.md` | `b95a1c0` | 6/6 | 创建 Config、Python/JS 使用、结构化输出/工具调用；缩进与注释已本地化 | `无需改` |
| `prompt-management/features/a-b-testing.md` | `2905661` | 2/2 | 标签分流、随机选版本及 Trace 关联代码语义对照 | `无需改` |
| `prompt-management/features/composability.md` | `f60267b` | 2/2 | 示例两组文本匹配，组合 Prompt 功能对照 | `无需改` |
| `evaluation/overview.md` | `999ef45` | 0/0 | 补 OpenTelemetry 实验模式和十六条站内链接 | `5678487` |
| `prompt-management/features/link-to-traces.md` | `397dc49` | 0/0 | 关联方法与 Metrics Reference 章节存在 | `无需改` |
| `prompt-management/features/prompt-version-control.md` | `3b34c90` | 6/6 | 404/400 标签解析规则、版本回退、受保护标签核对；代码缩进/注释有差异 | `无需改` |
| `prompt-management/features/message-placeholders.md` | `9072487` | 6/6 | SDK 版本下限、Compile 与 LangChain 入口核对；未实测 | `无需改` |
| `evaluation/experiments/data-model.md` | `d308a8f` | 3/3 | 21 项表格对象字段、三个源代码块对照；本地链接修正 | `e7d145d` |
| `prompt-management/features/github-integration.md` | `4dc01ca` | 9/9 | 两个 YAML 工作流样例安全改写：事件字段经 env 注入而非直接 Shell 拼接；补充官方 FastAPI 示例的重试不幂等及 GitHub SHA 竞态警告 | `2988b12` |
| `evaluation/evaluation-methods/annotation-queues.md` | `cdc16a1` | 0/0 | Score Config、批量/单条审核和快捷键表核对，原文链接修正 | `70d3de8` |
| `observability/best-practices.md` | `1e2c720` | 0/0 | Trace 范围、Thinking、树结构、命名和属性使用说明核对 | `无需改` |
| `administration/billable-units.md` | `3a04f03` | 0/1 | 计费单位求和、用量 Dashboard 和算例对照，本地引用修正 | `e76d42f` |

## 关键发现与修正

- **GitHub Actions 注入风险**：上游文档将 repository_dispatch 的外部事件字段直接插入 Shell run 命令，存在命令注入风险。中文版已将字段通过 GitHub Actions env 注入，再在 Shell 中以引号保护变量，安全改写原文两个 YAML 示例；其 deploy Job 仍仅是 echo 演示，不会部署本项目。原 FastAPI Webhook 示例未实现 HMAC，现有中文稿已明确警告，不能直接暴露生产使用。
- **评估流程遗漏**：中文版 Evaluation Overview 的功能矩阵缺少上游 Experiments via OpenTelemetry，已经补回；16 个可匹配的英文文档链接改为中文站路由。
- **误导性遗留状态**：Observation Types 原文 8 段官方示例已在译文中保留，不应再写“更多 TS 示例待迁移”，已经说明仅动态类型列表需官方页面。
- **链接核对**：Prompt Overview 五处、Experiment Data Model 一处、Billable Units 两处链接本地化，Annotation Queues 原文链接修正。

## 结构和构建验证

最后正文改动提交 `ae4a0c5` 对应 [GitHub Actions #37779116285](https://github.com/zh19990906/langfuse-zh-starter/actions/runs/37779116285)，成功扫描 113 篇官方页面和 121 篇 Markdown，Errors 0、Anchor Warnings 0，VitePress Build 成功。该 CI 没有执行第三方 SDK 示例、真实 GitHub Actions Dispatch 或动态组件。后续仍需对未核销的页面和代码环境做内容验收，**不得声称本批整篇 PASS，也不部署**。

补充修复：`prompt-management/features/github-integration.md` 于 `f7b8c4b` 明确说明，官方 FastAPI 示例不记录 event.id，不能自动保证重复事件幂等；同时更新同一文件可能遇到 GitHub 409 和单文件覆盖问题，并修正末尾“代码完全原样”的不准确表述。此为文档安全告知，非已实现的生产 Webhook 服务器。
