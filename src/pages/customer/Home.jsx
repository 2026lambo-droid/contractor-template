import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, MapPin, ChevronRight, X } from 'lucide-react'
import { AppHeader, IconBtn } from '../../components/common/AppHeader'
import { VendorCardCompact } from '../../components/customer/VendorCard'
import { VendorCard } from '../../components/customer/VendorCard'
import { useAuth } from '../../contexts/AuthContext'
import { useFavorites } from '../../contexts/FavoritesContext'
import { MOCK_VENDORS } from '../../utils/mockData'

const PROMOS = [
  { id: 1, emoji: '🔥', title: 'Free Delivery Today', sub: 'On orders over $25', bg: 'linear-gradient(135deg, #F99C4C 0%, #E8573D 100%)' },
  { id: 2, emoji: '🥩', title: 'Carnitas by the Pound', sub: 'Mix any cuts you want', bg: 'linear-gradient(135deg, #99AD27 0%, #4F7A1B 100%)' },
  { id: 3, emoji: '🎉', title: 'Party Trays Available', sub: 'Feeds 10–20 people', bg: 'linear-gradient(135deg, #F9CC01 20%, #F99C4C 100%)' },
]

export function CustomerHome() {
  const { user } = useAuth()
  const { favorites } = useFavorites()
  const navigate = useNavigate()
  const [promoIdx, setPromoIdx] = useState(0)

  const nearby = MOCK_VENDORS.filter(v => v.city === 'San Jose').slice(0, 5)
  const favVendors = MOCK_VENDORS.filter(v => favorites.includes(v.id)).slice(0, 4)
  const openVendors = MOCK_VENDORS.filter(v => v.isOpen).slice(0, 4)

  const recentOrders = JSON.parse(localStorage.getItem('elrincon_orders') || '[]')
  const lastOrder = recentOrders[0]
  const lastVendor = lastOrder ? MOCK_VENDORS.find(v => v.id === lastOrder.vendorId) : null

  const notifDismissed = localStorage.getItem('elrincon_notif_dismissed')
  const showNotifBanner = !notifDismissed && 'Notification' in window && Notification.permission === 'default'
  const [notifBanner, setNotifBanner] = useState(showNotifBanner)

  const enableNotifications = async () => {
    const perm = await Notification.requestPermission()
    if (perm === 'granted') {
      new Notification('Carnitas El Rincón', { body: '🔥 You\'ll get updates when your order is on the way!', icon: '/icons/icon-192.png' })
    }
    localStorage.setItem('elrincon_notif_dismissed', 'true')
    setNotifBanner(false)
  }

  const promo = PROMOS[promoIdx]

  return (
    <div className="page animate-fadeIn">
      <AppHeader actions={
        <IconBtn icon={Bell} onClick={() => navigate('/notifications')} badge={2} />
      } />

      {/* Location + greeting */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
          <MapPin size={13} color="var(--primary)" />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Delivering to </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>San Jose, CA</span>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 14, lineHeight: 1.2 }}>
          Hola{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
          <br /><span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-secondary)' }}>What are you craving today?</span>
        </h2>

        {/* Big "Start Order" button — Domino's style CTA */}
        <button
          className="btn btn-gradient btn-full btn-lg"
          onClick={() => navigate('/vendors')}
          style={{ marginBottom: 16, fontSize: 16, fontWeight: 800 }}
        >
          🌮 Start Your Order
        </button>
      </div>

      {/* Push notification banner */}
      {notifBanner && (
        <div style={{ margin: '0 16px 16px', padding: '12px 14px', background: 'rgba(249,156,76,0.08)', border: '1px solid rgba(249,156,76,0.2)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bell size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 1 }}>Track your order</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Enable notifications for delivery updates</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={enableNotifications} style={{ fontSize: 11, flexShrink: 0, padding: '6px 10px' }}>Enable</button>
          <button onClick={() => { localStorage.setItem('elrincon_notif_dismissed', 'true'); setNotifBanner(false) }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Promo banner — swipeable dots */}
      <div style={{ margin: '0 16px 20px' }}>
        <div style={{
          padding: '16px 18px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
          background: promo.bg, minHeight: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }} onClick={() => navigate('/vendors')}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>{promo.emoji}</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'white', lineHeight: 1.2 }}>{promo.title}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>{promo.sub}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
          {PROMOS.map((_, i) => (
            <button key={i} onClick={() => setPromoIdx(i)} style={{ width: i === promoIdx ? 18 : 6, height: 6, borderRadius: 3, background: i === promoIdx ? 'var(--primary)' : 'var(--border)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0 }} />
          ))}
        </div>
      </div>

      {/* Re-order quick card */}
      {lastVendor && lastOrder?.status === 'delivered' && (
        <div style={{ margin: '0 16px 20px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Order Again</div>
          <div
            onClick={() => navigate(`/vendors/${lastVendor.id}`)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer' }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
              <img src={lastVendor.image} alt={lastVendor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lastVendor.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Tap to reorder</div>
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </div>
        </div>
      )}

      {/* Favorites */}
      {favVendors.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 800 }}>❤️ Your Favorites</span>
            <button onClick={() => navigate('/favorites')} style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--primary-light)', fontWeight: 600, cursor: 'pointer' }}>See all</button>
          </div>
          <div style={{ display: 'flex', gap: 12, paddingLeft: 16, overflowX: 'auto', paddingRight: 16, paddingBottom: 4 }}>
            {favVendors.map(v => <VendorCardCompact key={v.id} vendor={v} />)}
          </div>
        </div>
      )}

      {/* Open Now */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 800 }}>🟢 Open Now</span>
          <button onClick={() => navigate('/vendors')} style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--primary-light)', fontWeight: 600, cursor: 'pointer' }}>All 20 →</button>
        </div>
        <div style={{ display: 'flex', gap: 12, paddingLeft: 16, overflowX: 'auto', paddingRight: 16, paddingBottom: 4 }}>
          {openVendors.map(v => <VendorCardCompact key={v.id} vendor={v} />)}
        </div>
      </div>

      {/* Nearby (San Jose) */}
      {nearby.length > 0 && (
        <div style={{ margin: '0 0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 800 }}>📍 San Jose Locations</span>
          </div>
          <div style={{ padding: '0 16px' }}>
            {nearby.map(v => <VendorCard key={v.id} vendor={v} />)}
          </div>
        </div>
      )}
    </div>
  )
}
