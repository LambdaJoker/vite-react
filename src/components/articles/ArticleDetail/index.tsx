/** @jsx React.createElement */
import { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './index.css';

interface ArticleParams {
  id: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
  date: string;
  category: string;
  image: string;
  author: string;
  readTime: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: "React 开发实战经验分享",
    content: `
      <h2>引言</h2>
      <p>React 作为现代前端开发中最流行的框架之一，其强大的组件化和状态管理机制为开发者提供了极大的便利...</p>
      
      <h2>性能优化技巧</h2>
      <p>1. 使用 React.memo() 避免不必要的重渲染</p>
      <p>2. 合理使用 useMemo 和 useCallback</p>
      <p>3. 使用虚拟列表处理大数据渲染</p>
      
      <h2>状态管理最佳实践</h2>
      <p>在大型应用中，合理的状态管理是至关重要的。Redux、MobX 等状态管理库各有特点...</p>
    `,
    date: "2024-02-15",
    category: "技术",
    image: "/src/assets/article1.jpg",
    author: "TAO",
    readTime: "10 次"
  },
  // ... 其他文章数据
];

const ArticleDetail: FC = () => {
  const { id } = useParams<ArticleParams>();
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    // 模拟文章加载
    setTimeout(() => {
      const found = articles.find(a => a.id === parseInt(id));
      setArticle(found || null);
      setIsLoading(false);
    }, 800);
  }, [id]);

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  if (!article) {
    return <div className="article-not-found">文章未找到</div>;
  }

  return (
    <div className="article-detail-container">
      <div className="article-header">
        {/* <div className="article-cover" style={{ backgroundImage: `url(${article.image})` }}></div> */}
        <div className="article-info">
          <h1>{article.title}</h1>
          <div className="article-meta">
            <span className="author">作者：{article.author}</span>
            <span className="date">发布于：{article.date}</span>
            <span className="category">{article.category}</span>
            <span className="read-time">阅读次数：{article.readTime}</span>
          </div>
        </div>
      </div>

      <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }}></div>

      <div className="article-footer">
        <div className="tags">
          <span className="tag">React</span>
          <span className="tag">前端开发</span>
          <span className="tag">性能优化</span>
        </div>
        <div className="share-buttons">
          <button className="share-button">分享到微信</button>
          <button className="share-button">分享到微博</button>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail; 