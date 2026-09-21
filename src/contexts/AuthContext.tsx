import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, firebaseConfigured } from '../lib/firebase'

interface SessionUser {
  email: string | null
}

interface AuthContextValue {
  user: SessionUser | null
  loading: boolean
  demo: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const DEMO_USER: SessionUser = { email: '데모 계정' }

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(
    firebaseConfigured ? null : DEMO_USER,
  )
  const [loading, setLoading] = useState(firebaseConfigured)

  useEffect(() => {
    if (!firebaseConfigured) return
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u ? { email: u.email } : null)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function login(email: string, password: string) {
    if (!firebaseConfigured) return
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logout() {
    if (!firebaseConfigured) return
    await signOut(auth)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, demo: !firebaseConfigured, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
