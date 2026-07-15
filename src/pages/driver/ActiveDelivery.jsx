import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Phone, Navigation, CheckCircle, MapPin, Package } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { useToast } from '../../contexts/ToastContext'
import { MOCK_DRIVER_DELIVERIES } from '../../utils/mockData'
import { updateOrderStatus } from '../../services/orderBus'

const STEP_TO_ORDER_STATUS = ['confirmed', 'ready', 'picked_up', 'delivered']

const DELIVERY_STEPS = [
  { id: 'heading_to_vendor', label: 'Heading to Vendor', desc: 'Navigate to the pickup location', icon: '🚗' },
  { id: 'at_vendor', label: 'At Vendor', desc: 'Pick up the order', icon: '📍' },
  { id: 'heading_to_customer', label: 'Out for Delivery', desc: 'Delivering to customer', icon: '🏃' },
  { id: 'delivered', label: 'Delivered', desc: 'Order handed to customer', icon: '✅' },
]

export function ActiveDelivery() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()

  const delivery = location.state?.delivery || MOCK_DRIVER_DELIVERIES[0]
  const [step, setStep] = useState(0)
  const [delivered, setDelivered] = useState(false)

  const advance = () => {
    if (step < DELIVERY_STEPS.length - 1) {
      const nextStep = step + 1
      setStep(nextStep)
      toast(DELIVERY_STEPS[nextStep].label, 'success')
      const orderStatus = STEP_TO_ORDER_STATUS[nextStep]
      if (orderStatus && delivery?.orderId) {
        updateOrderStatus(delivery.orderId, delivery.vendorId || 'v1', orderStatus)
      }
    } else {
      setDelivered(true)
      if (delivery?.orderId) {
        updateOrderStatus(delivery.orderId, delivery.vendorId || 'v1', 'delivered')
      }
      toast('Delivery completed! 🎉 +$' + (delivery?.earning || 9.50), 'success')
    }
  }

  if (delivered) return (
    <div className="page-no-nav animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 80, marginBottom: 20 }}>🎉</div>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Delivery Complete!</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Great job! You earned</p>
      <div className="price" style={{ fontSize: 48, marginBottom: 32 }}>+${delivery?.earning || 9.50}</div>
      <button className="btn btn-gradient btn-full btn-lg" onClick={() => navigate('/driver/dashboard')}>
        Find Next Delivery
      </button>
    </div>
  )

  const current = DELIVERY_STEPS[step]

  return (
    <div className="page animate-fadeIn">
      <AppHeader title="Active Delivery" back />

      {/* Status banner */}
      <div style={{ margin: 16, padding: '16px', background: 'rgba(249,156,76,0.08)', borderRadius: 'var(--radius)', border: '1px solid rgba(249,156,76,0.2)', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>{current.icon}</div>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{current.label}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{current.desc}</div>
      </div>

      {/* Map */}
      <div style={{ margin: '0 16px 16px' }}>
        <div className="map-placeholder">
          <span style={{ fontSize: 40 }}>🗺️</span>
          <span style={{ fontWeight: 600 }}>Navigation</span>
          <span style={{ fontSize: 11 }}>Google Maps / Waze integration</span>
          <button className="btn btn-primary btn-sm mt-8">
            <Navigation size={14} /> Open in Maps
          </button>
        </div>
      </div>

      {/* Pickup / Dropoff */}
      <div style={{ margin: '0 16px 16px' }}>
        <div className="card">
          <div style={{ padding: '14px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(249,156,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Package size={16} style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 2 }}>Pickup</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{delivery?.vendorName || 'La Carnicería El Rancho'}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{delivery?.vendorAddress || '1420 Story Rd, San Jose, CA'}</div>
              </div>
            </div>
          </div>
          <div style={{ padding: '14px' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={16} style={{ color: 'var(--success)' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 2 }}>Dropoff</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{delivery?.customerName || 'Maria García'}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{delivery?.customerAddress || '500 El Camino Real, San Jose, CA'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order details */}
      <div style={{ margin: '0 16px 16px', padding: 14, background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Order Contents</div>
        <div style={{ fontSize: 14 }}>{delivery?.items || '3 lbs Carne Asada + 1 lb Chorizo'}</div>
        <div style={{ marginTop: 8, fontSize: 13, color: 'var(--primary-light)', fontWeight: 700 }}>
          Your earnings: {delivery?.earning ? `$${delivery.earning}` : '$9.50'}
        </div>
      </div>

      {/* Customer contact */}
      <div style={{ margin: '0 16px 16px', padding: 14, background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Customer</div>
          <div style={{ fontWeight: 700 }}>{delivery?.customerName || 'Maria García'}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{delivery?.customerPhone || '(408) 555-0199'}</div>
        </div>
        <button className="btn btn-secondary btn-sm">
          <Phone size={15} /> Call
        </button>
      </div>

      {/* Progress steps */}
      <div style={{ margin: '0 16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          {DELIVERY_STEPS.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', marginBottom: 4,
                background: i < step ? 'var(--success)' : i === step ? 'var(--primary)' : 'var(--bg-surface)',
                border: `2px solid ${i < step ? 'var(--success)' : i === step ? 'var(--primary)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 9, color: i <= step ? 'var(--text-secondary)' : 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3, fontWeight: i === step ? 700 : 400 }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action button */}
      <div style={{ padding: '0 16px' }}>
        <button className="btn btn-gradient btn-full btn-lg" onClick={advance}>
          {step === DELIVERY_STEPS.length - 1 ? '✓ Mark as Delivered' : `Next: ${DELIVERY_STEPS[step + 1]?.label}`}
        </button>
      </div>
    </div>
  )
}
