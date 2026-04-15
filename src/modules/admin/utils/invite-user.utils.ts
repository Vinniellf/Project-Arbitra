import type {
  InviteFormState,
  InviteMode,
  ParsedEmailsResult,
} from '../types/admin-user'

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const normalizeEmail = (value: string) => value.trim().toLowerCase()

export const tokenizeEmails = (value: string): string[] => {
  return value
    .split(/[\n,;]+/)
    .flatMap((chunk) => chunk.split(/\s+/))
    .map((token) => token.trim())
    .filter(Boolean)
}

export const parseEmails = (value: string): ParsedEmailsResult => {
  const rawTokens = tokenizeEmails(value)
  const normalizedTokens = rawTokens.map(normalizeEmail)

  const seen = new Set<string>()
  const duplicatesSet = new Set<string>()
  const valid: string[] = []
  const invalid: string[] = []

  for (const email of normalizedTokens) {
    if (seen.has(email)) {
      duplicatesSet.add(email)
      continue
    }

    seen.add(email)

    if (EMAIL_REGEX.test(email)) {
      valid.push(email)
    } else {
      invalid.push(email)
    }
  }

  return {
    all: normalizedTokens,
    valid,
    invalid,
    duplicates: [...duplicatesSet],
  }
}

export const initialInviteForm: InviteFormState = {
  mode: 'single',
  email: '',
  emailsText: '',
  role: 'ADMIN',
  name: '',
}

type ValidateInviteFormParams = {
  form: InviteFormState
  isSuperAdmin: boolean
  parsedEmails: ParsedEmailsResult
}

export const validateInviteForm = ({
  form,
  isSuperAdmin,
  parsedEmails,
}: ValidateInviteFormParams): string | null => {
  if (form.mode === 'single') {
    const email = normalizeEmail(form.email)

    if (!email) {
      return 'El correo es obligatorio.'
    }

    if (!EMAIL_REGEX.test(email)) {
      return 'Ingresa un correo válido.'
    }
  }

  if (form.mode === 'multiple') {
    if (!form.emailsText.trim()) {
      return 'Debes ingresar al menos un correo.'
    }

    if (parsedEmails.all.length === 0) {
      return 'No se detectaron correos.'
    }

    if (parsedEmails.valid.length === 0) {
      return 'No se detectaron correos válidos.'
    }

    if (parsedEmails.invalid.length > 0) {
      return `Hay correos con formato inválido: ${parsedEmails.invalid.join(', ')}`
    }
  }

  if (isSuperAdmin && !form.role) {
    return 'Selecciona un rol.'
  }

  return null
}

export const buildInviteConfirmMessage = (
  mode: InviteMode,
  email: string,
  validEmailsCount: number,
) => {
  return mode === 'single'
    ? `Se enviará una invitación al correo ${normalizeEmail(email)}. ¿Deseas continuar?`
    : `Se enviarán invitaciones a ${validEmailsCount} correo(s) válido(s). ¿Deseas continuar?`
}
