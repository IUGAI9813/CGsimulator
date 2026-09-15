export type VehicleType = 'ROBOTAXI' | 'SHUTTLE' | 'DELIVERY_POD';

export type LifecycleStatus = 'RUNNING' | 'PAUSED' | 'STOPPED' | 'OFFLINE';

export type SensorType = 'LIDAR' | 'RADAR' | 'CAMERA' | 'GNSS' | 'V2X' | 'CAN_BUS';

export interface DeviceSensor {
  id: string;
  name: string;
  type: SensorType;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  mountPosition: string;
  firmware: string;
  fps?: number;
  latencyMs?: number;
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
  name: string;
  type: VehicleType;
  vin: string;
  registeredAt: string;
  lifecycleStatus: LifecycleStatus;
  lastHeartbeat: number; // Date.now() timestamp
  secondsSinceLastHeartbeat: number;
  sensors: DeviceSensor[];
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
  targetApiUrl: string;        // e.g. http://localhost:3003 (CoreGuard SOC) or internal
  forwardHttp: boolean;        // Whether to perform real POST requests
  heartbeatTimeoutSeconds: number; // Default: 10s
}
