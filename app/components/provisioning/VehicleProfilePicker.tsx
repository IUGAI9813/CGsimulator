import React from 'react';
import { Check } from 'lucide-react';
import { VehicleType } from '../../types/simulator';
import { useLanguage } from '../../context/LanguageContext';

interface VehicleProfilePickerProps {
  selectedType: VehicleType;
  onSelectType: (type: VehicleType) => void;
}

export const VehicleProfilePicker: React.FC<VehicleProfilePickerProps> = ({
  selectedType,
  onSelectType,
}) => {
  const { t } = useLanguage();

  const profiles: { type: VehicleType; desc: string }[] = [
    { type: 'ROBOTAXI', desc: t.robotaxiDesc },
    { type: 'SHUTTLE', desc: t.shuttleDesc },
    { type: 'DELIVERY_POD', desc: t.podDesc },
  ];

  return (
    <div>
      <label className="text-xs font-mono font-bold text-[var(--foreground)] block mb-2">
        {t.selectArchProfile}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {profiles.map(({ type, desc }) => (
          <button
            key={type}
            type="button"
            onClick={() => onSelectType(type)}
            className={`p-3 rounded border text-left font-mono transition-all cursor-pointer ${
              selectedType === type
                ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan shadow-sm'
                : 'border-[var(--panel-border)] bg-[var(--input-bg)] text-[var(--muted-text)] hover:border-[var(--panel-border-hover)] hover:text-[var(--foreground)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs">{type}</span>
              {selectedType === type && <Check className="w-3.5 h-3.5" />}
            </div>
            <p className="text-[10px] mt-1 opacity-75">{desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
