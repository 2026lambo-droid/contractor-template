import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell } from 'lucide-react'
import { APP_NAME } from '../../utils/constants'

export function AppHeader({ title, back, actions, transparent }) {
  const navigate = useNavigate()
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: transparent ? 'transparent' : 'rgba(15,10,8,0.95)',
      backdropFilter: transparent ? 'none' : 'blur(12px)',
      borderBottom: transparent ? 'none' : '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '0 16px', height: 'var(--header-h)',
    }}>
      {back && (
        <button onClick={() => navigate(-1)} style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text)', flexShrink: 0,
        }}>
          <ArrowLeft size={18} />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title ? (
          <h1 style={{ fontSize: 17, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {title}
          </h1>
        ) : (
          <span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)' }} className="fire-text">
            {APP_NAME}
          </span>
        )}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
    </header>
  )
}

export function IconBtn({ icon: Icon, onClick, badge }) {
  return (
    <button onClick={onClick} style={{ position: 'relative', width: 36, height: 36, borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)' }}>
      <Icon size={18} />
      {badge > 0 && (
        <span style={{ position: 'absolute', top: -4, right: -4 }} className="badge">{badge}</span>
      )}
    </button>
  )
}
