import { Project } from './types.ts';
import blogCover from '../../assets/img/project/blog-cover.svg';
import chefAgentCover from '../../assets/img/project/chefagent-cover.svg';
import multiAgentCover from '../../assets/img/project/multi-agent-cover.svg';
import agriVisionCover from '../../assets/img/project/agrivision-cover.svg';

export const projects: Project[] = [
  {
    id: 1,
    title: "个人博客系统",
    description: "基于 React + TypeScript 的现代化博客系统，支持文章管理、技术栈展示等功能",
    category: "Web开发",
    technologies: ["React", "TypeScript", "Node.js", "Vercel"],
    image: blogCover,
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
    title: "ChefAgent - AI私厨",
    description: "一个前后端分离的多模态智能体项目，支持图片食材识别、菜谱智能推荐、私厨对话及按需联网搜索，提供沉浸式流式对话体验。",
    category: "Agent",
    technologies: ["Vue 3", "FastAPI", "LangChain", "Minimax", "Qwen-VL", "OSS"],
    image: chefAgentCover,
    githubUrl: "https://github.com/LambdaJoker/ChefAgent",
    highlights: [
      "结合视觉模型实现高精度的图片食材识别与分析",
      "基于 SSE 流式响应，打造带思考过程的沉浸式多轮对话",
      "支持多会话本地持久化、按需联网搜索及 markdown 渲染",
      "打通全栈链路，集成阿里云 OSS 实现静态资源云端管理"
    ],
    period: "2026.03 - 2026.04",
    role: "Agent开发"
  },
  {
    id: 3,
    title: "多智能体协作框架 (Multi-Agent)",
    description: "一个基于任务规划和角色分配的自主智能体协作框架，能够自动拆解复杂任务并协同完成代码编写与测试。",
    category: "Agent",
    technologies: ["Python", "AutoGen", "Docker", "LLM"],
    image: multiAgentCover,
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
    title: "融合坐标注意力机制的轻量化农作物病虫害识别方法研究与实现",
    description: "面向智慧农业场景的轻量化视觉识别项目，在 YOLOv11 架构中融合坐标注意力机制，提升复杂自然环境下农作物病虫害目标的定位、检测与分类能力。",
    category: "计算机视觉",
    technologies: ["YOLOv11", "坐标注意力机制", "PyTorch", "OpenCV", "Python"],
    image: agriVisionCover,
    githubUrl: "https://github.com/LambdaJoker/AgriVision-YOLOv11",
    highlights: [
      "融合坐标注意力机制，增强复杂背景下微小病虫害区域的空间定位与特征表达能力",
      "构建并清洗了包含十余种农作物病虫害的大规模高质量图像数据集",
      "围绕轻量化部署优化网络结构，降低模型参数量与计算开销，提升端侧推理效率",
      "在自建测试集上 mAP@0.5 达到 99.2%，满足真实农业场景的实时检测需求"
    ],
    period: "2025.01 - 2025.05",
    role: "CV 算法工程师"
  }
];
