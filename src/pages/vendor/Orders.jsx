import { useState, useEffect } from 'react'
import { AppHeader } from '../../components/common/AppHeader'
import { VendorOrderItem } from '../../components/vendor/OrderItem'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { MOCK_VENDORS } from '../../utils/mockData'
import { ORDER_STATUS_LABELS } from '../../utils/constants'
import { getVendorOrders, updateOrderStatus, subscribeToOrders } from '../../services/orderBus'

const SEED_ORDERS = [
  { id: 'vord-001', customerName: 'Maria García', items: [{ name: 'Carne Asada Premium', quantity: 3, pricePerLb: 12.99 }, { name: 'Chorizo Rojo', quantity: 1, pricePerLb: 8.99 }], total: 55.35, status: 'pending', createdAt: new Date(Date.now() - 5 * 60000) },
  { id: 'vord-002', customerName: 'José Ramírez', items: [{ name: 'Short Ribs', quantity: 4, pricePerLb: 10.49 }], total: 46.95, status: 'preparing', createdAt: new Date(Date.now() - 22 * 60000) },
  { id: 'vord-003', customerName: 'Ana López', items: [{ name: 'Carnitas', quantity: 5, pricePerLb: 11.99 }], total: 62.90, status: 'delivered', createdAt: new Date(Date.now() - 3 * 3600000) },
  { id: 'vord-004', customerName: 'Carlos Mendez', items: [{ name: 'Al Pastor', quantity: 2, pricePerLb: 10.99 }], total: 26.97, status: 'cancelled', createdAt: new Date(Date.now() - 5 * 3600000) },
]

const STATUS_FLOW = { pending: 'confirmed', confirmed: 'preparing', preparing: 'ready', ready: 'picked_up' }

export function VendorOrders() {
  const { user } = useAuth()
  const { toast } = useToast()
  const vendor = MOCK_VENDORS.find(v => v.id === user?.vendorId) || MOCK_VENDORS[0]
  const [orders, setOrders] = useState(() => {
    const live = getVendorOrders(vendor?.id)
    const liveIds = new Set(live.map(o => o.id))
    return [...live, ...SEED_ORDERS.filter(o => !liveIds.has(o.id))]
  })
  const [tab, setTab] = useState('active')

  useEffect(() => {
    const unsub = subscribeToOrders(vendor?.id, (newOrder) => {
      setOrders(prev => {
        if (prev.find(o => o.id === newOrder.id)) return prev
        return [{ ...newOrder, createdAt: new Date(newOrder.createdAt) }, ...prev]
      })
      toast(`New order from ${newOrder.customerName}! 🔔`, 'success')
    })
    return unsub
  }, [vendor?.id])

  const active = orders.filter(o => !['delivered', 'cancelled'].includes(o.status))
  const history = orders.filter(o => ['delivered', 'cancelled'].includes(o.status))
  const shown = tab === 'active' ? active : history

  const advanceStatus = (order) => {
    const next = STATUS_FLOW[order.status]
    if (!next) return
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: next } : o))
    updateOrderStatus(order.id, vendor?.id, next)
    toast(`Order #${order.id.slice(-4)} → ${ORDER_STATUS_LABELS[next]}`, 'success')
  }

  return (
    <div className="page animate-fadeIn">
      <AppHeader title="Orders" />
      <div style={{ padding: '12px 16px' }}>
        <div className="tabs">
          <button className={`tab ${tab === 'active' ? 'tab-active' : ''}`} onClick={() => setTab('active')}>
            Active {active.length > 0 && `(${active.length})`}
          </button>
          <button className={`tab ${tab === 'history' ? 'tab-active' : ''}`} onClick={() => setTab('history')}>
            History
          </button>
        </div>
      </div>
      <div style={{ padding: '0 16px' }}>
        {shown.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-title">{tab === 'active' ? 'No active orders' : 'No order history'}</div>
          </div>
        ) : shown.map(o => <VendorOrderItem key={o.id} order={o} onAction={tab === 'active' ? advanceStatus : null} />)}
      </div>
    </div>
  )
}
