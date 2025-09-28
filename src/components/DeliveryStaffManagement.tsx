import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Truck, 
  MapPin, 
  Phone, 
  Clock, 
  User, 
  Plus,
  Search,
  Navigation,
  CheckCircle,
  AlertCircle,
  Pause,
  Play,
  Route,
  Timer
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface DeliveryStaff {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'on_duty' | 'off_duty' | 'out_for_delivery';
  currentOrders: number;
  totalDeliveries: number;
  averageRating: number;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  assignedAreas: string[];
  todayDeliveries: number;
  joinDate: string;
}

interface DeliveryRoute {
  id: string;
  staffId: string;
  staffName: string;
  orders: Array<{
    id: string;
    customer: string;
    address: string;
    phone: string;
    status: 'pending' | 'picked_up' | 'delivered';
    estimatedTime: string;
  }>;
  totalDistance: string;
  estimatedDuration: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export default function DeliveryStaffManagement() {
  const [deliveryStaff, setDeliveryStaff] = useState<DeliveryStaff[]>([]);
  const [routes, setRoutes] = useState<DeliveryRoute[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<DeliveryStaff | null>(null);
  const [showAddStaff, setShowAddStaff] = useState(false);

  useEffect(() => {
    // Mock data - in real app this would come from Supabase
    const mockStaff: DeliveryStaff[] = [
      {
        id: 'STAFF001',
        name: 'Ramesh Kumar',
        phone: '+91 98765 43210',
        email: 'ramesh.kumar@email.com',
        status: 'out_for_delivery',
        currentOrders: 3,
        totalDeliveries: 1247,
        averageRating: 4.8,
        currentLocation: {
          lat: 12.9716,
          lng: 77.5946,
          address: 'Near Brigade Road, Bangalore'
        },
        assignedAreas: ['Koramangala', 'BTM Layout'],
        todayDeliveries: 12,
        joinDate: '2023-08-15'
      },
      {
        id: 'STAFF002',
        name: 'Suresh Reddy',
        phone: '+91 87654 32109',
        email: 'suresh.reddy@email.com',
        status: 'on_duty',
        currentOrders: 0,
        totalDeliveries: 892,
        averageRating: 4.6,
        assignedAreas: ['Whitefield', 'Marathahalli'],
        todayDeliveries: 8,
        joinDate: '2023-11-20'
      },
      {
        id: 'STAFF003',
        name: 'Pradeep Singh',
        phone: '+91 76543 21098',
        email: 'pradeep.singh@email.com',
        status: 'off_duty',
        currentOrders: 0,
        totalDeliveries: 654,
        averageRating: 4.7,
        assignedAreas: ['Electronic City', 'HSR Layout'],
        todayDeliveries: 0,
        joinDate: '2024-01-10'
      },
      {
        id: 'STAFF004',
        name: 'Anil Varma',
        phone: '+91 65432 10987',
        email: 'anil.varma@email.com',
        status: 'out_for_delivery',
        currentOrders: 2,
        totalDeliveries: 1456,
        averageRating: 4.9,
        currentLocation: {
          lat: 12.9352,
          lng: 77.6245,
          address: 'Near Whitefield Main Road'
        },
        assignedAreas: ['Indiranagar', 'Koramangala'],
        todayDeliveries: 15,
        joinDate: '2023-05-03'
      }
    ];

    const mockRoutes: DeliveryRoute[] = [
      {
        id: 'ROUTE001',
        staffId: 'STAFF001',
        staffName: 'Ramesh Kumar',
        orders: [
          {
            id: 'ORD001',
            customer: 'Priya Sharma',
            address: 'B-204, Green Valley Apartments, Koramangala',
            phone: '+91 98765 43210',
            status: 'delivered',
            estimatedTime: '12:30 PM'
          },
          {
            id: 'ORD002',
            customer: 'Raj Patel',
            address: 'A-101, Sunrise Complex, Whitefield',
            phone: '+91 87654 32109',
            status: 'picked_up',
            estimatedTime: '1:15 PM'
          },
          {
            id: 'ORD003',
            customer: 'Vikram Modi',
            address: 'D-12, Metro Heights, Indiranagar',
            phone: '+91 65432 10987',
            status: 'pending',
            estimatedTime: '2:00 PM'
          }
        ],
        totalDistance: '15.2 km',
        estimatedDuration: '45 mins',
        status: 'in_progress'
      },
      {
        id: 'ROUTE002',
        staffId: 'STAFF004',
        staffName: 'Anil Varma',
        orders: [
          {
            id: 'ORD004',
            customer: 'Anita Singh',
            address: 'C-305, Tech Park Residency, Electronic City',
            phone: '+91 76543 21098',
            status: 'picked_up',
            estimatedTime: '7:30 PM'
          },
          {
            id: 'ORD005',
            customer: 'Deepak Shah',
            address: 'E-501, Garden City, HSR Layout',
            phone: '+91 54321 09876',
            status: 'pending',
            estimatedTime: '8:15 PM'
          }
        ],
        totalDistance: '12.8 km',
        estimatedDuration: '35 mins',
        status: 'in_progress'
      }
    ];

    setDeliveryStaff(mockStaff);
    setRoutes(mockRoutes);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_duty': return 'bg-green-100 text-green-800';
      case 'off_duty': return 'bg-gray-100 text-gray-800';
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_duty': return <CheckCircle className="h-4 w-4" />;
      case 'off_duty': return <Pause className="h-4 w-4" />;
      case 'out_for_delivery': return <Truck className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
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

  const filteredStaff = deliveryStaff.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.phone.includes(searchTerm) ||
    staff.assignedAreas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleStatusToggle = (staffId: string, newStatus: string) => {
    setDeliveryStaff(prev => prev.map(staff => 
      staff.id === staffId ? { ...staff, status: newStatus as any } : staff
    ));
    toast.success('Staff status updated successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Delivery Staff Management</h2>
          <p className="text-gray-600">Manage your delivery team and track routes</p>
        </div>
        <Button 
          onClick={() => setShowAddStaff(true)}
          className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      {/* Staff Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">{deliveryStaff.length}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Duty</p>
                <p className="text-2xl font-bold text-green-600">
                  {deliveryStaff.filter(s => s.status === 'on_duty').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out for Delivery</p>
                <p className="text-2xl font-bold text-blue-600">
                  {deliveryStaff.filter(s => s.status === 'out_for_delivery').length}
                </p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Deliveries</p>
                <p className="text-2xl font-bold text-orange-600">
                  {deliveryStaff.reduce((sum, staff) => sum + staff.todayDeliveries, 0)}
                </p>
              </div>
              <Timer className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search staff by name, phone, or area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Staff Cards */}
          <div className="space-y-3">
            {filteredStaff.map((staff) => (
              <Card 
                key={staff.id}
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedStaff?.id === staff.id ? 'ring-2 ring-orange-500' : ''
                }`}
                onClick={() => setSelectedStaff(staff)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {staff.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{staff.name}</h3>
                          <Badge className={`${getStatusColor(staff.status)} flex items-center gap-1`}>
                            {getStatusIcon(staff.status)}
                            {staff.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{staff.phone}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{staff.todayDeliveries} deliveries today</span>
                          <span>{staff.currentOrders} current orders</span>
                          <span>★ {staff.averageRating}</span>
                        </div>
                        {staff.currentLocation && (
                          <div className="flex items-center gap-1 mt-2 text-sm text-blue-600">
                            <MapPin className="h-3 w-3" />
                            <span>{staff.currentLocation.address}</span>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {staff.assignedAreas.map(area => (
                            <Badge key={area} variant="outline" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {staff.status === 'off_duty' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusToggle(staff.id, 'on_duty');
                          }}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      )}
                      {staff.status === 'on_duty' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusToggle(staff.id, 'off_duty');
                          }}
                        >
                          <Pause className="h-3 w-3" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Staff Details & Routes */}
        <div className="space-y-4">
          {selectedStaff ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Staff Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-3">
                      <AvatarFallback className="text-lg">
                        {selectedStaff.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold">{selectedStaff.name}</h3>
                    <p className="text-sm text-gray-500">ID: {selectedStaff.id}</p>
                    <Badge className={`${getStatusColor(selectedStaff.status)} mt-2`}>
                      {selectedStaff.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedStaff.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Joined: {new Date(selectedStaff.joinDate).toLocaleDateString()}</span>
                    </div>
                    {selectedStaff.currentLocation && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                        <span className="text-sm">{selectedStaff.currentLocation.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{selectedStaff.todayDeliveries}</p>
                      <p className="text-sm text-gray-500">Today</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{selectedStaff.totalDeliveries}</p>
                      <p className="text-sm text-gray-500">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">{selectedStaff.averageRating}</p>
                      <p className="text-sm text-gray-500">Rating</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{selectedStaff.currentOrders}</p>
                      <p className="text-sm text-gray-500">Current</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      <Navigation className="h-4 w-4 mr-2" />
                      Track Location
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Route className="h-4 w-4 mr-2" />
                      Assign Route
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Current Route */}
              {routes.find(route => route.staffId === selectedStaff.id) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Route className="h-5 w-5" />
                      Current Route
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const currentRoute = routes.find(route => route.staffId === selectedStaff.id);
                      return currentRoute ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <span>Distance: {currentRoute.totalDistance}</span>
                            <span>ETA: {currentRoute.estimatedDuration}</span>
                          </div>
                          <div className="space-y-2">
                            {currentRoute.orders.map((order, index) => (
                              <div key={order.id} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-sm">{order.customer}</span>
                                  <Badge className={getOrderStatusColor(order.status)}>
                                    {order.status.replace('_', ' ')}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-600 mb-1">{order.address}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>ETA: {order.estimatedTime}</span>
                                  <span>{order.phone}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Staff Member</h3>
                <p className="text-gray-500">Click on a staff member to view their details and current route</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}