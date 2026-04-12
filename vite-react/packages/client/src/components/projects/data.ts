import { Project } from './types.ts';

export const projects: Project[] = [
  {
    id: 1,
    title: "个人博客系统",
    description: "基于 React + TypeScript 的现代化博客系统，支持文章管理、技术栈展示等功能",
    category: "Web开发",
    technologies: ["React", "TypeScript", "Node.js", "MongoDB"],
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
    title: "离线数仓搭建",
    description: "搭建企业级离线数仓，整合多源数据，提供T+1数据分析支持",
    category: "大数据",
    technologies: ["Hadoop", "Hive", "Spark", "Airflow"],
    image: "/src/assets/img/project/project2.jpg",
    demoUrl: "https://bigdata.example.com",
    githubUrl: "https://github.com/example/bigdata",
    highlights: [
      "分布式数据处理架构",
      "ETL 流程设计与优化",
      "可视化数据报表",
      "高性能数据查询优化"
    ],
    period: "2024.08 - 2024.9",
    role: "数据工程师"
  },
  {
    id: 3,
    title: "智能推荐系统",
    description: "基于机器学习的个性化推荐系统，提供精准的用户兴趣匹配",
    category: "人工智能",
    technologies: ["Python", "TensorFlow", "FastAPI", "Redis"],
    image: "/src/assets/img/project/project3.jpg",
    demoUrl: "https://recommend.example.com",
    githubUrl: "https://github.com/example/recommend",
    highlights: [
      "协同过滤算法实现",
      "实时用户行为分析",
      "千万级数据处理能力",
      "88.7%系统可用性"
    ],
    period: "2024.05 - 2024.07",
    role: "算法工程师"
  },

  {
    id: 4,
    title: "基于深度学习的目标检测系统",
    description: "一个用于智慧社区的实时目标检测与识别系统，结合了ROS机器人操作系统与先进的计算机视觉技术。",
    category: "人工智能",
    technologies: ["深度学习", "ROS", "OpenCV", "图像分割"],
    image: "/src/assets/img/project/project5.jpg",
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
  },
  // ... 可以添加更多项目
]; 