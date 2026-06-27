import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, MapPin, Phone, LogOut, ChevronRight, Bell, Shield, HelpCircle } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'

export function Profile() {
  const { user, logout, updateUser } = useAuth()
  const { toast } = useToast()
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
