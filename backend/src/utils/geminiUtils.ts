import { createGenAI } from '../config/gemini';

export interface RouteOptimizationRequest {
  addresses: Array<{
    address: string;
    coordinates: { lat: number; lng: number };
    priority: 'high' | 'medium' | 'low';
    timeWindow?: { start: string; end: string };
  }>;
  trafficConditions?: string;
  weatherConditions?: string;
  vehicleCapacity?: number;
}

export interface OptimizedRoute {
  optimizedRoute: Array<{
    address: string;
    coordinates: { lat: number; lng: number };
    order: number;
    estimatedTime: number;
    priority: string;
  }>;
  totalDistance: number;
  totalTime: number;
  efficiency: number;
  recommendations: string[];
}

export async function optimizeRouteWithAI(request: RouteOptimizationRequest): Promise<OptimizedRoute> {
  try {
    let model: any;
    try {
      const genAI = createGenAI();
      model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    } catch (e) {
      console.warn('Gemini API not configured; using fallback optimization.');
      throw e; // let caller fallback
    }
    
    const prompt = `
    You are an AI route optimization expert for a tiffin delivery service in India. 
    Optimize the delivery route for the following addresses considering traffic, weather, and priority.
    
    Addresses: ${JSON.stringify(request.addresses)}
    Traffic Conditions: ${request.trafficConditions || 'Normal'}
    Weather Conditions: ${request.weatherConditions || 'Clear'}
    Vehicle Capacity: ${request.vehicleCapacity || 'Unlimited'}
    
    Consider:
    1. Traffic patterns in Indian cities (peak hours, congestion zones)
    2. Weather impact on delivery times
    3. Priority levels (high priority customers first)
    4. Time windows for deliveries
    5. Distance optimization using TSP principles
    6. Local knowledge of Indian road networks
    
    Return a JSON response with this exact structure:
    {
      "optimizedRoute": [
        {
          "address": "string",
          "coordinates": {"lat": number, "lng": number},
          "order": number,
          "estimatedTime": number,
          "priority": "string"
        }
      ],
      "totalDistance": number,
      "totalTime": number,
      "efficiency": number,
      "recommendations": ["string"]
    }
    `;

  const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }
    
    const optimizedRoute: OptimizedRoute = JSON.parse(jsonMatch[0]);
    return optimizedRoute;
    
  } catch (error) {
    console.error('Error in Gemini route optimization:', error);
    // Fallback to simple heuristic optimization
    return fallbackRouteOptimization(request);
  }
}

function fallbackRouteOptimization(request: RouteOptimizationRequest): OptimizedRoute {
  // Simple heuristic: sort by priority, then by distance from a central point
  const sortedAddresses = request.addresses.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    // Simple distance-based sorting (could be improved with actual distance calculation)
    return a.coordinates.lat - b.coordinates.lat;
  });

  const optimizedRoute = sortedAddresses.map((addr, index) => ({
    address: addr.address,
    coordinates: addr.coordinates,
    order: index + 1,
    estimatedTime: 15 + (index * 5), // 15 minutes base + 5 minutes per stop
    priority: addr.priority
  }));

  return {
    optimizedRoute,
    totalDistance: optimizedRoute.length * 2.5, // Rough estimate
    totalTime: optimizedRoute.reduce((sum, stop) => sum + stop.estimatedTime, 0),
    efficiency: 0.85, // Placeholder
    recommendations: [
      'Consider traffic patterns during peak hours',
      'Group deliveries by area for better efficiency',
      'Use real-time traffic data for dynamic routing'
    ]
  };
}

export async function generateMenuRecommendations(menuItems: string[], preferences: any): Promise<string[]> {
  try {
    let model2: any;
    try {
      const genAI = createGenAI();
      model2 = genAI.getGenerativeModel({ model: 'gemini-pro' });
    } catch (e) {
      console.warn('Gemini API not configured; returning default recommendations.');
      throw e;
    }
    
    const prompt = `
    Generate menu recommendations for a tiffin service in India based on:
    Current menu items: ${JSON.stringify(menuItems)}
    Customer preferences: ${JSON.stringify(preferences)}
    
    Consider:
    1. Indian cuisine variety and regional specialties
    2. Nutritional balance
    3. Seasonal availability
    4. Customer dietary restrictions
    5. Popular tiffin combinations
    
    Return 5-7 specific menu recommendations as an array of strings.
    `;

  const result2 = await model2.generateContent(prompt);
  const response2 = await result2.response;
  const text = response2.text();
    
    // Extract recommendations from response
  const lines = text.split('\n').filter((line: string) => line.trim());
    return lines.slice(0, 7);
    
  } catch (error) {
    console.error('Error generating menu recommendations:', error);
    return [
      'Dal Rice with Sabzi',
      'Chicken Curry with Roti',
      'Vegetable Biryani',
      'Rajma Chawal',
      'Paneer Butter Masala with Naan'
    ];
  }
}
