import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Search, ShoppingCart, Clock, User, LayoutDashboard, Package, TrendingUp, Settings, Truck, Map, History } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { USER_ROLES } from '../../utils/constants'

const CUSTOMER_TABS = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/vendors', icon: Search, label: 'Browse' },
  { path: '/cart', icon: ShoppingCart, label: 'Cart', badge: true },
  { path: '/orders', icon: Clock, label: 'Orders' },
  { path: '/profile', icon: User, label: 'Profile' },
]

const VENDOR_TABS = [
  { path: '/vendor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/vendor/orders', icon: Package, label: 'Orders' },
  { path: '/vendor/products', icon: Search, label: 'Products' },
  { path: '/vendor/earnings', icon: TrendingUp, label: 'Earnings' },
  { path: '/vendor/settings', icon: Settings, label: 'Settings' },
]

const DRIVER_TABS = [
  { path: '/driver/dashboard', icon: Truck, label: 'Deliveries' },
  { path: '/driver/active', icon: Map, label: 'Active' },
  { path: '/driver/history', icon: History, label: 'History' },
  { path: '/driver/profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
  const { user } = useAuth()
  const { itemCount } = useCart()
  const location = useLocation()
  const navigate = useNavigate()

  if (!user) return null

  const tabs = user.role === USER_ROLES.VENDOR ? VENDOR_TABS
    : user.role === USER_ROLES.DRIVER ? DRIVER_TABS
    : CUSTOMER_TABS

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: 'rgba(15,10,8,0.97)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      height: 'calc(var(--bottom-nav-h) + var(--safe-bottom))',
      paddingBottom: 'var(--safe-bottom)',
      zIndex: 50,
    }}>
      {tabs.map(tab => {
        const active = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path))
        const count = tab.badge ? itemCount : 0
        return (
          <button key={tab.path} onClick={() => navigate(tab.path)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 4, background: 'none', border: 'none',
            color: active ? 'var(--primary)' : 'var(--text-muted)',
            fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
            cursor: 'pointer', transition: 'color 0.15s', position: 'relative',
            paddingTop: 8, WebkitTapHighlightColor: 'transparent',
          }}>
            <div style={{ position: 'relative' }}>
              <tab.icon size={tabs.length === 5 ? 20 : 22} strokeWidth={active ? 2.5 : 1.8} />
              {count > 0 && <span className="badge" style={{ position: 'absolute', top: -6, right: -8, fontSize: 9 }}>{count}</span>}
            </div>
            <span style={{ fontSize: tabs.length === 5 ? 9 : 10 }}>{tab.label}</span>
            {active && (
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: 24, height: 2, background: 'var(--primary)', borderRadius: '0 0 2px 2px',
              }} />
            )}
          </button>
        )
      })}
    </nav>
  )
}
