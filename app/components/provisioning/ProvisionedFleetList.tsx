import React from 'react';
import { Trash2 } from 'lucide-react';
import { Vehicle } from '../../types/simulator';
import { useLanguage } from '../../context/LanguageContext';

interface ProvisionedFleetListProps {
  vehicles: Vehicle[];
  onDeleteVehicle: (id: string) => void;
}

export const ProvisionedFleetList: React.FC<ProvisionedFleetListProps> = ({
  vehicles,
  onDeleteVehicle,
}) => {
  const { t } = useLanguage();

  return (
    <div className="border-t border-[var(--panel-border)] pt-3">
      <span className="text-[10px] uppercase font-bold text-[var(--muted-text)] block mb-2">
        {t.registeredFleetNodes} ({vehicles.length})
      </span>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="p-2 rounded bg-[var(--input-bg)] border border-[var(--panel-border)] flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-[var(--foreground)]">{v.name}</div>
              <div className="text-[10px] text-[var(--muted-text)]">
                {v.id} • {v.sensors.length} sensors
              </div>
            </div>
            <button
              onClick={() => onDeleteVehicle(v.id)}
              title={t.removeVehicle}
              className="p-1 rounded text-zinc-500 hover:text-brand-rose transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
