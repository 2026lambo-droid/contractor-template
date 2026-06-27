export const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

export const formatDate = (date) => {
  const d = date instanceof Date ? date : new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  }).format(d)
}

export const formatRelativeTime = (date) => {
  const d = date instanceof Date ? date : new Date(date)
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return formatDate(d)
}

export const formatLbs = (lbs) => `${lbs} lb${lbs !== 1 ? 's' : ''}`

export const calcSubtotal = (items) =>
  items.reduce((sum, item) => sum + item.pricePerLb * item.quantity, 0)

export const calcServiceFee = (subtotal) => subtotal * 0.05

export const calcTotal = (subtotal, deliveryFee = 4.99) =>
  subtotal + calcServiceFee(subtotal) + deliveryFee

export const estimateDeliveryTime = (status) => {
  const times = {
    pending: '35–50 min',
    confirmed: '30–45 min',
    preparing: '20–35 min',
    ready: '10–20 min',
    picked_up: '5–15 min',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  }
  return times[status] || '35–50 min'
}
