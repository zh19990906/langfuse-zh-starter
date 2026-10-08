# V0.2 独立预览部署（Render）

> 这是部署配置，不代表预览站已经开通。需要仓库所有者在 Render 中连接 GitHub 仓库并创建服务。

## 部署

1. 在 Render Dashboard 选择 New → Blueprint，授权 `zh19990906/langfuse-zh-starter` 仓库。
2. 选择仓库的 `v0.2` 分支，Render 读取根目录 `render.yaml`。
3. Render Blueprint 中可选填 `GITHUB_TOKEN`（推荐使用只读 token），用于官方 `sync-workshop` 脚本对 GitHub API 的同步请求，避免公共请求速率限制。切勿把 token 提交到 GitHub。Render 中的服务方案将产生费用，请在确认计费前检查。
4. 创建后由 Render 自动运行 `scripts/build-preview.sh`，拉取官方 `langfuse-docs`、覆盖中文版、安装依赖并构建。
5. 启动命令 `scripts/start-preview.sh`，访问 Render 分配的 https://...onrender.com/docs 。

## 注意与限制

- 此预览是 Next.js **服务端站点**，不是 GitHub Pages 静态导出，也不影响 master 的 V0.1。
- `render.yaml` 是未经过 Render 真实部署验证的初始配置。对端外部 API、环境变量、依赖和运行成本可能仍需调整。
- 官方源代码现在每次构建都获取默认分支，版本可能变化。稳定后应固定上游 Git SHA。
- 部分官方动态功能、第三方搜索与 SDK 集成依赖额外配置，预览站未保证全部可用。
- 翻译目前只有少量页面，未翻译页面保持原站英文。
- 不要将官方文档的运行项目当作 Langfuse 服务器平台本身。
