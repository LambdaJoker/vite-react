/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-04-28 20:45:53
 * @LastEditTime: 2025-04-28 21:42:24
 */
import { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import SEO from '../../common/SEO';

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
  read_count: number;
  tags: string[];
}

const ArticleDetail: FC = () => {
  const { id } = useParams<ArticleParams>();
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3000/api/articles/${id}`);
        setArticle(response.data);
      } catch (error) {
        console.error('获取文章失败:', error);
        setError('获取文章失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!article) {
    return <div className="article-not-found">文章未找到</div>;
  }

  return (
    <>
      <SEO
        title={`${article.title} - 我的博客`}
        description={article.content.replace(/<[^>]+>/g, '').slice(0, 200)}
        keywords={article.category}
        type="article"
        image={article.image}
      />
      <div className="article-detail-container">
        <div className="article-header">
          {/* <div className="article-cover" style={{ backgroundImage: `url(${article.image})` }}></div> */}
          <div className="article-info">
            <h1>{article.title}</h1>
            <div className="article-meta">
              <span className="author">作者：{article.author}</span>
              <span className="date">发布于：{article.date}</span>
              <span className="category">{article.category}</span>
              <span className="read-count">阅读次数：{article.read_count}</span>
            </div>
          </div>
        </div>

        <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }}></div>

        <div className="article-footer">
          <div className="tags">
            {article.tags?.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
          <div className="share-buttons">
            <button className="share-button">分享到微信</button>
            <button className="share-button">分享到微博</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleDetail; 