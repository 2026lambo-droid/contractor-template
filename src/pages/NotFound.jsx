import { Link } from 'react-router-dom'
import { SEO } from '../components/SEO.jsx'
import '../styles/not-found.css'

export function NotFound() {
  return (
    <>
      <SEO title="Page not found" description="The page you're looking for doesn't exist." />
      <section className="not-found section section--alt">
        <div className="container">
          <h1>Page not found</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <Link to="/" className="btn btn-primary">Back to home</Link>
        </div>
      </section>
    </>
  )
}
