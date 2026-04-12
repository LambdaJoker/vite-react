/*
 * @Author: Random Glow
 * @LastEditors: Random Glow
 * @Description: Do not edit
 * @Date: 2025-06-19 09:37:26
 * @LastEditTime: 2025-06-19 09:48:27
 */
import { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../../store/articleStore';
import { createExcerpt, getImageUrl } from '../../../../utils/helpers';
import defaultCover from '../../../../assets/default-cover.svg';
import MarkdownRenderer from '../../../common/MarkdownRenderer';
import LazyImage from '../../../lazyImage';

interface FeaturedPostsProps {
  articles: Article[];
}

const FeaturedPosts: FC<FeaturedPostsProps> = ({ articles }) => {
  const postList = Array.isArray(articles) ? articles : [];

  if (postList.length === 0) {
    return null;
  }

  return (
    <section className="featured-posts">
      <h2>最新文章</h2>
      <div className="posts-grid">
        {postList.map(article => (
          <div className="post-card" key={article.id}>
            <div className="post-image">
              <LazyImage 
                src={getImageUrl(article.image) || defaultCover} 
                alt={article.title} 
                className="featured-post-cover"
              />
            </div>
            <div className="post-content">
              <h3>{article.title}</h3>
              <div className="article-excerpt markdown-preview">
                <MarkdownRenderer>{article.excerpt || createExcerpt(article.content)}</MarkdownRenderer>
              </div>
              <Link to={`/articles/${article.id}`} className="read-more">阅读更多</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default memo(FeaturedPosts); 