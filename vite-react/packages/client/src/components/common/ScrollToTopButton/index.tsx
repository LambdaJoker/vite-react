/*
 * @Author: Random Glow
 * @LastEditors: Random Glow
 * @Description: Do not edit
 * @Date: 2025-06-18 19:55:02
 * @LastEditTime: 2025-06-18 19:55:30
 */
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="scroll-top-button-reusable"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <span className="material-icons">keyboard_arrow_up</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton; 