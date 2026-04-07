export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  NotAuthorizedException: 'Correo o contraseña incorrectos',
  UserNotFoundException: 'El usuario no existe',
  UserNotConfirmedException: 'Usuario no confirmado',
  LimitExceededException: 'Demasiados intentos, intenta más tarde',
  NetworkError: 'Error de conexión',
}

export const DEFAULT_AUTH_ERROR = 'Ocurrió un error inesperado'
