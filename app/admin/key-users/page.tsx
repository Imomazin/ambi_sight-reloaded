'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { useAppState } from '@/state/useAppState';
import {
  demoUsers,
  planColors,
  roleDisplayNames,
  levelDisplayNames,
  type UserProfile,
  type UserLevel,
} from '@/lib/users';

// Simulated user activity data
interface UserActivity {
  userId: string;
  action: string;
  timestamp: string;
  details: string;
}

interface UserInsight {
  user: UserProfile;
  totalLogins: number;
  lastLogin: string;
  toolsUsed: string[];
  consultancyRequested: boolean;
  revenueGenerated: number;
  engagementScore: number;
  recommendedAction: string;
}

// Generate mock user insights
const generateUserInsights = (): UserInsight[] => {
  return demoUsers.filter(u => u.role === 'User').map(user => ({
    user,
    totalLogins: Math.floor(Math.random() * 50) + 5,
    lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    toolsUsed: ['SWOT Analysis', "Porter's Five Forces", 'PESTEL', 'Scenario Planning'].slice(0, Math.floor(Math.random() * 4) + 1),
    consultancyRequested: user.consultancyRequested || Math.random() > 0.7,
    revenueGenerated: user.plan === 'Free' ? 0 : user.plan === 'Starter' ? 29 : user.plan === 'Pro' ? 79 : 199,
    engagementScore: Math.floor(Math.random() * 40) + 60,
    recommendedAction: user.plan === 'Free'
      ? 'Offer upgrade to Starter with personalized demo'
      : user.consultancyRequested
        ? 'Schedule consultancy call within 24 hours'
        : 'Send feature highlight email',
  }));
};

// Mock recent activities
const mockActivities: UserActivity[] = [
  { userId: 'user-free-demo', action: 'Signed Up', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), details: 'Via Google OAuth' },
  { userId: 'user-pro-demo', action: 'Requested Consultancy', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), details: 'Topic: Digital Transformation Strategy' },
  { userId: 'user-starter-demo', action: 'Upgraded Plan', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), details: 'Free -> Starter' },
  { userId: 'user-enterprise-demo', action: 'Completed Analysis', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), details: 'SWOT Analysis for Q1 Strategy' },
  { userId: 'user-free-demo', action: 'Used Advisor', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), details: '3 queries about market expansion' },
];

