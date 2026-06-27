import { createContext, useContext, useState, useEffect } from 'react'
import { MOCK_USERS } from '../utils/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('carnemx_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem('carnemx_user') }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    await new Promise(r => setTimeout(r, 800))
    const mockUser = Object.values(MOCK_USERS).find(
      u => u.email === email && u.password === password
    )
    if (!mockUser) throw new Error('Invalid email or password')
    const { password: _, ...safeUser } = mockUser
    localStorage.setItem('carnemx_user', JSON.stringify(safeUser))
    setUser(safeUser)
    return safeUser
  }

  const register = async ({ email, password, name, role, vendorName }) => {
    await new Promise(r => setTimeout(r, 1000))
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      role,
      phone: '',
      ...(role === 'vendor' && { vendorId: `v-new-${Date.now()}`, vendorName }),
      ...(role === 'driver' && { isOnline: false, vehicle: '' }),
    }
    localStorage.setItem('carnemx_user', JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }

  const logout = () => {
    localStorage.removeItem('carnemx_user')
    setUser(null)
  }

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    localStorage.setItem('carnemx_user', JSON.stringify(updated))
    setUser(updated)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
