'use client';

import { type Plan, planColors } from '@/lib/users';

interface LockedFeatureProps {
  requiredPlan: Plan;
  currentPlan: Plan;
  children: React.ReactNode;
  featureName?: string;
  className?: string;
}

export default function LockedFeature({
  requiredPlan,
  currentPlan,
  children,
  featureName,
  className = '',
}: LockedFeatureProps) {
  const planHierarchy: Plan[] = ['Free', 'Starter', 'Pro', 'Enterprise'];
  const hasAccess = planHierarchy.indexOf(currentPlan) >= planHierarchy.indexOf(requiredPlan);
  const colors = planColors[requiredPlan];

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Locked overlay */}
      <div className="absolute inset-0 bg-navy-800/80 backdrop-blur-sm rounded-xl z-10 flex flex-col items-center justify-center">
        <div className="text-center p-4">
          {/* Lock icon */}
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-navy-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          {/* Feature name */}
          {featureName && (
            <h4 className="text-white font-medium mb-1">{featureName}</h4>
          )}

          {/* Plan badge */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} ${colors.border} border`}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            {requiredPlan} Plan
          </span>

          {/* Upgrade CTA */}
          <p className="text-xs text-gray-400 mt-2 max-w-[180px]">
            Upgrade to {requiredPlan} to unlock this feature
          </p>
        </div>
      </div>

      {/* Dimmed content */}
      <div className="opacity-30 pointer-events-none">
        {children}
      </div>
    </div>
  );
}

// Compact version for inline use
interface PlanBadgeProps {
  plan: Plan;
  size?: 'sm' | 'md';
}

export function PlanBadge({ plan, size = 'sm' }: PlanBadgeProps) {
  const colors = planColors[plan];
  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses} ${colors.bg} ${colors.text} ${colors.border} border`}>
      {plan}
    </span>
  );
}

// Pro tag for features
interface ProTagProps {
  requiredPlan?: Plan;
}

export function ProTag({ requiredPlan = 'Pro' }: ProTagProps) {
  const colors = planColors[requiredPlan];

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${colors.bg} ${colors.text}`}>
      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      {requiredPlan}
    </span>
  );
}
