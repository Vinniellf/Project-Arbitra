import { useState } from 'react'
import { authService, type UpdateProfileData } from '../services/auth.service'

export const useAuth = () => {
  const [loading, setLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      return await authService.login(email, password)
    } finally {
      setLoading(false)
    }
  }

  const confirmNewPassword = async (password: string) => {
    setLoading(true)
    try {
      return await authService.confirmNewPassword(password)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: UpdateProfileData) => {
    setLoading(true)
    try {
      return await authService.updateProfile(data)
    } finally {
      setLoading(false)
    }
  }

  const forgotPassword = async (email: string) => {
    setLoading(true)
    try {
      return await authService.forgotPassword(email)
    } finally {
      setLoading(false)
    }
  }

  const confirmReset = async (
    email: string,
    code: string,
    password: string
  ) => {
    setLoading(true)
    try {
      return await authService.confirmReset(email, code, password)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    return await authService.logout()
  }

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
