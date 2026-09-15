import { NextResponse } from 'next/server';

// Mock in-memory vehicle store for direct API requests
let mockVehicles = [
  {
    vehicleId: 'VEH-42-012',
    name: 'Gangnam RoboTaxi 012',
    type: 'ROBOTAXI',
    vin: 'KN4CG2026TX01298',
    status: 'ACTIVE',
    registeredAt: new Date().toISOString(),
  },
  {
    vehicleId: 'VEH-42-089',
    name: 'Teheran-ro Shuttle S-89',
    type: 'SHUTTLE',
    vin: 'KN4CG2026SH08933',
    status: 'ACTIVE',
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
      vehicleId: body.vehicleId || `VEH-42-${Math.floor(100 + Math.random() * 900)}`,
      name: body.name || 'Provisioned Unit',
      type: body.type || 'ROBOTAXI',
      vin: body.vin || `KN4CG2026${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'ACTIVE',
      sensors: body.sensors || [],
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
