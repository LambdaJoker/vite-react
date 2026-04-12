import { Project } from './types.ts';

export const projects: Project[] = [
  {
    id: 1,
    title: "个人博客系统",
    description: "基于 React + TypeScript 的现代化博客系统，支持文章管理、技术栈展示等功能",
    category: "Web开发",
    technologies: ["React", "TypeScript", "Node.js", "Vercel"],
    image: "/src/assets/img/project/project1.jpg",
    demoUrl: "https://blog.example.com",
    githubUrl: "https://github.com/LambdaJoker/vite-react",
    highlights: [
      "使用 React Hooks 实现状态管理",
      "采用 TypeScript 确保类型安全",
      "响应式设计，支持多端适配",
      "SEO 优化和性能优化"
    ],
    period: "2024.01 - 2024.02",
    role: "全栈开发"
  },
  {
    id: 2,
    title: "企业级 RAG 知识库系统",
    description: "基于大语言模型（LLM）和检索增强生成（RAG）技术的企业级智能问答系统，支持多格式文档解析与精准召回。",
    category: "大模型",
    technologies: ["LangChain", "FastAPI", "Milvus", "OpenAI"],
    image: "/src/assets/img/project/project4.jpg",
    demoUrl: "https://rag.example.com",
    githubUrl: "https://github.com/example/rag-system",
    highlights: [
      "实现了基于语义的混合检索策略",
      "支持 PDF、Word、Markdown 等多格式文档的高效解析与向量化",
      "通过 Prompt 工程有效降低了模型幻觉",
      "流式输出（Streaming）提升用户问答体验"
    ],
    period: "2024.05 - 2024.08",
    role: "AI 算法工程师"
  },
  {
    id: 3,
    title: "多智能体协作框架 (Multi-Agent)",
    description: "一个基于任务规划和角色分配的自主智能体协作框架，能够自动拆解复杂任务并协同完成代码编写与测试。",
    category: "Agent",
    technologies: ["Python", "AutoGen", "Docker", "LLM"],
    image: "/src/assets/img/project/project1.jpg",
    demoUrl: "https://agent.example.com",
    githubUrl: "https://github.com/example/multi-agent",
    highlights: [
      "设计了 Planner、Coder、Reviewer 等多角色 Agent 协同机制",
      "集成安全的沙箱环境（Docker）用于代码自动执行与验证",
      "实现了 Agent 之间的记忆共享与反思机制（Reflection）",
      "在特定代码生成评测集上达到 85% 的一次通过率"
    ],
    period: "2024.09 - 2024.11",
    role: "Agent 研发工程师"
  },
  {
    id: 4,
    title: "基于深度学习的目标检测系统",
    description: "一个用于智慧社区的实时目标检测与识别系统，结合了ROS机器人操作系统与先进的计算机视觉技术。",
    category: "人工智能",
    technologies: ["深度学习", "ROS", "OpenCV", "图像分割"],
    image: "/src/assets/img/project/project4.jpg",
    demoUrl: "https://yolo.example.com",
    githubUrl: "https://github.com/LambdaJoker",
    highlights: [
      "实现基于深度学习的高精度目标检测算法",
      "集成ROS实现机器人自主导航与识别",
      "应用图像分割技术提取关键区域",
      "在复杂场景下达到高召回率与准确率"
    ],
    period: "2024.10 - 2024.12",
    role: "算法工程师"
  }
];