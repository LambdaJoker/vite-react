import project1 from '../../../../assets/img/project/project1.jpg';

export interface Project {
  title: string;
  description: string;
  tech: string[];
  link: string;
  image: string;
}

export const projects: Project[] = [
  {
    title: '个人博客系统',
    description: '基于 React + TypeScript 的现代化博客系统',
    tech: ['React', 'TypeScript', 'Node.js'],
    link: 'https://github.com/yourusername/blog',
    image: project1,
  },
  // 可以添加更多项目...
]; 