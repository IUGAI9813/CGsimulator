import { NextResponse } from 'next/server';

// Mock in-memory vehicle store for direct API requests
let mockVehicles = [
  {
    vehicleId: 'ROBOTAXI-105',
    vehicleType: 'ROBOTAXI',
    vin: 'KN4CG2026TX10501',
    model: 'Hyundai IONIQ 5 Robotaxi',
    status: 'VEH_ACTIVE',
    speedLimit: 60.0,
    assignedZone: 'Gangnam District',
    firmwareVersion: 'v2.4.1',
    latitude: 37.4979,
    longitude: 127.0276,
    devices: [
      {
        deviceId: 'DEV-ROBOTAXI-105-LIDAR-01',
        deviceType: 'DEV_LIDAR',
        serialNumber: 'SN-LIDAR-88319',
        status: 'DEV_ONLINE',
        firmwareVersion: 'v1.12.0',
      },
      {
        deviceId: 'DEV-ROBOTAXI-105-RADAR-01',
        deviceType: 'DEV_RADAR',
        serialNumber: 'SN-RADAR-44120',
        status: 'DEV_ONLINE',
        firmwareVersion: 'v2.0.1',
      },
      {
        deviceId: 'DEV-ROBOTAXI-105-CAMERA-01',
        deviceType: 'DEV_CAMERA',
        serialNumber: 'SN-CAM-10928',
        status: 'DEV_ONLINE',
        firmwareVersion: 'v3.1.0',
      },
      {
        deviceId: 'DEV-ROBOTAXI-105-V2X-01',
        deviceType: 'DEV_V2X',
        serialNumber: 'SN-V2X-99012',
        status: 'DEV_ONLINE',
        firmwareVersion: 'v1.5.2',
      },
    ],
    registeredAt: new Date().toISOString(),
  },
  {
    vehicleId: 'SHUTTLE-089',
    vehicleType: 'SHUTTLE',
    vin: 'KN4CG2026SH08933',
    model: 'Hyundai Solati Autonomous Shuttle',
    status: 'VEH_ACTIVE',
    speedLimit: 40.0,
    assignedZone: 'Teheran-ro Autonomous Corridor',
    firmwareVersion: 'v3.1.0',
    latitude: 37.5045,
    longitude: 127.0490,
    devices: [],
    registeredAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json({
    status: 'SUCCESS',
    timestamp: new Date().toISOString(),
    total: mockVehicles.length,
    data: mockVehicles,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newVehicle = {
      vehicleId: body.vehicleId || `ROBOTAXI-${Math.floor(100 + Math.random() * 900)}`,
      vehicleType: body.vehicleType || body.type || 'ROBOTAXI',
      vin: body.vin || `KN4CG2026TX${Math.floor(100 + Math.random() * 900)}01`,
      model: body.model || 'Hyundai IONIQ 5 Robotaxi',
      status: body.status || 'VEH_ACTIVE',
      speedLimit: typeof body.speedLimit === 'number' ? body.speedLimit : 60.0,
      assignedZone: body.assignedZone || 'Gangnam District',
      firmwareVersion: body.firmwareVersion || 'v2.4.1',
      latitude: typeof body.latitude === 'number' ? body.latitude : 37.4979,
      longitude: typeof body.longitude === 'number' ? body.longitude : 127.0276,
      devices: body.devices || body.sensors || [],
      registeredAt: new Date().toISOString(),
    };

    mockVehicles.push(newVehicle);

    return NextResponse.json({
      status: 'SUCCESS',
      code: 'VEHICLE_REGISTERED',
      message: `Vehicle ${newVehicle.vehicleId} registered successfully in CoreGuard fleet database.`,
      vehicle: newVehicle,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({
      status: 'ERROR',
      message: err.message || 'Invalid registration payload',
    }, { status: 400 });
  }
}

