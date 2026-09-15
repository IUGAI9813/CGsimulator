"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Vehicle,
  VehicleType,
  LifecycleStatus,
  AttackInjections,
  TelemetryPayload,
  IncidentRecord,
  SimulatorConfig,
  DeviceSensor,
} from '../types/simulator';
import { INITIAL_VEHICLES, PRESET_SENSORS, GANGNAM_WAYPOINTS, GEOFENCE_BOUNDS } from '../utils/presets';

interface SimulatorContextType {
  vehicles: Vehicle[];
  config: SimulatorConfig;
  telemetryLogs: TelemetryPayload[];
  incidents: IncidentRecord[];
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  registerVehicle: (data: { name: string; type: VehicleType; vin: string; customSensors?: DeviceSensor[] }) => Promise<Vehicle>;
  deleteVehicle: (id: string) => void;
  setLifecycleStatus: (id: string, status: LifecycleStatus) => void;
  toggleInjection: (vehicleId: string, injectionKey: keyof AttackInjections) => void;
  resetInjections: (vehicleId: string) => void;
  triggerHeartbeatTimeout: (vehicleId: string) => void;
  updateConfig: (newConfig: Partial<SimulatorConfig>) => void;
  clearLogs: () => void;
  clearIncidents: () => void;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export const SimulatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryPayload[]>([]);
  const [incidents, setIncidents] = useState<IncidentRecord[]>([
    {
      id: 'INC-INIT-01',
      vehicleId: 'VEH-42-012',
      type: 'SIMULATOR_READY',
      severity: 'INFO',
      timestamp: new Date().toLocaleTimeString(),
      description: 'CoreGuard Simulator Engine initialized with 3 active fleet nodes.'
    }
  ]);

