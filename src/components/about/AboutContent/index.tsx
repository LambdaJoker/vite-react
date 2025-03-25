/** @jsx React.createElement */
/** @jsxFrag React.Fragment */
import React, { FC, useState, useEffect } from 'react';
import './index.css';
import { FaGithub } from 'react-icons/fa';
import SEO from '../../common/SEO';
import SkeletonLoader from '../../skeletonLoader';

const AboutContent: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimated, setIsAnimated] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="about-container">
        <div className="about-header">
          <SkeletonLoader type="title" />
          <SkeletonLoader type="text" count={2} />
        </div>
        <div className="timeline">
          <SkeletonLoader type="card" count={3} />
        </div>
        <div className="education-section">
          <SkeletonLoader type="card" count={2} />
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="关于我 - 我的个人博客"
        description="了解我的个人经历、技术背景和职业规划"
        keywords="个人简介,技术博客,全栈开发,个人经历"
      />
      <div className={`about-container ${isAnimated ? 'animated' : ''}`}>
        {/* 个人简介 */}
        <section className="about-header">
          <h1>关于我</h1>
          <p className="subtitle">热爱技术，追求创新</p>
          <div className="intro-text">
            <p>
              我是一名充满热情的前端开发工程师，专注于现代Web技术和云计算领域。
              在过去的3年里，我参与了多个大型项目的开发，积累了丰富的实战经验。
              我热衷于学习新技术，并善于将技术转化为解决实际问题的方案。
            </p>
          </div>
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

        {/* 联系方式 */}
        <section className="contact-section">
          <h2>联系方式</h2>
          <div className="contact-grid">
            <a href="2667534364@qq.com" className="contact-item">
              <span className="contact-icon">📧</span>
              <span>Email</span>
            </a>
            <a href="https://github.com/taotaozi-pro" className="contact-item">
              <span className="contact-icon">
                <FaGithub />
              </span>
              <span>GitHub</span>
            </a>
            <a href="https://linkedin.com/in/yourusername" className="contact-item">
              <span className="contact-icon">💼</span>
              <span>LinkedIn</span>
            </a>
          </div>
        </section>

        {/* 工作经历 */}
        <section className="experience-section">
          <h2>工作经历</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-date">2026 - 至今</div>
              <div className="timeline-content">
                <h3>前端开发工程师</h3>
                <p className="company">某科技公司</p>
                <ul className="achievements">
                  <li>负责公司前端开发</li>
                  <li>带领团队完成多个重要项目的交付</li>
                  <li>优化系统性能，提升用户体验</li>
                </ul>
              </div>
            </div>
            {/* <div className="timeline-item">
              <div className="timeline-date">2022 - 2023</div>
              <div className="timeline-content">
                <h3>前端开发工程师</h3>
                <p className="company">某互联网公司</p>
                <ul className="achievements">
                  <li>负责公司电商平台的前端开发</li>
                  <li>实现复杂的交互功能和动画效果</li>
                  <li>优化前端性能，提升用户体验</li>
                </ul>
              </div>
            </div> */}
          </div>
        </section>

        {/* 教育背景 */}
        <section className="education-section">
          <h2>教育背景</h2>
          <div className="education-card">
            <h3>数据科学与大数据技术</h3>
            <p className="school">东华理工大学</p>
            <p className="period">2022 - 2026</p>
            <p className="description">
              主修课程：数据结构、算法分析、计算机网络、操作系统、数据库系统、爬虫、HBase、Hive、Hadoop等
            </p>
          </div>
        </section>

        {/* 技能证书 */}
        <section className="certificates-section">
          <h2>技能证书</h2>
          <div className="certificates-grid">
            <div className="certificate-card">
              <div className="certificate-icon">📜</div>
              <h3>第六届人工智能算法大赛</h3>
              <h3>国家三等奖</h3>
              <p className="certificate-date">2024年获得</p>
            </div>
            <div className="certificate-card">
              <div className="certificate-icon">🏆</div>
              <h3>CET-4</h3>
              <p className="certificate-date">2023年获得</p>
            </div>
            <div className="certificate-card">
              <div className="certificate-icon">🎯</div>
              <h3>CET-6</h3>
              <p className="certificate-date">2025年获得</p>
            </div>
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
            <div className="strength-card">
              <div className="strength-icon">🎯</div>
              <h3>项目管理</h3>
              <p>具备项目规划和团队管理经验</p>
            </div>
            <div className="strength-card">
              <div className="strength-icon">🔍</div>
              <h3>技术钻研</h3>
              <p>对技术有浓厚兴趣，持续学习新知识</p>
            </div>
            <div className="strength-card">
              <div className="strength-icon">🌐</div>
              <h3>全栈开发</h3>
              <p>前后端技术全面，经验丰富</p>
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
              <p className="interest-desc">关注技术发展动态，阅读技术博客和书籍</p>
            </div>
            <div className="interest-item">
              <span className="interest-icon">🎮</span>
              <span>游戏开发</span>
              <p className="interest-desc">业余时间研究游戏开发，热爱创造</p>
            </div>
            <div className="interest-item">
              <span className="interest-icon">🎨</span>
              <span>UI 设计</span>
              <p className="interest-desc">关注用户体验，学习界面设计</p>
            </div>
            <div className="interest-item">
              <span className="interest-icon">✍️</span>
              <span>技术写作</span>
              <p className="interest-desc">分享技术经验，撰写技术文章</p>
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

export default AboutContent; 