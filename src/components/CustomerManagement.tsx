import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  IndianRupee,
  User,
  Heart,
  AlertTriangle,
  CheckCircle,
  Clock,
  PauseCircle,
  Plus,
  X
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  planType: 'daily' | 'weekly' | 'monthly';
  planStatus: 'active' | 'paused' | 'cancelled';
  mealPreferences: string[];
  allergies: string[];
  totalSpent: number;
  joinDate: string;
  lastOrder: string;
  rating: number;
}

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    planType: 'monthly' as 'daily' | 'weekly' | 'monthly',
    mealPreferences: [] as string[],
    allergies: [] as string[]
  });

  useEffect(() => {
    // Simulate fetching customer data
    const mockCustomers: Customer[] = [
      {
        id: 'CUST001',
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '+91 98765 43210',
        address: 'B-204, Green Valley Apartments, Koramangala, Bangalore - 560034',
        planType: 'monthly',
        planStatus: 'active',
        mealPreferences: ['Vegetarian', 'Spicy', 'High-Protein'],
        allergies: ['Peanuts'],
        totalSpent: 15600,
        joinDate: '2024-01-15',
        lastOrder: '2024-09-27',
        rating: 4.8
      },
      {
        id: 'CUST002',
        name: 'Raj Patel',
        email: 'raj.patel@email.com',
        phone: '+91 87654 32109',
        address: 'A-101, Sunrise Complex, Whitefield, Bangalore - 560066',
        planType: 'weekly',
        planStatus: 'active',
        mealPreferences: ['Non-Vegetarian', 'Mild', 'Regular'],
        allergies: ['Dairy', 'Shellfish'],
        totalSpent: 8900,
        joinDate: '2024-03-10',
        lastOrder: '2024-09-26',
        rating: 4.6
      },
      {
        id: 'CUST003',
        name: 'Anita Singh',
        email: 'anita.singh@email.com',
        phone: '+91 76543 21098',
        address: 'C-305, Tech Park Residency, Electronic City, Bangalore - 560100',
        planType: 'daily',
        planStatus: 'paused',
        mealPreferences: ['Jain', 'Mild', 'Low-Carb'],
        allergies: [],
        totalSpent: 12300,
        joinDate: '2024-02-20',
        lastOrder: '2024-09-20',
        rating: 4.9
      },
      {
        id: 'CUST004',
        name: 'Vikram Modi',
        email: 'vikram.modi@email.com',
        phone: '+91 65432 10987',
        address: 'D-12, Metro Heights, Indiranagar, Bangalore - 560038',
        planType: 'monthly',
        planStatus: 'active',
        mealPreferences: ['Vegetarian', 'Spicy', 'High-Protein'],
        allergies: ['Gluten'],
        totalSpent: 18700,
        joinDate: '2023-11-05',
        lastOrder: '2024-09-27',
        rating: 4.7
      }
    ];
    setCustomers(mockCustomers);
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || customer.planStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'paused': return <PauseCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customer Management</h2>
          <p className="text-gray-600">Manage your subscribers and their preferences</p>
        </div>
        <Button 
          className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
          onClick={() => setIsAddingCustomer(true)}
        >
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search customers by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Cards */}
          <div className="space-y-3">
            {filteredCustomers.map((customer) => (
              <Card 
                key={customer.id} 
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedCustomer?.id === customer.id ? 'ring-2 ring-orange-500' : ''
                }`}
                onClick={() => setSelectedCustomer(customer)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{customer.name}</h3>
                          <Badge className={`${getStatusColor(customer.planStatus)} flex items-center gap-1`}>
                            {getStatusIcon(customer.planStatus)}
                            {customer.planStatus}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                        <p className="text-sm text-gray-500">{customer.phone}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-500 capitalize">{customer.planType} Plan</span>
                          <span className="text-sm text-gray-500">₹{customer.totalSpent.toLocaleString()} spent</span>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3 text-red-500 fill-current" />
                            <span className="text-sm text-gray-500">{customer.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Customer Details */}
        <div className="space-y-4">
          {selectedCustomer ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-3">
                      <AvatarFallback className="text-lg">
                        {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
                    <p className="text-sm text-gray-500">Customer ID: {selectedCustomer.id}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      <span className="text-sm">{selectedCustomer.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Joined: {new Date(selectedCustomer.joinDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Total Spent: ₹{selectedCustomer.totalSpent.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Meal Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Dietary Preferences</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCustomer.mealPreferences.map((pref) => (
                          <Badge key={pref} variant="secondary">{pref}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Allergies</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCustomer.allergies.length > 0 ? (
                          selectedCustomer.allergies.map((allergy) => (
                            <Badge key={allergy} variant="destructive" className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {allergy}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">No known allergies</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subscription Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Plan Type</span>
                      <Badge variant="outline" className="capitalize">{selectedCustomer.planType}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status</span>
                      <Badge className={getStatusColor(selectedCustomer.planStatus)}>
                        {selectedCustomer.planStatus}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Last Order</span>
                      <span className="text-sm text-gray-600">
                        {new Date(selectedCustomer.lastOrder).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Rating</span>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                        <span className="text-sm">{selectedCustomer.rating}/5.0</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Button variant="outline" className="w-full">
                      View Order History
                    </Button>
                    <Button variant="outline" className="w-full">
                      Send Message
                    </Button>
                    {selectedCustomer.planStatus === 'active' && (
                      <Button variant="destructive" className="w-full">
                        Pause Subscription
                      </Button>
                    )}
                    {selectedCustomer.planStatus === 'paused' && (
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Resume Subscription
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Customer</h3>
                <p className="text-gray-500">Click on a customer from the list to view their details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add New Customer</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsAddingCustomer(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Create a new customer profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer-name">Full Name</Label>
                  <Input
                    id="customer-name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <Label htmlFor="customer-phone">Phone Number</Label>
                  <Input
                    id="customer-phone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="customer-email">Email Address</Label>
                <Input
                  id="customer-email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="customer@email.com"
                />
              </div>

              <div>
                <Label htmlFor="customer-address">Address</Label>
                <Textarea
                  id="customer-address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Complete address with pincode"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="plan-type">Subscription Plan</Label>
                <select
                  id="plan-type"
                  value={newCustomer.planType}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, planType: e.target.value as any }))}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="daily">Daily Plan</option>
                  <option value="weekly">Weekly Plan</option>
                  <option value="monthly">Monthly Plan</option>
                </select>
              </div>

              <div>
                <Label>Meal Preferences</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['Vegetarian', 'Non-Vegetarian', 'Jain', 'Vegan', 'Spicy', 'Mild', 'High-Protein', 'Low-Carb'].map((pref) => (
                    <label key={pref} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newCustomer.mealPreferences.includes(pref)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewCustomer(prev => ({
                              ...prev,
                              mealPreferences: [...prev.mealPreferences, pref]
                            }));
                          } else {
                            setNewCustomer(prev => ({
                              ...prev,
                              mealPreferences: prev.mealPreferences.filter(p => p !== pref)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{pref}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Known Allergies</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['Peanuts', 'Dairy', 'Gluten', 'Soy', 'Shellfish', 'Eggs', 'Tree Nuts'].map((allergy) => (
                    <label key={allergy} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newCustomer.allergies.includes(allergy)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewCustomer(prev => ({
                              ...prev,
                              allergies: [...prev.allergies, allergy]
                            }));
                          } else {
                            setNewCustomer(prev => ({
                              ...prev,
                              allergies: prev.allergies.filter(a => a !== allergy)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{allergy}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone || !newCustomer.address) {
                      toast.error('Please fill in all required fields');
                      return;
                    }

                    const customer: Customer = {
                      id: `CUST${(customers.length + 1).toString().padStart(3, '0')}`,
                      name: newCustomer.name,
                      email: newCustomer.email,
                      phone: newCustomer.phone,
                      address: newCustomer.address,
                      planType: newCustomer.planType,
                      planStatus: 'active',
                      mealPreferences: newCustomer.mealPreferences,
                      allergies: newCustomer.allergies,
                      totalSpent: 0,
                      joinDate: new Date().toISOString().split('T')[0],
                      lastOrder: new Date().toISOString().split('T')[0],
                      rating: 5.0
                    };

                    setCustomers(prev => [customer, ...prev]);
                    setIsAddingCustomer(false);
                    setNewCustomer({
                      name: '',
                      email: '',
                      phone: '',
                      address: '',
                      planType: 'monthly',
                      mealPreferences: [],
                      allergies: []
                    });
                    toast.success('Customer added successfully!');
                  }}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  Add Customer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingCustomer(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}