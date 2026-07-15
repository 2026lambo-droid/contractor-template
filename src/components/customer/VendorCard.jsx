import { useNavigate } from 'react-router-dom'
import { Star, Clock, MapPin, ChevronRight } from 'lucide-react'

export function VendorCard({ vendor }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/vendors/${vendor.id}`)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 0', borderBottom: '1px solid var(--border)',
        cursor: 'pointer',
      }}
    >
      {/* Thumbnail */}
      <div style={{ width: 52, height: 52, borderRadius: 10, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
        <img src={vendor.image} alt={vendor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {!vendor.isOpen && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 8, color: 'white', fontWeight: 700 }}>CLOSED</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vendor.name}</span>
          {vendor.isOpen
            ? <span style={{ fontSize: 10, color: 'var(--success)', fontWeight: 700, flexShrink: 0 }}>● Open</span>
            : <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, flexShrink: 0 }}>Closed</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Star size={10} fill="var(--warning)" color="var(--warning)" />
            <span style={{ fontSize: 11, fontWeight: 600 }}>{vendor.rating}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Clock size={10} color="var(--text-muted)" />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{vendor.estimatedDelivery}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <MapPin size={10} color="var(--text-muted)" />
            <span style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 100 }}>{vendor.city}</span>
          </div>
        </div>
      </div>

      <ChevronRight size={16} color="var(--text-muted)" flexShrink={0} />
    </div>
  )
}

export function VendorCardCompact({ vendor }) {
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(`/vendors/${vendor.id}`)} style={{ cursor: 'pointer', width: 160, flexShrink: 0 }}>
      <div style={{ width: 160, height: 110, borderRadius: 'var(--radius)', overflow: 'hidden', position: 'relative', marginBottom: 8 }}>
        <img src={vendor.image} alt={vendor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {!vendor.isOpen && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, color: '#fff', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: 100 }}>Closed</span>
          </div>
        )}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vendor.name}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Star size={10} fill="var(--warning)" color="var(--warning)" />
          <span style={{ fontSize: 11, fontWeight: 600 }}>{vendor.rating}</span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{vendor.estimatedDelivery}</span>
      </div>
    </div>
  )
}
