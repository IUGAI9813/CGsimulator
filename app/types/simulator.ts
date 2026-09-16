export type VehicleType = 'ROBOTAXI' | 'SHUTTLE' | 'DELIVERY_POD';

export type LifecycleStatus = 'RUNNING' | 'PAUSED' | 'STOPPED' | 'OFFLINE';

export type SensorType = 'LIDAR' | 'RADAR' | 'CAMERA' | 'GNSS' | 'V2X' | 'CAN_BUS';

export interface DeviceSensor {
  id: string;
  deviceId?: string;
  name: string;
  type: SensorType;
  deviceType?: string;
  serialNumber?: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  deviceStatus?: 'DEV_ONLINE' | 'DEV_DEGRADED' | 'DEV_OFFLINE';
  mountPosition: string;
  firmware: string;
  firmwareVersion?: string;
  fps?: number;
  latencyMs?: number;
}

export interface VehicleDevicePayload {
  deviceId: string;
  deviceType: string;
  serialNumber: string;
  status: string; // 'DEV_ONLINE' | 'DEV_DEGRADED' | 'DEV_OFFLINE'
  firmwareVersion: string;
  mountPosition?: string;
}

export interface VehicleRegistrationPayload {
  vehicleType: VehicleType;
  vin: string;
  model: string;
  status: string; // e.g. 'VEH_ACTIVE'
  speedLimit: number;
  assignedZone: string;
  firmwareVersion: string;
  latitude: number;
  longitude: number;
  devices: VehicleDevicePayload[];
}

export interface AttackInjections {
  lidarFailure: boolean;       // Drop FPS: 30 -> 5
  v2xLatencySpike: boolean;    // Latency spike: 14ms -> 300ms
  gpsSpoofing: boolean;        // Spoof coordinates outside Geofence
  cameraOffline: boolean;      // Camera FPS: 60 -> 0
  canBusInjection: boolean;    // CAN ID 0x0A2 override
}

export interface TelemetryPayload {
  vehicleId: string;
  timestamp: string;
  tickIndex: number;
  latitude: number;
  longitude: number;
  speedKmh: number;
  batteryPercent: number;
  headingDeg: number;
  lidarFps: number;
  cameraFps: number;
  v2xLatencyMs: number;
  geofenceStatus: 'IN_BOUNDS' | 'BREACHED';
  canStatus: 'NORMAL' | 'ANOMALY_0x0A2';
  heartbeatSeq: number;
  activeAnomalies: string[];
}

export interface Vehicle {
  id: string;
  vehicleId?: string;
  name: string;
  type: VehicleType;
  vehicleType?: VehicleType;
  vin: string;
  model?: string;
  status?: string;
  speedLimit?: number;
  assignedZone?: string;
  firmwareVersion?: string;
  latitude?: number;
  longitude?: number;
  registeredAt: string;
  lifecycleStatus: LifecycleStatus;
  lastHeartbeat: number; // Date.now() timestamp
  secondsSinceLastHeartbeat: number;
  sensors: DeviceSensor[];
  devices?: VehicleDevicePayload[];
  injections: AttackInjections;
  lastTelemetry: TelemetryPayload | null;
  routeProgress: number; // 0.0 to 1.0 along waypoint loop
  totalPacketsSent: number;
}

export interface IncidentRecord {
  id: string;
  vehicleId: string;
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  timestamp: string;
  description: string;
}

export interface SimulatorConfig {
  intervalMs: number;          // 500ms, 1000ms, 2000ms
  targetApiUrl: string;        // e.g. http://localhost:8090 (CoreGuard SOC) or internal
  forwardHttp: boolean;        // Whether to perform real POST requests
  heartbeatTimeoutSeconds: number; // Default: 10s
  provisioningApiKey: string;  // API Key for vehicle registration
  telemetryApiKey: string;     // API Key for telemetry ingestion
}

