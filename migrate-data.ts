import mysql from 'mysql2/promise';
import { PrismaClient } from './vite-react/packages/server/src/generated/prisma';
import dotenv from 'dotenv';

// 加载项目根目录下的 .env 文件
dotenv.config();

// 1. 初始化目标数据库 (Vercel Postgres) 的 Prisma 客户端
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://28f951b9ad55271a534996c2dff10975d563ddc02f8ff7fd730a0f833f8be61e:sk__qiPB8hND5xYibE_7w_43@db.prisma.io:5432/postgres?sslmode=require"
    }
  }
});

// 2. 初始化源数据库 (Aiven MySQL) 的连接
// 注意：这里使用的是你 .env 里的密码，请确保密码是最新的
const sourceDbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456', 
  database: process.env.DB_NAME || 'my_blog', 
  port: parseInt(process.env.DB_PORT || '3306', 10)
};

async function migrateData() {
  let mysqlConnection;
  
  try {
    console.log('🔄 开始连接源数据库 (MySQL)...');
    mysqlConnection = await mysql.createConnection(sourceDbConfig);
    console.log('✅ 成功连接到源数据库 (MySQL)');

    console.log('🔄 开始连接目标数据库 (Vercel Postgres)...');
    await prisma.$connect();
    console.log('✅ 成功连接到目标数据库 (Vercel Postgres)');

    // --- 仅迁移 articles 表 ---
    console.log('\n📦 开始迁移 articles 表...');
    const [articlesRows] = await mysqlConnection.execute('SELECT * FROM articles');
    const articles = articlesRows as any[];
    console.log(`找到 ${articles.length} 条文章记录。`);

    let articleSuccessCount = 0;
    for (const article of articles) {
      try {
        // 将 MySQL 的 Json 字符串（如果存的是字符串）转换或直接使用
        let parsedTags = null;
        if (article.tags) {
            try {
                parsedTags = typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags;
            } catch (e) {
                parsedTags = article.tags;
            }
        }

        await prisma.articles.create({
          data: {
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            image: article.image,
            author: article.author,
            read_count: article.read_count,
            category: article.category,
            tags: parsedTags,
            date: article.date,
            created_at: article.created_at,
            updated_at: article.updated_at,
          }
        });
        articleSuccessCount++;
      } catch (err) {
        console.error(`❌ 迁移文章 [${article.title}] 失败:`, err);
      }
    }
    console.log(`✅ articles 表迁移完成: 成功 ${articleSuccessCount}/${articles.length}`);

    console.log('\n🎉 文章数据迁移工作已完成！');

  } catch (error) {
    console.error('\n❌ 迁移过程中发生致命错误:', error);
  } finally {
    if (mysqlConnection) {
      await mysqlConnection.end();
    }
    await prisma.$disconnect();
  }
}

migrateData();