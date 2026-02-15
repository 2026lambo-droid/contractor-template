import { siteConfig } from '../site.config.js'

/**
 * Injects LocalBusiness JSON-LD schema into the document.
 */
export function JsonLd() {
  const address = siteConfig.address || {}
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteConfig.companyName || '',
    description: siteConfig.tagline || '',
    ...(siteConfig.phone && { telephone: siteConfig.phone }),
    ...(siteConfig.email && { email: siteConfig.email }),
    ...((address.street || address.city) && {
      address: {
        '@type': 'PostalAddress',
        ...(address.street && { streetAddress: address.street }),
        ...(address.city && { addressLocality: address.city }),
        ...(address.state && { addressRegion: address.state }),
        ...(address.zip && { postalCode: address.zip }),
      },
    }),
    ...(siteConfig.businessHours && { openingHours: siteConfig.businessHours }),
    ...(siteConfig.yearEstablished != null && { foundingDate: String(siteConfig.yearEstablished) }),
    ...(siteConfig.serviceAreaDescription && { areaServed: siteConfig.serviceAreaDescription }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
