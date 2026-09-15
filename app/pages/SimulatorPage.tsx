"use client";

import React, { useState } from 'react';
import { Header } from '../components/header/Header';
import { FleetPage } from './FleetPage';
import { ProvisioningPage } from './ProvisioningPage';
import { TelemetryPage } from './TelemetryPage';
import { useLanguage } from '../context/LanguageContext';

export type SimulatorTab = 'fleet' | 'provisioning' | 'telemetry';

/**
 * ============================================================================
 * 🖥️ SimulatorPage (Главная страница-оркестратор верхнего уровня)
 * ============================================================================
 * 
 * 📌 ЗА ЧТО ОТВЕЧАЕТ:
 * - Выступает корневым визуальным шаблоном (Layout/Shell) всего симулятора.
 * - Управляет переключением главных вкладок:
 *     1. 'fleet'        -> отображает <FleetPage /> (Флот и матрица атак)
 *     2. 'provisioning' -> отображает <ProvisioningPage /> (Регистрация ТС)
 *     3. 'telemetry'    -> отображает <TelemetryPage /> (Телеметрия, карта Каннама и инциденты)
 * - Рендерит сквозную шапку <Header /> (логотип, активные узлы, счетчик пакетов, переключатель тем и языков EN/KO).
 * - Рендерит сквозной кибер-подвал (Footer) со статусами протоколов безопасности HSM/TLS.
 * 
 * 🧩 ИСПОЛЬЗУЕМЫЕ СТРАНИЦЫ И КОМПОНЕНТЫ:
 * - Header: верхняя панель управления и навигации
 * - FleetPage: экран флота и атак
 * - ProvisioningPage: экран создания виртуальных машин
 * - TelemetryPage: экран живой карты и JSON-терминала
 */
export const SimulatorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SimulatorTab>('fleet');
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-brand-cyan selection:text-slate-950">
      {/* 1. Верхняя навигационная панель */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Основная рабочая область (Viewport активной страницы) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'fleet' && <FleetPage />}
        {activeTab === 'provisioning' && <ProvisioningPage />}
        {activeTab === 'telemetry' && <TelemetryPage />}
      </main>

      {/* 3. Кибер-подвал SOC */}
      <footer className="border-t border-[var(--panel-border)] bg-[var(--panel-header-bg)] py-3 text-xs font-mono text-[var(--muted-text)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
            <span>{t.footerDesc}</span>
          </div>
          <div className="flex items-center gap-4">
            <span><strong className="text-[var(--foreground)]">{t.protocol}</strong></span>
            <span><strong className="text-brand-emerald">{t.auth}</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
};
