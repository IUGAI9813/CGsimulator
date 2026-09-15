"use client";

import React, { useState } from 'react';
import { Plus, Check, Trash2, Cpu, Radio, Shield, Sparkles } from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';
import { VehicleType, DeviceSensor } from '../types/simulator';
import { PRESET_SENSORS } from '../utils/presets';

export const ProvisioningView: React.FC = () => {
  const { vehicles, registerVehicle, deleteVehicle } = useSimulator();

  const [selectedType, setSelectedType] = useState<VehicleType>('ROBOTAXI');
  const [vehicleName, setVehicleName] = useState('');
  const [vin, setVin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Custom sensor selections based on preset
  const [sensorsList, setSensorsList] = useState<DeviceSensor[]>(PRESET_SENSORS['ROBOTAXI']);

  // Update preset when type changes
  const handleTypeChange = (type: VehicleType) => {
    setSelectedType(type);
    setSensorsList(PRESET_SENSORS[type]);
    if (!vehicleName || vehicleName.startsWith('Gangnam') || vehicleName.startsWith('Teheran') || vehicleName.startsWith('COEX')) {
      if (type === 'ROBOTAXI') setVehicleName(`Gangnam RoboTaxi ${Math.floor(100 + Math.random() * 900)}`);
      if (type === 'SHUTTLE') setVehicleName(`Teheran Shuttle S-${Math.floor(10 + Math.random() * 90)}`);
      if (type === 'DELIVERY_POD') setVehicleName(`COEX Delivery Pod P-${Math.floor(100 + Math.random() * 900)}`);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await registerVehicle({
        name: vehicleName || `${selectedType} Unit`,
        type: selectedType,
        vin: vin || `KN4CG2026${selectedType.slice(0, 2)}${Math.floor(10000 + Math.random() * 90000)}`,
        customSensors: sensorsList,
      });

      setSuccessMessage(`Successfully registered ${created.name} (${created.id}) with ${created.sensors.length} sensors!`);
      setVehicleName('');
      setVin('');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleSensor = (sensorId: string) => {
    setSensorsList(prev => {
      const exists = prev.some(s => s.id === sensorId);
      if (exists) {
        if (prev.length <= 1) return prev; // Keep at least one sensor
        return prev.filter(s => s.id !== sensorId);
      } else {
        const originalPreset = PRESET_SENSORS[selectedType].find(s => s.id === sensorId);
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
          Vehicle & Device Sensor Provisioning
        </h2>
        <p className="text-xs text-[var(--muted-text)] font-mono">
          Register new virtual vehicles into CoreGuard network with custom sensor configurations.
        </p>
      </div>

      {successMessage && (
        <div className="p-3 rounded bg-emerald-500/15 border border-emerald-500/40 text-brand-emerald text-xs font-mono flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Form & Preset Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Provisioning Form */}
        <div className="lg:col-span-2 cyber-panel rounded p-5 space-y-5">
          <div className="border-b border-[var(--panel-border)] pb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-cyan">
              Step 1: Vehicle Platform & Credentials
            </span>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Vehicle Type Selector Cards */}
            <div>
              <label className="text-xs font-mono font-bold text-[var(--foreground)] block mb-2">
                Select Vehicle Architecture Profile:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['ROBOTAXI', 'SHUTTLE', 'DELIVERY_POD'] as VehicleType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeChange(type)}
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
                    <p className="text-[10px] mt-1 opacity-75">
                      {type === 'ROBOTAXI' && 'Dual 128ch LiDAR, 360° Vision, RTK GNSS, V2X'}
                      {type === 'SHUTTLE' && 'Quad LiDARs, Dual Radars, 8ch Vision, Dual GNSS'}
                      {type === 'DELIVERY_POD' && 'Solid-State LiDAR, Compact Vision, Micro V2X'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs: Name and VIN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-[var(--muted-text)] block mb-1">
                  Vehicle Name / Identifier:
                </label>
                <input
                  type="text"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  placeholder="e.g. Gangnam RoboTaxi 105"
                  className="w-full px-3 py-2 rounded bg-[var(--input-bg)] border border-[var(--input-border)] text-xs font-mono text-[var(--foreground)] focus:outline-none focus:border-brand-cyan"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[var(--muted-text)] block mb-1">
                  VIN (Vehicle Identification Number):
                </label>
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  placeholder="e.g. KN4CG2026TX10501"
                  className="w-full px-3 py-2 rounded bg-[var(--input-bg)] border border-[var(--input-border)] text-xs font-mono text-[var(--foreground)] focus:outline-none focus:border-brand-cyan"
                />
              </div>
            </div>

            {/* Onboard Device Profile Selection */}
            <div className="pt-2 border-t border-[var(--panel-border)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase text-[var(--foreground)]">
                  Onboard Device Sensor Stack ({sensorsList.length} Active Modules):
                </span>
                <span className="text-[10px] font-mono text-[var(--muted-text)]">
                  Toggle sensors to customize configuration
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {PRESET_SENSORS[selectedType].map((presetSensor) => {
                  const isChecked = sensorsList.some(s => s.id === presetSensor.id);
                  return (
                    <div
                      key={presetSensor.id}
                      onClick={() => handleToggleSensor(presetSensor.id)}
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
                          {presetSensor.mountPosition} // {presetSensor.firmware}
                        </span>
                      </div>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isChecked ? 'bg-brand-cyan border-brand-cyan text-slate-950' : 'border-[var(--panel-border)]'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded bg-brand-cyan hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase font-mono tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{isSubmitting ? 'Registering...' : 'Provision Vehicle (POST /api/v1/simulator/vehicles)'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Quick Provisioning Info & Fleet Overview */}
        <div className="cyber-panel rounded p-5 space-y-4 font-mono text-xs">
          <div className="border-b border-[var(--panel-border)] pb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-brand-cyan" />
            <span className="font-bold uppercase text-[var(--foreground)]">
              Provisioning Guidelines
            </span>
          </div>

          <div className="space-y-3 text-[var(--muted-text)] leading-relaxed">
            <p>
              • Registered vehicles automatically initialize with an onboard telemetry generator running at the global tick rate.
            </p>
            <p>
              • Sensors communicate via the onboard <strong>OBD-CAN Gateway</strong> and <strong>V2X Ingress</strong>.
            </p>
            <p>
              • If HTTP Forwarding is enabled in settings, a real <code className="text-brand-cyan">POST /api/v1/simulator/vehicles</code> payload is dispatched to the target backend.
            </p>
          </div>

          <div className="border-t border-[var(--panel-border)] pt-3">
            <span className="text-[10px] uppercase font-bold text-[var(--muted-text)] block mb-2">
              Registered Fleet Nodes ({vehicles.length})
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
                    onClick={() => deleteVehicle(v.id)}
                    title="Remove Vehicle"
                    className="p-1 rounded text-zinc-500 hover:text-brand-rose transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
