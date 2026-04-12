-- articles.sql

CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '文章唯一标识',
    title VARCHAR(255) NOT NULL COMMENT '文章标题',
    excerpt TEXT COMMENT '文章摘要',
    content TEXT COMMENT '文章完整内容',
    image VARCHAR(255) COMMENT '文章特色图片URL',
    author VARCHAR(100) DEFAULT 'Random Glow' COMMENT '文章作者',
    read_count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '阅读次数',
    category VARCHAR(100) COMMENT '文章分类',
    tags JSON COMMENT '文章标签 (JSON 数组)',
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布日期',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    -- 索引
    INDEX idx_category (category),
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';

-- 插入一些示例文章数据
INSERT INTO articles (title, excerpt, content, image, author, category, tags, date) VALUES
('初识 React：构建现代 Web 应用的基石', '本文将带你了解 React 的核心概念，包括组件、Props 和 State，帮助你快速上手。', '完整的 React 入门教程内容...', '/src/assets/img/article/article1.jpg', '开发者A', '前端开发', '["React", "JavaScript", "Web开发"]', '2024-05-20 10:00:00'),
('Node.js 异步编程的奥秘', '深入探讨 Node.js 的事件循环、回调函数、Promise 和 async/await，让你彻底搞懂异步。', '完整的 Node.js 异步编程教程内容...', '/src/assets/img/article/article2.jpg', '开发者B', '后端开发', '["Node.js", "JavaScript", "后端"]', '2024-05-18 14:30:00'),
('SQL vs NoSQL：为你的项目选择合适的数据库', '比较 SQL 和 NoSQL 数据库的优缺点，并提供选择指南，帮助你做出明智的技术决策。', '完整的数据库选型指南内容...', '/src/assets/img/article/article3.jpg', '开发者C', '数据库', '["SQL", "NoSQL", "数据库"]', '2024-05-15 09:00:00'); 