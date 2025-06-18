/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-04-28 20:46:11
 * @LastEditTime: 2025-06-18 20:28:35
 */
import express from 'express';
import { getArticles, getArticle } from '../controllers/article.controller';

const router = express.Router();

// 获取文章列表
router.get('/', getArticles);

// 获取单篇文章
router.get('/:id', getArticle);

export default router; 