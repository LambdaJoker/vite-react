/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: app
 * @Date: 2025-06-18 19:12:48
 * @LastEditTime: 2025-06-18 19:12:48
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet'; // 引入 helmet
import apiRoutes from './routes'; // 引入集中的路由

const app = express();

// 核心中间件
app.use(helmet()); // 增强安全性
app.use(cors());
app.use(express.json());

// API 路由
app.use('/api', apiRoutes);

export default app;