import { Clock, ChevronRight } from 'lucide-react'
import { formatPrice, formatRelativeTime } from '../../utils/formatters'
import { ORDER_STATUS_LABELS } from '../../utils/constants'

const STATUS_COLORS = {
  pending: 'var(--warning)',
  confirmed: 'var(--primary-light)',
  preparing: 'var(--primary)',
  ready: 'var(--success)',
  picked_up: 'var(--success)',
  delivered: 'var(--text-muted)',
  cancelled: 'var(--error)',
}

export function VendorOrderItem({ order, onAction }) {
  const color = STATUS_COLORS[order.status] || 'var(--text-muted)'
  return (
    <div className="card" style={{ marginBottom: 10 }}>
      <div style={{ padding: '12px 14px' }}>
        <div className="row-between" style={{ marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Order #{order.id.slice(-4).toUpperCase()}</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{order.customerName || 'Customer'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="price" style={{ fontSize: 16 }}>{formatPrice(order.total)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatRelativeTime(order.createdAt)}</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>
          {order.items?.map(i => `${i.quantity} lb ${i.name}`).join(', ')}
        </div>
        <div className="row-between">
          <span className="chip" style={{ background: `${color}18`, color, borderColor: `${color}40`, fontSize: 12 }}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
          {onAction && order.status !== 'delivered' && order.status !== 'cancelled' && (
            <button className="btn btn-primary btn-sm" onClick={() => onAction(order)} style={{ fontSize: 12 }}>
              {order.status === 'pending' ? 'Confirm' : order.status === 'confirmed' ? 'Mark Preparing' : 'Mark Ready'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
