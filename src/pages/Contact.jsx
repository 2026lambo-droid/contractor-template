import { useState } from 'react'
import { SEO } from '../components/SEO.jsx'
import { siteConfig } from '../site.config.js'
import '../styles/contact.css'

export function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <SEO
        title="Contact"
        description={`Contact ${siteConfig.companyName} for a free estimate. Call ${siteConfig.phone} or send a message. ${siteConfig.addressLine}.`}
      />
      <section className="page-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get a free estimate or ask a question.</p>
        </div>
      </section>
      <section className="contact-section section">
        <div className="container contact-grid">
          <div className="contact-info">
            <h2>Get in touch</h2>
            <p><strong>Phone</strong><br /><a href={siteConfig.phoneHref}>{siteConfig.phone}</a></p>
            <p><strong>Email</strong><br /><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p>
            <p><strong>Address</strong><br />{siteConfig.addressLine}</p>
            <p><strong>Hours</strong><br />{siteConfig.businessHours}</p>
          </div>
          <div className="contact-form-wrap">
            {submitted ? (
              <p className="form-success">Thanks! We'll get back to you soon.</p>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <label>
                  Name *
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </label>
                <label>
                  Email *
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </label>
                <label>
                  Phone
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                </label>
                <label>
                  Message *
                  <textarea name="message" rows={5} value={formData.message} onChange={handleChange} required />
                </label>
                <button type="submit" className="btn btn-primary">Send message</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
