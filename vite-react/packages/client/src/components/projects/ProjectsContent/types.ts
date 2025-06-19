export interface Project {
  // 项目唯一标识
  id: number;
  // 项目标题
  title: string;
  // 项目描述
  description: string;
  // 项目分类
  category: string;
  // 使用的技术栈
  technologies: string[];
  // 项目封面图片
  image: string;
  // 演示地址（可选）
  demoUrl?: string;
  // GitHub 仓库地址（可选）
  githubUrl?: string;
  // 项目亮点列表
  highlights: string[];
  // 项目周期
  period: string;
  // 担任角色
  role: string;
} 