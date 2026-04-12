/*
 * @Author: Random Glow
 * @LastEditors: Random Glow
 * @Description: skeleton loader
 * @Date: 2025-03-08 13:34:28
 * @LastEditTime: 2025-03-25 23:41:40
 */
import { FC } from 'react';
import './index.css';

interface SkeletonProps {
  // 骨架屏类型：卡片、文本、标题、头像或图片
  type: 'card' | 'text' | 'title' | 'avatar' | 'image';
  // 重复次数，默认为 1
  count?: number;
  // 自定义宽度
  width?: string;
  // 自定义高度
  height?: string;
  // 额外的 CSS 类名
  className?: string;
  // 是否启用动画效果，默认为 true
  animate?: boolean;
}

/**
 * 骨架屏加载组件
 * 用于在内容加载时显示占位UI
 * @param props SkeletonProps 骨架屏配置项
 */
const SkeletonLoader: FC<SkeletonProps> = ({
  type,
  count = 1,
  width,
  height,
  className = '',
  animate = true
}) => {
  return (
    <>
      {/* 根据 count 生成指定数量的骨架屏元素 */}
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          // 组合多个类名：基础类、类型类、动画类和自定义类
          className={`skeleton skeleton-${type} ${animate ? 'animate' : ''} ${className}`}
          style={{
            width: width,
            height: height
          }}
          // 对屏幕阅读器隐藏
          aria-hidden="true"
        />
      ))}
    </>
  );
};

export default SkeletonLoader; 