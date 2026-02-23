'use client';

import { useAppState } from '@/state/useAppState';
import Navbar from './Navbar';
import SidebarNav from './SidebarNav';
import HelpModal from './HelpModal';
import Breadcrumbs from './Breadcrumbs';
import MobileNav from './MobileNav';
import DynamicBackground from './DynamicBackground';

interface AppShellProps {
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
}

export default function AppShell({ children, showBreadcrumbs = true }: AppShellProps) {
  const { isSidebarCollapsed } = useAppState();

  return (
    <DynamicBackground>
      <Navbar />
      <SidebarNav />
      <main
        className={`pt-14 pb-20 md:pb-6 transition-all duration-200 ${
          isSidebarCollapsed ? 'md:pl-16' : 'md:pl-56'
        }`}
      >
        <div className="p-4 md:p-5">
          {showBreadcrumbs && <Breadcrumbs className="mb-4" />}
          {children}
        </div>
      </main>
      <MobileNav />
      <HelpModal />
    </DynamicBackground>
  );
}
