import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext(null)

// Bilingual string table — English / Spanish
const STRINGS = {
  // Navigation
  home: { en: 'Home', es: 'Inicio' },
  browse: { en: 'Browse', es: 'Explorar' },
  cart: { en: 'Cart', es: 'Carrito' },
  orders: { en: 'Orders', es: 'Pedidos' },
  profile: { en: 'Profile', es: 'Perfil' },
  // Home
  greeting: { en: 'What\'s on the grill today?', es: '¿Qué va en la parrilla hoy?' },
  searchPlaceholder: { en: 'Search carnicerías & meats...', es: 'Busca carnicerías y carnes...' },
  featuredSection: { en: '🔥 Featured', es: '🔥 Destacados' },
  nearbySection: { en: '📍 Near You', es: '📍 Cerca de ti' },
  seeAll: { en: 'See all', es: 'Ver todo' },
  freeDel: { en: 'Free delivery today', es: 'Entrega gratis hoy' },
  orderNow: { en: 'Order Now →', es: 'Pedir Ahora →' },
  // Vendor
  openNow: { en: 'Open', es: 'Abierto' },
  closed: { en: 'Closed', es: 'Cerrado' },
  estDelivery: { en: 'Est. delivery', es: 'Entrega est.' },
  minOrder: { en: 'Min. order', es: 'Pedido mín.' },
  // Products
  addToCart: { en: 'Add', es: 'Agregar' },
  outOfStock: { en: 'Out of Stock', es: 'Agotado' },
  perLb: { en: '/ lb', es: '/ libra' },
  popular: { en: 'Popular', es: 'Popular' },
  quantity: { en: 'Quantity (pounds)', es: 'Cantidad (libras)' },
  marinade: { en: 'Marinade', es: 'Marinado' },
  cutStyle: { en: 'Cut Style', es: 'Tipo de Corte' },
  // Cart
  yourCart: { en: 'Your Cart', es: 'Tu Carrito' },
  cartEmpty: { en: 'Your cart is empty', es: 'Tu carrito está vacío' },
  subtotal: { en: 'Subtotal', es: 'Subtotal' },
  serviceFee: { en: 'Service fee', es: 'Tarifa de servicio' },
  deliveryFee: { en: 'Delivery fee', es: 'Tarifa de entrega' },
  total: { en: 'Total', es: 'Total' },
  checkout: { en: 'Proceed to Checkout', es: 'Ir al Pago' },
  // Checkout
  deliveryAddr: { en: 'Delivery Address', es: 'Dirección de entrega' },
  payment: { en: 'Payment Method', es: 'Método de pago' },
  tip: { en: 'Driver Tip', es: 'Propina para el conductor' },
  noTip: { en: 'No tip', es: 'Sin propina' },
  specialInstructions: { en: 'Special Instructions', es: 'Instrucciones especiales' },
  placeOrder: { en: 'Place Order', es: 'Realizar Pedido' },
  promoCode: { en: 'Promo Code', es: 'Código Promocional' },
  apply: { en: 'Apply', es: 'Aplicar' },
  // Order status
  orderPlaced: { en: 'Order Placed', es: 'Pedido realizado' },
  confirmed: { en: 'Confirmed', es: 'Confirmado' },
  preparing: { en: 'Preparing', es: 'Preparando' },
  readyPickup: { en: 'Ready for Pickup', es: 'Listo para recoger' },
  outDelivery: { en: 'Out for Delivery', es: 'En camino' },
  delivered: { en: 'Delivered', es: 'Entregado' },
  cancelled: { en: 'Cancelled', es: 'Cancelado' },
  // Reviews
  leaveReview: { en: 'Leave a Review', es: 'Dejar una reseña' },
  howWasOrder: { en: 'How was your order?', es: '¿Cómo fue tu pedido?' },
  submitReview: { en: 'Submit Review', es: 'Enviar reseña' },
  reviews: { en: 'Reviews', es: 'Reseñas' },
  // Favorites
  favorites: { en: 'Favorites', es: 'Favoritos' },
  savedVendors: { en: 'Saved Vendors', es: 'Vendedores guardados' },
  noFavorites: { en: 'No favorites yet', es: 'Sin favoritos aún' },
  // Auth
  signIn: { en: 'Sign In', es: 'Iniciar sesión' },
  signUp: { en: 'Sign up', es: 'Registrarse' },
  createAccount: { en: 'Create Account', es: 'Crear cuenta' },
  email: { en: 'Email', es: 'Correo electrónico' },
  password: { en: 'Password', es: 'Contraseña' },
  // Generic
  loading: { en: 'Loading...', es: 'Cargando...' },
  error: { en: 'Something went wrong', es: 'Algo salió mal' },
  tryAgain: { en: 'Try again', es: 'Intentar de nuevo' },
  save: { en: 'Save', es: 'Guardar' },
  cancel: { en: 'Cancel', es: 'Cancelar' },
  back: { en: 'Back', es: 'Regresar' },
  confirm: { en: 'Confirm', es: 'Confirmar' },
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('elrincon_lang') || 'en')

  const toggle = () => {
    const next = lang === 'en' ? 'es' : 'en'
    setLang(next)
    localStorage.setItem('elrincon_lang', next)
  }

  const t = (key) => STRINGS[key]?.[lang] ?? STRINGS[key]?.en ?? key

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
