import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Phone, MessageCircle, CheckCircle, Star } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { ReviewModal } from '../../components/customer/ReviewModal'
import { MOCK_ORDERS } from '../../utils/mockData'
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../utils/constants'
import { formatPrice, formatDate } from '../../utils/formatters'
import { subscribeToStatusUpdates } from '../../services/orderBus'
import { useToast } from '../../contexts/ToastContext'

const STEPS = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered']

function getStatusIndex(status) { return STEPS.indexOf(status) }

export function OrderTracking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const stored = JSON.parse(localStorage.getItem('carnemx_orders') || '[]')
  const mockOrder = MOCK_ORDERS.find(o => o.id === id)
  const storedOrder = stored.find(o => o.id === id)

  const [order, setOrder] = useState(() => {
    const o = storedOrder || mockOrder
    if (!o) return null
    return { ...o, createdAt: new Date(o.createdAt) }
  })

  const demoTimerRef = useRef(null)
  const [showReview, setShowReview] = useState(false)
  const reviewed = JSON.parse(localStorage.getItem('carnemx_reviews') || '[]').some(r => r.orderId === id)

  const applyStatus = (newStatus) => {
    setOrder(prev => {
      if (!prev) return prev
      const updated = { ...prev, status: newStatus }
      const all = JSON.parse(localStorage.getItem('carnemx_orders') || '[]')
      localStorage.setItem('carnemx_orders', JSON.stringify(all.map(o => o.id === updated.id ? updated : o)))
      return updated
    })
  }

  // Listen for real vendor status pushes via orderBus
  useEffect(() => {
    if (!order?.id) return
    return subscribeToStatusUpdates(order.id, applyStatus)
  }, [order?.id])

  // Demo simulation: auto-advance every 8 s when no real vendor is driving this order
  useEffect(() => {
    if (!order || order.status === 'delivered' || order.status === 'cancelled') return
    demoTimerRef.current = setInterval(() => {
      setOrder(prev => {
        if (!prev) return prev
        const idx = getStatusIndex(prev.status)
        if (idx >= STEPS.length - 1) { clearInterval(demoTimerRef.current); return prev }
        const newStatus = STEPS[idx + 1]
        const updated = { ...prev, status: newStatus }
        const all = JSON.parse(localStorage.getItem('carnemx_orders') || '[]')
        localStorage.setItem('carnemx_orders', JSON.stringify(all.map(o => o.id === updated.id ? updated : o)))
        return updated
      })
    }, 8000)
    return () => clearInterval(demoTimerRef.current)
  }, [order?.id])

  if (!order) return (
    <div className="page animate-fadeIn">
      <AppHeader title="Order Tracking" back />
      <div className="empty-state">
        <div className="empty-icon">📦</div>
        <div className="empty-title">Order not found</div>
        <button className="btn btn-primary mt-16" onClick={() => navigate('/orders')}>View Orders</button>
      </div>
    </div>
  )

  const currentStep = getStatusIndex(order.status)
  const isDelivered = order.status === 'delivered'
  const isCancelled = order.status === 'cancelled'

  const stepLabels = [
    { status: 'pending', label: 'Order Placed', icon: '📱', desc: 'Your order has been received' },
    { status: 'confirmed', label: 'Confirmed', icon: '✅', desc: 'Vendor confirmed your order' },
    { status: 'preparing', label: 'Preparing', icon: '🥩', desc: 'Your meats are being prepared' },
    { status: 'ready', label: 'Ready for Pickup', icon: '🎁', desc: 'Order packed & ready' },
    { status: 'picked_up', label: 'Out for Delivery', icon: '🚗', desc: `${order.driverName || 'Driver'} is on the way` },
    { status: 'delivered', label: 'Delivered', icon: '🎉', desc: 'Enjoy your carne asada!' },
  ]

  return (
    <div className="page animate-fadeIn">
      <AppHeader title={`Order #${id.slice(-4).toUpperCase()}`} back />

      {/* Status header */}
      <div style={{
        margin: 16, padding: 20, borderRadius: 'var(--radius-lg)',
        background: isDelivered ? 'rgba(34,197,94,0.1)' : isCancelled ? 'var(--error-bg)' : 'rgba(232,93,4,0.08)',
        border: `1px solid ${isDelivered ? 'rgba(34,197,94,0.25)' : isCancelled ? 'rgba(239,68,68,0.3)' : 'rgba(232,93,4,0.2)'}`,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>{stepLabels[Math.max(0, currentStep)]?.icon || '📦'}</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
          {ORDER_STATUS_LABELS[order.status]}
        </div>
        {!isDelivered && !isCancelled && (
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Estimated delivery: {order.estimatedDelivery || '20–35 min'}
          </div>
        )}
      </div>

      {/* Map placeholder */}
      {!isDelivered && !isCancelled && (
        <div style={{ margin: '0 16px 16px' }}>
          <div className="map-placeholder">
            <span style={{ fontSize: 32 }}>🗺️</span>
            <span>Live map tracking</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Google Maps integration required</span>
          </div>
        </div>
      )}

      {/* Driver info */}
      {(order.status === 'picked_up' || order.status === 'ready') && order.driverName && (
        <div style={{ margin: '0 16px 16px', padding: 14, background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <div className="row-between">
            <div className="row gap-12">
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: '1px solid var(--border)' }}>🚗</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{order.driverName}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Your driver</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm"><Phone size={14} /></button>
              <button className="btn btn-secondary btn-sm"><MessageCircle size={14} /></button>
            </div>
          </div>
        </div>
      )}

      {/* Progress steps */}
      <div style={{ margin: '0 16px 16px' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Order Progress</h3>
        <div className="tracking-steps">
          {stepLabels.map((step, i) => {
            const done = i < currentStep
            const active = i === currentStep
            const isLast = i === stepLabels.length - 1
            return (
              <div key={step.status} className="tracking-step">
                {!isLast && <div className={`step-line ${done ? 'step-line-active' : ''}`} />}
                <div className={`step-dot ${done ? 'step-dot-done' : active ? 'step-dot-active' : ''}`}>
                  {done && <CheckCircle size={12} color="white" />}
                  {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                </div>
                <div style={{ paddingTop: 2 }}>
                  <div style={{ fontSize: 14, fontWeight: done || active ? 700 : 500, color: done || active ? 'var(--text)' : 'var(--text-muted)' }}>
                    {step.label}
                  </div>
                  {active && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{step.desc}</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Order details */}
      <div style={{ margin: '0 16px 16px', padding: 16, background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Order Details</h3>
        {order.items?.map((item, i) => (
          <div key={i} className="row-between" style={{ marginBottom: 8, fontSize: 14 }}>
            <span style={{ color: 'var(--text-secondary)' }}>{item.quantity} lb {item.name}</span>
            <span>{formatPrice(item.pricePerLb * item.quantity)}</span>
          </div>
        ))}
        <div className="divider" />
        <div className="row-between" style={{ fontSize: 15, fontWeight: 700 }}>
          <span>Total</span>
          <span className="price">{formatPrice(order.total)}</span>
        </div>
        <div style={{ marginTop: 10 }}>
          <div className="row gap-6 text-sm text-muted"><MapPin size={12} />{order.address}</div>
          <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-muted)' }}>Placed {formatDate(order.createdAt)}</div>
        </div>
      </div>

      {/* Post-delivery review prompt */}
      {isDelivered && !reviewed && (
        <div style={{ margin: '0 16px 16px', padding: 16, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>How was your order?</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>Your feedback helps vendors serve you better</div>
          <button className="btn btn-primary btn-full" onClick={() => setShowReview(true)}>
            <Star size={15} /> Leave a Review
          </button>
        </div>
      )}

      {isDelivered && !reviewed && (
        <div style={{ padding: '0 16px 16px', display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-full" onClick={() => navigate('/vendors')}>Order Again</button>
          <button className="btn btn-secondary btn-full" onClick={() => navigate('/orders')}>View Orders</button>
        </div>
      )}

      {showReview && (
        <ReviewModal
          order={order}
          onClose={() => setShowReview(false)}
          onSubmit={() => { toast('Thanks for your review! ⭐', 'success'); setShowReview(false) }}
        />
      )}
    </div>
  )
}
