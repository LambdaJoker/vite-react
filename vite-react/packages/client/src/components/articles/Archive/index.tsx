import { FC, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useArticleStore from '../../store/articleStore';
import SkeletonLoader from '../../skeletonLoader';
import ScrollToTopButton from '../../common/ScrollToTopButton';
import './index.css';

const Archive: FC = () => {
  const { articles, isLoading, error, fetchArticles } = useArticleStore();
  const [isAnimated, setIsAnimated] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    setIsInitialLoad(true);
    fetchArticles({ reset: true, limit: 100 }).finally(() => setIsInitialLoad(false));
    setIsAnimated(true);
  }, [fetchArticles]);

  // 按年份和月份对文章进行分组
  const groupedArticles = useMemo(() => {
    const groups: Record<string, Record<string, typeof articles>> = {};

    // 确保按日期降序排列
    const sortedArticles = [...articles].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    sortedArticles.forEach(article => {
      const date = new Date(article.date);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');

      if (!groups[year]) {
        groups[year] = {};
      }
      if (!groups[year][month]) {
        groups[year][month] = [];
      }
      groups[year][month].push(article);
    });

    return groups;
  }, [articles]);

  const years = Object.keys(groupedArticles).sort((a, b) => Number(b) - Number(a));

  if (isInitialLoad || (isLoading && articles.length === 0)) {
    return (
      <div className="archive-container">
        <SkeletonLoader type="title" />
        <SkeletonLoader type="text" count={5} />
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className={`archive-container ${isAnimated ? 'animated' : ''}`}>
      <div className="archive-header">
        <h1>文章归档</h1>
        <p className="subtitle">共计 {articles.length} 篇文章，继续努力！</p>
      </div>

      <div className="archive-timeline">
        {years.map(year => (
          <div key={year} className="timeline-year-group">
            <h2 className="timeline-year">{year}年</h2>
            {Object.keys(groupedArticles[year])
              .sort((a, b) => Number(b) - Number(a))
              .map(month => (
                <div key={`${year}-${month}`} className="timeline-month-group">
                  <h3 className="timeline-month">{month}月</h3>
                  <ul className="timeline-list">
                    {groupedArticles[year][month].map(article => (
                      <li key={article.id} className="timeline-item">
                        <span className="timeline-date">
                          {new Date(article.date).getDate().toString().padStart(2, '0')}日
                        </span>
                        <Link to={`/articles/${article.id}`} className="timeline-title">
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        ))}
      </div>
      
      <ScrollToTopButton />
    </div>
  );
};

export default Archive;
