import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // 更新 state 以致于下一次渲染能显示后备 UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 你同样可以将错误日志上报给服务器
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-color)',
          color: 'var(--text-color)'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ff4d4f' }}>糟糕，出了点问题</h1>
          <p style={{ marginBottom: '2rem', maxWidth: '600px', lineHeight: '1.6' }}>
            {this.state.error?.message || '应用程序在渲染时遇到了意外错误。'}
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
          >
            返回首页
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;