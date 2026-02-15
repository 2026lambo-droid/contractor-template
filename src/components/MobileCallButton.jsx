import { siteConfig } from '../site.config.js'
import '../styles/mobile-cta.css'

export function MobileCallButton() {
  return (
    <a
      href={siteConfig.phoneHref}
      className="mobile-call-button"
      aria-label="Call us"
    >
      <span className="mobile-call-icon" aria-hidden>📞</span>
      <span className="mobile-call-text">Call {siteConfig.phone}</span>
    </a>
  )
}
