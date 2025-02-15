import React from 'react';
import './Loading.css';

interface LoadingProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  text = "加载中",
  size = 'medium',
  fullScreen = false
}) => {
  const content = (
    <div className={`loading-container loading-${size}`}>
      <div className="loading-spinner"></div>
      <div className="loading-text">
        {text}<span className="loading-dots"></span>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-backdrop">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading; 