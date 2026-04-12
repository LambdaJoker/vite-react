import { PrismaClient } from './vite-react/packages/server/src/generated/prisma';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mysql://avnadmin:AVNS_m48GZf-cQp-K50B_l_S@mysql-184c857c-tao121.b.aivencloud.com:26268/defaultdb?ssl-mode=REQUIRED"
    }
  }
});

async function main() {
  try {
    console.log("正在连接数据库...");
    const articleCount = await prisma.articles.count();
    console.log(`查询成功！articles 表中共有 ${articleCount} 条数据。`);
    
    if (articleCount > 0) {
      const firstFew = await prisma.articles.findMany({
        take: 3,
        select: { id: true, title: true, category: true, date: true }
      });
      console.log("最新几条数据样本:");
      console.table(firstFew);
    }
  } catch (error) {
    console.error("数据库查询失败:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();