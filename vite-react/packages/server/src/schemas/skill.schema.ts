import { z } from 'zod';

export const addSkillSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: '技能名称是必填项',
      invalid_type_error: '技能名称必须是字符串',
    }).min(1, '技能名称不能为空'),

    level: z.number({
      required_error: '掌握程度是必填项',
      invalid_type_error: '掌握程度必须是数字',
    }).min(0, '掌握程度不能小于0').max(100, '掌握程度不能大于100'),

    description: z.string({
      required_error: '技能描述是必填项',
    }).min(1, '技能描述不能为空'),

    icon: z.string().optional(),

    categories: z.array(z.string()).min(1, '至少需要一个分类'),
  }),
}); 