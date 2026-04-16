import {
  AUTH_ERROR_MESSAGES,
  DEFAULT_AUTH_ERROR,
} from '../constants/auth-errors'

type CognitoLikeError = {
  name?: string
  message?: string
  __type?: string
}

const getErrorType = (error: CognitoLikeError): string => {
  const rawType = error.name || error.__type || ''
  return rawType.split(':').pop()?.split('#').pop() || ''
}

export const isInvalidLambdaResponseError = (error: unknown): boolean => {
  if (!error) return false

  const err = error as CognitoLikeError
  const errorType = getErrorType(err)
  const errorMessage = (err.message || '').toLowerCase().trim()

  return (
    errorType === 'InvalidLambdaResponseException' &&
    errorMessage.includes('unrecognizable lambda output')
  )
}

export const getAuthErrorMessage = (error: unknown): string => {
  if (!error) return DEFAULT_AUTH_ERROR

  const err = error as CognitoLikeError
  const errorType = getErrorType(err)
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

  if (errorMessage.includes('invalid verification code')) {
    return 'El código ingresado es incorrecto'
  }

  if (errorMessage.includes('verification code has expired')) {
    return 'El código expiró, solicita uno nuevo'
  }

  if (errorMessage.includes('password did not conform with policy')) {
    return 'La contraseña no cumple con los requisitos'
  }

  if (errorMessage.includes('attempt limit exceeded')) {
    return 'Demasiados intentos, intenta más tarde'
  }

  if (isInvalidLambdaResponseError(error)) {
    return 'La solicitud fue procesada, pero hubo un problema interno en Cognito. Intenta iniciar sesión con tu nueva contraseña.'
  }

  if (errorType && AUTH_ERROR_MESSAGES[errorType]) {
    return AUTH_ERROR_MESSAGES[errorType]
  }

  return DEFAULT_AUTH_ERROR
}
