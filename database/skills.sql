-- 修改数据库字符集
ALTER DATABASE my_blog CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 创建技能分类表
CREATE TABLE skill_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '分类唯一标识',
    category_name VARCHAR(50) NOT NULL UNIQUE COMMENT '分类名称（如前端开发、后端开发）',
    created_at DATETIME COMMENT '创建时间',
    updated_at DATETIME COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='技能分类表';

-- 创建技能表
CREATE TABLE skills (
    skill_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '技能唯一标识',
    skill_name VARCHAR(100) NOT NULL UNIQUE COMMENT '技能名称',
    proficiency TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '掌握程度（0-100）',
    icon VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '图标标识或URL',
    description TEXT COMMENT '详细描述',
    projects TEXT COMMENT '相关项目列表（JSON字符串）',
    created_at DATETIME COMMENT '创建时间',
    updated_at DATETIME COMMENT '更新时间',
    
    -- 索引
    INDEX idx_skill_name (skill_name),
    INDEX idx_proficiency (proficiency)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='技能主表';

-- 创建技能与分类的关联表
CREATE TABLE skill_category_relations (
    relation_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '关联ID',
    skill_id INT NOT NULL COMMENT '技能ID',
    category_id INT NOT NULL COMMENT '分类ID',
    
    -- 外键约束
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES skill_categories(category_id) ON DELETE CASCADE,
    
    -- 唯一约束防止重复关联
    UNIQUE KEY uniq_skill_category (skill_id, category_id),
    
    -- 索引
    INDEX idx_skill (skill_id),
    INDEX idx_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='技能与分类关联表';

-- 插入分类
INSERT INTO skill_categories (category_name, created_at, updated_at) VALUES 
('前端开发', NOW(), NOW()),
('后端开发', NOW(), NOW()),
('人工智能', NOW(), NOW()),
('数据处理', NOW(), NOW()),
('编程语言', NOW(), NOW()),
('计算机视觉', NOW(), NOW()),
('系统与工具', NOW(), NOW()),
('运维', NOW(), NOW()),
('机器人', NOW(), NOW()),
('大数据', NOW(), NOW()),
('数据库', NOW(), NOW()),
('云计算', NOW(), NOW());

-- 插入技能
INSERT INTO skills (skill_name, proficiency, icon, description, projects) VALUES 
('Python', 89, '🐍', '熟练使用 Python 进行后端开发、数据处理和机器学习应用开发', NULL),
('SpringBoot', 75, '☕', '熟悉 SpringBoot 框架，能够开发企业级 Java 应用', NULL),
('Go', 70, '🔵', '掌握 Go 语言开发，了解并发编程和微服务架构', NULL),
('JavaScript', 80, '💛', '精通 JavaScript，熟悉现代 ES6+ 特性和异步编程', NULL),
('vue.js', 75, '🔷', '熟练使用 vue.js 进行前端开发，掌握组件化开发和状态管理', NULL),
('HTML/CSS', 80, '🎨', '掌握前端基础技术，能够构建响应式和现代化的用户界面', NULL),
('机器学习', 75, '🤖', '熟悉机器学习算法和框架，能够开发智能化应用', NULL),
('YOLO', 70, '👁️', '掌握 YOLO 目标检测算法，能够进行计算机视觉应用开发', NULL),
('Linux', 80, '🐧', '熟练使用 Linux 系统，掌握系统管理和服务器运维', NULL),
('ROS', 70, '🤖', '了解机器人操作系统，能够进行机器人应用开发', NULL),
('C语言', 75, '⚡', '掌握 C 语言开发，了解底层系统编程', NULL),
('React', 90, '🔵', '熟练使用 React 及其生态系统，包括 Hooks、Redux、React Router 等', '["个人博客系统", "企业管理平台"]'),
('TypeScript', 90, '💻', '深入理解 TypeScript 类型系统，能够构建类型安全的应用', '["个人博客系统", "企业管理平台"]'),
('Node.js', 80, '🟢', '熟练使用 Node.js 进行服务器端开发，包括 Express、Nest.js 框架', NULL),
('Hadoop', 80, '🐘', '精通 Hadoop 生态系统，包括 HDFS、MapReduce、YARN 等组件', NULL),
('Spark', 80, '🔥', '熟练使用 Spark 进行大数据处理，包括 RDD、DataFrame、Dataset 等', NULL),
('MySQL', 80, '🐬', '熟练使用 MySQL 进行数据库管理，包括索引优化、查询优化等', NULL),
('Redis', 80, '🔑', '熟练使用 Redis 进行缓存和数据存储，包括 Redis 集群、Redis 持久化等', NULL),
('MongoDB', 75, '🍃', '熟练使用 MongoDB 进行 NoSQL 数据库管理，包括索引优化、查询优化等', NULL),
('HBase', 75, '📊', '熟练使用 HBase 进行大规模数据存储和处理，了解分布式数据库架构', NULL),
('Hive', 75, '🐝', '熟练使用 Hive 进行数据仓库管理和大规模数据分析', NULL),
('Docker', 35, '🐳', '熟练使用 Docker 进行容器化部署和管理，了解容器编排技术', NULL),
('Kubernetes', 30, '☸️', '了解 Kubernetes 容器编排平台，能够进行集群部署和管理', NULL),
('AWS', 0, '☁️', '熟悉 AWS 云服务，包括 EC2、S3、Lambda 等核心服务的使用', NULL),
('阿里云', 30, '☁️', '熟悉阿里云服务，能够使用 ECS、OSS、函数计算等服务进行应用部署', NULL),
('Java', 80, '☕', '熟练使用 Java 进行企业级应用开发，掌握 JVM 调优、多线程编程等核心技术', NULL);

-- 插入技能与分类的关联关系
INSERT INTO skill_category_relations (skill_id, category_id) 
SELECT s.skill_id, c.category_id
FROM skills s, skill_categories c
WHERE 
  (s.skill_name = 'Python' AND c.category_name IN ('后端开发', '人工智能', '数据处理', '编程语言')) OR
  (s.skill_name = 'SpringBoot' AND c.category_name = '后端开发') OR
  (s.skill_name = 'Go' AND c.category_name IN ('后端开发', '编程语言')) OR
  (s.skill_name = 'JavaScript' AND c.category_name = '前端开发') OR
  (s.skill_name = 'vue.js' AND c.category_name = '前端开发') OR
  (s.skill_name = 'HTML/CSS' AND c.category_name = '前端开发') OR
  (s.skill_name = '机器学习' AND c.category_name = '人工智能') OR
  (s.skill_name = 'YOLO' AND c.category_name IN ('人工智能', '计算机视觉')) OR
  (s.skill_name = 'Linux' AND c.category_name IN ('系统与工具', '运维')) OR
  (s.skill_name = 'ROS' AND c.category_name IN ('系统与工具', '机器人')) OR
  (s.skill_name = 'C语言' AND c.category_name = '编程语言') OR
  (s.skill_name = 'React' AND c.category_name = '前端开发') OR
  (s.skill_name = 'TypeScript' AND c.category_name = '前端开发') OR
  (s.skill_name = 'Node.js' AND c.category_name = '后端开发') OR
  (s.skill_name = 'Hadoop' AND c.category_name = '大数据') OR
  (s.skill_name = 'Spark' AND c.category_name = '大数据') OR
  (s.skill_name = 'MySQL' AND c.category_name = '数据库') OR
  (s.skill_name = 'Redis' AND c.category_name = '数据库') OR
  (s.skill_name = 'MongoDB' AND c.category_name = '数据库') OR
  (s.skill_name = 'HBase' AND c.category_name IN ('大数据', '数据库')) OR
  (s.skill_name = 'Hive' AND c.category_name IN ('大数据', '数据处理')) OR
  (s.skill_name = 'Docker' AND c.category_name IN ('云计算', '系统与工具')) OR
  (s.skill_name = 'Kubernetes' AND c.category_name IN ('云计算', '系统与工具')) OR
  (s.skill_name = 'AWS' AND c.category_name = '云计算') OR
  (s.skill_name = '阿里云' AND c.category_name = '云计算') OR
  (s.skill_name = 'Java' AND c.category_name IN ('后端开发', '编程语言'));

-- 修改技能分类表的字符集
ALTER TABLE skill_categories 
CONVERT TO CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 修改技能表的字符集
ALTER TABLE skills 
CONVERT TO CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 修改关联表的字符集
ALTER TABLE skill_category_relations 
CONVERT TO CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci; 



