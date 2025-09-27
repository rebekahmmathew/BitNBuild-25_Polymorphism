import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Waypoint {
  address: string;
  coordinates: Coordinates;
  order?: number;
  estimatedTime?: number;
}

export interface OptimizedRoute {
  optimizedRoute: string[];
  waypoints: Waypoint[];
  totalDistance: number;
  totalTime: number;
}

export interface GeocodeResult {
  address: string;
  coordinates: Coordinates;
  formattedAddress: string;
}

// Geocode an address to get coordinates
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const result = response.data.results[0];
      return {
        address: address,
        coordinates: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        },
        formattedAddress: result.formatted_address
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Get distance matrix between multiple points
export async function getDistanceMatrix(origins: Coordinates[], destinations: Coordinates[]): Promise<any> {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    const originsStr = origins.map(coord => `${coord.lat},${coord.lng}`).join('|');
    const destinationsStr = destinations.map(coord => `${coord.lat},${coord.lng}`).join('|');

    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins: originsStr,
        destinations: destinationsStr,
        key: GOOGLE_MAPS_API_KEY,
        units: 'metric',
        mode: 'driving'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Distance matrix error:', error);
    return null;
  }
}

// Get optimized route using Google Maps Directions API
export async function getOptimizedRoute(
  origin: Coordinates,
  waypoints: Waypoint[],
  destination: Coordinates
): Promise<OptimizedRoute | null> {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    const waypointsStr = waypoints.map(wp => `${wp.coordinates.lat},${wp.coordinates.lng}`).join('|');
    const originStr = `${origin.lat},${origin.lng}`;
    const destinationStr = `${destination.lat},${destination.lng}`;

    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin: originStr,
        destination: destinationStr,
        waypoints: `optimize:true|${waypointsStr}`,
        key: GOOGLE_MAPS_API_KEY,
        mode: 'driving',
        avoid: 'tolls'
      }
    });

    if (response.data.status === 'OK' && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      const leg = route.legs[0];
      
      // Extract optimized waypoint order
      const optimizedWaypoints: Waypoint[] = [];
      const waypointOrder = route.waypoint_order || [];
      
      waypointOrder.forEach((orderIndex: number, index: number) => {
        const waypoint = waypoints[orderIndex];
        if (waypoint) {
          optimizedWaypoints.push({
            ...waypoint,
            order: index + 1,
            estimatedTime: route.legs[index + 1]?.duration?.value || 0
          });
        }
      });

      return {
        optimizedRoute: optimizedWaypoints.map(wp => wp.address),
        waypoints: optimizedWaypoints,
        totalDistance: route.legs.reduce((total: number, leg: any) => total + leg.distance.value, 0) / 1000, // Convert to km
        totalTime: route.legs.reduce((total: number, leg: any) => total + leg.duration.value, 0) / 60 // Convert to minutes
      };
    }

    return null;
  } catch (error) {
    console.error('Route optimization error:', error);
    return null;
  }
}

// Get ETA for a specific route
export async function getETA(origin: Coordinates, destination: Coordinates): Promise<number | null> {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        key: GOOGLE_MAPS_API_KEY,
        mode: 'driving',
        departure_time: 'now'
      }
    });

    if (response.data.status === 'OK' && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      return route.legs[0].duration.value / 60; // Convert to minutes
    }

    return null;
  } catch (error) {
    console.error('ETA calculation error:', error);
    return null;
  }
}

// Get current traffic conditions
export async function getTrafficConditions(coordinates: Coordinates): Promise<any> {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/roads/snapToRoads', {
      params: {
        path: `${coordinates.lat},${coordinates.lng}`,
        key: GOOGLE_MAPS_API_KEY
      }
    });

    return response.data;
  } catch (error) {
    console.error('Traffic conditions error:', error);
    return null;
  }
}

// Simple TSP implementation for fallback
export function simpleTSP(waypoints: Waypoint[]): Waypoint[] {
  if (waypoints.length <= 1) return waypoints;

  // Simple nearest neighbor algorithm
  const result: Waypoint[] = [];
  const remaining = [...waypoints];
  let current = remaining.shift()!;
  result.push(current);

  while (remaining.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = calculateDistance(current.coordinates, remaining[0].coordinates);

    for (let i = 1; i < remaining.length; i++) {
      const distance = calculateDistance(current.coordinates, remaining[i].coordinates);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    current = remaining.splice(nearestIndex, 1)[0];
    result.push(current);
  }

  return result;
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
