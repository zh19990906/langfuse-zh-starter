---
title: 自定义仪表盘
description: 通过灵活指标、筛选器、可视化 Widget 和动态布局分析 LLM 应用数据。
---
# 自定义仪表盘

通过 Langfuse 自定义 Dashboard，把 LLM 应用数据转化为可行动的洞察。可按团队关注的指标构建个性化视图，从延迟与成本优化，到质量监控与用户行为分析。

自定义仪表盘建立在灵活的查询引擎上，可跨[Trace、Observation、User、Session 和 Score](/official/observability/data-model)进行聚合分析。它能帮助监测生产性能、分析用户反馈趋势、研究成本与质量的关系，支持团队根据数据作出决策。

::: info
[Langfuse v4](/official/v4) 对仪表盘行为做了部分更新，详情见[版本变化说明](https://langfuse.com/faq/all/dashboard-changes-in-v4)。
:::

[观看自定义 Dashboard 演示](https://www.youtube.com/watch?v=z6g9xmciaBE)。

## 核心能力

- **灵活查询引擎**：基于 Langfuse 数据模型，支持跨 Trace、Observation、User、Session 与 Score 的复杂聚合。
- **丰富的可视化**：折线图、柱状图、时间序列等，布局可调整。
- **高级筛选**：根据 Metadata、时间戳、用户属性和模型参数等筛选。
- **多层级聚合**：按 Trace、User 或 Session 汇总，回答复杂分析问题。
- **实时更新**：展示来自 LLM 应用的近期数据。
- **团队协作**：在项目中分享 Dashboard，统一监测。
- **官方预置 Dashboard**：延迟、成本与 Langfuse 用量等开箱即用的仪表盘。

## 快速开始

可以分两步创建自己的 Dashboard，也可以直接使用官方预置模板。

### 第 1 步：创建 Widget

Widget 是显示某项指标的独立可视化组件。

1. 打开项目中的 **Dashboards**。
2. 选择 **Widgets** 选项卡。
3. 点击 **New Widget**。
4. 配置：
   - **Data Source**：Trace、Observation 或 Score（数值、类别、布尔）；
   - **Metrics**：数量、延迟、成本、评分等；
   - **Dimensions**：User、Model、Time、Trace Name 等分组；
   - **Filters**：限制查询的数据子集；
   - **Chart Type**：选择图表类型。
5. 点击 **Save**。

[观看创建 Widget 演示](https://static.langfuse.com/docs-videos/create-widget.mov.mp4)。

### 第 2 步：创建 Dashboard

1. 打开 **Dashboards** 选项卡。
2. 点击 **New Dashboard**。
3. 输入描述性名称，例如“Production Monitoring”“Cost Analysis”“Quality Metrics”。
4. 添加已有 Widget 或创建新 Widget。
5. 通过拖放安排布局。
6. 调整 Widget 尺寸，突出重要指标。

[观看创建 Dashboard 演示](https://static.langfuse.com/docs-videos/create-dashboard.mov.mp4)。

### 使用官方预置 Dashboard

- **Latency Dashboard**：监测不同模型和用户群体的响应时间。
- **Cost Dashboard**：分析 Token 用量和成本趋势。
- **Usage Dashboard**：了解 Langfuse 平台使用情况。

官方预置 Dashboard 可以直接使用，也可编辑；仍具备拖拽、缩放、删除、添加、修改等控件。**第一次修改时**会弹出对话框，将官方 Dashboard 复制到当前项目，并将修改应用在副本上，不影响原始模板。

## 首页 Dashboard

项目的 **Home** 页面本身就是 Dashboard。默认显示官方配置的传统概览，包括 Trace、模型成本、延迟百分位、Score 和模型用量，内部使用普通 Widget。

每个项目可以自行选择首页展示哪张 Dashboard：

1. 在 Home 页面顶部打开 **Dashboard Selector**，选择 Dashboard 预览；选择会写入 URL，因此可以分享精确视图。
2. 点击 **Set as default**，将其设为整个项目的首页。该操作影响项目所有用户，需要确认。

Home 的每个 Tile 都是普通 Widget，可复制到自定义 Dashboard；也可以完全重新设计首页。

## 管理与分享 Widget

Dashboard Tile 和 Widget 库中的每行都有 **⋯ 菜单**，支持：

- **Copy to clipboard**：复制 Widget，准备粘贴到其他 Dashboard。
- **Paste to the right**：在当前 Tile 右侧插入剪贴板中的 Widget；仅在 Dashboard 可编辑且剪贴板含 Langfuse Widget 时可用。
- **Duplicate**：在当前项目复制该 Widget。
- **Download as JSON**：导出可移植的 Widget 配置。
- **Download data as CSV**：导出 Widget 当前查询结果，须等待数据加载完成，显示在 Dashboard Tile 菜单中。

Widget 库行菜单另支持 **Delete**，并提供复制、重复和 JSON 下载。

### 复制与粘贴

复制 Widget 后，可以在任何具有编辑权限的 Dashboard 中使用 **⌘/Ctrl+V**。Widget 会被添加并滚动到可见区域。

只有剪贴板含 Langfuse Widget 才会粘贴，不会改变其他内容。复制的 Widget 包含完整配置，因此可以跨 Dashboard、项目甚至 Langfuse 实例迁移；目标视图不适用的 Filter 会被删除，并显示提示。

### 导入/导出 JSON

Widget 和 Dashboard 使用**带版本号的 JSON 格式**：

- Widget：`{"$langfuseWidget": true, "version": 1, ...}`
- Dashboard：`{"$langfuseDashboard": true, "version": 1, ...}`

Dashboard 文件内联包含所有关联 Widget 的配置，不包含数据库 ID，因此可以跨项目、实例迁移。

**导出：**从 Widget 的 ⋯ 菜单点击 **Download as JSON**。

**导入：**将 Langfuse Widget 或 Dashboard JSON 文件拖到 Dashboard 上。Langfuse 验证文件后在当前项目重新创建 Widget；Dashboard 文件也会恢复原有布局。不符合格式的文件会被拒绝。

### 环境筛选器的优先级

Widget 可以拥有独立的 Environment Filter。设置后，**该 Widget 的环境条件优先于 Dashboard 环境选择器**，仅覆盖 Environment 这一维度；其余条件仍遵从 Dashboard Filter Bar。没有独立环境筛选的 Widget 则照常继承 Dashboard 环境选择。

因此，即使 Dashboard 切换到了其他环境，被固定到某环境的 Widget 仍可显示该环境的数据。

## 高级功能

### 高级筛选和分组

- **Metadata Filter**：按 Trace、Observation 的自定义元数据筛选。
- **时间筛选**：分析指定时间段，或比较不同时段。
- **用户属性**：按用户特点与行为进行细分。
- **模型参数**：按模型配置或版本筛选。
- **标签**：利用 [Trace Tag](/official/observability/features/tags) 分类。
- **Score 阈值**：按质量分数范围或用户反馈过滤。

### 图表类型

- **折线图**：延迟、成本、用量等时间趋势。
- **柱状图**：比较模型、用户或功能等类别的数值。
- **时间序列**：按时间粒度监测近期指标。
- **饼图**：显示类别数据的比例，例如用户评价分布。

### 动态布局与响应式设计

- 支持拖拽 Widget，自由分组。
- Dashboard 适应不同屏幕和设备。
- 可以放大重要指标 Widget。
- 网格系统自动保持清晰布局。

### 数据导出与集成

[观看 CSV 图表导出演示](https://static.langfuse.com/docs-videos/download%20chart%20data%20as%20csv.mp4)。

可导出 Dashboard 数据进一步分析或接入外部系统，包括：

- CSV 导出；
- 外部分析工具集成；
- 通过 [Metrics API](/official/metrics/features/metrics-api)编程访问。

完整数据导出途径见 [API 与数据平台](/official/api-and-data-platform/overview)。

### 通过 API、CLI 和 MCP 管理 Dashboard

除 UI 外，还能程序化管理 Dashboard、Tile 位置和可复用 Widget：

- **Public API**：`/api/public/unstable` 下提供 Dashboard、Placement 和 Widget 端点，参阅[Dashboard API](https://api.reference.langfuse.com/#tag/unstabledashboards)及[Widget API](https://api.reference.langfuse.com/#tag/unstabledashboardwidgets)。
- **CLI**：Langfuse [CLI](/official/api-and-data-platform/features/cli)会自动包含这些端点，可将 Dashboard 定义放入版本控制，并部署到不同项目和环境。
- **MCP Server**：Langfuse [MCP](/official/api-and-data-platform/features/mcp-server)将这些操作暴露给 AI Agent，在人工批准下构建和编辑 Dashboard；[Langfuse Assistant](/official/langfuse-assistant)也使用相同工具。

::: info
上述 API 和 MCP 工具仍属于 **Unstable**，在 Widget 与 Dashboard 契约最终确定前可能发生变化。
:::

## 使用场景

### 生产监控 Dashboard

- **错误率**：监测失败请求及其模式。
- **延迟**：不同端点的 p95/p99 响应时间。
- **吞吐量**：请求量与容量使用情况。
- **模型质量**：比较不同模型版本的准确率与质量。
- **工具调用**：追踪 API/数据库工具的调用频率与延迟。

### 成本优化 Dashboard

- 输入/输出 Token 用量趋势；
- 每用户成本，识别高消耗用户；
- 不同模型与提供商成本对比；
- 不同业务功能的成本来源。

### 质量与用户体验 Dashboard

- 点赞/点踩与详细反馈趋势；
- 质量 Score 随时间的分布；
- 用户使用各功能的行为模式；
- 不同提示词或模型版本的 A/B 测试结果。

官方动态 GitHub Discussions 未迁移。

---

原文：[Custom Dashboards](https://langfuse.com/docs/metrics/features/custom-dashboards) · 非官方中文翻译。
