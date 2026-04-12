/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-04-28 20:46:11
 * @LastEditTime: 2025-06-18 20:28:35
 */
import express from 'express';
import {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  likeArticle,
  getComments,
  addComment,
  deleteComment,
  likeComment
} from '../controllers/article.controller';
import { upload } from '../middleware/multer.middleware'; // 引入 multer 中间件

const router = express.Router();

// 获取文章列表
router.get('/', getArticles);

// 获取单篇文章
router.get('/:id', getArticle);

// 创建新文章 (带图片上传)
router.post('/', upload.single('image'), createArticle);

// 更新文章
router.put('/:id', upload.single('image'), updateArticle);

// 独立图片上传接口 (用于 Markdown 编辑器或图床)
router.post('/upload-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }
  
  try {
    const { put } = await import('@vercel/blob');
    const blob = await put(`uploads/${Date.now()}-${req.file.originalname}`, req.file.buffer, {
      access: 'public',
    });
    res.status(200).json({ url: blob.url });
  } catch (error) {
    console.error('图片上传失败:', error);
    res.status(500).json({ message: '图片上传失败' });
  }
});

// 删除文章
router.delete('/:id', deleteArticle);

// 点赞文章
router.post('/:id/like', likeArticle);

// 获取文章评论
router.get('/:id/comments', getComments);

// 添加文章评论
router.post('/:id/comments', addComment);

// 删除评论
router.delete('/comments/:commentId', deleteComment);

// 点赞评论
router.post('/comments/:commentId/like', likeComment);

export default router; 