"use client";

import React from 'react';
import { ProvisioningView } from '../components/provisioning/ProvisioningView';

/**
 * ============================================================================
 * 🛠️ ProvisioningPage (Страница регистрации и конфигурации новых ТС)
 * ============================================================================
 * 
 * 📌 ЗА ЧТО ОТВЕЧАЕТ:
 * - Регистрация новых виртуальных автомобилей в сети CoreGuard.
 * - Выбор архитектурного профиля ТС:
 *     • ROBOTAXI: 2x LiDAR (128ch + Solid-State), 4x Cameras 360°, RTK GNSS, V2X Gateway, CAN
 *     • SHUTTLE: 4x LiDAR, 8ch Vision, Dual Radars, Dual RTK GNSS, Redundant V2X, CAN FD
 *     • DELIVERY_POD: Solid-State LiDAR, Wide-Angle AI Cameras, Micro V2X, Micro CAN
 * - Интерактивная настройка состава датчиков (включение/отключение конкретных модулей).
 * - Валидация формы через React Hook Form (имя ТС, VIN-номер).
 * - Отправка регистрационного запроса: POST /api/v1/simulator/vehicles.
 * - Быстрый просмотр списка зарегистрированных узлов и удаление ТС из автопарка.
 * 
 * 🧩 ИСПОЛЬЗУЕМЫЕ КОМПОНЕНТЫ:
 * - ProvisioningView: основной контейнер экрана
 *   ├── VehicleProfilePicker: селектор архитектурных пресетов (RoboTaxi / Shuttle / Pod)
 *   ├── SensorStackSelector: чекбоксы выбора состава бортовых сенсоров
 *   └── ProvisionedFleetList: список зарегистрированных узлов с кнопкой удаления
 */
export const ProvisioningPage: React.FC = () => {
  return <ProvisioningView />;
};
