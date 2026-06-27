import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { CartItem } from '../../components/customer/CartItem'
import { useCart } from '../../contexts/CartContext'
import { MOCK_VENDORS } from '../../utils/mockData'
import { formatPrice, calcServiceFee, calcTotal } from '../../utils/formatters'
import { DELIVERY_FEE } from '../../utils/constants'

export function Cart() {
  const { items, subtotal, clearCart, vendorId } = useCart()
  const navigate = useNavigate()
  const vendor = MOCK_VENDORS.find(v => v.id === vendorId)

  const serviceFee = calcServiceFee(subtotal)
  const total = calcTotal(subtotal)

  if (items.length === 0) return (
    <div className="page animate-fadeIn">
      <AppHeader title="Your Cart" back />
      <div className="empty-state">
        <div className="empty-icon"><ShoppingCart size={56} color="var(--text-muted)" /></div>
        <div className="empty-title">Your cart is empty</div>
        <div className="empty-desc">Browse vendors and add some delicious carne asada!</div>
        <button className="btn btn-primary mt-16" onClick={() => navigate('/vendors')}>Browse Vendors</button>
      </div>
    </div>
  )

  return (
    <div className="page animate-fadeIn">
      <AppHeader title="Your Cart" back actions={
        <button className="btn btn-ghost btn-sm" onClick={clearCart} style={{ color: 'var(--error)', fontSize: 13 }}>
          <Trash2 size={14} /> Clear
        </button>
      } />

      {/* Vendor info */}
      {vendor && (
        <div style={{ margin: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border)' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden' }}>
            <img src={vendor.image} alt={vendor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{vendor.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Est. {vendor.estimatedDelivery}</div>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="card" style={{ margin: '0 16px 16px' }}>
        {items.map(item => <CartItem key={item.key} item={item} />)}
      </div>

      {/* Order summary */}
      <div className="card" style={{ margin: '0 16px 16px', padding: 16 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>Order Summary</h3>
        <div className="row-between" style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Subtotal</span>
          <span style={{ fontSize: 14 }}>{formatPrice(subtotal)}</span>
        </div>
        <div className="row-between" style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Service fee (5%)</span>
          <span style={{ fontSize: 14 }}>{formatPrice(serviceFee)}</span>
        </div>
        <div className="row-between" style={{ marginBottom: 14 }}>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Delivery fee</span>
          <span style={{ fontSize: 14 }}>{formatPrice(DELIVERY_FEE)}</span>
        </div>
        <div className="divider" style={{ margin: '0 0 14px' }} />
        <div className="row-between">
          <span style={{ fontSize: 17, fontWeight: 800 }}>Total</span>
          <span className="price" style={{ fontSize: 20 }}>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Delivery note */}
      <div style={{ margin: '0 16px 20px', padding: '10px 14px', background: 'rgba(232,93,4,0.08)', borderRadius: 10, border: '1px solid rgba(232,93,4,0.2)' }}>
        <p style={{ fontSize: 12, color: 'var(--primary-light)', lineHeight: 1.5 }}>
          🔥 Orders are delivered fresh by our own driver fleet. Estimated time: {vendor?.estimatedDelivery || '35–50 min'}
        </p>
      </div>

      {/* Checkout button */}
      <div style={{ padding: '0 16px' }}>
        <button className="btn btn-gradient btn-full btn-lg" onClick={() => navigate('/checkout')}>
          Proceed to Checkout · {formatPrice(total)}
        </button>
      </div>
    </div>
  )
}
