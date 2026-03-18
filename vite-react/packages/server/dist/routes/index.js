"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const article_routes_1 = __importDefault(require("./article.routes"));
const skill_routes_1 = __importDefault(require("./skill.routes"));
const wallpaper_routes_1 = __importDefault(require("./wallpaper.routes"));
const router = (0, express_1.Router)();
router.use('/articles', article_routes_1.default);
router.use('/skills', skill_routes_1.default);
router.use('/wallpapers', wallpaper_routes_1.default);
exports.default = router;
