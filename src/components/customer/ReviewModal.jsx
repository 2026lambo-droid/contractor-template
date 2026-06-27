import { useState } from 'react'
import { Star } from 'lucide-react'

export function ReviewModal({ order, onClose, onSubmit }) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 800))
    const review = {
      id: `rev-${Date.now()}`,
      orderId: order.id,
      vendorId: order.vendorId,
      rating,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    }
    const existing = JSON.parse(localStorage.getItem('carnemx_reviews') || '[]')
    localStorage.setItem('carnemx_reviews', JSON.stringify([review, ...existing]))
    onSubmit?.(review)
    onClose()
  }

  return (
    <div className="bottom-sheet-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bottom-sheet">
        <div className="bottom-sheet-handle" />
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>How was your order?</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
          from <strong style={{ color: 'var(--text-secondary)' }}>{order.vendorName}</strong>
        </p>

        {/* Star picker */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, transition: 'transform 0.1s' }}
            >
              <Star
                size={36}
                fill={(hovered || rating) >= n ? 'var(--warning)' : 'transparent'}
                color={(hovered || rating) >= n ? 'var(--warning)' : 'var(--border)'}
                style={{ transform: (hovered || rating) >= n ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.1s, fill 0.1s' }}
              />
            </button>
          ))}
        </div>

        {rating > 0 && (
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16, fontWeight: 600 }}>
            {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][rating]}
          </p>
        )}

        <div className="field">
          <label className="label">Write a review (optional)</label>
          <textarea
            className="input"
            rows={3}
            placeholder="Tell others about the quality, freshness, and service..."
            value={text}
            onChange={e => setText(e.target.value)}
            style={{ resize: 'none', lineHeight: 1.5 }}
          />
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Skip</button>
          <button
            className="btn btn-gradient"
            style={{ flex: 2, opacity: rating === 0 ? 0.5 : 1 }}
            disabled={rating === 0 || submitting}
            onClick={handleSubmit}
          >
            {submitting ? <><span className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> Submitting...</> : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  )
}
