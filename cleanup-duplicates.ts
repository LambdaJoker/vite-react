import { PrismaClient } from './vite-react/packages/server/src/generated/prisma';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://28f951b9ad55271a534996c2dff10975d563ddc02f8ff7fd730a0f833f8be61e:sk__qiPB8hND5xYibE_7w_43@db.prisma.io:5432/postgres?sslmode=require"
    }
  }
});

async function cleanupDuplicates() {
  try {
    console.log('🔄 开始连接目标数据库 (Vercel Postgres)...');
    await prisma.$connect();
    console.log('✅ 成功连接');

    // 查找所有文章
    const articles = await prisma.articles.findMany({
      orderBy: { id: 'asc' }
    });

    console.log(`当前共有 ${articles.length} 篇文章。`);

    // 按标题分组，找出重复的
    const titleMap = new Map<string, number[]>();
    for (const article of articles) {
      if (!titleMap.has(article.title)) {
        titleMap.set(article.title, []);
      }
      titleMap.get(article.title)!.push(article.id);
    }

    let deletedCount = 0;
    
    // 遍历分组，保留第一个ID（最早的），删除其余的
    for (const [title, ids] of titleMap.entries()) {
      if (ids.length > 1) {
        const idsToDelete = ids.slice(1); // 排除第一个ID
        console.log(`发现重复文章: "${title}", 准备删除 ID: ${idsToDelete.join(', ')}`);
        
        await prisma.articles.deleteMany({
          where: {
            id: { in: idsToDelete }
          }
        });
        deletedCount += idsToDelete.length;
      }
    }

    if (deletedCount > 0) {
      console.log(`\n🎉 成功删除了 ${deletedCount} 篇重复文章！`);
    } else {
      console.log('\n✅ 没有发现重复的文章。');
    }

  } catch (error) {
    console.error('❌ 清理过程中发生错误:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicates();