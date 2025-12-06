'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 rounded-full border-2 border-navy-600"></div>
        <div className="absolute inset-0 rounded-full border-2 border-teal-400 border-t-transparent animate-spin"></div>
      </div>
      {text && <span className="text-sm text-gray-400">{text}</span>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-navy">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <div className="absolute inset-0 rounded-full border-3 border-navy-600"></div>
          <div className="absolute inset-0 rounded-full border-3 border-teal-400 border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-2 border-purple-400 border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
        <p className="text-gray-400">Loading Ambi-Sight...</p>
      </div>
    </div>
  );
}
