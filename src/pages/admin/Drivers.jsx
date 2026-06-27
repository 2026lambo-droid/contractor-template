import { useState } from 'react'
import { Search, Truck, CheckCircle, XCircle } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { useToast } from '../../contexts/ToastContext'

const MOCK_DRIVERS = [
  { id: 'dr-1', name: 'Carlos Mendoza', city: 'San Jose', vehicle: 'Toyota Corolla', plate: '7ABC123', status: 'online', deliveries: 142, rating: 4.9, earnings: 2840 },
  { id: 'dr-2', name: 'Miguel Reyes', city: 'Oakland', vehicle: 'Honda Civic', plate: '3XYZ456', status: 'online', deliveries: 98, rating: 4.7, earnings: 1960 },
  { id: 'dr-3', name: 'Javier López', city: 'Los Angeles', vehicle: 'Ford Fusion', plate: '2DEF789', status: 'offline', deliveries: 67, rating: 4.8, earnings: 1340 },
  { id: 'dr-4', name: 'Ana Torres', city: 'San Diego', vehicle: 'Nissan Sentra', plate: '5GHI012', status: 'delivering', deliveries: 215, rating: 4.95, earnings: 4300 },
  { id: 'dr-5', name: 'Roberto Silva', city: 'San Jose', vehicle: 'Chevy Malibu', plate: '9JKL345', status: 'pending', deliveries: 0, rating: 0, earnings: 0 },
]

const STATUS_COLOR = { online: 'var(--success)', offline: 'var(--text-muted)', delivering: 'var(--primary)', pending: 'var(--warning)' }

export function AdminDrivers() {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [drivers, setDrivers] = useState(MOCK_DRIVERS)

  const filtered = drivers.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) || d.city.toLowerCase().includes(search.toLowerCase())
  )

  const approve = (id) => { setDrivers(ds => ds.map(d => d.id === id ? { ...d, status: 'offline' } : d)); toast('Driver approved', 'success') }
  const deactivate = (id) => { setDrivers(ds => ds.map(d => d.id === id ? { ...d, status: 'pending' } : d)); toast('Driver deactivated', 'info') }

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
          <div key={d.id} className="card" style={{ marginBottom: 12, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'var(--primary-light)', border: '2px solid var(--border)' }}>
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
              {d.earnings > 0 && <div style={{ fontSize: 12, color: 'var(--success)' }}>${d.earnings.toLocaleString()} earned</div>}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {d.status === 'pending' ? (
                <button className="btn btn-primary btn-sm" style={{ flex: 1, fontSize: 12 }} onClick={() => approve(d.id)}>
                  <CheckCircle size={13} /> Approve
                </button>
              ) : (
                <button className="btn btn-secondary btn-sm" style={{ flex: 1, fontSize: 12 }} onClick={() => deactivate(d.id)}>
                  <XCircle size={13} /> Deactivate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
