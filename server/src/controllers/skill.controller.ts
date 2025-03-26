/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-03-26 18:15:07
 * @LastEditTime: 2025-03-26 19:46:42
 */
import { Request, Response, RequestHandler } from 'express';
import pool from '../db/index';

export const getSkills: RequestHandler = async (req, res) => {
  try {
    // 获取所有技能
    const [rows] = await pool.query(`
      SELECT 
        s.skill_id, s.skill_name, s.proficiency, s.icon, s.description, s.projects,
        GROUP_CONCAT(sc.category_name) AS categories
      FROM skills s
      JOIN skill_category_relations scr ON s.skill_id = scr.skill_id
      JOIN skill_categories sc ON scr.category_id = sc.category_id
      GROUP BY s.skill_id
    `);

    // 转换数据格式
    const skills = (rows as any[]).map(skill => ({
      skill_id: skill.skill_id,
      skill_name: skill.skill_name,
      proficiency: skill.proficiency,
      icon: skill.icon,
      description: skill.description,
      projects: skill.projects,
      categories: skill.categories.split(',')
    }));

    res.json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

export const getSkillCategories: RequestHandler = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT category_name FROM skill_categories');
    const categories = (rows as any[]).map(row => row.category_name);
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 