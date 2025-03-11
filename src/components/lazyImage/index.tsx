/** @jsx React.createElement */
/** @jsxFrag React.Fragment */

import React, { useState, useEffect, useRef } from 'react';
import './index.css';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
  width?: string | number;
  height?: string | number;
  onLoad?: () => void;
  errorFallback?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholderColor = '#f0f0f0'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      className={`lazy-image-container ${className}`}
      style={{ backgroundColor: placeholderColor }}
    >
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'loaded' : ''}`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
      {!isLoaded && isInView && <div className="lazy-image-loading"></div>}
    </div>
  );
};

export default LazyImage; 