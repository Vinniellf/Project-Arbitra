export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  NotAuthorizedException: 'Correo o contraseña incorrectos',
  UserNotFoundException: 'El usuario no existe',
  UserNotConfirmedException: 'Usuario no confirmado',
  LimitExceededException: 'Demasiados intentos, intenta más tarde',
  TooManyRequestsException: 'Demasiados intentos, intenta más tarde',
  NetworkError: 'Error de conexión',

  CodeMismatchException: 'El código ingresado es incorrecto',
  ExpiredCodeException: 'El código expiró, solicita uno nuevo',
  InvalidPasswordException: 'La contraseña no cumple con los requisitos',
  InvalidParameterException: 'Datos inválidos, revisa los campos',
  PasswordResetRequiredException: 'Debes restablecer tu contraseña para continuar',

  InvalidLambdaResponseException:
    'La solicitud fue procesada, pero hubo un problema interno en Cognito. Intenta iniciar sesión con tu nueva contraseña.',
}

export const DEFAULT_AUTH_ERROR = 'Ocurrió un error inesperado'
