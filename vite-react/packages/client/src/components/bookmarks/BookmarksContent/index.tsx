import { FC, useState, useMemo, useEffect } from 'react';
import './index.css';
import SEO from '../../common/SEO';
import ScrollToTopButton from '../../common/ScrollToTopButton';
import { bookmarksData } from '../data';

const BookmarksContent: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const categories = useMemo(() => {
    return ['全部', ...new Set(bookmarksData.map(b => b.category))];
  }, []);

  const filteredBookmarks = useMemo(() => {
    return bookmarksData.filter(bookmark => {
      const matchesSearch = bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            bookmark.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === '全部' || bookmark.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  return (
    <>
      <SEO 
        title="资源收藏 | Random Glow" 
        description="分享优质的前端开源库、设计素材、效率工具与学习资料。" 
      />
      <div className={`bookmarks-container ${isAnimated ? 'animated' : ''}`}>
        <div className="bookmarks-header">
          <h1>资源收藏</h1>
          <p className="subtitle">发现并分享那些提升幸福感的好工具</p>
        </div>

        {/* 搜索和分类 */}
        <div className="search-filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="搜索资源、工具或关键字..."
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
              </button>
            ))}
          </div>
        </div>

        {/* 资源列表 */}
        <div className="bookmarks-grid">
          {filteredBookmarks.length > 0 ? (
            filteredBookmarks.map(bookmark => (
              <a 
                key={bookmark.id} 
                href={bookmark.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bookmark-card"
              >
                <div className="bookmark-icon">{bookmark.icon}</div>
                <div className="bookmark-content">
                  <h3>{bookmark.title}</h3>
                  <p>{bookmark.description}</p>
                  <span className="bookmark-category">{bookmark.category}</span>
                </div>
              </a>
            ))
          ) : (
            <div className="no-results">
              <p>未找到匹配的资源 ~</p>
            </div>
          )}
        </div>

        <ScrollToTopButton />
      </div>
    </>
  );
};

export default BookmarksContent;
