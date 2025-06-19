/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-04-28 20:45:53
 * @LastEditTime: 2025-06-18 23:07:40
 */
import { FC, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useArticleStore from '../../store/articleStore'; // 修正路径
import useAppStore from '../../store/appStore'; // 修正路径
import './index.css';
import SEO from '../../common/SEO';
import SkeletonLoader from '../../skeletonLoader'; // 引入骨架加载器

const ArticleDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isReadOnly } = useAppStore(); // 获取只读状态
  const {
    currentArticle: article,
    isLoading,
    error,
    fetchArticle,
    deleteArticle,
    clearCurrentArticle,
  } = useArticleStore();

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
    // 组件卸载时清除当前文章数据
    return () => {
      clearCurrentArticle();
    };
  }, [id, fetchArticle, clearCurrentArticle]);

  const handleDelete = async () => {
    if (id && window.confirm('你确定要删除这篇文章吗？')) {
      await deleteArticle(id);
      navigate('/articles');
    }
  };

  if (isLoading) {
    return (
      <div className="article-detail-container">
        <SkeletonLoader type="title" />
        <SkeletonLoader type="text" count={5} />
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!article) {
    return <div className="article-not-found">文章未找到</div>;
  }

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${import.meta.env.VITE_API_BASE_URL}${imagePath}`;
  };

  return (
    <>
      <SEO
        title={`${article.title} - 我的博客`}
        description={article.content.replace(/<[^>]+>/g, '').slice(0, 200)}
        keywords={article.category}
        type="article"
        image={getImageUrl(article.image)}
      />
      <div className="article-detail-container">
        {article.image && (
          <div className="article-cover" style={{ backgroundImage: `url(${getImageUrl(article.image)})` }}></div>
        )}
        <div className="article-header">
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
          {/* 只有在非只读模式下才显示操作按钮 */}
          {!isReadOnly && (
            <div className="action-buttons">
              <Link to={`/articles/${id}/edit`} className="action-button edit-button">
                编辑
              </Link>
              <button onClick={handleDelete} className="action-button delete-button">
                删除
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ArticleDetail; 