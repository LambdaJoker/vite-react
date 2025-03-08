/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: 错误回退组件
 * @Date: 2025-03-08 13:57:26
 * @LastEditTime: 2025-03-08 13:57:26
 */
import React, { FC } from 'react';
import './index.css';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  message?: string;
  buttonText?: string;
}

const ErrorFallback: FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  message = '抱歉，出现了一些问题',
  buttonText = '重试'
}) => {
  return (
    <div className="error-fallback">
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>{message}</h2>
        <p className="error-message">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="retry-button"
          aria-label={buttonText}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback; 