export interface Bookmark {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: string;
  category: string;
}

export const bookmarksData: Bookmark[] = [
  // --- UI & 设计资源 ---
  {
    id: 'ui-1',
    title: 'Tailwind UI',
    description: '官方出品的高质量 Tailwind CSS 组件库，虽然收费但免费预览部分就能提供极多灵感。',
    url: 'https://tailwindui.com/',
    icon: '🌊',
    category: 'UI & 设计资源'
  },
  {
    id: 'ui-2',
    title: 'Framer Motion',
    description: 'React 生态中最强大的动画库，API 优雅，非常适合做复杂的交互动画。',
    url: 'https://www.framer.com/motion/',
    icon: '✨',
    category: 'UI & 设计资源'
  },
  {
    id: 'ui-3',
    title: 'Dribbble',
    description: '全球顶尖设计师的聚集地，前端开发没灵感时来这里找找布局和配色。',
    url: 'https://dribbble.com/',
    icon: '🏀',
    category: 'UI & 设计资源'
  },
  {
    id: 'ui-4',
    title: 'Radix UI',
    description: '高质量的无头 (Headless) 组件库，极度注重可访问性 (a11y) 和定制化。',
    url: 'https://www.radix-ui.com/',
    icon: '🧩',
    category: 'UI & 设计资源'
  },

  // --- 效率工具 ---
  {
    id: 'tool-1',
    title: 'Raycast',
    description: 'Mac 平台上极度好用的启动器，支持海量插件，完全可以替代 Spotlight 和 Alfred。',
    url: 'https://www.raycast.com/',
    icon: '⚡',
    category: '效率工具'
  },
  {
    id: 'tool-2',
    title: 'Vercel',
    description: '前端项目的托管神器，零配置部署，极佳的开发者体验。',
    url: 'https://vercel.com/',
    icon: '▲',
    category: '效率工具'
  },
  {
    id: 'tool-3',
    title: 'Sentry',
    description: '与 Vercel 齐名的静态网站托管与 Serverless 平台，稳定性极佳。',
    url: 'https://sentry.io/',
    icon: '🛡️',
    category: '效率工具'
  },
  {
    id: 'tool-4',
    title: 'Transform Tools',
    description: '一个万能的数据转换工具网站，支持 JSON 转 TS 接口、CSS 转 Tailwind 等各种高频需求。',
    url: 'https://transform.tools/',
    icon: '🔄',
    category: '效率工具'
  },

  // --- 技术沉淀 ---
  {
    id: 'learn-1',
    title: 'MDN Web Docs',
    description: 'Web 开发者的“圣经”，最权威的 HTML、CSS 和 JavaScript 字典。',
    url: 'https://developer.mozilla.org/',
    icon: '📖',
    category: '技术沉淀'
  },
  {
    id: 'learn-2',
    title: 'React 官方文档',
    description: '全新重写的 React 官方文档，内容极度详实，是深入学习 Hooks 和并发模式的最好教程。',
    url: 'https://react.dev/',
    icon: '⚛️',
    category: '技术沉淀'
  },
  {
    id: 'learn-3',
    title: 'Web.dev',
    description: 'Google 维护的 Web 开发者指南，包含了最新的 Web 性能优化和最佳实践。',
    url: 'https://web.dev/',
    icon: '🌐',
    category: '技术沉淀'
  },
  {
    id: 'learn-4',
    title: 'Type-Level TypeScript',
    description: '非常硬核的 TypeScript 进阶教程，带你领略类型体操的魅力。',
    url: 'https://type-level-typescript.com/',
    icon: '📘',
    category: '技术沉淀'
  },

  // --- 开源轮子 ---
  {
    id: 'os-1',
    title: 'Zustand',
    description: '极简的 React 状态管理库，没有 Redux 的繁琐模板代码，性能却非常优异。',
    url: 'https://zustand-demo.pmnd.rs/',
    icon: '🐻',
    category: '开源轮子'
  },
  {
    id: 'os-2',
    title: 'React Query',
    description: '服务端状态管理的最佳选择，轻松处理数据缓存、背景刷新和轮询。',
    url: 'https://tanstack.com/query/latest',
    icon: '📡',
    category: '开源轮子'
  },
  {
    id: 'os-3',
    title: 'Vite',
    description: '下一代前端构建工具，极速的冷启动和热更新，开发体验的巨大飞跃。',
    url: 'https://vitejs.dev/',
    icon: '⚡',
    category: '开源轮子'
  },
  {
    id: 'os-4',
    title: 'Shadcn UI',
    description: '最近非常火的 UI 理念：复制粘贴源码而不是作为依赖安装，给你 100% 的控制权。',
    url: 'https://ui.shadcn.com/',
    icon: '🖤',
    category: '开源轮子'
  },

  // --- 大模型 & Agent ---
  {
    id: 'ai-1',
    title: 'MaiBot',
    description: '多种模型协作，仿生的思考规划架构，模块化设计带来拟人化的交互体验平台。',
    url: 'https://docs.mai-mai.org/',
    icon: '🤖',
    category: '大模型 & Agent'
  },
  {
    id: 'ai-2',
    title: 'Skills',
    description: '计算机与数学职业相关的职业与技术技能集合，可以一键运行在 Manus 中。',
    url: 'https://skillsmp.com/occupations/computer-and-mathematical-occupations',
    icon: '💡',
    category: '大模型 & Agent'
  },
  {
    id: 'ai-3',
    title: 'OpenClaw',
    description: '一个自托管的 AI 智能体网关，支持连接 Discord、Slack、Telegram 等多种社交渠道到你的 AI 助手。',
    url: 'https://docs.openclaw.ai/zh-CN',
    icon: '🦞',
    category: '大模型 & Agent'
  }
];
