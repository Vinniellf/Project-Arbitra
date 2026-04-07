import {
  AUTH_ERROR_MESSAGES,
  DEFAULT_AUTH_ERROR,
} from '../constants/auth-errors'

type CognitoLikeError = {
  name?: string
  message?: string
  __type?: string
}

export const getAuthErrorMessage = (error: unknown): string => {
  if (!error) return DEFAULT_AUTH_ERROR

  const err = error as CognitoLikeError

  const rawType = err.name || err.__type || ''
  const errorType = rawType.split(':').pop()?.split('#').pop() || ''
  const errorMessage = (err.message || '').toLowerCase().trim()

  if (errorMessage.includes('user is disabled')) {
    return 'Usuario deshabilitado'
  }

  if (errorMessage.includes('incorrect username or password')) {
    return 'Correo o contraseña incorrectos'
  }

  if (errorMessage.includes('user does not exist')) {
    return 'El usuario no existe'
  }

  if (errorType && AUTH_ERROR_MESSAGES[errorType]) {
    return AUTH_ERROR_MESSAGES[errorType]
  }

  return DEFAULT_AUTH_ERROR
}
