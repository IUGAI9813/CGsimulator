import { DeviceSensor, VehicleType } from '../types/simulator';

// Preset sensors by vehicle type
export const PRESET_SENSORS: Record<VehicleType, DeviceSensor[]> = {
  ROBOTAXI: [
    { id: 'LID-01', name: 'Roof High-Res 128ch LiDAR', type: 'LIDAR', status: 'ONLINE', mountPosition: 'Roof Center', firmware: 'v4.2.1-sec', fps: 30 },
    { id: 'LID-02', name: 'Front Solid-State Bumper LiDAR', type: 'LIDAR', status: 'ONLINE', mountPosition: 'Front Grille', firmware: 'v2.1.0', fps: 30 },
    { id: 'CAM-01', name: 'Front Stereo Long-Range Camera', type: 'CAMERA', status: 'ONLINE', mountPosition: 'Windshield Top', firmware: 'v3.8.0', fps: 60 },
    { id: 'CAM-02', name: 'Surround 360° Vision Array', type: 'CAMERA', status: 'ONLINE', mountPosition: 'Perimeter Pods', firmware: 'v3.8.0', fps: 60 },
    { id: 'RAD-01', name: '77GHz Long-Range Radar', type: 'RADAR', status: 'ONLINE', mountPosition: 'Front Center', firmware: 'v1.9.4' },
    { id: 'RAD-02', name: 'Corner Short-Range Radars (x4)', type: 'RADAR', status: 'ONLINE', mountPosition: 'Corners', firmware: 'v1.9.4' },
    { id: 'GNS-01', name: 'Multi-Band RTK GNSS Receiver', type: 'GNSS', status: 'ONLINE', mountPosition: 'Roof Rear', firmware: 'v5.0.2' },
    { id: 'V2X-01', name: 'CoreGuard V2X Ingress Gateway', type: 'V2X', status: 'ONLINE', mountPosition: 'Telematics Control Unit', firmware: 'v2.4.0-HSM', latencyMs: 14 },
    { id: 'CAN-01', name: 'Dual OBD-CAN Security Gateway', type: 'CAN_BUS', status: 'ONLINE', mountPosition: 'Chassis Hub', firmware: 'v1.4.2' },
  ],
  SHUTTLE: [
    { id: 'LID-01', name: 'Front-Top 360° 128ch LiDAR', type: 'LIDAR', status: 'ONLINE', mountPosition: 'Roof Front', firmware: 'v4.2.1-sec', fps: 30 },
    { id: 'LID-02', name: 'Rear-Top 360° 128ch LiDAR', type: 'LIDAR', status: 'ONLINE', mountPosition: 'Roof Rear', firmware: 'v4.2.1-sec', fps: 30 },
    { id: 'LID-03', name: 'Perimeter Blindspot LiDARs', type: 'LIDAR', status: 'ONLINE', mountPosition: 'Left/Right Mid', firmware: 'v2.1.0', fps: 30 },
    { id: 'CAM-01', name: '8-Channel Surround Vision', type: 'CAMERA', status: 'ONLINE', mountPosition: 'Perimeter Ring', firmware: 'v3.8.0', fps: 60 },
    { id: 'RAD-01', name: 'Front & Rear 77GHz Radars', type: 'RADAR', status: 'ONLINE', mountPosition: 'Front/Rear', firmware: 'v1.9.4' },
    { id: 'GNS-01', name: 'Dual RTK GNSS Receiver', type: 'GNSS', status: 'ONLINE', mountPosition: 'Dual Antennas', firmware: 'v5.0.2' },
    { id: 'V2X-01', name: 'Redundant C-V2X Ingress Transceiver', type: 'V2X', status: 'ONLINE', mountPosition: 'Main ECU', firmware: 'v2.4.0-HSM', latencyMs: 12 },
    { id: 'CAN-01', name: 'CAN FD Central Gateway', type: 'CAN_BUS', status: 'ONLINE', mountPosition: 'Central Rack', firmware: 'v2.0.1' },
  ],
  DELIVERY_POD: [
    { id: 'LID-01', name: 'Compact Solid-State LiDAR', type: 'LIDAR', status: 'ONLINE', mountPosition: 'Front Fascia', firmware: 'v2.1.0', fps: 30 },
    { id: 'CAM-01', name: 'Dual Wide-Angle AI Cameras', type: 'CAMERA', status: 'ONLINE', mountPosition: 'Front/Side', firmware: 'v3.8.0', fps: 60 },
    { id: 'RAD-01', name: 'Ultrasonic & Radar Array', type: 'RADAR', status: 'ONLINE', mountPosition: 'Perimeter', firmware: 'v1.9.4' },
    { id: 'GNS-01', name: 'Standard GNSS + Dead Reckoning', type: 'GNSS', status: 'ONLINE', mountPosition: 'Upper Shell', firmware: 'v5.0.2' },
    { id: 'V2X-01', name: 'V2X Micro Transceiver', type: 'V2X', status: 'ONLINE', mountPosition: 'Logic Board', firmware: 'v2.4.0-HSM', latencyMs: 16 },
    { id: 'CAN-01', name: 'Micro CAN Gateway', type: 'CAN_BUS', status: 'ONLINE', mountPosition: 'Motor Controller', firmware: 'v1.0.0' },
  ]
};

