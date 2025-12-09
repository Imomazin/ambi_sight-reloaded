'use client';

import React, { useState, useEffect } from 'react';

interface TimelineEvent {
  id: string;
  type: 'insight' | 'alert' | 'milestone' | 'update' | 'ai';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
  link?: string;
}

export default function ActivityTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Initialize with sample events
    const sampleEvents: TimelineEvent[] = [
      {
        id: '1',
        type: 'ai',
        title: 'AI Insight Generated',
        description: 'New correlation detected between supply chain delays and Q4 projections',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
      },
      {
        id: '2',
        type: 'milestone',
        title: 'Milestone Reached',
        description: 'Digital transformation initiative hit 80% completion',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        user: 'System',
      },
      {
        id: '3',
        type: 'alert',
        title: 'Risk Threshold Exceeded',
        description: 'Supply chain risk score increased to 65 (threshold: 60)',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
      },
      {
        id: '4',
        type: 'update',
        title: 'Scenario Updated',
        description: 'Market expansion scenario parameters adjusted by Strategy Team',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        user: 'Sarah Chen',
      },
      {
        id: '5',
        type: 'insight',
        title: 'Performance Report',
        description: 'Q3 portfolio performance exceeded targets by 12%',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        id: '6',
        type: 'ai',
        title: 'Predictive Alert',
        description: 'AI model predicts 15% revenue opportunity in emerging markets',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
    ];
    setEvents(sampleEvents);

    // Simulate new events
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newEventTypes = [
          { type: 'ai' as const, title: 'AI Insight', description: 'New pattern detected in market data' },
          { type: 'update' as const, title: 'Data Refresh', description: 'KPIs updated with latest figures' },
          { type: 'insight' as const, title: 'Trend Analysis', description: 'Positive trend in portfolio health metrics' },
        ];
        const randomEvent = newEventTypes[Math.floor(Math.random() * newEventTypes.length)];
        const newEvent: TimelineEvent = {
          id: Date.now().toString(),
          ...randomEvent,
          timestamp: new Date(),
        };
        setEvents(prev => [newEvent, ...prev].slice(0, 10));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'ai': return { icon: '🤖', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/20' };
      case 'alert': return { icon: '⚠️', color: 'from-red-500 to-orange-500', bg: 'bg-red-500/20' };
      case 'milestone': return { icon: '🎯', color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/20' };
      case 'update': return { icon: '🔄', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/20' };
      case 'insight': return { icon: '💡', color: 'from-amber-500 to-yellow-500', bg: 'bg-amber-500/20' };
      default: return { icon: '📌', color: 'from-gray-500 to-gray-400', bg: 'bg-gray-500/20' };
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const filteredEvents = filter === 'all'
    ? events
    : events.filter(e => e.type === filter);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'ai', label: 'AI' },
    { id: 'alert', label: 'Alerts' },
    { id: 'milestone', label: 'Milestones' },
    { id: 'update', label: 'Updates' },
  ];

  return (
    <div className="bg-navy-800/60 backdrop-blur-sm border border-navy-600/50 rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Activity Timeline</h3>
            <p className="text-xs text-gray-400">Recent events and updates</p>
          </div>
        </div>
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 p-1 bg-navy-700/50 rounded-lg">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              filter === f.id
                ? 'bg-teal-500/20 text-teal-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
        {filteredEvents.map((event, index) => {
          const { icon, color, bg } = getEventIcon(event.type);
          return (
            <div
              key={event.id}
              className="group relative flex gap-4 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Timeline line */}
              {index < filteredEvents.length - 1 && (
                <div className="absolute left-5 top-12 w-0.5 h-full -translate-x-1/2 bg-gradient-to-b from-navy-600 to-transparent" />
              )}

              {/* Icon */}
              <div className={`relative flex-shrink-0 w-10 h-10 rounded-xl ${bg} flex items-center justify-center text-lg z-10`}>
                {icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-teal-400 transition-colors">
                      {event.title}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                      {event.description}
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-500 whitespace-nowrap">
                    {formatTime(event.timestamp)}
                  </div>
                </div>
                {event.user && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-[10px] text-white font-medium">
                      {event.user.charAt(0)}
                    </div>
                    <span className="text-xs text-gray-500">{event.user}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* View all link */}
      <button className="w-full mt-4 pt-4 border-t border-navy-600/50 text-sm text-teal-400 hover:text-teal-300 transition-colors flex items-center justify-center gap-2">
        View Full History
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </div>
  );
}
