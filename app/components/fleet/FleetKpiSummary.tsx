"use client";

import React from 'react';
import { Radio, ShieldCheck, Flame, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { StatCard } from '../common/StatCard';

interface FleetKpiSummaryProps {
  totalNodesCount: number;
  runningCount: number;
  attackCount: number;
}

export const FleetKpiSummary: React.FC<FleetKpiSummaryProps> = ({
  totalNodesCount,
  runningCount,
  attackCount,
}) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
      <StatCard
        label={t.fleetCapacity}
        value={
          <>
            {totalNodesCount} <span className="text-xs font-normal text-[var(--muted-text)]">{t.units}</span>
          </>
        }
        icon={<Radio className="w-5 h-5" />}
        iconColorClass="text-brand-cyan bg-brand-cyan/10 border-brand-cyan/30"
      />

      <StatCard
        label={t.liveGenerators}
        value={
          <span className="flex items-center gap-2 text-brand-emerald">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                runningCount > 0 ? 'bg-brand-emerald animate-ping' : 'bg-zinc-600'
              }`}
            />
            {runningCount} / {totalNodesCount}
          </span>
        }
        icon={<ShieldCheck className="w-5 h-5" />}
        iconColorClass="text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30"
      />

      <StatCard
        label={t.activeInjections}
        value={<span className="text-brand-rose">{attackCount}</span>}
        icon={<Flame className="w-5 h-5" />}
        iconColorClass="text-brand-rose bg-brand-rose/10 border-brand-rose/30"
      />

      <StatCard
        label={t.heartbeatWatchdog}
        value={<span className="text-sm">Limit: 10.0s</span>}
        extra={<div className="text-[10px] text-[var(--muted-text)]">Auto INC_HEARTBEAT_LOST</div>}
        icon={<Clock className="w-5 h-5" />}
        iconColorClass="text-brand-amber bg-brand-amber/10 border-brand-amber/30"
      />
    </div>
  );
};
