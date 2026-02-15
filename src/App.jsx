/** Contractor template — router + all pages */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { MobileCallButton } from './components/MobileCallButton.jsx'
import { JsonLd } from './components/JsonLd.jsx'
import { Home } from './pages/Home.jsx'
import { ServicesIndex } from './pages/ServicesIndex.jsx'
import { ServiceDetail } from './pages/ServiceDetail.jsx'
import { About } from './pages/About.jsx'
import { Gallery } from './pages/Gallery.jsx'
import { Reviews } from './pages/Reviews.jsx'
import { ServiceAreas } from './pages/ServiceAreas.jsx'
import { Contact } from './pages/Contact.jsx'
import { NotFound } from './pages/NotFound.jsx'
import './styles/global.css'

function App() {
  return (
    <BrowserRouter>
      <JsonLd />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesIndex />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/service-areas" element={<ServiceAreas />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileCallButton />
    </BrowserRouter>
  )
}

export default App
