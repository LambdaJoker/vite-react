/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: 技能栈
 * @Date: 2025-02-15 13:43:50
 * @LastEditTime: 2025-03-25 23:52:21
 */
/** @jsx React.createElement */
/** @jsxFrag React.Fragment */
import { FC, useState, useEffect, useRef } from 'react';
import './index.css';
import Notification from '../../notification';
import SEO from '../../common/SEO';
import SkeletonLoader from '../../skeletonLoader';

interface Skill {
  // 技能ID
  id: number;
  // 技能所属分类
  categories: string[];
  // 技能名称
  name: string;
  // 掌握程度 (0-100)
  level: number;
  // 技能图标
  icon: string;
  // 技能描述
  description: string;
  // 相关项目列表
  projects?: string[];
}

const skills: Skill[] = [
  {
    id: 1,
    categories: ["后端开发", "人工智能", "数据处理", "编程语言"],
    name: "Python",
    level: 89,
    icon: "🐍",
    description: "熟练使用 Python 进行后端开发、数据处理和机器学习应用开发"
  },
  {
    id: 2,
    categories: ["后端开发"],
    name: "SpringBoot",
    level: 75,
    icon: "☕",
    description: "熟悉 SpringBoot 框架，能够开发企业级 Java 应用"
  },
  {
    id: 3,
    categories: ["后端开发", "编程语言"],
    name: "Go",
    level: 70,
    icon: "🔵",
    description: "掌握 Go 语言开发，了解并发编程和微服务架构"
  },
  {
    id: 4,
    categories: ["前端开发"],
    name: "JavaScript",
    level: 80,
    icon: "💛",
    description: "精通 JavaScript，熟悉现代 ES6+ 特性和异步编程"
  },
  {
    id: 5,
    categories: ["前端开发"],
    name: "vue.js",
    level: 75,
    icon: "🔷",
    description: "熟练使用 vue.js 进行前端开发，掌握组件化开发和状态管理"
  },
  {
    id: 6,
    categories: ["前端开发"],
    name: "HTML/CSS",
    level: 80,
    icon: "🎨",
    description: "掌握前端基础技术，能够构建响应式和现代化的用户界面"
  },
  {
    id: 7,
    categories: ["人工智能"],
    name: "机器学习",
    level: 75,
    icon: "🤖",
    description: "熟悉机器学习算法和框架，能够开发智能化应用"
  },
  {
    id: 8,
    categories: ["人工智能", "计算机视觉"],
    name: "YOLO",
    level: 70,
    icon: "👁️",
    description: "掌握 YOLO 目标检测算法，能够进行计算机视觉应用开发"
  },
  {
    id: 9,
    categories: ["系统与工具", "运维"],
    name: "Linux",
    level: 80,
    icon: "🐧",
    description: "熟练使用 Linux 系统，掌握系统管理和服务器运维"
  },
  {
    id: 10,
    categories: ["系统与工具", "机器人"],
    name: "ROS",
    level: 70,
    icon: "🤖",
    description: "了解机器人操作系统，能够进行机器人应用开发"
  },
  {
    id: 11,
    categories: ["编程语言"],
    name: "C语言",
    level: 75,
    icon: "⚡",
    description: "掌握 C 语言开发，了解底层系统编程"
  },
  {
    id: 12,
    categories: ["前端开发"],
    name: "React",
    level: 90,
    icon: "🔵",
    description: "熟练使用 React 及其生态系统，包括 Hooks、Redux、React Router 等",
    projects: ["个人博客系统", "企业管理平台"]
  },
  {
    id: 13,
    categories: ["前端开发"],
    name: "TypeScript",
    level: 90,
    icon: "💻",
    description: "深入理解 TypeScript 类型系统，能够构建类型安全的应用",
    projects: ["个人博客系统", "企业管理平台"]
  },
  {
    id: 14,
    categories: ["后端开发"],
    name: "Node.js",
    level: 80,
    icon: "🟢",
    description: "熟练使用 Node.js 进行服务器端开发，包括 Express、Nest.js 框架"
  },
  {
    id: 15,
    categories: ["大数据"],
    name: "Hadoop",
    level: 80,
    icon: "🐘",
    description: "精通 Hadoop 生态系统，包括 HDFS、MapReduce、YARN 等组件"
  },
  {
    id: 16,
    categories: ["大数据"],
    name: "Spark",
    level: 80,
    icon: "🔥",
    description: "熟练使用 Spark 进行大数据处理，包括 RDD、DataFrame、Dataset 等"
  },
  {
    id: 17,
    categories: ["数据库"],
    name: "MySQL",
    level: 80,
    icon: "🐬",
    description: "熟练使用 MySQL 进行数据库管理，包括索引优化、查询优化等"
  },
  {
    id: 18,
    categories: ["数据库"],
    name: "Redis",
    level: 80,
    icon: "🔑",
    description: "熟练使用 Redis 进行缓存和数据存储，包括 Redis 集群、Redis 持久化等"
  },
  {
    id: 19,
    categories: ["数据库"],
    name: "MongoDB",
    level: 75,
    icon: "🍃",
    description: "熟练使用 MongoDB 进行 NoSQL 数据库管理，包括索引优化、查询优化等"
  },
  {
    id: 20,
    categories: ["大数据", "数据库"],
    name: "HBase",
    level: 75,
    icon: "📊",
    description: "熟练使用 HBase 进行大规模数据存储和处理，了解分布式数据库架构"
  },
  {
    id: 21,
    categories: ["大数据", "数据处理"],
    name: "Hive",
    level: 75,
    icon: "🐝",
    description: "熟练使用 Hive 进行数据仓库管理和大规模数据分析"
  },
  {
    id: 22,
    categories: ["云计算", "系统与工具"],
    name: "Docker",
    level: 35,
    icon: "🐳",
    description: "熟练使用 Docker 进行容器化部署和管理，了解容器编排技术"
  },
  {
    id: 23,
    categories: ["云计算", "系统与工具"],
    name: "Kubernetes",
    level: 30,
    icon: "☸️",
    description: "了解 Kubernetes 容器编排平台，能够进行集群部署和管理"
  },
  {
    id: 24,
    categories: ["云计算"],
    name: "AWS",
    level: 0,
    icon: "☁️",
    description: "熟悉 AWS 云服务，包括 EC2、S3、Lambda 等核心服务的使用"
  },
  {
    id: 25,
    categories: ["云计算"],
    name: "阿里云",
    level: 30,
    icon: "☁️",
    description: "熟悉阿里云服务，能够使用 ECS、OSS、函数计算等服务进行应用部署"
  },
  {
    id: 26,
    categories: ["后端开发", "编程语言"],
    name: "Java",
    level: 80,
    icon: "☕",
    description: "熟练使用 Java 进行企业级应用开发，掌握 JVM 调优、多线程编程等核心技术"
  }
];

