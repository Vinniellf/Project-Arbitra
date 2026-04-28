import type { InviteUserResponse } from '../../types/admin-user'

export function buildInviteSuccessMessage(
  response: InviteUserResponse,
): string {
  const summary = response.summary
  const results = response.results || []

  // 🔥 CASO 1: UN SOLO USUARIO
  if (results.length === 1) {
    const result = results[0]

    switch (result.status) {
      case 'created':
        return 'Usuario creado y se envió la invitación.'

      case 'resent':
        return 'Se reenvió la invitación al usuario.'

      case 'already_active':
        return 'El usuario ya existe en el sistema y ya activó su cuenta.'

      case 'disabled':
        return 'El usuario existe pero está deshabilitado.'

      case 'invalid':
        return 'El correo ingresado no es válido.'

      case 'error':
        return result.message || 'Error al procesar el usuario.'

      default:
        return 'Invitación procesada.'
    }
  }

  // 🔥 CASO 2: MÚLTIPLES USUARIOS
  if (!summary) {
    return response.message || 'Invitación procesada correctamente.'
  }

  const parts: string[] = []

  if (summary.created > 0) {
    parts.push(`${summary.created} usuario(s) creado(s)`)
  }

  if (summary.resent > 0) {
    parts.push(`${summary.resent} invitación(es) reenviada(s)`)
  }

  if (summary.alreadyActive > 0) {
    parts.push(
      `${summary.alreadyActive} usuario(s) ya existen en el sistema`,
    )
  }

  if (summary.disabled > 0) {
    parts.push(`${summary.disabled} usuario(s) deshabilitado(s)`)
  }

  if (summary.failed > 0) {
    parts.push(`${summary.failed} con error`)
  }

  return parts.length > 0
    ? parts.join('. ')
    : response.message || 'Invitación procesada correctamente.'
}
