/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: homeContent
 * @Date: 2025-02-15 13:04:41
 * @LastEditTime: 2025-03-11 15:25:33
 */
/** @jsx React.createElement */
/** @jsxFrag React.Fragment */
import { FC, useState, useEffect } from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';
import SEO from '../../common/SEO';
import article1 from '../../../assets/img/article/article1.jpg';
import project1 from '../../../assets/img/project/project1.jpg';
import SkeletonLoader from '../../skeletonLoader';

const HomeContent: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimated, setIsAnimated] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // 预加载重要图片资源
    const preloadImages = ['/images/article1.jpg', '/images/article2.jpg'];
    preloadImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (isLoading) {
    return (
      <div className="home-container">
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
    <>
      <SEO
        title="首页 - 我的个人博客"
        description="欢迎访问我的个人博客，这里分享前端开发技术和经验"
        keywords="前端开发,React,TypeScript,个人博客"
      />

      <div className={`home-container ${isAnimated ? 'animated' : ''}`}>
        <section className="hero-section">
          <h1>欢迎来到我的个人网站</h1>
          <br />
          <p className="subtitle">前端开发工程师 | 人工智能爱好者</p>
          <div className="cta-buttons">
            <Link to="/about" className="cta-button primary">了解更多</Link>
            <Link to="/skills" className="cta-button secondary">查看技能</Link>
          </div>
        </section>

        <section className="featured-posts">
          <h2>最新文章</h2>
          <div className="posts-grid">
            <div className="post-card">
              <div className="post-image">
                <img src={article1} alt="React开发实践" />
              </div>
              <div className="post-content">
                <h3>React 开发实践</h3>
                <p>分享 React 开发中的经验和最佳实践...</p>
                <Link to="/articles/1" className="read-more">阅读更多</Link>
              </div>
            </div>

            <div className="post-card">
              <div className="post-image">
                <img src={article1} alt="Python机器学习入门" loading="lazy" />
              </div>
              <div className="post-content">
                <h3>Python 机器学习入门</h3>
                <p>从零开始学习 Python 机器学习的基础知识...</p>
                <Link to="/articles/2" className="read-more">阅读更多</Link>
              </div>
            </div>

            <div className="post-card">
              <div className="post-image">
                <img src={article1} alt="大数据处理技术" loading="lazy" />
              </div>
              <div className="post-content">
                <h3>大数据处理技术</h3>
                <p>探索大数据处理的核心技术和工具...</p>
                <Link to="/articles/3" className="read-more">阅读更多</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="skills-preview">
          <h2>技术领域</h2>
          <div className="skills-grid">
            <div className="skill-area">
              <span className="skill-icon">💻</span>
              <h3>前端开发</h3>
              <p>React, TypeScript, Vue.js</p>
            </div>
            <div className="skill-area">
              <span className="skill-icon">⚡</span>
              <h3>后端开发</h3>
              <p>Python, Java, Node.js</p>
            </div>
            <div className="skill-area">
              <span className="skill-icon">🤖</span>
              <h3>人工智能</h3>
              <p>机器学习, YOLO, ROS</p>
            </div>
            <div className="skill-area">
              <span className="skill-icon">📊</span>
              <h3>大数据</h3>
              <p>Hadoop, Spark, Hive</p>
            </div>
          </div>
          <Link to="/skills" className="view-all-button">查看所有技能</Link>
        </section>

        <section className="projects-showcase">
          <h2>精选项目</h2>
          <div className="projects-grid">
            <div className="project-card">
              <div className="project-image" style={{ backgroundImage: `url(${project1})` }}></div>
              <div className="project-content">
                <h3>个人博客系统</h3>
                <p>基于 React + TypeScript 的现代化博客系统</p>
                <div className="project-tech">
                  <span>React</span>
                  <span>TypeScript</span>
                  <span>Node.js</span>
                </div>
                <a href="https://github.com/yourusername/blog" className="project-link" target="_blank">
                  查看项目 →
                </a>
              </div>
            </div>
            {/* 可以添加更多项目卡片 */}
          </div>
        </section>

        <section className="contact-section">
          <h2>联系我</h2>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <h3>邮箱</h3>
              <p>2667534364@qq.com</p>
              <a href="mailto:2667534364@qq.com" className="contact-link">发送邮件</a>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <FaGithub />
              </div>
              <h3>GitHub</h3>
              <p>taotaozi-pro</p>
              <a href="https://github.com/taotaozi-pro" target="_blank" className="contact-link">访问主页</a>
            </div>
            <div className="contact-card">
              <div className="contact-icon">💼</div>
              <h3>工作机会</h3>
              <p>期待有趣的工作机会</p>
              <a href="/about" className="contact-link">了解更多</a>
            </div>
          </div>
        </section>

        {showScrollTop && (
          <button
            className="scroll-top-button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            ↑
          </button>
        )}
      </div>
    </>
  );
};

export default HomeContent; 