const SkillsContent: FC = () => {
  // 1. 所有的 useState hooks
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [isAnimated, setIsAnimated] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: number; message: string; type: 'info' | 'success' | 'error' | 'warning' }>>([]);

  // 2. useRef hooks
  const searchTimeout = useRef<number | undefined>(undefined);

  // 过滤并排序技能列表
  const filteredSkills = skills
    .filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === '全部' || skill.categories.includes(activeCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => b.level - a.level);

  // 4. useEffect hooks
  useEffect(() => {
    setIsAnimated(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 处理搜索输入，使用防抖优化
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = window.setTimeout(() => {
      // 实际搜索逻辑
    }, 300);
  };

  // 处理分类点击，显示通知
  const handleCategoryClick = (category: string) => {
    const newNotification = {
      id: Date.now(),
      message: `已选择 ${category} 类别`,
      type: 'info' as const
    };
    setNotifications(prev => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 2000);
    setActiveCategory(category);
  };

  // 所有技能分类，包括"全部"选项
  const categories = ["全部", ...new Set(skills.flatMap(skill => skill.categories))];

  // 加载状态的骨架屏渲染
  if (isLoading) {
    return (
      <div className={`skills-container ${isAnimated ? 'animated' : ''}`}>
        <div className="skills-header">
          <SkeletonLoader type="title" />
          <div className="skill-stats">
            {/* 统计数据的骨架屏 */}
            <div className="stat-item">
              <SkeletonLoader type="text" width="80px" height="40px" />
              <SkeletonLoader type="text" width="60px" height="20px" />
            </div>
            {/* ... 其他统计项的骨架屏 ... */}
          </div>
        </div>
        <div className="skills-grid">
          <SkeletonLoader type="card" count={6} />
        </div>
      </div>
    );
  }

  // 计算技能统计数据
  const skillStats = {
    // 总技能数量
    totalSkills: skills.length,
    // 平均掌握程度
    averageLevel: Math.round(skills.reduce((acc, curr) => acc + curr.level, 0) / skills.length),
    // 专业领域数量
    expertiseAreas: categories.length - 1
  };

  // 技能卡片渲染函数
  const renderSkillCard = (skill: Skill) => (
    <div key={skill.id} className="skill-card" data-level={skill.level >= 85 ? 'expert' : skill.level >= 70 ? 'advanced' : 'intermediate'}>
      {/* 技能头部：图标和名称 */}
      <div className="skill-header">
        <span className="skill-icon">{skill.icon}</span>
        <h3>{skill.name}</h3>
        {/* 技能掌握度进度条 */}
        <div className="skill-level">
          <div
            className="level-bar"
            style={{ width: `${skill.level}%` }}
          >
            <span className="level-text">{skill.level}%</span>
          </div>
        </div>
      </div>
      {/* 技能描述 */}
      <p className="skill-description">{skill.description}</p>
      {/* 相关项目列表（如果有） */}
      {skill.projects && (
        <div className="skill-projects">
          <h4>相关项目:</h4>
          <ul>
            {skill.projects.map((project, index) => (
              <li key={index}>{project}</li>
            ))}
          </ul>
        </div>
      )}
      {/* 技能等级标签 */}
      <div className="skill-level-badge">
        {skill.level >= 85 ? '专家' : skill.level >= 70 ? '熟练' : '进阶'}
      </div>
    </div>
  );

  // 页脚区域渲染函数
  const renderFooter = () => (
    <div className="skills-footer">
      <div className="experience-summary">
        <h2>技术经验总结</h2>
        <p>3年+前端开发经验，专注于现代Web技术和大数据处理。持续学习新技术，追求代码质量和性能优化。</p>
        {/* 当前学习状态展示 */}
        <div className="learning-status">
          <h3>当前学习中</h3>
          <div className="learning-tags">
            <span className="learning-tag">Docker</span>
            <span className="learning-tag">MongoDB</span>
            <span className="learning-tag">GraphQL</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* SEO 优化组件，设置页面元数据 */}
      <SEO
        title="技能栈 - 我的个人博客"
        description="查看我的技术栈和专业技能"
        keywords="技术栈,前端开发,后端开发,全栈开发"
      />

      {/* 通知消息容器，显示分类切换等操作的反馈 */}
      <div className="notification-container">
        {notifications.map((notification, index) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            // 设置通知垂直间距为 70px
            style={{ top: `${70 + index * 70}px` }}
            onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
          />
        ))}
      </div>

      {/* 回到顶部按钮，滚动超过 300px 时显示 */}
      {showScrollTop && (
        <button
          className="scroll-top-button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑
        </button>
      )}

      {/* 主要内容容器，支持动画效果 */}
      <div className={`skills-container ${isAnimated ? 'animated' : ''}`}>
        {/* 页面头部：标题和统计信息 */}
        <div className="skills-header">
          <h1>技术栈</h1>
          <p className="subtitle">探索我的技术领域和专长</p>
          {/* 技能统计数据展示区域 */}
          <div className="skill-stats">
            {/* 总技能数量统计 */}
            <div className="stat-item">
              <span className="stat-number">{skillStats.totalSkills}</span>
              <span className="stat-label">技能总数</span>
            </div>
            {/* 平均掌握度统计 */}
            <div className="stat-item">
              <span className="stat-number">{skillStats.averageLevel}%</span>
              <span className="stat-label">平均掌握度</span>
            </div>
            {/* 专业领域数量统计 */}
            <div className="stat-item">
              <span className="stat-number">{skillStats.expertiseAreas}</span>
              <span className="stat-label">专业领域</span>
            </div>
          </div>
        </div>

        {/* 搜索和过滤区域 */}
        <div className="search-filter-container">
          {/* 搜索框组件 */}
          <div className="search-box">
            <input
              type="text"
              placeholder="搜索技能..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
              aria-label="搜索技能"
            />
          </div>
          {/* 分类过滤按钮组 */}
          <div className="category-filter">
            {categories.map(category => (
              <button
                key={category}
                className={`category-button ${activeCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
                aria-pressed={activeCategory === category}
                aria-label={`过滤${category}类别的技能`}
              >
                {category}
                {/* 显示该分类下的技能数量 */}
                <span className="category-count" aria-hidden="true">
                  {category === "全部" ? skills.length :
                    skills.filter(skill => skill.categories.includes(category)).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 技能卡片网格展示区域 */}
        <div className="skills-grid">
          {filteredSkills.map(skill => renderSkillCard(skill))}
        </div>

        {/* 页脚：经验总结和学习状态 */}
        {renderFooter()}
      </div>
    </>
  );
};

export default SkillsContent; 