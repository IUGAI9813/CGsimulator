"use client";

import React from 'react';
import { Search, X, LayoutList, LayoutGrid, Flame } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export type FleetFilterType = 'ALL' | 'RUNNING' | 'ATTACK' | 'STOPPED';
export type ViewMode = 'table' | 'cards';

interface FleetFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: FleetFilterType;
  onFilterChange: (filter: FleetFilterType) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (num: number) => void;
  totalCount: number;
  runningCount: number;
  attackCount: number;
  stoppedCount: number;
}

export const FleetFilterToolbar: React.FC<FleetFilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onFilterChange,
  viewMode,
  onViewModeChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalCount,
  runningCount,
  attackCount,
  stoppedCount,
}) => {
  const { t } = useLanguage();

  return (
    <div className="cyber-panel p-4 rounded space-y-4 font-mono">
      {/* Top Row: Title, View Mode & Rows Per Page */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[var(--foreground)] tracking-tight">
            {t.fleetMatrixTitle}
          </h2>
          <p className="text-xs text-[var(--muted-text)]">
            {t.fleetMatrixDesc}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-[var(--input-bg)] p-0.5 rounded border border-[var(--panel-border)]">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-brand-cyan text-slate-950 shadow-sm'
                  : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
              }`}
              title="Table View"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-brand-cyan text-slate-950 shadow-sm'
                  : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>

          {/* Rows Per Page */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[var(--muted-text)]">Rows:</span>
            {[6, 10, 25].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onItemsPerPageChange(size)}
                className={`px-2 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  itemsPerPage === size
                    ? 'bg-brand-cyan text-slate-950 shadow-sm'
                    : 'bg-[var(--input-bg)] text-[var(--muted-text)] hover:text-[var(--foreground)] border border-[var(--panel-border)]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Input & Status Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--panel-border)]">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[var(--muted-text)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchVehiclesPlaceholder}
            className="w-full pl-9 pr-8 py-2 rounded bg-[var(--input-bg)] border border-[var(--input-border)] text-xs text-[var(--foreground)] focus:border-brand-cyan focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-text)] hover:text-[var(--foreground)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => onFilterChange('ALL')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-all cursor-pointer font-bold ${
              statusFilter === 'ALL'
                ? 'bg-zinc-800 text-white border border-zinc-600'
                : 'bg-[var(--input-bg)] text-[var(--muted-text)] hover:text-[var(--foreground)] border border-[var(--panel-border)]'
            }`}
          >
            <span>{t.filterAll}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30">{totalCount}</span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('RUNNING')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-all cursor-pointer font-bold ${
              statusFilter === 'RUNNING'
                ? 'bg-emerald-600 text-white border border-emerald-500'
                : 'bg-[var(--input-bg)] text-[var(--muted-text)] hover:text-brand-emerald border border-[var(--panel-border)]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-brand-emerald" />
            <span>{t.filterRunning}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30">{runningCount}</span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('ATTACK')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-all cursor-pointer font-bold ${
              statusFilter === 'ATTACK'
                ? 'bg-rose-600 text-white border border-rose-500'
                : 'bg-[var(--input-bg)] text-[var(--muted-text)] hover:text-brand-rose border border-[var(--panel-border)]'
            }`}
          >
            <Flame className="w-3 h-3 text-brand-rose" />
            <span>{t.filterUnderAttack}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30">{attackCount}</span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('STOPPED')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-all cursor-pointer font-bold ${
              statusFilter === 'STOPPED'
                ? 'bg-zinc-700 text-white border border-zinc-500'
                : 'bg-[var(--input-bg)] text-[var(--muted-text)] hover:text-[var(--foreground)] border border-[var(--panel-border)]'
            }`}
          >
            <span>{t.filterStopped}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30">{stoppedCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
