import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { User, Bell, Shield, CreditCard, MapPin } from 'lucide-react'
import { authApi } from '../store/api/authApi'
import toast from 'react-hot-toast'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const queryClient = useQueryClient()

  const updateProfileMutation = useMutation(authApi.updateProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries('auth')
      toast.success('Profile updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update profile')
    }
  })

  const handleUpdateProfile = (profileData: any) => {
    const token = localStorage.getItem('token')
    if (token) {
      updateProfileMutation.mutate({ token, userData: profileData })
    }
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'location', name: 'Location', icon: MapPin }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
        <p className="text-secondary-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                }`}
              >
                <tab.icon className="mr-3 h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {activeTab === 'profile' && <ProfileSettings onSubmit={handleUpdateProfile} />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'billing' && <BillingSettings />}
            {activeTab === 'location' && <LocationSettings />}
          </div>
        </div>
      </div>
    </div>
  )
}

// Profile Settings Component
const ProfileSettings = ({ onSubmit }: any) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-secondary-900 mb-4">Profile Information</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Street
            </label>
            <input
              type="text"
              value={formData.address.street}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, street: e.target.value }
              })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={formData.address.city}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, city: e.target.value }
              })}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              State
            </label>
            <input
              type="text"
              value={formData.address.state}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, state: e.target.value }
              })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Pincode
            </label>
            <input
              type="text"
              value={formData.address.pincode}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, pincode: e.target.value }
              })}
              className="input-field"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary">
            Update Profile
          </button>
        </div>
      </form>
    </div>
  )
}

// Notification Settings Component
const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    orderUpdates: true,
    marketing: false
  })

  const handleToggle = (key: string) => {
    setNotifications({ ...notifications, [key]: !notifications[key] })
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-secondary-900 mb-4">Notification Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-900">Email Notifications</p>
            <p className="text-sm text-secondary-500">Receive updates via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={() => handleToggle('email')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-900">Push Notifications</p>
            <p className="text-sm text-secondary-500">Receive push notifications on your device</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.push}
              onChange={() => handleToggle('push')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-900">SMS Notifications</p>
            <p className="text-sm text-secondary-500">Receive SMS updates</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.sms}
              onChange={() => handleToggle('sms')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>
    </div>
  )
}

// Security Settings Component
const SecuritySettings = () => {
  return (
    <div>
      <h3 className="text-lg font-medium text-secondary-900 mb-4">Security Settings</h3>
      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Security settings are managed through Firebase Authentication. 
            To change your password or security settings, please use the Firebase console.
          </p>
        </div>
      </div>
    </div>
  )
}

// Billing Settings Component
const BillingSettings = () => {
  return (
    <div>
      <h3 className="text-lg font-medium text-secondary-900 mb-4">Billing Information</h3>
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Billing is handled through Razorpay. To manage your payment methods and billing history, 
            please contact support or use the Razorpay dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}

// Location Settings Component
const LocationSettings = () => {
  return (
    <div>
      <h3 className="text-lg font-medium text-secondary-900 mb-4">Location Settings</h3>
      <div className="space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            Location services are used for delivery tracking and route optimization. 
            You can manage location permissions in your device settings.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Settings
