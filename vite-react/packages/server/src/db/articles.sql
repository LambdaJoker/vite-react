-- 创建文章表
CREATE TABLE IF NOT EXISTS articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  date DATETIME NOT NULL,
  category VARCHAR(50) NOT NULL,
  image VARCHAR(255),
  author VARCHAR(100) NOT NULL,
  read_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建文章标签表
CREATE TABLE IF NOT EXISTS article_tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- 创建文章-标签关联表
CREATE TABLE IF NOT EXISTS article_tag_relations (
  article_id INT,
  tag_id INT,
  PRIMARY KEY (article_id, tag_id),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES article_tags(id) ON DELETE CASCADE
);

-- 插入一些示例标签
INSERT INTO article_tags (name) VALUES 
('React'),
('前端开发'),
('性能优化'),
('JavaScript'),
('TypeScript')
ON DUPLICATE KEY UPDATE name=name;

-- 插入示例文章
INSERT INTO articles (title, content, date, category, image, author, read_count) VALUES (
  'React 开发实战经验分享',
  '<h2>引言</h2>
  <p>React 作为现代前端开发中最流行的框架之一，其强大的组件化和状态管理机制为开发者提供了极大的便利...</p>
  
  <h2>性能优化技巧</h2>
  <p>1. 使用 React.memo() 避免不必要的重渲染</p>
  <p>2. 合理使用 useMemo 和 useCallback</p>
  <p>3. 使用虚拟列表处理大数据渲染</p>
  
  <h2>状态管理最佳实践</h2>
  <p>在大型应用中，合理的状态管理是至关重要的。Redux、MobX 等状态管理库各有特点...</p>',
  '2024-02-15 10:00:00',
  '技术',
  '/src/assets/img/article/article1.jpg',
  'TAO',
  10
); 
-- 记录1: Vue.js 性能优化专题
INSERT INTO articles (title, content, date, category, image, author, read_count) VALUES (
  'Vue.js 性能优化深度解析',
  '<h2>框架特性分析</h2>
  <p>Vue 3.0 引入的 Composition API 大幅提升了代码组织能力，配合 <code>v-memo</code> 指令可有效控制渲染粒度...</p>
  
  <h2>实战优化方案</h2>
  <p>1. 动态组件懒加载实现</p>
  <p>2. 虚拟滚动在表格场景的应用</p>
  <p>3. 响应式数据层级扁平化策略</p>
  
  <h2>生态工具链整合</h2>
  <p>Pinia 状态管理库与 Vite 构建工具的协同工作流优化...</p>',
  '2024-03-02 14:30:00',
  '技术',
  '/src/assets/article1.jpg',
  'TAO',
  28
);

-- 记录2: Node.js 后端开发实践
INSERT INTO articles (title, content, date, category, image, author, read_count) VALUES (
  'Node.js 高并发架构设计指南',
  '<h2>事件循环机制</h2>
  <p>通过 Libuv 线程池配置和 Cluster 模块实现真正的 CPU 资源利用率最大化...</p>
  
  <h2>内存管理技巧</h2>
  <p>1. Buffer 对象复用策略</p>
  <p>2. 内存泄漏检测工具使用</p>
  <p>3. 流式处理大文件方案</p>
  
  <h2>微服务实践</h2>
  <p>基于 NestJS 框架搭建 TypeScript 全栈工程化体系...</p>',
  '2024-03-05 09:15:00',
  '技术',
  '/src/assets/article1.jpg',
  'TAO',
  45
);

-- 记录3: 数据库优化专题
INSERT INTO articles (title, content, date, category, image, author, read_count) VALUES (
  'MySQL 索引设计与查询优化',
  '<h2>B+Tree 原理</h2>
  <p>深入解析聚簇索引与非聚簇索引的存储结构差异，覆盖索引的有效利用...</p>
  
  <h2>慢查询优化步骤</h2>
  <p>1. EXPLAIN 执行计划解读</p>
  <p>2. 索引下推技术应用</p>
  <p>3. 前缀索引使用场景分析</p>
  
  <h2>事务隔离级别</h2>
  <p>MVCC 多版本并发控制机制在 RR 和 RC 级别下的不同实现...</p>',
  '2024-03-08 16:20:00',
  '技术',
  '/src/assets/article1.jpg',
  'TAO',
  33
);

-- 插入示例文章标签关联
INSERT INTO article_tag_relations (article_id, tag_id)
SELECT 1, id FROM article_tags WHERE name IN ('React', '前端开发', '性能优化');