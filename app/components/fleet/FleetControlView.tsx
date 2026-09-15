"use client";

import React, { useState } from 'react';
import { Radio, ShieldCheck, Flame, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Vehicle, LifecycleStatus, AttackInjections } from '../../types/simulator';
import { INITIAL_VEHICLES } from '../../utils/presets';
import { StatCard } from '../common/StatCard';
import { VehicleCard } from './VehicleCard';

interface FleetControlViewProps {
  vehicles?: Vehicle[];
  onSetLifecycleStatus?: (id: string, status: LifecycleStatus) => void;
  onToggleInjection?: (vehicleId: string, key: keyof AttackInjections) => void;
  onResetInjections?: (vehicleId: string) => void;
  onTriggerTimeout?: (vehicleId: string) => void;
}

export const FleetControlView: React.FC<FleetControlViewProps> = ({
  vehicles = INITIAL_VEHICLES,
  onSetLifecycleStatus = () => {},
  onToggleInjection = () => {},
  onResetInjections = () => {},
  onTriggerTimeout = () => {},
}) => {
  const { t } = useLanguage();

  const runningCount = vehicles.filter((v) => v.lifecycleStatus === 'RUNNING').length;
  const activeInjectionsCount = vehicles.reduce((acc, v) => {
    const i = v.injections;
    return (
      acc +
      (i.lidarFailure || i.v2xLatencySpike || i.gpsSpoofing || i.cameraOffline || i.canBusInjection
        ? 1
        : 0)
    );
  }, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={t.fleetCapacity}
          value={
            <>
              {vehicles.length} <span className="text-xs font-normal text-[var(--muted-text)]">{t.units}</span>
            </>
          }
          icon={<Radio className="w-5 h-5" />}
          iconColorClass="text-brand-cyan bg-brand-cyan/10 border-brand-cyan/30"
        />

        <StatCard
          label={t.liveGenerators}
          value={
            <span className="flex items-center gap-2 text-brand-emerald">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-emerald animate-ping" />
              {runningCount}
            </span>
          }
          icon={<ShieldCheck className="w-5 h-5" />}
          iconColorClass="text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30"
        />

        <StatCard
          label={t.activeInjections}
          value={<span className="text-brand-rose">{activeInjectionsCount}</span>}
          icon={<Flame className="w-5 h-5" />}
          iconColorClass="text-brand-rose bg-brand-rose/10 border-brand-rose/30"
        />

        <StatCard
          label={t.heartbeatWatchdog}
          value={<span className="text-sm">Limit: 10.0s</span>}
          extra={<div className="text-[10px] font-mono text-[var(--muted-text)]">Auto INC_HEARTBEAT_LOST</div>}
          icon={<Clock className="w-5 h-5" />}
          iconColorClass="text-brand-amber bg-brand-amber/10 border-brand-amber/30"
        />
      </div>

      {/* Fleet Cards Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-[var(--foreground)] tracking-tight">
            {t.fleetMatrixTitle}
          </h2>
          <p className="text-xs text-[var(--muted-text)] font-mono">
            {t.fleetMatrixDesc}
          </p>
        </div>

        {vehicles.length === 0 ? (
          <div className="cyber-panel p-12 text-center rounded space-y-3 font-mono">
            <Radio className="w-8 h-8 text-[var(--muted-text)] mx-auto opacity-50" />
            <p className="text-sm text-[var(--muted-text)]">{t.noVehiclesTitle}</p>
            <p className="text-xs text-[var(--muted-text)]">{t.noVehiclesDesc}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onSetLifecycleStatus={onSetLifecycleStatus}
                onToggleInjection={onToggleInjection}
                onResetInjections={onResetInjections}
                onTriggerTimeout={onTriggerTimeout}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
