# 个人博客 & 技术作品集

这是一个基于 React, Node.js 和 pnpm Monorepo 构建的现代化、全栈个人网站项目。

## 🌟 核心特性

- **现代化技术栈**: 全面采用 React 18, TypeScript, Vite, Node.js, Express, Prisma 等现代化工具链。
- **Monorepo 架构**: 使用 **pnpm workspace** 进行统一的包管理和脚本执行，极大提升了开发效率和项目可维护性。
- **高性能前端**:
  - **路由懒加载**: 使用 `React.lazy` 和 `Suspense` 实现组件按需加载，优化了初始加载速度。
  - **全局状态管理**: 通过 `Zustand` 统一管理应用状态，逻辑清晰，易于扩展。
  - **统一 API 请求**: 封装 `axios` 客户端，通过拦截器集中处理请求头（鉴权）和错误提示。
  - **动态背景系统**: 支持本地缓存图片、实时爬虫抓取 (Scrape) 和动态视频 (Video) 三种模式的背景切换。
- **健壮的后端**:
  - **模块化路由**: API 路由按功能模块 (`articles`, `skills`, `wallpapers` 等) 划分，结构清晰。
  - **ORM 支持**: 使用 `Prisma` 作为 ORM，支持 PostgreSQL/MySQL，安全且高效。
  - **增强的安全性**: 通过 `helmet` 设置安全相关的 HTTP 头，并通过 `zod` 对 API 请求进行严格的校验。
  - **图床集成**: 对接 `@vercel/blob`，支持在 Markdown 编辑器中直接粘贴或拖拽上传图片。
- **专业的工程化**:
  - **代码规范**: 前后端均已配置 `ESLint` 和 `Prettier`，保证代码风格一致性和代码质量。

## 🏗️ 项目架构 (pnpm Monorepo)

本项目采用 `pnpm` 工作空间（workspace）进行管理，将前端和后端作为独立的包（package）存放在同一个代码库中。

```
vite-react/
├── packages/
│   ├── client/     # 前端 React (Vite) 应用
│   └── server/     # 后端 Node.js (Express) 应用
├── database/       # 数据库 SQL 脚本
├── pnpm-workspace.yaml # pnpm 工作区定义文件
└── package.json    # 根 package.json，用于管理整个项目
```

## 🛠️ 技术栈

| 类别         | 技术                                   |
|--------------|----------------------------------------|
| **Monorepo** | **pnpm workspace**                     |
| **前端**       | React 18, TypeScript, Vite, React Router v6, Zustand, Axios |
| **后端**       | Node.js, Express, TypeScript, Prisma, Zod, Helmet |
| **数据库**     | MySQL                                  |
| **代码规范**   | ESLint, Prettier                       |

## 🚀 启动项目

得益于 pnpm Monorepo，启动整个项目变得异常简单。

