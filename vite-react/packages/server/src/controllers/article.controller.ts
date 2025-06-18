/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-04-28 20:45:53
 * @LastEditTime: 2025-06-18 19:49:57
 */
import { Request, Response, RequestHandler } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

// 获取单篇文章
export const getArticle: RequestHandler = async (req, res) => {
  const articleId = parseInt(req.params.id, 10);

  try {
    const article = await prisma.$transaction(async (tx) => {
      // 1. 获取文章，并更新阅读次数
      const updatedArticle = await tx.articles.update({
        where: { id: articleId },
        data: {
          read_count: {
            increment: 1,
          },
        },
      });

      if (!updatedArticle) {
        return null;
      }

      return updatedArticle;
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