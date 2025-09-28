import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Phone, 
  CheckCircle, 
  ArrowRight,
  RotateCcw,
  Zap,
  Target,
  Route,
  AlertCircle
} from 'lucide-react';
import { deliveryTrackingService } from '../services/deliveryTracking';
import { routeOptimizationService } from '../services/routeOptimization';

interface DeliveryDirectionsProps {
  deliveryId: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  coordinates: { lat: number; lng: number };
  onDeliveryComplete: () => void;
  onNextDelivery: () => void;
}

interface DirectionStep {
  instruction: string;
  distance: string;
  duration: string;
  maneuver: string;
  startLocation: { lat: number; lng: number };
  endLocation: { lat: number; lng: number };
}

export default function DeliveryDirections({
  deliveryId,
  customerName,
  customerAddress,
  customerPhone,
  coordinates,
  onDeliveryComplete,
  onNextDelivery
}: DeliveryDirectionsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [directions, setDirections] = useState<DirectionStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [eta, setEta] = useState<Date | null>(null);
  const [distance, setDistance] = useState<string>('');
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    generateDirections();
    updateETA();
    
    // Update ETA every 30 seconds
    const interval = setInterval(updateETA, 30000);
    return () => clearInterval(interval);
  }, [deliveryId, coordinates]);

  const generateDirections = async () => {
    setIsLoading(true);
    try {
      // Get current location from tracking service
      const currentLocation = deliveryTrackingService.getCurrentLocation(deliveryId);
      if (!currentLocation) {
        // Fallback to a default location
        const defaultLocation = { lat: 19.0760, lng: 72.8777 };
        await generateMockDirections(defaultLocation, coordinates);
      } else {
        await generateMockDirections(currentLocation, coordinates);
      }
    } catch (error) {
      console.error('Error generating directions:', error);
      // Generate mock directions as fallback
      await generateMockDirections({ lat: 19.0760, lng: 72.8777 }, coordinates);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockDirections = async (start: { lat: number; lng: number }, end: { lat: number; lng: number }) => {
    // Mock directions for Mumbai locations
    const mockDirections: DirectionStep[] = [
      {
        instruction: "Head northeast on Dr. A.B. Road toward Mumbai Central Station",
        distance: "0.5 km",
        duration: "2 mins",
        maneuver: "straight",
        startLocation: start,
        endLocation: { lat: start.lat + 0.001, lng: start.lng + 0.001 }
      },
      {
        instruction: "Turn right onto Lamington Road",
        distance: "1.2 km",
        duration: "4 mins",
        maneuver: "turn-right",
        startLocation: { lat: start.lat + 0.001, lng: start.lng + 0.001 },
        endLocation: { lat: start.lat + 0.002, lng: start.lng + 0.003 }
      },
      {
        instruction: "Continue straight on Lamington Road",
        distance: "2.1 km",
        duration: "8 mins",
        maneuver: "straight",
        startLocation: { lat: start.lat + 0.002, lng: start.lng + 0.003 },
        endLocation: { lat: start.lat + 0.004, lng: start.lng + 0.006 }
      },
      {
        instruction: "Turn left onto Linking Road",
        distance: "1.8 km",
        duration: "6 mins",
        maneuver: "turn-left",
        startLocation: { lat: start.lat + 0.004, lng: start.lng + 0.006 },
        endLocation: { lat: end.lat - 0.001, lng: end.lng - 0.001 }
      },
      {
        instruction: `Turn right toward ${customerName}'s address`,
        distance: "0.3 km",
        duration: "1 min",
        maneuver: "turn-right",
        startLocation: { lat: end.lat - 0.001, lng: end.lng - 0.001 },
        endLocation: end
      }
    ];

    setDirections(mockDirections);
    
    // Calculate total distance and duration
    const totalDistance = mockDirections.reduce((sum, step) => {
      const dist = parseFloat(step.distance.replace(' km', ''));
      return sum + dist;
    }, 0);
    
    const totalDuration = mockDirections.reduce((sum, step) => {
      const dur = parseInt(step.duration.replace(' mins', ''));
      return sum + dur;
    }, 0);

    setDistance(`${totalDistance.toFixed(1)} km`);
    
    // Set ETA
    const etaTime = new Date();
    etaTime.setMinutes(etaTime.getMinutes() + totalDuration);
    setEta(etaTime);
  };

  const updateETA = () => {
    const currentLocation = deliveryTrackingService.getCurrentLocation(deliveryId);
    if (currentLocation && directions.length > 0) {
      // Calculate remaining time based on current progress
      const remainingSteps = directions.slice(currentStep);
      const remainingDuration = remainingSteps.reduce((sum, step) => {
        const dur = parseInt(step.duration.replace(' mins', ''));
        return sum + dur;
      }, 0);
      
      const etaTime = new Date();
      etaTime.setMinutes(etaTime.getMinutes() + remainingDuration);
      setEta(etaTime);
    }
  };

  const handleNextStep = () => {
    if (currentStep < directions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOptimizeRoute = async () => {
    setIsLoading(true);
    try {
      // Use AI route optimization service for individual delivery
      const currentLocation = deliveryTrackingService.getCurrentLocation(deliveryId) || { lat: 19.0760, lng: 72.8777 };
      
      const startLocation = {
        id: 'current-location',
        name: 'Current Location',
        address: 'Current Position',
        coordinates: currentLocation,
        type: 'delivery_staff' as const,
        status: 'active' as const
      };

      const targetDelivery = {
        id: deliveryId,
        name: customerName,
        address: customerAddress,
        coordinates: coordinates,
        type: 'customer' as const,
        status: 'pending' as const,
        priority: 1
      };

      const optimized = await routeOptimizationService.optimizeRoute(
        startLocation,
        [targetDelivery]
      );

      // Convert optimized route to direction steps
      const optimizedDirections = optimized.route.slice(1).map((location, index) => ({
        instruction: `Navigate to ${location.name}`,
        distance: `${(optimized.totalDistance / optimized.route.length).toFixed(1)} km`,
        duration: `${Math.round(optimized.totalTime / optimized.route.length)} mins`,
        maneuver: index === 0 ? 'straight' : 'turn-right',
        startLocation: index === 0 ? currentLocation : optimized.route[index].coordinates,
        endLocation: location.coordinates
      }));

      // Add detailed turn-by-turn directions
      const detailedDirections = [
        {
          instruction: "Head northeast on current road",
          distance: "0.5 km",
          duration: "2 mins",
          maneuver: "straight",
          startLocation: currentLocation,
          endLocation: { lat: currentLocation.lat + 0.001, lng: currentLocation.lng + 0.001 }
        },
        {
          instruction: "Turn right onto main road",
          distance: "1.2 km",
          duration: "4 mins",
          maneuver: "turn-right",
          startLocation: { lat: currentLocation.lat + 0.001, lng: currentLocation.lng + 0.001 },
          endLocation: { lat: coordinates.lat - 0.001, lng: coordinates.lng - 0.001 }
        },
        {
          instruction: `Turn left toward ${customerName}'s address`,
          distance: "0.3 km",
          duration: "1 min",
          maneuver: "turn-left",
          startLocation: { lat: coordinates.lat - 0.001, lng: coordinates.lng - 0.001 },
          endLocation: coordinates
        }
      ];
      
      setDirections(detailedDirections);
      setIsOptimized(true);
      
      // Update ETA based on optimized route
      const etaTime = new Date();
      etaTime.setMinutes(etaTime.getMinutes() + optimized.totalTime);
      setEta(etaTime);
      
      setDistance(`${optimized.totalDistance.toFixed(1)} km`);
      
    } catch (error) {
      console.error('Route optimization failed:', error);
      // Fallback to mock directions
      await generateMockDirections(
        deliveryTrackingService.getCurrentLocation(deliveryId) || { lat: 19.0760, lng: 72.8777 },
        coordinates
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getManeuverIcon = (maneuver: string) => {
    switch (maneuver) {
      case 'turn-right':
        return '↗️';
      case 'turn-left':
        return '↖️';
      case 'straight':
        return '↑';
      default:
        return '→';
    }
  };

  return (
    <div className="space-y-4">
      {/* Delivery Header */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Delivery to {customerName}
              </CardTitle>
              <CardDescription className="text-blue-600">
                {customerAddress}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`tel:${customerPhone}`)}
                className="flex items-center gap-1"
              >
                <Phone className="h-4 w-4" />
                Call
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOptimizeRoute}
                disabled={isLoading}
                className="flex items-center gap-1"
              >
                <Zap className="h-4 w-4" />
                {isLoading ? 'Optimizing...' : 'Optimize'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              <div>
                <div className="font-medium">ETA</div>
                <div className="text-gray-600">{eta?.toLocaleTimeString() || 'Calculating...'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Route className="h-4 w-4 text-blue-600" />
              <div>
                <div className="font-medium">Distance</div>
                <div className="text-gray-600">{distance}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              <div>
                <div className="font-medium">Steps</div>
                <div className="text-gray-600">{currentStep + 1} of {directions.length}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-orange-600" />
              <div>
                <div className="font-medium">Status</div>
                <div className="text-gray-600">In Transit</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Step */}
      {directions.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg text-green-800 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Current Step {currentStep + 1}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="text-3xl">{getManeuverIcon(directions[currentStep].maneuver)}</div>
              <div className="flex-1">
                <p className="text-lg font-medium mb-2">{directions[currentStep].instruction}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Route className="h-4 w-4" />
                    {directions[currentStep].distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {directions[currentStep].duration}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousStep}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextStep}
                  disabled={currentStep === directions.length - 1}
                >
                  Next
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateDirections}
                  className="flex items-center gap-1"
                >
                  <RotateCcw className="h-4 w-4" />
                  Refresh
                </Button>
                {isOptimized && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Optimized
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Steps Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Route Overview
          </CardTitle>
          <CardDescription>
            Complete navigation steps to your destination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {directions.map((step, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  index === currentStep 
                    ? 'bg-blue-50 border-blue-200' 
                    : index < currentStep 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-300">
                  {index < currentStep ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : index === currentStep ? (
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  ) : (
                    <span className="text-sm font-medium text-gray-500">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    index === currentStep ? 'text-blue-800' : 
                    index < currentStep ? 'text-green-800' : 'text-gray-700'
                  }`}>
                    {step.instruction}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Route className="h-3 w-3" />
                      {step.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {step.duration}
                    </span>
                  </div>
                </div>
                <div className="text-2xl">{getManeuverIcon(step.maneuver)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onDeliveryComplete}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Mark as Delivered
        </Button>
        <Button
          onClick={onNextDelivery}
          variant="outline"
          className="flex-1"
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          Next Delivery
        </Button>
      </div>
    </div>
  );
}
