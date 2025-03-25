/** @jsx React.createElement */
/** @jsxFrag React.Fragment */

import React, { useState, useEffect, useRef } from 'react';
import './index.css';

interface LazyImageProps {
  // 图片源地址
  src: string;
  // 图片替代文本
  alt: string;
  // 自定义类名
  className?: string;
  // 占位背景颜色
  placeholderColor?: string;
  // 图片宽度
  width?: string | number;
  // 图片高度
  height?: string | number;
  // 图片加载完成回调
  onLoad?: () => void;
  // 加载失败时的替代图片
  errorFallback?: string;
}

/**
 * 懒加载图片组件
 * 使用 IntersectionObserver 实现图片懒加载
 * 支持加载状态显示和自定义占位样式
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholderColor = '#f0f0f0'
}) => {
  // 图片加载完成状态
  const [isLoaded, setIsLoaded] = useState(false);
  // 图片是否进入视口
  const [isInView, setIsInView] = useState(false);
  // 容器引用，用于观察元素
  const imgRef = useRef<HTMLDivElement>(null);

  // 设置 IntersectionObserver 监听元素可见性
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 当元素进入视口时加载图片
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      // 设置阈值为 0.1，即元素 10% 进入视口时触发
      { threshold: 0.1 }
    );

    // 开始观察容器元素
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    // 组件卸载时清理观察器
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      className={`lazy-image-container ${className}`}
      style={{ backgroundColor: placeholderColor }}
    >
      {/* 仅在元素进入视口后渲染图片 */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'loaded' : ''}`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
      {/* 显示加载状态指示器 */}
      {!isLoaded && isInView && <div className="lazy-image-loading"></div>}
    </div>
  );
};

export default LazyImage; 