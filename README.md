# 个人博客 & 技术作品集

这是一个基于 React, Node.js 和 pnpm Monorepo 构建的现代化、全栈个人网站项目。

## 🌟 核心特性

- **现代化技术栈**: 全面采用 React 18, TypeScript, Vite, Node.js, Express, Prisma 等现代化工具链。
- **Monorepo 架构**: 使用 **pnpm workspace** 进行统一的包管理和脚本执行，极大提升了开发效率和项目可维护性。
- **高性能前端**:
  - **路由懒加载**: 使用 `React.lazy` 和 `Suspense` 实现组件按需加载，优化了初始加载速度。
  - **全局状态管理**: 通过 `Zustand` 统一管理应用状态，逻辑清晰，易于扩展。
  - **统一 API 请求**: 封装 `axios` 客户端，集中处理 API 请求和错误。
- **健壮的后端**:
  - **模块化路由**: API 路由按功能模块划分，结构清晰。
  - **ORM 支持**: 使用 `Prisma` 作为 ORM，替代原生 SQL，安全且高效。
  - **增强的安全性**: 通过 `helmet` 设置安全相关的 HTTP 头，并通过 `zod` 对 API 请求进行严格的校验。
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

## 💡 核心功能

### 文章系统
- 分类浏览
- 搜索功能
- 阅读量统计
- 标签系统
- 时间排序

### 项目展示
- 项目分类
- 技术标签
- 详细描述
- 源码链接
- 在线演示

### 技能展示
- 技能分类
- 熟练度评估
- 项目关联
- 技能统计

## 🎨 设计细节

### 色彩系统
- 主色调: #007bff
- 辅助色: #f5f7fa, #c3cfe2
- 文字色: #333, #666
- 强调色: 渐变设计

### 布局系统
- 响应式网格布局
- 卡片式设计
- 固定导航栏
- 合理的留白

### 交互设计
- 平滑过渡动画
- 悬停效果
- 渐入渐出
- 滚动优化

### 组件复用
- 统一的卡片组件
- 通用搜索框
- 分类过滤器
- 标签系统

## 📝 更新日志

### v2.0.0 (2024-06-19) - 架构重构与现代化
- **后端重构**: 引入 Node.js + Express + Prisma 后端，实现完整的全栈架构。
- **数据库 ORM**: 使用 Prisma 作为 ORM，替换原生 SQL 查询，提升了开发效率和代码安全性。
- **路由升级**: 前端路由 `react-router-dom` 从 v5 全面升级到 v6，采用更现代的 API。
- **全局状态管理**: 引入 Zustand 进行全局状态管理，将文章列表等核心数据从组件状态提升为全局状态，便于未来扩展。
- **配置解耦**: API 请求地址和数据库连接字符串通过环境变量 (`.env`) 配置，不再硬编码。
- **项目文档**: 更新 `README.md`，补充了完整的技术栈、项目架构、启动说明和更新日志。

## 项目优化路线图 (Roadmap)

为了进一步提升项目质量、性能和可维护性，我们规划了以下优化路线。

### 🚀 优化 (High Priority)

这些是能带来显著提升的关键优化点。

#### 1. 【前端】开启懒加载 (Lazy Loading)

- **现状**: 所有页面组件被打包在同一个初始 JS 文件中，影响首页加载速度。
- **目标**: 使用 `React.lazy` 和 `Suspense` 实现路由级别的代码分割。
- **实施**:
  1. 修改 `App.tsx`，用 `React.lazy()` 动态导入页面组件。
  2. 使用 `<Suspense>` 组件包裹 `<Routes>`，并提供一个加载状态的 `fallback` UI (例如骨架屏)。

#### 2. 【后端】添加请求体验证 (Input Validation)

- **现状**: 后端 API 直接信任客户端数据，存在SQL注入和脏数据风险。
- **目标**: 在 API 端对所有外部输入进行严格的校验。
- **实施**:
  1. 安装校验库，如 `zod`。
  2. 为每个需要接收请求体的 Controller 创建一个 `Zod` schema。
  3. 在 Express 路由和实际 Controller 逻辑之间增加一个校验中间件。

#### 3. 【工程化】配置代码格式化与规范 (Linter & Formatter)

- **现状**: 缺少自动化的代码风格约束工具。
- **目标**: 统一代码风格，提高代码质量和可读性。
- **实施**:
  1. 在前后端项目中分别安装和配置 `ESLint` 和 `Prettier`。
  2. 在 `package.json` 中添加 `"lint"` 和 `"format"` 脚本。
  3. **(推荐)** 使用 `husky` 和 `lint-staged` 在 `git commit` 时自动执行检查和格式化。

#### 4. 【后端】API 接口集中管理

- **现状**: 所有路由在 `server/src/index.ts` 中手动注册，难以维护。
- **目标**: 实现模块化的路由管理。
- **实施**:
  1. 创建 `server/src/routes` 目录。
  2. 为每个资源（如 articles, skills）创建独立的路由文件（`article.routes.ts`, `skill.routes.ts`）。
  3. 在 `server/src/app.ts` 中，循环引入并注册 `routes` 目录下的所有路由模块。

---

### ✨ 可以考虑的优化 (Nice to Have)

完成高优先级任务后，可以考虑以下优化来让项目更上一层楼。

#### 5. 【前端】API 请求层封装

- **现状**: `axios` 请求散落在各组件中。
- **目标**: 集中管理 API 请求，方便统一处理错误、Loading状态和认证。
- **实施**:
  1. 创建 `src/api/apiClient.ts`，在其中创建并配置一个 `axios` 实例。
  2. 使用 `axios` 的拦截器（interceptors）来统一处理请求前后的逻辑。

#### 6. 【后端】增强安全性 (Helmet)

- **现状**: Express 默认的 HTTP 头存在安全隐患。
- **目标**: 移除不安全的 HTTP 头，增加安全相关的头。
- **实施**:
  1. 安装 `helmet` 库。
  2. 在 Express 的中间件中 `app.use(helmet())`。

#### 7. 【工程化】引入单元测试 (Unit Testing)

- **现状**: 项目完全没有自动化测试，代码质量和重构安全性无法保证。
- **目标**: 为关键的业务逻辑和组件添加测试用例。
- **实施**:
  - **前端**: 使用 `Vitest` + `React Testing Library` 对 Zustand stores 和复杂的 UI 组件进行测试。
  - **后端**: 使用 `Jest` + `Supertest` 对 Controller 和服务层逻辑进行单元测试和集成测试。

#### 8. 【工程化】使用 Monorepo 工具

- **现状**: 手动管理前后端两个项目。
- **目标**: 简化依赖安装和脚本执行流程，提升开发效率。
- **实施**:
  1. 在项目根目录初始化 `pnpm`。
  2. 创建 `pnpm-workspace.yaml` 文件来定义工作区。
  3. 将前后端的 `package.json` 中的脚本提升到根目录的 `package.json` 中管理。