export default function KeyUserDashboard() {
  const router = useRouter();
  const { currentUser } = useAppState();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'activity' | 'consultancy'>('overview');
  const [userInsights, setUserInsights] = useState<UserInsight[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserInsight | null>(null);

  // Check if user is KeyUser
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'KeyUser') {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  useEffect(() => {
    setUserInsights(generateUserInsights());
  }, []);

  if (!currentUser || currentUser.role !== 'KeyUser') {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Access Denied</h2>
          <p className="text-[var(--text-muted)] mb-4">This section is only accessible to Key Users.</p>
          <Link href="/dashboard" className="text-teal-500 hover:text-teal-400">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const stats = {
    totalUsers: userInsights.length,
    freeUsers: userInsights.filter(u => u.user.plan === 'Free').length,
    paidUsers: userInsights.filter(u => u.user.plan !== 'Free').length,
    consultancyRequests: userInsights.filter(u => u.consultancyRequested).length,
    totalRevenue: userInsights.reduce((sum, u) => sum + u.revenueGenerated, 0),
    avgEngagement: Math.round(userInsights.reduce((sum, u) => sum + u.engagementScore, 0) / userInsights.length),
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getLevelBadgeColor = (level: UserLevel) => {
    const colors = {
      1: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      2: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      3: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      4: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return colors[level];
  };

  return (
    <AppShell>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Key User Dashboard</h1>
                <p className="text-sm text-[var(--text-muted)]">Customer intelligence and management</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-sm font-medium">
              Key User Access
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-[var(--bg-card)] rounded-xl p-1 border border-[var(--border-color)] w-fit">
        {(['overview', 'users', 'activity', 'consultancy'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              activeTab === tab
                ? 'bg-amber-500 text-white'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'teal' },
              { label: 'Free Users', value: stats.freeUsers, icon: '🆓', color: 'gray' },
              { label: 'Paid Users', value: stats.paidUsers, icon: '💎', color: 'purple' },
              { label: 'Consultancy Requests', value: stats.consultancyRequests, icon: '📞', color: 'amber' },
              { label: 'Monthly Revenue', value: `$${stats.totalRevenue}`, icon: '💰', color: 'green' },
              { label: 'Avg Engagement', value: `${stats.avgEngagement}%`, icon: '📊', color: 'blue' },
            ].map((stat) => (
              <div key={stat.label} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{stat.icon}</span>
                  <span className="text-xs text-[var(--text-muted)]">{stat.label}</span>
                </div>
                <div className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* User Level Distribution */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">User Level Distribution</h3>
              <div className="space-y-3">
                {([1, 2, 3, 4] as UserLevel[]).map((level) => {
                  const count = userInsights.filter(u => u.user.level === level).length;
                  const percentage = (count / userInsights.length) * 100 || 0;
                  return (
                    <div key={level} className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs rounded border ${getLevelBadgeColor(level)}`}>
                        Level {level}
                      </span>
                      <div className="flex-1 h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${level === 1 ? 'bg-gray-400' : level === 2 ? 'bg-blue-400' : level === 3 ? 'bg-teal-400' : 'bg-purple-400'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-[var(--text-muted)] w-12">{count} users</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Priority Actions</h3>
              <div className="space-y-3">
                {userInsights.filter(u => u.consultancyRequested).slice(0, 3).map((insight) => (
                  <div key={insight.user.id} className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 font-semibold text-sm">
                      {insight.user.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{insight.user.name}</p>
                      <p className="text-xs text-amber-400">Consultancy Requested</p>
                    </div>
                    <button className="px-3 py-1.5 bg-amber-500 text-white text-xs rounded-lg hover:bg-amber-400">
                      Contact
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="text-left py-4 px-4 text-xs font-medium text-[var(--text-muted)] uppercase">User</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-[var(--text-muted)] uppercase">Level</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-[var(--text-muted)] uppercase">Plan</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-[var(--text-muted)] uppercase">Auth</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-[var(--text-muted)] uppercase">Engagement</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-[var(--text-muted)] uppercase">Consultancy</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-[var(--text-muted)] uppercase">Last Active</th>
                  <th className="text-left py-4 px-4 text-xs font-medium text-[var(--text-muted)] uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {userInsights.map((insight) => (
                  <tr key={insight.user.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-card-hover)]">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                          {insight.user.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">{insight.user.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">{insight.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs rounded border ${getLevelBadgeColor(insight.user.level)}`}>
                        Level {insight.user.level}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs rounded border ${planColors[insight.user.plan].bg} ${planColors[insight.user.plan].text} ${planColors[insight.user.plan].border}`}>
                        {insight.user.plan}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs text-[var(--text-muted)] capitalize">{insight.user.authProvider || 'email'}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${insight.engagementScore >= 80 ? 'bg-green-400' : insight.engagementScore >= 60 ? 'bg-teal-400' : 'bg-amber-400'}`}
                            style={{ width: `${insight.engagementScore}%` }}
                          />
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">{insight.engagementScore}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {insight.consultancyRequested ? (
                        <span className="px-2 py-1 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">Requested</span>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)]">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs text-[var(--text-muted)]">{formatTimeAgo(insight.lastLogin)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setSelectedUser(insight)}
                        className="px-3 py-1.5 bg-teal-500/20 text-teal-400 text-xs rounded-lg hover:bg-teal-500/30"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {mockActivities.map((activity, idx) => {
              const user = demoUsers.find(u => u.id === activity.userId);
              return (
                <div key={idx} className="flex items-start gap-4 p-4 bg-[var(--bg-secondary)] rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.avatar || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-[var(--text-primary)]">{user?.name || 'Unknown User'}</span>
                      <span className="px-2 py-0.5 text-xs bg-teal-500/20 text-teal-400 rounded">{activity.action}</span>
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">{activity.details}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Consultancy Tab */}
      {activeTab === 'consultancy' && (
        <div className="space-y-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Consultancy Requests</h3>
            <div className="space-y-4">
              {userInsights.filter(u => u.consultancyRequested).map((insight) => (
                <div key={insight.user.id} className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                      {insight.user.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{insight.user.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{insight.user.email}</p>
                      <p className="text-xs text-[var(--text-muted)]">{insight.user.company} - {insight.user.industry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs rounded border ${planColors[insight.user.plan].bg} ${planColors[insight.user.plan].text} ${planColors[insight.user.plan].border}`}>
                      {insight.user.plan}
                    </span>
                    <button className="px-4 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-400">
                      Schedule Call
                    </button>
                    <button className="px-4 py-2 bg-teal-500/20 text-teal-400 text-sm rounded-lg hover:bg-teal-500/30">
                      Send Email
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Recommended Actions for Users</h3>
            <div className="space-y-3">
              {userInsights.map((insight) => (
                <div key={insight.user.id} className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400 font-semibold text-sm">
                      {insight.user.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{insight.user.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{insight.recommendedAction}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-teal-500 text-white text-xs rounded-lg hover:bg-teal-400">
                    Take Action
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[var(--border-color)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {selectedUser.user.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">{selectedUser.user.name}</h3>
                    <p className="text-sm text-[var(--text-muted)]">{selectedUser.user.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg">
                  <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                  <p className="text-xs text-[var(--text-muted)]">Level</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{levelDisplayNames[selectedUser.user.level]}</p>
                </div>
                <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                  <p className="text-xs text-[var(--text-muted)]">Plan</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{selectedUser.user.plan}</p>
                </div>
                <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                  <p className="text-xs text-[var(--text-muted)]">Company</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{selectedUser.user.company || '-'}</p>
                </div>
                <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                  <p className="text-xs text-[var(--text-muted)]">Industry</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{selectedUser.user.industry || '-'}</p>
                </div>
                <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                  <p className="text-xs text-[var(--text-muted)]">Total Logins</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{selectedUser.totalLogins}</p>
                </div>
                <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                  <p className="text-xs text-[var(--text-muted)]">Engagement</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{selectedUser.engagementScore}%</p>
                </div>
              </div>

              <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                <p className="text-xs text-[var(--text-muted)] mb-2">Tools Used</p>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.toolsUsed.map((tool) => (
                    <span key={tool} className="px-2 py-1 text-xs bg-teal-500/20 text-teal-400 rounded">{tool}</span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-xs text-amber-400 mb-1">Recommended Action</p>
                <p className="text-sm text-[var(--text-primary)]">{selectedUser.recommendedAction}</p>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-400">
                  Send Email
                </button>
                <button className="flex-1 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-400">
                  Schedule Call
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
