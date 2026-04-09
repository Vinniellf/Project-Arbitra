import { createContext } from 'react'

export type User = {
  name?: string
  email?: string
  groups: string[]
}

export type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  initialLoading: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)
