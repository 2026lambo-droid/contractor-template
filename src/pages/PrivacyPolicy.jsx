import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function PrivacyPolicy() {
  const navigate = useNavigate()

  return (
    <div className="page" style={{ maxWidth: 430, margin: '0 auto' }}>
      <div style={{ position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 10, padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: 4 }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Privacy Policy</h1>
      </div>

      <div style={{ padding: '20px 20px 40px', lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: 14 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 24 }}>Last updated: July 1, 2026</p>

        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Overview</h2>
          <p>Carnitas El Rincón ("we", "our", "us") connects customers with our locations and delivery drivers. This policy explains what information we collect, how we use it, and your rights.</p>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Information We Collect</h2>
          <p><strong>Account information:</strong> Name, email address, and password when you register.</p>
          <p style={{ marginTop: 8 }}><strong>Order information:</strong> Delivery address, items ordered, and payment details (processed securely via Stripe — we never store card numbers).</p>
          <p style={{ marginTop: 8 }}><strong>Location:</strong> Delivery address you provide. We do not track your device location in the background.</p>
          <p style={{ marginTop: 8 }}><strong>Usage data:</strong> Pages visited and features used, to improve the app experience.</p>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>How We Use Your Information</h2>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            <li style={{ marginBottom: 6 }}>Process and deliver your orders</li>
            <li style={{ marginBottom: 6 }}>Send order status updates and notifications</li>
            <li style={{ marginBottom: 6 }}>Allow vendors to fulfill your orders</li>
            <li style={{ marginBottom: 6 }}>Improve app features and performance</li>
            <li style={{ marginBottom: 6 }}>Comply with legal obligations</li>
          </ul>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Information Sharing</h2>
          <p>We share your information only as needed to fulfill orders:</p>
          <ul style={{ paddingLeft: 16, margin: '8px 0 0' }}>
            <li style={{ marginBottom: 6 }}><strong>Vendors</strong> receive your name and order details to prepare your order</li>
            <li style={{ marginBottom: 6 }}><strong>Drivers</strong> receive your delivery address to complete delivery</li>
            <li style={{ marginBottom: 6 }}><strong>Stripe</strong> processes payments securely</li>
            <li style={{ marginBottom: 6 }}><strong>Firebase (Google)</strong> hosts our backend and authentication</li>
          </ul>
          <p style={{ marginTop: 8 }}>We do not sell your personal information.</p>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Data Retention</h2>
          <p>We retain your account and order history for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us.</p>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. Contact us at the address below to exercise these rights.</p>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Children's Privacy</h2>
          <p>Carnitas El Rincón is not intended for children under 13. We do not knowingly collect information from children under 13.</p>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Changes to This Policy</h2>
          <p>We may update this policy from time to time. We will notify you of significant changes via the app or email.</p>
        </section>

        <section>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Contact Us</h2>
          <p>Questions about this policy? Email us at <span style={{ color: 'var(--primary)' }}>privacy@elrincon.com</span></p>
        </section>
      </div>
    </div>
  )
}
