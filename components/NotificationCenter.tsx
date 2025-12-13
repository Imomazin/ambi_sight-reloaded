'use client';

import { useState } from 'react';
import { useAppState, Notification } from '../state/useAppState';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markNotificationRead, clearNotifications } = useAppState();

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✕';
      case 'info': return 'ℹ';
      default: return '•';
    }
  };

  const getTimeAgo = (timestamp: Date | string) => {
    const now = new Date();
    const time = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="notification-center">
      <button
        className="notification-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="notification-backdrop" onClick={() => setIsOpen(false)} />
          <div className="notification-panel">
            <div className="notification-header">
              <h3>Notifications</h3>
              {notifications.length > 0 && (
                <button
                  className="clear-all"
                  onClick={() => clearNotifications()}
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">🔔</span>
                  <p>No notifications yet</p>
                  <span className="empty-subtext">We'll notify you of important updates</span>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`notification-item ${notification.type} ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => markNotificationRead(notification.id)}
                  >
                    <span className={`notification-icon ${notification.type}`}>
                      {getIcon(notification.type)}
                    </span>
                    <div className="notification-content">
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-time">{getTimeAgo(notification.timestamp)}</span>
                    </div>
                    {!notification.read && <span className="unread-dot" />}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .notification-center {
          position: relative;
        }

        .notification-trigger {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .notification-trigger:hover {
          background: var(--bg-tertiary);
          border-color: var(--accent);
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          background: #ef4444;
          color: white;
          font-size: 11px;
          font-weight: 600;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 998;
        }

        .notification-panel {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 360px;
          max-height: 480px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          z-index: 999;
          overflow: hidden;
          animation: slideIn 0.2s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .notification-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-bottom: 1px solid var(--border);
        }

        .notification-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .clear-all {
          background: none;
          border: none;
          font-size: 13px;
          color: var(--accent);
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.15s;
        }

        .clear-all:hover {
          background: var(--accent);
          color: white;
        }

        .notification-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px;
          text-align: center;
        }

        .empty-icon {
          font-size: 40px;
          margin-bottom: 12px;
          opacity: 0.5;
        }

        .empty-state p {
          margin: 0;
          font-weight: 500;
          color: var(--text-primary);
        }

        .empty-subtext {
          font-size: 13px;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          cursor: pointer;
          transition: background 0.15s;
          position: relative;
        }

        .notification-item:hover {
          background: var(--bg-tertiary);
        }

        .notification-item.unread {
          background: var(--bg-tertiary);
        }

        .notification-item + .notification-item {
          border-top: 1px solid var(--border);
        }

        .notification-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .notification-icon.success {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .notification-icon.warning {
          background: rgba(234, 179, 8, 0.2);
          color: #eab308;
        }

        .notification-icon.error {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .notification-icon.info {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-message {
          margin: 0;
          font-size: 14px;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .notification-time {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 4px;
          display: block;
        }

        .unread-dot {
          width: 8px;
          height: 8px;
          background: var(--accent);
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 6px;
        }

        @media (max-width: 480px) {
          .notification-panel {
            position: fixed;
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            max-height: 70vh;
            border-radius: 16px 16px 0 0;
          }
        }
      `}</style>
    </div>
  );
}
