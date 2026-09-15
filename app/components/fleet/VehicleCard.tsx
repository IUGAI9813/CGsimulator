import React, { useState } from 'react';
import { Play, Pause, Square, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Vehicle, LifecycleStatus, AttackInjections } from '../../types/simulator';
import { formatHelper } from '../../helpers/formatHelper';
import { VehicleMetricsRow } from './VehicleMetricsRow';
import { AttackInjectionControls } from './AttackInjectionControls';
import { SensorsTable } from './SensorsTable';
import { useLanguage } from '../../context/LanguageContext';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSetLifecycleStatus: (id: string, status: LifecycleStatus) => void;
  onToggleInjection: (vehicleId: string, key: keyof AttackInjections) => void;
  onResetInjections: (vehicleId: string) => void;
  onTriggerTimeout: (vehicleId: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onSetLifecycleStatus,
  onToggleInjection,
  onResetInjections,
  onTriggerTimeout,
}) => {
  const { t } = useLanguage();
  const [isSensorsExpanded, setIsSensorsExpanded] = useState(false);
  const hasActiveInjection = Object.values(vehicle.injections).some(Boolean);

  return (
    <div
      className={`cyber-panel rounded border transition-all ${
        vehicle.lifecycleStatus === 'OFFLINE'
          ? 'border-brand-rose/60 shadow-lg shadow-rose-950/20'
          : hasActiveInjection
          ? 'border-brand-amber/50'
          : 'border-[var(--panel-border)]'
      }`}
    >
      {/* Header */}
      <div className="cyber-panel-header flex-wrap gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[var(--foreground)] font-mono">
              {vehicle.model || vehicle.name}
            </span>
            <span className="text-xs font-mono font-bold text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/30">
              {vehicle.vehicleId || vehicle.id}
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--input-bg)] text-[var(--muted-text)] border border-[var(--panel-border)] uppercase">
            {vehicle.vehicleType || vehicle.type}
          </span>
          {vehicle.assignedZone && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
              {vehicle.assignedZone}
            </span>
          )}
          <span className="hidden sm:inline text-[10px] font-mono text-[var(--muted-text)]">
            {t.vin}: {vehicle.vin}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span
            className={`text-[10px] font-mono font-bold px-2 py-1 rounded border uppercase flex items-center gap-1.5 ${formatHelper.getLifecycleBadgeClass(
              vehicle.lifecycleStatus
            )}`}
          >
            {vehicle.lifecycleStatus === 'RUNNING' && (
              <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-ping" />
            )}
            {vehicle.lifecycleStatus}
          </span>

          {/* Action Buttons */}
          <div className="flex items-center bg-[var(--input-bg)] p-0.5 rounded border border-[var(--panel-border)]">
            <button
              onClick={() => onSetLifecycleStatus(vehicle.id, 'RUNNING')}
              disabled={vehicle.lifecycleStatus === 'RUNNING'}
              title="Start Telemetry"
              className={`p-1.5 rounded transition-all cursor-pointer ${
                vehicle.lifecycleStatus === 'RUNNING'
                  ? 'text-brand-emerald bg-emerald-500/15 opacity-50 cursor-not-allowed'
                  : 'text-[var(--muted-text)] hover:text-brand-emerald hover:bg-emerald-500/10'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>

            <button
              onClick={() => onSetLifecycleStatus(vehicle.id, 'PAUSED')}
              disabled={vehicle.lifecycleStatus === 'PAUSED'}
              title="Pause Telemetry"
              className={`p-1.5 rounded transition-all cursor-pointer ${
                vehicle.lifecycleStatus === 'PAUSED'
                  ? 'text-brand-amber bg-amber-500/15 opacity-50 cursor-not-allowed'
                  : 'text-[var(--muted-text)] hover:text-brand-amber hover:bg-amber-500/10'
              }`}
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
            </button>

            <button
              onClick={() => onSetLifecycleStatus(vehicle.id, 'STOPPED')}
              disabled={vehicle.lifecycleStatus === 'STOPPED'}
              title="Stop Telemetry"
              className={`p-1.5 rounded transition-all cursor-pointer ${
                vehicle.lifecycleStatus === 'STOPPED'
                  ? 'text-zinc-400 bg-zinc-500/15 opacity-50 cursor-not-allowed'
                  : 'text-[var(--muted-text)] hover:text-brand-rose hover:bg-rose-500/10'
              }`}
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>

          {/* Timeout Button */}
          <button
            onClick={() => onTriggerTimeout(vehicle.id)}
            title="Simulate 15s Heartbeat drop"
            className="px-2 py-1 rounded text-[10px] font-mono font-bold bg-amber-500/10 hover:bg-amber-500/20 text-brand-amber border border-amber-500/30 transition-all cursor-pointer flex items-center gap-1"
          >
            <Clock className="w-3 h-3" />
            <span>{t.forceTimeout}</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Metrics Row */}
        <VehicleMetricsRow vehicle={vehicle} />

        {/* Attack Injection Controls */}
        <AttackInjectionControls
          vehicle={vehicle}
          onToggleInjection={onToggleInjection}
          onResetInjections={onResetInjections}
        />

        {/* Sensor Toggle */}
        <div className="pt-1">
          <button
            onClick={() => setIsSensorsExpanded(!isSensorsExpanded)}
            className="text-xs font-mono text-[var(--muted-text)] hover:text-[var(--foreground)] flex items-center gap-1 cursor-pointer transition-colors"
          >
            {isSensorsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>
              {isSensorsExpanded
                ? t.hideSensors
                : `${t.viewSensors} (${vehicle.sensors.length})`}
            </span>
          </button>

          {isSensorsExpanded && <SensorsTable sensors={vehicle.sensors} />}
        </div>
      </div>
    </div>
  );
};
