import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  MapPin, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Users,
  IndianRupee,
  Calendar,
  Heart,
  UtensilsCrossed,
  MessageSquare,
  Target
} from 'lucide-react';

export default function SalesAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  
  // Sample data - in real app this would come from Supabase
  const revenueData = [
    { name: 'Mon', revenue: 12500, orders: 89 },
    { name: 'Tue', revenue: 15200, orders: 102 },
    { name: 'Wed', revenue: 11800, orders: 84 },
    { name: 'Thu', revenue: 14600, orders: 97 },
    { name: 'Fri', revenue: 18900, orders: 125 },
    { name: 'Sat', revenue: 22100, orders: 143 },
    { name: 'Sun', revenue: 16400, orders: 108 }
  ];

  const areaWiseData = [
    { area: 'Koramangala', revenue: 28500, customers: 123, rating: 4.8 },
    { area: 'Whitefield', revenue: 22100, customers: 89, rating: 4.6 },
    { area: 'Electronic City', revenue: 19800, customers: 76, rating: 4.7 },
    { area: 'Indiranagar', revenue: 25200, customers: 98, rating: 4.9 },
    { area: 'HSR Layout', revenue: 17600, customers: 67, rating: 4.5 },
    { area: 'BTM Layout', revenue: 21300, customers: 84, rating: 4.6 }
  ];

  const menuPerformanceData = [
    { name: 'Dal Tadka', orders: 456, revenue: 36480, satisfaction: 94 },
    { name: 'Jeera Rice', orders: 389, revenue: 23340, satisfaction: 92 },
    { name: 'Mixed Veg Curry', orders: 234, revenue: 21060, satisfaction: 87 },
    { name: 'Chapati', orders: 567, revenue: 8505, satisfaction: 89 },
    { name: 'Rajma Chawal', orders: 198, revenue: 23760, satisfaction: 91 },
    { name: 'Paneer Butter Masala', orders: 176, revenue: 26400, satisfaction: 93 }
  ];

  const sentimentData = [
    { name: 'Very Positive', value: 45, color: '#10b981' },
    { name: 'Positive', value: 32, color: '#34d399' },
    { name: 'Neutral', value: 15, color: '#fbbf24' },
    { name: 'Negative', value: 6, color: '#f87171' },
    { name: 'Very Negative', value: 2, color: '#ef4444' }
  ];

  const monthlyTrends = [
    { month: 'Jan', revenue: 285000, customers: 234, satisfaction: 4.6 },
    { month: 'Feb', revenue: 310000, customers: 267, satisfaction: 4.7 },
    { month: 'Mar', revenue: 295000, customers: 245, satisfaction: 4.5 },
    { month: 'Apr', revenue: 340000, customers: 289, satisfaction: 4.8 },
    { month: 'May', revenue: 365000, customers: 312, satisfaction: 4.7 },
    { month: 'Jun', revenue: 385000, customers: 347, satisfaction: 4.9 }
  ];

  const recentFeedback = [
    {
      id: 1,
      customer: 'Priya Sharma',
      rating: 5,
      comment: 'The Dal Tadka was absolutely delicious! Perfect spice level and delivered hot.',
      sentiment: 'positive',
      date: '2024-09-27',
      dish: 'Dal Tadka'
    },
    {
      id: 2,
      customer: 'Raj Patel',
      rating: 4,
      comment: 'Good food but delivery was slightly delayed. Overall satisfied with the quality.',
      sentiment: 'positive',
      date: '2024-09-26',
      dish: 'Jeera Rice'
    },
    {
      id: 3,
      customer: 'Anita Singh',
      rating: 3,
      comment: 'The vegetables in the curry were a bit overcooked. Rest was fine.',
      sentiment: 'neutral',
      date: '2024-09-25',
      dish: 'Mixed Veg Curry'
    },
    {
      id: 4,
      customer: 'Vikram Modi',
      rating: 5,
      comment: 'Excellent food and packaging. The chapatis were fresh and soft!',
      sentiment: 'positive',
      date: '2024-09-25',
      dish: 'Chapati'
    }
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'neutral': return 'bg-yellow-100 text-yellow-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue', suffix = '' }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}{suffix}</p>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sales Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into your business performance</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="areas" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Area Analysis
          </TabsTrigger>
          <TabsTrigger value="menu" className="flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4" />
            Menu Performance
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Customer Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue"
              value="₹1,21,500"
              icon={IndianRupee}
              trend={12.5}
              color="green"
            />
            <StatCard
              title="Total Orders"
              value="748"
              icon={UtensilsCrossed}
              trend={8.2}
              color="blue"
            />
            <StatCard
              title="Average Rating"
              value="4.7"
              icon={Star}
              color="yellow"
              suffix="/5"
            />
            <StatCard
              title="Customer Satisfaction"
              value="94"
              icon={Heart}
              trend={2.1}
              color="red"
              suffix="%"
            />
          </div>

          {/* Revenue & Orders Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Orders Trend</CardTitle>
              <CardDescription>Daily performance over the last week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#f97316"
                    fill="#fed7aa"
                    name="Revenue (₹)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Orders"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Growth Trends</CardTitle>
              <CardDescription>6-month performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Revenue (₹)"
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="customers"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    name="Customers"
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="areas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Area-wise Performance
              </CardTitle>
              <CardDescription>Revenue and customer distribution across delivery areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {areaWiseData.map((area, index) => (
                  <div key={area.area} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full">
                        <span className="font-semibold text-orange-600">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{area.area}</h3>
                        <p className="text-sm text-gray-500">{area.customers} customers</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">₹{area.revenue.toLocaleString()}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-sm">{area.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Distribution by Area</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={areaWiseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="area" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5" />
                Menu Item Performance
              </CardTitle>
              <CardDescription>Orders, revenue, and satisfaction by dish</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {menuPerformanceData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                        <span className="font-semibold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">₹{item.revenue.toLocaleString()}</p>
                      <Badge className={`${item.satisfaction >= 90 ? 'bg-green-100 text-green-800' : 
                                         item.satisfaction >= 80 ? 'bg-yellow-100 text-yellow-800' : 
                                         'bg-red-100 text-red-800'}`}>
                        {item.satisfaction}% satisfaction
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Orders by Menu Item</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={menuPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Menu Item</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={menuPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Sentiment Analysis
                </CardTitle>
                <CardDescription>Customer feedback sentiment distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feedback Insights</CardTitle>
                <CardDescription>AI-powered analysis of customer reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <ThumbsUp className="h-4 w-4 text-green-600" />
                      <h4 className="font-semibold text-green-800">Top Compliments</h4>
                    </div>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• "Delicious taste" mentioned 23 times</li>
                      <li>• "Fresh and hot delivery" mentioned 18 times</li>
                      <li>• "Perfect spice level" mentioned 15 times</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <ThumbsDown className="h-4 w-4 text-red-600" />
                      <h4 className="font-semibold text-red-800">Areas to Improve</h4>
                    </div>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• "Delivery delay" mentioned 5 times</li>
                      <li>• "Vegetables overcooked" mentioned 3 times</li>
                      <li>• "Portion size" mentioned 2 times</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">AI Recommendations</h4>
                    </div>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Focus on reducing delivery times</li>
                      <li>• Train kitchen staff on vegetable cooking</li>
                      <li>• Consider offering portion size options</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Customer Feedback</CardTitle>
              <CardDescription>Latest reviews and ratings from your customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentFeedback.map((feedback) => (
                  <div key={feedback.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-orange-600">
                            {feedback.customer.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold">{feedback.customer}</p>
                          <p className="text-sm text-gray-500">{feedback.dish} • {feedback.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <Badge className={getSentimentColor(feedback.sentiment)}>
                          {feedback.sentiment}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{feedback.comment}</p>
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