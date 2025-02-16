/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: my learn note of react
 * @Date: 2025-02-15 13:04:41
 * @LastEditTime: 2025-02-16 17:28:15
 */
import { FC, useState, useEffect } from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className={`home-container ${isAnimated ? 'animated' : ''}`}>
      <section className="hero-section">
        <h1>欢迎来到我的个人网站</h1>
        <p className="subtitle">全栈开发工程师 | 人工智能爱好者</p>
        <div className="cta-buttons">
          <Link to="/about" className="cta-button primary">了解更多</Link>
          <Link to="/skills" className="cta-button secondary">查看技能</Link>
        </div>
      </section>

      <section className="featured-posts">
        <h2>最新文章</h2>
        <div className="posts-grid">
          <div className="post-card">
            <div className="post-image" style={{ backgroundImage: "url('/images/article1.jpg')" }}></div>
            <div className="post-content">
              <h3>React 开发实践</h3>
              <p>分享 React 开发中的经验和最佳实践...</p>
              <Link to="/blog/react-best-practices" className="read-more">阅读更多</Link>
            </div>
          </div>

          <div className="post-card">
            <div className="post-image" style={{ backgroundImage: "url('/images/article2.jpg')" }}></div>
            <div className="post-content">
              <h3>Python 机器学习入门</h3>
              <p>从零开始学习 Python 机器学习的基础知识...</p>
              <Link to="/blog/python-ml-basics" className="read-more">阅读更多</Link>
            </div>
          </div>

          <div className="post-card">
            <div className="post-image" style={{ backgroundImage: "url('/images/article3.jpg')" }}></div>
            <div className="post-content">
              <h3>大数据处理技术</h3>
              <p>探索大数据处理的核心技术和工具...</p>
              <Link to="/blog/big-data-processing" className="read-more">阅读更多</Link>
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
            <div className="project-image" style={{ backgroundImage: "url('/images/project1.jpg')" }}></div>
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
        <button className="scroll-top" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
};

export default HomeContent; 