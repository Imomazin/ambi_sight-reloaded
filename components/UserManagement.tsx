'use client';

import { useState, useMemo } from 'react';
import {
  UserProfile,
  UserRole,
  Plan,
  Industry,
  demoUsers,
  roleDisplayNames,
  roleShortNames,
  planColors,
} from '@/lib/users';

// Extended user list for demo purposes
const allUsers: UserProfile[] = [
  ...demoUsers,
  {
    id: 'user-maya',
    name: 'Maya Patel',
    role: 'User',
    company: 'Sunrise Retail',
    industry: 'Retail',
    plan: 'Pro',
    avatar: 'MP',
    email: 'maya.patel@sunriseretail.in',
    lastActive: '2024-01-15T07:30:00Z',
  },
  {
    id: 'user-erik',
    name: 'Erik Johansson',
    role: 'User',
    company: 'Nordic Energy Group',
    industry: 'Energy',
    plan: 'Enterprise',
    avatar: 'EJ',
    email: 'erik.johansson@nordicenergy.se',
    lastActive: '2024-01-14T14:20:00Z',
  },
  {
    id: 'user-fatima',
    name: 'Fatima Al-Hassan',
    role: 'Admin',
    company: 'Gulf Manufacturing',
    industry: 'Manufacturing',
    plan: 'Enterprise',
    avatar: 'FA',
    email: 'fatima.alhassan@gulfmfg.ae',
    lastActive: '2024-01-15T11:45:00Z',
  },
  {
    id: 'user-carlos',
    name: 'Carlos Rivera',
    role: 'User',
    company: 'LatAm Consulting',
    industry: 'Consulting',
    plan: 'Free',
    avatar: 'CR',
    email: 'carlos.rivera@latamconsulting.mx',
    lastActive: '2024-01-13T18:00:00Z',
  },
  {
    id: 'user-jennifer',
    name: 'Jennifer Wong',
    role: 'KeyUser',
    company: 'Pacific Healthcare',
    industry: 'Healthcare',
    plan: 'Enterprise',
    avatar: 'JW',
    email: 'jennifer.wong@pacifichc.sg',
    lastActive: '2024-01-15T04:15:00Z',
  },
  {
    id: 'user-david',
    name: 'David Okonkwo',
    role: 'User',
    company: 'AfriTech Startup',
    industry: 'Technology',
    plan: 'Free',
    avatar: 'DO',
    email: 'david.okonkwo@afritech.ng',
    lastActive: '2024-01-14T12:30:00Z',
  },
];

interface UserEditModalProps {
  user: UserProfile;
  onClose: () => void;
  onSave: (user: UserProfile) => void;
}

