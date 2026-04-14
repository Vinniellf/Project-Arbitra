import { useState } from 'react'
import { authService } from '../services/auth.service'
import type { UpdateProfileData } from '../types/auth.types'

export const useAuth = () => {
  const [loading, setLoading] = useState(false)

  const withLoading = async <T,>(callback: () => Promise<T>): Promise<T> => {
    setLoading(true)
    try {
      return await callback()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) =>
    withLoading(() => authService.login(email, password))

  const confirmNewPassword = async (password: string) =>
    withLoading(() => authService.confirmNewPassword(password))

  const updateProfile = async (data: UpdateProfileData) =>
    withLoading(() => authService.updateProfile(data))

  const forgotPassword = async (email: string) =>
    withLoading(() => authService.forgotPassword(email))

  const confirmReset = async (
    email: string,
    code: string,
    password: string
  ) => withLoading(() => authService.confirmReset(email, code, password))

  const logout = async () => authService.logout()

  return {
    login,
    confirmNewPassword,
    updateProfile,
    forgotPassword,
    confirmReset,
    logout,
    loading,
  }
}
