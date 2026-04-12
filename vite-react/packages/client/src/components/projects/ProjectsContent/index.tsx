/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-02-15 13:52:55
 * @LastEditTime: 2025-06-19 10:17:27
 */
/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-02-15 13:52:55
 * @LastEditTime: 2025-06-19 10:12:53
 */
import { FC, useState, useEffect, useMemo } from 'react';
import './index.css';
import SEO from '../../common/SEO';
import ScrollToTopButton from '../../common/ScrollToTopButton';
import ProjectCard from '../ProjectCard';
import { Project } from '../types';
import { projects } from '../data';

// 提取所有项目分类
const categories = ["全部", ...new Set(projects.map(project => project.category))];

// 提取并去重所有技术标签
const allTechnologies = Array.from(
  new Set(projects.flatMap(project => project.technologies))
).sort();

const ProjectsContent: FC = () => {
  // 状态管理
  // 当前选中的项目分类
  const [activeCategory, setActiveCategory] = useState<string>("全部");
  // 搜索关键词
  const [searchTerm, setSearchTerm] = useState<string>("");
  // 动画状态
  const [isAnimated, setIsAnimated] = useState(false);
  // 排序方式：按日期或名称
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  // 是否显示技术筛选面板
  const [showTechFilter, setShowTechFilter] = useState(false);
  // 已选择的技术标签
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);

  // 处理技术标签的选择和取消
  const handleTechSelect = (tech: string) => {
    setSelectedTechs(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  // 项目过滤和排序逻辑
  const filteredProjects = useMemo(() => {
    return projects
      .filter(project => {
        // 匹配分类
        const matchesCategory = activeCategory === "全部" || project.category === activeCategory;
        // 匹配搜索词
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase());
        // 匹配选中的技术标签
        const matchesTech = selectedTechs.length === 0 ||
          selectedTechs.every(tech => project.technologies.includes(tech));
        return matchesCategory && matchesSearch && matchesTech;
      })
      .sort((a, b) => {
        // 根据选择的方式排序
        if (sortBy === 'date') {
          return new Date(b.period.split(' - ')[0]).getTime() -
            new Date(a.period.split(' - ')[0]).getTime();
        }
        return a.title.localeCompare(b.title);
      });
  }, [activeCategory, searchTerm, selectedTechs, sortBy]);

  // 计算每个分类的项目数量
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { "全部": projects.length };
    projects.forEach(project => {
      counts[project.category] = (counts[project.category] || 0) + 1;
    });
    return counts;
  }, []);

  // 初始化动画和加载状态
  useEffect(() => {
    setIsAnimated(true);
  }, []);

  return (
    <>
      {/* SEO 优化组件，设置页面元数据 */}
      <SEO
        title="项目展示 - 我的个人博客"
        description="展示我的个人项目和作品集"
        keywords="项目展示,作品集,Web开发,应用开发"
      />
      {/* 主容器，支持动画效果 */}
      <div className={`projects-container ${isAnimated ? 'animated' : ''}`}>
        {/* 页面头部：标题和统计信息 */}
        <div className="projects-header">
          <h1>项目展示</h1>
          <p className="subtitle">探索我的项目经历和技术实践</p>
          {/* 项目统计数据 */}
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

        {/* 搜索和过滤区域 */}
        <div className="search-filter-container">
          {/* 搜索框 */}
          <div className="search-box">
            <input
              type="text"
              placeholder="搜索项目..."
              value={searchTerm}
              onChange={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
              className="search-input"
            />
          </div>
          {/* 分类过滤按钮组 */}
          <div className="category-filter">
            {categories.map(category => (
              <button
                key={category}
                className={`category-button ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
                {/* 显示每个分类的项目数量 */}
                <span className="category-count">
                  {categoryCounts[category] || 0}
                </span>
              </button>
            ))}
          </div>

          {/* 排序和技术筛选选项 */}
          <div className="filter-options">
            {/* 排序下拉框 */}
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

            {/* 技术筛选切换按钮 */}
            <button
              className={`tech-filter-toggle ${showTechFilter ? 'active' : ''}`}
              onClick={() => setShowTechFilter(!showTechFilter)}
            >
              技术筛选 {showTechFilter ? '↑' : '↓'}
            </button>
          </div>

          {/* 技术筛选面板，条件渲染 */}
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

        {/* 项目卡片网格 */}
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* 无匹配结果提示 */}
        {filteredProjects.length === 0 && (
          <div className="no-results">
            <h3>未找到匹配的项目</h3>
            <p>请尝试调整筛选条件</p>
          </div>
        )}
      </div>
      <ScrollToTopButton />
    </>
  );
};

export default ProjectsContent; 