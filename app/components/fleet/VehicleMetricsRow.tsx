import React from 'react';
import { Vehicle } from '../../types/simulator';
import { useLanguage } from '../../context/LanguageContext';

interface VehicleMetricsRowProps {
  vehicle: Vehicle;
}

export const VehicleMetricsRow: React.FC<VehicleMetricsRowProps> = ({ vehicle }) => {
  const { t } = useLanguage();
  const lastTelem = vehicle.lastTelemetry;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 font-mono">
      {/* 1. Speed */}
      <div className="p-2.5 rounded bg-[var(--input-bg)] border border-[var(--panel-border)]">
        <span className="text-[10px] text-[var(--muted-text)] font-bold uppercase block">{t.speed}</span>
        <div className="text-base font-bold text-[var(--foreground)] mt-0.5 tabular-nums flex items-baseline gap-1">
          {lastTelem ? lastTelem.speedKmh : 0}
          <span className="text-[10px] font-normal text-[var(--muted-text)]">km/h</span>
        </div>
      </div>

      {/* 2. Battery SOC */}
      <div className="p-2.5 rounded bg-[var(--input-bg)] border border-[var(--panel-border)]">
        <span className="text-[10px] text-[var(--muted-text)] font-bold uppercase block">{t.batterySoc}</span>
        <div className="text-base font-bold text-brand-cyan mt-0.5 tabular-nums flex items-baseline gap-1">
          {lastTelem ? lastTelem.batteryPercent : 90}
          <span className="text-[10px] font-normal text-[var(--muted-text)]">%</span>
        </div>
      </div>

      {/* 3. LiDAR FPS */}
      <div
        className={`p-2.5 rounded border transition-all ${
          vehicle.injections.lidarFailure
            ? 'bg-rose-500/10 border-brand-rose/40 text-brand-rose'
            : 'bg-[var(--input-bg)] border-[var(--panel-border)]'
        }`}
      >
        <span className="text-[10px] text-[var(--muted-text)] font-bold uppercase flex items-center justify-between">
          <span>{t.lidarScan}</span>
          {vehicle.injections.lidarFailure && <span className="text-[9px] text-brand-rose font-bold">ANOMALY</span>}
        </span>
        <div className="text-base font-bold text-[var(--foreground)] mt-0.5 tabular-nums flex items-baseline gap-1">
          <span className={vehicle.injections.lidarFailure ? 'text-brand-rose' : 'text-brand-emerald'}>
            {lastTelem ? lastTelem.lidarFps : 30}
          </span>
          <span className="text-[10px] font-normal text-[var(--muted-text)]">FPS</span>
        </div>
      </div>

      {/* 4. Camera FPS */}
      <div
        className={`p-2.5 rounded border transition-all ${
          vehicle.injections.cameraOffline
            ? 'bg-rose-500/10 border-brand-rose/40 text-brand-rose'
            : 'bg-[var(--input-bg)] border-[var(--panel-border)]'
        }`}
      >
        <span className="text-[10px] text-[var(--muted-text)] font-bold uppercase flex items-center justify-between">
          <span>{t.cameraArray}</span>
          {vehicle.injections.cameraOffline && <span className="text-[9px] text-brand-rose font-bold">OFFLINE</span>}
        </span>
        <div className="text-base font-bold text-[var(--foreground)] mt-0.5 tabular-nums flex items-baseline gap-1">
          <span className={vehicle.injections.cameraOffline ? 'text-brand-rose' : 'text-brand-emerald'}>
            {lastTelem ? lastTelem.cameraFps : 60}
          </span>
          <span className="text-[10px] font-normal text-[var(--muted-text)]">FPS</span>
        </div>
      </div>

      {/* 5. V2X Latency */}
      <div
        className={`p-2.5 rounded border transition-all ${
          vehicle.injections.v2xLatencySpike
            ? 'bg-rose-500/10 border-brand-rose/40 text-brand-rose'
            : 'bg-[var(--input-bg)] border-[var(--panel-border)]'
        }`}
      >
        <span className="text-[10px] text-[var(--muted-text)] font-bold uppercase flex items-center justify-between">
          <span>{t.v2xLatency}</span>
          {vehicle.injections.v2xLatencySpike && <span className="text-[9px] text-brand-rose font-bold">SPIKE</span>}
        </span>
        <div className="text-base font-bold text-[var(--foreground)] mt-0.5 tabular-nums flex items-baseline gap-1">
          <span className={vehicle.injections.v2xLatencySpike ? 'text-brand-rose' : 'text-brand-cyan'}>
            {lastTelem ? lastTelem.v2xLatencyMs : 14}
          </span>
          <span className="text-[10px] font-normal text-[var(--muted-text)]">ms</span>
        </div>
      </div>

      {/* 6. Heartbeat Status */}
      <div
        className={`p-2.5 rounded border transition-all ${
          vehicle.secondsSinceLastHeartbeat >= 10
            ? 'bg-rose-500/10 border-brand-rose/50 text-brand-rose'
            : vehicle.secondsSinceLastHeartbeat >= 5
            ? 'bg-amber-500/10 border-brand-amber/40 text-brand-amber'
            : 'bg-[var(--input-bg)] border-[var(--panel-border)]'
        }`}
      >
        <span className="text-[10px] text-[var(--muted-text)] font-bold uppercase block">{t.lastPing}</span>
        <div className="text-base font-bold mt-0.5 tabular-nums flex items-baseline gap-1">
          <span
            className={
              vehicle.secondsSinceLastHeartbeat >= 10
                ? 'text-brand-rose'
                : vehicle.secondsSinceLastHeartbeat >= 5
                ? 'text-brand-amber'
                : 'text-brand-emerald'
            }
          >
            {vehicle.secondsSinceLastHeartbeat}s
          </span>
          <span className="text-[10px] font-normal text-[var(--muted-text)]">{t.ago}</span>
        </div>
      </div>
    </div>
  );
};
