'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppState } from '@/state/useAppState';

// ---------------------------------------------------------------------------
// Phase / nav data
// ---------------------------------------------------------------------------

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
  keyUserOnly?: boolean;
}

interface Phase {
  id: number;
  name: string;
  tagline: string;
  color: string;
  items: NavItem[];
}

const svgIcon = (d: string) => (
  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const commandCenter: NavItem = {
  name: 'Command Center',
  href: '/dashboard',
  icon: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
};

const phases: Phase[] = [
  {
    id: 1,
    name: 'Discover',
    tagline: 'Know Your Landscape',
    color: '#10b981',
    items: [
      { name: 'Market Intelligence', href: '/market-intel', icon: svgIcon('M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z') },
      { name: 'Competitive Intel', href: '/competitive-intel', icon: svgIcon('M15 12a3 3 0 11-6 0 3 3 0 016 0z') },
    ],
  },
  {
    id: 2,
    name: 'Diagnose',
    tagline: 'Assess Your Position',
    color: '#3b82f6',
    items: [
      { name: 'Diagnostic Wizard', href: '/diagnosis', icon: svgIcon('M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z') },
      { name: 'Analytics Hub', href: '/analytics', icon: svgIcon('M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z') },
    ],
  },
  {
    id: 3,
    name: 'Design',
    tagline: 'Craft Your Strategy',
    color: '#8b5cf6',
    items: [
      { name: 'Strategy Workflow', href: '/strategy', icon: svgIcon('M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7') },
      { name: 'Strategy Tools', href: '/tools', icon: svgIcon('M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z') },
      { name: 'Workspace', href: '/workspace', icon: svgIcon('M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z') },
    ],
  },
  {
    id: 4,
    name: 'Decide',
    tagline: 'Choose Your Path',
    color: '#f59e0b',
    items: [
      { name: 'Scenario Planning', href: '/scenarios', icon: svgIcon('M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10') },
      { name: 'Strategic Advisor', href: '/advisor', icon: svgIcon('M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z') },
      { name: 'M&A Analysis', href: '/ma-analysis', icon: svgIcon('M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4') },
    ],
  },
  {
    id: 5,
    name: 'Deliver',
    tagline: 'Execute & Monitor',
    color: '#14b8a6',
    items: [
      { name: 'Portfolio Tracker', href: '/portfolio', icon: svgIcon('M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z') },
    ],
  },
];

const bottomItems: NavItem[] = [
  { name: 'Pricing', href: '/pricing', icon: svgIcon('M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z') },
  {
    name: 'Admin Studio',
    href: '/admin',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    adminOnly: true,
  },
  {
    name: 'Key Users',
    href: '/admin/key-users',
    icon: svgIcon('M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z'),
    keyUserOnly: true,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PHASE_MODULES: Record<number, string[]> = {
  1: ['/market-intel', '/competitive-intel'],
  2: ['/diagnosis', '/analytics'],
  3: ['/strategy', '/tools', '/workspace'],
  4: ['/scenarios', '/advisor', '/ma-analysis'],
  5: ['/portfolio'],
};

function getPhaseForPath(pathname: string): number | null {
  for (const [phase, modules] of Object.entries(PHASE_MODULES)) {
    if (modules.some((m) => pathname.startsWith(m))) return Number(phase);
  }
  return null;
}

function getFirstUnvisitedModule(visited: string[]): { phase: number; href: string } | null {
  for (const phase of phases) {
    const modules = PHASE_MODULES[phase.id] || [];
    const first = modules.find((m) => !visited.includes(m));
    if (first) return { phase: phase.id, href: first };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SidebarNav() {
  const pathname = usePathname();
  const {
    isSidebarCollapsed,
    setSidebarCollapsed,
    currentPersona,
    currentUser,
    visitedModules,
    journeyStarted,
  } = useAppState();

  const activePhase = getPhaseForPath(pathname);
  const recommended = getFirstUnvisitedModule(visitedModules);

  const filterItem = (item: NavItem) => {
    if (item.keyUserOnly) return currentUser?.role === 'KeyUser';
    if (item.adminOnly)
      return (
        currentPersona === 'admin' ||
        currentUser?.role === 'Admin' ||
        currentUser?.role === 'KeyUser'
      );
    return true;
  };

  return (
    <aside
      className={`fixed left-0 top-14 bottom-0 z-40 bg-[var(--sidebar-bg)] backdrop-blur-xl border-r border-[var(--border-color)] transition-all duration-200 ${
        isSidebarCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-5 w-6 h-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors z-50"
        >
          <svg
            className={`w-3 h-3 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Scrollable navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 space-y-1 scrollbar-thin">
          {/* Command Center */}
          <div className="mb-2">
            <Link
              href={commandCenter.href}
              className={`sidebar-link ${pathname === commandCenter.href ? 'active' : ''}`}
              title={isSidebarCollapsed ? commandCenter.name : undefined}
            >
              <span className={`flex-shrink-0 ${pathname === commandCenter.href ? 'text-[var(--accent)]' : ''}`}>
                {commandCenter.icon}
              </span>
              {!isSidebarCollapsed && (
                <span className="truncate font-medium">{commandCenter.name}</span>
              )}
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--border-color)] mx-1 my-1" />

          {/* Journey Phases */}
          {phases.map((phase) => {
            const modules = PHASE_MODULES[phase.id] || [];
            const visitedCount = modules.filter((m) => visitedModules.includes(m)).length;
            const progress = modules.length > 0 ? visitedCount / modules.length : 0;
            const isActivePhase = activePhase === phase.id;
            const phaseComplete = visitedCount === modules.length;

            return (
              <div key={phase.id} className="mb-1">
                {/* Phase header */}
                {!isSidebarCollapsed ? (
                  <div className="flex items-center gap-2 px-2 pt-3 pb-1.5">
                    {/* Phase number circle */}
                    <div className="relative flex-shrink-0">
                      {/* Progress ring */}
                      <svg width="20" height="20" className="transform -rotate-90">
                        <circle cx="10" cy="10" r="8" fill="none" stroke={`${phase.color}20`} strokeWidth="2" />
                        {progress > 0 && (
                          <circle
                            cx="10"
                            cy="10"
                            r="8"
                            fill="none"
                            stroke={phase.color}
                            strokeWidth="2"
                            strokeDasharray={`${progress * 50.27} 50.27`}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                          />
                        )}
                      </svg>
                      {phaseComplete ? (
                        <svg
                          className="absolute inset-0 w-5 h-5 p-[3px]"
                          style={{ color: phase.color }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span
                          className="absolute inset-0 flex items-center justify-center text-[9px] font-bold"
                          style={{ color: phase.color }}
                        >
                          {phase.id}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: isActivePhase ? phase.color : `${phase.color}90` }}
                        >
                          {phase.name}
                        </span>
                        {isActivePhase && (
                          <span
                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                            style={{ backgroundColor: phase.color }}
                          />
                        )}
                      </div>
                      <span className="text-[9px] text-[var(--text-muted)] leading-none block truncate">
                        {phase.tagline}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Collapsed: just a colored dot */
                  <div className="flex justify-center pt-3 pb-1">
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-all ${isActivePhase ? 'scale-125' : 'opacity-60'}`}
                      style={{
                        backgroundColor: phase.color,
                        boxShadow: isActivePhase ? `0 0 8px ${phase.color}60` : 'none',
                      }}
                      title={`Phase ${phase.id}: ${phase.name}`}
                    />
                  </div>
                )}

                {/* Phase nav items */}
                <div
                  className={`space-y-0.5 ${!isSidebarCollapsed ? 'ml-1 pl-3 border-l-2 transition-colors' : ''}`}
                  style={
                    !isSidebarCollapsed
                      ? { borderLeftColor: isActivePhase ? `${phase.color}50` : `${phase.color}15` }
                      : undefined
                  }
                >
                  {phase.items.filter(filterItem).map((item) => {
                    const isActive = pathname === item.href;
                    const isRecommended =
                      !journeyStarted && phase.id === 1 && item.href === '/market-intel'
                        ? true
                        : recommended?.href === item.href && !isActive;

                    return (
                      <div key={item.href} className="relative">
                        <Link
                          href={item.href}
                          className={`sidebar-link ${isActive ? 'active' : ''}`}
                          title={isSidebarCollapsed ? item.name : undefined}
                        >
                          <span
                            className={`flex-shrink-0 ${isActive ? '' : ''}`}
                            style={isActive ? { color: phase.color } : undefined}
                          >
                            {item.icon}
                          </span>
                          {!isSidebarCollapsed && (
                            <span className="truncate text-[13px]">{item.name}</span>
                          )}
                          {/* Visited check (only when expanded) */}
                          {!isSidebarCollapsed && visitedModules.includes(item.href) && !isActive && (
                            <svg
                              className="w-3 h-3 ml-auto flex-shrink-0 opacity-50"
                              style={{ color: phase.color }}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </Link>

                        {/* "START HERE" or "NEXT" badge */}
                        {isRecommended && !isSidebarCollapsed && (
                          <span
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded animate-pulse"
                            style={{
                              color: phase.color,
                              backgroundColor: `${phase.color}18`,
                              border: `1px solid ${phase.color}30`,
                            }}
                          >
                            {!journeyStarted && phase.id === 1 && item.href === '/market-intel'
                              ? 'Start'
                              : 'Next'}
                          </span>
                        )}
                        {isRecommended && isSidebarCollapsed && (
                          <span
                            className="absolute -right-0.5 top-1 w-2 h-2 rounded-full animate-pulse"
                            style={{ backgroundColor: phase.color }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Bottom divider */}
          <div className="border-t border-[var(--border-color)] mx-1 my-2" />

          {/* Settings / Admin items */}
          {bottomItems.filter(filterItem).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                <span className={`flex-shrink-0 ${isActive ? 'text-[var(--accent)]' : ''}`}>{item.icon}</span>
                {!isSidebarCollapsed && <span className="truncate text-[13px]">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-[var(--border-color)]">
          {!isSidebarCollapsed ? (
            <div className="text-[11px] text-[var(--text-muted)]">
              <p className="font-medium">Lumina S</p>
              <p className="opacity-60">v3.0.0</p>
            </div>
          ) : (
            <div className="text-[9px] text-center text-[var(--text-muted)] opacity-60">LS</div>
          )}
        </div>
      </div>
    </aside>
  );
}
