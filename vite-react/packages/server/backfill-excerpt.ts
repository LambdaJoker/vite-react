import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('开始填充 excerpt 字段...');
  const articles = await prisma.articles.findMany({
    where: {
      OR: [
        { excerpt: null },
        { excerpt: '' }
      ]
    },
    select: { id: true, content: true }
  });

  console.log(`找到 ${articles.length} 篇文章需要更新。`);

  for (const article of articles) {
    if (article.content) {
      const excerpt = article.content.slice(0, 400);
      await prisma.articles.update({
        where: { id: article.id },
        data: { excerpt }
      });
      console.log(`已更新文章 ID: ${article.id}`);
    }
  }

  console.log('完成。');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
