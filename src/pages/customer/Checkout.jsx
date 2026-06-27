import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, MapPin, ChevronRight, Lock } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { formatPrice, calcServiceFee, calcTotal } from '../../utils/formatters'
import { DELIVERY_FEE } from '../../utils/constants'

const SAVED_CARDS = [
  { id: 'c1', brand: 'Visa', last4: '4242', exp: '12/27' },
  { id: 'c2', brand: 'Mastercard', last4: '5555', exp: '08/26' },
]

export function Checkout() {
  const { items, subtotal, vendorId, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [address, setAddress] = useState(user?.address || '')
  const [selectedCard, setSelectedCard] = useState('c1')
  const [tip, setTip] = useState(0)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const tips = [0, 2, 4, 5]
  const serviceFee = calcServiceFee(subtotal)
  const total = calcTotal(subtotal) + tip

  const handleOrder = async () => {
    if (!address.trim()) { toast('Please enter a delivery address', 'error'); return }
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 1500))
      const orderId = `ord-${Date.now()}`
      const order = {
        id: orderId,
        customerId: user.id,
        vendorId,
        items: items.map(i => ({ productId: i.product.id, name: i.product.name, pricePerLb: i.product.pricePerLb, quantity: i.quantity, ...i.customizations })),
        subtotal, serviceFee, deliveryFee: DELIVERY_FEE, tip, total,
        address, note,
        status: 'pending',
        createdAt: new Date(),
        paymentMethod: 'card',
        paymentLast4: SAVED_CARDS.find(c => c.id === selectedCard)?.last4,
      }
      const existing = JSON.parse(localStorage.getItem('carnemx_orders') || '[]')
      localStorage.setItem('carnemx_orders', JSON.stringify([order, ...existing]))
      clearCart()
      toast('Order placed! 🎉', 'success')
      navigate(`/orders/${orderId}`, { replace: true })
    } catch (err) {
      toast('Payment failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page animate-fadeIn">
      <AppHeader title="Checkout" back />

      {/* Delivery address */}
      <div style={{ padding: '16px 16px 0' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
          <MapPin size={15} style={{ display: 'inline', marginRight: 6, color: 'var(--primary)' }} />
          Delivery Address
        </h3>
        <textarea
          className="input"
          rows={2}
          placeholder="Enter your full delivery address..."
          value={address}
          onChange={e => setAddress(e.target.value)}
          style={{ resize: 'none', lineHeight: 1.5 }}
        />
      </div>

      {/* Payment */}
      <div style={{ padding: '16px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
          <CreditCard size={15} style={{ display: 'inline', marginRight: 6, color: 'var(--primary)' }} />
          Payment Method
        </h3>
        <div className="card" style={{ marginBottom: 8 }}>
          {SAVED_CARDS.map(card => (
            <div key={card.id} onClick={() => setSelectedCard(card.id)} className="list-item" style={{ cursor: 'pointer' }}>
              <div style={{ width: 36, height: 24, background: 'var(--bg-surface)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--primary-light)', border: '1px solid var(--border)' }}>
                {card.brand === 'Visa' ? 'VISA' : 'MC'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>•••• {card.last4}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Expires {card.exp}</div>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selectedCard === card.id ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedCard === card.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)' }} />}
              </div>
            </div>
          ))}
          <div className="list-item" style={{ color: 'var(--primary)', fontSize: 14, fontWeight: 600 }}>
            <CreditCard size={16} />
            Add new card
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 0' }}>
          <Lock size={12} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Powered by Stripe · PCI-DSS compliant</span>
        </div>
      </div>

      {/* Tip */}
      <div style={{ padding: '0 16px 16px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Driver Tip</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          {tips.map(t => (
            <button key={t} onClick={() => setTip(t)} style={{
              flex: 1, padding: '10px 6px', borderRadius: 'var(--radius-sm)', textAlign: 'center',
              background: tip === t ? 'rgba(232,93,4,0.12)' : 'var(--bg-surface)',
              border: `1.5px solid ${tip === t ? 'var(--primary)' : 'var(--border)'}`,
              fontSize: 13, fontWeight: 600, color: tip === t ? 'var(--primary-light)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}>
              {t === 0 ? 'No tip' : `$${t}`}
            </button>
          ))}
        </div>
      </div>

      {/* Note */}
      <div style={{ padding: '0 16px 16px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Special Instructions</h3>
        <textarea
          className="input"
          rows={2}
          placeholder="Any special requests? (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
          style={{ resize: 'none', lineHeight: 1.5 }}
        />
      </div>

      {/* Order summary */}
      <div style={{ margin: '0 16px 20px', padding: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
        <div className="row-between" style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Subtotal</span>
          <span style={{ fontSize: 14 }}>{formatPrice(subtotal)}</span>
        </div>
        <div className="row-between" style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Service fee</span>
          <span style={{ fontSize: 14 }}>{formatPrice(serviceFee)}</span>
        </div>
        <div className="row-between" style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Delivery</span>
          <span style={{ fontSize: 14 }}>{formatPrice(DELIVERY_FEE)}</span>
        </div>
        {tip > 0 && (
          <div className="row-between" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Driver tip</span>
            <span style={{ fontSize: 14 }}>{formatPrice(tip)}</span>
          </div>
        )}
        <div className="divider" style={{ margin: '10px 0' }} />
        <div className="row-between">
          <span style={{ fontSize: 17, fontWeight: 800 }}>Total</span>
          <span className="price" style={{ fontSize: 20 }}>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Place order */}
      <div style={{ padding: '0 16px' }}>
        <button className="btn btn-gradient btn-full btn-lg" onClick={handleOrder} disabled={loading}>
          {loading ? (
            <><span className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> Processing...</>
          ) : (
            `Place Order · ${formatPrice(total)}`
          )}
        </button>
        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
          By placing your order you agree to our Terms of Service
        </p>
      </div>
    </div>
  )
}
