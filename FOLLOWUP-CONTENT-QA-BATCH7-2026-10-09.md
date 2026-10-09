# 内容验收证据补查（七）：入口、版本与动态 FAQ（2026-10-09）

> 在原有 86 篇 + 第六批 14 篇记录的基础上，对最后 **13 篇尚未独立登记**的 MDX/中文 Markdown 逐页核对结构和关键说明，并修复具体可证实的问题。**13/13 是文件级定点核销，不是逐段翻译最终 PASS**；不部署。

| 文件（相对 `docs/official/`） | 官方 MDX Blob SHA | 本轮核对要点和约束 | 修复提交 |
| --- | --- | --- | --- |
| `administration/troubleshooting-and-faq.md` | `bd90b28270839c6a5e6bebe643ccd6ee294035be` | 原文管理 FAQ 是动态 FaqPreview；中文版明确说明实时内容在官方页面，未复制动态答案 | `无` |
| `demo.md` | `0580af673bfdc932cfd42d269d78acfa8fd984c3` | 共享演示、无需信用卡、体验 Trace 和反馈、动态聊天机器人替代入口；无本地可执行 Demo | `无` |
| `evaluation/scores/overview.md` | `486de2deba97031488a6ce0a3ff4c548efa01a44` | Score 数据类型、创建途径、Score vs Tag、Comment 的 TEXT 区别；修复错误的“原文”自链接 | `2003775` |
| `evaluation/troubleshooting-and-faq.md` | `8470f5fb60711b58c2ef3eb800a0d3cde0a0ffaf` | FaqPreview 和 GitHub Discussions 动态组件保留官方实时入口，未本地复制 | `无` |
| `glossary.md` | `890766e6e19496cdf109a1e150a5bd8d7883a2ea` | 原文仅提供 Glossary 动态组件；中文静态版指向官方术语入口，非离线词条全集 | `无` |
| `index.md` | `3915228d8410e77cb655c579f4bd1759431ba5f8` | 可观测性、Prompt、Evaluation、快速入门、社区入口与动态组件说明均有对应结构 | `无` |
| `langfuse-assistant.md` | `f8ae4e90bee9321899c7410d4fb4adaf09888cd7` | Cloud 各方案、自托管 >=v4.28.0 Beta、批准操作/后台运行、隐私与资源操作等关键说明 | `无` |
| `observability/overview.md` | `259f8ad7c4d4282a2f9d5c7888debabbc53b8d5e` | Tracing 作用、Getting Started、使用场景和 FAQ；修复 11 处正文内部文档链接 | `c61c425` |
| `observability/troubleshooting-and-faq.md` | `f9677af8c2c7bf01c1ace6b0ef65c3c7a13ba001` | 原文的动态 FAQ 与 GitHub Discussions 标签已在静态中文页解释并外链 | `无` |
| `prompt-management/get-started.md` | `372cd9b34ad8098ce937af9c2db28cb29190c4aa` | 创建/获取 Prompt 的复用 MDX 代码已被扩展为中文页多语言示例，删去过时的“待补齐”声明，修复 2 处链接；16 个代码围栏并不等于逐例运行 | `3346a1b` |
| `prompt-management/troubleshooting-and-faq.md` | `4f55a8260f4672656dafa68914142cbee33e3a41` | Prompt FAQ、Discussions 均动态加载，中文明确外链为实时入口 | `无` |
| `roadmap.md` | `fa6fcc15ec7ee6ca3a98a964e0bbe294e6f87c2c` | 方向性路线图、新能力/自托管/近期发布及反馈入口已体现；时间敏感内容需关注官方更新 | `无` |
| `v4.md` | `0f0ce7cccdfc2c7c631d0b54c576edbb79b20892` | v4 Observations-first、Cloud 迁移、升级和动态时间线；补回独立问题与升级问答资源入口 | `b152676` |

## 动态组件处理约定

- 官方 `FaqPreview`、`GhDiscussionsPreview`、Glossary 及 Demo 的动态交互在 VitePress 静态版中**明确标为未复刻**，链接至官方页面。替代说明完整不等于实时内容翻译完成。
- Prompt Management 入门页原先错误地说官方复用 MDX 示例「需在后续补齐」，而中文版已展开主要 Python/TypeScript/API 集成示例，现改为准确的迁移说明；尚未运行示例。
- Langfuse v4 文档的动态切换日期依赖官方组件，中文版不承诺静态日期始终准确；升级说明以实时兼容矩阵为准。

## 发布边界

至此，六份旧报告 + 第六/第七批可为 **113/113 篇**提供文件级*定点检查证据*。它仍然**不能证明 113/113 篇都完整翻译通过**，也没有全部 SDK/API/认证及动态组件的运行验收。相关剩余义务见 `FINAL-CONTENT-ACCEPTANCE.md`；没有部署。
