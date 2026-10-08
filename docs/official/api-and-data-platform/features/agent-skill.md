---
title: agent skill
description: Langfuse 官方文档的中文翻译与适配。
---

# Langfuse Agent Skill

Langfuse Agent Skill 帮助 AI 编程助手更有效地使用 Langfuse，遵循开放的 [Agent Skills](https://github.com/anthropics/skills) 规范，支持 Claude Code、Cursor、Windsurf 等兼容工具。项目[源代码](https://github.com/langfuse/skills)公开可用。

## 为什么使用？

Skill 为编码助手提供 Langfuse 推荐的埋点、提示词迁移和数据访问实践。文件夹中以 `SKILL.md` 为入口，`references/` 包含 `cli.md`、`instrumentation.md` 和 `prompt-migration.md` 等参考文档。采用渐进式加载：只在需要时读取详细资料，以减少上下文占用。

## 安装

官方提供交互式安装组件，静态站改用[官方安装说明](https://langfuse.com/docs/api-and-data-platform/features/agent-skill#install)。

安装后，可以要求 Agent：

- 查找最近 10 条评分低于 0.5 的 Trace。
- 创建名为 `edge-cases` 的数据集并添加测试项。
- 将 `src/agent.ts` 中的系统提示词迁移到 Langfuse。

## 相关资源

[Langfuse for Agents](https://langfuse.com/agents) · [GitHub Skills](https://github.com/langfuse/skills) · [CLI](/official/api-and-data-platform/features/cli) · [MCP Server](https://langfuse.com/docs/api-and-data-platform/features/mcp-server)

原文：[Agent Skill](https://langfuse.com/docs/api-and-data-platform/features/agent-skill)。安装交互组件未迁移。
