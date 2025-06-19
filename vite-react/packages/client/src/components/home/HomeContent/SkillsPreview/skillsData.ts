export interface Skill {
  icon: string;
  title: string;
  description: string;
}

export const skills: Skill[] = [
  {
    icon: '💻',
    title: '前端开发',
    description: 'React, TypeScript, Vue.js',
  },
  {
    icon: '⚡',
    title: '后端开发',
    description: 'Python, Java, Node.js',
  },
  {
    icon: '🤖',
    title: '人工智能',
    description: '机器学习, YOLO, ROS',
  },
  {
    icon: '📊',
    title: '大数据',
    description: 'Hadoop, Spark, Hive',
  },
]; 