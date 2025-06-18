/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: header
 * @Date: 2025-01-16 16:32:02
 * @LastEditTime: 2025-06-18 19:36:47
 */
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './index.css';
import logo from '../../../assets/logo.png';

// 定义组件属性接口
interface HeaderProps {
  // 网站标题，默认值为 "TAO"
  title?: string;
}

/**
 * 页面头部导航组件
 * 包含 logo、标题和导航链接
 * 支持滚动时的样式变化和当前路由高亮
 */
const Header: React.FC<HeaderProps> = ({ title = "TAO" }) => {
  // 获取当前路由位置
  const location = useLocation();

  // 判断导航项是否为当前激活路由
  const isActive = (path: string) => location.pathname === path;

  // 监听滚动事件，控制头部样式
  useEffect(() => {
    // 处理滚动事件，添加或移除滚动样式类
    const handleScroll = () => {
      const header = document.querySelector('.header');
      if (window.scrollY > 50) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    };

    // 添加滚动事件监听器
    window.addEventListener('scroll', handleScroll);
    // 组件卸载时移除事件监听器
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // 头部容器
    <header className="header-container">
      <div className="header-content">
        {/* Logo 区域 */}
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-image" />
          <h1 className="logo">{title}</h1>
        </div>
        {/* 导航菜单 */}
        <nav className="navigation">
          {/* 导航链接，根据当前路由添加激活样式 */}
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>首页</Link>
          <Link to="/articles" className={`nav-link ${isActive('/articles') ? 'active' : ''}`}>文章</Link>
          <Link to="/skills" className={`nav-link ${isActive('/skills') ? 'active' : ''}`}>技术栈</Link>
          <Link to="/projects" className={`nav-link ${isActive('/projects') ? 'active' : ''}`}>项目</Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>个人简介</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
