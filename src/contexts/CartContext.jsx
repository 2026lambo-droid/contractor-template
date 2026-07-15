import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [vendorId, setVendorId] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('elrincon_cart')
    if (stored) {
      try {
        const { items: i, vendorId: v } = JSON.parse(stored)
        setItems(i || [])
        setVendorId(v || null)
      } catch { localStorage.removeItem('elrincon_cart') }
    }
  }, [])

  const persist = (items, vid) => {
    localStorage.setItem('elrincon_cart', JSON.stringify({ items, vendorId: vid }))
  }

  const addItem = (product, quantity, customizations = {}) => {
    if (vendorId && vendorId !== product.vendorId) {
      const confirmed = window.confirm(
        'Your cart has items from another vendor. Start a new cart?'
      )
      if (!confirmed) return false
      setItems([])
      setVendorId(null)
    }

    setItems(prev => {
      const key = `${product.id}-${JSON.stringify(customizations)}`
      const existing = prev.find(i => i.key === key)
      let next
      if (existing) {
        next = prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i)
      } else {
        next = [...prev, { key, product, quantity, customizations, addedAt: Date.now() }]
      }
      persist(next, product.vendorId)
      return next
    })
    setVendorId(product.vendorId)
    return true
  }

  const updateQuantity = (key, quantity) => {
    setItems(prev => {
      const next = quantity <= 0
        ? prev.filter(i => i.key !== key)
        : prev.map(i => i.key === key ? { ...i, quantity } : i)
      const vid = next.length > 0 ? next[0].product.vendorId : null
      persist(next, vid)
      if (next.length === 0) setVendorId(null)
      return next
    })
  }

  const removeItem = (key) => updateQuantity(key, 0)

  const clearCart = () => {
    setItems([])
    setVendorId(null)
    localStorage.removeItem('elrincon_cart')
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.product.pricePerLb * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, vendorId, itemCount, subtotal, addItem, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
