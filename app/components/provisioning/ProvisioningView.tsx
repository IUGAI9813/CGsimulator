"use client";

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Check, AlertCircle, Send } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { VehicleType, DeviceSensor, Vehicle, VehicleRegistrationPayload, VehicleDevicePayload } from '../../types/simulator';
import { PRESET_SENSORS, INITIAL_VEHICLES, VEHICLE_PROFILE_DEFAULTS } from '../../utils/presets';
import { VehicleProfilePicker } from './VehicleProfilePicker';
import { SensorStackSelector } from './SensorStackSelector';
import { RegistrationPayloadPreview } from './RegistrationPayloadPreview';
import { RegistrationGuidelines } from './RegistrationGuidelines';
import { FormFieldRenderer, FieldConfig } from '../common/FormFieldRenderer';
import { useRegisterVehicleMutation } from '../../hooks/api/useVehiclesQuery';
import { useSimulator } from '../../context/SimulatorContext';
import { log } from 'node:console';

export interface ProvisioningFormData {
  vehicleId: string;
  model: string;
  vin: string;
  status: string;
  speedLimit: number;
  assignedZone: string;
  firmwareVersion: string;
  latitude: number;
  longitude: number;
}

interface ProvisioningViewProps {
  vehicles?: Vehicle[];
  onProvisionSuccess?: (payload: VehicleRegistrationPayload) => void;
  onDeleteVehicle?: (id: string) => void;
}

