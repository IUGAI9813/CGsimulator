"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Check, Cpu, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { VehicleType, DeviceSensor, Vehicle } from '../../types/simulator';
import { PRESET_SENSORS, INITIAL_VEHICLES } from '../../utils/presets';
import { VehicleProfilePicker } from './VehicleProfilePicker';
import { SensorStackSelector } from './SensorStackSelector';
import { ProvisionedFleetList } from './ProvisionedFleetList';

export interface ProvisioningFormData {
  vehicleName: string;
  vin: string;
}

interface ProvisioningViewProps {
  vehicles?: Vehicle[];
  onProvisionSuccess?: (data: ProvisioningFormData & { type: VehicleType; sensors: DeviceSensor[] }) => void;
  onDeleteVehicle?: (id: string) => void;
}

export const ProvisioningView: React.FC<ProvisioningViewProps> = ({
  vehicles = INITIAL_VEHICLES,
  onProvisionSuccess,
  onDeleteVehicle,
}) => {
  const { t } = useLanguage();

  const [selectedType, setSelectedType] = useState<VehicleType>('ROBOTAXI');
  const [sensorsList, setSensorsList] = useState<DeviceSensor[]>(PRESET_SENSORS['ROBOTAXI']);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProvisioningFormData>({
    defaultValues: {
      vehicleName: 'Gangnam RoboTaxi 105',
      vin: 'KN4CG2026TX10501',
    },
  });

  const handleTypeChange = (type: VehicleType) => {
    setSelectedType(type);
    setSensorsList(PRESET_SENSORS[type]);

    if (type === 'ROBOTAXI') {
      const num = Math.floor(100 + Math.random() * 900);
      setValue('vehicleName', `Gangnam RoboTaxi ${num}`);
      setValue('vin', `KN4CG2026TX${num}01`);
    } else if (type === 'SHUTTLE') {
      const num = Math.floor(10 + Math.random() * 90);
      setValue('vehicleName', `Teheran Shuttle S-${num}`);
      setValue('vin', `KN4CG2026SH0${num}99`);
    } else if (type === 'DELIVERY_POD') {
      const num = Math.floor(100 + Math.random() * 900);
      setValue('vehicleName', `COEX Delivery Pod P-${num}`);
      setValue('vin', `KN4CG2026DP${num}12`);
    }
  };

  const onSubmit = async (data: ProvisioningFormData) => {
    if (onProvisionSuccess) {
      onProvisionSuccess({
        ...data,
        type: selectedType,
        sensors: sensorsList,
      });
    }

    setSuccessMessage(`Vehicle ${data.vehicleName} configured successfully!`);
    reset({
      vehicleName: '',
      vin: '',
    });
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleToggleSensor = (sensorId: string) => {
    setSensorsList((prev) => {
      const exists = prev.some((s) => s.id === sensorId);
      if (exists) {
        if (prev.length <= 1) return prev;
        return prev.filter((s) => s.id !== sensorId);
      } else {
        const originalPreset = PRESET_SENSORS[selectedType].find((s) => s.id === sensorId);
        if (originalPreset) {
          return [...prev, originalPreset];
        }
        return prev;
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <h2 className="text-base font-bold text-[var(--foreground)] tracking-tight">
          {t.provisioningTitle}
        </h2>
        <p className="text-xs text-[var(--muted-text)] font-mono">
          {t.provisioningDesc}
        </p>
      </div>

      {successMessage && (
        <div className="p-3 rounded bg-emerald-500/15 border border-emerald-500/40 text-brand-emerald text-xs font-mono flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Provisioning Form */}
        <div className="lg:col-span-2 cyber-panel rounded p-5 space-y-5">
          <div className="border-b border-[var(--panel-border)] pb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-cyan">
              {t.step1Title}
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Vehicle Profile Picker */}
            <VehicleProfilePicker
              selectedType={selectedType}
              onSelectType={handleTypeChange}
            />

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-[var(--muted-text)] block mb-1">
                  {t.vehicleNameLabel}
                </label>
                <input
                  {...register('vehicleName', {
                    required: 'Vehicle name is required',
                    minLength: { value: 3, message: 'Minimum 3 characters required' },
                  })}
                  type="text"
                  placeholder="e.g. Gangnam RoboTaxi 105"
                  className={`w-full px-3 py-2 rounded bg-[var(--input-bg)] border text-xs font-mono text-[var(--foreground)] focus:outline-none transition-colors ${
                    errors.vehicleName
                      ? 'border-brand-rose focus:border-brand-rose'
                      : 'border-[var(--input-border)] focus:border-brand-cyan'
                  }`}
                />
                {errors.vehicleName && (
                  <p className="text-[10px] text-brand-rose font-mono mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.vehicleName.message}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-mono text-[var(--muted-text)] block mb-1">
                  {t.vinLabel}
                </label>
                <input
                  {...register('vin', {
                    required: 'VIN identifier is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                  type="text"
                  placeholder="e.g. KN4CG2026TX10501"
                  className={`w-full px-3 py-2 rounded bg-[var(--input-bg)] border text-xs font-mono text-[var(--foreground)] focus:outline-none transition-colors ${
                    errors.vin
                      ? 'border-brand-rose focus:border-brand-rose'
                      : 'border-[var(--input-border)] focus:border-brand-cyan'
                  }`}
                />
                {errors.vin && (
                  <p className="text-[10px] text-brand-rose font-mono mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.vin.message}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Sensor Stack Selection */}
            <SensorStackSelector
              selectedType={selectedType}
              sensorsList={sensorsList}
              onToggleSensor={handleToggleSensor}
            />

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded bg-brand-cyan hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase font-mono tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-sm disabled:opacity-60"
              >
                <Plus className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : t.btnProvisionVehicle}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Guidelines & Fleet List */}
        <div className="cyber-panel rounded p-5 space-y-4 font-mono text-xs">
          <div className="border-b border-[var(--panel-border)] pb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-brand-cyan" />
            <span className="font-bold uppercase text-[var(--foreground)]">
              {t.provisioningGuidelines}
            </span>
          </div>

          <div className="space-y-3 text-[var(--muted-text)] leading-relaxed">
            <p>
              • Form state and validation are handled automatically via <strong>React Hook Form</strong>.
            </p>
            <p>
              • Connect your API call using <strong>Axios</strong> or React Query mutations.
            </p>
          </div>

          <ProvisionedFleetList
            vehicles={vehicles}
            onDeleteVehicle={onDeleteVehicle || (() => {})}
          />
        </div>
      </div>
    </div>
  );
};
