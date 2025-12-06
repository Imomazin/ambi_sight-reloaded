'use client';

import { useState } from 'react';

interface Activity {
  id: string;
  type: 'onboarding' | 'scenario' | 'portfolio' | 'insight' | 'settings';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

interface ActivityFeedProps {
  activities?: Activity[];
  maxItems?: number;
}

const defaultActivities: Activity[] = [
  {
    id: '1',
    type: 'onboarding',
    title: 'Onboarding Completed',
    description: 'Platform tour finished by Sarah Chen',
    timestamp: '2 hours ago',
    user: 'Sarah Chen',
  },
  {
    id: '2',
    type: 'scenario',
    title: 'Scenario Run',
    description: 'MENA Expansion scenario simulation completed',
    timestamp: '3 hours ago',
    user: 'Michael Torres',
  },
  {
    id: '3',
    type: 'portfolio',
    title: 'Portfolio Updated',
    description: 'AI-Native Platform risk assessment refreshed',
    timestamp: '5 hours ago',
    user: 'Emily Park',
  },
  {
    id: '4',
    type: 'insight',
    title: 'New Insight',
    description: 'AI Advisor detected early warning signals',
    timestamp: '6 hours ago',
  },
  {
    id: '5',
    type: 'scenario',
    title: 'Scenario Created',
    description: 'Defensive Consolidation scenario added',
    timestamp: '1 day ago',
    user: 'Sarah Chen',
  },
  {
    id: '6',
    type: 'settings',
    title: 'Settings Changed',
    description: 'Risk thresholds updated for Q1',
    timestamp: '2 days ago',
    user: 'Admin',
  },
];

const typeIcons = {
  onboarding: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  scenario: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  portfolio: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  insight: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

const typeColors = {
  onboarding: 'bg-green-500/20 text-green-400',
  scenario: 'bg-purple-500/20 text-purple-400',
  portfolio: 'bg-teal-500/20 text-teal-400',
  insight: 'bg-amber-500/20 text-amber-400',
  settings: 'bg-gray-500/20 text-gray-400',
};

export default function ActivityFeed({ activities = defaultActivities, maxItems = 5 }: ActivityFeedProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedActivities = showAll ? activities : activities.slice(0, maxItems);

  return (
    <div className="bg-navy-700 rounded-xl border border-navy-600 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        {activities.length > maxItems && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
          >
            {showAll ? 'Show less' : 'View all'}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {displayedActivities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex gap-3 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[activity.type]}`}>
              {typeIcons[activity.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{activity.title}</p>
              <p className="text-xs text-gray-400 truncate">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
