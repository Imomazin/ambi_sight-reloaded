'use client';

import { useAppState } from '@/state/useAppState';
import TopNav from './TopNav';
import NavSidebar from './NavSidebar';
import HelpModal from './HelpModal';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { isSidebarCollapsed } = useAppState();

  return (
    <div className="min-h-screen bg-gradient-navy">
      <TopNav />
      <NavSidebar />
      <main
        className={`
          pt-20 pb-8 transition-all duration-300
          px-4 md:px-6
          md:pl-24 lg:pl-72
          ${isSidebarCollapsed ? 'md:pl-24' : 'md:pl-72'}
        `}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <HelpModal />
    </div>
  );
}
