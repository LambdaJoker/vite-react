# 项目历史与关键决策记录

该文件用于跟踪在此项目开发期间做出的重要架构更改、性能优化、阻塞性问题及其解决方案和相关决策。（⚠️ 注意：本文件仅保留最近/最重要的 10 条历史记录）

### 9. 2026-04-12 - 优化文章详情页主内容宽度与目录（TOC）排版
- **目标:** 缩小文章主内容区域的宽度，使其阅读体验更紧凑舒适，同时修复目录栏被挤压的问题。
- **操作:**
  1. 将 `.article-detail-container` 的 `max-width` 从 `900px` 减小至 `800px`。
  2. 调整悬浮目录 `.table-of-contents` 的相对定位，将其 `left` 从 `calc(50% + 480px)` 更新为 `calc(50% + 430px)`，以匹配缩小后的主内容宽度。
  3. 修改了媒体查询中的样式，在屏幕宽度介于 `1200px` 和 `1500px` 时，将目录宽度稍微缩小为 `200px` 以避免相互重叠。
  4. 为目录栏 `.table-of-contents` 增加了隐藏滚动条的跨浏览器 CSS 代码。
- **结果:** 文章主内容的视觉宽度更加聚拢，右侧目录也能与正文保持合适的间距，整体排版更加精致。

### 10. 2026-04-19 - 新增动态背景获取模式配置
- **目标:** 停止后端的默认强制实时抓取，将其改为可配置的三种模式：本地随机 (local)、实时抓取 (scrape) 以及视频背景 (video)。
- **操作:**
  1. 在 `packages/server/.env` 中新增了 `WALLPAPER_MODE=local` 环境变量。
  2. 在 `wallpaper.service.ts` 的 `getRandomWallpaper` 方法中引入判断逻辑，支持通过配置返回本地缓存数据、实时抓取或固定的视频 URL，同时保留了原有抓取代码逻辑并加入注释。
  3. 修改了 `index.ts`，定时抓取任务现在只在 `WALLPAPER_MODE=scrape` 时执行。
  4. 修改了前端的 `DynamicBackground/index.tsx` 组件，现在它可以根据接口返回的 `.mp4` 或 `.webm` 链接动态渲染 `<video>` 标签播放背景视频，而不只是渲染图片。
- **结果:** 后端减少了不必要的网络请求开销，同时系统获得了极高的背景模式灵活性。

### 11. 2026-04-19 - 修复 Header 组件滚动绑定失效与 HTTP 请求头绑定问题
- **目标:** 解决“Header 有时候会出现不被绑定的情况”的 bug，确保 UI 滚动效果和管理权限请求头都能稳定生效。
- **操作:** 
  1. **UI 层面:** 修复了 `Header/index.tsx` 中使用 `document.querySelector('.header')` 试图去绑定 DOM 导致失效的问题（组件实际 class 为 `header-container`）。将其重构为 React 状态 `isScrolled` 驱动，并在 `Header/index.css` 中修正了对应的类名 `.header-container.scrolled`。
  2. **网络层面:** 修复了 `apiClient.ts` 拦截器中 HTTP 头部设置的问题。由于 Axios v1.x 之后 `config.headers` 是一个 `AxiosHeaders` 实例，直接赋值（`config.headers['x-admin-pwd'] = adminPwd`）有时会被忽略，统一重构为标准 API `config.headers.set('x-admin-pwd', adminPwd)`。
- **结果:** 页面顶部导航栏的滚动毛玻璃与阴影效果能够稳定触发，同时管理员鉴权请求头（x-admin-pwd）也能稳定携带，彻底消除了偶发的绑定失败问题。

### 12. 2026-04-19 - 重构 README.md 核心模块与设计细节文案
- **目标:** 深度挖掘项目已实现的功能与架构优势，提升开源项目说明文档的专业度和吸引力。
- **操作:** 针对 README.md 中的“核心功能”和“设计细节”部分进行了重写：
  1. 将原本干瘪的列表点（如“分类浏览”）扩展为了带有具体技术细节的段落（如“多维度检索：支持基于关键字的全文搜索、多标签交叉过滤以及分类目录浏览”）。
  2. 详细介绍了已实现的富文本创作体验、图床对接、玻璃拟态卡片设计、Framer Motion 动画微交互等亮点。
- **结果:** 进一步提升了项目文档的质量，使其能够更好地作为个人作品集或开源项目进行展示。

### 13. 2026-04-19 - 优化本地背景模式 (local mode) 的响应与轮询机制
- **目标:** 确保在修改本地壁纸 JSON 文件后前端能及时且正确地获取更新。
- **操作:** 
  1. 修改前端 `DynamicBackground/index.tsx` 组件，将动态壁纸的自动轮询拉取时间从 10 分钟缩短至 5 分钟（`300,000 ms`）。
  2. 修改后端 `wallpaper.service.ts` 的逻辑，在 `local` 模式下每次调用 `/api/wallpapers/random` 时强制重新读取并解析 `wallpapers-data.json` 文件，绕过内存级缓存。
- **结果:** 用户手动修改 `wallpapers-data.json` 后，无需重启后端服务即可生效；前端用户也会更频繁地（每5分钟）自动看到壁纸刷新。

