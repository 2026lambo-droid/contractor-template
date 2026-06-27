import { createContext, useContext, useState } from 'react'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('carnemx_favorites') || '[]') } catch { return [] }
  })

  const toggle = (vendorId) => {
    setFavorites(prev => {
      const next = prev.includes(vendorId) ? prev.filter(id => id !== vendorId) : [...prev, vendorId]
      localStorage.setItem('carnemx_favorites', JSON.stringify(next))
      return next
    })
  }

  const isFavorite = (vendorId) => favorites.includes(vendorId)

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
