/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: 服务器入口文件
 * @Date: 2025-03-26 19:40:21
 * @LastEditTime: 2025-06-18 20:30:11
 */
import app from './app';
import { Request, Response, NextFunction } from 'express';

const PORT = process.env.PORT || 3000;

// 全局错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: '服务器发生未知错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
}); 