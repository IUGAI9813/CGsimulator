import React, { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  extra?: ReactNode;
  iconColorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  extra,
  iconColorClass = 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/30',
}) => {
  return (
    <div className="cyber-panel p-4 rounded flex items-center justify-between">
      <div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted-text)] block">
          {label}
        </span>
        <div className="text-2xl font-bold font-mono text-[var(--foreground)] mt-1 tabular-nums">
          {value}
        </div>
        {extra && <div className="mt-1">{extra}</div>}
      </div>
      <div className={`p-2.5 rounded border ${iconColorClass}`}>
        {icon}
      </div>
    </div>
  );
};
