"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: Random Glow
 * @LastEditors: Random Glow
 * @Description: Do not edit
 * @Date: 2025-04-28 20:46:11
 * @LastEditTime: 2025-06-18 20:28:35
 */
const express_1 = __importDefault(require("express"));
const article_controller_1 = require("../controllers/article.controller");
const multer_middleware_1 = require("../middleware/multer.middleware"); // 引入 multer 中间件
const router = express_1.default.Router();
// 获取文章列表
router.get('/', article_controller_1.getArticles);
// 获取单篇文章
router.get('/:id', article_controller_1.getArticle);
// 创建新文章 (带图片上传)
router.post('/', multer_middleware_1.upload.single('image'), article_controller_1.createArticle);
// 更新文章
router.put('/:id', multer_middleware_1.upload.single('image'), article_controller_1.updateArticle);
// 独立图片上传接口 (用于 Markdown 编辑器或图床)
router.post('/upload-image', multer_middleware_1.upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
    }
    try {
        const { put } = await Promise.resolve().then(() => __importStar(require('@vercel/blob')));
        const blob = await put(`uploads/${Date.now()}-${req.file.originalname}`, req.file.buffer, {
            access: 'public',
        });
        res.status(200).json({ url: blob.url });
    }
    catch (error) {
        console.error('图片上传失败:', error);
        res.status(500).json({ message: '图片上传失败' });
    }
});
// 删除文章
router.delete('/:id', article_controller_1.deleteArticle);
// 点赞文章
router.post('/:id/like', article_controller_1.likeArticle);
// 获取文章评论
router.get('/:id/comments', article_controller_1.getComments);
// 添加文章评论
router.post('/:id/comments', article_controller_1.addComment);
// 删除评论
router.delete('/comments/:commentId', article_controller_1.deleteComment);
// 点赞评论
router.post('/comments/:commentId/like', article_controller_1.likeComment);
exports.default = router;
