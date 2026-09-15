import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { IncidentRecord } from '../../types/simulator';
import { formatHelper } from '../../helpers/formatHelper';
import { useLanguage } from '../../context/LanguageContext';

interface IncidentsTableProps {
  incidents: IncidentRecord[];
  onClearIncidents: () => void;
}

export const IncidentsTable: React.FC<IncidentsTableProps> = ({
  incidents,
  onClearIncidents,
}) => {
  const { t } = useLanguage();

  return (
    <div className="cyber-panel rounded overflow-hidden">
      <div className="cyber-panel-header">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-brand-rose" />
          <span className="text-xs font-mono font-bold uppercase text-[var(--foreground)]">
            {t.incidentStreamTitle} ({incidents.length})
          </span>
        </div>
        <button
          onClick={onClearIncidents}
          className="text-[10px] font-mono text-[var(--muted-text)] hover:text-brand-rose cursor-pointer underline"
        >
          {t.clearLog}
        </button>
      </div>

      <div className="max-h-60 overflow-y-auto">
        {incidents.length === 0 ? (
          <div className="p-6 text-center text-xs font-mono text-[var(--muted-text)]">
            {t.noIncidentsRecorded}
          </div>
        ) : (
          <table className="w-full text-xs font-mono">
            <thead className="bg-[var(--panel-header-bg)] border-b border-[var(--panel-border)] text-[var(--muted-text)] text-left sticky top-0">
              <tr>
                <th className="p-2.5">{t.colTime}</th>
                <th className="p-2.5">{t.colSeverity}</th>
                <th className="p-2.5">{t.colVehicle}</th>
                <th className="p-2.5">{t.colCode}</th>
                <th className="p-2.5">{t.colDesc}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--panel-border)]">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-black/10">
                  <td className="p-2.5 text-[var(--muted-text)] whitespace-nowrap">{inc.timestamp}</td>
                  <td className="p-2.5 whitespace-nowrap">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${formatHelper.getSeverityBadgeClass(
                        inc.severity
                      )}`}
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
  );
};
