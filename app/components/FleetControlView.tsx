"use client";

import React, { useState } from 'react';
import {
  Play,
  Pause,
  Square,
  AlertTriangle,
  RotateCcw,
  Zap,
  Radio,
  Eye,
  Camera,
  Compass,
  Cpu,
  ShieldCheck,
  Flame,
  ChevronDown,
  ChevronUp,
  Clock,
  Gauge
} from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';
import { Vehicle, AttackInjections } from '../types/simulator';

export const FleetControlView: React.FC = () => {
  const {
    vehicles,
    setLifecycleStatus,
    toggleInjection,
    resetInjections,
    triggerHeartbeatTimeout,
  } = useSimulator();

  const [expandedSensors, setExpandedSensors] = useState<Record<string, boolean>>({});

  const toggleSensorExpand = (vehicleId: string) => {
    setExpandedSensors(prev => ({
      ...prev,
      [vehicleId]: !prev[vehicleId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cyber-panel p-4 rounded flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted-text)] block">
              Fleet Capacity
            </span>
            <div className="text-2xl font-bold font-mono text-[var(--foreground)] mt-1 tabular-nums">
              {vehicles.length} <span className="text-xs font-normal text-[var(--muted-text)]">Units</span>
            </div>
          </div>
          <div className="p-2.5 rounded bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan">
            <Radio className="w-5 h-5" />
          </div>
        </div>

        <div className="cyber-panel p-4 rounded flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted-text)] block">
              Live Generators
            </span>
            <div className="text-2xl font-bold font-mono text-brand-emerald mt-1 tabular-nums flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-emerald animate-ping" />
              {vehicles.filter(v => v.lifecycleStatus === 'RUNNING').length}
            </div>
          </div>
          <div className="p-2.5 rounded bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="cyber-panel p-4 rounded flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted-text)] block">
              Active Injections
            </span>
            <div className="text-2xl font-bold font-mono text-brand-rose mt-1 tabular-nums">
              {vehicles.reduce((acc, v) => {
                const i = v.injections;
                return acc + (i.lidarFailure || i.v2xLatencySpike || i.gpsSpoofing || i.cameraOffline || i.canBusInjection ? 1 : 0);
              }, 0)}
            </div>
          </div>
          <div className="p-2.5 rounded bg-brand-rose/10 border border-brand-rose/30 text-brand-rose">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="cyber-panel p-4 rounded flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--muted-text)] block">
              Heartbeat Watchdog
            </span>
            <div className="text-xs font-mono font-bold text-[var(--foreground)] mt-1">
              Timeout Limit: <span className="text-brand-amber">10.0s</span>
            </div>
            <div className="text-[10px] font-mono text-[var(--muted-text)] mt-0.5">
              Auto <span className="text-brand-rose">INC_HEARTBEAT_LOST</span>
            </div>
          </div>
          <div className="p-2.5 rounded bg-brand-amber/10 border border-brand-amber/30 text-brand-amber">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[var(--foreground)] tracking-tight">
              Virtual Fleet & Real-Time Injections Matrix
            </h2>
            <p className="text-xs text-[var(--muted-text)] font-mono">
              Control individual vehicle lifecycle states and inject live failure/cyber-attack payloads.
            </p>
          </div>
        </div>

        {vehicles.length === 0 ? (
          <div className="cyber-panel p-12 text-center rounded space-y-3 font-mono">
            <Radio className="w-8 h-8 text-[var(--muted-text)] mx-auto opacity-50" />
            <p className="text-sm text-[var(--muted-text)]">No virtual vehicles provisioned.</p>
            <p className="text-xs text-[var(--muted-text)]">Use the Vehicle Provisioning tab to register nodes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {vehicles.map((vehicle: Vehicle) => {
              const lastTelem = vehicle.lastTelemetry;
              const hasActiveInjection = Object.values(vehicle.injections).some(Boolean);
              const isSensorsExpanded = Boolean(expandedSensors[vehicle.id]);

              return (
                <div
                  key={vehicle.id}
                  className={`cyber-panel rounded border transition-all ${
                    vehicle.lifecycleStatus === 'OFFLINE'
                      ? 'border-brand-rose/60 shadow-lg shadow-rose-950/20'
                      : hasActiveInjection
                      ? 'border-brand-amber/50'
                      : 'border-[var(--panel-border)]'
                  }`}
                >
                  {/* Card Header */}
                  <div className="cyber-panel-header flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[var(--foreground)] font-mono">
                          {vehicle.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/30">
                          {vehicle.id}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--input-bg)] text-[var(--muted-text)] border border-[var(--panel-border)] uppercase">
                        {vehicle.type}
                      </span>
                      <span className="hidden sm:inline text-[10px] font-mono text-[var(--muted-text)]">
                        VIN: {vehicle.vin}
                      </span>
                    </div>

                    {/* Status & Lifecycle Controls */}
                    <div className="flex items-center gap-2">
                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-1 rounded border uppercase flex items-center gap-1.5 ${
                          vehicle.lifecycleStatus === 'RUNNING'
                            ? 'bg-emerald-500/10 text-brand-emerald border-emerald-500/30'
                            : vehicle.lifecycleStatus === 'PAUSED'
                            ? 'bg-amber-500/10 text-brand-amber border-amber-500/30'
                            : vehicle.lifecycleStatus === 'OFFLINE'
                            ? 'bg-rose-500/15 text-brand-rose border-rose-500/40 animate-pulse'
                            : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30'
                        }`}
                      >
                        {vehicle.lifecycleStatus === 'RUNNING' && <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-ping" />}
                        {vehicle.lifecycleStatus}
                      </span>

                      {/* Action Buttons */}
                      <div className="flex items-center bg-[var(--input-bg)] p-0.5 rounded border border-[var(--panel-border)]">
                        <button
                          onClick={() => setLifecycleStatus(vehicle.id, 'RUNNING')}
                          disabled={vehicle.lifecycleStatus === 'RUNNING'}
                          title="Start Telemetry Streaming"
                          className={`p-1.5 rounded transition-all cursor-pointer ${
                            vehicle.lifecycleStatus === 'RUNNING'
                              ? 'text-brand-emerald bg-emerald-500/15 opacity-50 cursor-not-allowed'
                              : 'text-[var(--muted-text)] hover:text-brand-emerald hover:bg-emerald-500/10'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>

                        <button
                          onClick={() => setLifecycleStatus(vehicle.id, 'PAUSED')}
                          disabled={vehicle.lifecycleStatus === 'PAUSED'}
                          title="Pause Telemetry (Retains state)"
                          className={`p-1.5 rounded transition-all cursor-pointer ${
                            vehicle.lifecycleStatus === 'PAUSED'
                              ? 'text-brand-amber bg-amber-500/15 opacity-50 cursor-not-allowed'
                              : 'text-[var(--muted-text)] hover:text-brand-amber hover:bg-amber-500/10'
                          }`}
                        >
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        </button>

                        <button
                          onClick={() => setLifecycleStatus(vehicle.id, 'STOPPED')}
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

                      {/* Simulate Timeout Button */}
                      <button
                        onClick={() => triggerHeartbeatTimeout(vehicle.id)}
                        title="Simulate 15s Heartbeat drop to trigger timeout incident"
                        className="px-2 py-1 rounded text-[10px] font-mono font-bold bg-amber-500/10 hover:bg-amber-500/20 text-brand-amber border border-amber-500/30 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Clock className="w-3 h-3" />
                        <span>Force Timeout</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-4">
                    {/* Live Telemetry Metrics Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 font-mono">
                      {/* Speed & Battery */}
                      <div className="p-2.5 rounded bg-[var(--input-bg)] border border-[var(--panel-border)]">
                        <span className="text-[10px] text-[var(--muted-text)] font-bold uppercase block">Speed</span>
                        <div className="text-base font-bold text-[var(--foreground)] mt-0.5 tabular-nums flex items-baseline gap-1">
                          {lastTelem ? lastTelem.speedKmh : 0}
                          <span className="text-[10px] font-normal text-[var(--muted-text)]">km/h</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded bg-[var(--input-bg)] border border-[var(--panel-border)]">
                        <span className="text-[10px] text-[var(--muted-text)] font-bold uppercase block">Battery SOC</span>
                        <div className="text-base font-bold text-brand-cyan mt-0.5 tabular-nums flex items-baseline gap-1">
                          {lastTelem ? lastTelem.batteryPercent : 90}
                          <span className="text-[10px] font-normal text-[var(--muted-text)]">%</span>
                        </div>
                      </div>

                      {/* LiDAR FPS */}
                      <div className={`p-2.5 rounded border transition-all ${
                        vehicle.injections.lidarFailure
                          ? 'bg-rose-500/10 border-brand-rose/40 text-brand-rose'
                          : 'bg-[var(--input-bg)] border-[var(--panel-border)]'
                      }`}>
                        <span className="text-[10px] text-[var(--muted-text)] font-bold uppercase flex items-center justify-between">
                          <span>LiDAR Scan</span>
                          {vehicle.injections.lidarFailure && <span className="text-[9px] text-brand-rose font-bold">ANOMALY</span>}
                        </span>
                        <div className="text-base font-bold text-[var(--foreground)] mt-0.5 tabular-nums flex items-baseline gap-1">
                          <span className={vehicle.injections.lidarFailure ? 'text-brand-rose' : 'text-brand-emerald'}>
                            {lastTelem ? lastTelem.lidarFps : 30}
                          </span>
                          <span className="text-[10px] font-normal text-[var(--muted-text)]">FPS</span>
                        </div>
                      </div>

                      {/* Camera FPS */}
                      <div className={`p-2.5 rounded border transition-all ${
                        vehicle.injections.cameraOffline
                          ? 'bg-rose-500/10 border-brand-rose/40 text-brand-rose'
                          : 'bg-[var(--input-bg)] border-[var(--panel-border)]'
                      }`}>
                        <span className="text-[10px] text-[var(--muted-text)] font-bold uppercase flex items-center justify-between">
                          <span>Camera Array</span>
                          {vehicle.injections.cameraOffline && <span className="text-[9px] text-brand-rose font-bold">OFFLINE</span>}
                        </span>
                        <div className="text-base font-bold text-[var(--foreground)] mt-0.5 tabular-nums flex items-baseline gap-1">
                          <span className={vehicle.injections.cameraOffline ? 'text-brand-rose' : 'text-brand-emerald'}>
                            {lastTelem ? lastTelem.cameraFps : 60}
                          </span>
                          <span className="text-[10px] font-normal text-[var(--muted-text)]">FPS</span>
                        </div>
                      </div>

                      {/* V2X Latency */}
                      <div className={`p-2.5 rounded border transition-all ${
                        vehicle.injections.v2xLatencySpike
                          ? 'bg-rose-500/10 border-brand-rose/40 text-brand-rose'
                          : 'bg-[var(--input-bg)] border-[var(--panel-border)]'
                      }`}>
                        <span className="text-[10px] text-[var(--muted-text)] font-bold uppercase flex items-center justify-between">
                          <span>V2X Latency</span>
                          {vehicle.injections.v2xLatencySpike && <span className="text-[9px] text-brand-rose font-bold">SPIKE</span>}
                        </span>
                        <div className="text-base font-bold text-[var(--foreground)] mt-0.5 tabular-nums flex items-baseline gap-1">
                          <span className={vehicle.injections.v2xLatencySpike ? 'text-brand-rose' : 'text-brand-cyan'}>
                            {lastTelem ? lastTelem.v2xLatencyMs : 14}
                          </span>
                          <span className="text-[10px] font-normal text-[var(--muted-text)]">ms</span>
                        </div>
                      </div>

                      {/* Heartbeat Timer */}
                      <div className={`p-2.5 rounded border transition-all ${
                        vehicle.secondsSinceLastHeartbeat >= 10
                          ? 'bg-rose-500/10 border-brand-rose/50 text-brand-rose'
                          : vehicle.secondsSinceLastHeartbeat >= 5
                          ? 'bg-amber-500/10 border-brand-amber/40 text-brand-amber'
                          : 'bg-[var(--input-bg)] border-[var(--panel-border)]'
                      }`}>
                        <span className="text-[10px] text-[var(--muted-text)] font-bold uppercase block">Last Ping</span>
                        <div className="text-base font-bold mt-0.5 tabular-nums flex items-baseline gap-1">
                          <span className={
                            vehicle.secondsSinceLastHeartbeat >= 10 
                              ? 'text-brand-rose' 
                              : vehicle.secondsSinceLastHeartbeat >= 5 
                              ? 'text-brand-amber' 
                              : 'text-brand-emerald'
                          }>
                            {vehicle.secondsSinceLastHeartbeat}s
                          </span>
                          <span className="text-[10px] font-normal text-[var(--muted-text)]">ago</span>
                        </div>
                      </div>
                    </div>

                    {/* Attack / Failure Injections Section */}
                    <div className="p-3 rounded bg-[var(--panel-header-bg)] border border-[var(--panel-border)] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-brand-amber" />
                          <span className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--foreground)]">
                            Failure & Cyber-Attack Injection Control
                          </span>
                        </div>
                        {hasActiveInjection && (
                          <button
                            onClick={() => resetInjections(vehicle.id)}
                            className="text-[11px] font-mono text-brand-cyan hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset All Injections</span>
                          </button>
                        )}
                      </div>

                      {/* Injection Toggles Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-1 font-mono text-xs">
                        {/* 1. LiDAR Failure */}
                        <button
                          onClick={() => toggleInjection(vehicle.id, 'lidarFailure')}
                          className={`p-2 rounded border text-left flex flex-col justify-between transition-all cursor-pointer ${
                            vehicle.injections.lidarFailure
                              ? 'bg-rose-500/20 border-brand-rose text-brand-rose shadow-sm'
                              : 'bg-[var(--input-bg)] border-[var(--panel-border)] text-[var(--muted-text)] hover:border-brand-amber hover:text-[var(--foreground)]'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-bold">LiDAR Failure</span>
                            <Eye className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[10px] mt-1 opacity-80">
                            {vehicle.injections.lidarFailure ? 'Active (5 FPS Drop)' : 'Nominal (30 FPS)'}
                          </span>
                        </button>

                        {/* 2. V2X Latency Spike */}
                        <button
                          onClick={() => toggleInjection(vehicle.id, 'v2xLatencySpike')}
                          className={`p-2 rounded border text-left flex flex-col justify-between transition-all cursor-pointer ${
                            vehicle.injections.v2xLatencySpike
                              ? 'bg-rose-500/20 border-brand-rose text-brand-rose shadow-sm'
                              : 'bg-[var(--input-bg)] border-[var(--panel-border)] text-[var(--muted-text)] hover:border-brand-amber hover:text-[var(--foreground)]'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-bold">V2X Latency Spike</span>
                            <Radio className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[10px] mt-1 opacity-80">
                            {vehicle.injections.v2xLatencySpike ? 'Active (300ms Spike)' : 'Nominal (14ms)'}
                          </span>
                        </button>

                        {/* 3. GPS Spoofing */}
                        <button
                          onClick={() => toggleInjection(vehicle.id, 'gpsSpoofing')}
                          className={`p-2 rounded border text-left flex flex-col justify-between transition-all cursor-pointer ${
                            vehicle.injections.gpsSpoofing
                              ? 'bg-rose-500/20 border-brand-rose text-brand-rose shadow-sm'
                              : 'bg-[var(--input-bg)] border-[var(--panel-border)] text-[var(--muted-text)] hover:border-brand-amber hover:text-[var(--foreground)]'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-bold">GPS Spoofing</span>
                            <Compass className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[10px] mt-1 opacity-80">
                            {vehicle.injections.gpsSpoofing ? 'Active (Geofence Breach)' : 'In-Bounds Gangnam'}
                          </span>
                        </button>

                        {/* 4. Camera Offline */}
                        <button
                          onClick={() => toggleInjection(vehicle.id, 'cameraOffline')}
                          className={`p-2 rounded border text-left flex flex-col justify-between transition-all cursor-pointer ${
                            vehicle.injections.cameraOffline
                              ? 'bg-rose-500/20 border-brand-rose text-brand-rose shadow-sm'
                              : 'bg-[var(--input-bg)] border-[var(--panel-border)] text-[var(--muted-text)] hover:border-brand-amber hover:text-[var(--foreground)]'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-bold">Camera Feed Offline</span>
                            <Camera className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[10px] mt-1 opacity-80">
                            {vehicle.injections.cameraOffline ? 'Active (0 FPS Stream)' : 'Nominal (60 FPS)'}
                          </span>
                        </button>

                        {/* 5. CAN Bus Injection */}
                        <button
                          onClick={() => toggleInjection(vehicle.id, 'canBusInjection')}
                          className={`p-2 rounded border text-left flex flex-col justify-between transition-all cursor-pointer ${
                            vehicle.injections.canBusInjection
                              ? 'bg-rose-500/20 border-brand-rose text-brand-rose shadow-sm'
                              : 'bg-[var(--input-bg)] border-[var(--panel-border)] text-[var(--muted-text)] hover:border-brand-amber hover:text-[var(--foreground)]'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-bold">CAN Injection (0x0A2)</span>
                            <Cpu className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[10px] mt-1 opacity-80">
                            {vehicle.injections.canBusInjection ? 'Active (ID 0x0A2 Frame)' : 'Clean OBD Gateway'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Sensor Stack Toggle Button */}
                    <div className="pt-1">
                      <button
                        onClick={() => toggleSensorExpand(vehicle.id)}
                        className="text-xs font-mono text-[var(--muted-text)] hover:text-[var(--foreground)] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {isSensorsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        <span>
                          {isSensorsExpanded ? 'Hide Onboard Sensor Array' : `View ${vehicle.sensors.length} Onboard Sensor Modules`}
                        </span>
                      </button>

                      {/* Expandable Sensors Table */}
                      {isSensorsExpanded && (
                        <div className="mt-2 border border-[var(--panel-border)] rounded overflow-hidden">
                          <table className="w-full text-xs font-mono">
                            <thead className="bg-[var(--panel-header-bg)] border-b border-[var(--panel-border)] text-[var(--muted-text)] text-left">
                              <tr>
                                <th className="p-2">Sensor ID</th>
                                <th className="p-2">Type</th>
                                <th className="p-2">Name</th>
                                <th className="p-2">Mount Location</th>
                                <th className="p-2">Firmware</th>
                                <th className="p-2">Diagnostic Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--panel-border)]">
                              {vehicle.sensors.map((sensor) => (
                                <tr key={sensor.id} className="hover:bg-black/10">
                                  <td className="p-2 font-bold text-brand-cyan">{sensor.id}</td>
                                  <td className="p-2 text-[var(--muted-text)]">{sensor.type}</td>
                                  <td className="p-2 text-[var(--foreground)]">{sensor.name}</td>
                                  <td className="p-2 text-[var(--muted-text)]">{sensor.mountPosition}</td>
                                  <td className="p-2 text-[var(--muted-text)]">{sensor.firmware}</td>
                                  <td className="p-2">
                                    <span
                                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                        sensor.status === 'ONLINE'
                                          ? 'bg-emerald-500/10 text-brand-emerald border border-emerald-500/30'
                                          : sensor.status === 'DEGRADED'
                                          ? 'bg-amber-500/10 text-brand-amber border border-amber-500/30'
                                          : 'bg-rose-500/10 text-brand-rose border border-rose-500/30'
                                      }`}
                                    >
                                      {sensor.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
