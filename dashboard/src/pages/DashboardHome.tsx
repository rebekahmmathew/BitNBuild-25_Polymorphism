import { useQuery } from 'react-query'
import { Users, Truck, DollarSign, TrendingUp } from 'lucide-react'
import { analyticsApi } from '../store/api/analyticsApi'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import AIOptimization from '../components/AIOptimization'

const DashboardHome = () => {
  const { data: overview, isLoading: overviewLoading } = useQuery(
    'dashboard-overview',
    analyticsApi.getOverview
  )

  const { data: revenueData, isLoading: revenueLoading } = useQuery(
    'revenue-analytics',
    () => analyticsApi.getRevenue({ groupBy: 'day', days: 7 })
  )

  const { data: subscriptionData, isLoading: subscriptionLoading } = useQuery(
    'subscription-analytics',
    () => analyticsApi.getSubscriptions({ days: 30 })
  )

  if (overviewLoading || revenueLoading || subscriptionLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  const stats = [
    {
      name: 'Active Subscriptions',
      value: overview?.activeSubscriptions || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Today\'s Deliveries',
      value: overview?.todayDeliveries || 0,
      icon: Truck,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Total Revenue',
      value: `₹${overview?.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      name: 'New Subscriptions',
      value: overview?.todaySubscriptions || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-secondary-600">Welcome back! Here's what's happening with your tiffin service.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-secondary-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="card">
          <h3 className="text-lg font-medium text-secondary-900 mb-4">Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData?.revenueData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="totalRevenue" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription Chart */}
        <div className="card">
          <h3 className="text-lg font-medium text-secondary-900 mb-4">Subscription Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subscriptionData?.planTypeStats || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Optimization */}
      <AIOptimization />

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-medium text-secondary-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
              <span className="text-sm text-secondary-600">New subscription created</span>
            </div>
            <span className="text-xs text-secondary-500">2 minutes ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
              <span className="text-sm text-secondary-600">Menu published for today</span>
            </div>
            <span className="text-xs text-secondary-500">1 hour ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3" />
              <span className="text-sm text-secondary-600">Delivery completed</span>
            </div>
            <span className="text-xs text-secondary-500">3 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHome
