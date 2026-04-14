import {
  signIn,
  signOut,
  resetPassword,
  confirmResetPassword,
  confirmSignIn,
  updateUserAttributes,
  fetchAuthSession,
} from 'aws-amplify/auth'

const UPDATE_PROFILE_URL = import.meta.env.VITE_UPDATE_PROFILE_API_URL

export type UpdateProfileData = {
  firstName: string
  lastName: string
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
        return this.login(email, password)
      }

      throw error
    }
  },

  async confirmNewPassword(newPassword: string) {
    try {
      const result = await confirmSignIn({
        challengeResponse: newPassword,
      })

      return result
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

      const session = await fetchAuthSession()
      const idToken = session.tokens?.idToken?.toString()

      if (!idToken) {
        throw new Error('No se pudo obtener el token del usuario')
      }

      if (!UPDATE_PROFILE_URL) {
        throw new Error('Falta VITE_UPDATE_PROFILE_API_URL')
      }

      const response = await fetch(UPDATE_PROFILE_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name: fullName,
          firstName,
          lastName,
        }),
      })

      let apiResult: unknown = null

      try {
        apiResult = await response.json()
      } catch {
        apiResult = null
      }

      if (!response.ok) {
        const message =
          typeof apiResult === 'object' &&
          apiResult !== null &&
          'message' in apiResult &&
          typeof apiResult.message === 'string'
            ? apiResult.message
            : 'Error actualizando perfil'

        throw new Error(message)
      }

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
