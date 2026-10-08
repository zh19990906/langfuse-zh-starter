# 内容验收证据补查（三）：SDK 升级与追踪属性（2026-10-08）

> 对照 Langfuse 官方 `langfuse/langfuse-docs` 对应 MDX，按已有 Issue #2 记录补查未重点核销的 **13 篇**。只代表列示项目的定点核查，不代表 13 篇完整逐段 PASS 或 SDK 示例已执行。未部署。

## 逐页证据

| 中文页（相对 `docs/official/`） | 上游内容 Blob SHA | 官方/中文版围栏 | 对照范围及说明 |
| --- | --- | --- | --- |
| `observability/sdk/upgrade-path/index.md` | `0ece2d831a5b9ab9efdc5edf291bd68de6ae3e38` | 0/0 | Python 和 JS/TS 迁移入口核对 |
| `observability/sdk/upgrade-path/js-v3-to-v4.md` | `c247c22c8625737c8753c80fe348adcd30049556` | 上游嵌套片段 / 中文 6 | 9 项迁移章节一一对应；上游代码围栏位于列表缩进层，常规顶格围栏统计不能直接比较 |
| `observability/sdk/upgrade-path/js-v4-to-v5.md` | `32bd3e980bd4b99181be35bdd7a3e637df665906` | 6/6 | 六组代码原样保留，Span 默认筛选、API 命名空间、弃用方法与迁移清单核对 |
| `observability/sdk/upgrade-path/python-v2-to-v3.md` | `0e7123fd47e2b6ef261e694db45ff0a34e3465e1` | 12/13 | 12 个源代码围栏原样保留；官方附带的 JS/TS v3→v4 内容在中文版指向独立中文迁移页 |
| `observability/sdk/upgrade-path/python-v3-to-v4.md` | `0c1757ed8b95fd470cc6f340f4b8f3c4c6158c80` | 11/11 | 11 段原始代码保持一致，Pydantic v2、OTel Span 过滤、Legacy API 兼容及参数校验核对 |
| `observability/features/environments.md` | `e958bd9353a31b8df319c8582860612d62b822b5` | 9/9 | 环境正则/40 字符、Client 与环境变量优先级、请求范围传播和 9 种配置示例定点核对 |
| `observability/features/users.md` | `96e686c011b88df6aa3ab0d50aee5fa0a05826c3` | 7/8 | 用户视图、框架追踪示例与深链；补入上游属性传播组件的字符串上限、时机和无效值行为 |
| `observability/features/user-feedback.md` | `6101b73d1ac65a77dbbb38940678842392531869` | 3/3 | 前端仅公钥、Trace ID 关联、显式/隐式反馈与浏览器/后端三个场景；中文代码存在排版及注释差异 |
| `observability/features/comments.md` | `5a5725ab5e8dc005d8b2e040f8658894c1c2db84` | 1/1 | Comments API 三端点、@Mention、权限、表情回应、文本锚点与数据更新后脱离状态逐项核对 |
| `observability/features/corrections.md` | `12122b582d1e96890e9ecce96aa2ab7f32c6c87c` | 6/6 | CORRECTION Score、name=output、每对象一次纠正、Python/TS/HTTP 创建与 Scores v3 获取示例核对 |
| `observability/features/tags.md` | `28bfea589f46931d752be85f761f3ef99a7d66d6` | 12/12 | 标签 200 字符限制、Trace 自动合并 Tag 与多集成示例；补入上游传播时机与无效值处理约束 |
| `observability/features/sessions.md` | `bad8010e77de97152796aed6f1b9be1b9e71c3bc` | 7/8 | Session ID 跨 Trace 归组及多个 SDK 片段；补充上游组件传播限额/时机和源文 US-ASCII 的保守限制 |
| `observability/features/releases-and-versioning.md` | `cf2391b1d2e446fa922f1b636934073d3efe393a` | 12/11 | 发布/组件版本两种语义、Python/TS/LangChain 用法；源文重复两次相同的 LANGFUSE_RELEASE shell 片段，中文只保留一次；补充版本传播上限与处理约束 |

## 确认的内容缺口及修复

上游源码 `langfuse/langfuse-docs/components/PropagationRestrictionsCallout.tsx`（Blob `17287dd806e4f5699b1c67909e9f5bd445134e51`）为 userId、sessionId、tags、version 等页面渲染关键属性传播说明：值须满足长度要求，传播尽早执行，无效值丢弃且警告。中文版此前在 Users、Sessions、Releases 页面将这一组件仅替换为“详见原文”，导致读者缺少迁移关键约束；Tags 虽有长度说明，仍缺传播时机与无效值边界。本批已恢复这四处说明：

- `observability/features/users.md`：`d0dd29a`。
- `observability/features/sessions.md`：`eab0c4d`。
- `observability/features/releases-and-versioning.md`：`5021b62`。
- `observability/features/tags.md`：`a66cd81`。

另修复 **6 页共 15 处**能明确映射的英文正文内部链接及 `#v3`、`#add-attributes`、`#scores-vs-tags` 的中文版标题锚点：

- `corrections` 2：`3ef9a1a`；`user-feedback` 2：`86382bc`。
- JS v4→v5 迁移页 2：`5ffce50`；Python v3→v4 迁移页 3：`f5674e3`。
- `users` 2：`8bf8ccc`；`tags` 4：`8a8bac6`。

## 尚未覆盖的验收条件

- 迁移代码未在实际 SDK v2/v3/v4/v5 环境或 Langfuse Server v3/v4 上运行；代码围栏数与源文本一致不等于兼容性实测。
- 各组件中的动态 GitHub Discussions、第三方 OpenTelemetry 实例与认证服务也未实现本地交互。
- 本批不复写前述内容报告，不累计虚构的最终 PASS 数。继续保持未部署状态。
