"use client";

import React, { useState } from 'react';
import { Shield, Activity, Radio, Moon, Sun, Settings, Globe, RefreshCw } from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

interface HeaderProps {
  activeTab: 'fleet' | 'provisioning' | 'telemetry';
  setActiveTab: (tab: 'fleet' | 'provisioning' | 'telemetry') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { vehicles, config, updateConfig, telemetryLogs, theme, toggleTheme } = useSimulator();
  const [showConfigModal, setShowConfigModal] = useState(false);

  const runningCount = vehicles.filter(v => v.lifecycleStatus === 'RUNNING').length;
  const attackCount = vehicles.reduce((sum, v) => {
    const inj = v.injections;
    return sum + (inj.lidarFailure || inj.v2xLatencySpike || inj.gpsSpoofing || inj.cameraOffline || inj.canBusInjection ? 1 : 0);
  }, 0);

  return (
    <header className="border-b border-[var(--panel-border)] bg-[var(--panel-header-bg)] sticky top-0 z-40 backdrop-blur-md">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Status */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-brand-cyan/10 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-wider uppercase text-[var(--foreground)]">
                CoreGuard <span className="text-brand-cyan">Simulator</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                v2.6 CGS CORE
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted-text)] font-mono">
              Autonomous Vehicle Fleet & Cyber-Attack Ingestion Engine
            </p>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded bg-[var(--input-bg)] border border-[var(--panel-border)]">
            <span className="w-2 h-2 rounded-full bg-brand-emerald animate-ping" />
            <span className="text-[11px] font-mono text-[var(--muted-text)]">Active Nodes:</span>
            <span className="text-xs font-mono font-bold text-[var(--foreground)] tabular-nums">
              {runningCount} / {vehicles.length}
            </span>
          </div>

          {attackCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-brand-rose/10 border border-brand-rose/40 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-brand-rose" />
              <span className="text-[11px] font-mono text-brand-rose font-bold">
                {attackCount} INJECTIONS ACTIVE
              </span>
            </div>
          )}

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded bg-[var(--input-bg)] border border-[var(--panel-border)]">
            <Activity className="w-3.5 h-3.5 text-brand-cyan" />
            <span className="text-[11px] font-mono text-[var(--muted-text)]">Packets Sent:</span>
            <span className="text-xs font-mono font-bold text-[var(--foreground)] tabular-nums">
              {telemetryLogs.length}
            </span>
          </div>

          {/* Rate Selector */}
          <div className="flex items-center gap-1 bg-[var(--input-bg)] p-1 rounded border border-[var(--panel-border)]">
            <span className="text-[10px] font-mono text-[var(--muted-text)] px-1.5 font-bold">INTERVAL:</span>
            {[500, 1000, 2000].map(interval => (
              <button
                key={interval}
                onClick={() => updateConfig({ intervalMs: interval })}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  config.intervalMs === interval
                    ? 'bg-brand-cyan text-slate-950 shadow-sm'
                    : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
                }`}
              >
                {interval}ms
              </button>
            ))}
          </div>

          {/* Config Modal Button */}
          <button
            onClick={() => setShowConfigModal(!showConfigModal)}
            className="p-2 rounded bg-[var(--input-bg)] border border-[var(--panel-border)] hover:border-brand-cyan text-[var(--muted-text)] hover:text-brand-cyan transition-all cursor-pointer"
            title="Simulator Settings / Target API"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded bg-[var(--input-bg)] border border-[var(--panel-border)] hover:border-brand-cyan text-[var(--muted-text)] hover:text-brand-cyan transition-all cursor-pointer"
            title="Toggle Dark / Light Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-600" />}
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between border-t border-[var(--panel-border)]">
        <div className="flex gap-1 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-4 py-2 text-xs font-bold tracking-wide uppercase flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'fleet'
                ? 'border-brand-cyan text-brand-cyan bg-[var(--panel-bg)]'
                : 'border-transparent text-[var(--muted-text)] hover:text-[var(--foreground)]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Fleet & Attack Matrix</span>
            <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20 text-[var(--foreground)]">
              {vehicles.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('provisioning')}
            className={`px-4 py-2 text-xs font-bold tracking-wide uppercase flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'provisioning'
                ? 'border-brand-cyan text-brand-cyan bg-[var(--panel-bg)]'
                : 'border-transparent text-[var(--muted-text)] hover:text-[var(--foreground)]'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Vehicle Provisioning</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-4 py-2 text-xs font-bold tracking-wide uppercase flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'telemetry'
                ? 'border-brand-cyan text-brand-cyan bg-[var(--panel-bg)]'
                : 'border-transparent text-[var(--muted-text)] hover:text-[var(--foreground)]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Telemetry Stream & Map</span>
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
          </button>
        </div>
      </div>

      {/* Quick Settings Drawer / Overlay */}
      {showConfigModal && (
        <div className="bg-[var(--panel-bg)] border-b border-[var(--panel-border)] p-4 text-xs font-mono">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-cyan" />
                <span className="font-bold text-[var(--foreground)]">Target SOC API Endpoint:</span>
                <input
                  type="text"
                  value={config.targetApiUrl}
                  onChange={(e) => updateConfig({ targetApiUrl: e.target.value })}
                  className="px-2 py-1 rounded bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] text-xs font-mono w-60"
                  placeholder="http://localhost:3003"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.forwardHttp}
                  onChange={(e) => updateConfig({ forwardHttp: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-cyan focus:ring-0 cursor-pointer"
                />
                <span className="text-[var(--foreground)]">
                  Forward Real HTTP Telemetry (`POST /api/v1/telemetry/ingest`)
                </span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-[var(--muted-text)]">Heartbeat Timeout Limit:</span>
                <span className="font-bold text-brand-amber">{config.heartbeatTimeoutSeconds}s</span>
              </div>
            </div>

            <button
              onClick={() => setShowConfigModal(false)}
              className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
