import { FC, useState, useEffect, useMemo } from 'react';
import useArticleStore from '../../store/articleStore';
import SEO from '../../common/SEO';
import ScrollToTopButton from '../../common/ScrollToTopButton';
import HomeContent from '../HomeContent';
import { Article } from '../../store/articleStore';

const HomePage: FC = () => {
  const { articles, fetchArticles, isLoading: articlesLoading } = useArticleStore();
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
    if (articles.length === 0) {
      fetchArticles();
    }
  }, [fetchArticles, articles.length]);

  const latestArticles = useMemo(() => articles.slice(0, 3), [articles]);

  return (
    <>
      <SEO
        title="首页 - 我的个人博客"
        description="欢迎访问我的个人博客，这里分享前端开发技术和经验"
        keywords="前端开发,React,TypeScript,个人博客"
      />
      <HomeContent
        isAnimated={isAnimated}
        isLoading={articlesLoading}
        latestArticles={latestArticles}
      />
      <ScrollToTopButton />
    </>
  );
};

export default HomePage; 