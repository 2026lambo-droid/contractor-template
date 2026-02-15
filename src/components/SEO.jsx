import { useEffect } from 'react'
import { siteConfig } from '../site.config.js'

/**
 * Sets document title and meta description for the current page.
 */
export function SEO({ title, description }) {
  useEffect(() => {
    const siteName = siteConfig?.companyName ?? 'Contractor'
    document.title = title ? `${title} | ${siteName}` : siteName
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', description ?? '')
  }, [title, description])
  return null
}
