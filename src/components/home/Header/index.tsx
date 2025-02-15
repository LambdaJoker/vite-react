/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: my learn note of react
 * @Date: 2025-01-16 16:13:12
 * @LastEditTime: 2025-02-15 15:26:44
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import logo from '../../../assets/logo.png';


interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "TAO" }) => {
  return (
    <header className="header-container">
      <div className="header-content">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-image" />
          <h1 className="logo">{title}</h1>
        </div>
        <nav className="navigation">
          <Link to="/" className="nav-link">首页</Link>
          <Link to="/articles" className="nav-link">文章</Link>
          <Link to="/skills" className="nav-link">技术栈</Link>
          <Link to="/projects" className="nav-link">项目</Link>
          <Link to="/about" className="nav-link">关于</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
