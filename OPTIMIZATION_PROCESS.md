# 博客系统全方位优化记录 (Optimization Process)

## 1. 前端性能与构建优化 (Frontend Performance & Build Optimization)

### 目标：
- 减少首屏加载时间。
- 减小打包体积。
- 优化代码分割策略。

### 已执行的操作：
1. **安装压缩与分析插件**：
   - 安装了 `vite-plugin-compression`，开启构建时 Gzip 压缩，只有当文件体积大于 10KB 时才会生成 `.gz` 格式的压缩文件，以减小网络传输体积。
   - 安装了 `rollup-plugin-visualizer`，并在 `package.json` 中配置了 `"analyze": "ANALYZE=true vite build"` 脚本，方便日后随时查看产物体积分布。
2. **优化 Vite 代码分割 (Code Splitting) 策略**：
   - 重构了 `build.rollupOptions.output.manualChunks`，从原先硬编码的形式改成了动态函数分配机制。
   - 将依赖自动打散为：`vendor-react`, `vendor-mui`, `vendor-framer`, `vendor-markdown`, `vendor-others`。这既能利用浏览器强缓存机制（比如 React 核心库不变，缓存就不失效），又能防止出现单个 Vendor Chunk 过大的情况。
   - 配置了 `chunkFileNames`, `entryFileNames`, `assetFileNames`，使得打包输出的 `dist` 目录分类更整洁（按 js、css、字体等文件夹分类）。

### 接下来：
- 开始处理移动端的 UI 适配问题。

---

## 2. 移动端 UI 适配优化 (Mobile UI Adaptation)

### 目标：
- 确保系统在移动设备上的可用性与视觉体验。
- 解决元素挤压、布局错位（Layout Shift）等响应式问题。
- 优化移动端交互体验。

### 已执行的操作：
1. **响应式布局调整**：
   - 增加并规范全局 CSS 媒体查询（如 `@media (max-width: 768px)`），调整容器的 `padding` 和 `margin`。
   - 针对不同屏幕尺寸动态调整字体大小与行高。
2. **移动端导航与组件**：
   - 优化移动端头部 Header 和导航菜单，实现了响应式汉堡菜单折叠展开逻辑。
   - 优化弹窗、评论区的输入框等在移动端软键盘弹出时的交互。
3. **细节修复**：
   - 修复 `.main-content` 顶部外边距塌陷导致的内容被 Header 遮挡问题（已通过统一修改 `padding-top: 60px` 解决）。
   - 调整精选项目卡片的图片样式，增加 `background-size: cover` 和 `background-position: center`，避免图片在移动端变形。

---

## 3. 代码规范与异常处理 (Code Standards & Exception Handling)

### 目标：
- 提升代码可读性、可维护性。
- 保证系统在异常情况下不白屏、不崩溃，并给予用户友好提示。

### 已执行的操作：
1. **前端异常拦截与反馈**：
   - **请求层**：完善 `apiClient.ts` 中的 Axios 拦截器，统一处理 401、403、404 及 500 等常见错误，并弹出全局 Message 提示（DOM 注入式提醒）。
   - **UI 层**：引入 React Error Boundary（错误边界）并包裹了 `App`，防止单个组件渲染崩溃导致整个页面白屏，提供友好的“出错了”回退界面。
   - **资源层**：实现图片懒加载与错误处理，若图片加载失败则自动显示默认占位图或骨架屏。
2. **后端异常处理**：
   - 在 `app.ts` 中实现了全局错误处理中间件，将系统错误转化为标准格式的 JSON 响应，生产环境下避免暴露敏感堆栈信息。
   - 对数据库操作、外部 API 调用增加 `try-catch` 保护。
3. **代码规范检查**：
   - 统一使用 ESLint + Prettier 格式化代码。
   - 梳理冗余代码，移除无用依赖，确保 TypeScript 类型定义严谨（消灭 `any` 滥用）。

---

## 4. 后端接口性能优化 (Backend Performance Optimization)

### 目标：
- 缩短 API 响应时间。
- 优化 Serverless 部署环境下的冷启动和数据库连接。

### 已执行的操作：
1. **数据库连接池与优化**：
   - 迁移至 Vercel Postgres 并配置合理的 Prisma 连接池（`pgbouncer` 或 `POSTGRES_PRISMA_URL`），防止高并发时连接数打满。
   - 为高频查询字段（如文章 `category_id`、`created_at`、评论 `parent_id`）建立合适的索引。
2. **查询效率提升**：
   - 按需查询，减少 `SELECT *`，在 `getArticles` 中使用了 `select` 语法排除了巨大的 `content` 字段的传输。
   - 在文章新增/修改时动态截取 `content` 填充至 `excerpt`，避免了前端全量请求数据的性能瓶颈。
3. **Serverless 冷启动与架构调整**：
   - 移除不兼容 Serverless 的基于磁盘的本地服务（如 `multer` 磁盘存储改为 Vercel Blob）。
   - 移除常驻内存的定时任务（`setInterval`），改用懒加载机制或按需触发，降低冷启动负担。
   - 接口挂载统一前缀 `/api`，配合 Vercel 的 Rewrite 规则实现高效路由分发。
