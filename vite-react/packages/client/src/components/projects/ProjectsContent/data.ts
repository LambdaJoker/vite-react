import { Project } from './types';

export const projects: Project[] = [
  {
    id: 1,
    title: "个人博客系统",
    description: "基于 React + TypeScript 的现代化博客系统，支持文章管理、技术栈展示等功能",
    category: "Web开发",
    technologies: ["React", "TypeScript", "Node.js", "MongoDB"],
    image: "/src/assets/img/project/project1.jpg",
    demoUrl: "https://blog.example.com",
    githubUrl: "https://github.com/example/blog",
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
    title: "大数据分析平台",
    description: "企业级大数据处理和分析平台，支持数据采集、处理、分析和可视化",
    category: "大数据",
    technologies: ["Hadoop", "Spark", "Python", "React"],
    image: "/src/assets/img/project/project2.jpg",
    demoUrl: "https://bigdata.example.com",
    githubUrl: "https://github.com/example/bigdata",
    highlights: [
      "分布式数据处理架构",
      "实时数据分析功能",
      "可视化数据报表",
      "高性能数据查询优化"
    ],
    period: "2023.08 - 2023.12",
    role: "后端开发"
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
      "99.9%系统可用性"
    ],
    period: "2023.05 - 2023.07",
    role: "算法工程师"
  },
  {
    id: 4,
    title: "微服务架构系统",
    description: "基于 Spring Cloud 的微服务架构系统，支持高并发和分布式部署",
    category: "后端开发",
    technologies: ["Spring Cloud", "Docker", "Kubernetes", "MySQL"],
    image: "/src/assets/img/project/project4.jpg",
    demoUrl: "https://microservice.example.com",
    githubUrl: "https://github.com/example/microservice",
    highlights: [
      "服务注册与发现",
      "分布式配置管理",
      "服务熔断与降级",
      "容器化部署方案"
    ],
    period: "2023.01 - 2023.04",
    role: "架构师"
  },
  // ... 可以添加更多项目
]; 