function UserEditModal({ user, onClose, onSave }: UserEditModalProps) {
  const [editedUser, setEditedUser] = useState<UserProfile>({ ...user });

  const roles: UserRole[] = ['KeyUser', 'Admin', 'User'];

  const plans: Plan[] = ['Free', 'Pro', 'Enterprise'];

  const industries: Industry[] = [
    'Technology',
    'Financial Services',
    'Healthcare',
    'Retail',
    'Manufacturing',
    'Energy',
    'Logistics',
    'Public Sector',
    'Consulting',
    'Other',
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-navy-800 rounded-2xl border border-navy-600 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-navy-600">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white font-semibold">
              {editedUser.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Edit User</h2>
              <p className="text-sm text-gray-400">{editedUser.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-navy-700 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
              <input
                type="text"
                value={editedUser.name}
                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={editedUser.email}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          {/* Company Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Company</label>
              <input
                type="text"
                value={editedUser.company || ''}
                onChange={(e) => setEditedUser({ ...editedUser, company: e.target.value })}
                className="w-full px-4 py-2.5 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Industry</label>
              <select
                value={editedUser.industry || 'Other'}
                onChange={(e) => setEditedUser({ ...editedUser, industry: e.target.value as Industry })}
                className="w-full px-4 py-2.5 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:border-teal-400"
              >
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Role & Plan */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
              <select
                value={editedUser.role}
                onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value as UserRole })}
                className="w-full px-4 py-2.5 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:border-teal-400"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {roleDisplayNames[role]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Plan</label>
              <select
                value={editedUser.plan}
                onChange={(e) => setEditedUser({ ...editedUser, plan: e.target.value as Plan })}
                className="w-full px-4 py-2.5 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:border-teal-400"
              >
                {plans.map((plan) => (
                  <option key={plan} value={plan}>
                    {plan}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-navy-600">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button
              className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Deactivate User
            </button>
            <button
              onClick={() => onSave(editedUser)}
              className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>(allUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<Plan | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [sortField, setSortField] = useState<'name' | 'lastActive' | 'plan'>('lastActive');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          (user.company && user.company.toLowerCase().includes(query))
      );
    }

    // Plan filter
    if (planFilter !== 'all') {
      result = result.filter((user) => user.plan === planFilter);
    }

    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'lastActive') {
        comparison = new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime();
      } else if (sortField === 'plan') {
        const planOrder: Record<Plan, number> = { Free: 0, Starter: 1, Pro: 2, Enterprise: 3 };
        comparison = planOrder[a.plan] - planOrder[b.plan];
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [users, searchQuery, planFilter, roleFilter, sortField, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    const planCounts: Record<Plan, number> = { Free: 0, Starter: 0, Pro: 0, Enterprise: 0 };
    const roleCounts: Record<UserRole, number> = {
      KeyUser: 0,
      Admin: 0,
      User: 0,
    };

    users.forEach((user) => {
      planCounts[user.plan]++;
      roleCounts[user.role]++;
    });

    const activeToday = users.filter((user) => {
      const lastActive = new Date(user.lastActive);
      const today = new Date();
      return lastActive.toDateString() === today.toDateString();
    }).length;

    return { planCounts, roleCounts, total: users.length, activeToday };
  }, [users]);

  const handleSaveUser = (updatedUser: UserProfile) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setSelectedUser(null);
  };

  const formatLastActive = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-gray-400">Total Users</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.activeToday}</p>
              <p className="text-xs text-gray-400">Active Today</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.planCounts.Enterprise}</p>
              <p className="text-xs text-gray-400">Enterprise</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.planCounts.Pro}</p>
              <p className="text-xs text-gray-400">Pro Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search users by name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value as Plan | 'all')}
            className="px-4 py-2.5 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:border-teal-400"
          >
            <option value="all">All Plans</option>
            <option value="Free">Free</option>
            <option value="Pro">Pro</option>
            <option value="Enterprise">Enterprise</option>
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
            className="px-4 py-2.5 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:border-teal-400"
          >
            <option value="all">All Roles</option>
            <option value="KeyUser">Key User</option>
            <option value="Admin">Administrator</option>
            <option value="User">User</option>
          </select>

          {/* Add User Button */}
          <button className="px-4 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-600">
                <th className="text-left py-4 px-4">
                  <button
                    onClick={() => {
                      if (sortField === 'name') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      else {
                        setSortField('name');
                        setSortOrder('asc');
                      }
                    }}
                    className="flex items-center gap-1 text-xs font-medium text-gray-400 uppercase hover:text-white transition-colors"
                  >
                    User
                    {sortField === 'name' && (
                      <svg className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </button>
                </th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-400 uppercase">Role</th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-400 uppercase">Company</th>
                <th className="text-left py-4 px-4">
                  <button
                    onClick={() => {
                      if (sortField === 'plan') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      else {
                        setSortField('plan');
                        setSortOrder('desc');
                      }
                    }}
                    className="flex items-center gap-1 text-xs font-medium text-gray-400 uppercase hover:text-white transition-colors"
                  >
                    Plan
                    {sortField === 'plan' && (
                      <svg className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </button>
                </th>
                <th className="text-left py-4 px-4">
                  <button
                    onClick={() => {
                      if (sortField === 'lastActive') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      else {
                        setSortField('lastActive');
                        setSortOrder('desc');
                      }
                    }}
                    className="flex items-center gap-1 text-xs font-medium text-gray-400 uppercase hover:text-white transition-colors"
                  >
                    Last Active
                    {sortField === 'lastActive' && (
                      <svg className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </button>
                </th>
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-navy-600/50 hover:bg-navy-700/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-300">{roleShortNames[user.role]}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-white">{user.company}</p>
                      <p className="text-xs text-gray-400">{user.industry}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${planColors[user.plan].bg} ${planColors[user.plan].text} border ${planColors[user.plan].border}`}
                    >
                      {user.plan}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-400">{formatLastActive(user.lastActive)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 hover:bg-navy-600 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <svg className="w-4 h-4 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        className="p-2 hover:bg-navy-600 rounded-lg transition-colors"
                        title="View Activity"
                      >
                        <svg className="w-4 h-4 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </button>
                      <button
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Remove User"
                      >
                        <svg className="w-4 h-4 text-gray-400 hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-navy-600">
          <p className="text-sm text-gray-400">
            Showing <span className="font-medium text-white">{filteredUsers.length}</span> of{' '}
            <span className="font-medium text-white">{users.length}</span> users
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm bg-navy-700 border border-navy-600 rounded-lg text-gray-400 hover:text-white hover:border-navy-500 transition-colors disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1.5 text-sm bg-navy-700 border border-navy-600 rounded-lg text-gray-400 hover:text-white hover:border-navy-500 transition-colors disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Plan Distribution Chart */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Plan Distribution</h3>
          <div className="space-y-4">
            {(['Free', 'Pro', 'Enterprise'] as Plan[]).map((plan) => {
              const count = stats.planCounts[plan];
              const percentage = Math.round((count / stats.total) * 100);
              return (
                <div key={plan}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${planColors[plan].text}`}>{plan}</span>
                    <span className="text-sm text-gray-400">{count} users ({percentage}%)</span>
                  </div>
                  <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        plan === 'Free' ? 'bg-gray-500' : plan === 'Pro' ? 'bg-teal-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Role Distribution</h3>
          <div className="space-y-3">
            {(Object.entries(stats.roleCounts) as [UserRole, number][])
              .filter(([, count]) => count > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([role, count]) => (
                <div key={role} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{roleShortNames[role]}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-navy-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}
