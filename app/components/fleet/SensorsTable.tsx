import React from 'react';
import { DeviceSensor } from '../../types/simulator';
import { useLanguage } from '../../context/LanguageContext';

interface SensorsTableProps {
  sensors: DeviceSensor[];
}

export const SensorsTable: React.FC<SensorsTableProps> = ({ sensors }) => {
  const { t } = useLanguage();

  return (
    <div className="mt-2 border border-[var(--panel-border)] rounded overflow-hidden">
      <table className="w-full text-xs font-mono">
        <thead className="bg-[var(--panel-header-bg)] border-b border-[var(--panel-border)] text-[var(--muted-text)] text-left">
          <tr>
            <th className="p-2">{t.sensorId}</th>
            <th className="p-2">{t.sensorType}</th>
            <th className="p-2">{t.sensorName}</th>
            <th className="p-2">{t.mountLocation}</th>
            <th className="p-2">{t.firmware}</th>
            <th className="p-2">{t.diagnosticStatus}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--panel-border)]">
          {sensors.map((sensor) => (
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
  );
};
