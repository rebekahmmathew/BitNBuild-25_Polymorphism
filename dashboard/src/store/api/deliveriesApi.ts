import api from './authApi'

export const deliveriesApi = {
  getDeliveries: (params: { date?: string; status?: string; staffId?: string }) => 
    api.get('/deliveries', { params }),
  createDelivery: (deliveryData: any) => api.post('/deliveries', deliveryData),
  optimizeRoute: (id: string, data?: { trafficConditions?: string; weatherConditions?: string }) => 
    api.post(`/deliveries/${id}/optimize`, data),
  updateStatus: ({ id, status, currentLocation, notes }: { 
    id: string; 
    status: string; 
    currentLocation?: { lat: number; lng: number }; 
    notes?: string 
  }) => api.put(`/deliveries/${id}/status`, { status, currentLocation, notes }),
  getDeliveryTracking: (subscriptionId: string) => 
    api.get(`/deliveries/track/${subscriptionId}`),
}
