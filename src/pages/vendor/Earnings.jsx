import { useState } from 'react'
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

const MONTHLY_DATA = [
  { day: 'Wk 1', revenue: 892.40, orders: 21 },
  { day: 'Wk 2', revenue: 1104.75, orders: 27 },
  { day: 'Wk 3', revenue: 987.30, orders: 24 },
  { day: 'Wk 4', revenue: 1705.60, orders: 40 },
]

const RECENT_PAYOUTS = [
  { id: 'pay-1', period: 'Jun 16 – Jun 22', gross: 1398.37, fee: 69.92, amount: 1328.45, status: 'paid', date: 'Jun 25' },
  { id: 'pay-2', period: 'Jun 9 – Jun 15', gross: 1039.26, fee: 51.96, amount: 987.30, status: 'paid', date: 'Jun 18' },
  { id: 'pay-3', period: 'Jun 2 – Jun 8', gross: 1160.79, fee: 58.04, amount: 1102.75, status: 'paid', date: 'Jun 11' },
]

const TOP_PRODUCTS = [
  { name: 'Carne Asada Premium', orders: 48, revenue: 748.32, pct: 100 },
  { name: 'Chorizo Rojo', orders: 31, revenue: 434.10, pct: 58 },
  { name: 'Short Ribs', orders: 24, revenue: 374.40, pct: 50 },
  { name: 'Carnitas', orders: 18, revenue: 287.82, pct: 38 },
  { name: 'Al Pastor', orders: 12, revenue: 185.88, pct: 25 },
]

const PLATFORM_FEE_PCT = 0.05

export function VendorEarnings() {
  const [period, setPeriod] = useState('week')
  const chartData = period === 'week' ? WEEKLY_DATA : MONTHLY_DATA
  const maxRevenue = Math.max(...chartData.map(d => d.revenue))
  const periodRevenue = chartData.reduce((s, d) => s + d.revenue, 0)
  const periodOrders = chartData.reduce((s, d) => s + d.orders, 0)
  const platformFee = periodRevenue * PLATFORM_FEE_PCT
  const netRevenue = periodRevenue - platformFee

  const todayRevenue = WEEKLY_DATA[6].revenue

  return (
    <div className="page animate-fadeIn">
      <AppHeader title="Earnings" />

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, padding: '16px 16px 12px' }}>
        <StatsCard label="Today" value={formatPrice(todayRevenue)} icon={DollarSign} color="var(--success)" />
        <StatsCard label={period === 'week' ? 'This Week' : 'This Month'} value={formatPrice(netRevenue)} icon={TrendingUp} color="var(--primary)" sub="after platform fee" />
      </div>
      <div style={{ display: 'flex', gap: 10, padding: '0 16px 16px' }}>
        <StatsCard label="Orders" value={periodOrders} icon={Package} color="var(--primary-light)" sub={period === 'week' ? 'this week' : 'this month'} />
        <StatsCard label="Avg Rating" value="4.9 ⭐" icon={Star} color="var(--warning)" sub="from 342 reviews" />
      </div>

      {/* Chart + period toggle */}
      <div style={{ margin: '0 16px 16px', padding: '16px', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>{period === 'week' ? 'This Week' : 'This Month'}</h3>
          <div style={{ display: 'flex', background: 'var(--bg-surface)', borderRadius: 8, padding: 3, gap: 3 }}>
            {['week', 'month'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                background: period === p ? 'var(--primary)' : 'transparent',
                color: period === p ? 'white' : 'var(--text-muted)',
              }}>
                {p === 'week' ? 'Week' : 'Month'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100 }}>
          {chartData.map((d, i) => (
            <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: '100%' }}>
                <div style={{
                  height: Math.round((d.revenue / maxRevenue) * 80),
                  background: i === chartData.length - 1 ? 'var(--primary)' : 'var(--bg-surface)',
                  border: `1px solid ${i === chartData.length - 1 ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 4, transition: 'height 0.3s ease',
                }} />
              </div>
              <span style={{ fontSize: 10, color: i === chartData.length - 1 ? 'var(--primary-light)' : 'var(--text-muted)', fontWeight: i === chartData.length - 1 ? 700 : 400 }}>{d.day}</span>
            </div>
          ))}
        </div>

        {/* Commission breakdown */}
        <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--bg-surface)', borderRadius: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Breakdown</div>
          <div className="row-between" style={{ marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Gross sales</span>
            <span style={{ fontSize: 12, fontWeight: 600 }}>{formatPrice(periodRevenue)}</span>
          </div>
          <div className="row-between" style={{ marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Platform fee (5%)</span>
            <span style={{ fontSize: 12, color: 'var(--error)', fontWeight: 600 }}>−{formatPrice(platformFee)}</span>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 6, marginTop: 2 }} className="row-between">
            <span style={{ fontSize: 13, fontWeight: 700 }}>Your net</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--success)' }}>{formatPrice(netRevenue)}</span>
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className="section-header">
        <span className="section-title">Top Products</span>
      </div>
      <div style={{ padding: '0 16px 8px' }}>
        {TOP_PRODUCTS.map((p, i) => (
          <div key={p.name} style={{ marginBottom: 10 }}>
            <div className="row-between" style={{ marginBottom: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', width: 16 }}>#{i + 1}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-light)' }}>{formatPrice(p.revenue)}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>{p.orders} orders</span>
              </div>
            </div>
            <div style={{ height: 4, background: 'var(--bg-surface)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${p.pct}%`, background: i === 0 ? 'var(--primary)' : 'var(--bg-surface-2, rgba(249,156,76,0.35))', borderRadius: 2, transition: 'width 0.4s ease' }} />
            </div>
          </div>
        ))}
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
            <div className="row-between" style={{ marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>{p.period}</div>
                <div style={{ fontSize: 17, fontWeight: 700 }}>{formatPrice(p.amount)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="chip chip-success" style={{ fontSize: 11 }}>✓ {p.status}</span>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{p.date}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 12 }}>
              <span>Gross: {formatPrice(p.gross)}</span>
              <span>Fee: −{formatPrice(p.fee)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
