import React, { FC, useState, useEffect } from 'react';
import './index.css';
import Loading from '../../common/Loading';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  highlights: string[];
  period: string;
  role: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "个人博客系统",
    description: "基于 React + TypeScript 的现代化博客系统，支持文章管理、技术栈展示等功能",
    category: "Web开发",
    technologies: ["React", "TypeScript", "Node.js", "MongoDB"],
    image: "/src/assets/project1.jpg",
    demoUrl: "https://blog.example.com",
    githubUrl: "https://github.com/example/blog",
    highlights: [
      "使用 React Hooks 实现状态管理",
      "采用 TypeScript 确保类型安全",
      "响应式设计，支持多端适配",
      "SEO 优化和性能优化"
    ],
    period: "2024.01 - 2024.02",
    role: "全栈开发"
  },
  {
    id: 2,
    title: "大数据分析平台",
    description: "企业级大数据处理和分析平台，支持数据采集、处理、分析和可视化",
    category: "大数据",
    technologies: ["Hadoop", "Spark", "Python", "React"],
    image: "/src/assets/project2.jpg",
    demoUrl: "https://bigdata.example.com",
    githubUrl: "https://github.com/example/bigdata",
    highlights: [
      "分布式数据处理架构",
      "实时数据分析功能",
      "可视化数据报表",
      "高性能数据查询优化"
    ],
    period: "2023.08 - 2023.12",
    role: "后端开发"
  },
  {
    id: 3,
    title: "智能推荐系统",
    description: "基于机器学习的个性化推荐系统，提供精准的用户兴趣匹配",
    category: "人工智能",
    technologies: ["Python", "TensorFlow", "FastAPI", "Redis"],
    image: "/src/assets/project3.jpg",
    demoUrl: "https://recommend.example.com",
    githubUrl: "https://github.com/example/recommend",
    highlights: [
      "协同过滤算法实现",
      "实时用户行为分析",
      "千万级数据处理能力",
      "99.9%系统可用性"
    ],
    period: "2023.05 - 2023.07",
    role: "算法工程师"
  },
  {
    id: 4,
    title: "微服务架构系统",
    description: "基于 Spring Cloud 的微服务架构系统，支持高并发和分布式部署",
    category: "后端开发",
    technologies: ["Spring Cloud", "Docker", "Kubernetes", "MySQL"],
    image: "/src/assets/project4.jpg",
    demoUrl: "https://microservice.example.com",
    githubUrl: "https://github.com/example/microservice",
    highlights: [
      "服务注册与发现",
      "分布式配置管理",
      "服务熔断与降级",
      "容器化部署方案"
    ],
    period: "2023.01 - 2023.04",
    role: "架构师"
  },
  // ... 可以添加更多项目
];

const ProjectsContent: FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("全部");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAnimated, setIsAnimated] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [showTechFilter, setShowTechFilter] = useState(false);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const categories = ["全部", ...new Set(projects.map(project => project.category))];

  // 获取所有技术标签
  const allTechnologies = Array.from(
    new Set(projects.flatMap(project => project.technologies))
  ).sort();

  // 处理技术标签选择
  const handleTechSelect = (tech: string) => {
    setSelectedTechs(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  // 排序和过滤逻辑
  const filteredProjects = projects
    .filter(project => {
      const matchesCategory = activeCategory === "全部" || project.category === activeCategory;
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTech = selectedTechs.length === 0 ||
        selectedTechs.every(tech => project.technologies.includes(tech));
      return matchesCategory && matchesSearch && matchesTech;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.period.split(' - ')[0]).getTime() -
          new Date(a.period.split(' - ')[0]).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  // 动画效果
  useEffect(() => {
    setIsAnimated(true);
    // 模拟数据加载
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className={`projects-container ${isAnimated ? 'animated' : ''}`}>
      <div className="projects-header">
        <h1>项目展示</h1>
        <p className="subtitle">探索我的项目经历和技术实践</p>
        <div className="project-stats">
          <div className="stat-item">
            <span className="stat-number">{projects.length}</span>
            <span className="stat-label">项目总数</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{categories.length - 1}</span>
            <span className="stat-label">项目类型</span>
          </div>
        </div>
      </div>

      <div className="search-filter-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索项目..."
            value={searchTerm}
            onChange={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
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
                {category === "全部" ? projects.length :
                  projects.filter(project => project.category === category).length}
              </span>
            </button>
          ))}
        </div>

        <div className="filter-options">
          <div className="sort-options">
            <span>排序方式：</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
              className="sort-select"
            >
              <option value="date">按时间</option>
              <option value="name">按名称</option>
            </select>
          </div>

          <button
            className="tech-filter-toggle"
            onClick={() => setShowTechFilter(!showTechFilter)}
          >
            技术筛选 {showTechFilter ? '↑' : '↓'}
          </button>
        </div>

        {showTechFilter && (
          <div className="tech-filter-panel">
            {allTechnologies.map(tech => (
              <label key={tech} className="tech-checkbox">
                <input
                  type="checkbox"
                  checked={selectedTechs.includes(tech)}
                  onChange={() => handleTechSelect(tech)}
                />
                <span>{tech}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="projects-grid">
        {filteredProjects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-image" style={{ backgroundImage: `url(${project.image})` }}>
              <div className="project-category">{project.category}</div>
            </div>
            <div className="project-content">
              <div className="project-header">
                <h3>{project.title}</h3>
                <span className="project-period">{project.period}</span>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-role">
                <span className="role-badge">{project.role}</span>
              </div>
              <div className="project-highlights">
                <h4>项目亮点:</h4>
                <ul>
                  {project.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
              <div className="project-tech">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
              <div className="project-links">
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="project-link demo">
                    查看演示
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link github">
                    源代码
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="no-results">
          <h3>未找到匹配的项目</h3>
          <p>请尝试调整筛选条件</p>
        </div>
      )}
    </div>
  );
};

export default ProjectsContent; 