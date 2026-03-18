"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: app
 * @Date: 2025-06-18 19:12:48
 * @LastEditTime: 2025-06-19 08:41:21
 */
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet")); // 引入 helmet
const path_1 = __importDefault(require("path")); // 引入 path
const routes_1 = __importDefault(require("./routes")); // 引入集中的路由
const mode_middleware_1 = require("./middleware/mode.middleware"); // Updated import path
const app = (0, express_1.default)();
// 核心中间件
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 配置静态文件服务，用于提供上传的图片
// __dirname 指向当前文件所在的目录 (即 src)
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// --- 新增配置接口 ---
// 这个接口必须在只读中间件之前，因为它是一个GET请求，不受影响，
// 但把它放在前面逻辑更清晰。
app.get('/api/config', (req, res) => {
    res.json({
        mode: process.env.APP_MODE || 'production', // 默认为 production
    });
});
// 将只读中间件应用到所有 /api 路径
app.use('/api', mode_middleware_1.readOnlyMiddleware);
// API 路由，同样应用在 /api 路径
// Express 会按顺序执行匹配的中间件和路由
app.use('/api', routes_1.default);
exports.default = app;
