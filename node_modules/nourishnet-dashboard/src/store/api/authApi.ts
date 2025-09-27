import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add user ID
api.interceptors.request.use(
  (config) => {
    const userId = localStorage.getItem('userId')
    if (userId) {
      config.headers['x-user-id'] = userId
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userId')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  register: (userData: any) => api.post('/auth/register', userData),
  getCurrentUser: (userId: string) => api.get('/auth/me', {
    headers: { 'x-user-id': userId }
  }),
  updateProfile: (userId: string, userData: any) => api.put('/auth/profile', userData, {
    headers: { 'x-user-id': userId }
  }),
}

export default api