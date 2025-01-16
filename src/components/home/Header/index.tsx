import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const Header = () => {
  const [sidebar, setSidebar] = useState(false);

  return (
    <div>
      <div className="header">
        <div className="container">
          <div className="logo">
            <img src="src/assets/logo.png" alt="Logo" />
          </div>

          <div className="nav">
            <ul className={sidebar ? "nav-links-sidebar" : "nav-links"} onClick={() => setSidebar(false)}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/pages">Pages</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Toggle Button for Mobile Sidebar */}
          <div className="hamburger" onClick={() => setSidebar(!sidebar)}>
            <span className="bar">1</span>
            <span className="bar">2</span>
            <span className="bar">3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
