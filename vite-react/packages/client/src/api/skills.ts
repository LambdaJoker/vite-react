/*
 * @Author: taotao
 * @Description: 技能管理相关的 API 函数
 */
import { Skill } from '../types/skill';

// 技能分类
export const SKILL_CATEGORIES = [
  '编程语言',
  '框架工具',
  '数据库',
  '云服务',
  '开发工具',
  '软技能',
];

// 获取技能分类
export const getSkillCategories = async (): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return SKILL_CATEGORIES;
};

// 创建新技能
export const createSkill = async (skillData: Omit<Skill, 'id'>): Promise<Skill> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const newSkill: Skill = {
    id: Math.floor(Math.random() * 10000) + 1, // 生成1-10000之间的随机ID
    ...skillData
  };

  return newSkill;
};

// 更新技能
export const updateSkill = async (id: number, skillData: Omit<Skill, 'id'>): Promise<Skill> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const updatedSkill: Skill = {
    id,
    ...skillData
  };

  return updatedSkill;
};

// 获取技能列表
export const getSkills = async (): Promise<Skill[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return []; // 返回空数组，模拟没有技能的情况
};

// 删除技能
export const deleteSkill = async (id: number): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // 模拟删除操作，实际上什么都不做
}; 