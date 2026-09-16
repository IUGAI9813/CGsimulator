"use client";

import React from 'react';
import { ShieldCheck, Flame, Sliders } from 'lucide-react';
import { Vehicle } from '../../types/simulator';

interface FleetTableProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
}

export const FleetTable: React.FC<FleetTableProps> = ({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
}) => {
  return (
    <div className="cyber-panel rounded overflow-hidden font-mono border border-[var(--panel-border)] shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-[var(--panel-header-bg)] border-b border-[var(--panel-border)] text-[var(--muted-text)] uppercase text-[11px] tracking-wider">
            <tr>
              <th className="p-3.5">Vehicle Node / Model</th>
              <th className="p-3.5">Type & VIN</th>
              <th className="p-3.5">Lifecycle</th>
              <th className="p-3.5">Speed / Battery</th>
              <th className="p-3.5">Security / Attacks</th>
              <th className="p-3.5">Watchdog</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--panel-border)] bg-[var(--panel-bg)]">
            {vehicles.map((vehicle) => {
              const activeAttacks = Object.values(vehicle.injections).filter(Boolean).length;
              const isRunning = vehicle.lifecycleStatus === 'RUNNING';
              const isSelected = selectedVehicleId === vehicle.id;

              return (
                <tr
                  key={vehicle.id}
                  onClick={() => onSelectVehicle(vehicle.id)}
                  className={`transition-colors cursor-pointer group ${
                    isSelected
                      ? 'bg-brand-cyan/15 border-l-4 border-l-brand-cyan'
                      : 'hover:bg-[var(--input-bg)]'
                  }`}
                >
                  {/* 1. Node ID & Model */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          isRunning ? 'bg-brand-emerald animate-ping' : 'bg-zinc-600'
                        }`}
                      />
                      <div>
                        <div className="font-bold text-sm text-[var(--foreground)] group-hover:text-brand-cyan transition-colors">
                          {vehicle.id}
                        </div>
                        <div className="text-[11px] text-[var(--muted-text)] truncate max-w-[180px]">
                          {vehicle.model || vehicle.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 2. Type & VIN */}
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 block w-fit mb-1">
                      {vehicle.type}
                    </span>
                    <code className="text-[10px] text-[var(--muted-text)] font-mono">{vehicle.vin}</code>
                  </td>

                  {/* 3. Lifecycle Status */}
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        isRunning
                          ? 'bg-emerald-500/15 text-brand-emerald border border-emerald-500/30'
                          : vehicle.lifecycleStatus === 'PAUSED'
                          ? 'bg-amber-500/15 text-brand-amber border border-amber-500/30'
                          : 'bg-zinc-800 text-[var(--muted-text)] border border-zinc-700'
                      }`}
                    >
                      {vehicle.lifecycleStatus}
                    </span>
                  </td>

                  {/* 4. Speed & Battery */}
                  <td className="p-3.5">
                    <div>
                      <div className="font-bold text-[var(--foreground)] tabular-nums">
                        {vehicle.lastTelemetry ? vehicle.lastTelemetry.speedKmh : 0}{' '}
                        <span className="text-[10px] font-normal text-[var(--muted-text)]">km/h</span>
                      </div>
                      <div className="text-[10px] text-brand-cyan font-bold tabular-nums">
                        ⚡ {vehicle.lastTelemetry ? vehicle.lastTelemetry.batteryPercent : 90}% SOC
                      </div>
                    </div>
                  </td>

                  {/* 5. Security Status / Injections */}
                  <td className="p-3.5">
                    {activeAttacks > 0 ? (
                      <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-rose-500/20 text-brand-rose border border-rose-500/40 animate-pulse flex items-center gap-1 w-fit">
                        <Flame className="w-3 h-3" />
                        <span>{activeAttacks} ATTACKS</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-brand-emerald border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <ShieldCheck className="w-3 h-3" />
                        <span>NOMINAL</span>
                      </span>
                    )}
                  </td>

                  {/* 6. Last Heartbeat Ping */}
                  <td className="p-3.5">
                    <span
                      className={`text-xs tabular-nums font-bold ${
                        vehicle.secondsSinceLastHeartbeat >= 10
                          ? 'text-brand-rose'
                          : vehicle.secondsSinceLastHeartbeat >= 5
                          ? 'text-brand-amber'
                          : 'text-brand-emerald'
                      }`}
                    >
                      {vehicle.secondsSinceLastHeartbeat}s ago
                    </span>
                  </td>

                  {/* 7. Action Button */}
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectVehicle(vehicle.id);
                      }}
                      className="px-3 py-1.5 rounded bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 ml-auto cursor-pointer shadow-sm"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
