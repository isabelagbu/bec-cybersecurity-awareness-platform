import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { auth, firebaseConfigured } from './firebase'

type AuthContextValue = {
  user: User | null
  loading: boolean
  error: string | null
  configured: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(firebaseConfigured)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!auth) return
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
  }, [])

  const login = async (email: string, password: string) => {
    setError(null)
    if (!auth) {
      setError('Firebase is not configured yet - add your project keys to .env.local.')
      throw new Error('Firebase not configured')
    }
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch {
      setError('Invalid email or password.')
      throw new Error('Login failed')
    }
  }

  const logout = () => (auth ? signOut(auth) : Promise.resolve())

  return (
    <AuthContext.Provider value={{ user, loading, error, configured: firebaseConfigured, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
