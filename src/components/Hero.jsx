import { Link } from 'react-router-dom'
import { siteConfig } from '../site.config.js'
import '../styles/hero.css'

export function Hero({ title, subtitle, showCta = true }) {
  const bgImage = siteConfig?.heroBackgroundImage

  return (
    <section
      className="hero"
      style={bgImage ? { '--hero-bg': `url(${bgImage})` } : undefined}
    >
      <div className="hero-overlay" aria-hidden />
      <div className="hero-inner">
        <h1 className="hero-title">{title ?? siteConfig?.companyName ?? 'Contractor'}</h1>
        <p className="hero-subtitle">{subtitle ?? siteConfig?.tagline ?? ''}</p>
        {showCta && (
          <>
            <div className="hero-trust">
              {siteConfig?.ratingDisplay && (
                <span className="hero-chip">
                  <span className="hero-chip-star" aria-hidden>★</span> {siteConfig?.ratingDisplay}
                </span>
              )}
              {siteConfig?.yearEstablished && (
                <span className="hero-chip">Since {siteConfig?.yearEstablished}</span>
              )}
              {siteConfig?.insuredLabel && (
                <span className="hero-chip">{siteConfig?.insuredLabel}</span>
              )}
            </div>
            <div className="hero-cta">
              <Link to="/contact" className="btn btn-primary">
                Get a Free Quote
              </Link>
              <a href={siteConfig?.phoneHref ?? 'tel:'} className="btn btn-ghost">
                Call {siteConfig?.phone ?? ''}
              </a>
            </div>
          </>
        )}
      </div>
      {showCta && (siteConfig?.phone || siteConfig?.businessHours) && (
        <aside className="hero-quick-info" aria-label="Quick contact info">
          <div className="hero-quick-info-inner">
            {siteConfig?.phone && (
              <a href={siteConfig?.phoneHref ?? 'tel:'} className="hero-quick-info-item">
                <span className="hero-quick-info-label">Call</span>
                <span className="hero-quick-info-value">{siteConfig?.phone}</span>
              </a>
            )}
            {siteConfig?.businessHours && (
              <div className="hero-quick-info-item">
                <span className="hero-quick-info-label">Hours</span>
                <span className="hero-quick-info-value">{siteConfig?.businessHours}</span>
              </div>
            )}
            <Link to="/contact" className="hero-quick-info-cta">Free estimates</Link>
          </div>
        </aside>
      )}
    </section>
  )
}
