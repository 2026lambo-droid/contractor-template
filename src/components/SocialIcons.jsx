/**
 * Inline SVG social icons. Renders Facebook, Instagram, TikTok.
 * Link when URL exists; disabled style when missing.
 * Inline styles ensure visibility even if CSS fails to load.
 */
const ICON_SIZE = 24
const DEFAULT_ICON_COLOR = '#0a0a0a'

const svgProps = (fill = DEFAULT_ICON_COLOR) => ({ width: ICON_SIZE, height: ICON_SIZE, viewBox: '0 0 24 24', fill, 'aria-hidden': true })

const FacebookIcon = ({ fill }) => (
  <svg {...svgProps(fill)}>
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
  </svg>
)

const InstagramIcon = ({ fill }) => (
  <svg {...svgProps(fill)}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)

const TikTokIcon = ({ fill }) => (
  <svg {...svgProps(fill)}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86 4.43v-9.1a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
)

const iconWrapStyle = (iconColor) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: ICON_SIZE,
  height: ICON_SIZE,
  color: iconColor,
})

export function SocialIcons({ social, className = '', iconColor = DEFAULT_ICON_COLOR }) {
  const obj = social && typeof social === 'object' ? social : {}
  const facebook = typeof obj.facebook === 'string' ? obj.facebook.trim() : ''
  const instagram = typeof obj.instagram === 'string' ? obj.instagram.trim() : ''
  const tiktok = typeof obj.tiktok === 'string' ? obj.tiktok.trim() : ''

  const wrap = (url, label, Icon) => {
    if (url) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          style={iconWrapStyle(iconColor)}
          aria-label={label}
        >
          <Icon fill={iconColor} />
        </a>
      )
    }
    return (
      <span className="social-icon social-icon--disabled" style={{ ...iconWrapStyle(iconColor), opacity: 0.45 }} aria-label={`${label} (not set)`}>
        <Icon fill={iconColor} />
      </span>
    )
  }

  return (
    <div
      className={`social-icons ${className}`.trim()}
      role="list"
      style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}
    >
      {wrap(facebook, 'Facebook', FacebookIcon)}
      {wrap(instagram, 'Instagram', InstagramIcon)}
      {wrap(tiktok, 'TikTok', TikTokIcon)}
    </div>
  )
}
