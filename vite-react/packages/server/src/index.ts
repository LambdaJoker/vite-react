/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: 服务器入口文件
 * @Date: 2025-03-26 19:40:21
 * @LastEditTime: 2025-06-18 20:30:11
 */
import 'dotenv/config';
import app from './app';
import { Request, Response, NextFunction } from 'express';
import { scrapeWallpapers } from './services/wallpaper.service';

const PORT = process.env.PORT || 3000;

// 全局错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: '服务器发生未知错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const startServer = async () => {
  try {
    // 启动服务器
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`✅ Application Mode: ${process.env.APP_MODE || 'production'}`);
    });

    // Start initial wallpaper scrape
    await scrapeWallpapers();

    // Set interval to scrape every 10 minutes (600,000 ms)
    setInterval(() => {
      scrapeWallpapers();
    }, 10 * 60 * 1000);

  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

startServer();
