"use client";

import React, { useState } from 'react';
import { SimulatorProvider } from './context/SimulatorContext';
import { Header } from './components/Header';
import { FleetControlView } from './components/FleetControlView';
import { ProvisioningView } from './components/ProvisioningView';
import { TelemetryStreamView } from './components/TelemetryStreamView';

function SimulatorApp() {
  const [activeTab, setActiveTab] = useState<'fleet' | 'provisioning' | 'telemetry'>('fleet');

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-brand-cyan selection:text-slate-950">
      {/* Top Cyber Navigation Bar */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'fleet' && <FleetControlView />}
        {activeTab === 'provisioning' && <ProvisioningView />}
        {activeTab === 'telemetry' && <TelemetryStreamView />}
      </main>

      {/* Cyber SOC Footer */}
      <footer className="border-t border-[var(--panel-border)] bg-[var(--panel-header-bg)] py-3 text-xs font-mono text-[var(--muted-text)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
            <span>CoreGuard Autonomous Security Simulation Environment (CGS)</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Protocol: <strong className="text-[var(--foreground)]">V2X-CAN / TLS 1.3</strong></span>
            <span>Auth: <strong className="text-brand-emerald">HSM KEK Verified</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <SimulatorProvider>
      <SimulatorApp />
    </SimulatorProvider>
  );
}
