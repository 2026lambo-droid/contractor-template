import { useState } from 'react'
import { Bell, Package, Truck, Star, DollarSign, X } from 'lucide-react'
import { AppHeader } from '../components/common/AppHeader'
import { useAuth } from '../contexts/AuthContext'
import { formatRelativeTime } from '../utils/formatters'

const ICON_MAP = { order: Package, delivery: Truck, review: Star, payout: DollarSign }

const MOCK_NOTIFICATIONS = {
  customer: [
    { id: 'n1', type: 'delivery', title: 'Your order is on the way!', body: 'Carlos M. picked up your order and is heading to you. Est. 10 min.', time: new Date(Date.now() - 12 * 60000), read: false },
    { id: 'n2', type: 'order', title: 'Order Confirmed', body: 'La Carnicería El Rancho confirmed your order #A001. Est. prep time: 20 min.', time: new Date(Date.now() - 25 * 60000), read: false },
    { id: 'n3', type: 'delivery', title: 'Order Delivered! 🎉', body: 'Your carne asada has been delivered. Enjoy the carne!', time: new Date(Date.now() - 2 * 24 * 3600000), read: true },
    { id: 'n4', type: 'review', title: 'How was your order?', body: 'Rate your experience with La Carnicería El Rancho.', time: new Date(Date.now() - 2 * 24 * 3600000), read: true },
  ],
  vendor: [
    { id: 'n1', type: 'order', title: '🔔 New Order — $55.35', body: 'Maria G. ordered 3 lbs Carne Asada + 1 lb Chorizo. Confirm now!', time: new Date(Date.now() - 3 * 60000), read: false },
    { id: 'n2', type: 'order', title: '🔔 New Order — $46.95', body: 'José R. ordered 4 lbs Short Ribs. Confirm now!', time: new Date(Date.now() - 8 * 60000), read: false },
    { id: 'n3', type: 'delivery', title: 'Driver Arrived', body: 'Carlos M. is at your store for pickup on order #A001.', time: new Date(Date.now() - 35 * 60000), read: true },
    { id: 'n4', type: 'payout', title: 'Payout Sent 💰', body: '$1,328.45 has been deposited to your bank account.', time: new Date(Date.now() - 2 * 24 * 3600000), read: true },
    { id: 'n5', type: 'review', title: 'New 5-Star Review ⭐', body: 'Maria G.: "Best carne asada in San Jose! Will definitely order again."', time: new Date(Date.now() - 3 * 24 * 3600000), read: true },
  ],
  driver: [
    { id: 'n1', type: 'delivery', title: '📦 New Delivery Available', body: '$9.50 · La Carnicería El Rancho → 500 El Camino Real, San Jose', time: new Date(Date.now() - 2 * 60000), read: false },
    { id: 'n2', type: 'delivery', title: '📦 New Delivery Available', body: '$11.00 · Carnitas La Familia → 1600 E 14th St, San Leandro', time: new Date(Date.now() - 6 * 60000), read: false },
    { id: 'n3', type: 'payout', title: 'Weekly Payout Sent 💰', body: '$284.75 has been sent to your Chase account. Available instantly.', time: new Date(Date.now() - 24 * 3600000), read: true },
    { id: 'n4', type: 'review', title: '5-Star Rating ⭐', body: 'Maria G. rated your delivery 5 stars! Keep it up!', time: new Date(Date.now() - 2 * 24 * 3600000), read: true },
  ],
}

const TYPE_COLOR = {
  order: 'var(--primary)',
  delivery: 'var(--success)',
  review: 'var(--warning)',
  payout: '#A855F7',
}

export function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS[user?.role] || [])
  const unread = notifications.filter(n => !n.read).length

  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const dismiss = (id) => setNotifications(prev => prev.filter(n => n.id !== id))
  const markAll = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  return (
    <div className="page animate-fadeIn">
      <AppHeader title="Notifications" back actions={
        unread > 0 && (
          <button className="btn btn-ghost btn-sm text-muted" onClick={markAll} style={{ fontSize: 12 }}>Mark all read</button>
        )
      } />

      {notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Bell size={56} color="var(--text-muted)" /></div>
          <div className="empty-title">All caught up!</div>
          <div className="empty-desc">No new notifications</div>
        </div>
      ) : (
        <div style={{ padding: '8px 0' }}>
          {notifications.map(n => {
            const Icon = ICON_MAP[n.type] || Bell
            const color = TYPE_COLOR[n.type] || 'var(--primary)'
            return (
              <div key={n.id} onClick={() => markRead(n.id)} style={{
                display: 'flex', gap: 12, padding: '14px 16px',
                borderBottom: '1px solid var(--border)',
                background: n.read ? 'transparent' : 'rgba(232,93,4,0.04)',
                cursor: 'pointer', transition: 'background 0.1s',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: n.read ? 500 : 700, flex: 1 }}>{n.title}</span>
                    {!n.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 4 }}>{n.body}</p>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatRelativeTime(n.time)}</span>
                </div>
                <button onClick={e => { e.stopPropagation(); dismiss(n.id) }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
                  <X size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
