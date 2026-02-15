import { SEO } from '../components/SEO.jsx'
import { reviews } from '../data/reviews.js'
import { siteConfig } from '../site.config.js'
import '../styles/reviews.css'

export function Reviews() {
  return (
    <>
      <SEO
        title="Reviews"
        description={`What our customers say about ${siteConfig.companyName}. Real reviews from homeowners in the area.`}
      />
      <section className="page-hero">
        <div className="container">
          <h1>Customer Reviews</h1>
          <p>Hear from homeowners we've worked with.</p>
        </div>
      </section>
      <section className="reviews-section section section--alt">
        <div className="container">
          <div className="reviews-grid">
            {reviews.map((review) => (
              <blockquote key={review.id} className="review-card">
                <div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>
                  {'★'.repeat(review.rating)}
                </div>
                <p className="review-text">"{review.text}"</p>
                <footer className="review-meta">
                  <cite>{review.author}</cite>
                  <span>{review.location}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
