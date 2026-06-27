import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, MapPin, Clock, Phone, ShoppingCart } from 'lucide-react'
import { ProductCard } from '../../components/customer/ProductCard'
import { useCart } from '../../contexts/CartContext'
import { useToast } from '../../contexts/ToastContext'
import { MOCK_VENDORS, MOCK_PRODUCTS } from '../../utils/mockData'
import { MEAT_CATEGORIES, CUSTOMIZATION_OPTIONS } from '../../utils/constants'
import { formatPrice } from '../../utils/formatters'

export function VendorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, itemCount, subtotal } = useCart()
  const { toast } = useToast()

  const vendor = MOCK_VENDORS.find(v => v.id === id)
  const products = MOCK_PRODUCTS[id] || []

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [addingProduct, setAddingProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [marinade, setMarinade] = useState('traditional')
  const [cut, setCut] = useState('thin')

  if (!vendor) return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Vendor not found</p>
      <button className="btn btn-primary mt-16" onClick={() => navigate('/vendors')}>Back to Vendors</button>
    </div>
  )

  const categories = ['all', ...new Set(products.map(p => p.category))]
  const filtered = selectedCategory === 'all' ? products : products.filter(p => p.category === selectedCategory)

  const handleAdd = (product) => {
    if (!product.inStock) return
    setAddingProduct(product)
    setQuantity(1)
    setMarinade('traditional')
    setCut('thin')
  }

  const confirmAdd = () => {
    const custom = {}
    if (addingProduct.options?.marinade) custom.marinade = marinade
    if (addingProduct.options?.cut) custom.cut = cut
    const added = addItem(addingProduct, quantity, custom)
    if (added !== false) {
      toast(`Added ${quantity} lb ${addingProduct.name} to cart`, 'success')
    }
    setAddingProduct(null)
  }

  return (
    <div className="page animate-fadeIn">
      {/* Cover image */}
      <div className="vendor-cover">
        <img src={vendor.coverImage || vendor.image} alt={vendor.name} />
        <div className="vendor-cover-overlay" />
        <button onClick={() => navigate(-1)} style={{
          position: 'absolute', top: 16, left: 16,
          width: 38, height: 38, borderRadius: 10, background: 'rgba(15,10,8,0.7)', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer',
        }}>
          <ArrowLeft size={18} />
        </button>
        {!vendor.isOpen && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="chip chip-error" style={{ fontSize: 14 }}>Currently Closed</span>
          </div>
        )}
      </div>

      {/* Vendor info */}
      <div style={{ padding: '16px 16px 0' }}>
        <div className="row-between" style={{ marginBottom: 8 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, flex: 1, marginRight: 8 }}>{vendor.name}</h1>
          <div className="rating"><Star size={14} fill="currentColor" />{vendor.rating}<span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({vendor.reviewCount})</span></div>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>{vendor.description}</p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
          <div className="row gap-6 text-sm text-muted"><MapPin size={13} />{vendor.address}</div>
          <div className="row gap-6 text-sm text-muted"><Clock size={13} />{vendor.hours}</div>
          <div className="row gap-6 text-sm text-muted"><Phone size={13} />{vendor.phone}</div>
          <div className="row gap-6 text-sm" style={{ color: 'var(--primary-light)' }}><Clock size={13} />Est. {vendor.estimatedDelivery}</div>
        </div>

        <div className="row" style={{ gap: 6, flexWrap: 'wrap', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
          {vendor.specialties.map(s => <span key={s} className="chip chip-primary" style={{ fontSize: 11 }}>{s}</span>)}
        </div>
      </div>

      {/* Category filter */}
      <div className="scroll-x" style={{ padding: '12px 16px', marginBottom: 0 }}>
        {categories.map(cat => {
          const catObj = MEAT_CATEGORIES.find(c => c.id === cat)
          return (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`chip ${selectedCategory === cat ? 'chip-primary' : 'chip-muted'}`} style={{ cursor: 'pointer', border: 'none' }}>
              {catObj ? `${catObj.emoji} ${catObj.label}` : 'All Items'}
            </button>
          )
        })}
      </div>

      {/* Products */}
      <div style={{ padding: '8px 16px' }}>
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">🥩</div><div className="empty-title">No items found</div></div>
        ) : filtered.map(p => <ProductCard key={p.id} product={p} onAdd={handleAdd} />)}
      </div>

      {/* Cart bar */}
      {itemCount > 0 && (
        <div style={{ position: 'fixed', bottom: 'calc(var(--bottom-nav-h) + var(--safe-bottom) + 12px)', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', maxWidth: 400, zIndex: 100 }}>
          <button className="btn btn-gradient btn-full" onClick={() => navigate('/cart')} style={{ boxShadow: 'var(--shadow-lg)', borderRadius: 16 }}>
            <ShoppingCart size={18} />
            View Cart ({itemCount} items) · {formatPrice(subtotal)}
          </button>
        </div>
      )}

      {/* Add item bottom sheet */}
      {addingProduct && (
        <div className="bottom-sheet-overlay" onClick={(e) => e.target === e.currentTarget && setAddingProduct(null)}>
          <div className="bottom-sheet">
            <div className="bottom-sheet-handle" />
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 80, height: 80, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                <img src={addingProduct.image} alt={addingProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{addingProduct.name}</h3>
                <span className="price" style={{ fontSize: 15 }}>{formatPrice(addingProduct.pricePerLb)}/lb</span>
              </div>
            </div>

            {/* Quantity */}
            <div className="field">
              <label className="label">Quantity (pounds)</label>
              <div className="qty-selector" style={{ width: 'fit-content' }}>
                <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span className="qty-val">{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(q => Math.min(20, q + 1))}>+</button>
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                Subtotal: {formatPrice(addingProduct.pricePerLb * quantity)}
              </div>
            </div>

            {/* Marinade option */}
            {addingProduct.options?.marinade && (
              <div className="field">
                <label className="label">Marinade</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {CUSTOMIZATION_OPTIONS.marinade.map(opt => (
                    <button key={opt.id} onClick={() => setMarinade(opt.id)} style={{
                      padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                      background: marinade === opt.id ? 'rgba(232,93,4,0.12)' : 'var(--bg-surface)',
                      border: `1.5px solid ${marinade === opt.id ? 'var(--primary)' : 'var(--border)'}`,
                      textAlign: 'left', cursor: 'pointer',
                    }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{opt.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{opt.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cut option */}
            {addingProduct.options?.cut && (
              <div className="field">
                <label className="label">Cut Style</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {CUSTOMIZATION_OPTIONS.cut.map(opt => (
                    <button key={opt.id} onClick={() => setCut(opt.id)} style={{
                      flex: 1, padding: '10px 8px', borderRadius: 'var(--radius-sm)', textAlign: 'center',
                      background: cut === opt.id ? 'rgba(232,93,4,0.12)' : 'var(--bg-surface)',
                      border: `1.5px solid ${cut === opt.id ? 'var(--primary)' : 'var(--border)'}`,
                      cursor: 'pointer',
                    }}>
                      <div style={{ fontWeight: 600, fontSize: 12 }}>{opt.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button className="btn btn-gradient btn-full btn-lg mt-8" onClick={confirmAdd}>
              Add to Cart · {formatPrice(addingProduct.pricePerLb * quantity)}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
