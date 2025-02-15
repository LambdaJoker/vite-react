/** @jsx React.createElement */
import React, { FC, useState, useEffect } from 'react';
import './index.css';

const AboutContent: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1
      }
    );

    document.querySelectorAll('.about-container section').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
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
    <div className={`about-container ${isAnimated ? 'animated' : ''}`}>
      {/* 个人简介部分 */}
      <section className="about-header">
        <h1>关于我</h1>
        <p className="subtitle">热爱技术，追求创新</p>
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-number">3+</span>
            <span className="stat-label">年开发经验</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">20+</span>
            <span className="stat-label">项目经验</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">5+</span>
            <span className="stat-label">技术领域</span>
          </div>
        </div>
      </section>

      {/* 个人经历 */}
      <section className="experience-section">
        <h2>工作经历</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-date">2023 - 至今</div>
            <div className="timeline-content">
              <h3>高级全栈开发工程师</h3>
              <p className="company">某科技公司</p>
              <ul className="achievements">
                <li>负责公司核心业务系统的架构设计和开发</li>
                <li>带领团队完成多个重要项目的交付</li>
                <li>优化系统性能，提升用户体验</li>
              </ul>
            </div>
          </div>
          {/* 可以添加更多工作经历 */}
        </div>
      </section>

      {/* 教育背景 */}
      <section className="education-section">
        <h2>教育背景</h2>
        <div className="education-card">
          <h3>计算机科学与技术</h3>
          <p className="school">某某大学</p>
          <p className="period">2019 - 2023</p>
          <p className="description">
            主修课程：数据结构、算法分析、计算机网络、操作系统、数据库系统等
          </p>
        </div>
      </section>

      {/* 个人特长 */}
      <section className="strengths-section">
        <h2>个人特长</h2>
        <div className="strengths-grid">
          <div className="strength-card">
            <div className="strength-icon">🚀</div>
            <h3>快速学习</h3>
            <p>善于学习新技术，快速适应新环境</p>
          </div>
          <div className="strength-card">
            <div className="strength-icon">🤝</div>
            <h3>团队协作</h3>
            <p>良好的沟通能力，擅长团队协作</p>
          </div>
          <div className="strength-card">
            <div className="strength-icon">💡</div>
            <h3>问题解决</h3>
            <p>善于分析和解决复杂问题</p>
          </div>
        </div>
      </section>

      {/* 兴趣爱好 */}
      <section className="interests-section">
        <h2>兴趣爱好</h2>
        <div className="interests-grid">
          <div className="interest-item">
            <span className="interest-icon">📚</span>
            <span>技术阅读</span>
          </div>
          <div className="interest-item">
            <span className="interest-icon">🎮</span>
            <span>游戏开发</span>
          </div>
          <div className="interest-item">
            <span className="interest-icon">🎨</span>
            <span>UI 设计</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutContent; 