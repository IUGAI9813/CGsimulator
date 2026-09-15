"use client";

import React, { useState } from 'react';
import { Activity, Copy, Check, Terminal, MapPin, AlertTriangle, Radio, ShieldAlert } from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';
import { GANGNAM_WAYPOINTS, GEOFENCE_BOUNDS } from '../utils/presets';

export const TelemetryStreamView: React.FC = () => {
  const { vehicles, telemetryLogs, incidents, clearLogs, clearIncidents } = useSimulator();
  const [copied, setCopied] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('ALL');

  const filteredLogs = selectedVehicleId === 'ALL'
    ? telemetryLogs
    : telemetryLogs.filter(l => l.vehicleId === selectedVehicleId);

  const latestPayload = filteredLogs[0] || null;

  const handleCopyJson = () => {
    if (latestPayload) {
      navigator.clipboard.writeText(JSON.stringify(latestPayload, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Convert GPS (lat, lng) to relative SVG percentage coordinates on Gangnam map
  const mapCoordinatesToSvg = (lat: number, lng: number) => {
    // Gangnam bounds mapping
    const minLat = GEOFENCE_BOUNDS.minLat;
    const maxLat = GEOFENCE_BOUNDS.maxLat;
    const minLng = GEOFENCE_BOUNDS.minLng;
    const maxLng = GEOFENCE_BOUNDS.maxLng;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100; // Invert Y for screen coords

    // Clamp within 0..100% or allow slightly outside if spoofed
    return {
      x: Math.max(2, Math.min(98, x)),
      y: Math.max(2, Math.min(98, y)),
      isOutOfGeofence: lat < minLat || lat > maxLat || lng < minLng || lng > maxLng,
    };
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[var(--foreground)] tracking-tight">
            Live Telemetry Ingestion & Gangnam Geofence Stream
          </h2>
          <p className="text-xs text-[var(--muted-text)] font-mono">
            Real-time payload stream for <code className="text-brand-cyan">POST /api/v1/telemetry/ingest</code> with interactive node tracking.
          </p>
        </div>

        {/* Vehicle Filter Selector */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[var(--muted-text)]">Filter Node:</span>
          <select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] font-mono text-xs focus:outline-none focus:border-brand-cyan"
          >
            <option value="ALL">All Active Vehicles ({vehicles.length})</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>
                {v.id} ({v.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Map on Left, JSON Payload Terminal on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Vector Map (7 Cols) */}
        <div className="lg:col-span-7 cyber-panel rounded overflow-hidden flex flex-col">
          <div className="cyber-panel-header">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-cyan" />
              <span className="text-xs font-mono font-bold uppercase text-[var(--foreground)]">
                Seoul Gangnam Autonomous Route & Geofence
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-brand-emerald">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
                In-Bounds
              </span>
              <span className="flex items-center gap-1 text-brand-rose">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-rose" />
                Spoofed / Breach
              </span>
            </div>
          </div>

          {/* Map Display Box */}
          <div className="relative h-80 sm:h-96 w-full bg-[var(--input-bg)] map-grid overflow-hidden border-b border-[var(--panel-border)]">
            {/* SVG Roads & Geofence Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Geofence Boundary Box */}
              <rect
                x="5"
                y="5"
                width="90"
                height="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.4"
                strokeDasharray="2,2"
                className="text-brand-cyan/40"
              />

              {/* Waypoint Loop Path */}
              {GANGNAM_WAYPOINTS.length > 1 && (
                <path
                  d={GANGNAM_WAYPOINTS.reduce((acc, wp, idx) => {
                    const pt = mapCoordinatesToSvg(wp.lat, wp.lng);
                    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
                  }, '') + ' Z'}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  className="text-brand-cyan/50"
                />
              )}

              {/* Waypoint Dots */}
              {GANGNAM_WAYPOINTS.map((wp, i) => {
                const pt = mapCoordinatesToSvg(wp.lat, wp.lng);
                return (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r="1.2"
                    fill="currentColor"
                    className="text-zinc-500"
                  />
                );
              })}
            </svg>

            {/* Waypoint Labels */}
            {GANGNAM_WAYPOINTS.map((wp, i) => {
              const pt = mapCoordinatesToSvg(wp.lat, wp.lng);
              return (
                <div
                  key={i}
                  style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-5 pointer-events-none hidden sm:block"
                >
                  <span className="text-[8px] font-mono text-[var(--muted-text)] bg-[var(--panel-bg)]/80 px-1 py-0.5 rounded border border-[var(--panel-border)] whitespace-nowrap">
                    {wp.name}
                  </span>
                </div>
              );
            })}

            {/* Live Vehicle Markers */}
            {vehicles.map((v) => {
              const lastT = v.lastTelemetry;
              if (!lastT) return null;

              const pt = mapCoordinatesToSvg(lastT.latitude, lastT.longitude);
              const isSpoofed = v.injections.gpsSpoofing || pt.isOutOfGeofence;
              const isOffline = v.lifecycleStatus === 'OFFLINE';

              return (
                <div
                  key={v.id}
                  style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 z-10 ${
                    isSpoofed ? 'animate-bounce' : ''
                  }`}
                >
                  {/* Pin Circle */}
                  <div className="relative group cursor-pointer">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-mono font-bold text-[9px] shadow-lg ${
                        isOffline
                          ? 'bg-rose-950 border-brand-rose text-brand-rose'
                          : isSpoofed
                          ? 'bg-rose-900 border-brand-rose text-white shadow-rose-500/50'
                          : v.injections.lidarFailure || v.injections.cameraOffline || v.injections.v2xLatencySpike || v.injections.canBusInjection
                          ? 'bg-amber-950 border-brand-amber text-brand-amber'
                          : 'bg-cyan-950 border-brand-cyan text-brand-cyan shadow-cyan-500/30'
                      }`}
                    >
                      {v.id.slice(-2)}
                    </div>

                    {/* Radar Pulse ring */}
                    {v.lifecycleStatus === 'RUNNING' && !isOffline && (
                      <span
                        className={`absolute -inset-1 rounded-full animate-ping opacity-50 ${
                          isSpoofed ? 'bg-brand-rose' : 'bg-brand-cyan'
                        }`}
                      />
                    )}

                    {/* Hover Card */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                      <div className="p-2 rounded bg-[var(--panel-bg)] border border-[var(--panel-border)] shadow-xl text-[10px] font-mono whitespace-nowrap text-[var(--foreground)] space-y-0.5">
                        <div className="font-bold text-brand-cyan">{v.name} ({v.id})</div>
                        <div>Status: <span className="font-bold">{v.lifecycleStatus}</span></div>
                        <div>Coord: {lastT.latitude.toFixed(4)}, {lastT.longitude.toFixed(4)}</div>
                        <div>Speed: {lastT.speedKmh} km/h | V2X: {lastT.v2xLatencyMs}ms</div>
                        {isSpoofed && (
                          <div className="text-brand-rose font-bold">⚠️ GPS SPOOFED / GEOFENCE BREACH</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Footer Bar with GPS Telemetry Coordinates */}
          <div className="p-3 bg-[var(--panel-header-bg)] flex flex-wrap items-center justify-between text-xs font-mono text-[var(--muted-text)] gap-2">
            <div>
              Active Tracked Nodes: <span className="text-[var(--foreground)] font-bold">{vehicles.length}</span>
            </div>
            <div>
              Geofence: <span className="text-brand-cyan font-bold">Gangnam District (37.49°N - 37.52°N, 127.02°E - 127.07°E)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live JSON Terminal & Payload Inspector (5 Cols) */}
        <div className="lg:col-span-5 cyber-panel rounded flex flex-col justify-between">
          <div>
            <div className="cyber-panel-header">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-brand-cyan" />
                <span className="text-xs font-mono font-bold uppercase text-[var(--foreground)]">
                  Latest Ingestion Payload (JSON)
                </span>
              </div>
              {latestPayload && (
                <button
                  onClick={handleCopyJson}
                  className="text-[10px] font-mono text-[var(--muted-text)] hover:text-brand-cyan flex items-center gap-1 cursor-pointer"
                  title="Copy JSON Payload"
                >
                  {copied ? <Check className="w-3 h-3 text-brand-emerald" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            {/* Code Body */}
            <div className="p-3">
              {latestPayload ? (
                <pre className="p-3 rounded bg-[var(--input-bg)] border border-[var(--input-border)] text-[11px] font-mono text-[var(--foreground)] overflow-x-auto max-h-80 leading-relaxed tabular-nums">
                  {JSON.stringify(latestPayload, null, 2)}
                </pre>
              ) : (
                <div className="p-12 text-center text-xs font-mono text-[var(--muted-text)]">
                  Waiting for first telemetry tick...
                </div>
              )}
            </div>
          </div>

          {/* Quick Clear Logs Footer */}
          <div className="p-3 border-t border-[var(--panel-border)] bg-[var(--panel-header-bg)] flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--muted-text)]">
              Buffered Packets: <strong className="text-[var(--foreground)]">{telemetryLogs.length}</strong>
            </span>
            <button
              onClick={clearLogs}
              className="text-[10px] text-[var(--muted-text)] hover:text-brand-rose underline cursor-pointer"
            >
              Clear Buffer
            </button>
          </div>
        </div>
      </div>

      {/* Incident & Attack Log Ticker (Bottom Table) */}
      <div className="cyber-panel rounded overflow-hidden">
        <div className="cyber-panel-header">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-brand-rose" />
            <span className="text-xs font-mono font-bold uppercase text-[var(--foreground)]">
              Simulator Incident & Heartbeat Stream ({incidents.length})
            </span>
          </div>
          <button
            onClick={clearIncidents}
            className="text-[10px] font-mono text-[var(--muted-text)] hover:text-brand-rose cursor-pointer underline"
          >
            Clear Log
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto">
          {incidents.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-[var(--muted-text)]">
              No incidents recorded in session.
            </div>
          ) : (
            <table className="w-full text-xs font-mono">
              <thead className="bg-[var(--panel-header-bg)] border-b border-[var(--panel-border)] text-[var(--muted-text)] text-left sticky top-0">
                <tr>
                  <th className="p-2.5">Time</th>
                  <th className="p-2.5">Severity</th>
                  <th className="p-2.5">Vehicle</th>
                  <th className="p-2.5">Incident Code</th>
                  <th className="p-2.5">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--panel-border)]">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-black/10">
                    <td className="p-2.5 text-[var(--muted-text)] whitespace-nowrap">{inc.timestamp}</td>
                    <td className="p-2.5 whitespace-nowrap">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inc.severity === 'CRITICAL'
                            ? 'bg-rose-500/15 text-brand-rose border border-rose-500/40'
                            : inc.severity === 'HIGH'
                            ? 'bg-amber-500/15 text-brand-amber border border-amber-500/40'
                            : inc.severity === 'MEDIUM'
                            ? 'bg-cyan-500/15 text-brand-cyan border border-cyan-500/40'
                            : 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/30'
                        }`}
                      >
                        {inc.severity}
                      </span>
                    </td>
                    <td className="p-2.5 font-bold text-brand-cyan whitespace-nowrap">{inc.vehicleId}</td>
                    <td className="p-2.5 font-bold text-[var(--foreground)] whitespace-nowrap">{inc.type}</td>
                    <td className="p-2.5 text-[var(--muted-text)]">{inc.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
