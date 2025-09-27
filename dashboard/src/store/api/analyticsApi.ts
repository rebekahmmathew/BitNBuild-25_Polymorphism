import api from './authApi'

export const analyticsApi = {
  getOverview: () => api.get('/analytics/overview'),
  getRevenue: (params: { groupBy?: string; days?: number; startDate?: string; endDate?: string }) => 
    api.get('/analytics/revenue', { params }),
  getSubscriptions: (params: { days?: number; startDate?: string; endDate?: string }) => 
    api.get('/analytics/subscriptions', { params }),
  getDeliveries: (params: { startDate?: string; endDate?: string }) => 
    api.get('/analytics/deliveries', { params }),
  getMenus: (params: { startDate?: string; endDate?: string }) => 
    api.get('/analytics/menus', { params }),
}
