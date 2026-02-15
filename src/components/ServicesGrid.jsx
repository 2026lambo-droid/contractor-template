import { Link } from 'react-router-dom'
import { services } from '../data/services.js'
import '../styles/services-grid.css'

export function ServicesGrid() {
  return (
    <section className="services-grid-section section section--alt">
      <div className="container">
        <h2 className="section-title">Our Services</h2>
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
  )
}
