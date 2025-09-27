import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'
import Layout from './components/Layout'
import Login from './pages/Login'
import DashboardHome from './pages/DashboardHome'
import Subscribers from './pages/Subscribers'
import Menus from './pages/Menus'
import Deliveries from './pages/Deliveries'
import Staff from './pages/Staff'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

function App() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/subscribers" element={<Subscribers />} />
        <Route path="/menus" element={<Menus />} />
        <Route path="/deliveries" element={<Deliveries />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App
