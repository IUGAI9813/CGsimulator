import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';
import { TelemetryPayload } from '../../types/simulator';
import { useLanguage } from '../../context/LanguageContext';

interface JsonPayloadViewerProps {
  latestPayload: TelemetryPayload | null;
  totalLogsCount: number;
  onClearLogs: () => void;
  className?: string;
}

export const JsonPayloadViewer: React.FC<JsonPayloadViewerProps> = ({
  latestPayload,
  totalLogsCount,
  onClearLogs,
  className = '',
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    if (latestPayload) {
      navigator.clipboard.writeText(JSON.stringify(latestPayload, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`cyber-panel rounded flex flex-col justify-between ${className}`}>
      <div>
        <div className="cyber-panel-header">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-brand-cyan" />
            <span className="text-xs font-mono font-bold uppercase text-[var(--foreground)]">
              {t.latestPayloadTitle}
            </span>
          </div>
          {latestPayload && (
            <button
              onClick={handleCopyJson}
              className="text-[10px] font-mono text-[var(--muted-text)] hover:text-brand-cyan flex items-center gap-1 cursor-pointer"
              title="Copy JSON Payload"
            >
              {copied ? <Check className="w-3 h-3 text-brand-emerald" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? t.copied : t.copy}</span>
            </button>
          )}
        </div>

        {/* Code Content */}
        <div className="p-3">
          {latestPayload ? (
            <pre className="p-3 rounded bg-[var(--input-bg)] border border-[var(--input-border)] text-[11px] font-mono text-[var(--foreground)] overflow-x-auto max-h-80 leading-relaxed tabular-nums">
              {JSON.stringify(latestPayload, null, 2)}
            </pre>
          ) : (
            <div className="p-12 text-center text-xs font-mono text-[var(--muted-text)]">
              Waiting for first telemetry tick...
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[var(--panel-border)] bg-[var(--panel-header-bg)] flex items-center justify-between text-xs font-mono">
        <span className="text-[var(--muted-text)]">
          {t.bufferedPackets} <strong className="text-[var(--foreground)]">{totalLogsCount}</strong>
        </span>
        <button
          onClick={onClearLogs}
          className="text-[10px] text-[var(--muted-text)] hover:text-brand-rose underline cursor-pointer"
        >
          {t.clearBuffer}
        </button>
      </div>
    </div>
  );
};
