"use client";

import React from 'react';
import { FleetControlView } from '../components/fleet/FleetControlView';

/**
 * ============================================================================
 * 🚗 FleetPage (Страница управления автопарком и инъекциями атак)
 * ============================================================================
 * 
 * 📌 ЗА ЧТО ОТВЕЧАЕТ:
 * - Главный экран мониторинга активных виртуальных машин (RoboTaxi, Shuttle, Delivery Pod).
 * - Управление жизненным циклом каждого ТС: START (запуск), PAUSE (пауза), STOP (остановка).
 * - Тестирование таймаута Heartbeat: искусственный сброс связи на 15 сек для вызова INC_HEARTBEAT_LOST.
 * - Ручная инъекция 5 видов сбоев и кибератак в реальном времени:
 *     1. LiDAR Failure (падение FPS с 30 до 5)
 *     2. V2X Latency Spike (рост задержки с 14мс до 300+мс)
 *     3. GPS Spoofing (выход координат за пределы геозоны Каннама)
 *     4. Camera Feed Offline (обрыв видеопотока до 0 FPS)
 *     5. CAN Bus Injection (внедрение аномального фрейма CAN ID 0x0A2)
 * - Просмотр состояния всех 9 бортовых датчиков каждого автомобиля.
 * 
 * 🧩 ИСПОЛЬЗУЕМЫЕ КОМПОНЕНТЫ:
 * - FleetControlView: контейнер страницы
 *   ├── StatCard: верхние карточки KPI (емкость парка, активные генераторы, инъекции, watchdog)
 *   └── VehicleCard: карточка автомобиля с метриками и кнопками атак
 *       ├── VehicleMetricsRow: приборная панель (Speed, Battery, LiDAR, Camera, V2X, Ping)
 *       ├── AttackInjectionControls: тумблеры вызова атак и сброса
 *       └── SensorsTable: раскладка всех сенсоров (ID, тип, прошивка, статус)
 */
export const FleetPage: React.FC = () => {
  return <FleetControlView />;
};
