'use client';

import Link from 'next/link';

interface Module {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  gradientClass: string;
}

const modules: Module[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Strategic overview and key metrics at a glance',
    href: '/dashboard',
    gradientClass: 'icon-container-blue',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'workspace',
    title: 'Workspace',
    description: 'Access strategy documents and planning tools',
    href: '/workspace',
    gradientClass: 'icon-container-cyan',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'scenarios',
    title: 'Scenarios',
    description: 'Model strategic alternatives and what-if analysis',
    href: '/scenarios',
    gradientClass: 'icon-container-purple',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    description: 'Track strategic initiatives and investments',
    href: '/portfolio',
    gradientClass: 'icon-container-orange',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    id: 'advisor',
    title: 'Advisor',
    description: 'AI-powered strategic insights and recommendations',
    href: '/advisor',
    gradientClass: 'icon-container-green',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
];

export default function ModuleEntryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {modules.map((module) => (
        <Link
          key={module.id}
          href={module.href}
          className="module-card group flex flex-col items-center text-center"
        >
          <div className={`mb-4 p-4 rounded-2xl ${module.gradientClass} shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all`}>
            {module.icon}
          </div>
          <h3 className="font-semibold text-[var(--text-primary)] mb-1">
            {module.title}
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            {module.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
