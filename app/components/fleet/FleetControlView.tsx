"use client";

import React, { useState, useMemo } from 'react';
import { Radio, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSimulator } from '../../context/SimulatorContext';
import { Vehicle, LifecycleStatus, AttackInjections } from '../../types/simulator';
import { INITIAL_VEHICLES } from '../../utils/presets';
import { FleetKpiSummary } from './FleetKpiSummary';
import { FleetApiKeyBar } from './FleetApiKeyBar';
import { FleetFilterToolbar, FleetFilterType, ViewMode } from './FleetFilterToolbar';
import { FleetTable } from './FleetTable';
import { FleetPagination } from './FleetPagination';
import { VehicleCard } from './VehicleCard';
import { VehicleInspectorDrawer } from './VehicleInspectorDrawer';

interface FleetControlViewProps {
  vehicles?: Vehicle[];
  onSetLifecycleStatus?: (id: string, status: LifecycleStatus) => void;
  onToggleInjection?: (vehicleId: string, key: keyof AttackInjections) => void;
  onResetInjections?: (vehicleId: string) => void;
  onTriggerTimeout?: (vehicleId: string) => void;
}

export const FleetControlView: React.FC<FleetControlViewProps> = ({
  vehicles = INITIAL_VEHICLES,
  onSetLifecycleStatus = () => {},
  onToggleInjection = () => {},
  onResetInjections = () => {},
  onTriggerTimeout = () => {},
}) => {
  const { t } = useLanguage();
  const { config, updateConfig } = useSimulator();

  // Search & Filter & Pagination & View States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FleetFilterType>('ALL');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Global counts
  const runningCount = vehicles.filter((v) => v.lifecycleStatus === 'RUNNING').length;
  const attackCount = vehicles.reduce((acc, v) => {
    const i = v.injections;
    return (
      acc +
      (i.lidarFailure || i.v2xLatencySpike || i.gpsSpoofing || i.cameraOffline || i.canBusInjection
        ? 1
        : 0)
    );
  }, 0);
  const stoppedCount = vehicles.filter((v) => v.lifecycleStatus !== 'RUNNING').length;

  // Selected vehicle for inspector drawer
  const selectedVehicle = useMemo(() => {
    if (!selectedVehicleId) return null;
    return vehicles.find((v) => v.id === selectedVehicleId) || null;
  }, [vehicles, selectedVehicleId]);

  // Filtered vehicles memo
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = v.id.toLowerCase().includes(q);
        const matchesVin = (v.vin || '').toLowerCase().includes(q);
        const matchesModel = (v.model || '').toLowerCase().includes(q);
        const matchesName = (v.name || '').toLowerCase().includes(q);
        const matchesZone = (v.assignedZone || '').toLowerCase().includes(q);
        if (!matchesId && !matchesVin && !matchesModel && !matchesName && !matchesZone) {
          return false;
        }
      }

      if (statusFilter === 'RUNNING') return v.lifecycleStatus === 'RUNNING';
      if (statusFilter === 'ATTACK') {
        const i = v.injections;
        return (
          i.lidarFailure ||
          i.v2xLatencySpike ||
          i.gpsSpoofing ||
          i.cameraOffline ||
          i.canBusInjection
        );
      }
      if (statusFilter === 'STOPPED') return v.lifecycleStatus !== 'RUNNING';

      return true;
    });
  }, [vehicles, searchQuery, statusFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedVehicles = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(start, start + itemsPerPage);
  }, [filteredVehicles, safeCurrentPage, itemsPerPage]);

  // Actions
  const handleStartAll = () => {
    if (!config.telemetryApiKey.trim()) {
      setAuthError(t.apiKeyRequiredWarning);
      setTimeout(() => setAuthError(null), 5000);
      return;
    }
    setAuthError(null);
    vehicles.forEach((v) => onSetLifecycleStatus(v.id, 'RUNNING'));
  };

  const handleStopAll = () => {
    vehicles.forEach((v) => onSetLifecycleStatus(v.id, 'STOPPED'));
  };

  const handleSingleVehicleStart = (vehicleId: string) => {
    if (!config.telemetryApiKey.trim()) {
      setAuthError(t.apiKeyRequiredWarning);
      setTimeout(() => setAuthError(null), 5000);
      return;
    }
    setAuthError(null);
    onSetLifecycleStatus(vehicleId, 'RUNNING');
  };

  return (
    <div className="space-y-6 font-mono">
      {/* 1. KPI Metric Summary Cards */}
      <FleetKpiSummary
        totalNodesCount={vehicles.length}
        runningCount={runningCount}
        attackCount={attackCount}
      />

      {/* 2. Telemetry Ingest API Key Bar & Master Start/Stop */}
      <FleetApiKeyBar
        apiKey={config.telemetryApiKey}
        onApiKeyChange={(key) => updateConfig({ telemetryApiKey: key })}
        onResetToDemo={() => updateConfig({ telemetryApiKey: 'cg_demo_telemetry_key_2026' })}
        onStartAll={handleStartAll}
        onStopAll={handleStopAll}
        runningCount={runningCount}
        totalCount={vehicles.length}
        authError={authError}
      />

      {/* 3. Search, Filter, and View Mode Toolbar */}
      <FleetFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onFilterChange={(f) => {
          setStatusFilter(f);
          setCurrentPage(1);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(n) => {
          setItemsPerPage(n);
          setCurrentPage(1);
        }}
        totalCount={vehicles.length}
        runningCount={runningCount}
        attackCount={attackCount}
        stoppedCount={stoppedCount}
      />

      {/* 4. Fleet Data Display (Table or Cards) */}
      <div className="space-y-4">
        {vehicles.length === 0 ? (
          <div className="cyber-panel p-12 text-center rounded space-y-3">
            <Radio className="w-8 h-8 text-[var(--muted-text)] mx-auto opacity-50" />
            <p className="text-sm text-[var(--muted-text)]">{t.noVehiclesTitle}</p>
            <p className="text-xs text-[var(--muted-text)]">{t.noVehiclesDesc}</p>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="cyber-panel p-12 text-center rounded space-y-3">
            <Search className="w-8 h-8 text-[var(--muted-text)] mx-auto opacity-50" />
            <p className="text-sm text-[var(--foreground)] font-bold">{t.noFilteredResults}</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
              className="text-xs text-brand-cyan hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : viewMode === 'table' ? (
          <FleetTable
            vehicles={paginatedVehicles}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={setSelectedVehicleId}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {paginatedVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onSetLifecycleStatus={(id, status) => {
                  if (status === 'RUNNING') handleSingleVehicleStart(id);
                  else onSetLifecycleStatus(id, status);
                }}
                onToggleInjection={onToggleInjection}
                onResetInjections={onResetInjections}
                onTriggerTimeout={onTriggerTimeout}
              />
            ))}
          </div>
        )}

        {/* 5. Pagination Bar */}
        <FleetPagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredVehicles.length}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* 6. Slide-out Inspector Drawer */}
      <VehicleInspectorDrawer
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicleId(null)}
        onSetLifecycleStatus={(id, status) => {
          if (status === 'RUNNING') handleSingleVehicleStart(id);
          else onSetLifecycleStatus(id, status);
        }}
        onToggleInjection={onToggleInjection}
        onResetInjections={onResetInjections}
        onTriggerTimeout={onTriggerTimeout}
      />
    </div>
  );
};
