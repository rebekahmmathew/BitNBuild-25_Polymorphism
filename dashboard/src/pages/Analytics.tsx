import { useState } from 'react'
import { useQuery } from 'react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Calendar, TrendingUp, DollarSign, Users, Truck } from 'lucide-react'
import { analyticsApi } from '../store/api/analyticsApi'

const Analytics = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })

  const { data: revenueData, isLoading: revenueLoading } = useQuery(
    ['revenue-analytics', dateRange],
    () => analyticsApi.getRevenue({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      groupBy: 'day'
    })
  )

  const { data: subscriptionData, isLoading: subscriptionLoading } = useQuery(
    ['subscription-analytics', dateRange],
    () => analyticsApi.getSubscriptions({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    })
  )

  const { data: deliveryData, isLoading: deliveryLoading } = useQuery(
    ['delivery-analytics', dateRange],
    () => analyticsApi.getDeliveries({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    })
  )

  const { data: menuData, isLoading: menuLoading } = useQuery(
    ['menu-analytics', dateRange],
    () => analyticsApi.getMenus({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    })
  )

  const isLoading = revenueLoading || subscriptionLoading || deliveryLoading || menuLoading

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Analytics</h1>
          <p className="text-secondary-600">Track your business performance</p>
        </div>
        <div className="flex gap-x-4">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            className="input-field"
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            className="input-field"
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md p-3 bg-blue-100">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-secondary-900">
                ₹{subscriptionData?.subscriptionStats?.totalRevenue?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md p-3 bg-green-100">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Active Subscriptions</p>
              <p className="text-2xl font-semibold text-secondary-900">
                {subscriptionData?.subscriptionStats?.activeSubscriptions || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md p-3 bg-yellow-100">
              <Truck className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Completed Deliveries</p>
              <p className="text-2xl font-semibold text-secondary-900">
                {deliveryData?.deliveryStats?.completedDeliveries || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md p-3 bg-purple-100">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">On-Time Rate</p>
              <p className="text-2xl font-semibold text-secondary-900">
                {deliveryData?.deliveryStats?.onTimeRate || 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
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

        {/* Subscription Breakdown */}
        <div className="card">
          <h3 className="text-lg font-medium text-secondary-900 mb-4">Subscription Plans</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subscriptionData?.planTypeStats || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(subscriptionData?.planTypeStats || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delivery Status */}
        <div className="card">
          <h3 className="text-lg font-medium text-secondary-900 mb-4">Delivery Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deliveryData?.statusBreakdown || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Menu Items */}
        <div className="card">
          <h3 className="text-lg font-medium text-secondary-900 mb-4">Popular Menu Items</h3>
          <div className="space-y-3">
            {menuData?.popularItems?.slice(0, 5).map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs font-medium text-primary-700">
                    {index + 1}
                  </div>
                  <span className="text-sm text-secondary-700">{item._id}</span>
                </div>
                <div className="text-sm text-secondary-500">
                  {item.count} times
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Subscription Details */}
        <div className="card">
          <h3 className="text-lg font-medium text-secondary-900 mb-4">Subscription Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-secondary-600">Total Subscriptions</span>
              <span className="text-sm font-medium text-secondary-900">
                {subscriptionData?.subscriptionStats?.totalSubscriptions || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-secondary-600">Active</span>
              <span className="text-sm font-medium text-green-600">
                {subscriptionData?.subscriptionStats?.activeSubscriptions || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-secondary-600">Paused</span>
              <span className="text-sm font-medium text-yellow-600">
                {subscriptionData?.subscriptionStats?.pausedSubscriptions || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-secondary-600">Cancelled</span>
              <span className="text-sm font-medium text-red-600">
                {subscriptionData?.subscriptionStats?.cancelledSubscriptions || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-secondary-600">Average Revenue</span>
              <span className="text-sm font-medium text-secondary-900">
                ₹{subscriptionData?.subscriptionStats?.averageRevenue?.toFixed(2) || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Performance */}
        <div className="card">
          <h3 className="text-lg font-medium text-secondary-900 mb-4">Delivery Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-secondary-600">Total Deliveries</span>
              <span className="text-sm font-medium text-secondary-900">
                {deliveryData?.deliveryStats?.totalDeliveries || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-secondary-600">Completed</span>
              <span className="text-sm font-medium text-green-600">
                {deliveryData?.deliveryStats?.completedDeliveries || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-secondary-600">Failed</span>
              <span className="text-sm font-medium text-red-600">
                {deliveryData?.deliveryStats?.failedDeliveries || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-secondary-600">Average Time</span>
              <span className="text-sm font-medium text-secondary-900">
                {deliveryData?.deliveryStats?.averageDeliveryTime?.toFixed(1) || 0} min
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-secondary-600">Total Distance</span>
              <span className="text-sm font-medium text-secondary-900">
                {deliveryData?.deliveryStats?.totalDistance?.toFixed(1) || 0} km
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
