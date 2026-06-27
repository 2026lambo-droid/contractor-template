import { Plus, Minus } from 'lucide-react'
import { formatPrice } from '../../utils/formatters'

export function ProductCard({ product, onAdd }) {
  return (
    <div className="card" style={{ display: 'flex', gap: 12, padding: 14, marginBottom: 10 }}>
      <div style={{ width: 90, height: 90, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="row-between" style={{ marginBottom: 4 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700 }}>{product.name}</h4>
          {product.popular && <span className="chip chip-primary" style={{ fontSize: 10, padding: '3px 7px' }}>Popular</span>}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.4 }}>
          {product.description.slice(0, 70)}...
        </p>
        <div className="row-between">
          <div>
            <span className="price" style={{ fontSize: 15 }}>{formatPrice(product.pricePerLb)}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}> / lb</span>
          </div>
          {!product.inStock ? (
            <span className="chip chip-error" style={{ fontSize: 11 }}>Out of Stock</span>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => onAdd(product)} style={{ padding: '8px 14px', fontSize: 12, gap: 4 }}>
              <Plus size={14} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function QuantitySelector({ value, onChange, min = 1, max = 20 }) {
  return (
    <div className="qty-selector">
      <button className="qty-btn" onClick={() => onChange(Math.max(min, value - 1))}>−</button>
      <span className="qty-val">{value}</span>
      <button className="qty-btn" onClick={() => onChange(Math.min(max, value + 1))}>+</button>
    </div>
  )
}
