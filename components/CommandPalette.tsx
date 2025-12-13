'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '../state/useAppState';

interface Command {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'navigation' | 'tools' | 'actions' | 'settings';
  action: () => void;
  keywords?: string[];
}

export default function CommandPalette() {
  const router = useRouter();
  const {
    isCommandPaletteOpen: commandPaletteOpen,
    setCommandPaletteOpen,
    setTheme,
    theme
  } = useAppState();

  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    // Navigation
    { id: 'nav-home', name: 'Go to Dashboard', description: 'Return to main dashboard', icon: '🏠', category: 'navigation', action: () => router.push('/'), keywords: ['home', 'main'] },
    { id: 'nav-advisor', name: 'Go to Strategy Advisor', description: 'Open intelligent business advisor', icon: '💡', category: 'navigation', action: () => router.push('/advisor'), keywords: ['advisor', 'chat', 'assistant', 'strategy'] },
    { id: 'nav-tools', name: 'Go to Tools', description: 'Access analysis tools', icon: '🔧', category: 'navigation', action: () => router.push('/tools'), keywords: ['swot', 'porter', 'pestel'] },
    { id: 'nav-diagnosis', name: 'Go to Diagnosis', description: 'Run business diagnostic', icon: '🩺', category: 'navigation', action: () => router.push('/diagnosis'), keywords: ['wizard', 'assess'] },
    { id: 'nav-workspace', name: 'Go to Workspace', description: 'Open your workspace', icon: '📊', category: 'navigation', action: () => router.push('/workspace'), keywords: ['work', 'analyze'] },
    { id: 'nav-analytics', name: 'Go to Analytics', description: 'View analytics dashboard', icon: '📈', category: 'navigation', action: () => router.push('/analytics'), keywords: ['data', 'charts'] },
    { id: 'nav-scenarios', name: 'Go to Scenarios', description: 'Explore what-if scenarios', icon: '🎯', category: 'navigation', action: () => router.push('/scenarios'), keywords: ['planning', 'forecast'] },
    { id: 'nav-pricing', name: 'View Pricing', description: 'See subscription plans', icon: '💰', category: 'navigation', action: () => router.push('/pricing'), keywords: ['plans', 'upgrade'] },

    // Tools
    { id: 'tool-swot', name: 'SWOT Analysis', description: 'Analyze strengths, weaknesses, opportunities, threats', icon: '📋', category: 'tools', action: () => { router.push('/tools'); }, keywords: ['strategic', 'framework'] },
    { id: 'tool-porter', name: "Porter's Five Forces", description: 'Competitive analysis framework', icon: '⚔️', category: 'tools', action: () => { router.push('/tools'); }, keywords: ['competition', 'industry'] },
    { id: 'tool-pestel', name: 'PESTEL Analysis', description: 'Macro-environmental analysis', icon: '🌍', category: 'tools', action: () => { router.push('/tools'); }, keywords: ['political', 'economic'] },

    // Actions
    { id: 'action-upload', name: 'Upload Data', description: 'Upload a new dataset for analysis', icon: '📤', category: 'actions', action: () => { router.push('/workspace'); }, keywords: ['import', 'file'] },
    { id: 'action-export', name: 'Export Report', description: 'Export current analysis as PDF', icon: '📥', category: 'actions', action: () => { window.print(); }, keywords: ['download', 'pdf'] },
    { id: 'action-new-analysis', name: 'New Analysis', description: 'Start a fresh analysis', icon: '✨', category: 'actions', action: () => router.push('/diagnosis'), keywords: ['create', 'start'] },

    // Settings
    { id: 'settings-theme-toggle', name: 'Toggle Dark/Light Mode', description: 'Switch between dark and light themes', icon: theme === 'dark' ? '☀️' : '🌙', category: 'settings', action: () => setTheme(theme === 'dark' ? 'light' : 'dark'), keywords: ['appearance', 'color'] },
    { id: 'settings-dark', name: 'Dark Mode', description: 'Enable dark theme', icon: '🌙', category: 'settings', action: () => setTheme('dark'), keywords: ['night', 'theme'] },
    { id: 'settings-light', name: 'Light Mode', description: 'Enable light theme', icon: '☀️', category: 'settings', action: () => setTheme('light'), keywords: ['day', 'theme'] },
    { id: 'settings-profile', name: 'Edit Profile', description: 'Update your profile settings', icon: '👤', category: 'settings', action: () => router.push('/admin'), keywords: ['account', 'user'] },
  ];

  const filteredCommands = commands.filter(cmd => {
    const searchLower = search.toLowerCase();
    return (
      cmd.name.toLowerCase().includes(searchLower) ||
      cmd.description.toLowerCase().includes(searchLower) ||
      cmd.keywords?.some(k => k.includes(searchLower))
    );
  });

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  const categoryLabels: Record<string, string> = {
    navigation: 'Navigation',
    tools: 'Tools',
    actions: 'Actions',
    settings: 'Settings'
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setCommandPaletteOpen(!commandPaletteOpen);
    }

    if (!commandPaletteOpen) return;

    if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
      setSearch('');
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    }

    if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
      setCommandPaletteOpen(false);
      setSearch('');
    }
  }, [commandPaletteOpen, filteredCommands, selectedIndex, setCommandPaletteOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (commandPaletteOpen && inputRef.current) {
      inputRef.current.focus();
    }
    setSelectedIndex(0);
  }, [commandPaletteOpen, search]);

  if (!commandPaletteOpen) return null;

  return (
    <div
      className="command-palette-overlay"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="command-palette"
        onClick={e => e.stopPropagation()}
      >
        <div className="command-search">
          <span className="search-icon">⌘K</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <kbd className="escape-hint">ESC</kbd>
        </div>

        <div className="command-list">
          {Object.entries(groupedCommands).map(([category, cmds]) => (
            <div key={category} className="command-group">
              <div className="command-group-label">{categoryLabels[category]}</div>
              {cmds.map((cmd, idx) => {
                const globalIndex = filteredCommands.indexOf(cmd);
                return (
                  <div
                    key={cmd.id}
                    className={`command-item ${globalIndex === selectedIndex ? 'selected' : ''}`}
                    onClick={() => {
                      cmd.action();
                      setCommandPaletteOpen(false);
                      setSearch('');
                    }}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                  >
                    <span className="command-icon">{cmd.icon}</span>
                    <div className="command-text">
                      <span className="command-name">{cmd.name}</span>
                      <span className="command-description">{cmd.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {filteredCommands.length === 0 && (
            <div className="no-results">
              No commands found for "{search}"
            </div>
          )}
        </div>

        <div className="command-footer">
          <span><kbd>↑↓</kbd> Navigate</span>
          <span><kbd>↵</kbd> Select</span>
          <span><kbd>ESC</kbd> Close</span>
        </div>
      </div>

      <style jsx>{`
        .command-palette-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 15vh;
          z-index: 9999;
          animation: fadeIn 0.15s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .command-palette {
          width: 100%;
          max-width: 600px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          animation: slideDown 0.2s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .command-search {
          display: flex;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid var(--border);
          gap: 12px;
        }

        .search-icon {
          font-size: 12px;
          padding: 4px 8px;
          background: var(--accent);
          color: white;
          border-radius: 4px;
          font-weight: 600;
        }

        .command-search input {
          flex: 1;
          background: transparent;
          border: none;
          font-size: 16px;
          color: var(--text-primary);
          outline: none;
        }

        .command-search input::placeholder {
          color: var(--text-secondary);
        }

        .escape-hint {
          font-size: 11px;
          padding: 4px 8px;
          background: var(--bg-tertiary);
          border-radius: 4px;
          color: var(--text-secondary);
        }

        .command-list {
          max-height: 400px;
          overflow-y: auto;
          padding: 8px;
        }

        .command-group {
          margin-bottom: 8px;
        }

        .command-group-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--text-secondary);
          padding: 8px 12px;
          letter-spacing: 0.5px;
        }

        .command-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .command-item:hover,
        .command-item.selected {
          background: var(--accent);
        }

        .command-item.selected .command-name,
        .command-item.selected .command-description {
          color: white;
        }

        .command-icon {
          font-size: 18px;
          width: 28px;
          text-align: center;
        }

        .command-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .command-name {
          font-weight: 500;
          color: var(--text-primary);
        }

        .command-description {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .no-results {
          text-align: center;
          padding: 24px;
          color: var(--text-secondary);
        }

        .command-footer {
          display: flex;
          gap: 16px;
          padding: 12px 16px;
          border-top: 1px solid var(--border);
          background: var(--bg-tertiary);
          font-size: 12px;
          color: var(--text-secondary);
        }

        .command-footer kbd {
          background: var(--bg-secondary);
          padding: 2px 6px;
          border-radius: 4px;
          margin-right: 4px;
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}
