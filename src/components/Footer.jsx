import { Link } from 'react-router-dom'
import { siteConfig } from '../site.config.js'
import '../styles/footer.css'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">{siteConfig.companyName}</span>
          <p>{siteConfig.tagline}</p>
          <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        </div>
        <div>
          <nav className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/services">Services</Link>
            <Link to="/about">About</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/reviews">Reviews</Link>
            <Link to="/service-areas">Service Areas</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          {(siteConfig.social?.facebook || siteConfig.social?.instagram || siteConfig.social?.tiktok) ? (
            <div className="footer-social-wrap">
              <span className="footer-social-label">Follow us</span>
              <div className="footer-social">
                {siteConfig.social?.facebook && (
                  <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="footer-social-btn">Facebook</a>
                )}
                {siteConfig.social?.instagram && (
                  <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="footer-social-btn">Instagram</a>
                )}
                {siteConfig.social?.tiktok && (
                  <a href={siteConfig.social.tiktok} target="_blank" rel="noopener noreferrer" className="footer-social-btn">TikTok</a>
                )}
              </div>
            </div>
          ) : null}
        </div>
        <div className="footer-legal">
          <p>{siteConfig.addressLine}</p>
          <p className="copyright">© {new Date().getFullYear()} {siteConfig.companyName}</p>
        </div>
      </div>
    </footer>
  )
}
