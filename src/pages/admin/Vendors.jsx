import { useState } from 'react'
import { Search, CheckCircle, XCircle, Star, ChevronRight } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { MOCK_VENDORS } from '../../utils/mockData'
import { useToast } from '../../contexts/ToastContext'

const extendedVendors = [
  ...MOCK_VENDORS.map(v => ({ ...v, status: 'active', stripeConnected: true, joinedDays: Math.floor(Math.random() * 300) + 30 })),
  { id: 'v-pending-1', name: 'La Michoacana SD', city: 'San Diego', rating: 0, reviewCount: 0, status: 'pending', stripeConnected: false, joinedDays: 1, specialties: ['Carnitas', 'Chorizo'], isOpen: false },
  { id: 'v-pending-2', name: 'Tacos El Gordo SJ', city: 'San Jose', rating: 0, reviewCount: 0, status: 'pending', stripeConnected: false, joinedDays: 2, specialties: ['Al Pastor'], isOpen: false },
]

export function AdminVendors() {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [vendors, setVendors] = useState(extendedVendors)

  const filtered = vendors.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.city.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || v.status === filter
    return matchSearch && matchFilter
  })

  const approve = (id) => {
    setVendors(vs => vs.map(v => v.id === id ? { ...v, status: 'active' } : v))
    toast('Vendor approved!', 'success')
  }

  const suspend = (id) => {
    setVendors(vs => vs.map(v => v.id === id ? { ...v, status: 'suspended' } : v))
    toast('Vendor suspended', 'info')
  }

  return (
    <div className="page animate-fadeIn">
      <AppHeader title="Vendors" back />

      <div style={{ padding: '12px 16px 0' }}>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" placeholder="Search vendors..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>

        <div className="tabs" style={{ marginBottom: 16 }}>
          {['all', 'active', 'pending', 'suspended'].map(f => (
            <button key={f} className={`tab ${filter === f ? 'tab-active' : ''}`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {filtered.map(v => (
          <div key={v.id} className="card" style={{ marginBottom: 12, padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{v.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v.city}</div>
              </div>
              <span className={`chip ${v.status === 'active' ? 'chip-success' : v.status === 'pending' ? '' : 'chip-error'}`} style={{ fontSize: 11 }}>
                {v.status}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
              {v.rating > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                  <Star size={11} fill="var(--warning)" color="var(--warning)" />
                  {v.rating} ({v.reviewCount})
                </div>
              )}
              <div style={{ fontSize: 12, color: v.stripeConnected ? 'var(--success)' : 'var(--warning)' }}>
                {v.stripeConnected ? '✓ Stripe connected' : '⚠ Stripe not set up'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Joined {v.joinedDays}d ago
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {v.status === 'pending' && (
                <button className="btn btn-primary btn-sm" style={{ flex: 1, fontSize: 12 }} onClick={() => approve(v.id)}>
                  <CheckCircle size={13} /> Approve
                </button>
              )}
              {v.status === 'active' && (
                <button className="btn btn-secondary btn-sm" style={{ flex: 1, fontSize: 12 }} onClick={() => suspend(v.id)}>
                  <XCircle size={13} /> Suspend
                </button>
              )}
              {v.status === 'suspended' && (
                <button className="btn btn-primary btn-sm" style={{ flex: 1, fontSize: 12 }} onClick={() => approve(v.id)}>
                  <CheckCircle size={13} /> Reactivate
                </button>
              )}
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 12 }} onClick={() => toast('Vendor detail view coming soon', 'info')}>
                View <ChevronRight size={13} />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🏪</div>
            <div className="empty-title">No vendors found</div>
          </div>
        )}
      </div>
    </div>
  )
}
