import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { routeOptimizationService, OptimizedRoute } from '../services/routeOptimization';
import { deliveryTrackingService, DeliveryUpdate } from '../services/deliveryTracking';

interface MapLocation {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  type: 'customer' | 'vendor' | 'delivery_staff';
  status?: 'active' | 'delivered' | 'pending';
  eta?: string;
}

interface GoogleMapProps {
  locations: MapLocation[];
  centerLocation?: { lat: number; lng: number };
  showRoute?: boolean;
  isDeliveryView?: boolean;
  onLocationClick?: (location: MapLocation) => void;
  mapZoom?: number;
  onMapLoad?: (map: google.maps.Map) => void;
  enableRouteOptimization?: boolean;
  enableRealTimeTracking?: boolean;
  deliveryStaffId?: string;
}

const MapComponent: React.FC<GoogleMapProps> = ({
  locations,
  centerLocation = { lat: 19.0760, lng: 72.8777 }, // Mumbai coordinates
  showRoute = false,
  isDeliveryView = false,
  onLocationClick,
  mapZoom = 12,
  onMapLoad,
  enableRouteOptimization = false,
  enableRealTimeTracking = false,
  deliveryStaffId
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState<DeliveryUpdate[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Initialize map
    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: centerLocation,
      zoom: mapZoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    // Initialize services
    directionsServiceRef.current = new google.maps.DirectionsService();
    directionsRendererRef.current = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#3b82f6',
        strokeWeight: 4,
        strokeOpacity: 0.8
      }
    });
    directionsRendererRef.current.setMap(mapInstance.current);

    // Initialize info window
    infoWindowRef.current = new google.maps.InfoWindow();

    // Call onMapLoad callback
    onMapLoad?.(mapInstance.current);
  }, [centerLocation, mapZoom, onMapLoad]);

  // Route optimization effect
  useEffect(() => {
    if (!enableRouteOptimization || !mapInstance.current || locations.length < 2) return;

    const optimizeRoute = async () => {
      try {
        const deliveryStaffLocation = locations.find(loc => loc.type === 'delivery_staff');
        const deliveryLocations = locations.filter(loc => loc.type === 'customer' && loc.status !== 'delivered');
        
        if (deliveryStaffLocation && deliveryLocations.length > 0) {
          const optimized = await routeOptimizationService.optimizeRoute(
            deliveryStaffLocation,
            deliveryLocations
          );
          setOptimizedRoute(optimized);
          
          // Display optimized route on map
          if (directionsServiceRef.current && directionsRendererRef.current) {
            const waypoints = optimized.waypoints.slice(1, -1).map(coord => ({
              location: new google.maps.LatLng(coord.lat, coord.lng),
              stopover: true
            }));

            directionsServiceRef.current.route({
              origin: optimized.waypoints[0],
              destination: optimized.waypoints[optimized.waypoints.length - 1],
              waypoints: waypoints,
              travelMode: google.maps.TravelMode.DRIVING,
              optimizeWaypoints: false
            }, (result, status) => {
              if (status === 'OK' && result) {
                directionsRendererRef.current!.setDirections(result);
              }
            });
          }
        }
      } catch (error) {
        console.error('Route optimization failed:', error);
      }
    };

    optimizeRoute();
  }, [enableRouteOptimization, locations]);

  // Real-time tracking effect
  useEffect(() => {
    if (!enableRealTimeTracking || !deliveryStaffId) return;

    const updateTracking = () => {
      const updates = deliveryTrackingService.getDeliveryHistory(deliveryStaffId);
      setRealTimeUpdates(updates);
    };

    // Initial update
    updateTracking();

    // Update every 5 seconds
    const interval = setInterval(updateTracking, 5000);
    return () => clearInterval(interval);
  }, [enableRealTimeTracking, deliveryStaffId]);

  // Update markers when locations change
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Create new markers
    locations.forEach((location) => {
      // Get real-time location if tracking is enabled
      let markerPosition = location.coordinates;
      if (enableRealTimeTracking && deliveryStaffId && location.type === 'delivery_staff') {
        const currentLocation = deliveryTrackingService.getCurrentLocation(deliveryStaffId);
        if (currentLocation) {
          markerPosition = currentLocation;
        }
      }

      const marker = new google.maps.Marker({
        position: markerPosition,
        map: mapInstance.current,
        title: location.name,
        icon: {
          url: getMarkerIcon(location),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 32)
        },
        animation: enableRealTimeTracking && location.type === 'delivery_staff' ? 
          google.maps.Animation.BOUNCE : undefined
      });

      // Add click listener
      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(createInfoWindowContent(location));
          infoWindowRef.current.open(mapInstance.current, marker);
        }
        onLocationClick?.(location);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (locations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      locations.forEach(location => {
        bounds.extend(location.coordinates);
      });
      mapInstance.current.fitBounds(bounds);
    }
  }, [locations, onLocationClick, enableRealTimeTracking, deliveryStaffId, realTimeUpdates]);

  // Update map center and zoom
  useEffect(() => {
    if (!mapInstance.current) return;
    
    mapInstance.current.setCenter(centerLocation);
    mapInstance.current.setZoom(mapZoom);
  }, [centerLocation, mapZoom]);

  const getMarkerIcon = (location: MapLocation): string => {
    const baseUrl = 'data:image/svg+xml;charset=UTF-8,';
    const svg = `
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="${getMarkerColor(location)}" stroke="white" stroke-width="2"/>
        <text x="16" y="20" text-anchor="middle" fill="white" font-size="16" font-family="Arial">
          ${getMarkerEmoji(location)}
        </text>
      </svg>
    `;
    return baseUrl + encodeURIComponent(svg);
  };

  const getMarkerColor = (location: MapLocation): string => {
    switch (location.type) {
      case 'vendor':
        return '#f97316'; // orange-500
      case 'delivery_staff':
        return '#3b82f6'; // blue-500
      case 'customer':
        if (location.status === 'delivered') return '#10b981'; // green-500
        if (location.status === 'pending') return '#f59e0b'; // yellow-500
        return '#ef4444'; // red-500
      default:
        return '#6b7280'; // gray-500
    }
  };

  const getMarkerEmoji = (location: MapLocation): string => {
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

  const createInfoWindowContent = (location: MapLocation): string => {
    let realTimeInfo = '';
    let optimizationInfo = '';
    
    if (enableRealTimeTracking && location.type === 'delivery_staff') {
      const latestUpdate = realTimeUpdates[realTimeUpdates.length - 1];
      if (latestUpdate) {
        realTimeInfo = `
          <div style="background: #f0f9ff; padding: 8px; border-radius: 4px; margin: 8px 0; border-left: 3px solid #3b82f6;">
            <div style="font-size: 12px; color: #1e40af; font-weight: bold;">LIVE TRACKING</div>
            <div style="font-size: 11px; color: #666; margin: 2px 0;">
              Speed: ${latestUpdate.speed.toFixed(1)} km/h
            </div>
            <div style="font-size: 11px; color: #666; margin: 2px 0;">
              ETA: ${latestUpdate.eta.toLocaleTimeString()}
            </div>
            <div style="font-size: 11px; color: #666; margin: 2px 0;">
              Last Update: ${latestUpdate.timestamp.toLocaleTimeString()}
            </div>
          </div>
        `;
      }
    }

    if (optimizedRoute) {
      if (location.type === 'delivery_staff') {
        optimizationInfo = `
          <div style="background: #f0fdf4; padding: 8px; border-radius: 4px; margin: 8px 0; border-left: 3px solid #10b981;">
            <div style="font-size: 12px; color: #059669; font-weight: bold;">AI ROUTE OPTIMIZED</div>
            <div style="font-size: 11px; color: #666; margin: 2px 0;">
              Total Distance: ${optimizedRoute.totalDistance} km
            </div>
            <div style="font-size: 11px; color: #666; margin: 2px 0;">
              Estimated Time: ${optimizedRoute.totalTime} mins
            </div>
            <div style="font-size: 11px; color: #666; margin: 2px 0;">
              Efficiency: ${(optimizedRoute.efficiency * 100).toFixed(1)}%
            </div>
            <div style="font-size: 11px; color: #666; margin: 2px 0;">
              Deliveries: ${optimizedRoute.route.length - 1}
            </div>
          </div>
        `;
      } else if (location.type === 'customer') {
        const deliveryIndex = optimizedRoute.route.findIndex(route => route.id === location.id);
        if (deliveryIndex > 0) {
          optimizationInfo = `
            <div style="background: #fef3c7; padding: 8px; border-radius: 4px; margin: 8px 0; border-left: 3px solid #f59e0b;">
              <div style="font-size: 12px; color: #92400e; font-weight: bold;">DELIVERY ROUTE ORDER</div>
              <div style="font-size: 11px; color: #666; margin: 2px 0;">
                Position: ${deliveryIndex} of ${optimizedRoute.route.length - 1}
              </div>
              <div style="font-size: 11px; color: #666; margin: 2px 0;">
                Click for detailed directions
              </div>
            </div>
          `;
        }
      }
    }

    return `
      <div style="padding: 8px; min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${location.name}</h3>
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${location.address}</p>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="background: ${getMarkerColor(location)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; text-transform: capitalize;">
            ${location.type}${location.status ? ` - ${location.status}` : ''}
          </span>
          ${location.eta ? `<span style="color: #666; font-size: 12px;">ETA: ${location.eta}</span>` : ''}
        </div>
        ${realTimeInfo}
        ${optimizationInfo}
      </div>
    `;
  };

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center h-full bg-red-50">
          <div className="text-center">
            <div className="text-red-600 mb-2">⚠️</div>
            <p className="text-sm text-red-600">Failed to load map</p>
            <p className="text-xs text-gray-500 mt-1">Please check your internet connection</p>
          </div>
        </div>
      );
    default:
      return null;
  }
};

const GoogleMap: React.FC<GoogleMapProps> = (props) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const handleMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  return (
    <Wrapper
      apiKey="AIzaSyCseHoECDuGyH1atjLlTWDJBQKhQRI2HWU"
      render={render}
      libraries={['geometry']}
    >
      <MapComponent {...props} onMapLoad={handleMapLoad} />
    </Wrapper>
  );
};

export default GoogleMap;
