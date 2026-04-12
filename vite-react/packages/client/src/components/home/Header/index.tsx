/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: header
 * @Date: 2025-01-16 16:32:02
 * @LastEditTime: 2025-06-18 19:36:47
 */
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './index.css';
import logo from '../../../assets/logo.png';
import { FaImage, FaImages, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa'; // 引入图标
import useAppStore from '../../store/appStore'; // 引入 store
import { throttle } from '../../../utils/helpers';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 判断导航项是否为当前激活路由
  const isActive = (path: string) => location.pathname === path;

  // 路由切换时自动关闭移动端菜单
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // 默认应用浅色主题
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }, []);

  // 监听滚动事件，控制头部样式
  useEffect(() => {
    // 处理滚动事件，添加或移除滚动样式类，并使用节流优化性能
    const handleScroll = throttle(() => {
      const header = document.querySelector('.header');
      if (window.scrollY > 50) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    }, 100);

    // 添加滚动事件监听器
    window.addEventListener('scroll', handleScroll);
    // 组件卸载时移除事件监听器
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { isReadOnly, bgMode, setBgMode, logoutAdmin } = useAppStore();

  const toggleBgMode = () => {
    setBgMode(bgMode === 'dynamic' ? 'static' : 'dynamic');
  };

  const handleLogout = () => {
    if (window.confirm('确定要退出管理员模式吗？')) {
      logoutAdmin();
    }
  };

  return (
    // 头部容器
    <header className="header-container">
      <div className="header-content">
        {/* Logo 区域 */}
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-image" />
          <h1 className="logo">{title}</h1>
        </div>
        
        {/* 移动端菜单切换按钮 */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* 导航菜单 */}
        <nav className={`navigation ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {/* 导航链接，根据当前路由添加激活样式 */}
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>首页</Link>
          <Link to="/articles" className={`nav-link ${isActive('/articles') ? 'active' : ''}`}>文章</Link>
          <Link to="/bookmarks" className={`nav-link ${isActive('/bookmarks') ? 'active' : ''}`}>资源库</Link>
          <Link to="/projects" className={`nav-link ${isActive('/projects') ? 'active' : ''}`}>项目</Link>
          <Link to="/thoughts" className={`nav-link ${isActive('/thoughts') ? 'active' : ''}`}>思考</Link>
          
          {/* 开发模式下显示背景切换按钮 */}
          {!isReadOnly && (
            <>
              <button
                onClick={toggleBgMode}
                className="bg-toggle-btn"
                aria-label="Toggle background mode"
                title={bgMode === 'dynamic' ? "切换为静态背景" : "切换为动态背景"}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-color)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '1.2rem',
                  padding: '0.5rem',
                  marginLeft: '0.5rem'
                }}
              >
                {bgMode === 'dynamic' ? <FaImages /> : <FaImage />}
              </button>
              
              <button
                onClick={handleLogout}
                className="logout-btn"
                aria-label="Logout Admin"
                title="退出管理员模式"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ff4d4f', // 使用红色警示退出操作
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '1.2rem',
                  padding: '0.5rem',
                  marginLeft: '0.5rem',
                  transition: 'opacity 0.3s ease'
                }}
              >
                <FaSignOutAlt />
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
