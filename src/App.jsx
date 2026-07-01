import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { ToastProvider } from './contexts/ToastContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { BottomNav } from './components/common/BottomNav'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { useAuth } from './contexts/AuthContext'
import { useCart } from './contexts/CartContext'
import { ShoppingCart } from 'lucide-react'
import { formatPrice } from './utils/formatters'

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
import { Favorites } from './pages/customer/Favorites'

// Vendor
import { VendorDashboard } from './pages/vendor/Dashboard'
import { VendorProducts } from './pages/vendor/Products'
import { VendorOrders } from './pages/vendor/Orders'
import { VendorEarnings } from './pages/vendor/Earnings'
import { VendorSettings } from './pages/vendor/Settings'
import { VendorOnboarding } from './pages/vendor/Onboarding'

// Driver
import { DriverDashboard } from './pages/driver/Dashboard'
import { ActiveDelivery } from './pages/driver/ActiveDelivery'
import { DriverHistory } from './pages/driver/History'
import { DriverProfile } from './pages/driver/DriverProfile'

// Admin
import { AdminDashboard } from './pages/admin/Dashboard'
import { AdminVendors } from './pages/admin/Vendors'
import { AdminDrivers } from './pages/admin/Drivers'
import { AdminOrders } from './pages/admin/Orders'

// Shared
import { Notifications } from './pages/Notifications'
import { GlobalSearch } from './pages/customer/GlobalSearch'
import { VendorAnalytics } from './pages/vendor/Analytics'
import { PrivacyPolicy } from './pages/PrivacyPolicy'

import './styles/global.css'

const CART_HIDDEN_PATHS = ['/cart', '/checkout']

function MiniCartBar() {
  const { user } = useAuth()
  const { itemCount, subtotal } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  if (!user || user.role !== 'customer') return null
  if (itemCount === 0) return null
  if (CART_HIDDEN_PATHS.some(p => location.pathname.startsWith(p))) return null

  return (
    <div
      onClick={() => navigate('/cart')}
      style={{
        position: 'fixed',
        bottom: 'calc(var(--bottom-nav-h) + var(--safe-bottom) + 10px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: 398,
        background: 'var(--primary)',
        borderRadius: 14,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        zIndex: 45,
        boxShadow: '0 4px 24px rgba(232,93,4,0.45)',
        animation: 'slideUp 0.25s ease',
      }}
    >
      <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: '5px 9px', fontSize: 13, fontWeight: 800, color: 'white' }}>
        {itemCount}
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
        <ShoppingCart size={16} color="white" />
        <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>View Cart</span>
      </div>
      <span style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>{formatPrice(subtotal)}</span>
    </div>
  )
}

function AppLayout({ children, role }) {
  return (
    <ProtectedRoute role={role}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
      <MiniCartBar />
      <BottomNav />
    </ProtectedRoute>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
        <LanguageProvider>
          <FavoritesProvider>
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
                  <Route path="/favorites" element={<AppLayout><Favorites /></AppLayout>} />
                  <Route path="/search" element={<AppLayout><GlobalSearch /></AppLayout>} />

                  {/* Vendor routes */}
                  <Route path="/vendor/onboarding" element={<ProtectedRoute role="vendor"><ErrorBoundary><VendorOnboarding /></ErrorBoundary></ProtectedRoute>} />
                  <Route path="/vendor/dashboard" element={<AppLayout role="vendor"><VendorDashboard /></AppLayout>} />
                  <Route path="/vendor/products" element={<AppLayout role="vendor"><VendorProducts /></AppLayout>} />
                  <Route path="/vendor/orders" element={<AppLayout role="vendor"><VendorOrders /></AppLayout>} />
                  <Route path="/vendor/earnings" element={<AppLayout role="vendor"><VendorEarnings /></AppLayout>} />
                  <Route path="/vendor/settings" element={<AppLayout role="vendor"><VendorSettings /></AppLayout>} />
                  <Route path="/vendor/analytics" element={<AppLayout role="vendor"><VendorAnalytics /></AppLayout>} />

                  {/* Driver routes */}
                  <Route path="/driver/dashboard" element={<AppLayout role="driver"><DriverDashboard /></AppLayout>} />
                  <Route path="/driver/active" element={<AppLayout role="driver"><ActiveDelivery /></AppLayout>} />
                  <Route path="/driver/history" element={<AppLayout role="driver"><DriverHistory /></AppLayout>} />
                  <Route path="/driver/profile" element={<AppLayout role="driver"><DriverProfile /></AppLayout>} />

                  {/* Admin routes */}
                  <Route path="/admin" element={<AppLayout role="admin"><AdminDashboard /></AppLayout>} />
                  <Route path="/admin/vendors" element={<AppLayout role="admin"><AdminVendors /></AppLayout>} />
                  <Route path="/admin/drivers" element={<AppLayout role="admin"><AdminDrivers /></AppLayout>} />
                  <Route path="/admin/orders" element={<AppLayout role="admin"><AdminOrders /></AppLayout>} />

                  {/* Public legal */}
                  <Route path="/privacy" element={<PrivacyPolicy />} />

                  {/* Catch-all */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </ToastProvider>
            </CartProvider>
          </FavoritesProvider>
        </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
