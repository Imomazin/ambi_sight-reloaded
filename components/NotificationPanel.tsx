'use client';

import React, { useState, useEffect } from 'react';
import { RealTimeAlert } from '../hooks/useRealTimeData';

interface NotificationPanelProps {
  alerts: RealTimeAlert[];
  unreadCount: number;
  onAcknowledge: (id: string) => void;
  onAcknowledgeAll: () => void;
  onClear: (id: string) => void;
  onClearAll: () => void;
}

const alertTypeStyles = {
  critical: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: '🚨',
    iconBg: 'bg-red-500/20',
    text: 'text-red-400',
    pulse: 'animate-pulse',
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: '⚠️',
    iconBg: 'bg-amber-500/20',
    text: 'text-amber-400',
    pulse: '',
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: 'ℹ️',
    iconBg: 'bg-blue-500/20',
    text: 'text-blue-400',
    pulse: '',
  },
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: '✅',
    iconBg: 'bg-green-500/20',
    text: 'text-green-400',
    pulse: '',
  },
};

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function NotificationBell({
  unreadCount,
  onClick,
}: {
  unreadCount: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-lg bg-navy-700/50 border border-navy-600 hover:bg-navy-600 transition-colors"
    >
      <svg
        className="w-5 h-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}

export function NotificationPanel({
  alerts,
  unreadCount,
  onAcknowledge,
  onAcknowledgeAll,
  onClear,
  onClearAll,
}: NotificationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | RealTimeAlert['type']>('all');

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !alert.acknowledged;
    return alert.type === filter;
  });

  return (
    <div className="relative">
      <NotificationBell unreadCount={unreadCount} onClick={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-12 w-96 max-h-[70vh] bg-navy-800 border border-navy-600 rounded-xl shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-navy-600 bg-navy-700/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={onAcknowledgeAll}
                      className="text-xs text-teal-400 hover:text-teal-300"
                    >
                      Mark all read
                    </button>
                  )}
                  {alerts.length > 0 && (
                    <button
                      onClick={onClearAll}
                      className="text-xs text-gray-400 hover:text-gray-300"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-1">
                {(['all', 'unread', 'critical', 'warning', 'info'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      filter === f
                        ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-navy-600'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Alert List */}
            <div className="overflow-y-auto max-h-[50vh]">
              {filteredAlerts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-3 opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <p>No notifications</p>
                </div>
              ) : (
                filteredAlerts.map(alert => {
                  const style = alertTypeStyles[alert.type];
                  return (
                    <div
                      key={alert.id}
                      className={`p-4 border-b border-navy-600/50 ${style.bg} ${
                        !alert.acknowledged ? 'bg-opacity-100' : 'bg-opacity-50 opacity-60'
                      } hover:bg-navy-700/50 transition-colors`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg ${style.iconBg} flex items-center justify-center ${style.pulse}`}>
                          <span className="text-sm">{style.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-sm font-medium ${style.text}`}>
                              {alert.title}
                            </h4>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {formatTimeAgo(alert.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {alert.message}
                          </p>
                          {alert.currentValue !== undefined && (
                            <div className="mt-2 flex items-center gap-2 text-xs">
                              <span className="text-gray-500">Current:</span>
                              <span className={style.text}>{alert.currentValue}</span>
                              {alert.threshold !== undefined && (
                                <>
                                  <span className="text-gray-600">|</span>
                                  <span className="text-gray-500">Threshold:</span>
                                  <span className="text-gray-400">{alert.threshold}</span>
                                </>
                              )}
                            </div>
                          )}
                          <div className="mt-2 flex items-center gap-2">
                            {!alert.acknowledged && (
                              <button
                                onClick={() => onAcknowledge(alert.id)}
                                className="text-xs text-teal-400 hover:text-teal-300"
                              >
                                Mark read
                              </button>
                            )}
                            <button
                              onClick={() => onClear(alert.id)}
                              className="text-xs text-gray-500 hover:text-gray-400"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Toast notification for immediate feedback
export function NotificationToast({
  alert,
  onDismiss,
}: {
  alert: RealTimeAlert;
  onDismiss: () => void;
}) {
  const style = alertTypeStyles[alert.type];

  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`fixed bottom-4 right-4 w-80 ${style.bg} border ${style.border} rounded-xl p-4 shadow-2xl z-50 animate-slide-up`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg ${style.iconBg} flex items-center justify-center ${style.pulse}`}>
          <span className="text-sm">{style.icon}</span>
        </div>
        <div className="flex-1">
          <h4 className={`text-sm font-medium ${style.text}`}>{alert.title}</h4>
          <p className="text-xs text-gray-400 mt-1">{alert.message}</p>
        </div>
        <button onClick={onDismiss} className="text-gray-500 hover:text-white">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default NotificationPanel;