### 14. 2026-04-19 - 修复浏览器默认缓存导致本地随机背景刷新不变的 Bug
- **目标:** 修复在 local 模式下，浏览器 F5 刷新网页时背景图片“像是被写死”始终不改变的问题。
- **原因:** 现代浏览器会对相同的 HTTP GET 请求（如 `fetch('/api/wallpapers/random')`）进行默认的启发式缓存。即使后端在每次请求时都随机挑选了新图片，但浏览器根本没有真正向后端发起请求，而是直接读取了本地磁盘缓存中的旧链接。
- **操作:**
  1. **前端:** 在 `DynamicBackground/index.tsx` 的 fetch 请求 URL 末尾追加了时间戳参数 `?t=${Date.now()}`，强制让每次请求的 URL 都不一样，从而击穿浏览器缓存。
  2. **后端:** 在 `wallpaper.controller.ts` 中手动为该接口增加了强缓存控制响应头：`Cache-Control: no-cache, no-store, must-revalidate`、`Pragma: no-cache` 以及 `Expires: 0`。
- **结果:** 双重缓存击穿机制确保了每一次（不管是定时器轮询还是手动 F5 刷新页面）都能向后端发起真实的请求，并成功获取到全新的随机背景图片。

### 15. 2026-04-19 - 应用自定义动态视频作为 video 模式背景
- **目标:** 将用户指定的本地视频 `【哲风壁纸】山峰-房屋-树木.mp4` 设置为 `WALLPAPER_MODE=video` 模式下的专属背景视频。
- **操作:**
  1. **资源迁移:** 将用户指定的视频文件通过 PowerShell 命令强行复制到了后端的公共静态资源目录 `packages/server/public/uploads/bg-video.mp4`。
  2. **逻辑更新:** 修改了后端 `wallpaper.service.ts` 中的 `video` 模式返回逻辑，使其不再返回示例链接，而是返回相对路径 `/uploads/bg-video.mp4`。
  3. **路径补全:** 更新了前端的 `DynamicBackground/index.tsx` 组件，在收到后端的相对路径后，自动补全 `VITE_API_BASE_URL` 拼接成完整的网络 URL。
  4. **重启生效:** 终止了原有的 Node 进程并重启服务，以加载最新的 `.env`（设置为 `video` 模式）及代码更改。
- **结果:** 现在当 `.env` 中 `WALLPAPER_MODE=video` 时，网站首页的动态背景将完美呈现用户指定的山峰树木高清视频。

### 16. 2026-04-19 - 修复 Vercel 部署后本地壁纸模式失效 (写死) 的 Bug
- **目标:** 解决在 Vercel 部署环境下，`local` 模式下获取不到随机壁纸，每次刷新都显示同一个默认写死图片的问题。
- **原因:** 在 Vercel 的 Serverless Function 运行时环境中，文件系统是只读的，只能向 `/tmp` 目录写入文件。原有的代码逻辑在判断 `isVercel` 为真时，将文件读取路径强行指定为了 `/tmp/wallpapers-data.json`。然而在实例刚启动、尚未执行抓取时，`/tmp` 目录是空的，导致读取不到随代码部署上传的默认壁纸数据，最终触发了 fallback，永远返回写死的默认图片。
- **操作:**
  - 修改 `wallpaper.service.ts`，区分了“临时缓存文件”(`/tmp/wallpapers-data.json`) 和“本地内置文件”(`../../public/uploads/wallpapers-data.json`)。
  - 在读取时：如果是 Vercel 环境且 `/tmp` 中有缓存则优先读取，否则**回退去读取随代码打包部署的本地内置 JSON 文件**。
  - 在写入时 (scrape 模式下)：如果是 Vercel 环境则写入 `/tmp`，否则写入本地内置文件。
- **结果:** 重新部署到 Vercel 后，即便实例刚启动（`/tmp` 为空），也能正确读取打包进来的上百张随机壁纸数据，彻底解决了被写死的假象。

### 17. 2026-04-20 - 修复 video 模式下大视频文件无法加载及拼写容错问题
- **目标:** 解决 `WALLPAPER_MODE=video` 模式下，因视频文件过大导致无法显示的问题，并兼容环境变量的拼写错误。
- **操作:** 
  1. **前端资源直出:** 将近 20MB 的视频文件从后端的 `public/uploads` 目录移动至前端的 `packages/client/public/bg-video.mp4`，利用 Vite 和部署环境（如 Vercel Edge Network）的静态资源服务直接分发，避开 Serverless 函数传输大体积媒体文件的限制。
  2. **路径适配:** 后端 `wallpaper.service.ts` 的 `video` 模式现在直接返回前端根路径 `/bg-video.mp4`；前端 `DynamicBackground` 组件新增判断，若是该静态视频路径则不再盲目拼接后端 API 的域名。
  3. **拼写容错:** 后端判断环境变量时增加了对 `vedio` 常见拼写错误的兼容 (`mode === 'video' || mode === 'vedio'`)。
- **结果:** 大体积视频背景现在能瞬间加载且不会受后端 API 带宽或 Serverless 限制影响，同时即使用户在 `.env` 中误写为 `vedio` 也能正常生效。

### 18. 2026-04-20 - 配置 Git Commit 提交信息生成规则
- **目标:** 自定义 AI 生成 Git 提交信息的风格，使其保持简洁且符合规范。
- **操作:** 在 `.trae/rules/git-commit-message.md` 中编写了基于 Conventional Commits 的简明规则，强制要求输出 `<type>(<scope>): <subject>` 格式，限制长度并禁止多余的对话和代码块包裹。
- **结果:** AI 将会根据该规则自动生成标准化且极其简洁的 Git 提交信息。