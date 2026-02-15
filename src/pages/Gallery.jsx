import { SEO } from '../components/SEO.jsx'
import { galleryItems } from '../data/gallery.js'
import { siteConfig } from '../site.config.js'
import '../styles/gallery.css'

export function Gallery() {
  return (
    <>
      <SEO
        title="Gallery"
        description={`Photo gallery of projects by ${siteConfig.companyName}. Kitchen remodels, bathrooms, decks, and more.`}
      />
      <section className="page-hero">
        <div className="container">
          <h1>Project Gallery</h1>
          <p>A selection of our completed work.</p>
        </div>
      </section>
      <section className="gallery-section section section--alt">
        <div className="container">
          <div className="gallery-grid">
            {galleryItems.map((item) => (
              <div key={item.id} className="gallery-item">
                <div className="gallery-item-image">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <div className="gallery-caption">
                  <strong>{item.title}</strong>
                  <span>{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
