import React from 'react';
import { MapPin } from 'lucide-react';
import { Vehicle } from '../../types/simulator';
import { GANGNAM_WAYPOINTS } from '../../utils/presets';
import { geoHelper } from '../../helpers/geoHelper';
import { useLanguage } from '../../context/LanguageContext';

interface GangnamVectorMapProps {
  vehicles: Vehicle[];
  className?: string;
}

export const GangnamVectorMap: React.FC<GangnamVectorMapProps> = ({ vehicles, className = '' }) => {
  const { t } = useLanguage();

  return (
    <div className={`cyber-panel rounded overflow-hidden flex flex-col ${className}`}>
      <div className="cyber-panel-header">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-cyan" />
          <span className="text-xs font-mono font-bold uppercase text-[var(--foreground)]">
            {t.mapTitle}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-brand-emerald">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
            {t.inBounds}
          </span>
          <span className="flex items-center gap-1 text-brand-rose">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-rose" />
            {t.spoofedBreach}
          </span>
        </div>
      </div>

      {/* Map Display Box */}
      <div className="relative h-80 sm:h-96 w-full bg-[var(--input-bg)] map-grid overflow-hidden border-b border-[var(--panel-border)]">
        {/* SVG Route Line & Geofence Bounds */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Geofence Boundary */}
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

          {/* Waypoint Loop */}
          {GANGNAM_WAYPOINTS.length > 1 && (
            <path
              d={
                GANGNAM_WAYPOINTS.reduce((acc, wp, idx) => {
                  const pt = geoHelper.mapCoordinatesToSvg(wp.lat, wp.lng);
                  return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
                }, '') + ' Z'
              }
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
              className="text-brand-cyan/50"
            />
          )}

          {/* Waypoint Dots */}
          {GANGNAM_WAYPOINTS.map((wp, i) => {
            const pt = geoHelper.mapCoordinatesToSvg(wp.lat, wp.lng);
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
          const pt = geoHelper.mapCoordinatesToSvg(wp.lat, wp.lng);
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

          const pt = geoHelper.mapCoordinatesToSvg(lastT.latitude, lastT.longitude);
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
              <div className="relative group cursor-pointer">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-mono font-bold text-[9px] shadow-lg ${
                    isOffline
                      ? 'bg-rose-950 border-brand-rose text-brand-rose'
                      : isSpoofed
                      ? 'bg-rose-900 border-brand-rose text-white shadow-rose-500/50'
                      : v.injections.lidarFailure ||
                        v.injections.cameraOffline ||
                        v.injections.v2xLatencySpike ||
                        v.injections.canBusInjection
                      ? 'bg-amber-950 border-brand-amber text-brand-amber'
                      : 'bg-cyan-950 border-brand-cyan text-brand-cyan shadow-cyan-500/30'
                  }`}
                >
                  {v.id.slice(-2)}
                </div>

                {v.lifecycleStatus === 'RUNNING' && !isOffline && (
                  <span
                    className={`absolute -inset-1 rounded-full animate-ping opacity-50 ${
                      isSpoofed ? 'bg-brand-rose' : 'bg-brand-cyan'
                    }`}
                  />
                )}

                {/* Hover Popover */}
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

      {/* Map Footer Bar */}
      <div className="p-3 bg-[var(--panel-header-bg)] flex flex-wrap items-center justify-between text-xs font-mono text-[var(--muted-text)] gap-2">
        <div>
          {t.activeTrackedNodes} <span className="text-[var(--foreground)] font-bold">{vehicles.length}</span>
        </div>
        <div>
          <span className="text-brand-cyan font-bold">{t.geofenceArea}</span>
        </div>
      </div>
    </div>
  );
};
