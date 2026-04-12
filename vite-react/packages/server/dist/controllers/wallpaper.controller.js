"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.getRandom = void 0;
const wallpaper_service_1 = require("../services/wallpaper.service");
const getRandom = async (req, res) => {
    try {
        const url = await (0, wallpaper_service_1.getRandomWallpaper)();
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
