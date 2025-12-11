'use client';

import { useState } from 'react';
import { useAppState } from '@/state/useAppState';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastActive?: string;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  sentAt: string;
  status: 'pending' | 'expired';
}

export default function CollaborationPanel() {
  const { currentUser, featureFlags } = useAppState();
  const [activeTab, setActiveTab] = useState<'team' | 'activity' | 'settings'>('team');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');

  // Demo team data
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: currentUser?.name || 'You',
      email: currentUser?.email || 'you@example.com',
      role: 'owner',
      status: 'online'
    },
    {
      id: '2',
      name: 'Alex Chen',
      email: 'alex@company.com',
      role: 'admin',
      status: 'online'
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      role: 'member',
      status: 'away',
      lastActive: '15 min ago'
    },
    {
      id: '4',
      name: 'Mike Wilson',
      email: 'mike@company.com',
      role: 'viewer',
      status: 'offline',
      lastActive: '2 hours ago'
    }
  ];

  const pendingInvitations: Invitation[] = [
    {
      id: 'inv-1',
      email: 'new.member@company.com',
      role: 'member',
      sentAt: '2 days ago',
      status: 'pending'
    }
  ];

  const recentActivity = [
    { user: 'Alex Chen', action: 'completed SWOT analysis', time: '10 min ago', icon: '📊' },
    { user: 'Sarah Johnson', action: 'added a comment', time: '1 hour ago', icon: '💬' },
    { user: 'You', action: 'uploaded financial data', time: '2 hours ago', icon: '📤' },
    { user: 'Mike Wilson', action: 'viewed insights report', time: '4 hours ago', icon: '👁️' }
  ];

  const handleSendInvite = () => {
    if (!inviteEmail) return;
    // In production, send actual invitation
    console.log('Inviting:', inviteEmail, 'as', inviteRole);
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteRole('member');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return '#FBBF24';
      case 'admin': return '#A855F7';
      case 'member': return '#14B8A6';
      case 'viewer': return '#64748B';
      default: return '#64748B';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#22C55E';
      case 'away': return '#F59E0B';
      case 'offline': return '#64748B';
      default: return '#64748B';
    }
  };

  if (!featureFlags.enableCollaboration) {
    return (
      <div className="collaboration-disabled">
        <span className="icon">🔒</span>
        <h3>Team Collaboration</h3>
        <p>Upgrade to Pro or Enterprise to enable team collaboration features.</p>
        <a href="/pricing" className="upgrade-btn">View Plans</a>
        <style jsx>{`
          .collaboration-disabled {
            text-align: center;
            padding: 48px 24px;
          }
          .icon { font-size: 48px; }
          h3 { margin: 16px 0 8px; color: var(--text-primary); }
          p { color: var(--text-muted); margin-bottom: 20px; }
          .upgrade-btn {
            display: inline-block;
            padding: 10px 20px;
            background: var(--accent);
            color: white;
            border-radius: 8px;
            text-decoration: none;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="collaboration-panel">
      <div className="panel-header">
        <h2>Team Workspace</h2>
        <button className="invite-btn" onClick={() => setShowInviteModal(true)}>
          + Invite
        </button>
      </div>

      <div className="tabs">
        {(['team', 'activity', 'settings'] as const).map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'team' && (
        <div className="team-section">
          <div className="members-list">
            {teamMembers.map(member => (
              <div key={member.id} className="member-card">
                <div className="member-avatar">
                  <span className="avatar-text">{member.name.charAt(0)}</span>
                  <span
                    className="status-dot"
                    style={{ backgroundColor: getStatusColor(member.status) }}
                  />
                </div>
                <div className="member-info">
                  <span className="member-name">{member.name}</span>
                  <span className="member-email">{member.email}</span>
                </div>
                <span
                  className="member-role"
                  style={{ color: getRoleColor(member.role) }}
                >
                  {member.role}
                </span>
              </div>
            ))}
          </div>

          {pendingInvitations.length > 0 && (
            <div className="pending-section">
              <h4>Pending Invitations</h4>
              {pendingInvitations.map(inv => (
                <div key={inv.id} className="invitation-card">
                  <span className="inv-email">{inv.email}</span>
                  <span className="inv-role">{inv.role}</span>
                  <span className="inv-time">{inv.sentAt}</span>
                  <button className="resend-btn">Resend</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="activity-section">
          {recentActivity.map((activity, index) => (
            <div key={index} className="activity-item">
              <span className="activity-icon">{activity.icon}</span>
              <div className="activity-content">
                <span className="activity-text">
                  <strong>{activity.user}</strong> {activity.action}
                </span>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="settings-section">
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Team Notifications</span>
              <span className="setting-desc">Get notified when team members make changes</span>
            </div>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="slider" />
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Auto-share Insights</span>
              <span className="setting-desc">Automatically share new insights with team</span>
            </div>
            <label className="toggle">
              <input type="checkbox" />
              <span className="slider" />
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Comment Permissions</span>
              <span className="setting-desc">Allow team members to add comments</span>
            </div>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="slider" />
            </label>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Invite Team Member</h3>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                <option value="viewer">Viewer - Can view only</option>
                <option value="member">Member - Can edit analyses</option>
                <option value="admin">Admin - Full access</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowInviteModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSendInvite}>
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .collaboration-panel {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid var(--border);
        }

        .panel-header h2 {
          margin: 0;
          font-size: 18px;
          color: var(--text-primary);
        }

        .invite-btn {
          padding: 8px 16px;
          background: var(--accent);
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: white;
          cursor: pointer;
        }

        .tabs {
          display: flex;
          border-bottom: 1px solid var(--border);
        }

        .tab {
          flex: 1;
          padding: 12px;
          background: none;
          border: none;
          font-size: 13px;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab:hover {
          color: var(--text-primary);
        }

        .tab.active {
          color: var(--accent);
          border-bottom: 2px solid var(--accent);
        }

        .team-section, .activity-section, .settings-section {
          padding: 16px;
        }

        .members-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .member-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--bg-tertiary);
          border-radius: 8px;
        }

        .member-avatar {
          position: relative;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--accent), #A855F7);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-text {
          color: white;
          font-weight: 600;
          font-size: 16px;
        }

        .status-dot {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid var(--bg-tertiary);
        }

        .member-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .member-name {
          font-weight: 500;
          color: var(--text-primary);
        }

        .member-email {
          font-size: 12px;
          color: var(--text-muted);
        }

        .member-role {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .pending-section {
          margin-top: 20px;
        }

        .pending-section h4 {
          margin: 0 0 12px 0;
          font-size: 13px;
          color: var(--text-muted);
        }

        .invitation-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--bg-tertiary);
          border-radius: 8px;
          font-size: 13px;
        }

        .inv-email { flex: 1; color: var(--text-primary); }
        .inv-role { color: var(--text-muted); }
        .inv-time { color: var(--text-muted); font-size: 11px; }
        .resend-btn {
          background: none;
          border: none;
          color: var(--accent);
          cursor: pointer;
        }

        .activity-item {
          display: flex;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-icon {
          font-size: 20px;
        }

        .activity-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .activity-text {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .activity-text strong {
          color: var(--text-primary);
        }

        .activity-time {
          font-size: 11px;
          color: var(--text-muted);
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid var(--border);
        }

        .setting-item:last-child {
          border-bottom: none;
        }

        .setting-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .setting-label {
          font-weight: 500;
          color: var(--text-primary);
        }

        .setting-desc {
          font-size: 12px;
          color: var(--text-muted);
        }

        .toggle {
          position: relative;
          width: 48px;
          height: 26px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--bg-tertiary);
          border-radius: 26px;
          transition: 0.3s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background: white;
          border-radius: 50%;
          transition: 0.3s;
        }

        input:checked + .slider {
          background: var(--accent);
        }

        input:checked + .slider:before {
          transform: translateX(22px);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          width: 90%;
          max-width: 400px;
        }

        .modal h3 {
          margin: 0 0 20px 0;
          color: var(--text-primary);
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          color: var(--text-primary);
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .btn-secondary {
          flex: 1;
          padding: 10px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-primary);
          cursor: pointer;
        }

        .btn-primary {
          flex: 1;
          padding: 10px;
          background: var(--accent);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
