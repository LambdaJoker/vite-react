/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: my learn note of react
 * @Date: 2025-02-15 13:04:41
 * @LastEditTime: 2025-02-15 14:29:15
 */
import React, { FC, useState, useEffect } from 'react';
import './index.css';
import { Link } from 'react-router-dom';

const HomeContent: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
    // 模拟内容加载
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  }, []);

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
      {/* 个人介绍 */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Hello, I'm TAO</h1>
          <p className="subtitle">Full Stack Developer & Tech Enthusiast</p>
          <div className="cta-buttons">
            <Link to="/projects" className="cta-button primary">查看项目</Link>
            <a href="#contact" className="cta-button secondary">联系我</a>
          </div>
        </div>
      </section>

      {/* 技能展示区域 */}
      <section className="skills-section">
        <h2>技术栈</h2>
        <div className="skills-grid">
          <div className="skill-card">
            <i className="skill-icon frontend"></i>
            <h3>前端开发</h3>
            <p>React, TypeScript, Vue.js</p>
          </div>
          <div className="skill-card">
            <i className="skill-icon backend"></i>
            <h3>后端开发</h3>
            <p>Node.js, Python, Java</p>
          </div>
          <div className="skill-card">
            <i className="skill-icon database"></i>
            <h3>数据库</h3>
            <p>MySQL, MongoDB, Redis</p>
          </div>
          <div className="skill-card">
            <i className="skill-icon database"></i>
            <h3>大数据</h3>
            <p>Hbase, Hadoop, hive</p>
          </div>
        </div>
      </section>

      {/* 最新文章预览 */}
      <section className="latest-posts">
        <h2>最新文章</h2>
        <div className="posts-grid">
          <article className="post-card">
            <div className="post-image" style={{ backgroundImage: "url('/src/assets/article1.jpg')" }}></div>
            <div className="post-content">
              <div className="post-meta">
                <span className="post-date">2024-02-15</span>
                <span className="post-category">技术</span>
              </div>
              <h3>React 开发实战经验分享</h3>
              <p>分享在实际项目中使用 React 的经验和最佳实践，包括性能优化、状态管理等内容...</p>
              <Link to="/articles/1" className="read-more">阅读更多</Link>
            </div>
          </article>

          <article className="post-card">
            <div className="post-image" style={{ backgroundImage: "url('/src/assets/article2.jpg')" }}></div>
            <div className="post-content">
              <div className="post-meta">
                <span className="post-date">2024-02-14</span>
                <span className="post-category">大数据</span>
              </div>
              <h3>Hadoop 生态系统入门指南</h3>
              <p>详细介绍 Hadoop 生态系统的核心组件，以及在大数据处理中的应用场景...</p>
              <Link to="/articles/2" className="read-more">阅读更多</Link>
            </div>
          </article>

          <article className="post-card">
            <div className="post-image" style={{ backgroundImage: "url('/src/assets/article3.jpg')" }}></div>
            <div className="post-content">
              <div className="post-meta">
                <span className="post-date">2024-02-13</span>
                <span className="post-category">数据库</span>
              </div>
              <h3>MongoDB 性能调优技巧</h3>
              <p>探讨 MongoDB 在高并发场景下的性能优化策略，包括索引设计、查询优化等...</p>
              <Link to="/articles/3" className="read-more">阅读更多</Link>
            </div>
          </article>
        </div>
      </section>

      {/* 联系部分 */}
      <section className="contact-section" id="contact">
        <h2>联系我</h2>
        <div className="contact-content">
          <div className="contact-info">
            <p>Email: 2667534364@qq.com</p>
            <p>GitHub: github.com/taotaozi-pro</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeContent; 