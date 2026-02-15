/**
 * Social bar — rendered via portal into #social-top-bar in index.html
 * so it is always the first visible element and cannot be hidden by layout.
 */
import { createPortal } from 'react-dom'
import { siteConfig } from '../site.config.js'
import { SocialIcons } from './SocialIcons.jsx'
import '../styles/social-top-bar.css'

const barStyle = {
  width: '100%',
  background: '#0a0a0a',
  color: '#fff',
  minHeight: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '8px 24px',
  gap: '16px',
  flexWrap: 'wrap',
  boxSizing: 'border-box',
}

export function SocialTopBar() {
  const el = typeof document !== 'undefined' ? document.getElementById('social-top-bar') : null
  if (!el) return null

  return createPortal(
    <div className="social-top-bar" role="banner" style={barStyle}>
      <span className="social-top-bar-label" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
        Follow us
      </span>
      <SocialIcons social={siteConfig?.social} className="social-top-bar-icons" iconColor="#fff" />
    </div>,
    el
  )
}
