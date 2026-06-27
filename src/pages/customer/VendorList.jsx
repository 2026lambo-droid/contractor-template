import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { VendorCard } from '../../components/customer/VendorCard'
import { MOCK_VENDORS } from '../../utils/mockData'
import { MEAT_CATEGORIES } from '../../utils/constants'

export function VendorList() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [showOpenOnly, setShowOpenOnly] = useState(false)
  const [sortBy, setSortBy] = useState('rating')
  const [showSort, setShowSort] = useState(false)

  const SORT_OPTIONS = [
    { id: 'rating', label: 'Top Rated' },
    { id: 'fastest', label: 'Fastest Delivery' },
    { id: 'az', label: 'A → Z' },
  ]

  const baseFiltered = MOCK_VENDORS.filter(v => {
    if (showOpenOnly && !v.isOpen) return false
    if (query && !v.name.toLowerCase().includes(query.toLowerCase()) && !v.city.toLowerCase().includes(query.toLowerCase()) && !v.specialties.some(s => s.toLowerCase().includes(query.toLowerCase()))) return false
    if (activeCategory !== 'all') {
      const catLabel = MEAT_CATEGORIES.find(c => c.id === activeCategory)?.label || ''
      if (!v.specialties.some(s => s.toLowerCase().includes(catLabel.toLowerCase()))) return false
    }
    return true
  })

  const filtered = [...baseFiltered].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'fastest') return parseInt(a.estimatedDelivery) - parseInt(b.estimatedDelivery)
    if (sortBy === 'az') return a.name.localeCompare(b.name)
    return 0
  })

  return (
    <div className="page animate-fadeIn">
      <AppHeader title="Browse Vendors" />

      {/* Search */}
      <div style={{ padding: '12px 16px' }}>
        <input
          className="input"
          placeholder="🔍  Search vendors or meats..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        {/* Filter row */}
        <div className="row" style={{ gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          <button onClick={() => setShowOpenOnly(!showOpenOnly)} className={`chip ${showOpenOnly ? 'chip-success' : 'chip-muted'}`} style={{ cursor: 'pointer', border: 'none', flexShrink: 0 }}>
            {showOpenOnly ? '✓ ' : ''}Open Now
          </button>
          <button onClick={() => setActiveCategory('all')} className={`chip ${activeCategory === 'all' ? 'chip-primary' : 'chip-muted'}`} style={{ cursor: 'pointer', border: 'none', flexShrink: 0 }}>
            All
          </button>
          {MEAT_CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setActiveCategory(activeCategory === c.id ? 'all' : c.id)} className={`chip ${activeCategory === c.id ? 'chip-primary' : 'chip-muted'}`} style={{ cursor: 'pointer', border: 'none', flexShrink: 0 }}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count + sort */}
      <div style={{ padding: '0 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{filtered.length} vendor{filtered.length !== 1 ? 's' : ''}</span>
        <div style={{ position: 'relative' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowSort(!showSort)} style={{ fontSize: 12, color: 'var(--text-secondary)', gap: 5 }}>
            <SlidersHorizontal size={13} /> {SORT_OPTIONS.find(s => s.id === sortBy)?.label}
          </button>
          {showSort && (
            <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow)', zIndex: 20, overflow: 'hidden', minWidth: 140 }}>
              {SORT_OPTIONS.map(opt => (
                <button key={opt.id} onClick={() => { setSortBy(opt.id); setShowSort(false) }} style={{ display: 'block', width: '100%', padding: '10px 14px', background: sortBy === opt.id ? 'rgba(232,93,4,0.1)' : 'none', border: 'none', textAlign: 'left', fontSize: 13, fontWeight: sortBy === opt.id ? 700 : 400, color: sortBy === opt.id ? 'var(--primary-light)' : 'var(--text)', cursor: 'pointer' }}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vendor list */}
      <div style={{ padding: '0 16px' }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No vendors found</div>
            <div className="empty-desc">Try adjusting your search or filters</div>
          </div>
        ) : filtered.map(v => <VendorCard key={v.id} vendor={v} />)}
      </div>
    </div>
  )
}
