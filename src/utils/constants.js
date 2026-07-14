export const APP_NAME = 'El Rincón'
export const APP_TAGLINE = 'Auténticas Carnitas, Entregadas'

export const USER_ROLES = {
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
  DRIVER: 'driver',
}

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  PICKED_UP: 'picked_up',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

export const ORDER_STATUS_LABELS = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready for Pickup',
  picked_up: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const MEAT_CATEGORIES = [
  { id: 'trays', label: 'Party Trays', emoji: '🫕' },
  { id: 'combos', label: 'Combos', emoji: '🍽️' },
  { id: 'per-pound', label: 'Por Libra', emoji: '⚖️' },
  { id: 'tacos', label: 'Tacos', emoji: '🌮' },
  { id: 'burritos', label: 'Burritos', emoji: '🌯' },
  { id: 'quesadillas', label: 'Quesadillas', emoji: '🫓' },
  { id: 'plates', label: 'Platillos', emoji: '🍛' },
  { id: 'weekend', label: 'Fin de Semana', emoji: '🐔' },
  { id: 'beverages', label: 'Bebidas', emoji: '🥤' },
]

export const DELIVERY_ZONES = [
  { id: 'san-jose', city: 'San Jose', region: 'Bay Area' },
  { id: 'hayward', city: 'Hayward', region: 'Bay Area' },
  { id: 'redwood-city', city: 'Redwood City', region: 'Bay Area' },
  { id: 'san-francisco', city: 'San Francisco', region: 'Bay Area' },
  { id: 'vallejo', city: 'Vallejo', region: 'Bay Area' },
  { id: 'sacramento', city: 'Sacramento', region: 'Central Valley' },
  { id: 'woodland', city: 'Woodland', region: 'Central Valley' },
  { id: 'lodi', city: 'Lodi', region: 'Central Valley' },
  { id: 'fairfield', city: 'Fairfield', region: 'NorCal' },
  { id: 'yuba-city', city: 'Yuba City', region: 'Northern CA' },
  { id: 'modesto', city: 'Modesto', region: 'Central Valley' },
  { id: 'chico', city: 'Chico', region: 'Northern CA' },
]

export const CUSTOMIZATION_OPTIONS = {
  meatType: [
    { id: 'mixtas', label: 'Mixtas', description: 'A flavorful mix of carnitas cuts — the most popular choice' },
    { id: 'pura-carne', label: 'Pura Carne', description: 'Pure lean pork, no offal or skin' },
    { id: 'buche', label: 'Buche', description: 'Pork stomach — rich, tender, and deeply flavorful' },
    { id: 'cueritos', label: 'Cueritos', description: 'Pickled pork skin — tangy and chewy' },
    { id: 'chicharron', label: 'Chicharron', description: 'Crispy fried pork rinds (+$1/lb)' },
  ],
}

export const MIN_ORDER_LBS = 1
export const MAX_ORDER_LBS = 20
export const DELIVERY_FEE = 4.99
export const SERVICE_FEE_RATE = 0.05
