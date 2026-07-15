import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Store, Package, Clock } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { MOCK_VENDORS, MOCK_PRODUCTS } from '../../utils/mockData'
import { formatPrice } from '../../utils/formatters'

const RECENT_KEY = 'elrincon_recent_searches'

function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') } catch { return [] }
}
function addRecent(q) {
  const prev = getRecent().filter(s => s !== q)
  localStorage.setItem(RECENT_KEY, JSON.stringify([q, ...prev].slice(0, 6)))
}

export function GlobalSearch() {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [recent, setRecent] = useState(getRecent)

  useEffect(() => { inputRef.current?.focus() }, [])

  const q = query.trim().toLowerCase()

  const vendorResults = q.length >= 1
    ? MOCK_VENDORS.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.specialties.some(s => s.toLowerCase().includes(q))
      ).slice(0, 5)
    : []

  const allProducts = Object.values(MOCK_PRODUCTS).flat()
  const productResults = q.length >= 1
    ? allProducts.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      ).slice(0, 6)
    : []

  const handleSearch = (term) => {
    if (!term.trim()) return
    addRecent(term.trim())
    setRecent(getRecent())
    setQuery(term)
  }

  const goToVendor = (v) => {
    addRecent(v.name)
    navigate(`/vendors/${v.id}`)
  }

  const goToProduct = (p) => {
    addRecent(p.name)
    navigate(`/vendors/${p.vendorId}`)
  }

  const hasResults = vendorResults.length > 0 || productResults.length > 0

  return (
    <div className="page animate-fadeIn">
      <AppHeader title="Search" back />

      {/* Search input */}
      <div style={{ padding: '8px 16px 16px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            ref={inputRef}
            className="input"
            placeholder="Search vendors, meats, specialties..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch(query)}
            style={{ paddingLeft: 42, paddingRight: 42 }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* No query: show recent + popular */}
      {!q && (
        <div style={{ padding: '0 16px' }}>
          {recent.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Recent</span>
                <button onClick={() => { localStorage.removeItem(RECENT_KEY); setRecent([]) }} style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}>Clear</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {recent.map(s => (
                  <button key={s} onClick={() => setQuery(s)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 100, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <Clock size={12} /> {s}
                  </button>
                ))}
              </div>
            </>
          )}

          <div style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Popular</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['Carne Asada', 'Chorizo', 'Carnitas', 'Short Ribs', 'Al Pastor', 'San Jose', 'Oakland'].map(t => (
              <button key={t} onClick={() => setQuery(t)} className="chip chip-muted" style={{ cursor: 'pointer', border: 'none', fontSize: 13 }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {q && !hasResults && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No results for "{query}"</div>
          <div className="empty-desc">Try a different meat, city, or vendor name</div>
        </div>
      )}

      {vendorResults.length > 0 && (
        <div style={{ padding: '0 16px', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
            Vendors ({vendorResults.length})
          </div>
          {vendorResults.map(v => (
            <div key={v.id} onClick={() => goToVendor(v)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                <img src={v.image} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{v.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v.city} · ⭐ {v.rating}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{v.specialties.slice(0, 3).join(' · ')}</div>
              </div>
              <span className={`chip ${v.isOpen ? 'chip-success' : 'chip-muted'}`} style={{ fontSize: 10 }}>
                {v.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
          ))}
        </div>
      )}

      {productResults.length > 0 && (
        <div style={{ padding: '0 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
            Products ({productResults.length})
          </div>
          {productResults.map(p => {
            const vendor = MOCK_VENDORS.find(v => v.id === p.vendorId)
            return (
              <div key={p.id} onClick={() => goToProduct(p)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{vendor?.name}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div className="price" style={{ fontSize: 14 }}>{formatPrice(p.pricePerLb)}/lb</div>
                  <div style={{ fontSize: 10, color: p.inStock ? 'var(--success)' : 'var(--error)', marginTop: 2 }}>{p.inStock ? 'In stock' : 'Out of stock'}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
