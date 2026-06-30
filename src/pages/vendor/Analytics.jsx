import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Package, Star, Users, ArrowUp, ArrowDown, BarChart2 } from 'lucide-react'
import { AppHeader, IconBtn } from '../../components/common/AppHeader'
import { formatPrice } from '../../utils/formatters'

const WEEKS = [
  { label: 'This Week', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], sales: [420, 380, 510, 620, 890, 1240, 760], orders: [11, 9, 13, 16, 22, 31, 19] },
  { label: 'Last Week', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], sales: [360, 410, 480, 590, 820, 1100, 680], orders: [9, 10, 12, 15, 21, 28, 17] },
]

const TOP_PRODUCTS = [
  { name: 'Carne Asada', lbs: 142, revenue: 1917, pct: 100 },
  { name: 'Chorizo (Fresh)', lbs: 98, revenue: 1176, pct: 61 },
  { name: 'Carnitas', lbs: 76, revenue: 988, pct: 52 },
  { name: 'Short Ribs', lbs: 54, revenue: 918, pct: 48 },
  { name: 'Al Pastor', lbs: 61, revenue: 793, pct: 41 },
]

const CUSTOMER_SEGMENTS = [
  { label: 'Repeat Customers', value: 68, pct: 68, color: 'var(--primary)' },
  { label: 'New Customers', value: 32, pct: 32, color: 'var(--success)' },
]

const HOUR_DATA = [
  { h: '9am', v: 2 }, { h: '10am', v: 5 }, { h: '11am', v: 9 },
  { h: '12pm', v: 14 }, { h: '1pm', v: 11 }, { h: '2pm', v: 8 },
  { h: '3pm', v: 7 }, { h: '4pm', v: 12 }, { h: '5pm', v: 18 },
  { h: '6pm', v: 21 }, { h: '7pm', v: 16 }, { h: '8pm', v: 6 },
]
const hourMax = Math.max(...HOUR_DATA.map(d => d.v))

const REVIEWS = [
  { stars: 5, pct: 74 }, { stars: 4, pct: 18 }, { stars: 3, pct: 5 },
  { stars: 2, pct: 2 }, { stars: 1, pct: 1 },
]

