import { AppHeader } from '../../components/common/AppHeader'
import { formatPrice } from '../../utils/formatters'

const HISTORY = [
  { id: 'del-h1', date: 'Today', deliveries: 6, earned: 47.50, miles: 38.2, rating: 5.0 },
  { id: 'del-h2', date: 'Yesterday', deliveries: 8, earned: 63.20, miles: 51.4, rating: 4.9 },
  { id: 'del-h3', date: 'Jun 25', deliveries: 5, earned: 39.75, miles: 29.8, rating: 5.0 },
  { id: 'del-h4', date: 'Jun 24', deliveries: 7, earned: 58.40, miles: 44.1, rating: 4.8 },
  { id: 'del-h5', date: 'Jun 23', deliveries: 4, earned: 31.60, miles: 22.6, rating: 5.0 },
]

const totalEarned = HISTORY.reduce((s, d) => s + d.earned, 0)
const totalDeliveries = HISTORY.reduce((s, d) => s + d.deliveries, 0)

export function DriverHistory() {
  return (
    <div className="page animate-fadeIn">
      <AppHeader title="Delivery History" />

      {/* Summary */}
      <div style={{ margin: '16px 16px 8px', padding: 16, background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Last 5 Days</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--success)' }}>{formatPrice(totalEarned)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total earned</div>
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{totalDeliveries}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Deliveries</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {HISTORY.map(day => (
          <div key={day.id} className="card" style={{ marginBottom: 10 }}>
            <div style={{ padding: 14 }}>
              <div className="row-between" style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{day.date}</div>
                <div className="price" style={{ fontSize: 17 }}>{formatPrice(day.earned)}</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <span className="chip chip-muted" style={{ fontSize: 11 }}>📦 {day.deliveries} deliveries</span>
                <span className="chip chip-muted" style={{ fontSize: 11 }}>📏 {day.miles} mi</span>
                <span className="chip chip-warning" style={{ fontSize: 11 }}>⭐ {day.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
