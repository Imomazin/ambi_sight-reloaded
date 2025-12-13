'use client';

import { useAppState } from '../state/useAppState';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export default function ThemeToggle({ size = 'medium', showLabel = false }: ThemeToggleProps) {
  const { theme, setTheme } = useAppState();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const sizes = {
    small: { width: 44, height: 24, icon: 14 },
    medium: { width: 56, height: 30, icon: 16 },
    large: { width: 68, height: 36, icon: 20 },
  };

  const s = sizes[size];

  return (
    <div className="theme-toggle-wrapper">
      {showLabel && (
        <span className="theme-label">
          {theme === 'dark' ? 'Dark' : 'Light'} Mode
        </span>
      )}

      <button
        className={`theme-toggle ${theme}`}
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        style={{
          width: s.width,
          height: s.height,
          borderRadius: s.height / 2
        }}
      >
        <span
          className="toggle-track"
          style={{ borderRadius: s.height / 2 }}
        />
        <span
          className="toggle-thumb"
          style={{
            width: s.height - 6,
            height: s.height - 6,
            borderRadius: (s.height - 6) / 2,
            transform: theme === 'dark'
              ? `translateX(${s.width - s.height + 2}px)`
              : 'translateX(2px)'
          }}
        >
          <span className="icon sun" style={{ fontSize: s.icon }}>☀️</span>
          <span className="icon moon" style={{ fontSize: s.icon }}>🌙</span>
        </span>
      </button>

      <style jsx>{`
        .theme-toggle-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .theme-label {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .theme-toggle {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          overflow: hidden;
        }

        .toggle-track {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          transition: all 0.3s ease;
        }

        .theme-toggle.dark .toggle-track {
          background: linear-gradient(135deg, #1e1b4b, #312e81);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .theme-toggle.light .toggle-track {
          background: linear-gradient(135deg, #fef3c7, #fcd34d);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .toggle-thumb {
          position: absolute;
          top: 3px;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .icon {
          position: absolute;
          transition: all 0.3s ease;
        }

        .theme-toggle.dark .sun {
          opacity: 0;
          transform: rotate(-90deg) scale(0);
        }

        .theme-toggle.dark .moon {
          opacity: 1;
          transform: rotate(0) scale(1);
        }

        .theme-toggle.light .sun {
          opacity: 1;
          transform: rotate(0) scale(1);
        }

        .theme-toggle.light .moon {
          opacity: 0;
          transform: rotate(90deg) scale(0);
        }

        /* Hover effect */
        .theme-toggle:hover .toggle-thumb {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        /* Focus ring for accessibility */
        .theme-toggle:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }

        /* Animation on toggle */
        .theme-toggle:active .toggle-thumb {
          transform: ${theme === 'dark'
            ? 'translateX(2px) scale(0.95)'
            : `translateX(${s.width - s.height + 2}px) scale(0.95)`};
        }
      `}</style>
    </div>
  );
}