export function VendorAnalytics() {
  const navigate = useNavigate()
  const [weekIdx, setWeekIdx] = useState(0)
  const [hoverDay, setHoverDay] = useState(null)
  const [hoverHour, setHoverHour] = useState(null)

  const week = WEEKS[weekIdx]
  const salesMax = Math.max(...week.sales)
  const totalSales = week.sales.reduce((s, v) => s + v, 0)
  const totalOrders = week.orders.reduce((s, v) => s + v, 0)
  const prevTotal = WEEKS[1].sales.reduce((s, v) => s + v, 0)
  const growthPct = (((totalSales - prevTotal) / prevTotal) * 100).toFixed(1)
  const isGrowth = parseFloat(growthPct) >= 0

  return (
    <div className="page animate-fadeIn">
      <AppHeader title="Analytics" back />

      {/* Period toggle */}
      <div style={{ display: 'flex', gap: 8, padding: '8px 16px 16px' }}>
        {WEEKS.map((w, i) => (
          <button
            key={w.label}
            onClick={() => setWeekIdx(i)}
            style={{
              flex: 1, padding: '8px 0', borderRadius: 'var(--radius-sm)',
              background: weekIdx === i ? 'var(--primary)' : 'var(--bg-card)',
              border: `1px solid ${weekIdx === i ? 'var(--primary)' : 'var(--border)'}`,
              color: weekIdx === i ? 'white' : 'var(--text-secondary)',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}
          >
            {w.label}
          </button>
        ))}
      </div>

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 16px 16px' }}>
        <div className="stat-card">
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>GROSS SALES</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--success)' }}>{formatPrice(totalSales)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            {isGrowth ? <ArrowUp size={11} color="var(--success)" /> : <ArrowDown size={11} color="var(--error)" />}
            <span style={{ fontSize: 11, color: isGrowth ? 'var(--success)' : 'var(--error)', fontWeight: 700 }}>{Math.abs(growthPct)}% vs last week</span>
          </div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>TOTAL ORDERS</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{totalOrders}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Avg {formatPrice(totalSales / totalOrders)} / order</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>NET REVENUE</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary-light)' }}>{formatPrice(totalSales * 0.95)}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>After 5% platform fee</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>AVG RATING</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--warning)' }}>4.8 ⭐</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>From 124 reviews</div>
        </div>
      </div>

      {/* Daily sales chart */}
      <div style={{ margin: '0 16px 16px', padding: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Daily Sales</span>
          <TrendingUp size={15} color="var(--success)" />
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>Hover to inspect</div>

        {hoverDay !== null && (
          <div style={{ marginBottom: 8, padding: '6px 10px', background: 'var(--bg-surface)', borderRadius: 6, display: 'inline-flex', gap: 12, fontSize: 12 }}>
            <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{week.days[hoverDay]}</span>
            <span style={{ color: 'var(--success)' }}>{formatPrice(week.sales[hoverDay])}</span>
            <span style={{ color: 'var(--text-muted)' }}>{week.orders[hoverDay]} orders</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 80 }}>
          {week.days.map((d, i) => (
            <div
              key={d}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}
              onMouseEnter={() => setHoverDay(i)}
              onMouseLeave={() => setHoverDay(null)}
            >
              <div style={{
                width: '100%',
                height: Math.max(4, Math.round((week.sales[i] / salesMax) * 64)),
                background: hoverDay === i ? 'var(--primary)' : i === 5 ? 'rgba(232,93,4,0.7)' : 'rgba(232,93,4,0.3)',
                borderRadius: '3px 3px 0 0',
                transition: 'all 0.15s',
              }} />
              <span style={{ fontSize: 9, color: i === 5 ? 'var(--primary-light)' : 'var(--text-muted)', fontWeight: i === 5 ? 700 : 400 }}>{d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Peak hours */}
      <div style={{ margin: '0 16px 16px', padding: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Peak Hours</span>
          <BarChart2 size={15} color="var(--primary)" />
        </div>

        {hoverHour !== null && (
          <div style={{ marginBottom: 8, padding: '6px 10px', background: 'var(--bg-surface)', borderRadius: 6, display: 'inline-flex', gap: 10, fontSize: 12 }}>
            <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{HOUR_DATA[hoverHour].h}</span>
            <span style={{ color: 'var(--text-muted)' }}>{HOUR_DATA[hoverHour].v} orders</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 60 }}>
          {HOUR_DATA.map((d, i) => (
            <div
              key={d.h}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: 'pointer' }}
              onMouseEnter={() => setHoverHour(i)}
              onMouseLeave={() => setHoverHour(null)}
            >
              <div style={{
                width: '100%',
                height: Math.max(3, Math.round((d.v / hourMax) * 50)),
                background: hoverHour === i ? 'var(--primary)' : d.v >= 15 ? 'rgba(232,93,4,0.65)' : 'rgba(232,93,4,0.25)',
                borderRadius: '2px 2px 0 0',
                transition: 'all 0.15s',
              }} />
              <span style={{ fontSize: 7, color: 'var(--text-muted)', transform: 'rotate(-45deg)', transformOrigin: 'center', display: 'block', whiteSpace: 'nowrap' }}>{d.h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top products */}
      <div style={{ margin: '0 16px 16px', padding: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Package size={15} color="var(--primary)" />
          <span style={{ fontSize: 14, fontWeight: 700 }}>Top Products</span>
        </div>
        {TOP_PRODUCTS.map(p => (
          <div key={p.name} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
              <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 700 }}>{formatPrice(p.revenue)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 6, background: 'var(--bg-surface)', borderRadius: 3 }}>
                <div style={{ width: `${p.pct}%`, height: '100%', background: 'var(--primary)', borderRadius: 3, transition: 'width 0.4s' }} />
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{p.lbs} lbs</span>
            </div>
          </div>
        ))}
      </div>

      {/* Customer segments + ratings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 16px 16px' }}>
        <div style={{ padding: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Users size={13} color="var(--primary)" />
            <span style={{ fontSize: 13, fontWeight: 700 }}>Customers</span>
          </div>
          {CUSTOMER_SEGMENTS.map(s => (
            <div key={s.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700 }}>{s.value}%</span>
              </div>
              <div style={{ height: 5, background: 'var(--bg-surface)', borderRadius: 3 }}>
                <div style={{ width: `${s.pct}%`, height: '100%', background: s.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Star size={13} color="var(--warning)" />
            <span style={{ fontSize: 13, fontWeight: 700 }}>Ratings</span>
          </div>
          {REVIEWS.map(r => (
            <div key={r.stars} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap', width: 14 }}>{r.stars}★</span>
              <div style={{ flex: 1, height: 5, background: 'var(--bg-surface)', borderRadius: 3 }}>
                <div style={{ width: `${r.pct}%`, height: '100%', background: 'var(--warning)', borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', width: 22, textAlign: 'right' }}>{r.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
