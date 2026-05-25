/*
 * @Author: Random Glow
 * @LastEditors: Random Glow
 * @Description: Do not edit
 * @Date: 2025-06-18 19:55:02
 * @LastEditTime: 2025-06-18 19:55:30
 */
import { useState, useEffect } from 'react';
import './index.css';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <button
      className={`scroll-top-button-reusable ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <span className="material-icons">keyboard_arrow_up</span>
    </button>
  );
};

export default ScrollToTopButton; 
