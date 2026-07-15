import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, MapPin, Clock, Phone, Heart, Share2, Search, Plus, ChevronRight } from 'lucide-react'
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
  const allReviews = [...storedReviews.map(r => ({ ...r, reviewerName: 'You' })), ...(MOCK_REVIEWS[id] || [])]

  const perPoundItems = products.filter(p => p.category === 'per-pound' && p.unit === 'lb')
  const getMixQty = (pid) => mixQty[pid] ?? 0
  const updateMixQty = (pid, val) => setMixQty(prev => ({ ...prev, [pid]: Math.max(0, +(+val).toFixed(1)) }))
  const mixTotalLbs = perPoundItems.reduce((s, p) => s + getMixQty(p.id), 0)
  const mixTotalPrice = perPoundItems.reduce((s, p) => s + getMixQty(p.id) * p.pricePerLb, 0)

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: vendor.name, url: window.location.href }) } catch {}
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

  // Build renderable rows: either a {type:'header'} or {type:'product'}
  const renderRows = []
  if (selectedCategory === 'all' && !productSearch) {
    const grouped = {}
    filteredFlat.forEach(p => {
      if (!grouped[p.category]) grouped[p.category] = []
      grouped[p.category].push(p)
    })
    Object.entries(grouped).forEach(([cat, prods]) => {
      const catMeta = MEAT_CATEGORIES.find(c => c.id === cat)
      renderRows.push({ type: 'header', cat, label: catMeta ? `${catMeta.emoji} ${catMeta.label}` : cat })
      prods.forEach(p => renderRows.push({ type: 'product', product: p }))
    })
  } else {
    filteredFlat.forEach(p => renderRows.push({ type: 'product', product: p }))
  }

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
    if (added !== false) toast(`${addingProduct.name} added to cart`, 'success')
    setAddingProduct(null)
  }

  const confirmMix = () => {
    const selected = perPoundItems.filter(p => getMixQty(p.id) > 0)
    let count = 0
    selected.forEach(p => { if (addItem(p, getMixQty(p.id), {}) !== false) count++ })
    if (count > 0) toast(`${mixTotalLbs % 1 === 0 ? mixTotalLbs : mixTotalLbs.toFixed(1)} lbs added!`, 'success')
    setShowMixBuilder(false)
    setMixQty({})
  }

  const qtyStep = addingProduct?.unit === 'lb' ? 0.5 : 1
  const qtyMin = addingProduct?.unit === 'lb' ? 0.5 : 1

  return (
    <div className="page animate-fadeIn" style={{ paddingBottom: 0 }}>

      {/* ── Clean header (Domino's style — no big cover image) ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'var(--bg-page, var(--bg))',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px 8px' }}>
          <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <ArrowLeft size={17} />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vendor.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 1 }}>
              <span className="rating" style={{ fontSize: 12 }}><Star size={11} fill="currentColor" />{vendor.rating}</span>
              <span style={{ fontSize: 12, color: vendor.isOpen ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
                {vendor.isOpen ? '● Open' : '● Closed'}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>· {vendor.estimatedDelivery}</span>
            </div>
          </div>
          <button onClick={handleShare} style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Share2 size={15} />
          </button>
          <button onClick={() => toggleFav(vendor.id)} style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Heart size={15} fill={fav ? '#ef4444' : 'transparent'} color={fav ? '#ef4444' : 'currentColor'} />
          </button>
        </div>

        {/* Info strip */}
        <div style={{ display: 'flex', gap: 16, padding: '0 16px 8px', overflowX: 'auto' }}>
          <button onClick={() => setShowReviews(true)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: 'var(--primary-light)', fontWeight: 600 }}>{allReviews.length} reviews →</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <MapPin size={11} color="var(--text-muted)" />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{vendor.city}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <Clock size={11} color="var(--text-muted)" />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{vendor.hours}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <Phone size={11} color="var(--text-muted)" />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{vendor.phone}</span>
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: '0 16px 8px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input className="input" placeholder="Search menu..." value={productSearch} onChange={e => { setProductSearch(e.target.value); if (e.target.value) setSelectedCategory('all') }}
              style={{ paddingLeft: 32, fontSize: 13, height: 38 }} />
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto', borderTop: '1px solid var(--border)' }}>
          {categories.map(cat => {
            const catObj = MEAT_CATEGORIES.find(c => c.id === cat)
            const active = selectedCategory === cat
            return (
              <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                padding: '10px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                background: 'none', border: 'none', flexShrink: 0, whiteSpace: 'nowrap',
                borderBottom: active ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                color: active ? 'var(--primary-light)' : 'var(--text-muted)',
                transition: 'all 0.15s',
              }}>
                {cat === 'all' ? '🍽️ All' : catObj ? `${catObj.emoji} ${catObj.label}` : cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Product content ── */}
      <div style={{ padding: '12px 12px 100px' }}>

        {/* Mix Builder banner for per-pound */}
        {(selectedCategory === 'per-pound' || selectedCategory === 'all') && perPoundItems.length > 1 && !productSearch && (
          <button onClick={() => setShowMixBuilder(true)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', marginBottom: 16, padding: '14px 16px',
            background: 'linear-gradient(135deg, var(--brand-yellow) 0%, var(--primary) 100%)',
            borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(249,156,76,0.35)',
          }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'white', marginBottom: 2 }}>⚖️ Build Your Mix</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>Mix any meats by the ½ lb — Mixtas, Buche, Cueritos & more</div>
            </div>
            <ChevronRight size={20} color="white" />
          </button>
        )}

        {/* Empty state */}
        {filteredFlat.length === 0 && (
          <div className="empty-state" style={{ paddingTop: 60 }}>
            <div className="empty-icon">🥩</div>
            <div className="empty-title">No items found</div>
          </div>
        )}

        {/* Product grid — 2 columns like Domino's */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {renderRows.map((row, i) => {
            if (row.type === 'header') return (
              <div key={`h-${row.cat}`} style={{ gridColumn: '1 / -1', padding: '8px 0 4px' }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{row.label}</span>
              </div>
            )
            const p = row.product
            return (
              <div key={p.id} onClick={() => handleAdd(p)}
                className="card"
                style={{ cursor: p.inStock ? 'pointer' : 'default', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.1s', opacity: p.inStock ? 1 : 0.6 }}
                onTouchStart={e => { if (p.inStock) e.currentTarget.style.transform = 'scale(0.97)' }}
                onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}>
                {/* Square product image */}
                <div style={{ position: 'relative', paddingBottom: '75%', overflow: 'hidden', background: 'var(--bg-surface)' }}>
                  <img src={p.image} alt={p.name}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  {!p.inStock && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>Sold Out</span>
                    </div>
                  )}
                  {p.popular && (
                    <div style={{ position: 'absolute', top: 7, left: 7, background: 'var(--primary)', borderRadius: 5, padding: '2px 7px', fontSize: 10, fontWeight: 700, color: 'white' }}>
                      Popular
                    </div>
                  )}
                </div>
                {/* Info */}
                <div style={{ padding: '9px 10px 10px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3, lineHeight: 1.3,
                    overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {p.name}
                  </div>
                  <div style={{ flex: 1 }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                    <div>
                      <span className="price" style={{ fontSize: 14 }}>{formatPrice(p.pricePerLb)}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>/{unitDisplay(p.unit)}</span>
                    </div>
                    {p.inStock && (
                      <button
                        onClick={e => { e.stopPropagation(); handleAdd(p) }}
                        style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--primary)', border: 'none', color: 'white', fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, lineHeight: 1 }}>
                        +
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Reviews sheet ── */}
      {showReviews && (
        <div className="bottom-sheet-overlay" onClick={e => e.target === e.currentTarget && setShowReviews(false)}>
          <div className="bottom-sheet" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="bottom-sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>Reviews</h3>
              <span className="rating" style={{ fontSize: 15 }}><Star size={14} fill="currentColor" />{vendor.rating} ({allReviews.length})</span>
            </div>
            {allReviews.map(r => (
              <div key={r.id} style={{ paddingBottom: 14, marginBottom: 14, borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{r.reviewerName}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatRelativeTime(new Date(r.createdAt))}</span>
                </div>
                <div style={{ display: 'flex', gap: 1, marginBottom: 6 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= r.rating ? 'var(--warning)' : 'transparent'} color={s <= r.rating ? 'var(--warning)' : 'var(--border)'} />)}
                </div>
                {r.text && <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.text}</p>}
              </div>
            ))}
            <button className="btn btn-secondary btn-full" onClick={() => setShowReviews(false)}>Close</button>
          </div>
        </div>
      )}

      {/* ── Add item sheet ── */}
      {addingProduct && (
        <div className="bottom-sheet-overlay" onClick={e => e.target === e.currentTarget && setAddingProduct(null)}>
          <div className="bottom-sheet">
            <div className="bottom-sheet-handle" />

            {/* Product hero image in sheet */}
            <div style={{ margin: '-12px -20px 16px', height: 200, overflow: 'hidden' }}>
              <img src={addingProduct.image} alt={addingProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{addingProduct.name}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>{addingProduct.description}</p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '12px 14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>
                  {addingProduct.unit === 'lb' ? 'Quantity (lbs)' : addingProduct.unit === 'tray' ? 'Trays' : 'Quantity'}
                  {addingProduct.unit === 'lb' && <span style={{ marginLeft: 6, color: 'var(--primary-light)', fontSize: 11 }}>½ lb min</span>}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button onClick={() => setQuantity(q => +(Math.max(qtyMin, q - qtyStep)).toFixed(1))}
                    style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 20, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <span style={{ fontSize: 18, fontWeight: 800, minWidth: 32, textAlign: 'center' }}>
                    {quantity % 1 === 0 ? quantity : quantity.toFixed(1)}
                  </span>
                  <button onClick={() => setQuantity(q => +(Math.min(maxQty(addingProduct.unit), q + qtyStep)).toFixed(1))}
                    style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--primary)', border: 'none', fontSize: 20, fontWeight: 700, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Subtotal</div>
                <div className="price" style={{ fontSize: 20 }}>{formatPrice(addingProduct.pricePerLb * quantity)}</div>
              </div>
            </div>

            {/* Meat type */}
            {addingProduct.options?.meatType && (
              <div className="field">
                <label className="label">Choose Meat Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {CUSTOMIZATION_OPTIONS.meatType.map(opt => (
                    <button key={opt.id} onClick={() => setMeatType(opt.id)} style={{
                      padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                      background: meatType === opt.id ? 'rgba(249,156,76,0.12)' : 'var(--bg-surface)',
                      border: `1.5px solid ${meatType === opt.id ? 'var(--primary)' : 'var(--border)'}`,
                      textAlign: 'left', cursor: 'pointer',
                    }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{opt.label}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.3 }}>{opt.description}</div>
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

      {/* ── Mix Builder sheet ── */}
      {showMixBuilder && (
        <div className="bottom-sheet-overlay" onClick={e => e.target === e.currentTarget && setShowMixBuilder(false)}>
          <div className="bottom-sheet" style={{ maxHeight: '88vh', overflowY: 'auto' }}>
            <div className="bottom-sheet-handle" />
            <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>🥩 Build Your Mix</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.4 }}>
              Choose any combination of carnitas cuts, all by the ½ lb.
            </p>

            {perPoundItems.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: 12, background: getMixQty(p.id) > 0 ? 'rgba(249,156,76,0.06)' : 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: `1px solid ${getMixQty(p.id) > 0 ? 'rgba(249,156,76,0.3)' : 'var(--border)'}`, transition: 'all 0.15s' }}>
                <div style={{ width: 50, height: 50, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--primary-light)', fontWeight: 600 }}>
                    {formatPrice(p.pricePerLb)}/lb
                    {getMixQty(p.id) > 0 && <span style={{ color: 'var(--text-muted)', marginLeft: 6, fontWeight: 400 }}>
                      = {formatPrice(getMixQty(p.id) * p.pricePerLb)}
                    </span>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <button onClick={() => updateMixQty(p.id, getMixQty(p.id) - 0.5)}
                    style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <span style={{ fontSize: 15, fontWeight: 800, minWidth: 28, textAlign: 'center' }}>
                    {getMixQty(p.id) % 1 === 0 ? getMixQty(p.id) : getMixQty(p.id).toFixed(1)}
                  </span>
                  <button onClick={() => updateMixQty(p.id, getMixQty(p.id) + 0.5)}
                    style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--primary)', border: 'none', fontSize: 18, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
              </div>
            ))}

            <div style={{ borderTop: '2px solid var(--border)', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  {mixTotalLbs > 0 ? `${mixTotalLbs % 1 === 0 ? mixTotalLbs : mixTotalLbs.toFixed(1)} lbs selected` : 'Nothing selected yet'}
                </span>
                {mixTotalPrice > 0 && <span className="price" style={{ fontSize: 18 }}>{formatPrice(mixTotalPrice)}</span>}
              </div>
              <button className="btn btn-gradient btn-full btn-lg" disabled={mixTotalLbs === 0} style={{ opacity: mixTotalLbs > 0 ? 1 : 0.4 }} onClick={confirmMix}>
                {mixTotalLbs > 0 ? `Add ${mixTotalLbs % 1 === 0 ? mixTotalLbs : mixTotalLbs.toFixed(1)} lbs to Cart · ${formatPrice(mixTotalPrice)}` : 'Select at least ½ lb'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
