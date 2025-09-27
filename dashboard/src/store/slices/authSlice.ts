import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authApi } from '../api/authApi'

interface User {
  id: string
  email: string
  name: string
  role: 'vendor' | 'consumer'
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    pincode: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  preferences?: {
    veg: boolean
    spiceLevel: 'mild' | 'medium' | 'hot'
    allergies: string[]
    dietaryRestrictions: string[]
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
}

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (user: User, { rejectWithValue }) => {
    try {
      // Store user ID in localStorage
      localStorage.setItem('userId', user.id)
      return user
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData)
      const user = response.data.user
      localStorage.setItem('userId', user.id)
      return user
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed')
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ userId, userData }: { userId: string; userData: any }, { rejectWithValue }) => {
    try {
      const response = await authApi.updateProfile(userId, userData)
      return response.data.user
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Update failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('userId')
    },
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { logout, clearError, setUser } = authSlice.actions
export default authSlice.reducer