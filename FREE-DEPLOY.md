# 零银行卡部署路线

选择 **GitHub Pages 静态文档**。V0.1 的 Pages 已成功运行，不改变 master。

V0.2 官方站点含动态 Next.js API，需要把不适用于纯文档的 API 移除，才能尝试静态导出。此过程不会提供 AI 对话、API 服务或动态查询功能。

`.github/workflows/static-preview-v02.yml` 是手动触发的实验工作流：拉取官方源码、覆盖中文版、删除临时检出目录中的 API 路由，然后运行 `pnpm build:static`。成功后导出 Artifact。**它不会发布 GitHub Pages，因同一仓库 Pages 只有一个发布目标，自动发布可能覆盖 V0.1。**

GitHub → Actions → Experimental V0.2 GitHub Pages static export → Run workflow，选择 v0.2。

结果如果成功，后续再把静态版部署到单独的免费仓库，避免影响 master；如果还失败，检查新的构建错误并继续移除不支持静态导出的动态页面。

此配置仍是实验性静态导出。上游动态组件可能继续阻碍导出，不能保证静态站提供官方所有交互。
