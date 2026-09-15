"use client";

import React from 'react';
import { QueryProvider } from './context/QueryProvider';
import { LanguageProvider } from './context/LanguageContext';
import { SimulatorProvider } from './context/SimulatorContext';
import { SimulatorPage } from './pages/SimulatorPage';

/**
 * ============================================================================
 * 🚪 Home (Корневая входная точка Next.js App Router: route "/")
 * ============================================================================
 * 
 * 📌 ЗА ЧТО ОТВЕЧАЕТ:
 * - Подключает глобальные провайдеры контекста для всего приложения:
 *     1. <QueryProvider>     -> TanStack React Query (useQuery, useMutation, кэширование)
 *     2. <LanguageProvider>  -> Мультиязычность (EN / KO)
 *     3. <SimulatorProvider> -> Глобальный движок симулятора (флот, тики телеметрии, инъекции атак)
 * - Монтирует корневую страницу <SimulatorPage />.
 */
export default function Home() {
  return (
    <QueryProvider>
      <LanguageProvider>
        <SimulatorProvider>
          <SimulatorPage />
        </SimulatorProvider>
      </LanguageProvider>
    </QueryProvider>
  );
}
