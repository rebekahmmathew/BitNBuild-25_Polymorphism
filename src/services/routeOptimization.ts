import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyCseHoECDuGyH1atjLlTWDJBQKhQRI2HWU'; // Using the same API key as provided
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface DeliveryLocation {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  type: 'customer' | 'vendor' | 'delivery_staff';
  status?: 'active' | 'delivered' | 'pending';
  eta?: string;
  priority?: number;
  timeWindow?: { start: string; end: string };
}

export interface OptimizedRoute {
  route: DeliveryLocation[];
  totalDistance: number;
  totalTime: number;
  efficiency: number;
  waypoints: { lat: number; lng: number }[];
}

export class RouteOptimizationService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async optimizeRoute(
    startLocation: DeliveryLocation,
    deliveryLocations: DeliveryLocation[],
    vehicleCapacity: number = 10
  ): Promise<OptimizedRoute> {
    try {
      // Prepare location data for Gemini
      const locationsData = [
        {
          id: startLocation.id,
          name: startLocation.name,
          coordinates: startLocation.coordinates,
          type: startLocation.type,
          priority: 0
        },
        ...deliveryLocations.map(loc => ({
          id: loc.id,
          name: loc.name,
          coordinates: loc.coordinates,
          type: loc.type,
          priority: loc.priority || 1,
          timeWindow: loc.timeWindow
        }))
      ];

      const prompt = `
        You are an AI route optimization expert. Optimize the delivery route for a food delivery service in Mumbai.
        
        Start Location: ${startLocation.name} at ${startLocation.coordinates.lat}, ${startLocation.coordinates.lng}
        
        Delivery Locations:
        ${locationsData.map((loc, index) => 
          `${index + 1}. ${loc.name} - Lat: ${loc.coordinates.lat}, Lng: ${loc.coordinates.lng} (Priority: ${loc.priority})`
        ).join('\n')}
        
        Vehicle Capacity: ${vehicleCapacity} deliveries
        
        Please provide an optimized route considering:
        1. Traveling Salesman Problem (TSP) optimization
        2. Mumbai traffic patterns and road conditions
        3. Delivery time windows and priorities
        4. Realistic travel times between locations
        5. Fuel efficiency and distance minimization
        
        Return the response in this JSON format:
        {
          "optimizedOrder": [1, 3, 2, 5, 4, 6],
          "totalDistance": 45.2,
          "totalTime": 180,
          "efficiency": 0.85,
          "reasoning": "Route optimized based on traffic patterns and delivery priorities"
        }
        
        The optimizedOrder should be an array of indices (0-based) representing the optimal sequence.
        Total distance in kilometers, total time in minutes.
        Efficiency score between 0-1 (higher is better).
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }
      
      const optimizationResult = JSON.parse(jsonMatch[0]);
      
      // Create optimized route
      const optimizedRoute: DeliveryLocation[] = [
        startLocation,
        ...optimizationResult.optimizedOrder.map((index: number) => 
          deliveryLocations[index - 1] // Adjust for 0-based indexing
        ).filter(Boolean)
      ];

      // Generate waypoints for the route
      const waypoints = optimizedRoute.map(loc => loc.coordinates);

      return {
        route: optimizedRoute,
        totalDistance: optimizationResult.totalDistance,
        totalTime: optimizationResult.totalTime,
        efficiency: optimizationResult.efficiency,
        waypoints
      };

    } catch (error) {
      console.error('Route optimization error:', error);
      
      // Fallback to simple distance-based optimization
      return this.fallbackOptimization(startLocation, deliveryLocations);
    }
  }

  private fallbackOptimization(
    startLocation: DeliveryLocation,
    deliveryLocations: DeliveryLocation[]
  ): OptimizedRoute {
    // Simple nearest neighbor algorithm as fallback
    const unvisited = [...deliveryLocations];
    const route = [startLocation];
    let currentLocation = startLocation;
    let totalDistance = 0;

    while (unvisited.length > 0) {
      let nearestIndex = 0;
      let nearestDistance = this.calculateDistance(
        currentLocation.coordinates,
        unvisited[0].coordinates
      );

      for (let i = 1; i < unvisited.length; i++) {
        const distance = this.calculateDistance(
          currentLocation.coordinates,
          unvisited[i].coordinates
        );
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }

      const nearestLocation = unvisited.splice(nearestIndex, 1)[0];
      route.push(nearestLocation);
      totalDistance += nearestDistance;
      currentLocation = nearestLocation;
    }

    const waypoints = route.map(loc => loc.coordinates);
    const totalTime = totalDistance * 2; // Assume 2 minutes per km in Mumbai traffic

    return {
      route,
      totalDistance: Math.round(totalDistance * 100) / 100,
      totalTime: Math.round(totalTime),
      efficiency: 0.7, // Lower efficiency for fallback
      waypoints
    };
  }

  private calculateDistance(
    coord1: { lat: number; lng: number },
    coord2: { lat: number; lng: number }
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(coord2.lat - coord1.lat);
    const dLon = this.deg2rad(coord2.lng - coord1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(coord1.lat)) *
        Math.cos(this.deg2rad(coord2.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Calculate ETA for a specific location
  calculateETA(
    currentLocation: { lat: number; lng: number },
    targetLocation: { lat: number; lng: number },
    currentTime: Date = new Date()
  ): Date {
    const distance = this.calculateDistance(currentLocation, targetLocation);
    const averageSpeed = 25; // km/h in Mumbai traffic
    const travelTimeMinutes = (distance / averageSpeed) * 60;
    
    const eta = new Date(currentTime.getTime() + travelTimeMinutes * 60000);
    return eta;
  }

  // Get real-time traffic adjustment factor
  getTrafficAdjustment(): number {
    const hour = new Date().getHours();
    
    // Peak hours in Mumbai: 8-10 AM, 6-8 PM
    if ((hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 20)) {
      return 1.5; // 50% slower during peak hours
    }
    
    // Night hours: 11 PM - 6 AM
    if (hour >= 23 || hour <= 6) {
      return 0.8; // 20% faster during night
    }
    
    return 1.0; // Normal speed
  }
}

export const routeOptimizationService = new RouteOptimizationService();
