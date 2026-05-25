"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: Random Glow
 * @LastEditors: Random Glow
 * @Description: app
 * @Date: 2025-06-18 19:12:48
 * @LastEditTime: 2025-06-19 08:41:21
 */
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet")); // 引入 helmet
const compression_1 = __importDefault(require("compression")); // 引入 compression
const path_1 = __importDefault(require("path")); // 引入 path
const routes_1 = __importDefault(require("./routes")); // 引入集中的路由
const mode_middleware_1 = require("./middleware/mode.middleware"); // Updated import path
const app = (0, express_1.default)();
// 核心中间件
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use((0, compression_1.default)()); // 开启 Gzip 压缩，优化响应体积
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 配置静态文件服务，用于提供上传的图片
// __dirname 指向当前文件所在的目录 (即 src)
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
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
app.use('/api', mode_middleware_1.readOnlyMiddleware);
// API 路由，同样应用在 /api 路径
// Express 会按顺序执行匹配的中间件和路由
app.use('/api', routes_1.default);
// 全局错误处理中间件
app.use((err, _req, res, _next) => {
    console.error('❌ [Global Error Handler]:', err);
    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    // 防止泄露敏感的堆栈信息到前端
    const response = {
        error: message,
    };
    // 在开发环境下返回堆栈信息以便调试
    if (process.env.APP_MODE === 'development') {
        response.stack = err.stack;
    }
    res.status(statusCode).json(response);
});
exports.default = app;
