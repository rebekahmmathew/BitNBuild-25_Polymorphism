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
import GoogleMap from './GoogleMap';

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
  centerLocation = { lat: 19.0760, lng: 72.8777 }, // Default to Mumbai
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
        <div className={`relative ${
          isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-64 sm:h-80'
        }`}>
          {/* Google Maps Integration */}
          <GoogleMap
            locations={locations}
            centerLocation={centerLocation}
            showRoute={showRoute}
            isDeliveryView={isDeliveryView}
            onLocationClick={(location) => {
              setSelectedLocation(location);
              onLocationClick?.(location);
            }}
            mapZoom={mapZoom}
          />

          {/* Map Controls Overlay */}
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