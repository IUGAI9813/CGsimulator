import React from 'react';
import { Zap, RotateCcw, Eye, Radio, Compass, Camera, Cpu } from 'lucide-react';
import { Vehicle, AttackInjections } from '../../types/simulator';
import { useLanguage } from '../../context/LanguageContext';

interface AttackInjectionControlsProps {
  vehicle: Vehicle;
  onToggleInjection: (vehicleId: string, key: keyof AttackInjections) => void;
  onResetInjections: (vehicleId: string) => void;
}

export const AttackInjectionControls: React.FC<AttackInjectionControlsProps> = ({
  vehicle,
  onToggleInjection,
  onResetInjections,
}) => {
  const { t } = useLanguage();
  const hasActiveInjection = Object.values(vehicle.injections).some(Boolean);

  return (
    <div className="p-3 rounded bg-[var(--panel-header-bg)] border border-[var(--panel-border)] space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-amber" />
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--foreground)]">
            {t.failureAttackControl}
          </span>
        </div>
        {hasActiveInjection && (
          <button
            onClick={() => onResetInjections(vehicle.id)}
            className="text-[11px] font-mono text-brand-cyan hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t.resetAllInjections}</span>
          </button>
        )}
      </div>

      {/* Toggles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-1 font-mono text-xs">
        {/* 1. LiDAR Failure */}
        <button
          onClick={() => onToggleInjection(vehicle.id, 'lidarFailure')}
          className={`p-2 rounded border text-left flex flex-col justify-between transition-all cursor-pointer ${
            vehicle.injections.lidarFailure
              ? 'bg-rose-500/20 border-brand-rose text-brand-rose shadow-sm'
              : 'bg-[var(--input-bg)] border-[var(--panel-border)] text-[var(--muted-text)] hover:border-brand-amber hover:text-[var(--foreground)]'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-bold">{t.lidarFailure}</span>
            <Eye className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] mt-1 opacity-80">
            {vehicle.injections.lidarFailure ? t.lidarFailureActive : t.lidarFailureNominal}
          </span>
        </button>

        {/* 2. V2X Latency Spike */}
        <button
          onClick={() => onToggleInjection(vehicle.id, 'v2xLatencySpike')}
          className={`p-2 rounded border text-left flex flex-col justify-between transition-all cursor-pointer ${
            vehicle.injections.v2xLatencySpike
              ? 'bg-rose-500/20 border-brand-rose text-brand-rose shadow-sm'
              : 'bg-[var(--input-bg)] border-[var(--panel-border)] text-[var(--muted-text)] hover:border-brand-amber hover:text-[var(--foreground)]'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-bold">{t.v2xSpike}</span>
            <Radio className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] mt-1 opacity-80">
            {vehicle.injections.v2xLatencySpike ? t.v2xSpikeActive : t.v2xSpikeNominal}
          </span>
        </button>

        {/* 3. GPS Spoofing */}
        <button
          onClick={() => onToggleInjection(vehicle.id, 'gpsSpoofing')}
          className={`p-2 rounded border text-left flex flex-col justify-between transition-all cursor-pointer ${
            vehicle.injections.gpsSpoofing
              ? 'bg-rose-500/20 border-brand-rose text-brand-rose shadow-sm'
              : 'bg-[var(--input-bg)] border-[var(--panel-border)] text-[var(--muted-text)] hover:border-brand-amber hover:text-[var(--foreground)]'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-bold">{t.gpsSpoofing}</span>
            <Compass className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] mt-1 opacity-80">
            {vehicle.injections.gpsSpoofing ? t.gpsSpoofingActive : t.gpsSpoofingNominal}
          </span>
        </button>

        {/* 4. Camera Offline */}
        <button
          onClick={() => onToggleInjection(vehicle.id, 'cameraOffline')}
          className={`p-2 rounded border text-left flex flex-col justify-between transition-all cursor-pointer ${
            vehicle.injections.cameraOffline
              ? 'bg-rose-500/20 border-brand-rose text-brand-rose shadow-sm'
              : 'bg-[var(--input-bg)] border-[var(--panel-border)] text-[var(--muted-text)] hover:border-brand-amber hover:text-[var(--foreground)]'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-bold">{t.cameraOffline}</span>
            <Camera className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] mt-1 opacity-80">
            {vehicle.injections.cameraOffline ? t.cameraOfflineActive : t.cameraOfflineNominal}
          </span>
        </button>

        {/* 5. CAN Bus Injection */}
        <button
          onClick={() => onToggleInjection(vehicle.id, 'canBusInjection')}
          className={`p-2 rounded border text-left flex flex-col justify-between transition-all cursor-pointer ${
            vehicle.injections.canBusInjection
              ? 'bg-rose-500/20 border-brand-rose text-brand-rose shadow-sm'
              : 'bg-[var(--input-bg)] border-[var(--panel-border)] text-[var(--muted-text)] hover:border-brand-amber hover:text-[var(--foreground)]'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-bold">{t.canInjection}</span>
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] mt-1 opacity-80">
            {vehicle.injections.canBusInjection ? t.canInjectionActive : t.canInjectionNominal}
          </span>
        </button>
      </div>
    </div>
  );
};
