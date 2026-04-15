import { useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

import { AuthContext } from './AuthContext'
import type { User } from './AuthContext'
import { authService } from '../services/auth.service'
import { getCurrentSessionUser } from '../services/session.service'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  const [requiresNewPasswordState, setRequiresNewPasswordState] = useState(() => {
    return sessionStorage.getItem('requiresNewPassword') === 'true'
  })

  const setRequiresNewPassword = (value: boolean) => {
    setRequiresNewPasswordState(value)

    if (value) {
      sessionStorage.setItem('requiresNewPassword', 'true')
    } else {
      sessionStorage.removeItem('requiresNewPassword')
    }
  }

  const loadUser = useCallback(async () => {
    try {
      const sessionUser = await getCurrentSessionUser()

      if (!sessionUser) {
        setUser(null)
        return
      }

      setUser({
        name: sessionUser.name || sessionUser.email,
        email: sessionUser.email,
        groups: sessionUser.groups,
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

    void initAuth()
  }, [loadUser])

  const refreshUser = async () => {
    await loadUser()
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
    setRequiresNewPassword(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        initialLoading,
        requiresNewPassword: requiresNewPasswordState,
        setRequiresNewPassword,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
