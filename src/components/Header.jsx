import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { siteConfig } from '../site.config.js'
import { SocialIcons } from './SocialIcons.jsx'
import '../styles/header.css'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/service-areas', label: 'Service Areas' },
  { to: '/contact', label: 'Contact' },
]

export function Header() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/'
    if (to === '/services') return location.pathname === '/services' || location.pathname.startsWith('/services/')
    return location.pathname === to
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo" onClick={closeMenu}>
          {siteConfig?.companyName ?? 'Contractor'}
        </Link>
        <nav className="nav-desktop">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={isActive(to) ? 'active' : ''}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-social-cta">
          <a
            href={siteConfig?.phoneHref ?? 'tel:'}
            className="header-cta"
            aria-label="Call us"
          >
            Call {siteConfig?.phone ?? ''}
          </a>
        </div>
        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>
      </div>
      <div className={`nav-mobile ${menuOpen ? 'nav-mobile--open' : ''}`} aria-hidden={!menuOpen}>
        <nav className="nav-mobile-inner">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={isActive(to) ? 'active' : ''}
              onClick={closeMenu}
            >
              {label}
            </Link>
          ))}
          <a href={siteConfig?.phoneHref ?? 'tel:'} className="nav-mobile-cta" onClick={closeMenu}>
            Call {siteConfig?.phone ?? ''}
          </a>
          <div className="nav-mobile-social">
            <span className="nav-mobile-social-label">Follow us</span>
            <SocialIcons social={siteConfig?.social} className="nav-mobile-social-icons" />
          </div>
        </nav>
      </div>
    </header>
  )
}
