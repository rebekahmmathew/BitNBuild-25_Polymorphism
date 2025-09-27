import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { MapPin, Clock, User, Truck, Route, Search, Filter } from 'lucide-react'
import { deliveriesApi } from '../store/api/deliveriesApi'
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api'
import toast from 'react-hot-toast'

const Deliveries = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedDelivery, setSelectedDelivery] = useState(null)
  const queryClient = useQueryClient()

  const { data: deliveries, isLoading } = useQuery(
    ['deliveries', { date: selectedDate, status: statusFilter }],
    () => deliveriesApi.getDeliveries({ date: selectedDate, status: statusFilter })
  )

  const optimizeRouteMutation = useMutation(deliveriesApi.optimizeRoute, {
    onSuccess: () => {
      queryClient.invalidateQueries('deliveries')
      toast.success('Route optimized successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to optimize route')
    }
  })

  const updateStatusMutation = useMutation(deliveriesApi.updateStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries('deliveries')
      toast.success('Status updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update status')
    }
  })

  const handleOptimizeRoute = (deliveryId: string) => {
    optimizeRouteMutation.mutate(deliveryId)
  }

  const handleStatusUpdate = (deliveryId: string, status: string) => {
    updateStatusMutation.mutate({ id: deliveryId, status })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Scheduled' },
      in_progress: { color: 'bg-yellow-100 text-yellow-800', label: 'In Progress' },
      delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      cancelled: { color: 'bg-gray-100 text-gray-800', label: 'Cancelled' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

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
          <h1 className="text-2xl font-bold text-secondary-900">Deliveries</h1>
          <p className="text-secondary-600">Manage and track delivery routes</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="delivered">Delivered</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deliveries List */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-medium text-secondary-900 mb-4">Delivery List</h3>
            <div className="space-y-4">
              {deliveries?.deliveries?.map((delivery: any) => (
                <div key={delivery._id} className="border border-secondary-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">
                          {delivery.subscriptionId?.deliveryAddress?.street}
                        </p>
                        <p className="text-sm text-secondary-500">
                          {delivery.subscriptionId?.deliveryAddress?.city}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-x-2">
                      {getStatusBadge(delivery.status)}
                      <button
                        onClick={() => setSelectedDelivery(delivery)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        View Map
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center gap-x-2">
                      <Clock className="h-4 w-4 text-secondary-500" />
                      <span className="text-sm text-secondary-600">
                        {delivery.route?.totalTime || 0} min
                      </span>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <Route className="h-4 w-4 text-secondary-500" />
                      <span className="text-sm text-secondary-600">
                        {delivery.route?.totalDistance || 0} km
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                      <User className="h-4 w-4 text-secondary-500" />
                      <span className="text-sm text-secondary-600">
                        {delivery.staffId?.name || 'Unassigned'}
                      </span>
                    </div>
                    <div className="flex items-center gap-x-2">
                      {delivery.status === 'scheduled' && (
                        <button
                          onClick={() => handleOptimizeRoute(delivery._id)}
                          className="text-primary-600 hover:text-primary-700 text-sm"
                        >
                          Optimize Route
                        </button>
                      )}
                      {delivery.status === 'scheduled' && (
                        <button
                          onClick={() => handleStatusUpdate(delivery._id, 'in_progress')}
                          className="text-green-600 hover:text-green-700 text-sm"
                        >
                          Start Delivery
                        </button>
                      )}
                      {delivery.status === 'in_progress' && (
                        <button
                          onClick={() => handleStatusUpdate(delivery._id, 'delivered')}
                          className="text-green-600 hover:text-green-700 text-sm"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-medium text-secondary-900 mb-4">Route Map</h3>
            {selectedDelivery ? (
              <DeliveryMap delivery={selectedDelivery} />
            ) : (
              <div className="h-64 bg-secondary-100 rounded-lg flex items-center justify-center">
                <p className="text-secondary-500">Select a delivery to view route</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Delivery Map Component
const DeliveryMap = ({ delivery }: any) => {
  const mapContainerStyle = {
    width: '100%',
    height: '300px'
  }

  const center = delivery.subscriptionId?.deliveryAddress?.coordinates || {
    lat: 19.0760,
    lng: 72.8777
  }

  const waypoints = delivery.route?.waypoints?.map((waypoint: any) => ({
    lat: waypoint.coordinates.lat,
    lng: waypoint.coordinates.lng
  })) || [center]

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
      >
        {waypoints.map((point: any, index: number) => (
          <Marker
            key={index}
            position={point}
            label={`${index + 1}`}
          />
        ))}
        {waypoints.length > 1 && (
          <Polyline
            path={waypoints}
            options={{
              strokeColor: '#0ea5e9',
              strokeWeight: 3,
              strokeOpacity: 0.8
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  )
}

export default Deliveries
