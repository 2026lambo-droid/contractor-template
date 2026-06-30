import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DollarSign, Package, Clock, TrendingUp, Bell, ChevronRight } from 'lucide-react'
import { AppHeader, IconBtn } from '../../components/common/AppHeader'
import { StatsCard } from '../../components/vendor/StatsCard'
import { VendorOrderItem } from '../../components/vendor/OrderItem'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { MOCK_VENDORS, MOCK_ORDERS } from '../../utils/mockData'
import { ORDER_STATUS } from '../../utils/constants'
import { formatPrice, formatRelativeTime } from '../../utils/formatters'
import { getVendorOrders, updateOrderStatus, subscribeToOrders } from '../../services/orderBus'

export function VendorDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const vendor = MOCK_VENDORS.find(v => v.id === user?.vendorId) || MOCK_VENDORS[0]
  const isOnboarded = localStorage.getItem('carnemx_onboarded') || user?.onboarded

  const liveOrders = getVendorOrders(vendor?.id)

  const [orders, setOrders] = useState([...liveOrders,
    {
      id: 'vord-001',
      customerId: 'cust-1',
      customerName: 'Maria García',
      vendorId: vendor?.id,
      items: [
        { name: 'Carne Asada Premium', quantity: 3, pricePerLb: 12.99 },
        { name: 'Chorizo Rojo', quantity: 1, pricePerLb: 8.99 },
      ],
      total: 55.35,
      status: 'pending',
      createdAt: new Date(Date.now() - 5 * 60000),
    },
    {
      id: 'vord-002',
      customerId: 'cust-2',
      customerName: 'José Ramírez',
      vendorId: vendor?.id,
      items: [{ name: 'Short Ribs', quantity: 4, pricePerLb: 10.49 }],
      total: 46.95,
      status: 'preparing',
      createdAt: new Date(Date.now() - 22 * 60000),
    },
    {
      id: 'vord-003',
      customerId: 'cust-3',
      customerName: 'Ana López',
      vendorId: vendor?.id,
      items: [{ name: 'Carnitas', quantity: 5, pricePerLb: 11.99 }],
      total: 62.90,
      status: 'delivered',
      createdAt: new Date(Date.now() - 3 * 3600000),
    },
  ])

  const todayOrders = orders.filter(o => o.status !== 'cancelled')
  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status))
  const todayRevenue = todayOrders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0)
  const pendingCount = orders.filter(o => o.status === 'pending').length

  // Subscribe to new orders placed by customers in real-time
  useEffect(() => {
    const unsub = subscribeToOrders(vendor?.id, (newOrder) => {
      setOrders(prev => {
        if (prev.find(o => o.id === newOrder.id)) return prev
        return [{ ...newOrder, createdAt: new Date(newOrder.createdAt) }, ...prev]
      })
      toast(`New order from ${newOrder.customerName} — $${newOrder.total?.toFixed(2)}! 🔔`, 'success')
    })
    return unsub
  }, [vendor?.id])

  const advanceStatus = (order) => {
    const progression = { pending: 'confirmed', confirmed: 'preparing', preparing: 'ready', ready: 'picked_up' }
    const next = progression[order.status]
    if (next) {
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: next } : o))
      updateOrderStatus(order.id, vendor?.id, next)
    }
  }

  return (
    <div className="page animate-fadeIn">
      <AppHeader actions={<IconBtn icon={Bell} badge={pendingCount} onClick={() => navigate('/notifications')} />} />

      {/* Onboarding banner */}
      {!isOnboarded && (
        <div style={{ margin: '12px 16px 0', padding: '14px', background: 'rgba(232,93,4,0.08)', border: '1.5px solid rgba(232,93,4,0.3)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>🏪</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Complete your store setup</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Add your hours, delivery zones & first product to start receiving orders</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/vendor/onboarding')} style={{ flexShrink: 0, fontSize: 12 }}>
            Setup →
          </button>
        </div>
      )}

      {/* Vendor header */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Good morning,</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 2 }}>{vendor?.name}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 100, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', fontSize: 12, fontWeight: 600, color: 'var(--success)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)' }} />
            Open · Accepting Orders
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, padding: '0 16px 16px' }}>
        <StatsCard label="Today's Revenue" value={formatPrice(todayRevenue)} icon={DollarSign} color="var(--success)" sub="from 1 delivered order" />
        <StatsCard label="Active Orders" value={activeOrders.length} icon={Package} color="var(--primary)" sub={`${pendingCount} pending`} />
      </div>
      <div style={{ display: 'flex', gap: 10, padding: '0 16px 20px' }}>
        <StatsCard label="Avg. Prep Time" value="22 min" icon={Clock} color="var(--warning)" />
        <StatsCard label="This Week" value={formatPrice(438.50)} icon={TrendingUp} color="var(--primary-light)" />
      </div>

      {/* New orders */}
      {pendingCount > 0 && (
        <>
          <div style={{ margin: '0 16px 12px', padding: '12px 14px', background: 'rgba(245,158,11,0.08)', borderRadius: 'var(--radius)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--warning)', marginBottom: 2 }}>
              🔔 {pendingCount} New Order{pendingCount > 1 ? 's' : ''} Waiting!
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Confirm orders quickly to maintain high ratings</div>
          </div>
        </>
      )}

      {/* Active orders */}
      <div className="section-header">
        <span className="section-title">Active Orders</span>
        <button className="btn btn-ghost btn-sm text-muted text-sm" onClick={() => navigate('/vendor/orders')}>See all</button>
      </div>
      <div style={{ padding: '0 16px' }}>
        {activeOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 14 }}>
            No active orders right now. <br />New orders will appear here automatically.
          </div>
        ) : activeOrders.map(o => <VendorOrderItem key={o.id} order={o} onAction={advanceStatus} />)}
      </div>

      {/* Quick actions */}
      <div className="section-header" style={{ marginTop: 20 }}>
        <span className="section-title">Quick Actions</span>
      </div>
      <div style={{ display: 'flex', gap: 10, padding: '0 16px 8px' }}>
        {[
          { label: 'Add Product', emoji: '➕', path: '/vendor/products' },
          { label: 'Earnings', emoji: '💰', path: '/vendor/earnings' },
          { label: 'Analytics', emoji: '📊', path: '/vendor/analytics' },
          { label: 'All Orders', emoji: '📋', path: '/vendor/orders' },
        ].map(a => (
          <button key={a.label} onClick={() => navigate(a.path)} style={{
            flex: 1, padding: '14px 8px', borderRadius: 'var(--radius)',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            textAlign: 'center', cursor: 'pointer',
          }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{a.emoji}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>{a.label}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
