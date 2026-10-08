# Langfuse 中文文档站（非官方原型）

这是一版可独立部署的 VitePress 中文学习站，包含首页、6 篇中文入门/功能导览及翻译说明。**不是 Langfuse 英文文档的完整镜像或逐页翻译，也不包含 Langfuse 服务端或 GPT 聊天功能。**

## 本地运行

要求：Node.js 20+，npm。

```bash
npm install
npm run dev
```

开发地址通常为 http://localhost:5173 。生产构建：

```bash
npm run build
npm run preview
```

## GitHub Pages 自动部署

1. 新建空的 GitHub 仓库，例如 `langfuse-zh`，将本目录的文件（包括隐藏的 `.github` 文件夹）推送到 `main` 分支。
2. 在 GitHub 仓库 Settings → Pages → Build and deployment，选择 Source = **GitHub Actions**。
3. 每次推送 `main` 会执行 `.github/workflows/deploy.yml`，自动构建并部署。
4. 项目页地址通常是 `https://<用户名>.github.io/<仓库名>/`；工作流已自动配置相应的 VitePress `base` 路径。

## Cloudflare Pages / Vercel

项目为 VitePress 静态站：构建命令 `npm run build`，输出目录 `docs/.vitepress/dist`。默认 `DOCS_BASE=/`，适合部署于域名根路径。如需部署到子目录，配置 `DOCS_BASE=/子目录/`。

## 内容扩展

- 在 `docs/` 下新增 Markdown 文件。
- 修改 `docs/.vitepress/config.mts` 的 `sidebar` 加入导航。
- 运行 `npm run build` 检查构建。
- 每篇文档保留官方英文原文的链接，跟踪变更。

## 权利与标识

非官方学习项目。当前正文是依据官方材料独立撰写的中文概念介绍，并非完整翻译。大规模翻译或复用文档素材前，请核查 [Langfuse Docs 仓库](https://github.com/langfuse/langfuse-docs) 最新许可条款；保留原始来源，不误导为官方版本。
