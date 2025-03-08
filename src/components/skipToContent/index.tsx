import React, { FC, useState } from 'react';
import './index.css';

const SkipToContent: FC = () => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href="#main-content"
      className={`skip-to-content ${isFocused ? 'focused' : ''}`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={handleSkip}
      aria-label="跳转到主要内容"
    >
      跳转到主要内容
    </a>
  );
};

export default SkipToContent; 