/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-04-28 20:45:53
 * @LastEditTime: 2025-06-18 23:48:06
 */
import { Request, Response, RequestHandler } from 'express';
import { PrismaClient } from '../generated/prisma';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// 创建新文章
export const createArticle: RequestHandler = async (req, res) => {
  const { title, content, category, tags } = req.body;

  // 从 multer 中间件获取上传的文件信息
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newArticle = await prisma.articles.create({
      data: {
        title,
        content,
        category,
        // 将逗号分隔的标签字符串转为 JSON 字符串数组存储
        tags: JSON.stringify(tags.split(',').map((tag: string) => tag.trim())),
        image: imagePath,
        author: 'Admin', // 你可以根据需要修改为动态获取
        date: new Date(),
        read_count: 0,
      }
    });

    const formattedArticle = {
      ...newArticle,
      date: newArticle.date.toISOString().split('T')[0],
      tags: JSON.parse(newArticle.tags as string),
    };

    res.status(201).json(formattedArticle);
  } catch (error) {
    console.error('创建文章失败:', error);
    res.status(500).json({ message: '创建文章时发生服务器错误' });
  }
};

// 更新文章
export const updateArticle: RequestHandler = async (req, res) => {
  const articleId = parseInt(req.params.id as string, 10);
  const { title, content, category, tags } = req.body;

  try {
    // 查找现有文章以获取旧图片路径
    const existingArticle = await prisma.articles.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle) {
      res.status(404).json({ message: '文章未找到' });
      return;
    }

    let imagePath = existingArticle.image; // 默认使用旧图片

    // 如果有新文件上传，则替换旧图片
    if (req.file) {
      // 删除旧图片文件（如果存在）
      if (existingArticle.image) {
        const oldImagePath = path.join(__dirname, '../../public', existingArticle.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagePath = `/uploads/${req.file.filename}`;
    }

    const updatedArticleData = await prisma.articles.update({
      where: { id: articleId },
      data: {
        title,
        content,
        category,
        tags: JSON.stringify(tags.split(',').map((tag: string) => tag.trim())),
        image: imagePath,
      },
    });

    const formattedArticle = {
      ...updatedArticleData,
      date: updatedArticleData.date.toISOString().split('T')[0],
      tags: JSON.parse(updatedArticleData.tags as string),
    };

    res.json(formattedArticle);
  } catch (error) {
    console.error(`更新文章 #${articleId} 失败:`, error);
    res.status(500).json({ message: '更新文章时发生服务器错误' });
  }
};

// 删除文章
export const deleteArticle: RequestHandler = async (req, res) => {
  const articleId = parseInt(req.params.id as string, 10);

  try {
    // 删除文章前，先获取文章信息以找到图片路径
    const articleToDelete = await prisma.articles.findUnique({
      where: { id: articleId },
    });

    if (articleToDelete && articleToDelete.image) {
      const imagePath = path.join(__dirname, '../../public', articleToDelete.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prisma.articles.delete({
      where: { id: articleId },
    });

    res.status(204).send(); // 204 No Content 表示成功删除
  } catch (error) {
    console.error(`删除文章 #${articleId} 失败:`, error);
    if ((error as any).code === 'P2025') { // Prisma 找不到记录的错误码
      res.status(404).json({ message: '文章未找到' });
    } else {
      res.status(500).json({ message: '删除文章时发生服务器错误' });
    }
  }
};

// 获取单篇文章
export const getArticle: RequestHandler = async (req, res) => {
  const articleId = parseInt(req.params.id as string, 10);
  const shouldIncrement = req.query.increment !== 'false';

  try {
    const article = await prisma.$transaction(async (tx) => {
      if (shouldIncrement) {
        // 1. 获取文章，并更新阅读次数
        const updatedArticle = await tx.articles.update({
          where: { id: articleId },
          data: {
            read_count: {
              increment: 1,
            },
          },
        });
        return updatedArticle;
      } else {
        const foundArticle = await tx.articles.findUnique({
          where: { id: articleId },
        });
        return foundArticle;
      }
    });

    if (!article) {
      res.status(404).json({ message: '文章未找到' });
      return;
    }

    // Prisma 返回的日期是 Date 对象，前端需要 YYYY-MM-DD 格式
    const formattedArticle = {
      ...article,
      date: article.date.toISOString().split('T')[0],
      // 如果 tags 是 JSON 字符串，需要解析
      tags: typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags,
    };


    res.json(formattedArticle);
  } catch (error) {
    console.error(`获取文章 #${articleId} 失败:`, error);
    // Prisma 会在找不到记录时抛出特定错误
    if ((error as any).code === 'P2025') {
      res.status(404).json({ message: '文章未找到' });
      return;
    }
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取文章列表
export const getArticles: RequestHandler = async (req, res) => {
  try {
    const articles = await prisma.articles.findMany({
      orderBy: {
        date: 'desc',
      },
    });


    // 为每篇文章生成摘要并格式化数据
    const formattedArticles = articles.map(article => {
      let excerpt = '';
      if (article.content) {
        // 简单的摘要生成：取 content 的前 150 个字符并移除 HTML 标签
        excerpt = article.content.replace(/<[^>]+>/g, '').slice(0, 150);
      }

      return {
        ...article,
        excerpt,
        content: undefined, // 列表页不返回完整内容
        date: article.date.toISOString().split('T')[0],
        // 如果 tags 是 JSON 字符串，需要解析
        tags: typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags,
      };
    });

    res.json(formattedArticles);
  } catch (error) {
    console.error('❌ [SERVER] 获取文章列表失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 