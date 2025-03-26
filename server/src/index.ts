/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: 服务器入口文件
 * @Date: 2025-03-26 19:40:21
 * @LastEditTime: 2025-03-26 19:59:44
 */
import express, { Request, Response } from 'express';
import cors from 'cors';
import { getSkills, getSkillCategories } from './controllers/skill.controller';

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(cors());

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    message: '服务器错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 路由
app.get('/api/skills', getSkills);
app.get('/api/skill-categories', getSkillCategories);

// 启动服务器
app.listen(port, () => {
  console.log(`✅ 服务器运行在 http://localhost:${port}`);
}); 