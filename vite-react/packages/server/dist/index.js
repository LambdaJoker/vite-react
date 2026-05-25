"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: Random Glow
 * @LastEditors: Random Glow
 * @Description: 服务器入口文件
 * @Date: 2025-03-26 19:40:21
 * @LastEditTime: 2025-06-18 20:30:11
 */
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const wallpaper_service_1 = require("./services/wallpaper.service");
const PORT = process.env.PORT || 3000;
// 全局错误处理中间件
app_1.default.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: '服务器发生未知错误',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
// Vercel 环境判断 (Vercel 部署时会自动注入 VERCEL=1)
const isVercel = process.env.VERCEL === '1';
if (!isVercel) {
    const startServer = async () => {
        try {
            // 启动服务器
            app_1.default.listen(PORT, () => {
                console.log(`🚀 Server is running on port ${PORT}`);
                console.log(`✅ Application Mode: ${process.env.APP_MODE || 'production'}`);
            });
            // Start initial wallpaper scrape ONLY if mode is 'scrape'
            const mode = process.env.WALLPAPER_MODE || 'local';
            if (mode === 'scrape') {
                await (0, wallpaper_service_1.scrapeWallpapers)();
                // Set interval to scrape every 10 minutes (600,000 ms)
                setInterval(() => {
                    (0, wallpaper_service_1.scrapeWallpapers)();
                }, 10 * 60 * 1000);
            }
            else {
                console.log(`[WallpaperService] Running in '${mode}' mode. Real-time scraping is disabled.`);
            }
        }
        catch (error) {
            console.error('❌ Error starting server:', error);
            process.exit(1);
        }
    };
    startServer();
}
// 导出 app 供 Vercel Serverless Function 使用
exports.default = app_1.default;
