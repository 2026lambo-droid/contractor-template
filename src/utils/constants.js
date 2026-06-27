export const APP_NAME = 'CarneMX'
export const APP_TAGLINE = 'Tu Carnicería, Entregada'

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
  { id: 'carne-asada', label: 'Carne Asada', emoji: '🥩' },
  { id: 'chorizo', label: 'Chorizo', emoji: '🌭' },
  { id: 'short-ribs', label: 'Short Ribs', emoji: '🍖' },
  { id: 'al-pastor', label: 'Al Pastor', emoji: '🔥' },
  { id: 'carnitas', label: 'Carnitas', emoji: '🐷' },
  { id: 'chicken', label: 'Pollo', emoji: '🍗' },
  { id: 'tripas', label: 'Tripas', emoji: '🥩' },
  { id: 'lengua', label: 'Lengua', emoji: '🥩' },
]

export const DELIVERY_ZONES = [
  { id: 'san-jose', city: 'San Jose', region: 'Bay Area' },
  { id: 'san-francisco', city: 'San Francisco', region: 'Bay Area' },
  { id: 'oakland', city: 'Oakland', region: 'Bay Area' },
  { id: 'fremont', city: 'Fremont', region: 'Bay Area' },
  { id: 'los-angeles', city: 'Los Angeles', region: 'SoCal' },
  { id: 'san-diego', city: 'San Diego', region: 'SoCal' },
  { id: 'riverside', city: 'Riverside', region: 'SoCal' },
  { id: 'anaheim', city: 'Anaheim', region: 'SoCal' },
  { id: 'long-beach', city: 'Long Beach', region: 'SoCal' },
  { id: 'santa-ana', city: 'Santa Ana', region: 'SoCal' },
  { id: 'stockton', city: 'Stockton', region: 'Central Valley' },
  { id: 'fresno', city: 'Fresno', region: 'Central Valley' },
]

export const CUSTOMIZATION_OPTIONS = {
  marinade: [
    { id: 'fresh', label: 'Fresh / Sin Marinar', description: 'No marinade, natural flavor' },
    { id: 'traditional', label: 'Traditional / Marinado', description: 'Classic citrus & spice marinade' },
    { id: 'spicy', label: 'Spicy / Picante', description: 'Extra chile & jalapeño marinade' },
    { id: 'achiote', label: 'Achiote', description: 'Smoky achiote paste rub' },
  ],
  cut: [
    { id: 'thin', label: 'Thin Cut / Delgado', description: 'Classic thin for quick grilling' },
    { id: 'thick', label: 'Thick Cut / Grueso', description: 'Thicker for juicy steaks' },
    { id: 'diced', label: 'Diced / Picado', description: 'Cubed for tacos & stews' },
  ],
}

export const MIN_ORDER_LBS = 1
export const MAX_ORDER_LBS = 20
export const DELIVERY_FEE = 4.99
export const SERVICE_FEE_RATE = 0.05
