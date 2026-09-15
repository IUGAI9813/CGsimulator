import { api } from './apiClient';
import { TelemetryPayload, Vehicle } from '../types/simulator';

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
  async registerVehicle(targetUrl: string = '', vehicle: Partial<Vehicle>): Promise<any> {
    const url = targetUrl ? `${targetUrl}/api/v1/simulator/vehicles` : '/api/v1/simulator/vehicles';
    return api.post(url, {
      vehicleId: vehicle.id,
      name: vehicle.name,
      type: vehicle.type,
      vin: vehicle.vin,
      sensors: vehicle.sensors,
    });
  },

  /**
   * Dispatches real-time telemetry payload ingestion
   */
  async ingestTelemetry(targetUrl: string = '', payload: TelemetryPayload): Promise<any> {
    const url = targetUrl ? `${targetUrl}/api/v1/telemetry/ingest` : '/api/v1/telemetry/ingest';
    return api.post(url, payload);
  },
};
