import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, ChevronRight, Package, RefreshCw, Star } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { ReviewModal } from '../../components/customer/ReviewModal'
import { MOCK_ORDERS, MOCK_PRODUCTS } from '../../utils/mockData'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useToast } from '../../contexts/ToastContext'
import { ORDER_STATUS_LABELS } from '../../utils/constants'
import { formatPrice, formatDate } from '../../utils/formatters'

const STATUS_COLOR = {
  pending: 'var(--warning)',
  confirmed: 'var(--primary-light)',
  preparing: 'var(--primary)',
  ready: 'var(--success)',
  picked_up: 'var(--success)',
  delivered: 'var(--text-muted)',
  cancelled: 'var(--error)',
}

export function OrderHistory() {
  const { user } = useAuth()
  const { addItem, clearCart } = useCart()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [tab, setTab] = useState('active')
  const [reviewOrder, setReviewOrder] = useState(null)

  const reviewed = JSON.parse(localStorage.getItem('carnemx_reviews') || '[]').map(r => r.orderId)

  const orderAgain = (order) => {
    clearCart()
    const products = MOCK_PRODUCTS[order.vendorId] || []
    let added = 0
    order.items?.forEach(item => {
      const p = products.find(p => p.id === item.productId)
      if (p && p.inStock) {
        addItem(p, item.quantity, { marinade: item.marinade, cut: item.cut })
        added++
      }
    })
    if (added > 0) {
      toast(`${added} item${added > 1 ? 's' : ''} added to cart`, 'success')
      navigate('/cart')
    } else {
      toast('Items from this order are no longer available', 'error')
    }
  }

  const stored = JSON.parse(localStorage.getItem('carnemx_orders') || '[]').map(o => ({ ...o, createdAt: new Date(o.createdAt) }))
  const all = [...stored, ...MOCK_ORDERS].filter((o, i, arr) => arr.findIndex(x => x.id === o.id) === i)

  const active = all.filter(o => !['delivered', 'cancelled'].includes(o.status))
  const past = all.filter(o => ['delivered', 'cancelled'].includes(o.status))
  const orders = tab === 'active' ? active : past

  return (
    <div className="page animate-fadeIn">
      <AppHeader title="My Orders" />

      <div style={{ padding: '12px 16px' }}>
        <div className="tabs">
          <button className={`tab ${tab === 'active' ? 'tab-active' : ''}`} onClick={() => setTab('active')}>
            Active {active.length > 0 && `(${active.length})`}
          </button>
          <button className={`tab ${tab === 'past' ? 'tab-active' : ''}`} onClick={() => setTab('past')}>
            Past Orders
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Package size={56} color="var(--text-muted)" /></div>
          <div className="empty-title">{tab === 'active' ? 'No active orders' : 'No past orders'}</div>
          <div className="empty-desc">{tab === 'active' ? 'Your active orders will appear here' : 'Your order history will appear here'}</div>
          <button className="btn btn-primary mt-16" onClick={() => navigate('/vendors')}>Order Now</button>
        </div>
      ) : (
        <div style={{ padding: '0 16px' }}>
          {orders.map(order => (
            <div key={order.id} className="card" style={{ marginBottom: 12, cursor: 'pointer' }} onClick={() => navigate(`/orders/${order.id}`)}>
              <div style={{ padding: '14px 14px 12px' }}>
                <div className="row-between" style={{ marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>#{order.id.slice(-4).toUpperCase()}</div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{order.vendorName}</div>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>
                  {order.items?.map(i => `${i.quantity}lb ${i.name}`).join(', ')}
                </div>
                <div className="row-between">
                  <span className="chip" style={{ fontSize: 11, background: `${STATUS_COLOR[order.status]}18`, color: STATUS_COLOR[order.status], borderColor: `${STATUS_COLOR[order.status]}40` }}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <div className="price" style={{ fontSize: 15 }}>{formatPrice(order.total)}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{formatDate(order.createdAt)}</div>
                  </div>
                </div>
              </div>
              {tab === 'active' && order.status !== 'delivered' && (
                <div style={{ padding: '10px 14px', background: 'rgba(232,93,4,0.06)', borderTop: '1px solid rgba(232,93,4,0.15)', fontSize: 13, color: 'var(--primary-light)', fontWeight: 600 }}>
                  🔴 Track your order →
                </div>
              )}
              {tab === 'past' && (
                <div style={{ padding: '8px 14px 12px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, fontSize: 12 }}
                    onClick={e => { e.stopPropagation(); orderAgain(order) }}
                  >
                    <RefreshCw size={12} /> Order Again
                  </button>
                  {order.status === 'delivered' && !reviewed.includes(order.id) && (
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, fontSize: 12 }}
                      onClick={e => { e.stopPropagation(); setReviewOrder(order) }}
                    >
                      <Star size={12} /> Review
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {reviewOrder && (
        <ReviewModal
          order={reviewOrder}
          onClose={() => setReviewOrder(null)}
          onSubmit={() => toast('Thanks for your review! ⭐', 'success')}
        />
      )}
    </div>
  )
}
