import { Trash2 } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { formatPrice, formatLbs } from '../../utils/formatters'
import { QuantitySelector } from './ProductCard'

export function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()
  const { key, product, quantity, customizations } = item
  const total = product.pricePerLb * quantity

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
        {(customizations.marinade || customizations.cut) && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>
            {customizations.marinade && `${customizations.marinade}`}
            {customizations.marinade && customizations.cut && ' · '}
            {customizations.cut && `${customizations.cut} cut`}
          </div>
        )}
        <div className="row-between">
          <QuantitySelector value={quantity} onChange={(q) => updateQuantity(key, q)} />
          <div style={{ textAlign: 'right' }}>
            <div className="price" style={{ fontSize: 15 }}>{formatPrice(total)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatPrice(product.pricePerLb)}/lb × {formatLbs(quantity)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
