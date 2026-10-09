# 内容证据补查（五）：评分、LLM 连接与入门文档（2026-10-09）

本批延续 Issue #2，**优先核销此前五份专项报告没有独立登记的文件**，不重复此前已登记的 78 篇。对 8 篇官方 MDX 与中文文档做标题、关键技术条款、代码结构和链接核对。**8/8 指定点复核完成，不是 8 篇全文 PASS**；未部署。

| 中文文档（docs/official 下） | 上游 Blob SHA | 代码块（官方 / 中文） | 本次具体核对 | 修复 |
| --- | --- | --- | --- | --- |
| `administration/spend-alerts.md` | `39fca2caae68bb0ae92a3a3045d527015d0618d1` | 0 / 0 | Cloud 方案限制、预估账单与模型成本的区别、60–90 分钟检测、每账期一次邮件、Owner/Admin 通知均已译出 | 无需改动 |
| `administration/llm-connection.md` | `9c204262e61ce4cb2c51d8f9562158d60b8438ea` | 3 / 3 | 3 个官方完整示例块文本一致；OpenAI 兼容网关的 Tool Calling、Responses API、SSRF/HTTPS 限制已说明；修正 3 个中文页内部链接 | `26a4bb4` |
| `evaluation/evaluation-methods/scores-via-ui.md` | `07567d92f52a5a1eb31425fcf9844270f6f3dfa1` | 0 / 0 | 六步手工评分流程、ScoreConfig、Annotation Queue 和实验结果评分对应 | 无需改动 |
| `evaluation/scores/score-analytics.md` | `aa1b8632231241429aae6d8c3acfe78d5e081d0c` | 0 / 0 | Pearson、Spearman、MAE、RMSE、Kappa、F1、总体一致率；Matched/All、最大双 Score、同类型限制、超过 100,000 条抽样说明均有中文译文；修正 1 个中文 Dashboard 引用 | `7225eae` |
| `metrics/overview.md` | `f79276c6985fdc2a35f762e0fb1f6bd5c34dfae3` | 0 / 0 | 质量/成本/延迟/请求量、维度和 Dashboard/API 介绍已覆盖；修正 8 处重复引用英文文档的链接 | `f55fbdac` |
| `observability/features/pulse.md` | `c5b761195510da15506a0f87654391ee662ac8fc` | 0 / 0 | Count、Cost、p95/p50 Latency、受限的筛选器及禁用条款、v4 依赖已有中文描述；修正 3 个本地链接 | `da2bdde` |
| `observability/get-started.md` | `60255717c7b0d639cddf99485dcb0079f94c377d` | 顶格 9 / 26 | Agent Skill、手动安装、获取密钥、摄入 Trace、后续排错步骤存在；中文版展开了多个语言和框架示例。**代码块数量不可视作等价证据**，完整逐例运行与动态 Tab 等价性仍需另外验收 | 无需改动，保留专项待验证 |
| `prompt-management/features/variables.md` | `e1856308459b54479cf29744bec05eefe9a2a44c` | 6 / 6 | Text/Chat Prompt 创建、Python/JS Compile 和 LangChain 示例逐块比对；中文版主要删减原英文注释及折叠格式，调用结构与参数保持一致 | 无需改动 |

本批共将 **15 处**正文的官方英文文档链接切换为存在对应中文页的本站路由。保留指向外部工具、视频、资源页面等真正需要的外链。

## 不能据此宣称的事项

- 本批核对了所列关键条款和部分完整代码结构，尚未进行各页的逐句独立签收或联网 API/SDK 运行。
- `observability/get-started.md` 的 9/26 是 MDX 代码 Tab 和中文版展开示例的结构差异，不能机械判定“重复 17 组”或“已全部一致”；如最终验收要求所有交互式 Tab 完全对应，还需专项核对。
- 本项目之前的全站 VitePress 构建和结构测试与**内容完整性验收**是不同门槛。本批未部署。
