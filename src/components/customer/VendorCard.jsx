import { useNavigate } from 'react-router-dom'
import { Star, Clock, MapPin } from 'lucide-react'

export function VendorCard({ vendor }) {
  const navigate = useNavigate()
  return (
    <div className="card" onClick={() => navigate(`/vendors/${vendor.id}`)} style={{ cursor: 'pointer', marginBottom: 12 }}>
      <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
        <img src={vendor.image} alt={vendor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(15,10,8,0.9) 100%)' }} />
        {!vendor.isOpen && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="chip chip-muted" style={{ fontSize: 13 }}>Closed Now</span>
          </div>
        )}
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <span className="chip chip-success" style={{ fontSize: 11 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
            {vendor.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <div className="row-between" style={{ marginBottom: 6 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, flex: 1, marginRight: 8 }}>{vendor.name}</h3>
          <div className="rating">
            <Star size={12} fill="currentColor" />
            {vendor.rating} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({vendor.reviewCount})</span>
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.4 }}>
          {vendor.description.slice(0, 80)}...
        </p>
        <div className="row" style={{ gap: 12 }}>
          <div className="row gap-4 text-sm text-muted">
            <MapPin size={12} />
            <span>{vendor.city}</span>
          </div>
          <div className="row gap-4 text-sm text-muted">
            <Clock size={12} />
            <span>{vendor.estimatedDelivery}</span>
          </div>
        </div>
        <div className="row" style={{ gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          {vendor.specialties.map(s => (
            <span key={s} className="chip chip-primary" style={{ fontSize: 10, padding: '4px 8px' }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function VendorCardCompact({ vendor }) {
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(`/vendors/${vendor.id}`)} style={{ cursor: 'pointer', width: 200 }}>
      <div style={{ width: 200, height: 130, borderRadius: 'var(--radius)', overflow: 'hidden', position: 'relative', marginBottom: 8 }}>
        <img src={vendor.image} alt={vendor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {!vendor.isOpen && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, color: '#fff', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: 100 }}>Closed</span>
          </div>
        )}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{vendor.name}</div>
      <div className="row gap-8">
        <div className="rating" style={{ fontSize: 11 }}><Star size={10} fill="currentColor" />{vendor.rating}</div>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{vendor.estimatedDelivery}</span>
      </div>
    </div>
  )
}
