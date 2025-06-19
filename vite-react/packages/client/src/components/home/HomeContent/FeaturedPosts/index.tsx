/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-06-19 09:37:26
 * @LastEditTime: 2025-06-19 09:48:27
 */
import { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../../store/articleStore';
import { createExcerpt, getImageUrl } from '../../../../utils/helpers';

interface FeaturedPostsProps {
  articles: Article[];
}

const FeaturedPosts: FC<FeaturedPostsProps> = ({ articles }) => {
  return (
    <section className="featured-posts">
      <h2>最新文章</h2>
      <div className="posts-grid">
        {articles.map(article => (
          <div className="post-card" key={article.id}>
            <div className="post-image">
              <img src={getImageUrl(article.image)} alt={article.title} />
            </div>
            <div className="post-content">
              <h3>{article.title}</h3>
              <p>{article.excerpt || createExcerpt(article.content)}</p>
              <Link to={`/articles/${article.id}`} className="read-more">阅读更多</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default memo(FeaturedPosts); 