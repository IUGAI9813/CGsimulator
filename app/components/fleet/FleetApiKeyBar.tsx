"use client";

import React from 'react';
import { Key, RotateCcw, Play, Square, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FleetApiKeyBarProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onResetToDemo: () => void;
  onStartAll: () => void;
  onStopAll: () => void;
  runningCount: number;
  totalCount: number;
  authError: string | null;
}

export const FleetApiKeyBar: React.FC<FleetApiKeyBarProps> = ({
  apiKey,
  onApiKeyChange,
  onResetToDemo,
  onStartAll,
  onStopAll,
  runningCount,
  totalCount,
  authError,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-3 font-mono">
      {/* Auth Error Toast Banner */}
      {authError && (
        <div className="p-3.5 rounded bg-rose-500/15 border border-rose-500/40 text-brand-rose text-xs flex items-center justify-between gap-2 shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-brand-rose flex-shrink-0" />
            <span>{authError}</span>
          </div>
          <button
            type="button"
            onClick={onResetToDemo}
            className="px-2.5 py-1 rounded bg-brand-rose/20 hover:bg-brand-rose/30 text-xs font-bold underline cursor-pointer"
          >
            Apply Demo Key
          </button>
        </div>
      )}

      {/* Main Bar */}
      <div className="p-4 rounded bg-[var(--panel-bg)] border border-[var(--panel-border)] flex flex-wrap items-center justify-between gap-4 text-xs shadow-md">
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          <Key className="w-4 h-4 text-brand-amber flex-shrink-0" />
          <span className="font-bold text-[var(--foreground)] whitespace-nowrap">
            {t.telemetryApiKeyLabel}
          </span>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-[var(--input-bg)] border border-[var(--input-border)] text-xs text-[var(--foreground)] flex-1 focus:border-brand-amber focus:outline-none"
            placeholder="cg_demo_telemetry_key_2026"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/30 px-2 py-0.5 rounded">
            50,000 req/day
          </span>
          <button
            type="button"
            onClick={onResetToDemo}
            className="flex items-center gap-1 text-[11px] text-brand-amber hover:underline cursor-pointer"
            title={t.resetToDemo}
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t.resetToDemo}</span>
          </button>

          {/* Master Start / Stop Controls */}
          <div className="flex items-center gap-2 border-l border-[var(--panel-border)] pl-3">
            <button
              type="button"
              onClick={onStartAll}
              disabled={runningCount === totalCount && totalCount > 0}
              className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              title="Start all vehicle generators"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{t.startAllSimulation}</span>
            </button>

            <button
              type="button"
              onClick={onStopAll}
              disabled={runningCount === 0}
              className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Stop all vehicle generators"
            >
              <Square className="w-3.5 h-3.5" />
              <span>{t.stopAllSimulation}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
