'use client';

interface DynamicBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function DynamicBackground({ children, className = '' }: DynamicBackgroundProps) {
  return (
    <div className={`relative min-h-screen ${className}`}>
      <div className="fixed inset-0 z-0 bg-[var(--bg-primary)]" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
