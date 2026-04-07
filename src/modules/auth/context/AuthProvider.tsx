import { useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth'
import { AuthContext } from './AuthContext'
import type { User } from './AuthContext'
import { authService } from '../services/auth.service'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  const loadUser = useCallback(async () => {
    try {
      await getCurrentUser()

      const attributes = await fetchUserAttributes()

      setUser({
        name: attributes.name || attributes.email,
        email: attributes.email,
      })
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      try {
        await loadUser()
      } finally {
        setInitialLoading(false)
      }
    }

    initAuth()
  }, [loadUser])

  const refreshUser = async () => {
    await loadUser()
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        initialLoading,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
