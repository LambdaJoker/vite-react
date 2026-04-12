# 项目历史与关键决策记录

该文件用于跟踪在此项目开发期间做出的重要架构更改、性能优化、阻塞性问题及其解决方案和相关决策。（⚠️ 注意：本文件仅保留最近/最重要的 10 条历史记录）

### 1. 2026-04-12 - 优化流程规划与环境搭建
- **目标:** 补全 `OPTIMIZATION_PROCESS.md` 并搭建一个自动化的历史记录技能。
- **操作:** 创建了 Trae 技能 `history-tracker`，以确保将来的操作步骤均记录于此，并禁止在隔离沙箱中执行命令。

### 2. 2026-04-12 - 全面落实 OPTIMIZATION_PROCESS 优化项
- **目标:** 实现 `OPTIMIZATION_PROCESS.md` 中记录的待完成优化项目。
- **操作:** 增加了响应式汉堡菜单；增加了全局 `ErrorBoundary` 和 Axios 错误拦截提示；优化了后端 `getArticles` 的 `select` 字段并增加了全量文章摘要自动生成逻辑。

### 3. 2026-04-12 - 额外功能与性能优化 (Extra Features & Performance)
- **目标:** 进一步提升系统性能，增强文章阅读体验。
- **操作:** 封装了 `throttle` 和 `debounce` 函数，并将其应用到了页面的 `scroll` 监听器上；为 `ArticleDetail` 增加了解析 Markdown 生成的自动目录（TOC）以及平滑滚动功能。

### 4. 2026-04-12 - 修复 `getArticle` 接口报错 (P2028 Transaction API Error)
- **目标:** 解决由于 Prisma 事务超时导致的文章详情页白屏（获取文章失败）的问题。
- **背景:** 报错日志显示 `PrismaClientKnownRequestError: Transaction API error: Unable to start a transaction in the given time. code: 'P2028'`。这是因为原有的 `getArticle` 接口使用 `prisma.$transaction` 来包裹单次的 `update` 查询。在并发请求时，不必要的事务会导致获取锁超时。
- **操作:** 移除了 `article.controller.ts` 的 `getArticle` 方法中的 `prisma.$transaction` 包装，直接调用 `prisma.articles.update`。
- **结果:** 消除了事务获取超时的瓶颈，接口恢复正常，页面成功加载文章详情。

### 5. 2026-04-12 - 修复文章详情页 TOC 目录遮挡问题
- **目标:** 解决 Markdown 自动生成的右侧目录（TOC）覆盖并遮挡文章正文（尤其是顶部 Cover 图片和文字）的问题。
- **背景:** 之前的 CSS 使用了 `right: calc(50% - 650px)` 的定位逻辑，在屏幕不足够宽时（如 1400px 左右），目录会往左挤压，进入 `max-width: 900px` 的主内容区域。
- **操作:** 修改了 `ArticleDetail/index.css`，将 TOC 的定位由 `right` 改为了 `left: calc(50% + 480px)`，这意味着无论屏幕多大，它始终紧贴在 900px 容器右边界的外部（留出 30px 安全距离）。同时将媒体查询隐藏阈值从 1300px 提高到 1500px，确保放不下时自动隐藏。
- **结果:** 目录现在安分地待在右侧留白区域，再也不会遮挡文章和图片了。

### 6. 2026-04-12 - 确认现有性能与架构优化状态
- **目标:** 检查并确认当前项目还可以进行的优化方向。
- **背景:** 用户询问是否还有其他优化空间。
- **操作:** 经代码走查（Code Review）发现，当前项目的前端入口 `App.tsx` 已经采用了 `React.lazy()` 配合 `Suspense` 对所有的路由级页面组件（如 `HomePage`, `ArticleList`, `ArticleDetail` 等）进行了按需懒加载；同时项目中已经使用了 `Zustand` 实现了 `appStore` 和 `articleStore` 进行轻量级状态管理；SEO 方面也已经使用了 `react-helmet-async`。
- **结果:** 确认项目当前的主流前端性能优化和架构设计已经相对完善，首屏加载时间和模块拆分机制已处于较优状态。