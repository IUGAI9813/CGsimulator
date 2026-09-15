"use client";

import React from 'react';
import { Cpu } from 'lucide-react';
import { Vehicle } from '../../types/simulator';
import { useLanguage } from '../../context/LanguageContext';
import { ProvisionedFleetList } from './ProvisionedFleetList';

interface RegistrationGuidelinesProps {
  vehicles: Vehicle[];
  onDeleteVehicle: (id: string) => void;
}

export const RegistrationGuidelines: React.FC<RegistrationGuidelinesProps> = ({
  vehicles,
  onDeleteVehicle,
}) => {
  const { t } = useLanguage();

  return (
    <div className="cyber-panel rounded p-4 space-y-3 font-mono text-xs">
      <div className="border-b border-[var(--panel-border)] pb-2 flex items-center gap-2">
        <Cpu className="w-4 h-4 text-brand-cyan" />
        <span className="font-bold uppercase text-[var(--foreground)]">
          {t.provisioningGuidelines}
        </span>
      </div>

      <div className="space-y-1.5 text-[11px] text-[var(--muted-text)] leading-relaxed">
        <p>• Form validates identifiers & serial numbers via <strong>React Hook Form</strong>.</p>
        <p>• Dispatches DTO payload directly to <strong>CoreGuard SOC Server</strong>.</p>
      </div>

      <ProvisionedFleetList
        vehicles={vehicles}
        onDeleteVehicle={onDeleteVehicle}
      />
    </div>
  );
};
