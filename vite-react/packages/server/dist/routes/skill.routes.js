"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const skill_controller_1 = require("../controllers/skill.controller");
const validateRequest_1 = __importDefault(require("../middleware/validateRequest"));
const skill_schema_1 = require("../schemas/skill.schema");
const router = express_1.default.Router();
// 获取所有技能
router.get('/', skill_controller_1.getSkills);
// 获取所有技能分类
router.get('/categories', skill_controller_1.getSkillCategories);
// 添加新技能
router.post('/', (0, validateRequest_1.default)(skill_schema_1.addSkillSchema), skill_controller_1.addSkill);
// 更新技能
router.put('/:id', skill_controller_1.updateSkill);
// 删除技能
router.delete('/:id', skill_controller_1.deleteSkill);
exports.default = router;
