import { useParams, Link } from 'react-router-dom'
import { SEO } from '../components/SEO.jsx'
import { getServiceBySlug } from '../data/services.js'
import '../styles/service-detail.css'

export function ServiceDetail() {
  const { slug } = useParams()
  const service = getServiceBySlug(slug)

  if (!service) {
    return (
      <section className="not-found section section--alt">
        <div className="container">
          <h1>Service not found</h1>
          <p>That service doesn't exist or may have been moved.</p>
          <Link to="/services" className="btn btn-primary">View all services</Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <SEO
        title={service.title}
        description={service.description}
      />
      <section className="page-hero page-hero--small">
        <div className="container">
          <Link to="/services" className="back-link">← Services</Link>
          <h1>{service.title}</h1>
          <p className="service-detail-short">{service.shortDesc}</p>
        </div>
      </section>
      <section className="service-detail-content section section--alt">
        <div className="container">
          <div className="service-detail-body">
            <span className="service-detail-icon" aria-hidden>{service.icon}</span>
            <p>{service.description}</p>
            <Link to="/contact" className="btn btn-primary">Get a free quote</Link>
          </div>
        </div>
      </section>
    </>
  )
}
