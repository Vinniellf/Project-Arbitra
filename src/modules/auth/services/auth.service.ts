import {
  signIn,
  signOut,
  resetPassword,
  confirmResetPassword,
  confirmSignIn,
  updateUserAttributes,
} from 'aws-amplify/auth'

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
        return this.login(email, password)
      }

      throw error
    }
  },

  async confirmNewPassword(newPassword: string) {
    try {
      await confirmSignIn({
        challengeResponse: newPassword,
      })
    } catch (error: unknown) {
      console.error('Error cambiando contraseña inicial:', error)
      throw error
    }
  },

  async updateProfile(data: { name?: string }) {
    try {
      const userAttributes: Record<string, string> = {}

      if (data.name?.trim()) {
        userAttributes.name = data.name.trim()
      }

      if (Object.keys(userAttributes).length === 0) {
        return
      }

      await updateUserAttributes({
        userAttributes,
      })
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
