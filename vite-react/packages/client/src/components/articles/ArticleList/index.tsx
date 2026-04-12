/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-02-15 13:18:37
 * @LastEditTime: 2025-06-19 08:22:46
 */
import { FC, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import SkeletonLoader from '../../skeletonLoader';
import LazyImage from '../../lazyImage';
import useArticleStore, { type Article } from '../../store/articleStore'; // 修正为 type-only 导入
import useAppStore from '../../store/appStore'; // 修正路径
import ScrollToTopButton from '../../common/ScrollToTopButton'; // 引入新组件
import { getImageUrl } from '../../../utils/helpers';

import MarkdownRenderer from '../../common/MarkdownRenderer';

const ArticleList: FC = () => {
  // 从 Zustand store 中获取状态和 action
  const { articles, isLoading, error, fetchArticles } = useArticleStore();
  const { isReadOnly } = useAppStore(); // 获取只读状态

  const [activeCategory, setActiveCategory] = useState<string>("全部");
  const [activeTag, setActiveTag] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAnimated, setIsAnimated] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  // 组件加载时，调用 action 获取文章
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  // 计算可用的分类
  const categories = useMemo(() => ["全部", ...new Set(articles.map(article => article.category))], [articles]);

  // 计算可用的标签
  const tags = useMemo(() => {
    const allTags = articles.flatMap(article => article.tags || []);
    return [...new Set(allTags)];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return articles
      .filter(article => {
        const matchesCategory = activeCategory === "全部" || article.category === activeCategory;
        const matchesTag = activeTag === "" || (article.tags && article.tags.includes(activeTag));
        const matchesSearch = article.title.toLowerCase().includes(lowerSearchTerm) ||
          (article.excerpt || '').toLowerCase().includes(lowerSearchTerm);
        return matchesCategory && matchesTag && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return a.title.localeCompare(b.title);
      });
  }, [articles, activeCategory, searchTerm, sortBy]);

  // 计算每个分类的文章数量
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { "全部": articles.length };
    articles.forEach(article => {
      counts[article.category] = (counts[article.category] || 0) + 1;
    });
    return counts;
  }, [articles]);

  if (isLoading) {
    return (
      <div className="articles-container">
        <div className="articles-header">
          <SkeletonLoader type="title" />
          <SkeletonLoader type="text" count={2} />
        </div>
        <div className="articles-grid">
          <SkeletonLoader type="card" count={3} />
        </div>
        <ScrollToTopButton />
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
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
        {/* 只有在非只读模式下才显示创建按钮 */}
        {!isReadOnly && (
          <div className="create-article-button-container">
            <Link to="/articles/new" className="create-article-button">
              创建新文章
            </Link>
          </div>
        )}
      </div>
      <div className="search-filter-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索文章..."
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
                {categoryCounts[category] || 0}
              </span>
            </button>
          ))}
        </div>
        {tags.length > 0 && (
          <div className="tag-filter">
            <button
              className={`tag-button ${activeTag === "" ? 'active' : ''}`}
              onClick={() => setActiveTag("")}
            >
              全部标签
            </button>
            {tags.map(tag => (
              <button
                key={tag}
                className={`tag-button ${activeTag === tag ? 'active' : ''}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
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
            <div className="article-image">
              <LazyImage 
                src={getImageUrl(article.image)} 
                alt={article.title} 
                className="article-cover-img"
              />
              <div className="article-category">{article.category}</div>
            </div>
            <div className="article-content">
              <div className="article-meta">
                <span className="article-date">{article.date}</span>
                <span className="article-author">{article.author}</span>
                <span className="read-count">{article.read_count} 次阅读</span>
              </div>
              <h2>{article.title}</h2>
              <div className="article-excerpt markdown-preview">
                <MarkdownRenderer>{article.excerpt || ''}</MarkdownRenderer>
              </div>
              {article.tags && article.tags.length > 0 && (
                <div className="article-tags">
                  {article.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}
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
      <ScrollToTopButton />
    </div>
  );
};

export default ArticleList;