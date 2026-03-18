"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSkillSchema = void 0;
const zod_1 = require("zod");
exports.addSkillSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: '技能名称是必填项',
            invalid_type_error: '技能名称必须是字符串',
        }).min(1, '技能名称不能为空'),
        level: zod_1.z.number({
            required_error: '掌握程度是必填项',
            invalid_type_error: '掌握程度必须是数字',
        }).min(0, '掌握程度不能小于0').max(100, '掌握程度不能大于100'),
        description: zod_1.z.string({
            required_error: '技能描述是必填项',
        }).min(1, '技能描述不能为空'),
        icon: zod_1.z.string().optional(),
        categories: zod_1.z.array(zod_1.z.string()).min(1, '至少需要一个分类'),
    }),
});
