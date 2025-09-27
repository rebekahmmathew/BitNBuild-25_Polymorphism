import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import type { AppDispatch } from '../store/store'
import { loginUser, registerUser } from '../store/slices/authSlice'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()

  const VENDOR_PORTAL = (import.meta as any).env?.VITE_VENDOR_PORTAL_URL || '/dashboard'

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
        await (dispatch(registerUser(userData)) as any).unwrap()
        toast.success('Demo login successful!')
      } catch (error) {
        // If registration fails, try to login with existing user
        const existingUser = {
          id: 'demo-user-id',
          email: userData.email,
          name: userData.name,
          role: 'vendor' as const,
          phone: userData.phone,
          address: userData.address,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        dispatch(loginUser(existingUser) as any)
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
        <div className="text-center">
          <img src="/logo192.png" alt="NourishNet" className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary-900">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-secondary-600">
            Sign in to manage your tiffin service or open the vendor portal
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              // Basic email/password demo flow: if fields empty, fallback to demo login
              if (!email || !password) return handleDemoLogin()

              // Otherwise create a simple user and login locally
              const user = {
                id: `vendor-${Date.now()}`,
                email,
                name: 'Vendor',
                role: 'vendor' as const,
                phone: '',
                address: {
                  street: '',
                  city: '',
                  state: '',
                  pincode: '',
                },
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
              dispatch(loginUser(user) as any)
              toast.success('Signed in')
            }}
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-secondary-200 placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-secondary-200 placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Password (or leave blank for demo)"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember" name="remember" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded" />
                  <label htmlFor="remember" className="ml-2 block text-sm text-secondary-600">Remember me</label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">Forgot password?</a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-secondary-500">
                  Or
                </p>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="mt-3 w-full inline-flex justify-center py-2 px-4 border border-secondary-200 rounded-md bg-white text-sm text-secondary-700 hover:bg-secondary-50"
                >
                  Demo Login (Vendor)
                </button>
              </div>

              <div className="mt-4 text-center">
                <a
                  href={VENDOR_PORTAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-x-2 text-sm text-primary-600 hover:underline"
                >
                  Open Vendor Portal
                </a>
              </div>
            </div>
          </form>
        </div>

        <p className="mt-2 text-center text-xs text-secondary-500">This is a simplified MVP version for demonstration purposes</p>
      </div>
    </div>
  )
}

export default Login