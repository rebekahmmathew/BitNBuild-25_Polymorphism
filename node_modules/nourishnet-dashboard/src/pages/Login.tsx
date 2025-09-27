import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { loginUser, registerUser } from '../store/slices/authSlice'
import toast from 'react-hot-toast'

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/dashboard'
    }
  }, [isAuthenticated])

  const handleDemoLogin = async () => {
    try {
      setIsLoading(true)
      
      // Create a demo user
      const userData = {
        email: 'demo@nourishnet.com',
        name: 'Demo Vendor',
        role: 'vendor',
        phone: '+91 98765 43210',
        address: {
          street: '123 Demo Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          coordinates: {
            lat: 19.0760,
            lng: 72.8777
          }
        }
      }
      
      // Try to register/login
      try {
        await dispatch(registerUser(userData)).unwrap()
        toast.success('Demo login successful!')
      } catch (error) {
        // If registration fails, try to login with existing user
        const existingUser = { id: 'demo-user-id', ...userData }
        dispatch(loginUser(existingUser))
        toast.success('Demo login successful!')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary-900">
            NourishNet Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-secondary-600">
            Sign in to manage your tiffin service
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                'Demo Login (Vendor)'
              )}
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-secondary-500">
              This is a simplified MVP version for demonstration purposes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login