import { useState } from 'react'
import { AppHeader } from '../../components/common/AppHeader'
import { VendorCard } from '../../components/customer/VendorCard'
import { MOCK_VENDORS } from '../../utils/mockData'
import { MEAT_CATEGORIES } from '../../utils/constants'

export function VendorList() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [showOpenOnly, setShowOpenOnly] = useState(false)

  const filtered = MOCK_VENDORS.filter(v => {
    if (showOpenOnly && !v.isOpen) return false
    if (query && !v.name.toLowerCase().includes(query.toLowerCase()) && !v.city.toLowerCase().includes(query.toLowerCase()) && !v.specialties.some(s => s.toLowerCase().includes(query.toLowerCase()))) return false
    if (activeCategory !== 'all') {
      const catLabel = MEAT_CATEGORIES.find(c => c.id === activeCategory)?.label || ''
      if (!v.specialties.some(s => s.toLowerCase().includes(catLabel.toLowerCase()))) return false
    }
    return true
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

      {/* Results count */}
      <div style={{ padding: '0 16px 8px', fontSize: 13, color: 'var(--text-muted)' }}>
        {filtered.length} vendor{filtered.length !== 1 ? 's' : ''} found
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
