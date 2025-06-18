import { PrismaClient } from './src/generated/prisma';

// 实例化 Prisma Client
const prisma = new PrismaClient({
  // 开启日志，可以看到 Prisma 实际执行的 SQL 查询
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log("🚀 正在用 Prisma 连接数据库并查询文章...");

  try {
    const articles = await prisma.articles.findMany();

    console.log("✅ Prisma 查询执行完毕。");
    console.log("-----------------------------------------");

    if (articles.length > 0) {
      console.log(`🎉 成功！Prisma 找到了 ${articles.length} 篇文章。`);
      console.log("看来问题可能出在 Express 控制器的数据处理环节。");
      console.log("第一篇文章标题:", articles[0].title);
    } else {
      console.log(`❌ 失败！Prisma 连接成功，但没有找到任何文章。`);
      console.log("这几乎可以肯定是你的数据库连接字符串配置有误，或者连接的数据库是空的。");
      console.log("请再次检查 'server/prisma/schema.prisma' 文件中的 'url' 是否指向了你正在查看的、有数据的那个数据库。");
    }

    console.log("-----------------------------------------");

  } catch (e) {
    console.error("❌ Prisma 查询执行时发生致命错误！");
    console.error(e);
    console.log("这通常意味着数据库无法访问（例如服务未启动、防火墙、用户名或密码错误）。");
  } finally {
    // 关闭连接
    await prisma.$disconnect();
  }
}

// 执行主函数
main(); 