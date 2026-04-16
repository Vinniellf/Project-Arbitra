import {
  signIn,
  signOut,
  resetPassword,
  confirmResetPassword,
  confirmSignIn,
} from 'aws-amplify/auth'

import type { UpdateProfileData } from '../types/auth.types'
import { updateBackendProfile } from './user-profile.service'

type CognitoLikeError = {
  name?: string
  message?: string
  __type?: string
}

export const authService = {
  async login(email: string, password: string): Promise<{
    requiresNewPassword: boolean
  }> {
    try {
      const result = await signIn({
        username: email,
        password,
      })

      return {
        requiresNewPassword:
          result.nextStep?.signInStep ===
          'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED',
      }
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.name === 'UserAlreadyAuthenticatedException'
      ) {
        await signOut()

        const retryResult = await signIn({
          username: email,
          password,
        })

        return {
          requiresNewPassword:
            retryResult.nextStep?.signInStep ===
            'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED',
        }
      }

      throw error
    }
  },

  async confirmNewPassword(newPassword: string) {
    try {
      return await confirmSignIn({
        challengeResponse: newPassword,
      })
    } catch (error: unknown) {
      console.error('Error cambiando contraseña inicial:', error)
      throw error
    }
  },

  async updateProfile(data: UpdateProfileData) {
    try {
      const firstName = data.firstName.trim()
      const lastName = data.lastName.trim()

      if (!firstName || !lastName) {
        throw new Error('El nombre y apellido son obligatorios')
      }

      return await updateBackendProfile({
        firstName,
        lastName,
      })
    } catch (error: unknown) {
      console.error('Error actualizando perfil:', error)
      throw error
    }
  },

  async forgotPassword(email: string) {
    try {
      return await resetPassword({
        username: email,
      })
    } catch (error: unknown) {
      console.error('Error enviando correo:', error)
      throw error
    }
  },

  async confirmReset(email: string, code: string, newPassword: string) {
    try {
      return await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      })
    } catch (error: unknown) {
      const err = error as CognitoLikeError

      console.error('Error confirmando reset:', {
        name: err?.name,
        message: err?.message,
        type: err?.__type,
        fullError: error,
      })

      throw error
    }
  },

  async logout() {
    try {
      await signOut()
    } catch (error: unknown) {
      console.warn('Error en logout:', error)
    }
  },
}
