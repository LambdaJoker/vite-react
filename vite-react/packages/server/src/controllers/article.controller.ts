/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-04-28 20:45:53
 * @LastEditTime: 2025-06-18 23:48:06
 */
import { Request, Response, RequestHandler } from 'express';
import { PrismaClient } from '../generated/prisma';
import { put, del } from '@vercel/blob';

const prisma = new PrismaClient();

// 创建新文章
export const createArticle: RequestHandler = async (req, res) => {
  const { title, content, category, tags } = req.body;

  let imagePath = null;

  // 上传图片到 Vercel Blob
  if (req.file) {
    try {
      const blob = await put(req.file.originalname, req.file.buffer, {
        access: 'public',
      });
      imagePath = blob.url;
    } catch (uploadError) {
      console.error('图片上传失败:', uploadError);
      res.status(500).json({ message: '图片上传失败' });
      return;
    }
  }

  try {
    const newArticle = await prisma.articles.create({
      data: {
        title,
        content,
        excerpt: content ? content.slice(0, 400) : '',
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

    // 如果有新文件上传，上传到 Vercel Blob 并删除旧图片
    if (req.file) {
      try {
        const blob = await put(req.file.originalname, req.file.buffer, {
          access: 'public',
        });
        imagePath = blob.url;

        // 尝试删除旧图片
        if (existingArticle.image && existingArticle.image.includes('vercel-storage.com')) {
          await del(existingArticle.image);
        }
      } catch (uploadError) {
        console.error('图片更新失败:', uploadError);
        res.status(500).json({ message: '图片更新失败' });
        return;
      }
    }

    const updatedArticleData = await prisma.articles.update({
      where: { id: articleId },
      data: {
        title,
        content,
        excerpt: content ? content.slice(0, 400) : '',
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
      try {
        if (articleToDelete.image.includes('vercel-storage.com')) {
          await del(articleToDelete.image);
        }
      } catch (deleteError) {
        console.error('删除旧图片失败:', deleteError);
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
    let article;
    if (shouldIncrement) {
      // 1. 获取文章，并更新阅读次数
      // 直接使用 update，因为 update 会返回更新后的完整记录，没必要用 transaction
      article = await prisma.articles.update({
        where: { id: articleId },
        data: {
          read_count: {
            increment: 1,
          },
        },
      });
    } else {
      // 直接使用 findUnique 获取，不更新
      article = await prisma.articles.findUnique({
        where: { id: articleId },
      });
    }

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

    // 获取上一篇和下一篇文章的快捷导航信息 (只取 id 和 title)
    // 假设按照 date 倒序排列（最新发布的在最前），那么“上一篇”是日期更新的，“下一篇”是日期更旧的
    const prevArticle = await prisma.articles.findFirst({
      where: {
        date: { gt: article.date }
      },
      orderBy: { date: 'asc' }, // 找到所有比当前新的里面最旧的一个
      select: { id: true, title: true }
    });

    const nextArticle = await prisma.articles.findFirst({
      where: {
        date: { lt: article.date }
      },
      orderBy: { date: 'desc' }, // 找到所有比当前旧的里面最新的一个
      select: { id: true, title: true }
    });

    res.json({
      ...formattedArticle,
      prevArticle,
      nextArticle
    });
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
    // 使用 select 避免查询全量 content 字段，减少数据传输
    const articles = await prisma.articles.findMany({
      orderBy: {
        date: 'desc',
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        image: true,
        author: true,
        read_count: true,
        likes: true,
        category: true,
        tags: true,
        date: true,
        created_at: true,
        updated_at: true,
        _count: {
          select: { comments: true }
        }
      }
    });

    // 格式化数据
    const formattedArticles = articles.map(article => {
      return {
        ...article,
        date: article.date.toISOString().split('T')[0],
        // 如果 tags 是 JSON 字符串，需要解析
        tags: typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags,
        comment_count: article._count.comments,
        _count: undefined
      };
    });

    res.json(formattedArticles);
  } catch (error) {
    console.error('❌ [SERVER] 获取文章列表失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 

// 点赞文章
export const likeArticle: RequestHandler = async (req, res) => {
  const articleId = parseInt(req.params.id as string, 10);

  try {
    const updatedArticle = await prisma.articles.update({
      where: { id: articleId },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    res.json({ likes: updatedArticle.likes });
  } catch (error) {
    console.error(`点赞文章 #${articleId} 失败:`, error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取文章评论
export const getComments: RequestHandler = async (req, res) => {
  const articleId = parseInt(req.params.id as string, 10);

  try {
    const comments = await prisma.comments.findMany({
      where: { article_id: articleId },
      orderBy: { created_at: 'asc' }, // 改为按时间正序，更符合带回复的评论流
    });

    res.json(comments);
  } catch (error) {
    console.error(`获取文章 #${articleId} 评论失败:`, error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 发表评论
export const addComment: RequestHandler = async (req, res) => {
  const articleId = parseInt(req.params.id as string, 10);
  const { content, author, parent_id } = req.body;

  if (!content || !author) {
    res.status(400).json({ message: '评论内容和作者不能为空' });
    return;
  }

  try {
    const newComment = await prisma.comments.create({
      data: {
        content,
        author,
        article_id: articleId,
        parent_id: parent_id ? parseInt(parent_id, 10) : null,
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error(`为文章 #${articleId} 发表评论失败:`, error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 删除评论
export const deleteComment: RequestHandler = async (req, res) => {
  const commentId = parseInt(req.params.commentId as string, 10);
  try {
    await prisma.comments.delete({
      where: { id: commentId }
    });
    res.json({ message: '评论已删除' });
  } catch (error) {
    console.error(`删除评论 #${commentId} 失败:`, error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 点赞评论
export const likeComment: RequestHandler = async (req, res) => {
  const commentId = parseInt(req.params.commentId as string, 10);
  try {
    const comment = await prisma.comments.update({
      where: { id: commentId },
      data: { likes: { increment: 1 } }
    });
    res.json(comment);
  } catch (error) {
    console.error(`点赞评论 #${commentId} 失败:`, error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 