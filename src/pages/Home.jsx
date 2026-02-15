import { SEO } from '../components/SEO.jsx'
import { Hero } from '../components/Hero.jsx'
import { ServicesGrid } from '../components/ServicesGrid.jsx'
import { siteConfig } from '../site.config.js'

export function Home() {
  return (
    <>
      <SEO
        title="Home"
        description={`${siteConfig.companyName} – ${siteConfig.tagline}. ${siteConfig.serviceAreaDescription} Call ${siteConfig.phone} for a free estimate.`}
      />
      <Hero />
      <ServicesGrid />
    </>
  )
}
