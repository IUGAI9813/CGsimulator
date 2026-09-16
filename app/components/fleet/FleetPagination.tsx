"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FleetPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const FleetPagination: React.FC<FleetPaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
}) => {
  const { t } = useLanguage();

  if (totalItems === 0) return null;

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="cyber-panel p-4 rounded flex flex-wrap items-center justify-between gap-4 font-mono text-xs shadow-sm">
      <div className="text-[var(--muted-text)]">
        {t.showing} <strong className="text-[var(--foreground)]">{startIdx}</strong> –{' '}
        <strong className="text-[var(--foreground)]">{endIdx}</strong> {t.of}{' '}
        <strong className="text-[var(--foreground)]">{totalItems}</strong> {t.units}
      </div>

      {/* Page Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded bg-[var(--input-bg)] border border-[var(--panel-border)] text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-cyan cursor-pointer transition-all"
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-2.5 py-1.5 rounded bg-[var(--input-bg)] border border-[var(--panel-border)] text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-cyan cursor-pointer transition-all flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{t.prevPage}</span>
        </button>

        <span className="px-3 py-1.5 rounded bg-[var(--panel-header-bg)] border border-[var(--panel-border)] text-[var(--foreground)] font-bold">
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-2.5 py-1.5 rounded bg-[var(--input-bg)] border border-[var(--panel-border)] text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-cyan cursor-pointer transition-all flex items-center gap-1"
        >
          <span className="hidden sm:inline">{t.nextPage}</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded bg-[var(--input-bg)] border border-[var(--panel-border)] text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-cyan cursor-pointer transition-all"
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
