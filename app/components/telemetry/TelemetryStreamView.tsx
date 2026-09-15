"use client";

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Vehicle, TelemetryPayload, IncidentRecord } from '../../types/simulator';
import { INITIAL_VEHICLES } from '../../utils/presets';
import { GangnamVectorMap } from './GangnamVectorMap';
import { JsonPayloadViewer } from './JsonPayloadViewer';
import { IncidentsTable } from './IncidentsTable';

interface TelemetryStreamViewProps {
  vehicles?: Vehicle[];
  latestPayload?: TelemetryPayload | null;
  telemetryLogs?: TelemetryPayload[];
  incidents?: IncidentRecord[];
  onClearLogs?: () => void;
  onClearIncidents?: () => void;
}

export const TelemetryStreamView: React.FC<TelemetryStreamViewProps> = ({
  vehicles = INITIAL_VEHICLES,
  latestPayload = null,
  telemetryLogs = [],
  incidents = [],
  onClearLogs = () => {},
  onClearIncidents = () => {},
}) => {
  const { t } = useLanguage();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('ALL');

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[var(--foreground)] tracking-tight">
            {t.telemetryStreamTitle}
          </h2>
          <p className="text-xs text-[var(--muted-text)] font-mono">
            {t.telemetryStreamDesc}
          </p>
        </div>

        {/* Vehicle Filter Selector */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[var(--muted-text)]">{t.filterNode}</span>
          <select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] font-mono text-xs focus:outline-none focus:border-brand-cyan"
          >
            <option value="ALL">{t.allActiveVehicles} ({vehicles.length})</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.id} ({v.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Map (Left) & JSON Terminal (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <GangnamVectorMap vehicles={vehicles} />
        <JsonPayloadViewer
          latestPayload={latestPayload}
          totalLogsCount={telemetryLogs.length}
          onClearLogs={onClearLogs}
        />
      </div>

      {/* Incidents Stream Table */}
      <IncidentsTable
        incidents={incidents}
        onClearIncidents={onClearIncidents}
      />
    </div>
  );
};
