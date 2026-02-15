import { Link } from 'react-router-dom'
import { SEO } from '../components/SEO.jsx'
import { services } from '../data/services.js'
import '../styles/services-grid.css'

export function ServicesIndex() {
  return (
    <>
      <SEO
        title="Services"
        description="Kitchen remodeling, bathroom remodeling, room additions, decks and patios, siding and roofing, and general contracting. Licensed and insured."
      />
      <section className="page-hero">
        <div className="container">
          <h1>Our Services</h1>
          <p>Quality construction and renovation for your home or business.</p>
        </div>
      </section>
      <section className="services-grid-section section section--alt">
        <div className="container">
          <div className="services-grid">
            {services.map((service) => (
              <article key={service.slug} className="service-card">
                <div className="service-card-image">
                  <span className="service-icon" aria-hidden>{service.icon}</span>
                </div>
                <div className="service-card-body">
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-desc">{service.shortDesc}</p>
                  <div className="service-card-actions">
                    <Link to={`/services/${service.slug}`} className="service-card-link">
                      Learn more
                    </Link>
                    <Link to="/contact" className="btn btn-ghost-dark service-card-btn">
                      Request quote
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
