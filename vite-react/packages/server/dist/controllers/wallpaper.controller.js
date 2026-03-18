"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.getRandom = void 0;
const wallpaper_service_1 = require("../services/wallpaper.service");
const getRandom = (req, res) => {
    try {
        const url = (0, wallpaper_service_1.getRandomWallpaper)();
        res.json({ success: true, data: { url } });
    }
    catch (error) {
        res.status(500).json({ success: false, message: '获取壁纸失败' });
    }
};
exports.getRandom = getRandom;
const getAll = (req, res) => {
    try {
        const urls = (0, wallpaper_service_1.getAllWallpapers)();
        res.json({ success: true, data: urls });
    }
    catch (error) {
        res.status(500).json({ success: false, message: '获取壁纸失败' });
    }
};
exports.getAll = getAll;
