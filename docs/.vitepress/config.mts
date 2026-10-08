import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Langfuse 中文指南',
  description: 'Langfuse 非官方中文学习站（社区原型）',
  base: process.env.DOCS_BASE || '/',
  cleanUrls: true,
  themeConfig: {
    logo: '🪢',
    nav: [
      { text: '首页', link: '/' },
      { text: '入门指南', link: '/guide/overview' },
      { text: '官方英文文档 ↗', link: 'https://langfuse.com/docs' }
    ],
    sidebar: [
      { text: '开始使用', items: [
        { text: '什么是 Langfuse', link: '/guide/overview' },
        { text: 'Python 快速接入', link: '/guide/python-quickstart' }
      ]},
      { text: '核心功能', items: [
        { text: '可观测性与追踪', link: '/features/observability' },
        { text: '提示词管理', link: '/features/prompts' },
        { text: '评估与数据集', link: '/features/evaluations' },
        { text: 'LLM Playground', link: '/features/playground' }
      ]},
      { text: '关于', items: [ { text: '翻译说明与许可', link: '/about' } ] }
    ],
    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '更新时间' },
    search: { provider: 'local', options: { translations: { button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' }, modal: { noResultsText: '没有找到结果', resetButtonTitle: '清空查询', footer: { selectText: '选择', navigateText: '切换' } } } } },
    socialLinks: [{ icon: 'github', link: 'https://github.com/langfuse/langfuse-docs' }],
    footer: { message: '非官方社区中文学习原型；内容以 Langfuse 官方文档为准。', copyright: 'Langfuse 是其权利人的商标。' }
  }
})
