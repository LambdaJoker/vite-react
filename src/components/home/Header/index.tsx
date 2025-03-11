/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: my learn note of react
 * @Date: 2025-01-16 16:13:12
 * @LastEditTime: 2025-03-11 15:44:01
 */
/** @jsx React.createElement */
/** @jsxFrag React.Fragment */
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './index.css';
import logo from '../../../assets/logo.png';


interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "TAO" }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.header');
      if (window.scrollY > 50) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="header-container">
      <div className="header-content">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-image" />
          <h1 className="logo">{title}</h1>
        </div>
        <nav className="navigation">
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
