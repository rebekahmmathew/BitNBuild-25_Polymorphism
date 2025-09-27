import api from './authApi'

export const subscribersApi = {
  getSubscribers: (params: { search?: string; status?: string; page?: number; limit?: number }) => 
    api.get('/subscriptions', { params }),
  updateStatus: ({ id, status }: { id: string; status: string }) => 
    api.put(`/subscriptions/${id}`, { status }),
  pauseSubscription: (id: string, data: { pauseStartDate: string; pauseEndDate?: string }) => 
    api.post(`/subscriptions/${id}/pause`, data),
  resumeSubscription: (id: string) => 
    api.post(`/subscriptions/${id}/resume`),
}
