/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: my learn note of react
 * @Date: 2025-03-08 13:34:28
 * @LastEditTime: 2025-03-08 13:55:26
 */
import React, { FC } from 'react';
import './index.css';

interface SkeletonProps {
  type: 'card' | 'text' | 'title' | 'avatar' | 'image';
  count?: number;
  width?: string;
  height?: string;
  className?: string;
  animate?: boolean;
}

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
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`skeleton skeleton-${type} ${animate ? 'animate' : ''} ${className}`}
          style={{
            width: width,
            height: height
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
};

export default SkeletonLoader; 