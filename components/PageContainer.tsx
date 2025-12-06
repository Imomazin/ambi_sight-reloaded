'use client';

import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function PageContainer({ children, title, subtitle, actions }: PageContainerProps) {
  return (
    <div className="animate-fade-in">
      {(title || actions) && (
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {title && (
              <div>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
              </div>
            )}
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