### 1. 环境准备
- 安装 [Node.js](https://nodejs.org/) (推荐 v18 或更高版本)
- 安装 [pnpm](https://pnpm.io/installation) ( `npm install -g pnpm` )
- 安装并运行 [MySQL](https://www.mysql.com/)

### 2. 数据库与环境配置
- **初始化数据库**:
  1. 登录到你的 MySQL 服务。
  2. 创建一个新的数据库 (例如 `my_blog`)。
  3. 将 `database/skills.sql` 和 `database/articles.sql` 两个文件导入到你新创建的数据库中。
- **配置后端环境变量**:
  1. 进入 `packages/server` 目录。
  2. 复制 `.env.example` 文件（如果存在的话）为 `.env`。
  3. 修改 `.env` 文件中的 `DATABASE_URL`，使其指向你的数据库。
     ```
     DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
     ```
- **配置前端环境变量**:
  1. 进入 `packages/client` 目录。
  2. 创建一个 `.env` 文件。
  3. 在文件中添加后端 API 的地址：
     ```
     VITE_API_BASE_URL=http://localhost:3000
     ```

### 3. 一键安装 & 启动
你 **只需在项目根目录 (`vite-react/`)** 下执行以下命令：

```bash
# 首先，安装所有依赖 (pnpm 会自动安装 client 和 server 的所有依赖)
pnpm install

# 然后，一键启动所有服务！
pnpm run dev:full
```

- 该命令会同时启动前端和后端开发服务器。
- **前端**将运行在 `http://localhost:5173` (或 Vite 自动选择的端口)。
- **后端**将运行在 `http://localhost:3000`。

### 其他常用命令 (在根目录执行)

- `pnpm run dev`: 只启动前端开发服务器。
- `pnpm run dev:server`: 只启动后端开发服务器。
- `pnpm --filter client lint`: 对前端代码进行检查。
- `pnpm --filter server format`: 对后端代码进行格式化。

---
这份文档现在准确地反映了您项目的现代化架构和我们共同完成的优化工作。

## 💡 核心功能 (Core Features)

本项目不仅是一个静态展示页，更是一个拥有完整后台管理能力的动态博客系统，主要包含以下核心模块：

### ✍️ 文章管理系统 (Article System)
- **多维度检索**: 支持基于关键字的全文搜索、多标签交叉过滤以及分类目录浏览。
- **时间轴归档**: 提供精美的 Archive 页面，按年月自动聚合，方便读者追溯历史思考。
- **富文本沉浸创作**: 集成 ReactMde，支持 Markdown 实时预览、拖拽/粘贴自动上传图片至 Vercel Blob。
- **互动与统计**: 内置精准的文章阅读量统计（基于 IP 去重）以及评论互动功能。

### 🚀 项目展示橱窗 (Projects Showcase)
- **玻璃拟态卡片**: 采用现代化的 Glassmorphism 风格展示个人开源项目与商业案例。
- **技术栈透视**: 为每个项目打上直观的技术标签，并提供基于技术栈的全局筛选器。
- **一键直达**: 提供 GitHub 源码链接与 Live Demo 在线预览入口。

### 🛠️ 技能罗盘 (Skills Matrix)
- **量化熟练度**: 通过直观的进度条和雷达图（计划中）量化各项前端、后端及 DevOps 技能的掌握程度。
- **领域分类**: 将技能按 “前端”、“后端”、“数据库”、“工具” 等领域结构化呈现。

## 🎨 视觉与交互设计 (Design & UX)

本项目的 UI 灵感来源于现代化的高级 SaaS 面板与极简主义博客，致力于提供极佳的阅读体验。

### 🌈 色彩与排版 (Color & Typography)
- **色彩系统**: 采用 `#007bff` 作为品牌主色调，辅以 `#f5f7fa` 的极简背景，重点突出内容本身。
- **动态背景**: 独创的背景引擎，支持随机静态壁纸、本地轮播图以及沉浸式视频背景（支持动态切换）。
- **响应式网格**: 全面采用 CSS Grid 与 Flexbox，确保在 4K 宽屏和移动端设备上均有完美的留白与比例。

### 🎬 动效与交互 (Animation & Interaction)
- **微交互**: 基于 Framer Motion 实现的平滑页面路由切换、元素渐入渐出（Fade-in）以及列表项的交错加载。
- **悬停反馈**: 统一的 Hover 态浮起阴影和渐变色反馈，让用户的每一次操作都有“被响应”的呼吸感。
- **全局毛玻璃**: Header 导航栏与主要面板广泛运用 Backdrop-filter，营造出高级的层次感。

### 🧩 组件化设计 (Component Driven)
- **高复用性**: 提取了 `ProjectCard`, `ArticleCard`, `DynamicBackground` 等独立组件。
- **状态驱动**: 借助 Zustand 将 UI 状态与业务逻辑解耦，使得复杂的筛选、分页与主题切换逻辑更加清晰。

## 📝 更新日志

### v2.1.0 (2026-04) - 体验优化与图床集成
- **动态背景系统**: 引入 `WALLPAPER_MODE`，支持静态视频、本地缓存图及爬虫抓取三种模式。
- **图床系统**: 接入 `@vercel/blob`，在 Markdown 编辑器中实现拖拽、粘贴图片自动上传。
- **交互与 UI 优化**: 重构了 `Header` 导航、优化了评论区排版和玻璃拟态卡片 (`Projects Showcase`) 设计。
- **性能升级**: 后端增加 `compression` 中间件，前端进一步优化路由状态。

### v2.0.0 (2024-06-19) - 架构重构与现代化
- **后端重构**: 引入 Node.js + Express + Prisma 后端，实现完整的全栈架构。
- **数据库 ORM**: 使用 Prisma 作为 ORM，替换原生 SQL 查询，提升了开发效率和代码安全性。
- **路由升级**: 前端路由 `react-router-dom` 从 v5 全面升级到 v6，采用更现代的 API。
- **全局状态管理**: 引入 Zustand 进行全局状态管理，将文章列表等核心数据从组件状态提升为全局状态，便于未来扩展。
- **配置解耦**: API 请求地址和数据库连接字符串通过环境变量 (`.env`) 配置，不再硬编码。
- **项目文档**: 更新 `README.md`，补充了完整的技术栈、项目架构、启动说明和更新日志。

## 🗺️ 项目规划 (Roadmap)

本项目绝大部分的核心工程化目标（包括 Monorepo、Zod 数据验证、Axios 封装、ESLint/Prettier、懒加载等）已全部在最新的迭代中完成。未来的优化路线如下：

### 1. 【工程化】引入自动化测试 (Testing)

- **现状**: 项目业务逻辑逐渐复杂，缺少自动化测试来保证重构和功能迭代的稳定性。
- **目标**: 为关键的业务逻辑和组件添加测试用例。
- **实施**:
  - **前端**: 使用 `Vitest` + `React Testing Library` 对 Zustand stores 和复杂的 UI 组件（如 `MarkdownRenderer`）进行单元测试。
  - **后端**: 使用 `Jest` + `Supertest` 对 Controller 接口及中间件（如鉴权拦截、文件上传）进行集成测试。

### 2. 【运维】CI/CD 自动化部署流水线

- **现状**: 部署主要依赖 Vercel/Zeabur 平台自带的基础 Hook。
- **目标**: 构建规范的自动化流水线，在合并代码前进行强制的代码检查和测试。
- **实施**: 
  - 接入 `GitHub Actions`，配置 `Lint` 和 `Test` 的 CI 检查。
  - 配置 `Semantic Release` 以规范化 Git 提交信息。

### 3. 【体验】后台管理仪表盘 (Admin Dashboard)

- **现状**: 管理员通过密码进入“编辑模式”来直接在前端界面操作（如发布文章、修改技能）。
- **目标**: 为站点提供一个独立的管理控制台，便于集中监控数据（如阅读量、访客统计、评论审核等）。
- **实施**:
  - 新增 `/admin` 独立前端路由（或拆分出新的 `admin` package）。
  - 对接图表库（如 `ECharts` 或 `Recharts`）实现数据可视化展示。
