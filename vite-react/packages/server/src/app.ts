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
  // 检查请求头或查询参数中是否带有管理员密码
  const providedPwd = req.headers['x-admin-pwd'] || req.query.pwd;
  const expectedPwd = process.env.ADMIN_PWD;

  // 如果提供了正确的密码，或者本身就是开发模式，则返回 development
  const isDevelopment = process.env.APP_MODE === 'development' || (expectedPwd && providedPwd === expectedPwd);

  res.json({
    mode: isDevelopment ? 'development' : 'production', 
  });
});

// 将只读中间件应用到所有 /api 路径
app.use('/api', readOnlyMiddleware);

// API 路由，同样应用在 /api 路径
// Express 会按顺序执行匹配的中间件和路由
app.use('/api', apiRoutes);

// 全局错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ [Global Error Handler]:', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // 防止泄露敏感的堆栈信息到前端
  const response: any = {
    error: message,
  };

  // 在开发环境下返回堆栈信息以便调试
  if (process.env.APP_MODE === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
});

export default app;