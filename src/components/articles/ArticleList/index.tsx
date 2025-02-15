/** @jsx React.createElement */
import React, { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

interface Article {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  author: string;
  tags: string[];
}

const articles: Article[] = [
  {
    id: 1,
    title: "React 开发实战经验分享",
    description: "分享在实际项目中使用 React 的经验和最佳实践，包括性能优化、状态管理等内容...",
    date: "2024-02-15",
    category: "前端开发",
    image: "/src/assets/img/article/article1.jpg",
    readTime: "10 次",
    author: "TAO",
    tags: ["React", "性能优化", "状态管理"]
  },
  {
    id: 2,
    title: "Hadoop 生态系统入门指南",
    description: "详细介绍 Hadoop 生态系统的核心组件，以及在大数据处理中的应用场景...",
    date: "2024-02-14",
    category: "大数据",
    image: "/src/assets/article2.jpg",
    readTime: "15 次",
    author: "TAO",
    tags: ["Hadoop", "大数据", "分布式系统"]
  },
  {
    id: 3,
    title: "MongoDB 性能调优技巧",
    description: "探讨 MongoDB 在高并发场景下的性能优化策略，包括索引设计、查询优化等...",
    date: "2024-02-13",
    category: "数据库",
    image: "/src/assets/article3.jpg",
    readTime: "12 次",
    author: "TAO",
    tags: ["MongoDB", "数据库", "性能优化"]
  }
];

const ArticleList: FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("全部");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAnimated, setIsAnimated] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [isLoading, setIsLoading] = useState(true);
  const categories = ["全部", ...new Set(articles.map(article => article.category))];

  const filteredArticles = articles
    .filter(article => {
      const matchesCategory = activeCategory === "全部" || article.category === activeCategory;
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.title.localeCompare(b.title);
    });

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
    <div className={`articles-container ${isAnimated ? 'animated' : ''}`}>
      <div className="articles-header">
        <h1>文章列表</h1>
        <p className="subtitle">分享技术见解和开发经验</p>
        <div className="article-stats">
          <div className="stat-item">
            <span className="stat-number">{articles.length}</span>
            <span className="stat-label">文章总数</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{categories.length - 1}</span>
            <span className="stat-label">文章分类</span>
          </div>
        </div>
      </div>

      <div className="search-filter-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索文章..."
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
                {category === "全部" ? articles.length :
                  articles.filter(article => article.category === category).length}
              </span>
            </button>
          ))}
        </div>
        <div className="filter-options">
          <div className="sort-options">
            <span>排序方式：</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
              className="sort-select"
            >
              <option value="date">按时间</option>
              <option value="title">按标题</option>
            </select>
          </div>
        </div>
      </div>

      <div className="articles-grid">
        {filteredArticles.map(article => (
          <div key={article.id} className="article-card">
            <div className="article-image" style={{ backgroundImage: `url(${article.image})` }}>
              <div className="article-category">{article.category}</div>
            </div>
            <div className="article-content">
              <div className="article-meta">
                <span className="article-date">{article.date}</span>
                <span className="article-author">{article.author}</span>
                <span className="read-time">{article.readTime}</span>
              </div>
              <h2>{article.title}</h2>
              <p>{article.description}</p>
              <div className="article-tags">
                {article.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
              <Link to={`/articles/${article.id}`} className="read-more">
                阅读更多
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="no-results">
          <h3>未找到匹配的文章</h3>
          <p>请尝试调整筛选条件</p>
        </div>
      )}
    </div>
  );
};

export default ArticleList;