import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, Truck, Package, DollarSign, TrendingUp, ChevronRight, ShieldCheck, Users, AlertTriangle } from 'lucide-react'
import { AppHeader, IconBtn } from '../../components/common/AppHeader'
import { Bell } from 'lucide-react'
import { MOCK_VENDORS, MOCK_ORDERS } from '../../utils/mockData'
import { formatPrice } from '../../utils/formatters'

const GMV_DATA = [
  { day: 'Mon', gmv: 1420, orders: 34 },
  { day: 'Tue', gmv: 1890, orders: 46 },
  { day: 'Wed', gmv: 1650, orders: 39 },
  { day: 'Thu', gmv: 2310, orders: 58 },
  { day: 'Fri', gmv: 3180, orders: 78 },
  { day: 'Sat', gmv: 4220, orders: 104 },
  { day: 'Sun', gmv: 2180, orders: 53 },
]

const gmvTotal = GMV_DATA.reduce((s, d) => s + d.gmv, 0)
const gmvMax = Math.max(...GMV_DATA.map(d => d.gmv))
const ordersTotal = GMV_DATA.reduce((s, d) => s + d.orders, 0)
const platformFee = gmvTotal * 0.05

const STATS = [
  { label: 'Vendors', value: MOCK_VENDORS.length, icon: Store, color: 'var(--primary)', sub: '+2 pending' },
  { label: 'Active Drivers', value: 6, icon: Truck, color: 'var(--success)', sub: '2 delivering' },
  { label: 'Orders (7d)', value: ordersTotal, icon: Package, color: 'var(--warning)', sub: `${GMV_DATA[6].orders} today` },
  { label: 'Platform Fee (7d)', value: formatPrice(platformFee), icon: DollarSign, color: '#A78BFA', sub: '5% of GMV' },
]

const HEALTH = [
  { label: 'Avg. Delivery Time', value: '28 min', ok: true },
  { label: 'Order Completion Rate', value: '96.4%', ok: true },
  { label: 'Driver Utilization', value: '82%', ok: true },
  { label: 'Refund Rate', value: '1.8%', ok: true },
  { label: 'Stripe Disputes', value: '2 open', ok: false },
  { label: 'Late Deliveries (7d)', value: '7 (1.9%)', ok: true },
]

const recentActivity = [
  { icon: '🏪', text: 'El Toro Meat Market completed Stripe onboarding', time: '2m ago', type: 'success' },
  { icon: '🚗', text: 'New driver Carlos M. signed up in San Jose', time: '14m ago', type: 'info' },
  { icon: '⚠️', text: 'Order #A3F8 reported late delivery', time: '28m ago', type: 'warn' },
  { icon: '💰', text: 'Payout processed: $1,240 to 4 vendors', time: '1h ago', type: 'success' },
  { icon: '🏪', text: 'New vendor "La Michoacana SD" applied', time: '3h ago', type: 'info' },
  { icon: '⭐', text: 'La Carnicería El Rancho received 5-star review', time: '4h ago', type: 'success' },
]

export function AdminDashboard() {
  const navigate = useNavigate()
  const [chartHover, setChartHover] = useState(null)

  return (
    <div className="page animate-fadeIn">
      <AppHeader
        title="Admin"
        actions={<IconBtn icon={Bell} onClick={() => navigate('/notifications')} badge={3} />}
      />

      {/* Admin badge */}
      <div style={{ margin: '0 16px 16px', padding: '12px 16px', background: 'rgba(232,93,4,0.08)', border: '1px solid rgba(232,93,4,0.2)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <ShieldCheck size={18} color="var(--primary)" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-light)' }}>Platform Admin</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Full access · El Rincón Operations</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>GMV (7d)</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--success)' }}>{formatPrice(gmvTotal)}</div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 16px 16px' }}>
        {STATS.map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</span>
              <s.icon size={15} color={s.color} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            {s.sub && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* GMV chart */}
      <div style={{ margin: '0 16px 16px', padding: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>GMV — Last 7 Days</span>
          <TrendingUp size={16} color="var(--success)" />
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
          {ordersTotal} orders · {formatPrice(platformFee)} platform revenue
        </div>

        {/* Hover tooltip */}
        {chartHover !== null && (
          <div style={{ marginBottom: 8, padding: '6px 10px', background: 'var(--bg-surface)', borderRadius: 6, display: 'inline-flex', gap: 12, fontSize: 12 }}>
            <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{GMV_DATA[chartHover].day}</span>
            <span style={{ color: 'var(--success)' }}>{formatPrice(GMV_DATA[chartHover].gmv)}</span>
            <span style={{ color: 'var(--text-muted)' }}>{GMV_DATA[chartHover].orders} orders</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 80 }}>
          {GMV_DATA.map((d, i) => (
            <div
              key={d.day}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}
              onMouseEnter={() => setChartHover(i)}
              onMouseLeave={() => setChartHover(null)}
            >
              <div style={{
                width: '100%',
                height: Math.max(4, Math.round((d.gmv / gmvMax) * 64)),
                background: chartHover === i ? 'var(--primary)' : i === 5 ? 'rgba(232,93,4,0.7)' : 'rgba(232,93,4,0.3)',
                border: `1px solid ${chartHover === i ? 'var(--primary)' : 'rgba(232,93,4,0.2)'}`,
                borderRadius: '3px 3px 0 0',
                transition: 'all 0.15s',
              }} />
              <span style={{ fontSize: 9, color: i === 5 ? 'var(--primary-light)' : 'var(--text-muted)', fontWeight: i === 5 ? 700 : 400 }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Platform health */}
      <div style={{ margin: '0 16px 16px', padding: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Users size={15} color="var(--primary)" />
          <span style={{ fontSize: 14, fontWeight: 700 }}>Platform Health</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {HEALTH.map(h => (
            <div key={h.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>{h.ok ? '✅' : '⚠️'}</span>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{h.label}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: h.ok ? 'var(--text)' : 'var(--warning)' }}>{h.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div style={{ padding: '0 16px 8px' }}>
        <p className="section-title" style={{ marginBottom: 10 }}>Manage</p>
        <div className="card">
          {[
            { icon: Store, label: 'Vendors', sub: `${MOCK_VENDORS.length} active · 2 pending`, path: '/admin/vendors', badge: 2 },
            { icon: Truck, label: 'Drivers', sub: '6 online now', path: '/admin/drivers' },
            { icon: Package, label: 'Orders', sub: `${GMV_DATA[6].orders} today · ${formatPrice(gmvTotal)} GMV`, path: '/admin/orders' },
          ].map(item => (
            <div key={item.path} className="list-item" onClick={() => navigate(item.path)} style={{ cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(232,93,4,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <item.icon size={18} color="var(--primary)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.sub}</div>
              </div>
              {item.badge && <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--primary)', color: 'white', borderRadius: 10, padding: '2px 7px' }}>{item.badge}</span>}
              <ChevronRight size={16} color="var(--text-muted)" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div style={{ padding: '8px 16px 0' }}>
        <p className="section-title" style={{ marginBottom: 10 }}>Recent Activity</p>
        <div className="card">
          {recentActivity.map((a, i) => (
            <div key={i} className="list-item" style={{ alignItems: 'flex-start', borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border)' : 'none' }}>
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
