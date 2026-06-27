import { useNavigate } from 'react-router-dom'
import { Store, Truck, Package, DollarSign, TrendingUp, Users, ChevronRight, ShieldCheck } from 'lucide-react'
import { AppHeader, IconBtn } from '../../components/common/AppHeader'
import { Bell } from 'lucide-react'
import { MOCK_VENDORS, MOCK_ORDERS } from '../../utils/mockData'
import { formatPrice } from '../../utils/formatters'

const allOrders = JSON.parse(localStorage.getItem('carnemx_orders') || '[]').concat(MOCK_ORDERS)

const stats = [
  { label: 'Total Vendors', value: MOCK_VENDORS.length, icon: Store, color: 'var(--primary)' },
  { label: 'Active Drivers', value: 6, icon: Truck, color: 'var(--success)' },
  { label: 'Orders Today', value: 47, icon: Package, color: 'var(--warning)' },
  { label: 'GMV (7d)', value: '$12,840', icon: DollarSign, color: '#A78BFA' },
]

const recentActivity = [
  { icon: '🏪', text: 'El Toro Meat Market completed Stripe onboarding', time: '2m ago' },
  { icon: '🚗', text: 'New driver Carlos signed up in San Jose', time: '14m ago' },
  { icon: '⚠️', text: 'Order #A3F8 reported late delivery', time: '28m ago' },
  { icon: '💰', text: 'Payout processed: $1,240 to 4 vendors', time: '1h ago' },
  { icon: '🏪', text: 'New vendor "La Michoacana SD" applied', time: '3h ago' },
]

export function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <div className="page animate-fadeIn">
      <AppHeader
        title="Admin"
        actions={<IconBtn icon={Bell} onClick={() => navigate('/notifications')} badge={3} />}
      />

      {/* Admin badge */}
      <div style={{ margin: '0 16px 20px', padding: '12px 16px', background: 'rgba(232,93,4,0.08)', border: '1px solid rgba(232,93,4,0.2)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <ShieldCheck size={18} color="var(--primary)" />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-light)' }}>Platform Admin</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Full access · CarneMX Operations</div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 16px 20px' }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</span>
              <s.icon size={16} color={s.color} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Revenue chart placeholder */}
      <div style={{ margin: '0 16px 20px', padding: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Revenue (7 days)</span>
          <TrendingUp size={16} color="var(--success)" />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
          {[42, 67, 55, 80, 72, 95, 88].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 6 ? 'var(--primary)' : 'rgba(232,93,4,0.3)', borderRadius: '3px 3px 0 0', transition: 'height 0.3s' }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <span key={i} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'var(--text-muted)' }}>{d}</span>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div style={{ padding: '0 16px 8px' }}>
        <p className="section-title" style={{ marginBottom: 10 }}>Manage</p>
        <div className="card">
          {[
            { icon: Store, label: 'Vendors', sub: `${MOCK_VENDORS.length} active`, path: '/admin/vendors' },
            { icon: Truck, label: 'Drivers', sub: '6 online now', path: '/admin/drivers' },
            { icon: Package, label: 'Orders', sub: '47 today', path: '/admin/orders' },
          ].map(item => (
            <div key={item.path} className="list-item" onClick={() => navigate(item.path)} style={{ cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(232,93,4,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <item.icon size={18} color="var(--primary)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.sub}</div>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div style={{ padding: '16px 16px 0' }}>
        <p className="section-title" style={{ marginBottom: 10 }}>Recent Activity</p>
        <div className="card">
          {recentActivity.map((a, i) => (
            <div key={i} className="list-item" style={{ alignItems: 'flex-start' }}>
              <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{a.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, lineHeight: 1.4 }}>{a.text}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
