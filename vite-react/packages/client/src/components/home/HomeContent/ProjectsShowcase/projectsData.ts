import project1 from '../../../../assets/img/project/project1.jpg';
import project4 from '../../../../assets/img/project/project4.jpg';

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
    link: 'https://github.com/LambdaJoker/vite-react',
    image: project1,
  },
  {
    title: '企业级 RAG 知识库系统',
    description: '基于大模型与检索增强生成的智能问答系统',
    tech: ['LangChain', 'FastAPI', 'Milvus'],
    link: 'https://github.com/example/rag-system',
    image: project4,
  },
  {
    title: '多智能体协作框架',
    description: '自动拆解任务并协同完成开发的自主 Agent 系统',
    tech: ['Python', 'AutoGen', 'LLM'],
    link: 'https://github.com/example/multi-agent',
    image: project1,
  },
  {
    title: '基于深度学习的目标检测系统',
    description: '用于智慧社区的实时目标检测与识别系统',
    tech: ['深度学习', 'ROS', 'OpenCV'],
    link: 'https://github.com/LambdaJoker',
    image: project4,
  }
];