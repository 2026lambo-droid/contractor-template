import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { ToastProvider } from './contexts/ToastContext'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { BottomNav } from './components/common/BottomNav'

// Auth
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'

// Customer
import { CustomerHome } from './pages/customer/Home'
import { VendorList } from './pages/customer/VendorList'
import { VendorDetail } from './pages/customer/VendorDetail'
import { Cart } from './pages/customer/Cart'
import { Checkout } from './pages/customer/Checkout'
import { OrderTracking } from './pages/customer/OrderTracking'
import { OrderHistory } from './pages/customer/OrderHistory'
import { Profile } from './pages/customer/Profile'

// Vendor
import { VendorDashboard } from './pages/vendor/Dashboard'
import { VendorProducts } from './pages/vendor/Products'
import { VendorOrders } from './pages/vendor/Orders'
import { VendorEarnings } from './pages/vendor/Earnings'
import { VendorSettings } from './pages/vendor/Settings'

// Driver
import { DriverDashboard } from './pages/driver/Dashboard'
import { ActiveDelivery } from './pages/driver/ActiveDelivery'
import { DriverHistory } from './pages/driver/History'
import { DriverProfile } from './pages/driver/DriverProfile'

// Shared
import { Notifications } from './pages/Notifications'

import './styles/global.css'

function AppLayout({ children, role }) {
  return (
    <ProtectedRoute role={role}>
      {children}
      <BottomNav />
    </ProtectedRoute>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Shared */}
              <Route path="/notifications" element={<AppLayout><Notifications /></AppLayout>} />

              {/* Customer routes */}
              <Route path="/home" element={<AppLayout><CustomerHome /></AppLayout>} />
              <Route path="/vendors" element={<AppLayout><VendorList /></AppLayout>} />
              <Route path="/vendors/:id" element={<AppLayout><VendorDetail /></AppLayout>} />
              <Route path="/cart" element={<AppLayout><Cart /></AppLayout>} />
              <Route path="/checkout" element={<AppLayout><Checkout /></AppLayout>} />
              <Route path="/orders" element={<AppLayout><OrderHistory /></AppLayout>} />
              <Route path="/orders/:id" element={<AppLayout><OrderTracking /></AppLayout>} />
              <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />

              {/* Vendor routes */}
              <Route path="/vendor/dashboard" element={<AppLayout role="vendor"><VendorDashboard /></AppLayout>} />
              <Route path="/vendor/products" element={<AppLayout role="vendor"><VendorProducts /></AppLayout>} />
              <Route path="/vendor/orders" element={<AppLayout role="vendor"><VendorOrders /></AppLayout>} />
              <Route path="/vendor/earnings" element={<AppLayout role="vendor"><VendorEarnings /></AppLayout>} />
              <Route path="/vendor/settings" element={<AppLayout role="vendor"><VendorSettings /></AppLayout>} />

              {/* Driver routes */}
              <Route path="/driver/dashboard" element={<AppLayout role="driver"><DriverDashboard /></AppLayout>} />
              <Route path="/driver/active" element={<AppLayout role="driver"><ActiveDelivery /></AppLayout>} />
              <Route path="/driver/history" element={<AppLayout role="driver"><DriverHistory /></AppLayout>} />
              <Route path="/driver/profile" element={<AppLayout role="driver"><DriverProfile /></AppLayout>} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
