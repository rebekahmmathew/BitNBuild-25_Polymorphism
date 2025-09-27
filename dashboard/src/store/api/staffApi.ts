import api from './authApi'

export const staffApi = {
  getStaff: (params?: { role?: string; isActive?: boolean }) => 
    api.get('/staff', { params }),
  createStaff: (staffData: any) => api.post('/staff', staffData),
  updateStaff: ({ id, ...staffData }: { id: string; [key: string]: any }) => 
    api.put(`/staff/${id}`, staffData),
  assignDelivery: (staffId: string, deliveryId: string) => 
    api.post(`/staff/${staffId}/assign-delivery`, { deliveryId }),
  getPerformance: (staffId: string) => 
    api.get(`/staff/${staffId}/performance`),
  updateLocation: (staffId: string, location: { lat: number; lng: number }) => 
    api.put(`/staff/${staffId}/location`, location),
}
