/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-06-19 09:36:37
 * @LastEditTime: 2025-06-19 09:38:16
 */
import { FC, memo } from 'react';
import { Link } from 'react-router-dom';

const HeroSection: FC = () => {
  return (
    <section className="hero-section">
      <h1>欢迎来到我的个人网站</h1>
      <br />
      <p className="subtitle">前端开发工程师 | 人工智能爱好者</p>
      <div className="cta-buttons">
        <Link to="/about" className="cta-button primary">了解更多</Link>
        <Link to="/skills" className="cta-button secondary">查看技能</Link>
      </div>
    </section>
  );
};

export default memo(HeroSection); 