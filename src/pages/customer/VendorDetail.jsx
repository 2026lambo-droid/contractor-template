import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, MapPin, Clock, Phone, Heart, Share2, Search, Plus, Minus } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { useToast } from '../../contexts/ToastContext'
import { useFavorites } from '../../contexts/FavoritesContext'
import { MOCK_VENDORS, MOCK_PRODUCTS, MOCK_REVIEWS } from '../../utils/mockData'
import { MEAT_CATEGORIES, CUSTOMIZATION_OPTIONS } from '../../utils/constants'
import { formatPrice, formatRelativeTime } from '../../utils/formatters'

function unitDisplay(unit) {
  if (unit === 'tray') return 'tray'
  if (unit === 'meal') return 'meal'
  if (unit === 'each') return 'each'
  return 'lb'
}

function unitLabel(unit, qty) {
  if (unit === 'tray') return qty === 1 ? 'tray' : 'trays'
  if (unit === 'meal') return qty === 1 ? 'meal' : 'meals'
  if (unit === 'each') return qty === 1 ? 'item' : 'items'
  return `lb${qty !== 1 ? 's' : ''}`
}

function qtyLabel(unit) {
  if (unit === 'lb') return 'Pounds'
  if (unit === 'tray') return 'Trays'
  return 'Quantity'
}

