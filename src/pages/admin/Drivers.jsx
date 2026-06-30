import { useState } from 'react'
import { Search, Truck, CheckCircle, XCircle, X, Star, MapPin, Phone } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { useToast } from '../../contexts/ToastContext'
import { formatPrice } from '../../utils/formatters'

const MOCK_DRIVERS = [
  { id: 'dr-1', name: 'Carlos Mendoza', city: 'San Jose', vehicle: 'Toyota Corolla', plate: '7ABC123', status: 'online', deliveries: 142, rating: 4.9, earnings: 2840, phone: '(408) 555-0192', zone: 'South Bay', joinedDays: 94, lastDelivery: '12 min ago', avgTime: 26 },
  { id: 'dr-2', name: 'Miguel Reyes', city: 'Oakland', vehicle: 'Honda Civic', plate: '3XYZ456', status: 'online', deliveries: 98, rating: 4.7, earnings: 1960, phone: '(510) 555-0348', zone: 'East Bay', joinedDays: 67, lastDelivery: '38 min ago', avgTime: 31 },
  { id: 'dr-3', name: 'Javier López', city: 'Los Angeles', vehicle: 'Ford Fusion', plate: '2DEF789', status: 'offline', deliveries: 67, rating: 4.8, earnings: 1340, phone: '(323) 555-0721', zone: 'LA Metro', joinedDays: 45, lastDelivery: '3 hr ago', avgTime: 28 },
  { id: 'dr-4', name: 'Ana Torres', city: 'San Diego', vehicle: 'Nissan Sentra', plate: '5GHI012', status: 'delivering', deliveries: 215, rating: 4.95, earnings: 4300, phone: '(619) 555-0456', zone: 'South San Diego', joinedDays: 142, lastDelivery: 'Active now', avgTime: 23 },
  { id: 'dr-5', name: 'Roberto Silva', city: 'San Jose', vehicle: 'Chevy Malibu', plate: '9JKL345', status: 'pending', deliveries: 0, rating: 0, earnings: 0, phone: '(408) 555-0099', zone: 'Pending', joinedDays: 1, lastDelivery: 'Never', avgTime: null },
]

const STATUS_COLOR = { online: 'var(--success)', offline: 'var(--text-muted)', delivering: 'var(--primary)', pending: 'var(--warning)' }
const STATUS_CHIP = { online: 'chip-success', offline: 'chip-muted', delivering: 'chip-primary', pending: '' }

export function AdminDrivers() {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [drivers, setDrivers] = useState(MOCK_DRIVERS)
  const [selected, setSelected] = useState(null)

  const filtered = drivers.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) || d.city.toLowerCase().includes(search.toLowerCase())
  )

  const approve = (id) => {
    setDrivers(ds => ds.map(d => d.id === id ? { ...d, status: 'offline' } : d))
    setSelected(s => s?.id === id ? { ...s, status: 'offline' } : s)
    toast('Driver approved — they can now receive deliveries', 'success')
  }

  const deactivate = (id) => {
    setDrivers(ds => ds.map(d => d.id === id ? { ...d, status: 'pending' } : d))
    setSelected(s => s?.id === id ? { ...s, status: 'pending' } : s)
    toast('Driver deactivated', 'info')
  }

  const onlineCount = drivers.filter(d => d.status === 'online' || d.status === 'delivering').length

  return (
    <div className="page animate-fadeIn">
      <AppHeader title="Drivers" back />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '12px 16px' }}>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--success)' }}>{onlineCount}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Online</div>
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>{drivers.filter(d => d.status === 'delivering').length}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Delivering</div>
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{drivers.length}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total</div>
        </div>
      </div>

      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" placeholder="Search drivers..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {filtered.map(d => (
          <div key={d.id} className="card" style={{ marginBottom: 12, padding: 14 }} onClick={() => setSelected(d)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'var(--primary-light)', border: '2px solid var(--border)', flexShrink: 0 }}>
                  {d.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{d.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.city}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: STATUS_COLOR[d.status] }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLOR[d.status] }} />
                {d.status}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}><Truck size={11} style={{ display: 'inline', marginRight: 4 }} />{d.vehicle}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>📦 {d.deliveries} deliveries</div>
              {d.rating > 0 && <div style={{ fontSize: 12, color: 'var(--warning)' }}>⭐ {d.rating}</div>}
              {d.earnings > 0 && <div style={{ fontSize: 12, color: 'var(--success)' }}>{formatPrice(d.earnings)}</div>}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {d.status === 'pending' ? (
                <button className="btn btn-primary btn-sm" style={{ flex: 1, fontSize: 12 }} onClick={e => { e.stopPropagation(); approve(d.id) }}>
                  <CheckCircle size={13} /> Approve
                </button>
              ) : (
                <button className="btn btn-secondary btn-sm" style={{ flex: 1, fontSize: 12 }} onClick={e => { e.stopPropagation(); deactivate(d.id) }}>
                  <XCircle size={13} /> Deactivate
                </button>
              )}
              <button className="btn btn-secondary btn-sm" style={{ fontSize: 12, paddingLeft: 12, paddingRight: 12 }}>
                View →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Driver detail bottom sheet */}
      {selected && (
        <div className="bottom-sheet-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="bottom-sheet" style={{ maxHeight: '88vh', overflowY: 'auto' }}>
            <div className="bottom-sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: 'var(--primary-light)', border: '2px solid var(--border)' }}>
                  {selected.name[0]}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800 }}>{selected.name}</h3>
                  <span className={`chip ${STATUS_CHIP[selected.status]}`} style={{ fontSize: 10 }}>{selected.status}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}><X size={20} /></button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
              <div className="stat-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>{selected.deliveries}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Deliveries</div>
              </div>
              <div className="stat-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--warning)' }}>{selected.rating > 0 ? selected.rating : '—'}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Rating</div>
              </div>
              <div className="stat-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--success)' }}>{selected.earnings > 0 ? formatPrice(selected.earnings) : '—'}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Earned</div>
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: '12px 14px', background: 'var(--bg-surface)', borderRadius: 10, marginBottom: 16 }}>
              {[
                ['Phone', selected.phone],
                ['City', selected.city],
                ['Zone', selected.zone],
                ['Vehicle', selected.vehicle],
                ['Plate', selected.plate],
                ['Joined', `${selected.joinedDays} days ago`],
                ['Last Delivery', selected.lastDelivery],
                ['Avg Delivery Time', selected.avgTime ? `${selected.avgTime} min` : 'N/A'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontWeight: 600, textAlign: 'right' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selected.status === 'pending' ? (
                <button className="btn btn-primary btn-full" onClick={() => approve(selected.id)}>
                  <CheckCircle size={15} /> Approve Driver
                </button>
              ) : (
                <button className="btn btn-danger btn-full" onClick={() => deactivate(selected.id)}>
                  <XCircle size={15} /> Deactivate Driver
                </button>
              )}
              <button className="btn btn-secondary btn-full" onClick={() => { toast(`Call initiated to ${selected.name}`, 'info'); setSelected(null) }}>
                <Phone size={14} /> Call Driver
              </button>
              <button className="btn btn-ghost btn-full" style={{ fontSize: 13 }} onClick={() => { toast('Message sent', 'success'); setSelected(null) }}>
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
