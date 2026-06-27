// Cross-role order communication via localStorage + BroadcastChannel
// In production replace with Firestore onSnapshot listeners

const CHANNEL_NAME = 'carnemx_orders'
const STORAGE_KEY = 'carnemx_vendor_orders'

let channel = null

function getChannel() {
  if (typeof BroadcastChannel !== 'undefined' && !channel) {
    try { channel = new BroadcastChannel(CHANNEL_NAME) } catch {}
  }
  return channel
}

export function publishOrder(order) {
  const vendorOrders = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  const key = order.vendorId
  vendorOrders[key] = [order, ...(vendorOrders[key] || [])].slice(0, 50)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vendorOrders))

  try {
    const ch = getChannel()
    if (ch) ch.postMessage({ type: 'NEW_ORDER', order })
  } catch {}
}

export function getVendorOrders(vendorId) {
  const vendorOrders = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  return (vendorOrders[vendorId] || []).map(o => ({ ...o, createdAt: new Date(o.createdAt) }))
}

export function updateOrderStatus(orderId, vendorId, status) {
  const vendorOrders = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  if (vendorOrders[vendorId]) {
    vendorOrders[vendorId] = vendorOrders[vendorId].map(o =>
      o.id === orderId ? { ...o, status } : o
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vendorOrders))
  }

  const customerOrders = JSON.parse(localStorage.getItem('carnemx_orders') || '[]')
  const updated = customerOrders.map(o => o.id === orderId ? { ...o, status } : o)
  localStorage.setItem('carnemx_orders', JSON.stringify(updated))

  try {
    const ch = getChannel()
    if (ch) ch.postMessage({ type: 'STATUS_UPDATE', orderId, status })
  } catch {}
}

export function subscribeToOrders(vendorId, callback) {
  const ch = getChannel()
  if (!ch) return () => {}

  const handler = ({ data }) => {
    if (data?.type === 'NEW_ORDER' && data.order?.vendorId === vendorId) {
      callback(data.order)
    }
  }
  ch.addEventListener('message', handler)
  return () => ch.removeEventListener('message', handler)
}
