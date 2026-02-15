import { SEO } from '../components/SEO.jsx'
import { serviceAreas } from '../data/serviceAreas.js'
import { siteConfig } from '../site.config.js'
import '../styles/service-areas.css'

export function ServiceAreas() {
  return (
    <>
      <SEO
        title="Service Areas"
        description={`${siteConfig.companyName} serves ${serviceAreas.map(a => a.name).join(', ')} and surrounding areas. ${siteConfig.serviceAreaDescription}`}
      />
      <section className="page-hero">
        <div className="container">
          <h1>Service Areas</h1>
          <p>{siteConfig.serviceAreaDescription}</p>
        </div>
      </section>
      <section className="service-areas-section section section--alt">
        <div className="container">
          <div className="areas-grid">
            {serviceAreas.map((area) => (
              <div key={area.name} className="area-card">
                <h3>{area.name}</h3>
                <p>{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