export const ProvisioningView: React.FC<ProvisioningViewProps> = ({
  vehicles = INITIAL_VEHICLES,
  onProvisionSuccess,
  onDeleteVehicle,
}) => {
  const { t } = useLanguage();
  const { config } = useSimulator();
  const registerMutation = useRegisterVehicleMutation(config.targetApiUrl);

  const [selectedType, setSelectedType] = useState<VehicleType>('ROBOTAXI');
  const [sensorsList, setSensorsList] = useState<DeviceSensor[]>(PRESET_SENSORS['ROBOTAXI']);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProvisioningFormData>({
    defaultValues: {
      vehicleId: 'ROBOTAXI-105',
      model: VEHICLE_PROFILE_DEFAULTS.ROBOTAXI.model,
      vin: 'KN4CG2026TX10501',
      status: 'VEH_ACTIVE',
      speedLimit: VEHICLE_PROFILE_DEFAULTS.ROBOTAXI.speedLimit,
      assignedZone: VEHICLE_PROFILE_DEFAULTS.ROBOTAXI.assignedZone,
      firmwareVersion: VEHICLE_PROFILE_DEFAULTS.ROBOTAXI.firmwareVersion,
      latitude: VEHICLE_PROFILE_DEFAULTS.ROBOTAXI.latitude,
      longitude: VEHICLE_PROFILE_DEFAULTS.ROBOTAXI.longitude,
    },
  });

  const formValues = watch();

  const handleTypeChange = (type: VehicleType) => {
    setSelectedType(type);
    setSensorsList(PRESET_SENSORS[type]);
    const defaults = VEHICLE_PROFILE_DEFAULTS[type];

    if (type === 'ROBOTAXI') {
      const num = Math.floor(100 + Math.random() * 900);
      setValue('vehicleId', `ROBOTAXI-${num}`);
      setValue('model', defaults.model);
      setValue('vin', `KN4CG2026TX${num}01`);
    } else if (type === 'SHUTTLE') {
      const num = Math.floor(10 + Math.random() * 90);
      setValue('vehicleId', `SHUTTLE-0${num}`);
      setValue('model', defaults.model);
      setValue('vin', `KN4CG2026SH0${num}99`);
    } else if (type === 'DELIVERY_POD') {
      const num = Math.floor(100 + Math.random() * 900);
      setValue('vehicleId', `POD-${num}`);
      setValue('model', defaults.model);
      setValue('vin', `KN4CG2026DP${num}12`);
    }

    setValue('status', defaults.status);
    setValue('speedLimit', defaults.speedLimit);
    setValue('assignedZone', defaults.assignedZone);
    setValue('firmwareVersion', defaults.firmwareVersion);
    setValue('latitude', defaults.latitude);
    setValue('longitude', defaults.longitude);
  };

  // Schema-driven form fields configuration array
  const formFields: FieldConfig<ProvisioningFormData>[] = useMemo(
    () => [

      {
        name: 'model',
        label: t.modelLabel,
        type: 'text',
        placeholder: 'e.g. Hyundai IONIQ 5 Robotaxi',
        validation: { required: 'Model is required' },
      },
      {
        name: 'vin',
        label: t.vinLabel,
        type: 'text',
        placeholder: 'e.g. KN4CG2026TX10501',
        validation: {
          required: 'VIN is required',
          minLength: { value: 6, message: 'Minimum 6 characters' },
        },
      },
      {
        name: 'status',
        label: t.initialStatusLabel,
        type: 'select',
        options: [
          { label: 'VEH_ACTIVE (Active Operational)', value: 'VEH_ACTIVE' },
          { label: 'VEH_STANDBY (Standby / Idle)', value: 'VEH_STANDBY' },
          { label: 'VEH_MAINTENANCE (Diagnostic Mode)', value: 'VEH_MAINTENANCE' },
        ],
        validation: { required: true },
      },
      {
        name: 'speedLimit',
        label: t.speedLimitLabel,
        type: 'number',
        step: 5,
        min: 10,
        max: 150,
        placeholder: '60.0',
        validation: { required: 'Speed limit required' },
      },
      {
        name: 'assignedZone',
        label: t.assignedZoneLabel,
        type: 'text',
        placeholder: 'e.g. Gangnam District',
        validation: { required: 'Zone is required' },
      },
      {
        name: 'firmwareVersion',
        label: t.firmwareVersionLabel,
        type: 'text',
        placeholder: 'v2.4.1',
        validation: { required: 'Firmware required' },
      },
      {
        name: 'latitude',
        label: t.latitudeLabel,
        type: 'number',
        step: 0.0001,
        placeholder: '37.4979',
        validation: { required: 'Latitude required' },
      },
      {
        name: 'longitude',
        label: t.longitudeLabel,
        type: 'number',
        step: 0.0001,
        placeholder: '127.0276',
        validation: { required: 'Longitude required' },
      },
    ],
    [t]
  );

  // Construct real-time JSON payload for preview and submission
  const livePayload: VehicleRegistrationPayload = useMemo(() => {
    const devices: VehicleDevicePayload[] = sensorsList.map((s) => ({
      deviceId: s.deviceId || `DEV-${formValues.vehicleId || 'UNIT'}-${s.type}-${s.id}`,
      deviceType: s.deviceType || `DEV_${s.type}`,
      serialNumber: s.serialNumber || `SN-${s.type}-00000`,
      status: s.deviceStatus || (s.status === 'ONLINE' ? 'DEV_ONLINE' : s.status === 'DEGRADED' ? 'DEV_DEGRADED' : 'DEV_OFFLINE'),
      firmwareVersion: s.firmwareVersion || s.firmware,
    }));

    return {
      vehicleType: selectedType,
      vin: formValues.vin || 'KN4CG2026TX10501',
      model: formValues.model || 'Hyundai IONIQ 5 Robotaxi',
      status: formValues.status || 'VEH_ACTIVE',
      speedLimit: Number(formValues.speedLimit) || 60.0,
      assignedZone: formValues.assignedZone || 'Gangnam District',
      firmwareVersion: formValues.firmwareVersion || 'v2.4.1',
      latitude: Number(formValues.latitude) || 37.4979,
      longitude: Number(formValues.longitude) || 127.0276,
      devices,
    };
  }, [formValues, selectedType, sensorsList]);

  const onSubmit = async (data: ProvisioningFormData) => {
    setErrorMessage(null);
    try {
      if (onProvisionSuccess) {
        onProvisionSuccess(livePayload);
      }

      console.log(livePayload);


      if (config.forwardHttp) {
        await registerMutation.mutateAsync(livePayload);
      }

      setSuccessMessage(`Vehicle ${data.vehicleId} (${data.model}) registered successfully!`);

      // Regenerate random identifiers for next input
      const num = Math.floor(100 + Math.random() * 900);
      setValue('vehicleId', `${selectedType}-${num}`);
      setValue('vin', `KN4CG2026${selectedType.substring(0, 2)}${num}01`);

      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to register vehicle payload');
      setTimeout(() => setErrorMessage(null), 5000);
    }
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

      {errorMessage && (
        <div className="p-3 rounded bg-rose-500/15 border border-rose-500/40 text-brand-rose text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Form on Left, Live JSON & Fleet on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 cols): Provisioning Form */}
        <div className="lg:col-span-7 cyber-panel rounded p-5 space-y-5">
          <div className="border-b border-[var(--panel-border)] pb-3 flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-cyan">
              {t.step1Title}
            </span>
            <span className="text-[10px] font-mono text-[var(--muted-text)]">
              POST /api/v1/simulator/vehicles
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Vehicle Profile Picker */}
            <VehicleProfilePicker
              selectedType={selectedType}
              onSelectType={handleTypeChange}
            />

            {/* Dynamic Form Fields via Case/Switch Component */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formFields.map((field) => (
                <FormFieldRenderer
                  key={field.name}
                  field={field}
                  register={register}
                  errors={errors}
                />
              ))}
            </div>

            {/* Sensor Stack Selection */}
            <SensorStackSelector
              selectedType={selectedType}
              sensorsList={sensorsList}
              onToggleSensor={handleToggleSensor}
            />

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-between border-t border-[var(--panel-border)]">
              <span className="text-[11px] font-mono text-[var(--muted-text)]">
                {livePayload.devices.length} Devices Attached
              </span>
              <button
                type="submit"
                disabled={isSubmitting || registerMutation.isPending}
                className="px-5 py-2.5 rounded bg-brand-cyan hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase font-mono tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-sm disabled:opacity-60"
              >
                {registerMutation.isPending ? (
                  <>
                    <Send className="w-4 h-4 animate-pulse" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>{t.btnProvisionVehicle}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right (5 cols): Live Payload Preview & Guidelines */}
        <div className="lg:col-span-5 space-y-4">
          <RegistrationPayloadPreview payload={livePayload} />
          <RegistrationGuidelines
            vehicles={vehicles}
            onDeleteVehicle={onDeleteVehicle || (() => { })}
          />
        </div>
      </div>
    </div>
  );
};
