/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-03-26 18:22:32
 * @LastEditTime: 2025-03-26 19:54:44
 */
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 创建数据库连接池
const pool = mysql2.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'my_blog',
  waitForConnections: true,
  connectionLimit: 10, // 连接池大小
  timezone: '+08:00', // 设置时区为东八区
  charset: 'utf8mb4' // 支持表情符号
}).promise();

// 测试数据库连接
pool.getConnection()
  .then(connection => {
    console.log('✅ 数据库连接成功');
    connection.release();
  })
  .catch(error => {
    console.error('❌ 数据库连接失败:', error);
    process.exit(1);
  });

export default pool;
