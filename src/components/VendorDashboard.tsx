import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  UtensilsCrossed, 
  Users, 
  IndianRupee, 
  TrendingUp, 
  Menu as MenuIcon,
  BarChart3,
  Truck,
  LogOut,
  Bell,
  Settings
} from 'lucide-react';
import CustomerManagement from './CustomerManagement';
import MenuManagement from './MenuManagement';
import SalesAnalytics from './SalesAnalytics';
import DeliveryStaffManagement from './DeliveryStaffManagement';
import LiveMap from './LiveMap';
import { toast } from 'sonner@2.0.3';

interface VendorDashboardProps {
  user: any;
  onLogout: () => void;
}

export default function VendorDashboard({ user, onLogout }: VendorDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalSubscribers: 0,
    activeOrders: 0,
    completedDeliveries: 0,
    averageRating: 0,
    monthlyGrowth: 0
  });

  useEffect(() => {
    // Simulate loading dashboard data
    // In real implementation, this would fetch from Supabase
    setDashboardData({
      totalRevenue: 125000,
      totalSubscribers: 347,
      activeOrders: 89,
      completedDeliveries: 1205,
      averageRating: 4.7,
      monthlyGrowth: 12.5
    });
  }, []);

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className={`text-sm flex items-center gap-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="h-3 w-3" />
                {trend > 0 ? '+' : ''}{trend}%
              </p>
            )}
          </div>
          <div className={`p-3 bg-${color}-100 rounded-full`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <UtensilsCrossed className="h-8 w-8 text-orange-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">NourishNet</h1>
              <p className="text-sm text-gray-500">{user?.user_metadata?.businessName || 'Vendor Dashboard'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <MenuIcon className="h-4 w-4" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Delivery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Revenue"
                value={`₹${dashboardData.totalRevenue.toLocaleString()}`}
                icon={IndianRupee}
                trend={dashboardData.monthlyGrowth}
                color="green"
              />
              <StatCard
                title="Active Subscribers"
                value={dashboardData.totalSubscribers}
                icon={Users}
                trend={8.2}
                color="blue"
              />
              <StatCard
                title="Today's Orders"
                value={dashboardData.activeOrders}
                icon={UtensilsCrossed}
                color="orange"
              />
              <StatCard
                title="Completed Deliveries"
                value={dashboardData.completedDeliveries}
                icon={Truck}
                trend={5.1}
                color="purple"
              />
            </div>

            {/* Live Map Section with AI Route Optimization */}
            <div className="mb-6">
              <LiveMap
                locations={[
                  {
                    id: 'vendor-1',
                    name: 'NourishNet Kitchen - Mumbai Central',
                    address: '123, Dr. A.B. Road, Mumbai Central, Mumbai 400008',
                    coordinates: { lat: 19.0760, lng: 72.8777 },
                    type: 'vendor',
                    status: 'active'
                  },
                  {
                    id: 'delivery-1',
                    name: 'Rajesh Kumar - Delivery Staff',
                    address: 'Near CST Station, Mumbai',
                    coordinates: { lat: 19.0176, lng: 72.8562 },
                    type: 'delivery_staff',
                    status: 'active',
                    eta: '12 mins'
                  },
                  {
                    id: 'delivery-2',
                    name: 'Priya Sharma - Delivery Staff',
                    address: 'Andheri West, Mumbai',
                    coordinates: { lat: 19.1197, lng: 72.8464 },
                    type: 'delivery_staff',
                    status: 'busy',
                    eta: '8 mins'
                  },
                  {
                    id: 'customer-1',
                    name: 'Amit Patel',
                    address: 'Bandra West, Mumbai',
                    coordinates: { lat: 19.0544, lng: 72.8406 },
                    type: 'customer',
                    status: 'pending',
                    eta: '20 mins',
                    priority: 1
                  },
                  {
                    id: 'customer-2',
                    name: 'Sneha Desai',
                    address: 'Powai, Mumbai',
                    coordinates: { lat: 19.1176, lng: 72.9060 },
                    type: 'customer',
                    status: 'pending',
                    eta: '25 mins',
                    priority: 2
                  },
                  {
                    id: 'customer-3',
                    name: 'Rahul Singh',
                    address: 'Malad West, Mumbai',
                    coordinates: { lat: 19.1868, lng: 72.8481 },
                    type: 'customer',
                    status: 'pending',
                    eta: '30 mins',
                    priority: 3
                  },
                  {
                    id: 'customer-4',
                    name: 'Priya Iyer',
                    address: 'Juhu, Mumbai',
                    coordinates: { lat: 19.1074, lng: 72.8263 },
                    type: 'customer',
                    status: 'delivered'
                  },
                  {
                    id: 'customer-5',
                    name: 'Vikram Joshi',
                    address: 'Thane West, Mumbai',
                    coordinates: { lat: 19.2183, lng: 72.9781 },
                    type: 'customer',
                    status: 'pending',
                    eta: '35 mins',
                    priority: 4
                  }
                ]}
                centerLocation={{ lat: 19.0760, lng: 72.8777 }}
                showRoute={true}
                isDeliveryView={false}
                enableRouteOptimization={true}
                enableRealTimeTracking={true}
                onLocationClick={(location) => {
                  console.log('Location clicked:', location);
                }}
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest customer orders and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: 'ORD001', customer: 'Priya Sharma', status: 'Preparing', time: '12:30 PM' },
                      { id: 'ORD002', customer: 'Raj Patel', status: 'Out for Delivery', time: '12:25 PM' },
                      { id: 'ORD003', customer: 'Anita Singh', status: 'Delivered', time: '12:15 PM' },
                      { id: 'ORD004', customer: 'Vikram Modi', status: 'Preparing', time: '12:10 PM' }
                    ].map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-gray-500">{order.id} • {order.time}</p>
                        </div>
                        <Badge 
                          variant={order.status === 'Delivered' ? 'default' : 
                                   order.status === 'Out for Delivery' ? 'secondary' : 'outline'}
                        >
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators for your business</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Average Rating</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-yellow-600">{dashboardData.averageRating}</span>
                        <span className="text-sm text-gray-500">/ 5.0</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">On-time Delivery</span>
                      <span className="text-2xl font-bold text-green-600">94%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Customer Retention</span>
                      <span className="text-2xl font-bold text-blue-600">87%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Monthly Growth</span>
                      <span className="text-2xl font-bold text-purple-600">+{dashboardData.monthlyGrowth}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>


          </TabsContent>

          <TabsContent value="customers">
            <CustomerManagement />
          </TabsContent>

          <TabsContent value="menu">
            <MenuManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <SalesAnalytics />
          </TabsContent>

          <TabsContent value="delivery">
            <DeliveryStaffManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}