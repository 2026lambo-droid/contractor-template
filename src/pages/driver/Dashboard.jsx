import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, DollarSign, Truck, Navigation, ChevronRight } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { StatsCard } from '../../components/vendor/StatsCard'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { MOCK_DRIVER_DELIVERIES } from '../../utils/mockData'
import { formatPrice } from '../../utils/formatters'

const WEEK_CHART = [
  { day: 'Mon', earned: 31.60 },
  { day: 'Tue', earned: 58.40 },
  { day: 'Wed', earned: 39.75 },
  { day: 'Thu', earned: 63.20 },
  { day: 'Fri', earned: 47.50 },
  { day: 'Sat', earned: 72.40 },
  { day: 'Sun', earned: 0 },
]
const weekMax = Math.max(...WEEK_CHART.map(d => d.earned))

export function DriverDashboard() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [isOnline, setIsOnline] = useState(user?.isOnline ?? true)
  const [availableOrders, setAvailableOrders] = useState([
    {
      id: 'del-new-1',
      orderId: 'ord-005',
      vendorName: 'La Carnicería El Rancho',
      vendorAddress: '1420 Story Rd, San Jose, CA',
      customerAddress: '800 N 1st St, San Jose, CA',
      items: '4 lbs Carne Asada + 2 lbs Chorizo',
      earning: 9.50,
      distance: '3.2 mi',
      estimatedTime: '22 min',
      status: 'available',
    },
    {
      id: 'del-new-2',
      orderId: 'ord-006',
      vendorName: 'Carnitas La Familia',
      vendorAddress: '2890 Fruitvale Ave, Oakland, CA',
      customerAddress: '1600 E 14th St, San Leandro, CA',
      items: '5 lbs Carnitas',
      earning: 11.00,
      distance: '5.1 mi',
      estimatedTime: '28 min',
      status: 'available',
    },
  ])

  const toggleOnline = () => {
    const next = !isOnline
    setIsOnline(next)
    updateUser({ isOnline: next })
    toast(next ? '🟢 You are now online and receiving orders' : '🔴 You are now offline', next ? 'success' : 'info')
  }

  const acceptDelivery = (delivery) => {
    setAvailableOrders(prev => prev.filter(d => d.id !== delivery.id))
    toast('Delivery accepted! Navigate to vendor for pickup.', 'success')
    navigate('/driver/active', { state: { delivery } })
  }

  return (
    <div className="page animate-fadeIn">
      <AppHeader title="Driver Portal" />

      {/* Online toggle */}
      <div style={{ margin: '12px 16px', padding: '16px', background: isOnline ? 'rgba(34,197,94,0.08)' : 'var(--bg-card)', borderRadius: 'var(--radius)', border: `1px solid ${isOnline ? 'rgba(34,197,94,0.25)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{user?.name}</div>
          <div className={`online-indicator ${isOnline ? 'online' : 'offline'}`} style={{ display: 'inline-flex' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: isOnline ? 'var(--success)' : 'var(--text-muted)' }} />
            {isOnline ? 'Online · Accepting Orders' : 'Offline'}
          </div>
        </div>
        <button onClick={toggleOnline} style={{
          padding: '10px 20px', borderRadius: 'var(--radius)', fontWeight: 700, fontSize: 14,
          background: isOnline ? 'var(--error-bg)' : 'var(--success)', color: isOnline ? 'var(--error)' : 'white',
          border: `1px solid ${isOnline ? 'rgba(239,68,68,0.3)' : 'transparent'}`,
          cursor: 'pointer',
        }}>
          {isOnline ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      {/* Today's stats */}
      <div style={{ display: 'flex', gap: 10, padding: '0 16px 16px' }}>
        <StatsCard label="Today's Earnings" value={formatPrice(47.50)} icon={DollarSign} color="var(--success)" sub="6 deliveries" />
        <StatsCard label="Online Hours" value="4.5h" icon={Clock} color="var(--primary)" />
      </div>
      <div style={{ display: 'flex', gap: 10, padding: '0 16px 20px' }}>
        <StatsCard label="Miles Driven" value="38.2" icon={Navigation} color="var(--primary-light)" sub="today" />
        <StatsCard label="Rating" value="4.97 ⭐" icon={Truck} color="var(--warning)" />
      </div>

      {/* Weekly earnings chart */}
      <div style={{ margin: '0 16px 20px', padding: '14px 14px 10px', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <div className="row-between" style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>This Week</span>
          <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 700 }}>{formatPrice(WEEK_CHART.reduce((s, d) => s + d.earned, 0))}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 56 }}>
          {WEEK_CHART.map((d, i) => (
            <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: '100%',
                height: d.earned ? Math.max(4, Math.round((d.earned / weekMax) * 44)) : 4,
                background: i === 4 ? 'var(--primary)' : d.earned ? 'rgba(232,93,4,0.35)' : 'var(--bg-surface)',
                border: `1px solid ${i === 4 ? 'var(--primary)' : d.earned ? 'rgba(232,93,4,0.2)' : 'var(--border)'}`,
                borderRadius: 3,
              }} />
              <span style={{ fontSize: 9, color: i === 4 ? 'var(--primary-light)' : 'var(--text-muted)', fontWeight: i === 4 ? 700 : 400 }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle info */}
      <div style={{ margin: '0 16px 20px', padding: '12px 14px', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <div className="row gap-12">
          <span style={{ fontSize: 28 }}>🚗</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{user?.vehicle || 'Toyota Corolla — Silver'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>License: {user?.licensePlate || '7ABC123'}</div>
          </div>
        </div>
      </div>

      {/* Available deliveries */}
      {isOnline && (
        <>
          <div className="section-header">
            <span className="section-title">🔔 Available Orders</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{availableOrders.length} nearby</span>
          </div>
          <div style={{ padding: '0 16px' }}>
            {availableOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 14 }}>
                Waiting for orders nearby...<br />
                <span style={{ fontSize: 24, display: 'block', marginTop: 12 }}>⏳</span>
              </div>
            ) : availableOrders.map(delivery => (
              <div key={delivery.id} className="card" style={{ marginBottom: 12 }}>
                <div style={{ padding: 14 }}>
                  <div className="row-between" style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{delivery.vendorName}</div>
                    <div className="price" style={{ fontSize: 18 }}>{formatPrice(delivery.earning)}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                    <div className="row gap-6 text-sm text-muted">
                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>📍 Pickup:</span>
                      {delivery.vendorAddress}
                    </div>
                    <div className="row gap-6 text-sm text-muted">
                      <span style={{ color: 'var(--success)', fontWeight: 600 }}>🏠 Drop:</span>
                      {delivery.customerAddress}
                    </div>
                    <div className="row gap-6 text-sm text-muted">
                      <span>📦 {delivery.items}</span>
                    </div>
                  </div>
                  <div className="row-between">
                    <div className="row gap-12">
                      <span className="chip chip-muted" style={{ fontSize: 11 }}>📏 {delivery.distance}</span>
                      <span className="chip chip-muted" style={{ fontSize: 11 }}>⏱ {delivery.estimatedTime}</span>
                    </div>
                    <button className="btn btn-success btn-sm" onClick={() => acceptDelivery(delivery)} style={{ fontSize: 13 }}>
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!isOnline && (
        <div className="empty-state">
          <div className="empty-icon">😴</div>
          <div className="empty-title">You're offline</div>
          <div className="empty-desc">Go online to start receiving delivery orders in your area</div>
          <button className="btn btn-success mt-16" onClick={toggleOnline}>Go Online</button>
        </div>
      )}
    </div>
  )
}
