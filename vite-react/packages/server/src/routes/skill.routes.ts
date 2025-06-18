import express from 'express';
import { getSkills, getSkillCategories, addSkill, updateSkill, deleteSkill } from '../controllers/skill.controller';
import validate from '../middleware/validateRequest';
import { addSkillSchema } from '../schemas/skill.schema';

const router = express.Router();

// 获取所有技能
router.get('/', getSkills);

// 获取所有技能分类
router.get('/categories', getSkillCategories);

// 添加新技能
router.post('/', validate(addSkillSchema), addSkill);

// 更新技能
router.put('/:id', updateSkill);

// 删除技能
router.delete('/:id', deleteSkill);

export default router; 