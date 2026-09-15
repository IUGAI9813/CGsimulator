"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { simulatorApiService } from '../../services/simulatorApiService';
import { Vehicle, TelemetryPayload } from '../../types/simulator';

export const VEHICLES_QUERY_KEY = ['vehicles'];

/**
 * Hook to fetch registered vehicles list via React Query + Axios
 */
export function useVehiclesQuery(targetUrl?: string) {
  return useQuery({
    queryKey: [...VEHICLES_QUERY_KEY, targetUrl],
    queryFn: () => simulatorApiService.getVehicles(targetUrl),
  });
}

/**
 * Hook to register a new vehicle using useMutation
 */
export function useRegisterVehicleMutation(targetUrl?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleData: Partial<Vehicle>) =>
      simulatorApiService.registerVehicle(targetUrl, vehicleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
    },
  });
}

/**
 * Hook to send telemetry ingestion ticks using useMutation
 */
export function useIngestTelemetryMutation(targetUrl?: string) {
  return useMutation({
    mutationFn: (payload: TelemetryPayload) =>
      simulatorApiService.ingestTelemetry(targetUrl, payload),
  });
}
