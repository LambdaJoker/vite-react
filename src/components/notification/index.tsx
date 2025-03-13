/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: notification
 * @Date: 2025-03-08 13:11:09
 * @LastEditTime: 2025-03-13 16:19:42
 */
/** @jsx React.createElement */
/** @jsxFrag React.Fragment */
import React, { useState, useEffect, FC } from 'react';
import './index.css';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  style?: React.CSSProperties;
}

interface NotificationItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const NotificationContainer: FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = (notification: Omit<NotificationItem, 'id'>) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);

    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  };

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

const Notification: FC<NotificationProps> = ({
  message,
  type,
  duration = 3000,
  onClose,
  position = 'top-right',
  style
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

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