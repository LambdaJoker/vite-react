/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: notification
 * @Date: 2025-03-08 13:11:09
 * @LastEditTime: 2025-03-25 23:15:56
 */
/** @jsx React.createElement */
/** @jsxFrag React.Fragment */
import React, { useState, useEffect, FC } from 'react';
import './index.css';

interface NotificationProps {
  // 通知消息内容
  message: string;
  // 通知类型：成功、错误、信息、警告
  type: 'success' | 'error' | 'info' | 'warning';
  // 显示持续时间，默认 3000ms
  duration?: number;
  // 关闭回调函数
  onClose?: () => void;
  // 通知显示位置
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  style?: React.CSSProperties;
}

interface NotificationItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

// 通知容器组件，管理多个通知的显示
const NotificationContainer: FC = () => {
  // 存储当前显示的所有通知
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // 添加新通知
  const addNotification = (notification: Omit<NotificationItem, 'id'>) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);

    // 自动移除通知
    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  };

  // 移除指定 ID 的通知
  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  };

  // 渲染通知列表，每个通知之间有 70px 的间距
  return (
    <div className="notification-container">
      {notifications.map((notification, index) => (
        <Notification
          key={notification.id}
          {...notification}
          style={{ top: `${20 + index * 70}px` }}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

// 单个通知组件
const Notification: FC<NotificationProps> = ({
  message,
  type,
  duration = 3000,
  onClose,
  position = 'top-right',
  style
}) => {
  // 控制通知的显示状态
  const [isVisible, setIsVisible] = useState(true);

  // 设置通知的自动关闭定时器
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    // 清理定时器，避免内存泄漏
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // 渲染通知内容，包括图标、消息和关闭按钮
  return (
    <div
      className={`notification ${type} ${position} ${isVisible ? 'visible' : ''}`}
      style={style}
    >
      <div className="notification-icon">
        {type === 'success' && '✅'}
        {type === 'error' && '❌'}
        {type === 'info' && 'ℹ️'}
        {type === 'warning' && '⚠'}
      </div>
      <div className="notification-message">{message}</div>
      <button className="notification-close" onClick={() => setIsVisible(false)}>
        ×
      </button>
    </div>
  );
};

export default Notification; 