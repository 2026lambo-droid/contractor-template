import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { VendorCard } from '../../components/customer/VendorCard'
import { MOCK_VENDORS } from '../../utils/mockData'

const SORT_OPTIONS = [
  { id: 'rating', label: 'Top Rated' },
  { id: 'fastest', label: 'Fastest' },
  { id: 'az', label: 'A → Z' },
]

export function VendorList() {
  const [query, setQuery] = useState('')
  const [showOpenOnly, setShowOpenOnly] = useState(false)
  const [sortBy, setSortBy] = useState('rating')
  const [showSort, setShowSort] = useState(false)

  const filtered = MOCK_VENDORS.filter(v => {
    if (showOpenOnly && !v.isOpen) return false
    if (query) {
      const q = query.toLowerCase()
      return v.name.toLowerCase().includes(q) || v.city.toLowerCase().includes(q) || v.address?.toLowerCase().includes(q)
    }
    return true
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'fastest') return parseInt(a.estimatedDelivery) - parseInt(b.estimatedDelivery)
    if (sortBy === 'az') return a.name.localeCompare(b.name)
    return 0
  })

  const openCount = MOCK_VENDORS.filter(v => v.isOpen).length

  return (
    <div className="page animate-fadeIn">
      {/* Sticky search header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'var(--bg-page, var(--bg))', borderBottom: '1px solid var(--border)' }}>
        <AppHeader title="Choose a Location" />
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              className="input"
              placeholder="Search by city or location..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ paddingLeft: 36, paddingRight: query ? 36 : 12 }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                <X size={14} />
              </button>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setShowOpenOnly(!showOpenOnly)}
                style={{
                  fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 20, cursor: 'pointer',
                  background: showOpenOnly ? 'rgba(74,222,128,0.15)' : 'var(--bg-surface)',
                  border: `1.5px solid ${showOpenOnly ? 'var(--success)' : 'var(--border)'}`,
                  color: showOpenOnly ? 'var(--success)' : 'var(--text-muted)',
                }}
              >
                {showOpenOnly ? '✓ ' : ''}Open Now ({openCount})
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowSort(!showSort)} style={{ fontSize: 12, gap: 5, color: 'var(--text-secondary)' }}>
                <SlidersHorizontal size={13} />
                {SORT_OPTIONS.find(s => s.id === sortBy)?.label}
              </button>
              {showSort && (
                <div style={{ position: 'absolute', right: 0, top: '110%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow)', zIndex: 30, overflow: 'hidden', minWidth: 140 }}>
                  {SORT_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => { setSortBy(opt.id); setShowSort(false) }}
                      style={{ display: 'block', width: '100%', padding: '10px 14px', background: sortBy === opt.id ? 'rgba(249,156,76,0.1)' : 'none', border: 'none', textAlign: 'left', fontSize: 13, fontWeight: sortBy === opt.id ? 700 : 400, color: sortBy === opt.id ? 'var(--primary-light)' : 'var(--text)', cursor: 'pointer' }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ padding: '4px 16px' }}>
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ paddingTop: 60 }}>
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No locations found</div>
            <div className="empty-desc">Try a different city or name</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '10px 0 2px', fontWeight: 500 }}>
              {filtered.length} location{filtered.length !== 1 ? 's' : ''}
            </div>
            {filtered.map(v => <VendorCard key={v.id} vendor={v} />)}
          </>
        )}
      </div>
    </div>
  )
}
