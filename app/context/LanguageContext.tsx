"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'EN' | 'KO';

export interface Translations {
  // Brand & Header
  appTitle: string;
  appSubtitle: string;
  activeNodes: string;
  injectionsActive: string;
  packetsSent: string;
  interval: string;
  settings: string;
  tabFleet: string;
  tabProvisioning: string;
  tabTelemetry: string;
  targetApiEndpoint: string;
  forwardHttp: string;
  heartbeatTimeoutLimit: string;
  close: string;

  // Fleet View
  fleetCapacity: string;
  units: string;
  liveGenerators: string;
  activeInjections: string;
  heartbeatWatchdog: string;
  fleetMatrixTitle: string;
  fleetMatrixDesc: string;
  noVehiclesTitle: string;
  noVehiclesDesc: string;
  vin: string;
  speed: string;
  batterySoc: string;
  lidarScan: string;
  cameraArray: string;
  v2xLatency: string;
  lastPing: string;
  ago: string;
  failureAttackControl: string;
  resetAllInjections: string;
  forceTimeout: string;
  hideSensors: string;
  viewSensors: string;
  sensorId: string;
  sensorType: string;
  sensorName: string;
  mountLocation: string;
  firmware: string;
  diagnosticStatus: string;

  // Attacks
  lidarFailure: string;
  lidarFailureActive: string;
  lidarFailureNominal: string;
  v2xSpike: string;
  v2xSpikeActive: string;
  v2xSpikeNominal: string;
  gpsSpoofing: string;
  gpsSpoofingActive: string;
  gpsSpoofingNominal: string;
  cameraOffline: string;
  cameraOfflineActive: string;
  cameraOfflineNominal: string;
  canInjection: string;
  canInjectionActive: string;
  canInjectionNominal: string;

  // Provisioning View
  provisioningTitle: string;
  provisioningDesc: string;
  step1Title: string;
  selectArchProfile: string;
  robotaxiDesc: string;
  shuttleDesc: string;
  podDesc: string;
  vehicleNameLabel: string;
  vehicleIdLabel: string;
  vinLabel: string;
  modelLabel: string;
  initialStatusLabel: string;
  speedLimitLabel: string;
  assignedZoneLabel: string;
  firmwareVersionLabel: string;
  latitudeLabel: string;
  longitudeLabel: string;
  jsonPayloadPreview: string;
  serialNumber: string;
  onboardSensorStack: string;
  toggleSensorHint: string;
  btnProvisionVehicle: string;
  provisioningGuidelines: string;
  registeredFleetNodes: string;
  removeVehicle: string;

  // Telemetry View
  telemetryStreamTitle: string;
  telemetryStreamDesc: string;
  filterNode: string;
  allActiveVehicles: string;
  mapTitle: string;
  inBounds: string;
  spoofedBreach: string;
  activeTrackedNodes: string;
  geofenceArea: string;
  latestPayloadTitle: string;
  copy: string;
  copied: string;
  bufferedPackets: string;
  clearBuffer: string;
  incidentStreamTitle: string;
  clearLog: string;
  noIncidentsRecorded: string;
  colTime: string;
  colSeverity: string;
  colVehicle: string;
  colCode: string;
  colDesc: string;

  // Footer
  footerDesc: string;
  protocol: string;
  auth: string;
}

