import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, MapPin, Phone, LogOut, ChevronRight, Bell, Shield, HelpCircle, Heart, Globe, Moon, Sun } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { useLang } from '../../contexts/LanguageContext'
import { useFavorites } from '../../contexts/FavoritesContext'
import { useTheme } from '../../contexts/ThemeContext'

export function Profile() {
  const { user, logout, updateUser } = useAuth()
  const { toast } = useToast()
  const { lang, toggle: toggleLang } = useLang()
  const { favorites } = useFavorites()
  const { theme, toggle: toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [address, setAddress] = useState(user?.address || '')

  const handleSave = () => {
    updateUser({ name, phone, address })
    toast('Profile updated', 'success')
    setEditing(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const menuItems = [
    { icon: Heart, label: `Favorites (${favorites.length})`, action: () => navigate('/favorites') },
    { icon: Bell, label: 'Notifications', action: () => toast('Push notifications coming soon', 'info') },
    { icon: Shield, label: 'Privacy & Security', action: () => toast('Coming soon', 'info') },
    { icon: HelpCircle, label: 'Help & Support', action: () => toast('Coming soon', 'info') },
  ]

  return (
    <div className="page animate-fadeIn">
      <AppHeader title="Profile" />

      {/* Avatar & name */}
      <div style={{ padding: '24px 16px 16px', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg-surface)', border: '3px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 32 }}>
          {user?.name?.[0]?.toUpperCase() || '?'}
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 2 }}>{user?.name}</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{user?.email}</p>
        <span className="chip chip-primary" style={{ marginTop: 8, fontSize: 11 }}>
          {user?.role === 'customer' ? '🛒 Customer' : user?.role === 'vendor' ? '🏪 Vendor' : '🚗 Driver'}
        </span>
      </div>

      {editing ? (
        <div style={{ padding: '0 16px 16px' }}>
          <div className="field">
            <label className="label">Full Name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="field">
            <label className="label">Phone</label>
            <input className="input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(408) 555-0000" />
          </div>
          <div className="field">
            <label className="label">Default Address</label>
            <input className="input" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St, San Jose, CA" />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEditing(false)}>Cancel</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      ) : (
        <>
          {/* Lifetime stats */}
          {user?.role === 'customer' && (() => {
            const orders = JSON.parse(localStorage.getItem('carnemx_orders') || '[]')
            const allOrders = [...orders, { total: 55.35 }, { total: 55.35 }]
            const totalSpent = allOrders.reduce((s, o) => s + (o.total || 0), 0)
            return (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, margin: '0 16px 16px' }}>
                <div className="stat-card" style={{ textAlign: 'center', padding: '12px 8px' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>{allOrders.length}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Orders</div>
                </div>
                <div className="stat-card" style={{ textAlign: 'center', padding: '12px 8px' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--success)' }}>${totalSpent.toFixed(0)}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Spent</div>
                </div>
                <div className="stat-card" style={{ textAlign: 'center', padding: '12px 8px' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--warning)' }}>{favorites.length}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Saved</div>
                </div>
              </div>
            )
          })()}

          {/* Info cards */}
          <div className="card" style={{ margin: '0 16px 16px' }}>
            <div className="list-item">
              <Phone size={16} color="var(--text-muted)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Phone</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{user?.phone || 'Not set'}</div>
              </div>
            </div>
            <div className="list-item">
              <MapPin size={16} color="var(--text-muted)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Default Address</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{user?.address || 'Not set'}</div>
              </div>
            </div>
          </div>

          <button className="btn btn-secondary btn-full" style={{ margin: '0 16px 16px', width: 'calc(100% - 32px)' }} onClick={() => setEditing(true)}>
            Edit Profile
          </button>

          {/* Settings */}
          <div className="card" style={{ margin: '0 16px 16px' }}>
            {menuItems.map(item => (
              <div key={item.label} className="list-item" onClick={item.action}>
                <item.icon size={18} color="var(--text-muted)" />
                <span style={{ flex: 1, fontSize: 15 }}>{item.label}</span>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            ))}
          </div>

          {/* Appearance toggle */}
          <div style={{ margin: '0 16px 8px', padding: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {theme === 'dark' ? <Moon size={18} color="var(--text-muted)" /> : <Sun size={18} color="var(--text-muted)" />}
              <div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>Appearance</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</div>
              </div>
            </div>
            <button onClick={toggleTheme} style={{ padding: '6px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(232,93,4,0.12)', border: '1.5px solid var(--primary)', color: 'var(--primary-light)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>

          {/* Language toggle */}
          <div style={{ margin: '0 16px 16px', padding: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Globe size={18} color="var(--text-muted)" />
              <div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>Language</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{lang === 'en' ? 'English' : 'Español'}</div>
              </div>
            </div>
            <button onClick={toggleLang} style={{ padding: '6px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(232,93,4,0.12)', border: '1.5px solid var(--primary)', color: 'var(--primary-light)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              {lang === 'en' ? 'ES' : 'EN'}
            </button>
          </div>

          {/* Logout */}
          <div style={{ padding: '0 16px' }}>
            <button className="btn btn-danger btn-full" onClick={handleLogout}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', padding: '16px 0' }}>
            CarneMX v1.0.0 · Tu Carnicería, Entregada
          </p>
        </>
      )}
    </div>
  )
}
