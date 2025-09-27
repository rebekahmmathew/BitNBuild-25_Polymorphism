import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, InfoWindow } from '@react-google-maps/api';
import { toast } from 'react-hot-toast';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 19.0760,
  lng: 72.8777,
};

interface Delivery {
  id: string;
  address: string;
  coordinates: { lat: number; lng: number };
  status: string;
  customerName?: string;
  estimatedTime?: number;
}

interface GoogleMapsRouteProps {
  deliveries: Delivery[];
  onRouteOptimized?: (optimizedDeliveries: Delivery[]) => void;
  vendorLocation?: { lat: number; lng: number };
}

const GoogleMapsRoute: React.FC<GoogleMapsRouteProps> = ({
  deliveries,
  onRouteOptimized,
  vendorLocation
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedDeliveries, setOptimizedDeliveries] = useState<Delivery[]>(deliveries);

  const mapsKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: mapsKey,
    libraries: ['places', 'geometry']
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const optimizeRoute = async () => {
    if (deliveries.length < 2) {
      toast.error('At least 2 deliveries required for route optimization');
      return;
    }

    setIsOptimizing(true);
    try {
      const deliveryIds = deliveries.map(d => d.id);
  const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '';
  const response = await fetch(`${API_BASE}/ai/optimize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'vendor_1' // Demo vendor ID
        },
        body: JSON.stringify({
          deliveryIds,
          vendorLocation: vendorLocation || center
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Reorder deliveries based on optimized route
        const orderedDeliveries = data.optimizedRoute.optimizedRoute.map((address: string) => 
          deliveries.find(d => d.address === address)
        ).filter(Boolean) as Delivery[];

        setOptimizedDeliveries(orderedDeliveries);
        onRouteOptimized?.(orderedDeliveries);
        
        // Create directions for optimized route
        if (map && orderedDeliveries.length > 1) {
          const directionsService = new google.maps.DirectionsService();
          const waypoints = orderedDeliveries.slice(1, -1).map(delivery => ({
            location: delivery.coordinates,
            stopover: true
          }));

          directionsService.route(
            {
              origin: vendorLocation || orderedDeliveries[0].coordinates,
              destination: orderedDeliveries[orderedDeliveries.length - 1].coordinates,
              waypoints,
              travelMode: google.maps.TravelMode.DRIVING,
              optimizeWaypoints: true
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK && result) {
                setDirections(result);
              }
            }
          );
        }

        toast.success(`Route optimized! ${data.optimizationMethod} - ${data.estimatedTime}min, ${data.estimatedDistance}km`);
      } else {
        toast.error(data.error || 'Failed to optimize route');
      }
    } catch (error) {
      console.error('Route optimization error:', error);
      toast.error('Failed to optimize route');
    } finally {
      setIsOptimizing(false);
    }
  };

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in_progress': return '#FF9800';
      case 'scheduled': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const getMarkerIcon = (status: string) => {
    const color = getMarkerColor(status);
    return {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 2
    };
  };

  // If API key isn't provided, show an informative message rather than failing silently
  if (!mapsKey) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Maps Not Configured</h3>
        <p className="text-sm text-gray-600">No Google Maps API key found. To enable map features, set <code className="bg-gray-100 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> in your dashboard `.env`.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Delivery Route Map</h3>
        <div className="flex space-x-2">
          <button
            onClick={optimizeRoute}
            disabled={isOptimizing || deliveries.length < 2}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-sm"
            aria-disabled={isOptimizing || deliveries.length < 2}
            aria-live="polite"
          >
            {isOptimizing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Optimizing...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Optimize Route</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="relative">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: true,
            zoomControl: true,
          }}
        >
          {/* Vendor Location Marker */}
          {vendorLocation && (
            <Marker
              position={vendorLocation}
              title="Vendor Location"
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#FF0000',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 3
              }}
            />
          )}

          {/* Delivery Markers */}
          {optimizedDeliveries.map((delivery, index) => (
            <Marker
              key={delivery.id}
              position={delivery.coordinates}
              title={`${index + 1}. ${delivery.address}`}
              icon={getMarkerIcon(delivery.status)}
              onClick={() => setSelectedDelivery(delivery)}
            />
          ))}

          {/* Directions Renderer */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: '#3B82F6',
                  strokeWeight: 4,
                  strokeOpacity: 0.8
                }
              }}
            />
          )}

          {/* Info Window */}
          {selectedDelivery && (
            <InfoWindow
              position={selectedDelivery.coordinates}
              onCloseClick={() => setSelectedDelivery(null)}
            >
              <div className="p-2">
                <h4 className="font-semibold text-gray-900">{selectedDelivery.customerName || 'Delivery'}</h4>
                <p className="text-sm text-gray-600">{selectedDelivery.address}</p>
                <p className="text-sm text-gray-500">Status: {selectedDelivery.status}</p>
                {selectedDelivery.estimatedTime && (
                  <p className="text-sm text-gray-500">ETA: {selectedDelivery.estimatedTime} min</p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      {/* Delivery List */}
      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Optimized Delivery Order</h4>
        <div className="space-y-2">
          {optimizedDeliveries.map((delivery, index) => (
            <div
              key={delivery.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-secondary-100"
              onClick={() => setSelectedDelivery(delivery)}
            >
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {delivery.customerName || 'Delivery'}
                </p>
                <p className="text-xs text-gray-500 truncate">{delivery.address}</p>
              </div>
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  delivery.status === 'completed' ? 'bg-green-100 text-green-800' :
                  delivery.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {delivery.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsRoute;
