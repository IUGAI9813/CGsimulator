"use client";

import React, { useState } from 'react';
import {
  X,
  Play,
  Pause,
  Square,
  AlertTriangle,
  Radio,
  Shield,
  Layers,
  Activity,
  MapPin,
  Cpu,
} from 'lucide-react';
import { Vehicle, LifecycleStatus, AttackInjections } from '../../types/simulator';
import { useLanguage } from '../../context/LanguageContext';
import { VehicleMetricsRow } from './VehicleMetricsRow';
import { AttackInjectionControls } from './AttackInjectionControls';
import { SensorsTable } from './SensorsTable';

interface VehicleInspectorDrawerProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onSetLifecycleStatus: (id: string, status: LifecycleStatus) => void;
  onToggleInjection: (vehicleId: string, key: keyof AttackInjections) => void;
  onResetInjections: (vehicleId: string) => void;
  onTriggerTimeout: (vehicleId: string) => void;
}

export const VehicleInspectorDrawer: React.FC<VehicleInspectorDrawerProps> = ({
  vehicle,
  onClose,
  onSetLifecycleStatus,
  onToggleInjection,
  onResetInjections,
  onTriggerTimeout,
}) => {
  const { t } = useLanguage();
  const [showSensors, setShowSensors] = useState(false);

  if (!vehicle) return null;

  const isRunning = vehicle.lifecycleStatus === 'RUNNING';
  const isPaused = vehicle.lifecycleStatus === 'PAUSED';
  const isStopped = vehicle.lifecycleStatus === 'STOPPED' || vehicle.lifecycleStatus === 'OFFLINE';

  const activeInjectionsCount = Object.values(vehicle.injections).filter(Boolean).length;

  return (
    <>
      {/* Semi-transparent Backdrop Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-out Cyber Drawer from Right */}
      <aside
        className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-[var(--panel-bg)] border-l border-[var(--panel-border)] z-50 shadow-2xl flex flex-col font-mono animate-in slide-in-from-right duration-250 overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[var(--panel-border)] bg-[var(--panel-header-bg)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded bg-brand-cyan/15 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan flex-shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-[var(--foreground)] truncate tracking-tight">
                  {vehicle.id}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                  {vehicle.type}
                </span>
                {activeInjectionsCount > 0 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-brand-rose border border-rose-500/40 animate-pulse">
                    🔥 {activeInjectionsCount} ATTACKS ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--muted-text)] truncate mt-0.5">
                {vehicle.model || vehicle.name} &bull; VIN: <code className="text-[var(--foreground)]">{vehicle.vin}</code>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded bg-[var(--input-bg)] border border-[var(--panel-border)] hover:border-brand-rose text-[var(--muted-text)] hover:text-brand-rose transition-all cursor-pointer flex-shrink-0"
            title="Close Inspector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Section 1: Lifecycle State & Heartbeat Watchdog Controls */}
          <div className="p-4 rounded bg-[var(--input-bg)] border border-[var(--panel-border)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--muted-text)] uppercase flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-brand-cyan" />
                Lifecycle Controller
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  isRunning
                    ? 'bg-emerald-500/20 text-brand-emerald border border-emerald-500/40'
                    : isPaused
                    ? 'bg-amber-500/20 text-brand-amber border border-amber-500/40'
                    : 'bg-zinc-800 text-[var(--muted-text)] border border-zinc-700'
                }`}
              >
                {vehicle.lifecycleStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => onSetLifecycleStatus(vehicle.id, 'RUNNING')}
                disabled={isRunning}
                className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>START</span>
              </button>

              <button
                onClick={() => onSetLifecycleStatus(vehicle.id, 'PAUSED')}
                disabled={!isRunning}
                className="px-3 py-2 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>PAUSE</span>
              </button>

              <button
                onClick={() => onSetLifecycleStatus(vehicle.id, 'STOPPED')}
                disabled={isStopped}
                className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-700"
              >
                <Square className="w-3.5 h-3.5" />
                <span>STOP</span>
              </button>

              <button
                onClick={() => onTriggerTimeout(vehicle.id)}
                className="px-3 py-2 rounded bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-700/50 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="Simulate sudden signal loss (15s)"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-brand-rose" />
                <span>TIMEOUT</span>
              </button>
            </div>
          </div>

          {/* Section 2: Real-time Live Metrics */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[var(--muted-text)] uppercase flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-brand-emerald" />
              Live Telemetry Gauges
            </span>
            <VehicleMetricsRow vehicle={vehicle} />
          </div>

          {/* Section 3: Cyber-Attack & Failure Injection Controls */}
          <div className="space-y-2">
            <AttackInjectionControls
              vehicle={vehicle}
              onToggleInjection={onToggleInjection}
              onResetInjections={onResetInjections}
            />
          </div>

          {/* Section 4: Onboard Sensors Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--muted-text)] uppercase flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-brand-cyan" />
                Hardware Sensors Array ({vehicle.sensors?.length || 0})
              </span>
              <button
                onClick={() => setShowSensors(!showSensors)}
                className="text-[11px] text-brand-cyan hover:underline cursor-pointer flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{showSensors ? t.hideSensors : t.viewSensors}</span>
              </button>
            </div>

            {showSensors && (
              <div className="animate-in fade-in duration-200">
                <SensorsTable sensors={vehicle.sensors || []} />
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-[var(--panel-border)] bg-[var(--panel-header-bg)] flex items-center justify-between text-xs text-[var(--muted-text)]">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Zone: <strong className="text-[var(--foreground)]">{vehicle.assignedZone || 'Gangnam District'}</strong></span>
          </div>
          <span>Firmware: <strong className="text-[var(--foreground)]">{vehicle.firmwareVersion || 'v2.4.1'}</strong></span>
        </div>
      </aside>
    </>
  );
};
