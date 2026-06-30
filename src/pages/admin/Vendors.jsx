import { useState } from 'react'
import { Search, CheckCircle, XCircle, Star, X, Store, TrendingUp, Shield } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { MOCK_VENDORS } from '../../utils/mockData'
import { useToast } from '../../contexts/ToastContext'
import { formatPrice } from '../../utils/formatters'

const VENDOR_GMV = { v1: 12840, v2: 9310, v3: 7650, v4: 5120 }

const extendedVendors = [
  ...MOCK_VENDORS.map(v => ({
    ...v,
    status: 'active',
    stripeConnected: true,
    joinedDays: Math.floor(Math.random() * 300) + 30,
    gmv: VENDOR_GMV[v.id] || 4000,
    ordersCount: Math.floor((VENDOR_GMV[v.id] || 4000) / 42),
    commissionRate: 0.05,
  })),
  { id: 'v-pending-1', name: 'La Michoacana SD', city: 'San Diego', rating: 0, reviewCount: 0, status: 'pending', stripeConnected: false, joinedDays: 1, specialties: ['Carnitas', 'Chorizo'], isOpen: false, gmv: 0, ordersCount: 0, commissionRate: 0.05, phone: '(619) 555-0899', address: '1201 University Ave, San Diego, CA 92103' },
  { id: 'v-pending-2', name: 'Tacos El Gordo SJ', city: 'San Jose', rating: 0, reviewCount: 0, status: 'pending', stripeConnected: false, joinedDays: 2, specialties: ['Al Pastor'], isOpen: false, gmv: 0, ordersCount: 0, commissionRate: 0.05, phone: '(408) 555-0012', address: '3890 McKee Rd, San Jose, CA 95127' },
]

export function AdminVendors() {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [vendors, setVendors] = useState(extendedVendors)
  const [selected, setSelected] = useState(null)

  const filtered = vendors.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.city.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || v.status === filter
    return matchSearch && matchFilter
  })

  const approve = (id) => {
    setVendors(vs => vs.map(v => v.id === id ? { ...v, status: 'active' } : v))
    setSelected(s => s?.id === id ? { ...s, status: 'active' } : s)
    toast('Vendor approved!', 'success')
  }

  const suspend = (id) => {
    setVendors(vs => vs.map(v => v.id === id ? { ...v, status: 'suspended' } : v))
    setSelected(s => s?.id === id ? { ...s, status: 'suspended' } : s)
    toast('Vendor suspended', 'info')
  }

  const reactivate = (id) => {
    setVendors(vs => vs.map(v => v.id === id ? { ...v, status: 'active' } : v))
    setSelected(s => s?.id === id ? { ...s, status: 'active' } : s)
    toast('Vendor reactivated', 'success')
  }

  const statusColor = (s) => s === 'active' ? 'chip-success' : s === 'pending' ? '' : 'chip-error'

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
              {f === 'pending' && vendors.filter(v => v.status === 'pending').length > 0 && (
                <span style={{ marginLeft: 4, background: 'var(--primary)', color: 'white', borderRadius: 10, fontSize: 10, padding: '1px 5px' }}>{vendors.filter(v => v.status === 'pending').length}</span>
              )}
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
              <span className={`chip ${statusColor(v.status)}`} style={{ fontSize: 11 }}>{v.status}</span>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
              {v.rating > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                  <Star size={11} fill="var(--warning)" color="var(--warning)" />
                  {v.rating} ({v.reviewCount})
                </div>
              )}
              {v.gmv > 0 && (
                <div style={{ fontSize: 12, color: 'var(--success)' }}>
                  {formatPrice(v.gmv)} GMV
                </div>
              )}
              <div style={{ fontSize: 12, color: v.stripeConnected ? 'var(--success)' : 'var(--warning)' }}>
                {v.stripeConnected ? '✓ Stripe' : '⚠ No Stripe'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Joined {v.joinedDays}d ago</div>
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
                <button className="btn btn-primary btn-sm" style={{ flex: 1, fontSize: 12 }} onClick={() => reactivate(v.id)}>
                  <CheckCircle size={13} /> Reactivate
                </button>
              )}
              <button className="btn btn-secondary btn-sm" style={{ fontSize: 12, paddingLeft: 12, paddingRight: 12 }} onClick={() => setSelected(v)}>
                View →
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

      {/* Vendor detail bottom sheet */}
      {selected && (
        <div className="bottom-sheet-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="bottom-sheet" style={{ maxHeight: '88vh', overflowY: 'auto' }}>
            <div className="bottom-sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>{selected.name}</h3>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{selected.city}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={`chip ${statusColor(selected.status)}`} style={{ fontSize: 11 }}>{selected.status}</span>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* KPI grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <div className="stat-card">
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>GMV (All Time)</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--success)' }}>{formatPrice(selected.gmv)}</div>
              </div>
              <div className="stat-card">
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Platform Revenue</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(selected.gmv * 0.05)}</div>
              </div>
              <div className="stat-card">
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Orders</div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{selected.ordersCount}</div>
              </div>
              <div className="stat-card">
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Rating</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--warning)' }}>
                  {selected.rating > 0 ? `${selected.rating} ⭐` : 'N/A'}
                </div>
              </div>
            </div>

            {/* Details */}
            <div style={{ padding: '12px 14px', background: 'var(--bg-surface)', borderRadius: 10, marginBottom: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Address</span>
                  <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '55%' }}>{selected.address || `${selected.city}, CA`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Phone</span>
                  <span style={{ fontWeight: 600 }}>{selected.phone || 'Not set'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Joined</span>
                  <span style={{ fontWeight: 600 }}>{selected.joinedDays} days ago</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Commission</span>
                  <span style={{ fontWeight: 600 }}>{(selected.commissionRate * 100).toFixed(0)}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Stripe</span>
                  <span style={{ fontWeight: 600, color: selected.stripeConnected ? 'var(--success)' : 'var(--warning)' }}>
                    {selected.stripeConnected ? '✓ Connected' : '⚠ Not connected'}
                  </span>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Specialties</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selected.specialties?.map(s => (
                  <span key={s} className="chip chip-primary" style={{ fontSize: 12 }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selected.status === 'pending' && (
                <button className="btn btn-primary btn-full" onClick={() => approve(selected.id)}>
                  <CheckCircle size={15} /> Approve Vendor
                </button>
              )}
              {selected.status === 'active' && (
                <button className="btn btn-danger btn-full" onClick={() => suspend(selected.id)}>
                  <XCircle size={15} /> Suspend Vendor
                </button>
              )}
              {selected.status === 'suspended' && (
                <button className="btn btn-primary btn-full" onClick={() => reactivate(selected.id)}>
                  <CheckCircle size={15} /> Reactivate Vendor
                </button>
              )}
              {!selected.stripeConnected && (
                <button className="btn btn-secondary btn-full" onClick={() => { toast('Stripe invite sent to vendor', 'success'); setSelected(null) }}>
                  <Shield size={15} /> Send Stripe Onboarding Link
                </button>
              )}
              <button className="btn btn-ghost btn-full" style={{ fontSize: 13 }} onClick={() => { toast('Email sent to vendor', 'info'); setSelected(null) }}>
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
