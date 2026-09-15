import { GEOFENCE_BOUNDS } from '../utils/presets';

export interface SvgCoordinate {
  x: number;
  y: number;
  isOutOfGeofence: boolean;
}

export const geoHelper = {
  /**
   * Checks if GPS coordinates violate the defined Gangnam Geofence
   */
  isOutOfGeofence(lat: number, lng: number): boolean {
    return (
      lat < GEOFENCE_BOUNDS.minLat ||
      lat > GEOFENCE_BOUNDS.maxLat ||
      lng < GEOFENCE_BOUNDS.minLng ||
      lng > GEOFENCE_BOUNDS.maxLng
    );
  },

  /**
   * Converts GPS (latitude, longitude) into 0..100% SVG coordinate percentage space
   */
  mapCoordinatesToSvg(lat: number, lng: number): SvgCoordinate {
    const minLat = GEOFENCE_BOUNDS.minLat;
    const maxLat = GEOFENCE_BOUNDS.maxLat;
    const minLng = GEOFENCE_BOUNDS.minLng;
    const maxLng = GEOFENCE_BOUNDS.maxLng;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100; // Invert Y for screen rendering

    const isOutOfGeofence = this.isOutOfGeofence(lat, lng);

    return {
      x: Math.max(2, Math.min(98, x)),
      y: Math.max(2, Math.min(98, y)),
      isOutOfGeofence,
    };
  },
};
