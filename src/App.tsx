import React, { useState, useEffect } from 'react';
import { supabase } from './utils/supabase/client';
import { Toaster } from 'sonner@2.0.3';
import VendorLogin from './components/VendorLogin';
import VendorDashboard from './components/VendorDashboard';
import DeliveryStaffLogin from './components/DeliveryStaffLogin';
import DeliveryStaffApp from './components/DeliveryStaffApp';

export default function App() {
  const [currentView, setCurrentView] = useState('vendor-login');
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Check user role from metadata
        const role = session.user.user_metadata?.role || 'vendor';
        setUserRole(role);
        if (role === 'vendor') {
          setCurrentView('vendor-dashboard');
        } else if (role === 'delivery_staff') {
          setCurrentView('delivery-app');
        }
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        const role = session.user.user_metadata?.role || 'vendor';
        setUserRole(role);
        if (role === 'vendor') {
          setCurrentView('vendor-dashboard');
        } else if (role === 'delivery_staff') {
          setCurrentView('delivery-app');
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserRole(null);
        setCurrentView('vendor-login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'vendor-login':
        return <VendorLogin onViewChange={setCurrentView} />;
      case 'delivery-login':
        return <DeliveryStaffLogin onViewChange={setCurrentView} />;
      case 'vendor-dashboard':
        return <VendorDashboard user={user} onLogout={handleLogout} />;
      case 'delivery-app':
        return <DeliveryStaffApp user={user} onLogout={handleLogout} />;
      default:
        return <VendorLogin onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentView()}
      <Toaster position="top-right" />
    </div>
  );
}