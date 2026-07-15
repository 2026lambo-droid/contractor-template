import { Trash2 } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { formatPrice, formatLbs } from '../../utils/formatters'
import { QuantitySelector } from './ProductCard'

export function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()
  const { key, product, quantity, customizations } = item
  const total = product.pricePerLb * quantity

  const unitSuffix = product.unit === 'tray' ? 'tray' : product.unit === 'meal' ? 'meal' : product.unit === 'each' ? 'each' : 'lb'
  const qtyDisplay = product.unit === 'lb'
    ? `${quantity % 1 === 0 ? quantity : quantity.toFixed(1)} lb${quantity !== 1 ? 's' : ''}`
    : `${quantity} ${unitSuffix}${quantity !== 1 ? 's' : ''}`

  const qtyStep = product.unit === 'lb' ? 0.5 : 1
  const qtyMin = product.unit === 'lb' ? 0.5 : 1

  return (
    <div style={{ display: 'flex', gap: 12, padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ width: 72, height: 72, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="row-between" style={{ marginBottom: 4 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700 }}>{product.name}</h4>
          <button onClick={() => removeItem(key)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
            <Trash2 size={15} />
          </button>
        </div>
        {customizations.meatType && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
            {customizations.meatType.charAt(0).toUpperCase() + customizations.meatType.slice(1).replace('-', ' ')}
          </div>
        )}
        <div className="row-between">
          <QuantitySelector
            value={quantity}
            onChange={(q) => updateQuantity(key, q)}
            step={qtyStep}
            min={qtyMin}
          />
          <div style={{ textAlign: 'right' }}>
            <div className="price" style={{ fontSize: 15 }}>{formatPrice(total)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatPrice(product.pricePerLb)}/{unitSuffix} × {qtyDisplay}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
