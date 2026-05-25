"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.getRandom = void 0;
const wallpaper_service_1 = require("../services/wallpaper.service");
const getRandom = async (req, res) => {
    try {
        // 禁用此接口的浏览器缓存，确保每次请求都能获取到随机壁纸
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        const isMobile = req.query.isMobile === 'true';
        const url = await (0, wallpaper_service_1.getRandomWallpaper)(isMobile);
        res.json({ success: true, data: { url } });
    }
    catch (error) {
        res.status(500).json({ success: false, message: '获取壁纸失败' });
    }
};
exports.getRandom = getRandom;
const getAll = async (req, res) => {
    try {
        const urls = await (0, wallpaper_service_1.getAllWallpapers)();
        res.json({ success: true, data: urls });
    }
    catch (error) {
        res.status(500).json({ success: false, message: '获取壁纸失败' });
    }
};
exports.getAll = getAll;
