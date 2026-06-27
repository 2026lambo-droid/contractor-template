import { TrendingUp, DollarSign, Package, Star } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { StatsCard } from '../../components/vendor/StatsCard'
import { formatPrice } from '../../utils/formatters'

const WEEKLY_DATA = [
  { day: 'Mon', revenue: 124.50, orders: 3 },
  { day: 'Tue', revenue: 89.20, orders: 2 },
  { day: 'Wed', revenue: 218.75, orders: 5 },
  { day: 'Thu', revenue: 156.40, orders: 4 },
  { day: 'Fri', revenue: 342.90, orders: 8 },
  { day: 'Sat', revenue: 478.25, orders: 11 },
  { day: 'Sun', revenue: 295.60, orders: 7 },
]

const maxRevenue = Math.max(...WEEKLY_DATA.map(d => d.revenue))

const RECENT_PAYOUTS = [
  { id: 'pay-1', period: 'Jun 16 – Jun 22', amount: 1328.45, status: 'paid', date: 'Jun 25' },
  { id: 'pay-2', period: 'Jun 9 – Jun 15', amount: 987.30, status: 'paid', date: 'Jun 18' },
  { id: 'pay-3', period: 'Jun 2 – Jun 8', amount: 1102.75, status: 'paid', date: 'Jun 11' },
]

export function VendorEarnings() {
  const todayRevenue = WEEKLY_DATA[6].revenue
  const weekRevenue = WEEKLY_DATA.reduce((s, d) => s + d.revenue, 0)
  const weekOrders = WEEKLY_DATA.reduce((s, d) => s + d.orders, 0)

  return (
    <div className="page animate-fadeIn">
      <AppHeader title="Earnings" />

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, padding: '16px 16px 12px' }}>
        <StatsCard label="Today" value={formatPrice(todayRevenue)} icon={DollarSign} color="var(--success)" />
        <StatsCard label="This Week" value={formatPrice(weekRevenue)} icon={TrendingUp} color="var(--primary)" />
      </div>
      <div style={{ display: 'flex', gap: 10, padding: '0 16px 16px' }}>
        <StatsCard label="Orders" value={weekOrders} icon={Package} color="var(--primary-light)" sub="this week" />
        <StatsCard label="Avg Rating" value="4.9 ⭐" icon={Star} color="var(--warning)" sub="from 342 reviews" />
      </div>

      {/* Weekly chart */}
      <div style={{ margin: '0 16px 16px', padding: '16px', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>This Week</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100 }}>
          {WEEKLY_DATA.map((d, i) => (
            <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: '100%', position: 'relative' }}>
                <div style={{
                  height: Math.round((d.revenue / maxRevenue) * 80),
                  background: i === 6 ? 'var(--primary)' : 'var(--bg-surface)',
                  border: `1px solid ${i === 6 ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 4,
                  transition: 'height 0.3s ease',
                }} />
              </div>
              <span style={{ fontSize: 10, color: i === 6 ? 'var(--primary-light)' : 'var(--text-muted)', fontWeight: i === 6 ? 700 : 400 }}>{d.day}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
          Total: <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{formatPrice(weekRevenue)}</span> · {weekOrders} orders
        </div>
      </div>

      {/* Payouts */}
      <div className="section-header">
        <span className="section-title">Recent Payouts</span>
      </div>
      <div style={{ padding: '0 16px' }}>
        <div style={{ margin: '0 0 12px', padding: '14px', background: 'rgba(34,197,94,0.08)', borderRadius: 'var(--radius)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600, marginBottom: 4 }}>Next Payout</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{formatPrice(1705.60)}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Scheduled for Jul 2, 2026 · Direct deposit</div>
        </div>

        {RECENT_PAYOUTS.map(p => (
          <div key={p.id} className="card" style={{ marginBottom: 8, padding: '14px' }}>
            <div className="row-between">
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>{p.period}</div>
                <div style={{ fontSize: 17, fontWeight: 700 }}>{formatPrice(p.amount)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="chip chip-success" style={{ fontSize: 11 }}>✓ {p.status}</span>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{p.date}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
