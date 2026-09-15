import { api } from './apiClient';
import { TelemetryPayload, Vehicle, VehicleRegistrationPayload } from '../types/simulator';

/**
 * Service for communicating with backend / CoreGuard SOC Gateway using Axios
 */
export const simulatorApiService = {
  /**
   * Fetches list of registered vehicles from backend
   */
  async getVehicles(targetUrl: string = ''): Promise<any> {
    const url = targetUrl ? `${targetUrl}/api/v1/simulator/vehicles` : '/api/v1/simulator/vehicles';
    return api.get(url);
  },

  /**
   * Dispatches vehicle provisioning registration request
   */
  async registerVehicle(targetUrl: string = '', vehicle: VehicleRegistrationPayload | Partial<Vehicle> | any): Promise<any> {
    const url = targetUrl ? `${targetUrl}/api/v1/simulator/vehicles` : '/api/v1/simulator/vehicles';

    // Normalize payload to match CoreGuard backend contract
    const payload: VehicleRegistrationPayload = {
      vehicleType: vehicle.vehicleType || vehicle.type || 'ROBOTAXI',
      vin: vehicle.vin || 'KN4CG2026TX10501',
      model: vehicle.model || 'Hyundai IONIQ 5 Robotaxi',
      status: vehicle.status || 'VEH_ACTIVE',
      speedLimit: typeof vehicle.speedLimit === 'number' ? vehicle.speedLimit : 60.0,
      assignedZone: vehicle.assignedZone || 'Gangnam District',
      firmwareVersion: vehicle.firmwareVersion || 'v2.4.1',
      latitude: typeof vehicle.latitude === 'number' ? vehicle.latitude : 37.4979,
      longitude: typeof vehicle.longitude === 'number' ? vehicle.longitude : 127.0276,
      devices: vehicle.devices || (vehicle.sensors ? vehicle.sensors.map((s: any) => ({
        deviceId: s.deviceId || `DEV-${vehicle.id || 'UNIT'}-${s.type}-${s.id}`,
        deviceType: s.deviceType || `DEV_${s.type}`,
        serialNumber: s.serialNumber || `SN-${s.type}-00000`,
        status: s.deviceStatus || (s.status === 'ONLINE' ? 'DEV_ONLINE' : s.status === 'DEGRADED' ? 'DEV_DEGRADED' : 'DEV_OFFLINE'),
        firmwareVersion: s.firmwareVersion || s.firmware || 'v1.0.0',
        mountPosition: s.mountPosition,
      })) : []),
    };



    return api.post(url, payload);
  },

  /**
   * Dispatches real-time telemetry payload ingestion
   */
  async ingestTelemetry(targetUrl: string = '', payload: TelemetryPayload): Promise<any> {
    const url = targetUrl ? `${targetUrl}/api/v1/telemetry/ingest` : '/api/v1/telemetry/ingest';
    return api.post(url, payload);
  },
};

