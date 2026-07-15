import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { formatPrice } from '../../utils/formatters'

const DELIVERY_BREAKDOWN = {
  'del-h1': [
    { id: 'd1a', vendor: 'La Carnicería El Rancho', drop: '800 N 1st St, San Jose', earned: 9.50, miles: 3.2, time: '8:14 AM', rating: 5 },
    { id: 'd1b', vendor: 'Carnitas La Familia', drop: '1600 E 14th St, San Leandro', earned: 11.00, miles: 5.1, time: '9:42 AM', rating: 5 },
    { id: 'd1c', vendor: 'Carnicería El Toro', drop: '290 Hedding St, San Jose', earned: 8.00, miles: 4.4, time: '11:05 AM', rating: 5 },
    { id: 'd1d', vendor: 'La Carnicería El Rancho', drop: '445 Willow St, San Jose', earned: 7.50, miles: 2.8, time: '1:30 PM', rating: 5 },
    { id: 'd1e', vendor: 'Macías Meat Market', drop: '660 Story Rd, San Jose', earned: 6.00, miles: 3.6, time: '3:10 PM', rating: 5 },
    { id: 'd1f', vendor: 'Carnitas La Familia', drop: '220 Alum Rock Ave, San Jose', earned: 5.50, miles: 2.8, time: '4:45 PM', rating: 5 },
  ],
  'del-h2': [
    { id: 'd2a', vendor: 'Fruitvale Meats', drop: '3401 E 12th St, Oakland', earned: 10.00, miles: 6.3, time: '7:55 AM', rating: 5 },
    { id: 'd2b', vendor: 'La Carnicería El Rancho', drop: '800 N 1st St, San Jose', earned: 9.50, miles: 3.2, time: '9:20 AM', rating: 4 },
    { id: 'd2c', vendor: 'Carnitas La Familia', drop: '1600 E 14th St, San Leandro', earned: 11.00, miles: 5.1, time: '10:50 AM', rating: 5 },
    { id: 'd2d', vendor: 'Macías Meat Market', drop: '990 Oakland Rd, San Jose', earned: 7.00, miles: 4.0, time: '12:15 PM', rating: 5 },
    { id: 'd2e', vendor: 'Carnicería El Toro', drop: '1220 Alum Rock Ave, San Jose', earned: 8.20, miles: 3.7, time: '2:00 PM', rating: 5 },
    { id: 'd2f', vendor: 'La Carnicería El Rancho', drop: '500 El Camino Real, San Jose', earned: 7.00, miles: 2.9, time: '3:40 PM', rating: 5 },
    { id: 'd2g', vendor: 'Fruitvale Meats', drop: '220 Grand Ave, Oakland', earned: 5.50, miles: 2.1, time: '5:10 PM', rating: 4 },
    { id: 'd2h', vendor: 'Carnitas La Familia', drop: '780 Davis St, San Leandro', earned: 5.00, miles: 2.0, time: '6:30 PM', rating: 5 },
  ],
  'del-h3': [
    { id: 'd3a', vendor: 'La Carnicería El Rancho', drop: '800 N 1st St, San Jose', earned: 9.50, miles: 3.2, time: '9:00 AM', rating: 5 },
    { id: 'd3b', vendor: 'Macías Meat Market', drop: '445 Willow St, San Jose', earned: 7.25, miles: 3.1, time: '11:20 AM', rating: 5 },
    { id: 'd3c', vendor: 'Carnitas La Familia', drop: '1600 E 14th St, San Leandro', earned: 11.00, miles: 5.1, time: '1:45 PM', rating: 5 },
    { id: 'd3d', vendor: 'Fruitvale Meats', drop: '330 E 18th St, Oakland', earned: 7.00, miles: 3.8, time: '3:30 PM', rating: 5 },
    { id: 'd3e', vendor: 'La Carnicería El Rancho', drop: '660 Story Rd, San Jose', earned: 5.00, miles: 2.6, time: '5:00 PM', rating: 5 },
  ],
  'del-h4': [
    { id: 'd4a', vendor: 'Carnicería El Toro', drop: '1220 Alum Rock Ave, San Jose', earned: 8.20, miles: 3.7, time: '8:30 AM', rating: 5 },
    { id: 'd4b', vendor: 'La Carnicería El Rancho', drop: '500 El Camino Real, San Jose', earned: 9.50, miles: 3.2, time: '10:15 AM', rating: 5 },
    { id: 'd4c', vendor: 'Fruitvale Meats', drop: '3401 E 12th St, Oakland', earned: 10.00, miles: 6.3, time: '12:00 PM', rating: 4 },
    { id: 'd4d', vendor: 'Macías Meat Market', drop: '990 Oakland Rd, San Jose', earned: 7.00, miles: 4.0, time: '2:10 PM', rating: 5 },
    { id: 'd4e', vendor: 'Carnitas La Familia', drop: '780 Davis St, San Leandro', earned: 9.20, miles: 4.6, time: '4:00 PM', rating: 5 },
    { id: 'd4f', vendor: 'La Carnicería El Rancho', drop: '220 Alum Rock Ave, San Jose', earned: 7.50, miles: 3.3, time: '5:45 PM', rating: 5 },
    { id: 'd4g', vendor: 'Carnicería El Toro', drop: '660 Story Rd, San Jose', earned: 7.00, miles: 3.0, time: '7:00 PM', rating: 5 },
  ],
  'del-h5': [
    { id: 'd5a', vendor: 'La Carnicería El Rancho', drop: '800 N 1st St, San Jose', earned: 9.50, miles: 3.2, time: '10:00 AM', rating: 5 },
    { id: 'd5b', vendor: 'Carnitas La Familia', drop: '1600 E 14th St, San Leandro', earned: 11.00, miles: 5.1, time: '12:30 PM', rating: 5 },
    { id: 'd5c', vendor: 'Macías Meat Market', drop: '445 Willow St, San Jose', earned: 5.60, miles: 2.5, time: '2:45 PM', rating: 5 },
    { id: 'd5d', vendor: 'Fruitvale Meats', drop: '220 Grand Ave, Oakland', earned: 5.50, miles: 2.1, time: '4:30 PM', rating: 5 },
  ],
}

