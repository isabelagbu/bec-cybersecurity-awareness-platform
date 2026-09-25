import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { auth, firebaseConfigured } from './firebase'

// Firebase Auth only supports email/password, so admin usernames are mapped to a
// synthetic email on this domain. Create admin accounts in the Firebase console as
// `<username>@<ADMIN_EMAIL_DOMAIN>`.
export const ADMIN_EMAIL_DOMAIN = import.meta.env.VITE_ADMIN_EMAIL_DOMAIN || 'admin.bec-training.app'

export function usernameToEmail(username: string) {
  return `${username.trim().toLowerCase()}@${ADMIN_EMAIL_DOMAIN}`
}

export function emailToUsername(email: string | null) {
  if (!email) return ''
  const suffix = `@${ADMIN_EMAIL_DOMAIN}`
  return email.endsWith(suffix) ? email.slice(0, -suffix.length) : email
}

type AuthContextValue = {
  user: User | null
  loading: boolean
  error: string | null
  configured: boolean
  login: (username: string, password: string) => Promise<void>
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

  const login = async (username: string, password: string) => {
    setError(null)
    if (!auth) {
      setError('Firebase is not configured yet - add your project keys to .env.local.')
      throw new Error('Firebase not configured')
    }
    try {
      await signInWithEmailAndPassword(auth, usernameToEmail(username), password)
    } catch {
      setError('Invalid username or password.')
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
