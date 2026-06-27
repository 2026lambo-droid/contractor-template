import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, MapPin, Flame, Heart, X } from 'lucide-react'
import { AppHeader, IconBtn } from '../../components/common/AppHeader'
import { VendorCard, VendorCardCompact } from '../../components/customer/VendorCard'
import { useAuth } from '../../contexts/AuthContext'
import { useFavorites } from '../../contexts/FavoritesContext'
import { MOCK_VENDORS } from '../../utils/mockData'
import { MEAT_CATEGORIES } from '../../utils/constants'

export function CustomerHome() {
  const { user } = useAuth()
  const { favorites } = useFavorites()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState(null)

  const openVendors = MOCK_VENDORS.filter(v => v.isOpen)
  const featured = openVendors.slice(0, 2)
  const nearby = MOCK_VENDORS.filter(v => v.city === 'San Jose' || v.city === 'Oakland')
  const favVendors = MOCK_VENDORS.filter(v => favorites.includes(v.id)).slice(0, 3)

  const notifDismissed = localStorage.getItem('carnemx_notif_dismissed')
  const showNotifBanner = !notifDismissed && 'Notification' in window && Notification.permission === 'default'
  const [notifBanner, setNotifBanner] = useState(showNotifBanner)

  const enableNotifications = async () => {
    const perm = await Notification.requestPermission()
    if (perm === 'granted') {
      new Notification('CarneMX', { body: '🔥 You\'ll get updates when your order is on the way!', icon: '/icons/icon-192.png' })
    }
    localStorage.setItem('carnemx_notif_dismissed', 'true')
    setNotifBanner(false)
  }
  const categoryVendors = selectedCategory
    ? MOCK_VENDORS.filter(v => v.specialties.some(s => s.toLowerCase().includes(selectedCategory.replace('-', ' '))))
    : []

  return (
    <div className="page animate-fadeIn">
      <AppHeader actions={
        <IconBtn icon={Bell} onClick={() => navigate('/notifications')} badge={2} />
      } />

      {/* Push notification banner */}
      {notifBanner && (
        <div style={{ margin: '12px 16px 0', padding: '12px 14px', background: 'rgba(232,93,4,0.08)', border: '1px solid rgba(232,93,4,0.2)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bell size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 1 }}>Get order updates</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Enable notifications to track deliveries</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={enableNotifications} style={{ fontSize: 11, flexShrink: 0, padding: '6px 10px' }}>Enable</button>
          <button onClick={() => { localStorage.setItem('carnemx_notif_dismissed', 'true'); setNotifBanner(false) }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2, flexShrink: 0 }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Greeting + location */}
      <div style={{ padding: '16px 16px 0' }}>
        <div className="row gap-6" style={{ marginBottom: 4 }}>
          <MapPin size={14} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>San Jose, CA</span>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
          Hola, {user?.name?.split(' ')[0]} 👋<br />
          <span style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-secondary)' }}>What's on the grill today?</span>
        </h2>

        {/* Search bar */}
        <div onClick={() => navigate('/vendors')} style={{
          background: 'var(--bg-surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)',
          padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 24,
        }}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 15 }}>Search carnicerías & meats...</span>
        </div>
      </div>

      {/* Hero banner */}
      <div style={{ margin: '0 16px 24px', position: 'relative', height: 140, borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&auto=format&fit=crop" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,10,8,0.85) 0%, rgba(15,10,8,0.3) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Flame size={14} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: 11, color: 'var(--primary-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Free delivery today</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>Fresh Carne Asada<br />Delivered in 30 min</div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/vendors')} style={{ width: 'fit-content', fontSize: 12 }}>
            Order Now →
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="section-header">
        <span className="section-title">Categories</span>
      </div>
      <div className="scroll-x" style={{ paddingBottom: 8, marginBottom: 24 }}>
        {MEAT_CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            padding: '10px 16px', borderRadius: 'var(--radius)',
            background: selectedCategory === cat.id ? 'rgba(232,93,4,0.15)' : 'var(--bg-card)',
            border: `1.5px solid ${selectedCategory === cat.id ? 'var(--primary)' : 'var(--border)'}`,
            cursor: 'pointer', transition: 'all 0.15s', minWidth: 80,
          }}>
            <span style={{ fontSize: 24 }}>{cat.emoji}</span>
            <span style={{ fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', color: selectedCategory === cat.id ? 'var(--primary-light)' : 'var(--text-secondary)' }}>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Featured vendors */}
      {!selectedCategory && (
        <>
          {favVendors.length > 0 && (
            <>
              <div className="section-header">
                <span className="section-title"><Heart size={14} style={{ display: 'inline', marginRight: 5, color: '#ef4444', verticalAlign: 'middle' }} />Favorites</span>
                <button onClick={() => navigate('/favorites')} className="btn btn-ghost btn-sm text-muted" style={{ fontSize: 13, padding: '4px 0' }}>See all</button>
              </div>
              <div className="scroll-x" style={{ marginBottom: 24 }}>
                {favVendors.map(v => <VendorCardCompact key={v.id} vendor={v} />)}
              </div>
            </>
          )}

          <div className="section-header">
            <span className="section-title">🔥 Featured</span>
            <button onClick={() => navigate('/vendors')} className="btn btn-ghost btn-sm text-muted" style={{ fontSize: 13, padding: '4px 0' }}>See all</button>
          </div>
          <div className="scroll-x" style={{ marginBottom: 24 }}>
            {featured.map(v => <VendorCardCompact key={v.id} vendor={v} />)}
          </div>

          {/* Nearby */}
          <div className="section-header">
            <span className="section-title">📍 Near You</span>
          </div>
          <div style={{ padding: '0 16px' }}>
            {nearby.map(v => <VendorCard key={v.id} vendor={v} />)}
          </div>
        </>
      )}

      {/* Category results */}
      {selectedCategory && (
        <>
          <div className="section-header">
            <span className="section-title">Results</span>
            <button onClick={() => setSelectedCategory(null)} className="btn btn-ghost btn-sm text-muted" style={{ fontSize: 13, padding: '4px 0' }}>Clear</button>
          </div>
          <div style={{ padding: '0 16px' }}>
            {categoryVendors.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🥩</div>
                <div className="empty-title">No vendors found</div>
                <div className="empty-desc">No vendors in your area offer this right now</div>
              </div>
            ) : categoryVendors.map(v => <VendorCard key={v.id} vendor={v} />)}
          </div>
        </>
      )}
    </div>
  )
}
