import api from './authApi'

export const menusApi = {
  getMenus: (params?: { date?: string; type?: string; isPublished?: boolean }) => 
    api.get('/menus', { params }),
  createMenu: (menuData: any) => api.post('/menus', menuData),
  updateMenu: (id: string, menuData: any) => api.put(`/menus/${id}`, menuData),
  publishMenu: (id: string) => api.post(`/menus/${id}/publish`),
  getPublishedMenus: (params?: { date?: string; type?: string }) => 
    api.get('/menus/published', { params }),
}
