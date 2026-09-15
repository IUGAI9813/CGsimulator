import React from 'react';
import { Check } from 'lucide-react';
import { DeviceSensor, VehicleType } from '../../types/simulator';
import { PRESET_SENSORS } from '../../utils/presets';
import { useLanguage } from '../../context/LanguageContext';

interface SensorStackSelectorProps {
  selectedType: VehicleType;
  sensorsList: DeviceSensor[];
  onToggleSensor: (sensorId: string) => void;
}

export const SensorStackSelector: React.FC<SensorStackSelectorProps> = ({
  selectedType,
  sensorsList,
  onToggleSensor,
}) => {
  const { t } = useLanguage();

  return (
    <div className="pt-2 border-t border-[var(--panel-border)]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono font-bold uppercase text-[var(--foreground)]">
          {t.onboardSensorStack} ({sensorsList.length} Active Modules):
        </span>
        <span className="text-[10px] font-mono text-[var(--muted-text)]">
          {t.toggleSensorHint}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
        {PRESET_SENSORS[selectedType].map((presetSensor) => {
          const isChecked = sensorsList.some((s) => s.id === presetSensor.id);
          return (
            <div
              key={presetSensor.id}
              onClick={() => onToggleSensor(presetSensor.id)}
              className={`p-2 rounded border flex items-center justify-between text-xs font-mono cursor-pointer transition-all ${
                isChecked
                  ? 'border-brand-cyan/40 bg-brand-cyan/5 text-[var(--foreground)]'
                  : 'border-[var(--panel-border)] bg-[var(--input-bg)] text-[var(--muted-text)] opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="text-brand-cyan">{presetSensor.id}</span>
                  <span className="text-[11px]">{presetSensor.name}</span>
                </div>
                <span className="text-[10px] text-[var(--muted-text)] block">
                  {presetSensor.mountPosition} , {presetSensor.firmware}
                </span>
              </div>
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center ${
                  isChecked
                    ? 'bg-brand-cyan border-brand-cyan text-slate-950'
                    : 'border-[var(--panel-border)]'
                }`}
              >
                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
