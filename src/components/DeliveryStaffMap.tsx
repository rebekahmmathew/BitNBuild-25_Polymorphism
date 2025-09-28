import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Route,
  Zap,
  Target,
  CheckCircle,
  AlertCircle,
  Map,
  List,
  Compass,
  Phone
} from 'lucide-react';
import GoogleMap from './GoogleMap';
import DeliveryDirections from './DeliveryDirections';
import { deliveryTrackingService, DeliveryStaff } from '../services/deliveryTracking';
import { routeOptimizationService, OptimizedRoute } from '../services/routeOptimization';

interface DeliveryStaffMapProps {
  staffId: string;
  onRouteOptimized?: (route: OptimizedRoute) => void;
}

export default function DeliveryStaffMap({ staffId, onRouteOptimized }: DeliveryStaffMapProps) {
  const [staff, setStaff] = useState<DeliveryStaff | null>(null);
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [currentDelivery, setCurrentDelivery] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('map');
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);

  useEffect(() => {
    const staffData = deliveryTrackingService.getDeliveryStaffById(staffId);
    setStaff(staffData);
    setCurrentDelivery(staffData?.currentDelivery || null);
  }, [staffId]);

  useEffect(() => {
    if (staff) {
      const interval = setInterval(() => {
        const updatedStaff = deliveryTrackingService.getDeliveryStaffById(staffId);
        setStaff(updatedStaff);
        setCurrentDelivery(updatedStaff?.currentDelivery || null);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [staff, staffId]);

  const handleOptimizeRoute = async () => {
    if (!staff) return;

    setIsOptimizing(true);
    try {
      // Use the actual pending deliveries data
      const deliveryLocations = pendingDeliveries.map(delivery => ({
        id: delivery.id,
        name: delivery.name,
        address: delivery.address,
        coordinates: delivery.coordinates,
        type: 'customer' as const,
        status: 'pending' as const,
        priority: delivery.priority
      }));

      const startLocation = {
        id: staff.id,
        name: staff.name,
        address: 'Current Location',
        coordinates: staff.currentLocation,
        type: 'delivery_staff' as const,
        status: 'active' as const
      };

      const optimized = await routeOptimizationService.optimizeRoute(
        startLocation,
        deliveryLocations
      );

      setOptimizedRoute(optimized);
      onRouteOptimized?.(optimized);
      
      // Update delivery priorities based on optimized route
      const optimizedDeliveries = optimized.route.slice(1); // Remove start location
      optimizedDeliveries.forEach((delivery, index) => {
        const originalDelivery = pendingDeliveries.find(d => d.id === delivery.id);
        if (originalDelivery) {
          originalDelivery.priority = index + 1; // Update priority based on route order
        }
      });
      
    } catch (error) {
      console.error('Route optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleStartDelivery = (deliveryId: string) => {
    deliveryTrackingService.assignDelivery(staffId, deliveryId);
    setCurrentDelivery(deliveryId);
  };

  const handleCompleteDelivery = () => {
    deliveryTrackingService.completeDelivery(staffId);
    setCurrentDelivery(null);
    setSelectedDelivery(null);
  };

  const handleNextDelivery = () => {
    // Find next pending delivery
    const nextDelivery = pendingDeliveries.find(delivery => delivery.id !== currentDelivery);
    if (nextDelivery) {
      setSelectedDelivery(nextDelivery);
      setCurrentDelivery(nextDelivery.id);
      deliveryTrackingService.assignDelivery(staffId, nextDelivery.id);
    }
  };

  // Mock delivery data for Mumbai
  const pendingDeliveries = [
    {
      id: 'delivery-001',
      name: 'Amit Patel',
      address: 'B-204, Green Valley Apartments, Bandra West, Mumbai - 400050',
      phone: '+91 98765 43210',
      coordinates: { lat: 19.0544, lng: 72.8406 },
      priority: 1,
      items: ['Dal Tadka', 'Jeera Rice', 'Mixed Veg Curry'],
      totalAmount: 230
    },
    {
      id: 'delivery-002',
      name: 'Sneha Desai',
      address: 'A-101, Sunrise Complex, Powai, Mumbai - 400076',
      phone: '+91 87654 32109',
      coordinates: { lat: 19.1176, lng: 72.9060 },
      priority: 2,
      items: ['Chicken Curry', 'Chapati', 'Dal'],
      totalAmount: 285
    },
    {
      id: 'delivery-003',
      name: 'Rahul Singh',
      address: 'D-12, Metro Heights, Malad West, Mumbai - 400064',
      phone: '+91 65432 10987',
      coordinates: { lat: 19.1868, lng: 72.8481 },
      priority: 3,
      items: ['Paneer Butter Masala', 'Naan', 'Basmati Rice'],
      totalAmount: 320
    }
  ];

  if (!staff) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Staff member not found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const locations = [
    {
      id: staff.id,
      name: staff.name,
      address: 'Current Location',
      coordinates: staff.currentLocation,
      type: 'delivery_staff' as const,
      status: staff.status as 'active' | 'delivered' | 'pending'
    },
    // Always show all pending deliveries on the map
    ...pendingDeliveries.map(delivery => ({
      id: delivery.id,
      name: delivery.name,
      address: delivery.address,
      coordinates: delivery.coordinates,
      type: 'customer' as const,
      status: (currentDelivery === delivery.id ? 'active' : 'pending') as 'active' | 'delivered' | 'pending',
      eta: currentDelivery === delivery.id ? 'In Progress' : `${delivery.priority * 15} mins`,
      priority: delivery.priority
    }))
  ];

  return (
    <div className="space-y-6">
      {/* Staff Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Delivery Staff Dashboard
          </CardTitle>
          <CardDescription>
            Real-time tracking and route optimization for {staff.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                staff.status === 'available' ? 'bg-green-500' : 
                staff.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
              }`}></div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-xs text-gray-600 capitalize">{staff.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Navigation className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Vehicle</p>
                <p className="text-xs text-gray-600">{staff.vehicle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Last Update</p>
                <p className="text-xs text-gray-600">
                  {staff.lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Interactive Map - Always Visible */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Live Interactive Map
              </CardTitle>
              <CardDescription>
                Real-time location tracking and AI-optimized routes for all deliveries
              </CardDescription>
            </div>
            {optimizedRoute && (
              <div className="flex items-center gap-4 text-sm bg-green-50 px-3 py-2 rounded-lg">
                <div className="flex items-center gap-1 text-green-700">
                  <Route className="h-4 w-4" />
                  <span className="font-medium">Optimized Route Active</span>
                </div>
                <div className="text-green-600">
                  {optimizedRoute.route.length - 1} deliveries • {optimizedRoute.totalDistance}km • {optimizedRoute.totalTime}min
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-96">
            <GoogleMap
              locations={locations}
              centerLocation={staff.currentLocation}
              showRoute={true}
              isDeliveryView={true}
              enableRouteOptimization={true}
              enableRealTimeTracking={true}
              deliveryStaffId={staffId}
              onLocationClick={(location) => {
                if (location.type === 'customer') {
                  const delivery = pendingDeliveries.find(d => d.id === location.id);
                  if (delivery) {
                    setSelectedDelivery(delivery);
                    setActiveTab('directions');
                  }
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Route Optimization Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            AI Route Optimization
          </CardTitle>
          <CardDescription>
            Optimize your delivery route using AI-powered algorithms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleOptimizeRoute}
                disabled={isOptimizing}
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                {isOptimizing ? 'Optimizing...' : 'Optimize Route'}
              </Button>
              
              {optimizedRoute && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Route className="h-4 w-4 text-blue-600" />
                    <span>{optimizedRoute.totalDistance} km</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span>{optimizedRoute.totalTime} mins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span>{(optimizedRoute.efficiency * 100).toFixed(1)}% efficiency</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Controls Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="directions" className="flex items-center gap-2">
            <Compass className="h-4 w-4" />
            Delivery Directions
          </TabsTrigger>
          <TabsTrigger value="deliveries" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Delivery Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Map className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Live Map Always Visible Above</h3>
              <p className="text-gray-600">
                The interactive live map is always displayed at the top of the dashboard for continuous monitoring.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="directions" className="space-y-4">
          {selectedDelivery ? (
            <DeliveryDirections
              deliveryId={selectedDelivery.id}
              customerName={selectedDelivery.name}
              customerAddress={selectedDelivery.address}
              customerPhone={selectedDelivery.phone}
              coordinates={selectedDelivery.coordinates}
              onDeliveryComplete={handleCompleteDelivery}
              onNextDelivery={handleNextDelivery}
            />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Compass className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No Delivery Selected</h3>
                <p className="text-gray-600 mb-4">
                  Select a delivery from the map or deliveries list to view directions
                </p>
                <Button onClick={() => setActiveTab('deliveries')}>
                  View Deliveries
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="deliveries" className="space-y-4">
          {/* Current Delivery Status */}
          {currentDelivery ? (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  Current Delivery
                </CardTitle>
                <CardDescription className="text-green-600">
                  Delivery ID: {currentDelivery}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      In Progress
                    </Badge>
                    <span className="text-sm text-gray-600">
                      ETA: {deliveryTrackingService.getETA(currentDelivery)?.toLocaleTimeString() || 'Calculating...'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setActiveTab('directions')}
                      variant="outline"
                      size="sm"
                    >
                      <Compass className="h-4 w-4 mr-1" />
                      View Directions
                    </Button>
                    <Button
                      onClick={handleCompleteDelivery}
                      variant="default"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark as Delivered
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Available Deliveries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Available Deliveries
              </CardTitle>
              <CardDescription>
                Select a delivery to start or view directions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingDeliveries
                  .sort((a, b) => a.priority - b.priority) // Sort by optimized priority
                  .map((delivery, index) => (
                  <div key={delivery.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            currentDelivery === delivery.id ? 'bg-green-600' : 
                            optimizedRoute ? 'bg-blue-600' : 'bg-gray-500'
                          }`}>
                            {index + 1}
                          </div>
                          <h3 className="font-medium text-lg">{delivery.name}</h3>
                        </div>
                        <Badge variant="outline">
                          {optimizedRoute ? `Route Order: ${delivery.priority}` : `Priority: ${delivery.priority}`}
                        </Badge>
                        {currentDelivery === delivery.id && (
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            In Progress
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{delivery.address}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {delivery.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          ₹{delivery.totalAmount}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Items:</p>
                        <div className="flex flex-wrap gap-1">
                          {delivery.items.map((item, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => {
                          setSelectedDelivery(delivery);
                          setActiveTab('directions');
                        }}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Compass className="h-4 w-4" />
                        View Directions
                      </Button>
                      <Button
                        onClick={() => handleStartDelivery(delivery.id)}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Navigation className="h-4 w-4" />
                        Start Delivery
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
