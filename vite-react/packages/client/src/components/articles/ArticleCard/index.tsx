import { FC } from 'react';
import { Link } from 'react-router-dom';
import LazyImage from '../../lazyImage';
import MarkdownRenderer from '../../common/MarkdownRenderer';
import { getImageUrl } from '../../../utils/helpers';
import { type Article } from '../../store/articleStore';
import './index.css';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="article-card">
      <div className="article-image">
        <LazyImage 
          src={getImageUrl(article.image)} 
          alt={article.title}
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
  );
};

export default ArticleCard;
