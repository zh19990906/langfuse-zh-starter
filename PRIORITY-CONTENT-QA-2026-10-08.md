# 优先级文档定点内容复查（2026-10-08）

> 范围：用户指定的第一优先级 12 篇，随后第二优先级 8 篇。均对照了当时官方 MDX 与当前中文稿；**只记实际核对的条款，不把定点检查冒充整篇最终 PASS**。没有部署。

## 第一优先级：12 篇

| 译文文件（相对 `docs/official/`） | 上游文件 Blob SHA | 本轮定点结论/修复 | 修复提交 |
| --- | --- | --- | --- |
| `compatibility.md` | `91e23483394da2f7c6bb75bdf468a20e545073c6` | 自托管 ≥3.63.0 及 SDK v4/v5 的 v3/v4 资源边界 | `6fcf643` |
| `api-and-data-platform/features/public-api.md` | `860af09590b156c537274e5c2c2837605f21631a` | Observation v2 固定筛选/JSON filter 优先级、Scores v3 字段组 | `53eff56` |
| `observability/sdk/instrumentation.md` | `8aa1c97286db749c58d77dee07adf5e3f061c8ee` | Baggage 环境传递及下游环境变量优先级；33/33 源码块一致 | `19caef8` |
| `observability/sdk/advanced-features.md` | `58beef60e8a209bca02c91f2a324902ab060b917` | 默认 Span 导出条件与已知 Instrumentation Scope；31/31 源码块一致 | `a8e3950` |
| `observability/sdk/overview.md` | `09d5c716251c79a6b2e89a798769f0dd53663a72` | 补全 OTel/Trace 图中 Input/Output 及 Trace Attributes 映射 | `018545e` |
| `evaluation/evaluation-methods/scores-via-sdk.md` | `dfe4c9433fa62bc8be26747f2d293550d9033945` | Numeric、Categorical、Boolean、Text 摄入和读取约束；29/29 源码块一致 | `854021e` |
| `evaluation/evaluation-methods/decision-models.md` | `d90d018b407990aacd65ace229e37183f9ce9029` | 限制表、Score 表、四则 FAQ 与原文核对；复用以前已提交的静态说明 | `未新改` |
| `evaluation/experiments/datasets.md` | `0cf9bc721a3c784fd3096395aa1d691d5c3e8427` | 版本随 Item 增删改归档变化、Schema 改动不会创建版本 | `e46cf61` |
| `evaluation/experiments/experiments-ci-cd.md` | `eea615317ef163d35546fab24f31039aa6f4d643` | 恢复所有 Action Input/Output（含 SDK 版本与回归失败策略）；13/13 示例一致 | `478ebfd` |
| `evaluation/experiments/experiments-via-sdk.md` | `0d7768317101c11521656d68c7370b1f79ad1850` | 可选 Webhook HMAC 签名、自定义 Header 与异步 2xx 接收要求；16/16 示例一致 | `8139069` |
| `api-and-data-platform/features/export-to-blob-storage.md` | `887600eea687c7b0b045cd9ad052f6acc3d44e93` | 114 个字段说明单元格汉化，保留 Schema 字段名/类型 | `eb54a09` |
| `administration/rbac.md` | `de01657089e64369dd4957b1085a05c950c8f172` | 10 组 Role×Scope 权限清单逐项与原文一致；补充 Project Role 可用方案 | `3d620db` |

## 第二优先级：8 篇

| 译文文件 | 上游文件 Blob SHA | 定点结论 | 修复提交 |
| --- | --- | --- | --- |
| `evaluation/get-started/online.md` | `e62ac7b003c618bce5dddbb5dceb028037007814` | 8 个上游代码块内容均存在于中文稿；4 个围栏属合并展示 | `原有说明有效` |
| `evaluation/evaluation-methods/llm-as-a-judge.md` | `6d30a394c3cfbd20d684eab6353f306dc2e1ba4d` | 恢复 Rule 的 isRootObservation JSON 例子 | `d0cf5ff` |
| `evaluation/evaluation-methods/code-evaluators.md` | `0fc40f805be0cb93580cd4402a24bf423f41c936` | 4/4 代码原文一致；2 秒超时、无网络与第三方包等限制已存在 | `原有说明有效` |
| `observability/features/multi-modality.md` | `537ac9b541d644b2f9cbcc751f4ef49c867f05dd` | 外部 S3 媒体 Feature Preview、Project 集成及 CORS 限制 | `b3b4187` |
| `observability/features/token-and-cost-tracking.md` | `1d4846155f0120ebd76d12392d2201e8d29a0eb3` | 摄入成本/用量优先于模型价格推断，适用 generation 与 embedding | `727d47d` |
| `evaluation/scores/data-model.md` | `5cc787531019ae3a8a985041f195c91ed1092f90` | 字段表及 ScoreConfig 范围、类别、1–500 字符约束已存在 | `原有说明有效` |
| `administration/authentication-and-sso.md` | `18b8205283e5892268f8a741f9194ba2eeddd345` | OIDC-only、域名验证、SSO Lockout 及 Claim 规则已有说明 | `原有说明有效` |
| `prompt-management/features/webhooks-slack-integrations.md` | `12bc16567c15824fe486e8a9a5738e0d4b25768b` | 修复 TypeScript timestamp 正则双反斜杠造成的验签失败；Python 例为注释精简版 | `b50dab6` |

## 仍需说明的验收边界

- 本轮的 **20/20** 是“指定清单已做定点复查”，不是“20/20 最终内容 PASS”。先前构建也不能证明所有 SDK、HTTP、S3、GitHub Action 示例在真实服务中运行成功。
- 对 12 篇大型技术文档，静态条款和代码完整性仍存在更深层次的逐段核对空间；特别是 Compat 的动态矩阵和实时切换日期、外部供应商行为、Blob Storage 真实对象存储 ETL，以及涉及密钥的工作流，仍需环境相关验证。不要把这些未经执行的测试标为通过。
- 已有的 113 篇站内链接/Markdown/VitePress 构建 CI 是另外的质量门槛。后续应以最新修订后的 CI 结果为准。
- 其余动态 FAQ、Ask AI、Docs MCP 等页面尚未在本轮复核。**不得因为定点补查结束而提前部署**。