const HISTORY = [
  { id: 'del-h1', date: 'Today', deliveries: 6, earned: 47.50, miles: 38.2, rating: 5.0 },
  { id: 'del-h2', date: 'Yesterday', deliveries: 8, earned: 63.20, miles: 51.4, rating: 4.9 },
  { id: 'del-h3', date: 'Jun 25', deliveries: 5, earned: 39.75, miles: 29.8, rating: 5.0 },
  { id: 'del-h4', date: 'Jun 24', deliveries: 7, earned: 58.40, miles: 44.1, rating: 4.8 },
  { id: 'del-h5', date: 'Jun 23', deliveries: 4, earned: 31.60, miles: 22.6, rating: 5.0 },
]

const totalEarned = HISTORY.reduce((s, d) => s + d.earned, 0)
const totalDeliveries = HISTORY.reduce((s, d) => s + d.deliveries, 0)
const totalMiles = HISTORY.reduce((s, d) => s + d.miles, 0)

export function DriverHistory() {
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="page animate-fadeIn">
      <AppHeader title="Delivery History" />

      {/* Summary */}
      <div style={{ margin: '16px 16px 8px', padding: 16, background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Last 5 Days</div>
        <div style={{ display: 'flex', gap: 0 }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--success)' }}>{formatPrice(totalEarned)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Earned</div>
          </div>
          <div style={{ width: 1, background: 'var(--border)' }} />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{totalDeliveries}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Deliveries</div>
          </div>
          <div style={{ width: 1, background: 'var(--border)' }} />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary-light)' }}>{totalMiles.toFixed(0)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Miles</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {HISTORY.map(day => {
          const isOpen = expanded === day.id
          const deliveries = DELIVERY_BREAKDOWN[day.id] || []
          return (
            <div key={day.id} className="card" style={{ marginBottom: 10, overflow: 'hidden' }}>
              {/* Day header row */}
              <div
                onClick={() => setExpanded(isOpen ? null : day.id)}
                style={{ padding: '14px 14px 12px', cursor: 'pointer', userSelect: 'none' }}
              >
                <div className="row-between" style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{day.date}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="price" style={{ fontSize: 17 }}>{formatPrice(day.earned)}</div>
                    {isOpen ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="chip chip-muted" style={{ fontSize: 11 }}>📦 {day.deliveries} deliveries</span>
                  <span className="chip chip-muted" style={{ fontSize: 11 }}>📏 {day.miles} mi</span>
                  <span className="chip chip-warning" style={{ fontSize: 11 }}>⭐ {day.rating}</span>
                </div>
              </div>

              {/* Expandable delivery list */}
              {isOpen && (
                <div style={{ borderTop: '1px solid var(--border)' }}>
                  {deliveries.map((d, i) => (
                    <div key={d.id} style={{
                      padding: '10px 14px',
                      borderBottom: i < deliveries.length - 1 ? '1px solid var(--border)' : 'none',
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                    }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(249,156,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>
                        🛵
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{d.vendor}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>→ {d.drop}</div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.time}</span>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>·</span>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.miles} mi</span>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>·</span>
                          <span style={{ fontSize: 10, color: 'var(--warning)' }}>{'⭐'.repeat(d.rating)}</span>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--success)', flexShrink: 0 }}>
                        +{formatPrice(d.earned)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
