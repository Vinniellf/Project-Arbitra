import {
  signIn,
  signOut,
  resetPassword,
  confirmResetPassword,
  confirmSignIn,
  updateUserAttributes,
} from 'aws-amplify/auth'

import type { UpdateProfileData } from '../types/auth.types'
import { updateBackendProfile } from './user-profile.service'

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
      const fullName = `${firstName} ${lastName}`.trim()

      if (!firstName || !lastName) {
        throw new Error('El nombre y apellido son obligatorios')
      }

      const cognitoResult = await updateUserAttributes({
        userAttributes: {
          name: fullName,
          given_name: firstName,
          family_name: lastName,
        },
      })

      const apiResult = await updateBackendProfile({
        firstName,
        lastName,
      })

      return {
        cognitoResult,
        apiResult,
      }
    } catch (error: unknown) {
      console.error('Error actualizando perfil:', error)
      throw error
    }
  },

  async forgotPassword(email: string) {
    try {
      await resetPassword({
        username: email,
      })
    } catch (error: unknown) {
      console.error('Error enviando correo:', error)
      throw error
    }
  },

  async confirmReset(email: string, code: string, newPassword: string) {
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      })
    } catch (error: unknown) {
      console.error('Error confirmando reset:', error)
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
