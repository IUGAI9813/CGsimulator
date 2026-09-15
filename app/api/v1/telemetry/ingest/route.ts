import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Check for critical anomalies in the incoming payload
    const anomalies: string[] = [];
    if (payload.lidarFps < 10) anomalies.push('LIDAR_DEGRADED');
    if (payload.cameraFps === 0) anomalies.push('CAMERA_OFFLINE');
    if (payload.v2xLatencyMs > 200) anomalies.push('V2X_LATENCY_CRITICAL');
    if (payload.geofenceStatus === 'BREACHED') anomalies.push('GEOFENCE_BREACHED');
    if (payload.canStatus === 'ANOMALY_0x0A2') anomalies.push('CAN_INJECTION_DETECTED');

    return NextResponse.json({
      status: 'INGESTED',
      ackSeq: payload.heartbeatSeq || Date.now(),
      vehicleId: payload.vehicleId,
      serverTimestamp: new Date().toISOString(),
      anomaliesDetected: anomalies.length > 0,
      anomalies,
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({
      status: 'ERROR',
      message: err.message || 'Invalid telemetry format',
    }, { status: 400 });
  }
}