function maxQty(unit) {
  if (unit === 'tray') return 10
  if (unit === 'lb') return 20
  return 50
}

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
  const [meatType, setMeatType] = useState('mixtas')
  const [showReviews, setShowReviews] = useState(false)
  const [showMixBuilder, setShowMixBuilder] = useState(false)
  const [mixQty, setMixQty] = useState({})

  const storedReviews = JSON.parse(localStorage.getItem('elrincon_reviews') || '[]').filter(r => r.vendorId === id)
  const mockReviews = MOCK_REVIEWS[id] || []
  const allReviews = [...storedReviews.map(r => ({ ...r, reviewerName: 'You' })), ...mockReviews]

  // Per-pound lb items for Mix Builder
  const perPoundItems = products.filter(p => p.category === 'per-pound' && p.unit === 'lb')
  const getMixQty = (pid) => mixQty[pid] ?? 0
  const updateMixQty = (pid, val) => setMixQty(prev => ({ ...prev, [pid]: Math.max(0, +(+val).toFixed(1)) }))
  const mixTotalLbs = perPoundItems.reduce((s, p) => s + getMixQty(p.id), 0)
  const mixTotalPrice = perPoundItems.reduce((s, p) => s + getMixQty(p.id) * p.pricePerLb, 0)

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: vendor.name, text: `Order from ${vendor.name}`, url: window.location.href }) } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast('Link copied!', 'success')
    }
  }

  if (!vendor) return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Location not found</p>
      <button className="btn btn-primary mt-16" onClick={() => navigate('/vendors')}>Back to Locations</button>
    </div>
  )

  const categories = ['all', ...new Set(products.map(p => p.category))]

  const filteredFlat = products.filter(p => {
    const catMatch = selectedCategory === 'all' || p.category === selectedCategory
    const searchMatch = !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase())
    return catMatch && searchMatch
  })

  // Group by category for the "all" view
  const filteredGroups = selectedCategory === 'all'
    ? Object.entries(
        filteredFlat.reduce((acc, p) => {
          if (!acc[p.category]) acc[p.category] = []
          acc[p.category].push(p)
          return acc
        }, {})
      ).map(([cat, prods]) => ({ cat, prods }))
    : [{ cat: selectedCategory, prods: filteredFlat }]

  const handleAdd = (product) => {
    if (!product.inStock) return
    setAddingProduct(product)
    setQuantity(product.unit === 'lb' ? 0.5 : 1)
    setMeatType('mixtas')
  }

  const confirmAdd = () => {
    const custom = {}
    if (addingProduct.options?.meatType) custom.meatType = meatType
    const added = addItem(addingProduct, quantity, custom)
    if (added !== false) {
      toast(`${quantity % 1 === 0 ? quantity : quantity.toFixed(1)} ${unitLabel(addingProduct.unit, quantity)} of ${addingProduct.name} added`, 'success')
    }
    setAddingProduct(null)
  }

  const confirmMix = () => {
    const selected = perPoundItems.filter(p => getMixQty(p.id) > 0)
    let count = 0
    selected.forEach(p => {
      const added = addItem(p, getMixQty(p.id), {})
      if (added !== false) count++
    })
    if (count > 0) {
      toast(`${mixTotalLbs % 1 === 0 ? mixTotalLbs : mixTotalLbs.toFixed(1)} lbs added to cart!`, 'success')
    }
    setShowMixBuilder(false)
    setMixQty({})
  }

  const qtyStep = addingProduct?.unit === 'lb' ? 0.5 : 1
  const qtyMin = addingProduct?.unit === 'lb' ? 0.5 : 1

  return (
    <div className="page animate-fadeIn">
      {/* Cover image */}
      <div className="vendor-cover">
        <img src={vendor.coverImage || vendor.image} alt={vendor.name} />
        <div className="vendor-cover-overlay" />
        <button onClick={() => navigate(-1)} style={{
          position: 'absolute', top: 16, left: 16,
          width: 38, height: 38, borderRadius: 10, background: 'rgba(15,10,8,0.7)',
          border: '1px solid rgba(255,255,255,0.1)',
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

      {/* Vendor info — compact */}
      <div style={{ padding: '14px 16px 10px' }}>
        <div className="row-between" style={{ marginBottom: 6 }}>
          <h1 style={{ fontSize: 19, fontWeight: 800, flex: 1, marginRight: 8 }}>{vendor.name}</h1>
          <div className="rating"><Star size={13} fill="currentColor" />{vendor.rating}<span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({vendor.reviewCount})</span></div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
          <div className="row gap-6 text-sm text-muted"><MapPin size={12} />{vendor.address}</div>
          <div className="row gap-6 text-sm text-muted"><Clock size={12} />{vendor.hours}</div>
          <div className="row gap-6 text-sm" style={{ color: 'var(--primary-light)' }}><Clock size={12} />Est. {vendor.estimatedDelivery}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="row" style={{ gap: 5, flexWrap: 'wrap', flex: 1 }}>
            {vendor.specialties.slice(0, 4).map(s => <span key={s} className="chip chip-primary" style={{ fontSize: 10 }}>{s}</span>)}
          </div>
          {allReviews.length > 0 && (
            <button onClick={() => setShowReviews(true)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 12, color: 'var(--primary-light)', fontWeight: 600, flexShrink: 0 }}>
              {allReviews.length} reviews →
            </button>
          )}
        </div>
      </div>

      {/* STICKY: Search + Category tabs */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-page)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ padding: '8px 16px 6px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input className="input" placeholder="Search menu..." value={productSearch} onChange={e => setProductSearch(e.target.value)}
              style={{ paddingLeft: 32, fontSize: 13, height: 36 }} />
          </div>
        </div>
        <div className="scroll-x" style={{ padding: '0 16px 8px', gap: 6 }}>
          {categories.map(cat => {
            const catObj = MEAT_CATEGORIES.find(c => c.id === cat)
            return (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`chip ${selectedCategory === cat ? 'chip-primary' : 'chip-muted'}`}
                style={{ cursor: 'pointer', border: 'none', flexShrink: 0, fontSize: 12 }}>
                {cat === 'all' ? '🍽️ All' : catObj ? `${catObj.emoji} ${catObj.label}` : cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Product list */}
      <div style={{ padding: '0 16px 80px' }}>
        {filteredFlat.length === 0 ? (
          <div className="empty-state" style={{ paddingTop: 48 }}>
            <div className="empty-icon">🥩</div>
            <div className="empty-title">No items found</div>
          </div>
        ) : (
          filteredGroups.map(({ cat, prods }) => (
            <div key={cat}>
              {/* Category header */}
              {selectedCategory === 'all' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 0 6px' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {MEAT_CATEGORIES.find(c => c.id === cat)?.emoji} {MEAT_CATEGORIES.find(c => c.id === cat)?.label || cat}
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>
              )}

              {/* Mix Builder CTA — shown for per-pound lb items */}
              {cat === 'per-pound' && perPoundItems.length > 1 && (
                <div style={{ margin: '4px 0 4px', padding: '12px 14px', background: 'rgba(249,156,76,0.06)', borderRadius: 10, border: '1px solid rgba(249,156,76,0.2)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>⚖️ Mix Builder</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.4 }}>
                    Order multiple meats in one cart item — Mixtas, Buche, Cueritos & more.
                  </div>
                  <button className="btn btn-gradient btn-sm btn-full" onClick={() => setShowMixBuilder(true)}>
                    🥩 Build Your Mix by the Pound
                  </button>
                </div>
              )}

              {/* Compact product rows */}
              {prods.map(p => (
                <div key={p.id} onClick={() => handleAdd(p)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0',
                    borderBottom: '1px solid var(--border)',
                    cursor: p.inStock ? 'pointer' : 'default',
                    opacity: p.inStock ? 1 : 0.55,
                  }}>
                  <div style={{ width: 62, height: 62, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.3, marginBottom: 3,
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {p.description}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="price" style={{ fontSize: 14 }}>{formatPrice(p.pricePerLb)}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>/{unitDisplay(p.unit)}</span>
                      {p.popular && <span style={{ fontSize: 10, color: 'var(--primary-light)', fontWeight: 600 }}>★ Popular</span>}
                    </div>
                  </div>
                  {!p.inStock ? (
                    <span style={{ fontSize: 11, color: 'var(--error)', flexShrink: 0 }}>Sold out</span>
                  ) : (
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Plus size={16} color="white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Reviews bottom sheet */}
      {showReviews && (
        <div className="bottom-sheet-overlay" onClick={e => e.target === e.currentTarget && setShowReviews(false)}>
          <div className="bottom-sheet" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="bottom-sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>Reviews</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Star size={16} fill="var(--warning)" color="var(--warning)" />
                <span style={{ fontSize: 16, fontWeight: 800 }}>{vendor.rating}</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>({allReviews.length})</span>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              {[5,4,3,2,1].map(n => {
                const count = allReviews.filter(r => r.rating === n).length
                const pct = allReviews.length > 0 ? (count / allReviews.length) * 100 : 0
                return (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 12, textAlign: 'right' }}>{n}</span>
                    <Star size={11} fill="var(--warning)" color="var(--warning)" />
                    <div style={{ flex: 1, height: 6, borderRadius: 100, background: 'var(--bg-surface)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'var(--warning)', borderRadius: 100 }} />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 20, textAlign: 'right' }}>{count}</span>
                  </div>
                )
              })}
            </div>
            {allReviews.map(r => (
              <div key={r.id} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
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
        <div className="bottom-sheet-overlay" onClick={e => e.target === e.currentTarget && setAddingProduct(null)}>
          <div className="bottom-sheet">
            <div className="bottom-sheet-handle" />
            <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 80, height: 80, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                <img src={addingProduct.image} alt={addingProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>{addingProduct.name}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 6 }}>
                  {addingProduct.description}
                </p>
                <span className="price" style={{ fontSize: 15 }}>{formatPrice(addingProduct.pricePerLb)}/{unitDisplay(addingProduct.unit)}</span>
              </div>
            </div>

            {/* Quantity */}
            <div className="field">
              <label className="label">{qtyLabel(addingProduct.unit)}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="qty-selector">
                  <button className="qty-btn" onClick={() => setQuantity(q => +(Math.max(qtyMin, q - qtyStep)).toFixed(1))}>−</button>
                  <span className="qty-val">{quantity % 1 === 0 ? quantity : quantity.toFixed(1)}</span>
                  <button className="qty-btn" onClick={() => setQuantity(q => +(Math.min(maxQty(addingProduct.unit), q + qtyStep)).toFixed(1))}>+</button>
                </div>
                {addingProduct.unit === 'lb' && (
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>½ lb increments</span>
                )}
              </div>
              <div style={{ marginTop: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                Subtotal: <span className="price">{formatPrice(addingProduct.pricePerLb * quantity)}</span>
              </div>
            </div>

            {/* Meat type selector */}
            {addingProduct.options?.meatType && (
              <div className="field">
                <label className="label">Meat Type</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {CUSTOMIZATION_OPTIONS.meatType.map(opt => (
                    <button key={opt.id} onClick={() => setMeatType(opt.id)} style={{
                      padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                      background: meatType === opt.id ? 'rgba(249,156,76,0.12)' : 'var(--bg-surface)',
                      border: `1.5px solid ${meatType === opt.id ? 'var(--primary)' : 'var(--border)'}`,
                      textAlign: 'left', cursor: 'pointer',
                    }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{opt.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{opt.description}</div>
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

      {/* Mix Builder bottom sheet */}
      {showMixBuilder && (
        <div className="bottom-sheet-overlay" onClick={e => e.target === e.currentTarget && setShowMixBuilder(false)}>
          <div className="bottom-sheet" style={{ maxHeight: '88vh', overflowY: 'auto' }}>
            <div className="bottom-sheet-handle" />
            <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>🥩 Build Your Mix</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.4 }}>
              Choose any combination of meats by the pound. Minimum ½ lb per type.
            </p>

            {perPoundItems.map(p => (
              <div key={p.id} style={{ paddingBottom: 14, marginBottom: 14, borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.3, marginBottom: 6 }}>
                      {p.description.length > 80 ? p.description.slice(0, 80) + '…' : p.description}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary-light)' }}>{formatPrice(p.pricePerLb)}/lb</span>
                        {getMixQty(p.id) > 0 && (
                          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>
                            = {formatPrice(getMixQty(p.id) * p.pricePerLb)}
                          </span>
                        )}
                      </div>
                      <div className="qty-selector" style={{ flexShrink: 0 }}>
                        <button className="qty-btn" onClick={() => updateMixQty(p.id, getMixQty(p.id) - 0.5)}>−</button>
                        <span className="qty-val" style={{ minWidth: 28 }}>
                          {getMixQty(p.id) % 1 === 0 ? getMixQty(p.id) : getMixQty(p.id).toFixed(1)}
                        </span>
                        <button className="qty-btn" onClick={() => updateMixQty(p.id, getMixQty(p.id) + 0.5)}>+</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ padding: '10px 0 4px', borderTop: '2px solid var(--border)' }}>
              <div className="row-between" style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  {mixTotalLbs > 0
                    ? `${mixTotalLbs % 1 === 0 ? mixTotalLbs : mixTotalLbs.toFixed(1)} lb${mixTotalLbs !== 1 ? 's' : ''} selected`
                    : 'Nothing selected yet'}
                </span>
                {mixTotalPrice > 0 && <span className="price" style={{ fontSize: 17 }}>{formatPrice(mixTotalPrice)}</span>}
              </div>
              <button
                className="btn btn-gradient btn-full btn-lg"
                disabled={mixTotalLbs === 0}
                style={{ opacity: mixTotalLbs > 0 ? 1 : 0.4 }}
                onClick={confirmMix}>
                {mixTotalLbs > 0
                  ? `Add ${mixTotalLbs % 1 === 0 ? mixTotalLbs : mixTotalLbs.toFixed(1)} lbs to Cart · ${formatPrice(mixTotalPrice)}`
                  : 'Select at least ½ lb to continue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
