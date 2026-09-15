"use client";

import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';
import { VehicleRegistrationPayload } from '../../types/simulator';
import { useLanguage } from '../../context/LanguageContext';

interface RegistrationPayloadPreviewProps {
  payload: VehicleRegistrationPayload;
}

export const RegistrationPayloadPreview: React.FC<RegistrationPayloadPreviewProps> = ({ payload }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const payloadSize = JSON.stringify(payload).length;

  return (
    <div className="cyber-panel rounded flex flex-col justify-between">
      <div className="cyber-panel-header">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-brand-cyan" />
          <span className="text-xs font-mono font-bold uppercase text-[var(--foreground)]">
            {t.jsonPayloadPreview}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopyJson}
          className="text-[10px] font-mono text-[var(--muted-text)] hover:text-brand-cyan flex items-center gap-1 cursor-pointer transition-colors"
          title="Copy JSON Payload"
        >
          {copied ? <Check className="w-3 h-3 text-brand-emerald" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? t.copied : t.copy}</span>
        </button>
      </div>

      <div className="p-3">
        <pre className="p-3 rounded bg-[var(--input-bg)] border border-[var(--input-border)] text-[11px] font-mono text-cyan-300/90 overflow-x-auto max-h-80 leading-relaxed tabular-nums selection:bg-brand-cyan selection:text-slate-950">
          {JSON.stringify(payload, null, 2)}
        </pre>
      </div>

      <div className="p-2.5 border-t border-[var(--panel-border)] bg-[var(--panel-header-bg)] flex items-center justify-between text-[11px] font-mono text-[var(--muted-text)]">
        <span>Payload Size: ~{payloadSize} bytes</span>
        <span className="text-brand-emerald flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-brand-emerald animate-ping" />
          Valid DTO Schema
        </span>
      </div>
    </div>
  );
};
