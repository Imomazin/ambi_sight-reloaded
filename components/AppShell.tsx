'use client';

import { useAppState } from '@/state/useAppState';
import Navbar from './Navbar';
import SidebarNav from './SidebarNav';
import HelpModal from './HelpModal';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { isSidebarCollapsed } = useAppState();

  return (
    <div className="min-h-screen bg-gradient-navy">
      <Navbar />
      <SidebarNav />
      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarCollapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        <div className="p-6">{children}</div>
      </main>
      <HelpModal />
    </div>
  );
}
