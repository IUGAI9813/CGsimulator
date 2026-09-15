import { LifecycleStatus } from '../types/simulator';

export const formatHelper = {
  /**
   * Returns Tailwind CSS classes for severity level badges
   */
  getSeverityBadgeClass(severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO'): string {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/15 text-brand-rose border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-500/15 text-brand-amber border-amber-500/40';
      case 'MEDIUM':
        return 'bg-cyan-500/15 text-brand-cyan border-cyan-500/40';
      case 'INFO':
      default:
        return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';
    }
  },

  /**
   * Returns Tailwind CSS classes for lifecycle status badges
   */
  getLifecycleBadgeClass(status: LifecycleStatus): string {
    switch (status) {
      case 'RUNNING':
        return 'bg-emerald-500/10 text-brand-emerald border-emerald-500/30';
      case 'PAUSED':
        return 'bg-amber-500/10 text-brand-amber border-amber-500/30';
      case 'OFFLINE':
        return 'bg-rose-500/15 text-brand-rose border-rose-500/40 animate-pulse';
      case 'STOPPED':
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30';
    }
  },

  /**
   * Formats current time into a clean locale string
   */
  formatTime(date: Date = new Date()): string {
    return date.toLocaleTimeString();
  },
};