const translations: Record<Language, Translations> = {
  EN: {
    appTitle: 'CoreGuard Simulator',
    appSubtitle: 'Autonomous Vehicle Fleet & Cyber-Attack Ingestion Engine',
    activeNodes: 'Active Nodes',
    injectionsActive: 'INJECTIONS ACTIVE',
    packetsSent: 'Packets Sent',
    interval: 'INTERVAL',
    settings: 'Simulator Settings',
    tabFleet: 'Fleet & Attack Matrix',
    tabProvisioning: 'Vehicle Provisioning',
    tabTelemetry: 'Telemetry Stream & Map',
    targetApiEndpoint: 'Target SOC API Endpoint:',
    forwardHttp: 'Forward Real HTTP Telemetry (POST /api/v1/telemetry/ingest)',
    heartbeatTimeoutLimit: 'Heartbeat Timeout Limit:',
    close: 'Close',

    fleetCapacity: 'Fleet Capacity',
    units: 'Units',
    liveGenerators: 'Live Generators',
    activeInjections: 'Active Injections',
    heartbeatWatchdog: 'Heartbeat Watchdog',
    fleetMatrixTitle: 'Virtual Fleet & Real-Time Injections Matrix',
    fleetMatrixDesc: 'Control individual vehicle lifecycle states and inject live failure/cyber-attack payloads.',
    noVehiclesTitle: 'No virtual vehicles provisioned.',
    noVehiclesDesc: 'Use the Vehicle Provisioning tab to register nodes.',
    vin: 'VIN',
    speed: 'Speed',
    batterySoc: 'Battery SOC',
    lidarScan: 'LiDAR Scan',
    cameraArray: 'Camera Array',
    v2xLatency: 'V2X Latency',
    lastPing: 'Last Ping',
    ago: 'ago',
    failureAttackControl: 'Failure & Cyber-Attack Injection Control',
    resetAllInjections: 'Reset All Injections',
    forceTimeout: 'Force Timeout',
    hideSensors: 'Hide Onboard Sensor Array',
    viewSensors: 'View Onboard Sensor Modules',
    sensorId: 'Sensor ID',
    sensorType: 'Type',
    sensorName: 'Name',
    mountLocation: 'Mount Location',
    firmware: 'Firmware',
    diagnosticStatus: 'Diagnostic Status',

    lidarFailure: 'LiDAR Failure',
    lidarFailureActive: 'Active (5 FPS Drop)',
    lidarFailureNominal: 'Nominal (30 FPS)',
    v2xSpike: 'V2X Latency Spike',
    v2xSpikeActive: 'Active (300ms Spike)',
    v2xSpikeNominal: 'Nominal (14ms)',
    gpsSpoofing: 'GPS Spoofing',
    gpsSpoofingActive: 'Active (Geofence Breach)',
    gpsSpoofingNominal: 'In-Bounds Gangnam',
    cameraOffline: 'Camera Feed Offline',
    cameraOfflineActive: 'Active (0 FPS Stream)',
    cameraOfflineNominal: 'Nominal (60 FPS)',
    canInjection: 'CAN Injection (0x0A2)',
    canInjectionActive: 'Active (ID 0x0A2 Frame)',
    canInjectionNominal: 'Clean OBD Gateway',

    provisioningTitle: 'Vehicle & Device Sensor Provisioning',
    provisioningDesc: 'Register new virtual vehicles into CoreGuard network with custom sensor configurations.',
    step1Title: 'Step 1: Vehicle Platform & Credentials',
    selectArchProfile: 'Select Vehicle Architecture Profile:',
    robotaxiDesc: 'Dual 128ch LiDAR, 360° Vision, RTK GNSS, V2X',
    shuttleDesc: 'Quad LiDARs, Dual Radars, 8ch Vision, Dual GNSS',
    podDesc: 'Solid-State LiDAR, Compact Vision, Micro V2X',
    vehicleNameLabel: 'Vehicle Display Name:',
    vehicleIdLabel: 'Vehicle Identifier (ID):',
    vinLabel: 'VIN (Vehicle Identification Number):',
    modelLabel: 'Vehicle Platform / Model:',
    initialStatusLabel: 'Initial Common Status:',
    speedLimitLabel: 'Speed Limit (km/h):',
    assignedZoneLabel: 'Assigned Geofence Zone:',
    firmwareVersionLabel: 'Central ECU Firmware:',
    latitudeLabel: 'Spawn Latitude (°N):',
    longitudeLabel: 'Spawn Longitude (°E):',
    jsonPayloadPreview: 'Registration Payload Preview (JSON)',
    serialNumber: 'Serial Number',
    onboardSensorStack: 'Onboard Hardware Devices & Sensors',
    toggleSensorHint: 'Toggle devices to customize payload stack',
    btnProvisionVehicle: 'Register Vehicle',
    provisioningGuidelines: 'Registration Guidelines',
    registeredFleetNodes: 'Registered Fleet Nodes',
    removeVehicle: 'Remove Vehicle',

    telemetryStreamTitle: 'Live Telemetry Ingestion & Gangnam Geofence Stream',
    telemetryStreamDesc: 'Real-time payload stream for POST /api/v1/telemetry/ingest with interactive node tracking.',
    filterNode: 'Filter Node:',
    allActiveVehicles: 'All Active Vehicles',
    mapTitle: 'Seoul Gangnam Autonomous Route & Geofence',
    inBounds: 'In-Bounds',
    spoofedBreach: 'Spoofed / Breach',
    activeTrackedNodes: 'Active Tracked Nodes:',
    geofenceArea: 'Geofence: Gangnam District (37.49°N - 37.52°N, 127.02°E - 127.07°E)',
    latestPayloadTitle: 'Latest Ingestion Payload (JSON)',
    copy: 'Copy',
    copied: 'Copied',
    bufferedPackets: 'Buffered Packets:',
    clearBuffer: 'Clear Buffer',
    incidentStreamTitle: 'Simulator Incident & Heartbeat Stream',
    clearLog: 'Clear Log',
    noIncidentsRecorded: 'No incidents recorded in session.',
    colTime: 'Time',
    colSeverity: 'Severity',
    colVehicle: 'Vehicle',
    colCode: 'Incident Code',
    colDesc: 'Description',

    footerDesc: 'CoreGuard Autonomous Security Simulation Environment (CGS)',
    protocol: 'Protocol: V2X-CAN / TLS 1.3',
    auth: 'Auth: HSM KEK Verified',
  },
  KO: {
    appTitle: '코어가드 시뮬레이터',
    appSubtitle: '자율주행 차량 플릿 & 사이버 공격 텔레메트리 주입 엔진',
    activeNodes: '활성 노드',
    injectionsActive: '공격 주입 활성화',
    packetsSent: '전송된 패킷',
    interval: '주기',
    settings: '시뮬레이터 설정',
    tabFleet: '플릿 및 공격 매트릭스',
    tabProvisioning: '차량 프로비저닝 (등록)',
    tabTelemetry: '텔레메트리 스트림 & 지도',
    targetApiEndpoint: '대상 관제 SOC API 엔드포인트:',
    forwardHttp: '실제 HTTP 텔레메트리 전송 (POST /api/v1/telemetry/ingest)',
    heartbeatTimeoutLimit: '하트비트 타임아웃 기준:',
    close: '닫기',

    fleetCapacity: '전체 플릿 규모',
    units: '대',
    liveGenerators: '활성 생성기',
    activeInjections: '활성 공격 주입',
    heartbeatWatchdog: '하트비트 감시견',
    fleetMatrixTitle: '가상 플릿 및 실시간 공격 주입 매트릭스',
    fleetMatrixDesc: '개별 차량의 수명 주기 상태를 제어하고 실시간 장애/사이버 공격 페이로드를 주입합니다.',
    noVehiclesTitle: '등록된 가상 차량이 없습니다.',
    noVehiclesDesc: '차량 프로비저닝 탭을 사용하여 노드를 등록하세요.',
    vin: '차대번호(VIN)',
    speed: '주행 속도',
    batterySoc: '배터리 잔량(SOC)',
    lidarScan: '라이다 스캔',
    cameraArray: '카메라 어레이',
    v2xLatency: 'V2X 지연시간',
    lastPing: '최근 핑',
    ago: '전',
    failureAttackControl: '장애 및 사이버 공격 주입 제어',
    resetAllInjections: '모든 공격 주입 초기화',
    forceTimeout: '타임아웃 강제 발생',
    hideSensors: '센서 어레이 숨기기',
    viewSensors: '내장 센서 모듈 보기',
    sensorId: '센서 ID',
    sensorType: '종류',
    sensorName: '센서 명칭',
    mountLocation: '장착 위치',
    firmware: '펌웨어',
    diagnosticStatus: '진단 상태',

    lidarFailure: '라이다(LiDAR) 고장',
    lidarFailureActive: '주입됨 (5 FPS 저하)',
    lidarFailureNominal: '정상 (30 FPS)',
    v2xSpike: 'V2X 지연시간 급증',
    v2xSpikeActive: '주입됨 (300ms 지연)',
    v2xSpikeNominal: '정상 (14ms)',
    gpsSpoofing: 'GPS 스푸핑 공격',
    gpsSpoofingActive: '주입됨 (지오펜스 이탈)',
    gpsSpoofingNominal: '강남구 정상 범위',
    cameraOffline: '카메라 피드 단절',
    cameraOfflineActive: '주입됨 (0 FPS 오프라인)',
    cameraOfflineNominal: '정상 (60 FPS)',
    canInjection: 'CAN 버스 주입 (0x0A2)',
    canInjectionActive: '주입됨 (0x0A2 프레임 변조)',
    canInjectionNominal: '정상 OBD 게이트웨이',

    provisioningTitle: '차량 및 디바이스 센서 프로비저닝',
    provisioningDesc: '커스텀 센서 구성을 갖춘 신규 가상 차량을 코어가드 네트워크에 등록합니다.',
    step1Title: '1단계: 차량 플랫폼 및 자격증명',
    selectArchProfile: '차량 아키텍처 프로필 선택:',
    robotaxiDesc: '듀얼 128ch 라이다, 360° 비전, RTK GNSS, V2X',
    shuttleDesc: '쿼드 라이다, 듀얼 레이더, 8ch 비전, 듀얼 GNSS',
    podDesc: '솔리드스테이트 라이다, 컴팩트 비전, 마이크로 V2X',
    vehicleNameLabel: '차량 표시 명칭:',
    vehicleIdLabel: '차량 식별자 (ID):',
    vinLabel: '차대번호 (VIN):',
    modelLabel: '차량 플랫폼 / 모델:',
    initialStatusLabel: '초기 공통 상태:',
    speedLimitLabel: '제한 속도 (km/h):',
    assignedZoneLabel: '배정 지오펜스 구역:',
    firmwareVersionLabel: '중앙 ECU 펌웨어:',
    latitudeLabel: '시작 위도 (°N):',
    longitudeLabel: '시작 경도 (°E):',
    jsonPayloadPreview: '등록 페이로드 미리보기 (JSON)',
    serialNumber: '일련번호',
    onboardSensorStack: '내장 하드웨어 장치 및 센서 스택',
    toggleSensorHint: '장치를 선택/해제하여 페이로드 구성을 변경합니다',
    btnProvisionVehicle: '차량 등록',
    provisioningGuidelines: '등록 가이드라인',
    registeredFleetNodes: '등록된 플릿 노드',
    removeVehicle: '차량 삭제',

    telemetryStreamTitle: '실시간 텔레메트리 수집 및 강남 지오펜스 스트림',
    telemetryStreamDesc: '인터랙티브 노드 추적이 포함된 POST /api/v1/telemetry/ingest 실시간 페이로드 스트림.',
    filterNode: '노드 필터:',
    allActiveVehicles: '모든 활성 차량',
    mapTitle: '서울 강남구 자율주행 경로 및 지오펜스',
    inBounds: '정상 범위',
    spoofedBreach: '스푸핑 / 이탈',
    activeTrackedNodes: '추적 중인 활성 노드:',
    geofenceArea: '지오펜스: 서울 강남구 권역 (37.49°N - 37.52°N, 127.02°E - 127.07°E)',
    latestPayloadTitle: '최신 수집 페이로드 (JSON)',
    copy: '복사',
    copied: '복사됨',
    bufferedPackets: '버퍼된 패킷:',
    clearBuffer: '버퍼 비우기',
    incidentStreamTitle: '시뮬레이터 인시던트 및 하트비트 스트림',
    clearLog: '로그 지우기',
    noIncidentsRecorded: '기록된 인시던트가 없습니다.',
    colTime: '시간',
    colSeverity: '심각도',
    colVehicle: '차량',
    colCode: '인시던트 코드',
    colDesc: '상세 설명',

    footerDesc: '코어가드 자율주행 보안 시뮬레이션 환경 (CGS)',
    protocol: '프로토콜: V2X-CAN / TLS 1.3',
    auth: '인증: HSM KEK 검증됨',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('EN');

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'EN' ? 'KO' : 'EN'));
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
