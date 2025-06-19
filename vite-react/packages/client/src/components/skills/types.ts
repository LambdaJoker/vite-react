export interface Skill {
  // 技能ID
  id: number;
  // 技能所属分类
  categories: string[];
  // 技能名称
  name: string;
  // 掌握程度 (0-100)
  level: number;
  // 技能图标
  icon: string;
  // 技能描述
  description: string;
  // 相关项目列表
  projects?: string[];
}

export interface NotificationItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface ApiSkillData {
  skill_id: number;
  skill_name: string;
  proficiency: number;
  description: string;
  icon: string;
  projects?: string;
  categories: string; // 从API返回的分类字符串
} 