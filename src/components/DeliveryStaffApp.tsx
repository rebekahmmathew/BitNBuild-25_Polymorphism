import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Navigation, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Package,
  Route,
  User,
  LogOut,
  Bell,
  Truck,
  Play,
  Pause,
  Timer,
  Target,
  AlertCircle,
  MessageSquare,
  Info
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import DeliveryStaffMap from './DeliveryStaffMap';

interface DeliveryStaffAppProps {
  user: any;
  onLogout: () => void;
}

interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  items: string[];
  totalAmount: number;
  status: 'pending' | 'picked_up' | 'delivered';
  estimatedTime: string;
  notes?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface Notification {
  id: string;
  type: 'order' | 'route' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function DeliveryStaffApp({ user, onLogout }: DeliveryStaffAppProps) {
  const [currentStatus, setCurrentStatus] = useState<'on_duty' | 'off_duty' | 'out_for_delivery'>('on_duty');
  const [todaysOrders, setTodaysOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [routeInfo, setRouteInfo] = useState({
    totalDistance: '0 km',
    estimatedTime: '0 mins',
    ordersRemaining: 0
  });

  useEffect(() => {
    // Mock data for today's orders - Mumbai based
    const mockOrders: Order[] = [
      {
        id: 'ORD001',
        customer: 'Amit Patel',
        phone: '+91 98765 43210',
        address: 'B-204, Green Valley Apartments, Bandra West, Mumbai - 400050',
        items: ['Dal Tadka', 'Jeera Rice', 'Mixed Veg Curry'],
        totalAmount: 230,
        status: 'delivered',
        estimatedTime: '12:30 PM',
        coordinates: { lat: 19.0544, lng: 72.8406 }
      },
      {
        id: 'ORD002',
        customer: 'Sneha Desai',
        phone: '+91 87654 32109',
        address: 'A-101, Sunrise Complex, Powai, Mumbai - 400076',
        items: ['Chicken Curry', 'Chapati', 'Dal'],
        totalAmount: 285,
        status: 'picked_up',
        estimatedTime: '1:15 PM',
        notes: 'Call before arriving',
        coordinates: { lat: 19.1176, lng: 72.9060 }
      },
      {
        id: 'ORD003',
        customer: 'Rahul Singh',
        phone: '+91 65432 10987',
        address: 'D-12, Metro Heights, Malad West, Mumbai - 400064',
        items: ['Paneer Butter Masala', 'Naan', 'Basmati Rice'],
        totalAmount: 320,
        status: 'pending',
        estimatedTime: '2:00 PM',
        coordinates: { lat: 19.1868, lng: 72.8481 }
      },
      {
        id: 'ORD004',
        customer: 'Priya Iyer',
        phone: '+91 76543 21098',
        address: 'C-305, Tech Park Residency, Juhu, Mumbai - 400049',
        items: ['Rajma Chawal', 'Raita', 'Pickle'],
        totalAmount: 195,
        status: 'pending',
        estimatedTime: '2:45 PM',
        coordinates: { lat: 19.1074, lng: 72.8263 }
      }
    ];

    setTodaysOrders(mockOrders);
    setActiveOrder(mockOrders.find(order => order.status === 'picked_up') || null);
    
    // Set route info
    const pendingOrders = mockOrders.filter(order => order.status !== 'delivered');
    setRouteInfo({
      totalDistance: '32.8 km',
      estimatedTime: '1h 45m',
      ordersRemaining: pendingOrders.length
    });

    // Mock notifications
    const mockNotifications: Notification[] = [
      {
        id: 'notif1',
        type: 'order',
        title: 'New Order Assigned',
        message: 'Order ORD005 from Rajesh Kumar has been assigned to you.',
        timestamp: '2 mins ago',
        read: false
      },
      {
        id: 'notif2',
        type: 'route',
        title: 'Route Optimized',
        message: 'Your delivery route has been updated to save 15 minutes.',
        timestamp: '5 mins ago',
        read: false
      },
      {
        id: 'notif3',
        type: 'system',
        title: 'Weather Alert',
        message: 'Rain expected in your area. Please take necessary precautions.',
        timestamp: '10 mins ago',
        read: true
      }
    ];
    setNotifications(mockNotifications);

    // Simulate getting current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Default to Mumbai center if location access denied
          setCurrentLocation({ lat: 19.0760, lng: 72.8777 });
        }
      );
    }
  }, []);

  const handleStatusToggle = () => {
    if (currentStatus === 'on_duty') {
      setCurrentStatus('off_duty');
      toast.success('You are now off duty');
    } else {
      setCurrentStatus('on_duty');
      toast.success('You are now on duty');
    }
  };

  const handleOrderStatusUpdate = (orderId: string, newStatus: 'picked_up' | 'delivered') => {
    setTodaysOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));

    if (newStatus === 'picked_up') {
      setCurrentStatus('out_for_delivery');
      const order = todaysOrders.find(o => o.id === orderId);
      setActiveOrder(order || null);
      toast.success('Order marked as picked up');
    } else if (newStatus === 'delivered') {
      toast.success('Order delivered successfully');
      // Find next pending order
      const nextOrder = todaysOrders.find(order => 
        order.status === 'pending' && order.id !== orderId
      );
      setActiveOrder(nextOrder || null);
      if (!nextOrder) {
        setCurrentStatus('on_duty');
      }
    }
  };

  const handleCallCustomer = (phone: string) => {
    toast.info(`Calling ${phone}`);
    // In real app, this would initiate a phone call
  };

  const handleCallVendor = () => {
    toast.info('Calling vendor...');
    // In real app, this would call the vendor
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_duty': return 'bg-green-100 text-green-800';
      case 'off_duty': return 'bg-gray-100 text-gray-800';
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'picked_up': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const todayStats = {
    totalOrders: todaysOrders.length,
    delivered: todaysOrders.filter(o => o.status === 'delivered').length,
    pending: todaysOrders.filter(o => o.status === 'pending').length,
    totalEarnings: todaysOrders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + (o.totalAmount * 0.1), 0) // 10% commission
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">NourishNet</h1>
              <p className="text-xs sm:text-sm text-gray-500 truncate">{user?.user_metadata?.name || 'Delivery Partner'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge className={getStatusColor(currentStatus)}>
              {currentStatus.replace('_', ' ')}
            </Badge>
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </Button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          setNotifications(prev => prev.map(n => 
                            n.id === notification.id ? { ...n, read: true } : n
                          ));
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`p-1 rounded-full ${
                            notification.type === 'order' ? 'bg-green-100' :
                            notification.type === 'route' ? 'bg-blue-100' : 'bg-yellow-100'
                          }`}>
                            {notification.type === 'order' ? (
                              <Package className="h-3 w-3 text-green-600" />
                            ) : notification.type === 'route' ? (
                              <Route className="h-3 w-3 text-blue-600" />
                            ) : (
                              <Info className="h-3 w-3 text-yellow-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-xs text-gray-600">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.timestamp}</p>
                          </div>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    )) : (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                  <div className="p-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                        toast.success('All notifications marked as read');
                      }}
                    >
                      Mark all as read
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="hidden sm:flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="sm:hidden"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
        {/* Status Control & Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <Card className="col-span-2 sm:col-span-1">
            <CardContent className="p-3 sm:p-4 text-center">
              <Button
                onClick={handleStatusToggle}
                className={`w-full text-xs sm:text-sm ${currentStatus === 'on_duty' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                size="sm"
              >
                {currentStatus === 'on_duty' ? (
                  <>
                    <Pause className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Go </span>Off Duty
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Go </span>On Duty
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-2 sm:p-4 text-center">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">{todayStats.totalOrders}</div>
              <div className="text-xs sm:text-sm text-gray-500">Total</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-2 sm:p-4 text-center">
              <div className="text-lg sm:text-2xl font-bold text-green-600">{todayStats.delivered}</div>
              <div className="text-xs sm:text-sm text-gray-500">Done</div>
            </CardContent>
          </Card>

          <Card className="hidden sm:block">
            <CardContent className="p-2 sm:p-4 text-center">
              <div className="text-lg sm:text-2xl font-bold text-yellow-600">{todayStats.pending}</div>
              <div className="text-xs sm:text-sm text-gray-500">Pending</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-2 sm:p-4 text-center">
              <div className="text-lg sm:text-2xl font-bold text-purple-600">₹{todayStats.totalEarnings.toFixed(0)}</div>
              <div className="text-xs sm:text-sm text-gray-500">Earnings</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Order */}
        {activeOrder && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Navigation className="h-5 w-5" />
                Active Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{activeOrder.customer}</h3>
                  <p className="text-sm text-gray-600 mb-2">{activeOrder.address}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      ETA: {activeOrder.estimatedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      ₹{activeOrder.totalAmount}
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">Items:</p>
                    <div className="flex flex-wrap gap-1">
                      {activeOrder.items.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {activeOrder.notes && (
                    <div className="p-2 bg-yellow-100 rounded text-sm">
                      <strong>Note:</strong> {activeOrder.notes}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleOrderStatusUpdate(activeOrder.id, 'delivered')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Delivered
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCallCustomer(activeOrder.phone)}
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Call Customer
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCallVendor}
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Call Vendor
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Delivery Staff Map with Directions */}
        <DeliveryStaffMap
          staffId="staff-001"
          onRouteOptimized={(route) => {
            toast.success(`Route optimized! ${route.totalDistance}km in ${route.totalTime}mins`);
            setRouteInfo({
              totalDistance: `${route.totalDistance} km`,
              estimatedTime: `${route.totalTime} mins`,
              ordersRemaining: route.route.length - 1
            });
          }}
        />

        {/* Today's Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Orders</CardTitle>
            <CardDescription>All deliveries assigned for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysOrders.map((order, index) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                      <span className="font-semibold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{order.customer}</h3>
                      <p className="text-sm text-gray-600">{order.address}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">{order.estimatedTime}</span>
                        <span className="text-sm text-green-600">₹{order.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getOrderStatusColor(order.status)}>
                      {order.status.replace('_', ' ')}
                    </Badge>
                    {order.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOrderStatusUpdate(order.id, 'picked_up')}
                      >
                        <Package className="h-3 w-3 mr-1" />
                        Pick Up
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCallCustomer(order.phone)}
                    >
                      <Phone className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}