const { PrismaClient } = require('./src/generated/prisma'); 
const prisma = new PrismaClient(); 

async function main() { 
  await prisma.articles.updateMany({ where: { author: 'Admin' }, data: { author: 'Random Glow' } }); 
  await prisma.articles.updateMany({ where: { author: 'taotao' }, data: { author: 'Random Glow' } }); 
  await prisma.articles.updateMany({ where: { author: 'TAO' }, data: { author: 'Random Glow' } }); 
  await prisma.comments.updateMany({ where: { author: 'Admin' }, data: { author: 'Random Glow' } });
  await prisma.comments.updateMany({ where: { author: 'taotao' }, data: { author: 'Random Glow' } });
  await prisma.comments.updateMany({ where: { author: 'TAO' }, data: { author: 'Random Glow' } });
  console.log('Database author names updated to Random Glow'); 
} 

main().finally(() => prisma.$disconnect());