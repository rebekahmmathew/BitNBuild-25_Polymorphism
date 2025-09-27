import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { 
  Users, 
  Package, 
  Truck, 
  DollarSign, 
  TrendingUp, 
  Clock,
  MapPin,
  Star,
  Activity,
  Zap,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import AIOptimization from '../components/AIOptimization';
import GoogleMapsRoute from '../components/GoogleMapsRoute';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

interface DashboardStats {
  totalSubscriptions: number;
  activeDeliveries: number;
  totalRevenue: number;
  newCustomers: number;
  onTimeDeliveries: number;
  averageDeliveryTime: number;
  customerSatisfaction: number;
  routeEfficiency: number;
}

interface Delivery {
  id: string;
  address: string;
  coordinates: { lat: number; lng: number };
  status: string;
  customerName: string;
  estimatedTime: number;
  order: number;
}

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSubscriptions: 0,
    activeDeliveries: 0,
    totalRevenue: 0,
    newCustomers: 0,
    onTimeDeliveries: 0,
    averageDeliveryTime: 0,
    customerSatisfaction: 0,
    routeEfficiency: 0
  });
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'routes'>('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/analytics/overview`, {
        headers: { 'x-user-id': 'vendor_1' }
      });
      const statsData = await statsResponse.json();
      
      // Fetch deliveries
      const deliveriesResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/deliveries`, {
        headers: { 'x-user-id': 'vendor_1' }
      });
      const deliveriesData = await deliveriesResponse.json();
      
      setStats({
        totalSubscriptions: statsData.totalSubscriptions || 89,
        activeDeliveries: statsData.activeDeliveries || 14,
        totalRevenue: statsData.totalRevenue || 75000,
        newCustomers: statsData.newCustomers || 12,
        onTimeDeliveries: statsData.onTimeDeliveries || 138,
        averageDeliveryTime: statsData.averageDeliveryTime || 28,
        customerSatisfaction: statsData.customerSatisfaction || 4.7,
        routeEfficiency: statsData.routeEfficiency || 87
      });

      // Transform deliveries data
      const transformedDeliveries = deliveriesData.map((delivery: any, index: number) => ({
        id: delivery.id,
        address: delivery.customerAddress || 'Address not available',
        coordinates: delivery.customerCoordinates || { lat: 19.0760, lng: 72.8777 },
        status: delivery.status || 'scheduled',
        customerName: delivery.customerName || `Customer ${index + 1}`,
        estimatedTime: delivery.estimatedTime || 15,
        order: index + 1
      }));
      
      setDeliveries(transformedDeliveries);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set mock data for demo
      setStats({
        totalSubscriptions: 89,
        activeDeliveries: 14,
        totalRevenue: 75000,
        newCustomers: 12,
        onTimeDeliveries: 138,
        averageDeliveryTime: 28,
        customerSatisfaction: 4.7,
        routeEfficiency: 87
      });
      
      setDeliveries([
        {
          id: 'del_1',
          address: '123 Main Street, Mumbai',
          coordinates: { lat: 19.0760, lng: 72.8777 },
          status: 'scheduled',
          customerName: 'Priya Sharma',
          estimatedTime: 15,
          order: 1
        },
        {
          id: 'del_2',
          address: '456 Oak Avenue, Mumbai',
          coordinates: { lat: 19.0740, lng: 72.8757 },
          status: 'in_progress',
          customerName: 'Amit Patel',
          estimatedTime: 20,
          order: 2
        },
        {
          id: 'del_3',
          address: '789 Pine Street, Mumbai',
          coordinates: { lat: 19.0780, lng: 72.8797 },
          status: 'scheduled',
          customerName: 'Sneha Reddy',
          estimatedTime: 25,
          order: 3
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRouteOptimized = (optimizedDeliveries: Delivery[]) => {
    setDeliveries(optimizedDeliveries);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Subscriptions',
      value: stats.totalSubscriptions,
      icon: Users,
      color: 'blue',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Deliveries',
      value: stats.activeDeliveries,
      icon: Truck,
      color: 'green',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'yellow',
      change: '+18%',
      changeType: 'positive'
    },
    {
      title: 'New Customers',
      value: stats.newCustomers,
      icon: TrendingUp,
      color: 'purple',
      change: '+8%',
      changeType: 'positive'
    }
  ];

  const performanceCards = [
    {
      title: 'On-Time Delivery Rate',
      value: `${Math.round((stats.onTimeDeliveries / (stats.activeDeliveries + stats.onTimeDeliveries)) * 100)}%`,
      icon: Clock,
      color: 'green'
    },
    {
      title: 'Avg Delivery Time',
      value: `${stats.averageDeliveryTime} min`,
      icon: Activity,
      color: 'blue'
    },
    {
      title: 'Customer Satisfaction',
      value: `${stats.customerSatisfaction}/5`,
      icon: Star,
      color: 'yellow'
    },
    {
      title: 'Route Efficiency',
      value: `${stats.routeEfficiency}%`,
      icon: Zap,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your tiffin service.</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'routes'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Routes
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceCards.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Optimization */}
          <AIOptimization />

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Delivery completed successfully</p>
                  <p className="text-sm text-gray-500">Priya Sharma - 123 Main Street</p>
                </div>
                <div className="flex-shrink-0 text-sm text-gray-500">2 min ago</div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Route optimized using AI</p>
                  <p className="text-sm text-gray-500">3 deliveries optimized, saved 15 minutes</p>
                </div>
                <div className="flex-shrink-0 text-sm text-gray-500">5 min ago</div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Users className="w-5 h-5 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">New subscription created</p>
                  <p className="text-sm text-gray-500">Amit Patel - Weekly plan</p>
                </div>
                <div className="flex-shrink-0 text-sm text-gray-500">1 hour ago</div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Package className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Menu published for today</p>
                  <p className="text-sm text-gray-500">5 items added to today's menu</p>
                </div>
                <div className="flex-shrink-0 text-sm text-gray-500">2 hours ago</div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'analytics' && (
        <AnalyticsDashboard />
      )}

      {activeTab === 'routes' && (
        <GoogleMapsRoute
          deliveries={deliveries}
          onRouteOptimized={handleRouteOptimized}
          vendorLocation={{ lat: 19.0760, lng: 72.8777 }}
        />
      )}
    </div>
  );
};

export default DashboardHome;