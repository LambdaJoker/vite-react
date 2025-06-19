import { FC, memo } from 'react';
import './index.css';
import SkeletonLoader from '../../skeletonLoader';
import { Article } from '../../store/articleStore';
import HeroSection from './HeroSection';
import FeaturedPosts from './FeaturedPosts';
import SkillsPreview from './SkillsPreview';
import ProjectsShowcase from './ProjectsShowcase';
import ContactSection from './ContactSection';

interface HomeContentProps {
  isAnimated: boolean;
  isLoading: boolean;
  latestArticles: Article[];
}

const HomeContent: FC<HomeContentProps> = ({ isAnimated, isLoading, latestArticles }) => {

  if (isLoading) {
    return (
      <div className="home-container">
        {/* 骨架屏可以进一步拆分或优化 */}
        <div className="hero-section">
          <SkeletonLoader type="title" />
          <SkeletonLoader type="text" count={2} />
        </div>
        <div className="featured-posts">
          <SkeletonLoader type="title" />
          <div className="posts-grid">
            <SkeletonLoader type="card" count={3} />
          </div>
        </div>
        <div className="projects-showcase">
          <SkeletonLoader type="title" />
          <div className="projects-grid">
            <SkeletonLoader type="card" count={2} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`home-container ${isAnimated ? 'animated' : ''}`}>
      <HeroSection />
      <FeaturedPosts articles={latestArticles} />
      <SkillsPreview />
      <ProjectsShowcase />
      <ContactSection />
    </div>
  );
};

export default memo(HomeContent); 