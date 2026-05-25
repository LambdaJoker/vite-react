import React from 'react';
import './index.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const contactEmail = '2667534364@qq.com';
  const contactHref = `https://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=${encodeURIComponent(contactEmail)}`;

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {currentYear} My Personal Website. All rights reserved.</p>
        <div className="footer-links">
          <a href="https://github.com/LambdaJoker/vite-react" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={contactHref} target="_blank" rel="noopener noreferrer">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
