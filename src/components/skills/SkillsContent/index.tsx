import React, { FC, useState, useEffect } from 'react';
import './index.css';
import Loading from '../../common/Loading';

interface Skill {
  id: number;
  category: string;
  name: string;
  level: number;
  icon: string;
  description: string;
  projects?: string[];
}

const skills: Skill[] = [
  {
    id: 1,
    category: "前端开发",
    name: "React",
    level: 90,
    icon: "🔵",
    description: "熟练使用 React 及其生态系统，包括 Hooks、Redux、React Router 等",
    projects: ["个人博客系统", "企业管理平台"]
  },
  {
    id: 2,
    category: "前端开发",
    name: "TypeScript",
    level: 85,
    icon: "💻",
    description: "深入理解 TypeScript 类型系统，能够构建类型安全的应用",
    projects: ["个人博客系统", "企业管理平台"]
  },
  {
    id: 3,
    category: "后端开发",
    name: "Node.js",
    level: 80,
    icon: "🟢",
    description: "熟练使用 Node.js 进行服务器端开发，包括 Express、Nest.js 框架"
  },
  {
    id: 4,
    category: "大数据",
    name: "Hadoop",
    level: 85,
    icon: "🐘",
    description: "精通 Hadoop 生态系统，包括 HDFS、MapReduce、YARN 等组件"
  },
  {
    id: 5,
    category: "大数据",
    name: "Spark",
    level: 80,
    icon: "🔥",
    description: "熟练使用 Spark 进行大数据处理，包括 RDD、DataFrame、Dataset 等"
  },
  {
    id: 6,
    category: "数据库",
    name: "MySQL",
    level: 85,
    icon: "🐬",
    description: "熟练使用 MySQL 进行数据库管理，包括索引优化、查询优化等"
  },
  {
    id: 7,
    category: "数据库",
    name: "Redis",
    level: 80,
    icon: "🔑",
    description: "熟练使用 Redis 进行缓存和数据存储，包括 Redis 集群、Redis 持久化等"
  },
  {
    id: 8,
    category: "数据库",
    name: "MongoDB",
    level: 75,
    icon: "🍃",
    description: "熟练使用 MongoDB 进行 NoSQL 数据库管理，包括索引优化、查询优化等"
  },
  {
    id: 9,
    category: "云计算",
    name: "AWS",
    level: 70,
    icon: "🌤️",
    description: "熟练使用 AWS 进行云计算服务管理，包括 EC2、ECS、S3 等"
  },
  {
    id: 10,
    category: "云计算",
    name: "Azure",
    level: 65,
    icon: "🌐",
    description: "熟练使用 Azure 进行云计算服务管理，包括 VM、Storage、SQL 等"
  },
  {
    id: 11,
    category: "云计算",
    name: "阿里云",
    level: 60,
    icon: "🌐",
    description: "熟练使用阿里云进行云计算服务管理，包括 ECS、RDS、OSS 等"
  },
  {
    id: 12,
    category: "人工智能",
    name: "PyTorch",
    level: 55,
    icon: "🌐",
    description: "熟练使用 PyTorch 进行深度学习模型开发，包括卷积神经网络、循环神经网络等"
  },

  // ... 可以添加更多技能
];

const SkillsContent: FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("全部");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAnimated, setIsAnimated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const categories = ["全部", ...new Set(skills.map(skill => skill.category))];

  useEffect(() => {
    setIsAnimated(true);
    // 模拟数据加载
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  // 搜索和过滤逻辑
  const filteredSkills = skills
    .filter(skill => {
      const matchesCategory = activeCategory === "全部" || skill.category === activeCategory;
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => b.level - a.level); // 按技能水平排序

  // 技能统计
  const skillStats = {
    totalSkills: skills.length,
    averageLevel: Math.round(skills.reduce((acc, curr) => acc + curr.level, 0) / skills.length),
    expertiseAreas: categories.length - 1
  };

  return (
    <div className={`skills-container ${isAnimated ? 'animated' : ''}`}>
      <div className="skills-header">
        <h1>技术栈</h1>
        <p className="subtitle">探索我的技术领域和专长</p>
        <div className="skill-stats">
          <div className="stat-item">
            <span className="stat-number">{skillStats.totalSkills}</span>
            <span className="stat-label">技能总数</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{skillStats.averageLevel}%</span>
            <span className="stat-label">平均掌握度</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{skillStats.expertiseAreas}</span>
            <span className="stat-label">专业领域</span>
          </div>
        </div>
      </div>

      <div className="search-filter-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索技能..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-button ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
              <span className="category-count">
                {category === "全部" ? skills.length :
                  skills.filter(skill => skill.category === category).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="skills-grid">
        {filteredSkills.map(skill => (
          <div key={skill.id} className="skill-card" data-level={skill.level >= 85 ? 'expert' : skill.level >= 70 ? 'advanced' : 'intermediate'}>
            <div className="skill-header">
              <span className="skill-icon">{skill.icon}</span>
              <h3>{skill.name}</h3>
              <div className="skill-level">
                <div
                  className="level-bar"
                  style={{ width: `${skill.level}%` }}
                >
                  <span className="level-text">{skill.level}%</span>
                </div>
              </div>
            </div>
            <p className="skill-description">{skill.description}</p>
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
            <div className="skill-level-badge">
              {skill.level >= 85 ? '专家' : skill.level >= 70 ? '熟练' : '进阶'}
            </div>
          </div>
        ))}
      </div>

      <div className="skills-footer">
        <div className="experience-summary">
          <h2>技术经验总结</h2>
          <p>3年+全栈开发经验，专注于现代Web技术和大数据处理。持续学习新技术，追求代码质量和性能优化。</p>
          <div className="learning-status">
            <h3>当前学习中</h3>
            <div className="learning-tags">
              <span className="learning-tag">Docker</span>
              <span className="learning-tag">Kubernetes</span>
              <span className="learning-tag">GraphQL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsContent; 