  const [config, setConfig] = useState<SimulatorConfig>({
    intervalMs: 1000,
    targetApiUrl: 'http://localhost:3003',
    forwardHttp: false,
    heartbeatTimeoutSeconds: 10,
  });

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      return nextTheme;
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Update Config
  const updateConfig = (newConfig: Partial<SimulatorConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  // Add Incident Helper
  const addIncident = useCallback((record: Omit<IncidentRecord, 'id' | 'timestamp'>) => {
    const newInc: IncidentRecord = {
      id: `INC-SIM-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString(),
      ...record,
    };
    setIncidents(prev => [newInc, ...prev.slice(0, 49)]);
  }, []);

  // Register Vehicle
  const registerVehicle = async (data: { name: string; type: VehicleType; vin: string; customSensors?: DeviceSensor[] }): Promise<Vehicle> => {
    const sensorsToUse = data.customSensors && data.customSensors.length > 0 
      ? data.customSensors 
      : PRESET_SENSORS[data.type];

    const newVehicle: Vehicle = {
      id: `VEH-42-${Math.floor(100 + Math.random() * 900)}`,
      name: data.name || `${data.type} Unit`,
      type: data.type,
      vin: data.vin || `KN4CG2026${data.type.slice(0, 2)}${Math.floor(10000 + Math.random() * 90000)}`,
      registeredAt: new Date().toISOString(),
      lifecycleStatus: 'RUNNING',
      lastHeartbeat: Date.now(),
      secondsSinceLastHeartbeat: 0,
      sensors: sensorsToUse,
      injections: {
        lidarFailure: false,
        v2xLatencySpike: false,
        gpsSpoofing: false,
        cameraOffline: false,
        canBusInjection: false,
      },
      lastTelemetry: null,
      routeProgress: Math.random() * 0.8,
      totalPacketsSent: 0,
    };

    // Forward HTTP request if enabled
    if (config.forwardHttp) {
      try {
        await fetch(`${config.targetApiUrl}/api/v1/simulator/vehicles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vehicleId: newVehicle.id,
            name: newVehicle.name,
            type: newVehicle.type,
            vin: newVehicle.vin,
            sensors: newVehicle.sensors,
          }),
        });
      } catch (err) {
        console.warn('Could not forward vehicle registration to remote target:', err);
      }
    }

    setVehicles(prev => [newVehicle, ...prev]);

    addIncident({
      vehicleId: newVehicle.id,
      type: 'VEHICLE_PROVISIONED',
      severity: 'INFO',
      description: `Virtual vehicle ${newVehicle.name} (${newVehicle.id}) registered with ${newVehicle.sensors.length} onboard sensors.`,
    });

    return newVehicle;
  };

  // Delete Vehicle
  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  // Set Lifecycle Status
  const setLifecycleStatus = (id: string, status: LifecycleStatus) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === id) {
        const updated = { ...v, lifecycleStatus: status };
        if (status === 'RUNNING') {
          updated.lastHeartbeat = Date.now();
          updated.secondsSinceLastHeartbeat = 0;
        }
        return updated;
      }
      return v;
    }));

    addIncident({
      vehicleId: id,
      type: `LIFECYCLE_${status}`,
      severity: status === 'OFFLINE' ? 'CRITICAL' : 'INFO',
      description: `Vehicle ${id} lifecycle transitioned to state: ${status}.`,
    });
  };

  // Toggle Injection
  const toggleInjection = (vehicleId: string, injectionKey: keyof AttackInjections) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        const nextState = !v.injections[injectionKey];
        const newInjections = { ...v.injections, [injectionKey]: nextState };

        // Update sensor visual status accordingly
        const updatedSensors = v.sensors.map(s => {
          if (injectionKey === 'lidarFailure' && s.type === 'LIDAR') {
            return { ...s, status: nextState ? ('DEGRADED' as const) : ('ONLINE' as const), fps: nextState ? 5 : 30 };
          }
          if (injectionKey === 'cameraOffline' && s.type === 'CAMERA') {
            return { ...s, status: nextState ? ('OFFLINE' as const) : ('ONLINE' as const), fps: nextState ? 0 : 60 };
          }
          if (injectionKey === 'v2xLatencySpike' && s.type === 'V2X') {
            return { ...s, status: nextState ? ('DEGRADED' as const) : ('ONLINE' as const), latencyMs: nextState ? 320 : 14 };
          }
          return s;
        });

        // Add alert incident
        if (nextState) {
          const typeMap: Record<keyof AttackInjections, { type: string; sev: 'CRITICAL' | 'HIGH' | 'MEDIUM'; desc: string }> = {
            lidarFailure: { type: 'LIDAR_FPS_DROP', sev: 'HIGH', desc: 'LiDAR optical scan rate plummeted from 30 FPS to 5 FPS.' },
            v2xLatencySpike: { type: 'V2X_LATENCY_SPIKE', sev: 'HIGH', desc: 'V2X Ingress round-trip latency exceeded 300ms threshold.' },
            gpsSpoofing: { type: 'GPS_GEOFENCE_BREACH', sev: 'CRITICAL', desc: 'GNSS coordinates drifted abruptly outside approved Gangnam Geofence.' },
            cameraOffline: { type: 'CAMERA_FEED_LOST', sev: 'HIGH', desc: 'Vision camera sensor stream dropped to 0 FPS (Offline).' },
            canBusInjection: { type: 'CAN_FRAME_INJECTION', sev: 'CRITICAL', desc: 'Anomalous CAN ID 0x0A2 injected into chassis gateway.' },
          };
          const info = typeMap[injectionKey];
          addIncident({
            vehicleId,
            type: info.type,
            severity: info.sev,
            description: `[ATTACK INJECTION] ${info.desc}`,
          });
        }

        return {
          ...v,
          injections: newInjections,
          sensors: updatedSensors,
        };
      }
      return v;
    }));
  };

  // Reset Injections
  const resetInjections = (vehicleId: string) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        return {
          ...v,
          injections: {
            lidarFailure: false,
            v2xLatencySpike: false,
            gpsSpoofing: false,
            cameraOffline: false,
            canBusInjection: false,
          },
          sensors: v.sensors.map(s => ({
            ...s,
            status: 'ONLINE' as const,
            fps: s.type === 'LIDAR' ? 30 : s.type === 'CAMERA' ? 60 : undefined,
            latencyMs: s.type === 'V2X' ? 14 : undefined,
          })),
        };
      }
      return v;
    }));

    addIncident({
      vehicleId,
      type: 'INJECTIONS_CLEARED',
      severity: 'INFO',
      description: `All attack injections reset to nominal state for ${vehicleId}.`,
    });
  };

  // Trigger Heartbeat Timeout
  const triggerHeartbeatTimeout = (vehicleId: string) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        return {
          ...v,
          lastHeartbeat: Date.now() - 15000, // 15 seconds ago
          secondsSinceLastHeartbeat: 15,
        };
      }
      return v;
    }));
  };

  const clearLogs = () => setTelemetryLogs([]);
  const clearIncidents = () => setIncidents([]);

  // Telemetry Generation Tick Loop (Runs according to config.intervalMs)
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prevVehicles => {
        return prevVehicles.map(vehicle => {
          if (vehicle.lifecycleStatus !== 'RUNNING') {
            return vehicle;
          }

          // Advance route progress along waypoint loop
          const newProgress = (vehicle.routeProgress + 0.015) % 1.0;
          const wpIndex = Math.floor(newProgress * GANGNAM_WAYPOINTS.length);
          const nextWpIndex = (wpIndex + 1) % GANGNAM_WAYPOINTS.length;
          const t = (newProgress * GANGNAM_WAYPOINTS.length) % 1.0;

          const currentWp = GANGNAM_WAYPOINTS[wpIndex];
          const nextWp = GANGNAM_WAYPOINTS[nextWpIndex];

          let lat = currentWp.lat + (nextWp.lat - currentWp.lat) * t;
          let lng = currentWp.lng + (nextWp.lng - currentWp.lng) * t;

          // If GPS spoofing active: displace latitude far away
          let geofenceStatus: 'IN_BOUNDS' | 'BREACHED' = 'IN_BOUNDS';
          if (vehicle.injections.gpsSpoofing) {
            lat = 37.6620; // Northern Seoul outside Gangnam
            lng = 127.0950;
            geofenceStatus = 'BREACHED';
          }

          // Compute realistic speed with minor jitter
          const baseSpeed = vehicle.type === 'SHUTTLE' ? 38 : vehicle.type === 'DELIVERY_POD' ? 22 : 54;
          const speedJitter = (Math.sin(Date.now() / 2000) * 8);
          const speedKmh = Math.max(0, Math.round(baseSpeed + speedJitter));

          // Metrics calculation with failure injection effects
          const lidarFps = vehicle.injections.lidarFailure ? 5 : 30;
          const cameraFps = vehicle.injections.cameraOffline ? 0 : 60;
          const v2xLatencyMs = vehicle.injections.v2xLatencySpike ? Math.floor(280 + Math.random() * 45) : Math.floor(12 + Math.random() * 6);
          const canStatus = vehicle.injections.canBusInjection ? ('ANOMALY_0x0A2' as const) : ('NORMAL' as const);

          // Active anomalies list for summary
          const activeAnomalies: string[] = [];
          if (vehicle.injections.lidarFailure) activeAnomalies.push('LIDAR_DEGRADED_5FPS');
          if (vehicle.injections.v2xLatencySpike) activeAnomalies.push('V2X_LATENCY_300MS+');
          if (vehicle.injections.gpsSpoofing) activeAnomalies.push('GEOFENCE_BREACH');
          if (vehicle.injections.cameraOffline) activeAnomalies.push('CAMERA_OFFLINE_0FPS');
          if (vehicle.injections.canBusInjection) activeAnomalies.push('CAN_FRAME_0x0A2_OVERRIDE');

          const payload: TelemetryPayload = {
            vehicleId: vehicle.id,
            timestamp: new Date().toISOString(),
            tickIndex: vehicle.totalPacketsSent + 1,
            latitude: Number(lat.toFixed(6)),
            longitude: Number(lng.toFixed(6)),
            speedKmh,
            batteryPercent: Math.max(12, Math.round(92 - (vehicle.totalPacketsSent * 0.05))),
            headingDeg: Math.round((wpIndex * 45 + t * 45) % 360),
            lidarFps,
            cameraFps,
            v2xLatencyMs,
            geofenceStatus,
            canStatus,
            heartbeatSeq: vehicle.totalPacketsSent + 1,
            activeAnomalies,
          };

          // Append to telemetry logs
          setTelemetryLogs(logs => [payload, ...logs.slice(0, 99)]);

          // Optional remote HTTP ingestion forwarding
          if (config.forwardHttp) {
            fetch(`${config.targetApiUrl}/api/v1/telemetry/ingest`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            }).catch(() => {});
          }

          return {
            ...vehicle,
            lastHeartbeat: Date.now(),
            secondsSinceLastHeartbeat: 0,
            routeProgress: newProgress,
            totalPacketsSent: vehicle.totalPacketsSent + 1,
            lastTelemetry: payload,
          };
        });
      });
    }, config.intervalMs);

    return () => clearInterval(interval);
  }, [config.intervalMs, config.forwardHttp, config.targetApiUrl]);

  // Heartbeat Watchdog Timer (Runs every 1000ms to monitor timeouts)
  useEffect(() => {
    const watchdog = setInterval(() => {
      setVehicles(prevVehicles => {
        return prevVehicles.map(vehicle => {
          const secondsSince = Math.floor((Date.now() - vehicle.lastHeartbeat) / 1000);

          if (secondsSince >= config.heartbeatTimeoutSeconds && vehicle.lifecycleStatus === 'RUNNING') {
            // Trigger offline state and incident
            addIncident({
              vehicleId: vehicle.id,
              type: 'INC_HEARTBEAT_LOST',
              severity: 'CRITICAL',
              description: `[HEARTBEAT TIMEOUT] No telemetry from ${vehicle.name} (${vehicle.id}) for > ${secondsSince}s. Vehicle transitioned to VEH_OFFLINE.`,
            });

            return {
              ...vehicle,
              lifecycleStatus: 'OFFLINE',
              secondsSinceLastHeartbeat: secondsSince,
            };
          }

          return {
            ...vehicle,
            secondsSinceLastHeartbeat: secondsSince,
          };
        });
      });
    }, 1000);

    return () => clearInterval(watchdog);
  }, [config.heartbeatTimeoutSeconds, addIncident]);

  return (
    <SimulatorContext.Provider
      value={{
        vehicles,
        config,
        telemetryLogs,
        incidents,
        theme,
        toggleTheme,
        registerVehicle,
        deleteVehicle,
        setLifecycleStatus,
        toggleInjection,
        resetInjections,
        triggerHeartbeatTimeout,
        updateConfig,
        clearLogs,
        clearIncidents,
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
};

export const useSimulator = () => {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
};
