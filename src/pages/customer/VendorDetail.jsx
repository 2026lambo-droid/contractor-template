import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, MapPin, Clock, Phone, Heart, Share2, Search } from 'lucide-react'
import { ProductCard } from '../../components/customer/ProductCard'
import { useCart } from '../../contexts/CartContext'
import { useToast } from '../../contexts/ToastContext'
import { useFavorites } from '../../contexts/FavoritesContext'
import { MOCK_VENDORS, MOCK_PRODUCTS, MOCK_REVIEWS } from '../../utils/mockData'
import { MEAT_CATEGORIES, CUSTOMIZATION_OPTIONS } from '../../utils/constants'
import { formatPrice, formatRelativeTime } from '../../utils/formatters'

export function VendorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { toast } = useToast()

  const { isFavorite, toggle: toggleFav } = useFavorites()
  const vendor = MOCK_VENDORS.find(v => v.id === id)
  const products = MOCK_PRODUCTS[id] || []
  const fav = vendor ? isFavorite(vendor.id) : false

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [productSearch, setProductSearch] = useState('')
  const [addingProduct, setAddingProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [marinade, setMarinade] = useState('traditional')
  const [cut, setCut] = useState('thin')
  const [showReviews, setShowReviews] = useState(false)

  const storedReviews = JSON.parse(localStorage.getItem('carnemx_reviews') || '[]').filter(r => r.vendorId === id)
  const mockReviews = MOCK_REVIEWS[id] || []
  const allReviews = [...storedReviews.map(r => ({ ...r, reviewerName: 'You' })), ...mockReviews]

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: vendor.name, text: `Check out ${vendor.name} on CarneMX — fresh meats delivered!`, url: window.location.href })
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast('Link copied!', 'success')
    }
  }

  if (!vendor) return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Vendor not found</p>
      <button className="btn btn-primary mt-16" onClick={() => navigate('/vendors')}>Back to Vendors</button>
    </div>
  )

  const categories = ['all', ...new Set(products.map(p => p.category))]
  const filtered = products.filter(p => {
    const catMatch = selectedCategory === 'all' || p.category === selectedCategory
    const searchMatch = !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.description.toLowerCase().includes(productSearch.toLowerCase())
    return catMatch && searchMatch
  })

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
      toast(`Added ${quantity} ${addingProduct.unit === 'tray' ? (quantity === 1 ? 'tray' : 'trays') : 'lb'} of ${addingProduct.name} to cart`, 'success')
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
        <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
          <button onClick={handleShare} style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(15,10,8,0.7)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Share2 size={16} color="rgba(255,255,255,0.8)" />
          </button>
          <button onClick={() => toggleFav(vendor.id)} style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(15,10,8,0.7)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Heart size={18} fill={fav ? '#ef4444' : 'transparent'} color={fav ? '#ef4444' : 'rgba(255,255,255,0.8)'} />
          </button>
        </div>
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
        {allReviews.length > 0 && (
          <button onClick={() => setShowReviews(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', padding: '0 0 12px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', gap: 1 }}>
              {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= Math.round(vendor.rating) ? 'var(--warning)' : 'transparent'} color={s <= Math.round(vendor.rating) ? 'var(--warning)' : 'var(--border)'} />)}
            </div>
            <span style={{ fontSize: 13, color: 'var(--primary-light)', fontWeight: 600 }}>{allReviews.length} reviews</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>→</span>
          </button>
        )}

        <div className="row" style={{ gap: 6, flexWrap: 'wrap', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
          {vendor.specialties.map(s => <span key={s} className="chip chip-primary" style={{ fontSize: 11 }}>{s}</span>)}
        </div>
      </div>

      {/* Product search */}
      <div style={{ padding: '10px 16px 0' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input className="input" placeholder="Search products..." value={productSearch} onChange={e => setProductSearch(e.target.value)} style={{ paddingLeft: 36, fontSize: 13 }} />
        </div>
      </div>

      {/* Category filter */}
      <div className="scroll-x" style={{ padding: '10px 16px', marginBottom: 0 }}>
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

      {/* Reviews sheet */}
      {showReviews && (
        <div className="bottom-sheet-overlay" onClick={e => e.target === e.currentTarget && setShowReviews(false)}>
          <div className="bottom-sheet" style={{ maxHeight: '80vh', overflow: 'auto' }}>
            <div className="bottom-sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>Reviews</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Star size={16} fill="var(--warning)" color="var(--warning)" />
                <span style={{ fontSize: 16, fontWeight: 800 }}>{vendor.rating}</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>({allReviews.length})</span>
              </div>
            </div>

            {/* Star breakdown */}
            <div style={{ marginBottom: 20 }}>
              {[5,4,3,2,1].map(n => {
                const count = allReviews.filter(r => r.rating === n).length
                const pct = allReviews.length > 0 ? (count / allReviews.length) * 100 : 0
                return (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 12, textAlign: 'right' }}>{n}</span>
                    <Star size={11} fill="var(--warning)" color="var(--warning)" />
                    <div style={{ flex: 1, height: 6, borderRadius: 100, background: 'var(--bg-surface)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'var(--warning)', borderRadius: 100, transition: 'width 0.3s' }} />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 20, textAlign: 'right' }}>{count}</span>
                  </div>
                )
              })}
            </div>

            {/* Individual reviews */}
            {allReviews.map(r => (
              <div key={r.id} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{r.reviewerName}</span>
                    <div style={{ display: 'flex', gap: 2, marginTop: 3 }}>
                      {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= r.rating ? 'var(--warning)' : 'transparent'} color={s <= r.rating ? 'var(--warning)' : 'var(--border)'} />)}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatRelativeTime(new Date(r.createdAt))}</span>
                </div>
                {r.text && <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.text}</p>}
              </div>
            ))}

            <button className="btn btn-secondary btn-full" onClick={() => setShowReviews(false)}>Close</button>
          </div>
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
                <span className="price" style={{ fontSize: 15 }}>{formatPrice(addingProduct.pricePerLb)}/{addingProduct.unit === 'tray' ? 'tray' : 'lb'}</span>
              </div>
            </div>

            {/* Quantity */}
            <div className="field">
              <label className="label">{addingProduct.unit === 'tray' ? 'Quantity (trays)' : 'Quantity (pounds)'}</label>
              <div className="qty-selector" style={{ width: 'fit-content' }}>
                <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span className="qty-val">{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(q => Math.min(addingProduct.unit === 'tray' ? 10 : 20, q + 1))}>+</button>
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
