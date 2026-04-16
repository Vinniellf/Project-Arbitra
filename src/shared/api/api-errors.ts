export type ApiErrorResponse = {
  message?: string
  error?: string
  detail?: string
}

export async function parseErrorResponse(response: Response): Promise<never> {
  let message = `Error HTTP ${response.status}`

  try {
    const errorData = (await response.json()) as ApiErrorResponse
    message = errorData.message || errorData.error || errorData.detail || message
  } catch {
    // ignorar si no viene json
  }

  switch (response.status) {
    case 400:
      throw new Error(message || 'Solicitud inválida.')
    case 401:
      throw new Error('No autorizado. Inicia sesión nuevamente.')
    case 403:
      throw new Error(message || 'No tienes permisos para realizar esta acción.')
    case 404:
      throw new Error(message || 'Recurso no encontrado.')
    case 409:
      throw new Error(message || 'Conflicto con el recurso.')
    case 429:
      throw new Error(
        message || 'Demasiadas solicitudes. Intenta nuevamente en unos segundos.'
      )
    default:
      throw new Error(message)
  }
}