// Realistic Waypoints in Gangnam, Seoul
export const GANGNAM_WAYPOINTS = [
  { lat: 37.5013, lng: 127.0396, name: 'Gangnam Station Cross' },
  { lat: 37.5045, lng: 127.0490, name: 'Yeoksam Station Junction' },
  { lat: 37.5088, lng: 127.0632, name: 'Samseong Station COEX' },
  { lat: 37.5140, lng: 127.0595, name: 'Bongeunsa Intersection' },
  { lat: 37.5172, lng: 127.0473, name: 'Cheongdam Station East' },
  { lat: 37.5195, lng: 127.0284, name: 'Sinsa Station Boulevard' },
  { lat: 37.5080, lng: 127.0255, name: 'Nonhyeon Station Avenue' },
  { lat: 37.4982, lng: 127.0278, name: 'Gangnam-daero South' },
];

export const GEOFENCE_BOUNDS = {
  minLat: 37.4900,
  maxLat: 37.5250,
  minLng: 127.0200,
  maxLng: 127.0700,
};

// Initial Demo Vehicles
export const INITIAL_VEHICLES = [
  {
    id: 'VEH-42-012',
    name: 'Gangnam RoboTaxi 012',
    type: 'ROBOTAXI' as VehicleType,
    vin: 'KN4CG2026TX01298',
    registeredAt: new Date(Date.now() - 3600000).toISOString(),
    lifecycleStatus: 'RUNNING' as const,
    lastHeartbeat: Date.now(),
    secondsSinceLastHeartbeat: 0,
    sensors: PRESET_SENSORS.ROBOTAXI,
    injections: {
      lidarFailure: false,
      v2xLatencySpike: false,
      gpsSpoofing: false,
      cameraOffline: false,
      canBusInjection: false,
    },
    lastTelemetry: null,
    routeProgress: 0.15,
    totalPacketsSent: 142,
  },
  {
    id: 'VEH-42-089',
    name: 'Teheran-ro Shuttle S-89',
    type: 'SHUTTLE' as VehicleType,
    vin: 'KN4CG2026SH08933',
    registeredAt: new Date(Date.now() - 7200000).toISOString(),
    lifecycleStatus: 'RUNNING' as const,
    lastHeartbeat: Date.now(),
    secondsSinceLastHeartbeat: 0,
    sensors: PRESET_SENSORS.SHUTTLE,
    injections: {
      lidarFailure: false,
      v2xLatencySpike: false,
      gpsSpoofing: false,
      cameraOffline: false,
      canBusInjection: false,
    },
    lastTelemetry: null,
    routeProgress: 0.58,
    totalPacketsSent: 98,
  },
  {
    id: 'VEH-42-104',
    name: 'COEX Delivery Pod P-104',
    type: 'DELIVERY_POD' as VehicleType,
    vin: 'KN4CG2026DP10471',
    registeredAt: new Date(Date.now() - 10800000).toISOString(),
    lifecycleStatus: 'PAUSED' as const,
    lastHeartbeat: Date.now() - 4000,
    secondsSinceLastHeartbeat: 4,
    sensors: PRESET_SENSORS.DELIVERY_POD,
    injections: {
      lidarFailure: false,
      v2xLatencySpike: false,
      gpsSpoofing: false,
      cameraOffline: false,
      canBusInjection: false,
    },
    lastTelemetry: null,
    routeProgress: 0.82,
    totalPacketsSent: 34,
  }
];
