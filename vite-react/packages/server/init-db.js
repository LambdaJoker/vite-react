const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const net = require('net');

// Load environment variables
dotenv.config();

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD || '123456', 
  multipleStatements: true,
};

function checkPort(port) {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();
        const timeout = 2000;

        socket.on('connect', () => {
            socket.destroy();
            resolve(true);
        });

        socket.on('timeout', () => {
            socket.destroy();
            reject(new Error(`Timeout connecting to port ${port}`));
        });

        socket.on('error', (err) => {
            socket.destroy();
            reject(err);
        });

        socket.connect(port, 'localhost');
        socket.setTimeout(timeout);
    });
}

async function initDatabase() {
  console.log('---------------------------------------------------------');
  console.log('🔍 Checking database connection...');
  
  try {
    await checkPort(3306);
    console.log('✅ Port 3306 is open. MySQL seems to be running.');
  } catch (err) {
    console.error('❌ Error: Port 3306 is not accessible.');
    console.error('⚠️  Please ensure your MySQL service is STARTED.');
    console.error('   Common causes:');
    console.error('   1. MySQL is not installed.');
    console.error('   2. MySQL service is stopped.');
    console.error('   3. MySQL is running on a different port.');
    process.exit(1);
  }

  let connection;
  try {
    console.log('🔌 Connecting to MySQL server...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL server.');

    // Create database
    console.log('📦 Creating database my_blog if not exists...');
    await connection.query('CREATE DATABASE IF NOT EXISTS my_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ Database my_blog created or already exists.');

    // Use database
    await connection.query('USE my_blog');
    console.log('📂 Switched to my_blog database.');

    // Read SQL files
    const articlesSqlPath = path.join(__dirname, '../../../database/articles.sql');
    const skillsSqlPath = path.join(__dirname, '../../../database/skills.sql');

    console.log(`📄 Reading SQL files...`);

    let articlesSql = '';
    let skillsSql = '';

    try {
        articlesSql = fs.readFileSync(articlesSqlPath, 'utf8');
        skillsSql = fs.readFileSync(skillsSqlPath, 'utf8');
    } catch (err) {
        console.error('❌ Error reading SQL files.', err);
        // Try fallback path
        console.log('Trying alternative path...');
        const altArticlesPath = path.join(__dirname, '../../database/articles.sql'); 
        const altSkillsPath = path.join(__dirname, '../../database/skills.sql');
        if (fs.existsSync(altArticlesPath)) {
             articlesSql = fs.readFileSync(altArticlesPath, 'utf8');
             skillsSql = fs.readFileSync(altSkillsPath, 'utf8');
        } else {
             throw err;
        }
    }

    // Execute SQL
    console.log('🚀 Executing articles.sql...');
    await connection.query(articlesSql);
    console.log('✅ articles.sql executed successfully.');

    console.log('🚀 Executing skills.sql...');
    await connection.query(skillsSql);
    console.log('✅ skills.sql executed successfully.');

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('You can now start the backend server with: npm run dev');

  } catch (error) {
    console.error('\n❌ Error initializing database:', error.message);
    if (error.code === 'ECONNREFUSED') {
        console.error('⚠️  Connection refused. Is MySQL running on localhost:3306?');
        console.error('   Check your username and password in .env file.');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
