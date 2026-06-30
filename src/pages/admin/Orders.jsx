import { useState } from 'react'
import { Search, RefreshCw, X, ChevronDown } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { MOCK_ORDERS } from '../../utils/mockData'
import { ORDER_STATUS_LABELS } from '../../utils/constants'
import { formatPrice, formatDate } from '../../utils/formatters'
import { useToast } from '../../contexts/ToastContext'

const STATUS_COLOR = {
  pending: 'var(--warning)',
  confirmed: 'var(--primary-light)',
  preparing: 'var(--primary)',
  ready: 'var(--success)',
  picked_up: 'var(--success)',
  delivered: 'var(--text-muted)',
  cancelled: 'var(--error)',
}

const ALL_STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled']

const extraOrders = [
  { id: 'ord-a01', vendorId: 'v1', vendorName: 'La Carnicería El Rancho', customerName: 'Ana L.', items: [{ name: 'Carne Asada', quantity: 2 }], subtotal: 25.98, total: 32.37, status: 'preparing', createdAt: new Date(Date.now() - 10 * 60000), address: '660 Story Rd, San Jose, CA 95122' },
  { id: 'ord-a02', vendorId: 'v2', vendorName: 'Carnitas La Familia', customerName: 'Pedro M.', items: [{ name: 'Carnitas', quantity: 3 }], subtotal: 35.97, total: 43.46, status: 'confirmed', createdAt: new Date(Date.now() - 22 * 60000), address: '1600 E 14th St, San Leandro, CA 94578' },
  { id: 'ord-a03', vendorId: 'v3', vendorName: 'El Toro Meat Market', customerName: 'Sofia R.', items: [{ name: 'Prime Carne Asada', quantity: 2 }], subtotal: 31.98, total: 39.47, status: 'delivered', createdAt: new Date(Date.now() - 90 * 60000), address: '990 Oakland Rd, San Jose, CA 95112' },
]

export function AdminOrders() {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [overrideOrder, setOverrideOrder] = useState(null)
  const [newStatus, setNewStatus] = useState('')

  const [orders, setOrders] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('carnemx_orders') || '[]').map(o => ({ ...o, createdAt: new Date(o.createdAt) }))
    const all = [...stored, ...MOCK_ORDERS, ...extraOrders]
    return all.filter((o, i, arr) => arr.findIndex(x => x.id === o.id) === i)
  })

  const filtered = orders.filter(o => {
    const matchSearch = o.vendorName?.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search) || (o.customerName || '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || o.status === filter
    return matchSearch && matchFilter
  })

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0)
  const platformFee = totalRevenue * 0.05

  const confirmOverride = () => {
    if (!newStatus || newStatus === overrideOrder.status) { setOverrideOrder(null); return }
    setOrders(prev => prev.map(o => o.id === overrideOrder.id ? { ...o, status: newStatus } : o))
    const stored = JSON.parse(localStorage.getItem('carnemx_orders') || '[]')
    localStorage.setItem('carnemx_orders', JSON.stringify(stored.map(o => o.id === overrideOrder.id ? { ...o, status: newStatus } : o)))
    toast(`Order #${overrideOrder.id.slice(-4).toUpperCase()} → ${ORDER_STATUS_LABELS[newStatus]}`, 'success')
    setOverrideOrder(null)
    setNewStatus('')
  }

  return (
    <div className="page animate-fadeIn">
      <AppHeader title="All Orders" back />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '12px 16px' }}>
        <div className="stat-card">
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Total Orders</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{orders.length}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Platform Fee (5%)</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--success)' }}>{formatPrice(platformFee)}</div>
        </div>
      </div>

      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" placeholder="Search by vendor, customer, or order ID..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>

        <div className="scroll-x" style={{ paddingBottom: 4 }}>
          {['all', ...ALL_STATUSES].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`chip ${filter === f ? 'chip-primary' : 'chip-muted'}`} style={{ cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}>
              {f === 'all' ? 'All' : ORDER_STATUS_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <div className="empty-title">No orders found</div>
          </div>
        ) : filtered.map(order => (
          <div key={order.id} className="card" style={{ marginBottom: 10, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>#{order.id.slice(-4).toUpperCase()}</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{order.vendorName}</div>
                {order.customerName && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>by {order.customerName}</div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="price" style={{ fontSize: 14 }}>{formatPrice(order.total)}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{formatDate(order.createdAt)}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
              {order.items?.map(i => `${i.quantity}lb ${i.name}`).join(', ')}
            </div>
            {order.address && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>📍 {order.address}</div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="chip" style={{ fontSize: 11, background: `${STATUS_COLOR[order.status]}18`, color: STATUS_COLOR[order.status], borderColor: `${STATUS_COLOR[order.status]}40` }}>
                {ORDER_STATUS_LABELS[order.status]}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => { setOverrideOrder(order); setNewStatus(order.status) }}
                style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <RefreshCw size={11} /> Override Status
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Override status modal */}
      {overrideOrder && (
        <div className="bottom-sheet-overlay" onClick={e => e.target === e.currentTarget && setOverrideOrder(null)}>
          <div className="bottom-sheet">
            <div className="bottom-sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800 }}>Override Status</h3>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Order #{overrideOrder.id.slice(-4).toUpperCase()} · {overrideOrder.vendorName}</div>
              </div>
              <button onClick={() => setOverrideOrder(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}><X size={20} /></button>
            </div>

            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>Current: <strong style={{ color: STATUS_COLOR[overrideOrder.status] }}>{ORDER_STATUS_LABELS[overrideOrder.status]}</strong></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
              {ALL_STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => setNewStatus(s)}
                  style={{
                    padding: '10px 14px', borderRadius: 10, textAlign: 'left',
                    background: newStatus === s ? `${STATUS_COLOR[s]}15` : 'var(--bg-surface)',
                    border: `1.5px solid ${newStatus === s ? STATUS_COLOR[s] : 'var(--border)'}`,
                    cursor: 'pointer', fontSize: 14, fontWeight: newStatus === s ? 700 : 400,
                    color: newStatus === s ? STATUS_COLOR[s] : 'var(--text)',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[s], flexShrink: 0 }} />
                  {ORDER_STATUS_LABELS[s]}
                  {s === overrideOrder.status && <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>current</span>}
                </button>
              ))}
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={confirmOverride}
              disabled={newStatus === overrideOrder.status}
            >
              Confirm Override → {newStatus !== overrideOrder.status ? ORDER_STATUS_LABELS[newStatus] : '(no change)'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
