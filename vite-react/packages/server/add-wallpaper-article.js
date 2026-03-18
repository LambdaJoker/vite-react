const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD || '123456', 
  database: 'my_blog'
};

const articleContent = `
# 哲风壁纸 (HaoWallpaper) 爬取与展示

最近发现了一个非常棒的壁纸网站——[哲风壁纸](https://haowallpaper.com/)。上面的壁纸质量极高，非常适合用来做个人博客的背景或者电脑桌面。

为了方便大家预览，我写了一个简单的爬虫脚本，抓取了他们首页的一些高质量壁纸链接。你可以直接点击下方的链接，在当前页面体验**魔法预览**功能哦！

## 🌟 首页精选壁纸

这些链接都是真实可用的，点击即可在弹窗中直接预览大图：

1. [极简几何风景](https://haowallpaper.com/link/common/file/getCroppingImg/18347080643104128)
2. [赛博朋克城市夜景](https://haowallpaper.com/link/common/file/getCroppingImg/18193731367128448)
3. [唯美动漫星空](https://haowallpaper.com/link/common/file/getCroppingImg/18138684358315392)
4. [自然山水风光](https://haowallpaper.com/link/common/file/getCroppingImg/18347150586858880)

> **💡 技术分享**：
> 这个网站虽然是 Vue/Nuxt 写的单页应用，但是它的图片资源并没有做严格的防盗链（目前来看）。我们可以通过 Node.js 结合 \`axios\` 和 \`cheerio\` 直接请求 HTML，然后用正则表达式提取出里面的图片直链。

如果你也对爬虫感兴趣，不妨自己动手试试！
`;

async function insertArticle() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const sql = `
      INSERT INTO articles (title, excerpt, content, author, category, tags, date) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const values = [
      '哲风壁纸 (HaoWallpaper) 爬取与展示',
      '写了一个简单的 Node.js 爬虫，抓取了哲风壁纸首页的高清图片，快来体验文章内的魔法预览功能吧！',
      articleContent,
      'Admin',
      '技术分享',
      JSON.stringify(['爬虫', 'Node.js', '壁纸']),
    ];

    const [result] = await connection.query(sql, values);
    console.log('Article inserted successfully! ID:', result.insertId);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (connection) connection.end();
  }
}

insertArticle();