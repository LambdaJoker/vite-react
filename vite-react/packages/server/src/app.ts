/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: app
 * @Date: 2025-06-18 19:12:48
 * @LastEditTime: 2025-06-19 08:41:21
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet'; // 引入 helmet
import path from 'path'; // 引入 path
import apiRoutes from './routes'; // 引入集中的路由
import { readOnlyMiddleware } from './middleware/mode.middleware'; // Updated import path

const app = express();

// 核心中间件
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors());
app.use(express.json());

// 配置静态文件服务，用于提供上传的图片
// __dirname 指向当前文件所在的目录 (即 src)
app.use(express.static(path.join(__dirname, '../public')));

// --- 新增配置接口 ---
// 这个接口必须在只读中间件之前，因为它是一个GET请求，不受影响，
// 但把它放在前面逻辑更清晰。
app.get('/api/config', (req, res) => {
  res.json({
    mode: process.env.APP_MODE || 'production', // 默认为 production
  });
});

// 将只读中间件应用到所有 /api 路径
app.use('/api', readOnlyMiddleware);

// API 路由，同样应用在 /api 路径
// Express 会按顺序执行匹配的中间件和路由
app.use('/api', apiRoutes);

export default app;