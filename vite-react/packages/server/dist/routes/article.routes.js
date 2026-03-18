"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: taotao
 * @LastEditors: taotao
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
// 删除文章
router.delete('/:id', article_controller_1.deleteArticle);
exports.default = router;
