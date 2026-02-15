import { Link } from 'react-router-dom'
import { SEO } from '../components/SEO.jsx'
import { siteConfig } from '../site.config.js'
import '../styles/about.css'

export function About() {
  return (
    <>
      <SEO
        title="About Us"
        description={`${siteConfig.companyName} – ${siteConfig.tagline}. Serving the area since ${siteConfig.yearEstablished}. Licensed, insured, and committed to quality.`}
      />
      <section className="page-hero">
        <div className="container">
          <h1>About Us</h1>
          <p>Your trusted partner for construction and renovation.</p>
        </div>
      </section>
      <section className="about-content section section--alt">
        <div className="container about-grid">
          <div>
            <h2>Who We Are</h2>
            <p>
              {siteConfig.companyName} has been serving the community since {siteConfig.yearEstablished}.
              We specialize in {siteConfig.tagline.toLowerCase()} with a focus on quality craftsmanship,
              clear communication, and on-time completion.
            </p>
            <p>
              Our team is licensed, insured, and committed to treating your home with respect.
              We handle everything from small repairs to full remodels and room additions.
            </p>
          </div>
          <div>
            <h2>Why Choose Us</h2>
            <ul className="about-list">
              <li>Licensed and insured</li>
              <li>Transparent pricing and detailed estimates</li>
              <li>Respectful of your schedule and property</li>
              <li>Quality materials and workmanship</li>
            </ul>
            <Link to="/contact" className="btn btn-primary">Get in touch</Link>
          </div>
        </div>
      </section>
    </>
  )
}
