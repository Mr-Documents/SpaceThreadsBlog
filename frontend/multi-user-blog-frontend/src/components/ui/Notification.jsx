import React, { useState, useEffect } from 'react';

const Notification = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose && onClose(), 300); // Allow fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-800/90',
          border: 'border-green-500/50',
          text: 'text-green-100',
          icon: '✅'
        };
      case 'error':
        return {
          bg: 'bg-red-800/90',
          border: 'border-red-500/50',
          text: 'text-red-100',
          icon: '❌'
        };
      case 'warning':
        return {
          bg: 'bg-amber-800/90',
          border: 'border-amber-500/50',
          text: 'text-amber-100',
          icon: '⚠️'
        };
      default:
        return {
          bg: 'bg-blue-800/90',
          border: 'border-blue-500/50',
          text: 'text-blue-100',
          icon: 'ℹ️'
        };
    }
  };

  const styles = getTypeStyles();

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg border backdrop-blur-sm shadow-lg transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
    } ${styles.bg} ${styles.border}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0">{styles.icon}</span>
        <div className="flex-1">
          <p className={`text-sm ${styles.text}`}>
            {message}
          </p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose && onClose(), 300);
          }}
          className={`flex-shrink-0 ${styles.text} hover:opacity-70 transition-opacity`}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Notification Manager Hook
export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const NotificationContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );

  return {
    addNotification,
    removeNotification,
    NotificationContainer
  };
};

export default Notification;
