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
# 实用免费 API 接口大合集（附真实可用链接）

在日常开发和练手项目中，我们经常需要一些真实的数据来测试和展示。这里我整理了一份**亲测可用**的免费 API 接口集合，直接点击链接即可查看数据格式，希望能帮助到大家！

## 1. 🖼️ 图片与媒体类

### Unsplash Source API
随机获取高质量的免版权图片，非常适合用作占位图。
- **接口地址**: [https://source.unsplash.com/random/800x600](https://source.unsplash.com/random/800x600)
- **使用示例**:
  \`\`\`html
  <img src="https://source.unsplash.com/random/800x600" alt="随机图片" />
  \`\`\`

### The Dog API
随机获取一张狗狗的图片或 GIF。
- **接口地址**: [https://dog.ceo/api/breeds/image/random](https://dog.ceo/api/breeds/image/random)
- **返回格式**: JSON \`{"message": "图片URL", "status": "success"}\`

### The Cat API
和 Dog API 类似，不过是猫猫。
- **接口地址**: [https://api.thecatapi.com/v1/images/search](https://api.thecatapi.com/v1/images/search)
- **返回格式**: JSON 数组

---

## 2. 📝 文本与资讯类

### 一言 (Hitokoto)
随机返回一句唯美的、有哲理的话，适合放在博客底部或个人主页。
- **接口地址**: [https://v1.hitokoto.cn/](https://v1.hitokoto.cn/)
- **参数**: \`?c=a\` (动画), \`?c=b\` (漫画), \`?c=d\` (文学) 等
- **返回格式**: JSON \`{"hitokoto": "句子内容", "from": "出处", ...}\`

### 每日一句 (夏目漱石等)
- **接口地址**: [https://api.xygeng.cn/one](https://api.xygeng.cn/one)
- **返回格式**: JSON 

### JSONPlaceholder
**最强前端练手神器！** 提供免费的模拟 REST API，支持 GET/POST/PUT/DELETE。
- **用户列表**: [https://jsonplaceholder.typicode.com/users](https://jsonplaceholder.typicode.com/users)
- **文章列表**: [https://jsonplaceholder.typicode.com/posts](https://jsonplaceholder.typicode.com/posts)
- **待办事项**: [https://jsonplaceholder.typicode.com/todos](https://jsonplaceholder.typicode.com/todos)

---

## 3. 🛠️ 娱乐与工具类

### 随机笑话 API
获取一个随机的程序员笑话。
- **接口地址**: [https://official-joke-api.appspot.com/random_joke](https://official-joke-api.appspot.com/random_joke)
- **返回格式**: JSON \`{"setup": "铺垫", "punchline": "笑点"}\`

### 随机用户生成器 (Random User Generator)
生成逼真的随机用户数据（包含头像、姓名、邮箱、地址等），非常适合做通讯录或用户列表 demo。
- **接口地址**: [https://randomuser.me/api/](https://randomuser.me/api/)
- **获取多个**: [https://randomuser.me/api/?results=10](https://randomuser.me/api/?results=10)

### 宝可梦 API (PokeAPI)
包含精灵宝可梦的所有数据，不需要 API Key，数据极其丰富，适合做复杂的列表和详情页练手。
- **接口地址**: [https://pokeapi.co/api/v2/pokemon/ditto](https://pokeapi.co/api/v2/pokemon/ditto)
- **列表接口**: [https://pokeapi.co/api/v2/pokemon?limit=20](https://pokeapi.co/api/v2/pokemon?limit=20)

---

## 4. 🌐 其他实用接口

### GitHub 用户信息 API
获取 GitHub 用户的公开信息。
- **接口地址**: [https://api.github.com/users/LambdaJoker](https://api.github.com/users/LambdaJoker)

### 免费公网 IP 查询
- **接口地址**: [https://api.ipify.org?format=json](https://api.ipify.org?format=json)

> **💡 小贴士**：
> 1. 以上 API 均在编写本文时**免费且无需注册/API Key**即可直接调用。
> 2. 虽然是免费的，但大多数都有**频率限制（Rate Limit）**，在开发时请注意不要写死循环导致频繁发起请求，以免 IP 被封禁。
> 3. 如果在本地开发遇到 CORS（跨域）问题，可以在 Vite 中配置 proxy 代理来解决。

希望这些 API 能让你的个人项目开发更加顺利！如果有其他好用的接口，欢迎在评论区补充。
`;

async function insertArticle() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL server.');

    // 我们先更新刚才插入的那篇文章，假设它的标题是 '好用的免费 API 接口大合集'
    const sql = `
      UPDATE articles 
      SET content = ?, title = ?
      WHERE title LIKE '%免费 API%'
    `;
    
    const values = [
      articleContent,
      '实用免费 API 接口大合集（附真实可用链接）'
    ];

    const [result] = await connection.query(sql, values);
    console.log('Article updated successfully! Rows affected:', result.affectedRows);

  } catch (error) {
    console.error('Error inserting article:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

insertArticle();
