import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Navigation, 
  Truck, 
  Clock, 
  Route,
  ZoomIn,
  ZoomOut,
  Maximize,
  Users,
  Target
} from 'lucide-react';

interface MapLocation {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  type: 'customer' | 'vendor' | 'delivery_staff';
  status?: 'active' | 'delivered' | 'pending';
  eta?: string;
}

interface LiveMapProps {
  locations: MapLocation[];
  centerLocation?: { lat: number; lng: number };
  showRoute?: boolean;
  isDeliveryView?: boolean;
  onLocationClick?: (location: MapLocation) => void;
}

export default function LiveMap({ 
  locations, 
  centerLocation = { lat: 12.9716, lng: 77.5946 }, // Default to Bangalore
  showRoute = false,
  isDeliveryView = false,
  onLocationClick 
}: LiveMapProps) {
  const [mapZoom, setMapZoom] = useState(12);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Simulate real-time location updates
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would fetch live location data
      console.log('Updating live locations...');
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getLocationIcon = (location: MapLocation) => {
    switch (location.type) {
      case 'vendor':
        return '🏪';
      case 'delivery_staff':
        return '🚚';
      case 'customer':
        return location.status === 'delivered' ? '✅' : location.status === 'pending' ? '📍' : '🎯';
      default:
        return '📍';
    }
  };

  const getLocationColor = (location: MapLocation) => {
    switch (location.type) {
      case 'vendor':
        return 'bg-orange-500';
      case 'delivery_staff':
        return 'bg-blue-500';
      case 'customer':
        if (location.status === 'delivered') return 'bg-green-500';
        if (location.status === 'pending') return 'bg-yellow-500';
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Simulate map bounds based on locations
  const calculateMapBounds = () => {
    if (locations.length === 0) return null;
    
    const lats = locations.map(loc => loc.coordinates.lat);
    const lngs = locations.map(loc => loc.coordinates.lng);
    
    return {
      north: Math.max(...lats) + 0.01,
      south: Math.min(...lats) - 0.01,
      east: Math.max(...lngs) + 0.01,
      west: Math.min(...lngs) - 0.01
    };
  };

  return (
    <Card className={isFullscreen ? 'fixed inset-4 z-50' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              {isDeliveryView ? 'Live Delivery Tracking' : 'Live Operations Map'}
            </CardTitle>
            <CardDescription>
              {isDeliveryView 
                ? 'Real-time delivery locations and routes' 
                : 'Track all delivery staff and customer locations'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMapZoom(Math.max(8, mapZoom - 1))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMapZoom(Math.min(18, mapZoom + 1))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Map Container */}
        <div className={`relative bg-gradient-to-br from-blue-50 to-green-50 border-2 border-dashed border-gray-300 ${
          isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-64 sm:h-80'
        }`}>
          {/* Simulated Map Background */}
          <div className="absolute inset-0 bg-gray-100 opacity-50">
            <svg className="w-full h-full" viewBox="0 0 400 300">
              {/* Grid lines to simulate map */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Simulated roads */}
              <path d="M0,100 Q100,80 200,100 T400,100" stroke="#94a3b8" strokeWidth="3" fill="none" />
              <path d="M100,0 Q120,100 100,200 T100,300" stroke="#94a3b8" strokeWidth="3" fill="none" />
              <path d="M200,0 Q220,150 200,300" stroke="#94a3b8" strokeWidth="2" fill="none" />
            </svg>
          </div>

          {/* Location Markers */}
          {locations.map((location, index) => {
            // Convert lat/lng to approximate pixel positions (simplified)
            const x = ((location.coordinates.lng - centerLocation.lng + 0.1) / 0.2) * 100;
            const y = ((centerLocation.lat - location.coordinates.lat + 0.1) / 0.2) * 100;
            
            return (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ 
                  left: `${Math.max(5, Math.min(95, x))}%`, 
                  top: `${Math.max(5, Math.min(95, y))}%` 
                }}
                onClick={() => {
                  setSelectedLocation(location);
                  onLocationClick?.(location);
                }}
              >
                <div className={`w-8 h-8 rounded-full ${getLocationColor(location)} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-sm">{getLocationIcon(location)}</span>
                </div>
                
                {/* Location tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {location.name}
                  {location.eta && <div>ETA: {location.eta}</div>}
                </div>
              </div>
            );
          })}

          {/* Route lines (if showRoute is true) */}
          {showRoute && locations.length > 1 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {locations.slice(0, -1).map((location, index) => {
                const nextLocation = locations[index + 1];
                const x1 = ((location.coordinates.lng - centerLocation.lng + 0.1) / 0.2) * 100;
                const y1 = ((centerLocation.lat - location.coordinates.lat + 0.1) / 0.2) * 100;
                const x2 = ((nextLocation.coordinates.lng - centerLocation.lng + 0.1) / 0.2) * 100;
                const y2 = ((centerLocation.lat - nextLocation.coordinates.lat + 0.1) / 0.2) * 100;
                
                return (
                  <line
                    key={`route-${index}`}
                    x1={`${Math.max(5, Math.min(95, x1))}%`}
                    y1={`${Math.max(5, Math.min(95, y1))}%`}
                    x2={`${Math.max(5, Math.min(95, x2))}%`}
                    y2={`${Math.max(5, Math.min(95, y2))}%`}
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                );
              })}
            </svg>
          )}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-md">
            <div className="text-xs text-gray-600">Zoom: {mapZoom}</div>
            <div className="text-xs text-gray-600">{locations.length} locations</div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
            <h4 className="text-xs font-semibold mb-2">Legend</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Vendor</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Delivery Staff</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Delivered</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Location Details */}
        {selectedLocation && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{selectedLocation.name}</h4>
                <p className="text-sm text-gray-600">{selectedLocation.address}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={selectedLocation.status === 'delivered' ? 'default' : 'secondary'}>
                    {selectedLocation.type} {selectedLocation.status && `- ${selectedLocation.status}`}
                  </Badge>
                  {selectedLocation.eta && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      ETA: {selectedLocation.eta}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Navigation className="h-4 w-4 mr-1" />
                  Navigate
                </Button>
                <Button size="sm" variant="outline">
                  <Target className="h-4 w-4 mr-1" />
                  Center
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Map Statistics */}
        <div className="flex items-center justify-between p-4 border-t bg-white">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {locations.length} locations
            </span>
            {showRoute && (
              <span className="flex items-center gap-1">
                <Route className="h-4 w-4" />
                Route optimized
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              // Simulate refreshing map data
              console.log('Refreshing map data...');
            }}
          >
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}