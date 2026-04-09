import { Loader2, Mail, Users, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useInviteAdminUser } from '../../../hooks/useInviteAdminUser'
import { useAdminRole } from '../../../hooks/useAdminRole'
import type { InviteUserRequest } from '../../../types/user'
import ConfirmModal from '../users/ConfirmModal'

type InviteUserModalProps = {
  open: boolean
  onClose: () => void
  onUserInvited?: () => Promise<void> | void
}

type ConfirmStatus = 'confirm' | 'loading' | 'success' | 'error'
type InviteMode = 'single' | 'multiple'

type InviteFormState = {
  mode: InviteMode
  email: string
  emailsText: string
  role: 'ADMIN' | 'SUPER_ADMIN'
  name: string
}

type ParsedEmailsResult = {
  all: string[]
  valid: string[]
  invalid: string[]
  duplicates: string[]
}

const initialForm: InviteFormState = {
  mode: 'single',
  email: '',
  emailsText: '',
  role: 'ADMIN',
  name: '',
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const normalizeEmail = (value: string) => value.trim().toLowerCase()

const tokenizeEmails = (value: string): string[] => {
  return value
    .split(/[\n,;]+/)
    .flatMap((chunk) => chunk.split(/\s+/))
    .map((token) => token.trim())
    .filter(Boolean)
}

const parseEmails = (value: string): ParsedEmailsResult => {
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

export default function InviteUserModal({
  open,
  onClose,
  onUserInvited,
}: InviteUserModalProps) {
  const [form, setForm] = useState<InviteFormState>(initialForm)
  const [formError, setFormError] = useState<string | null>(null)

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmStatus, setConfirmStatus] = useState<ConfirmStatus>('confirm')
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const [confirmSuccess, setConfirmSuccess] = useState<string | null>(null)

  const { inviteUser, loading, error, resetState } = useInviteAdminUser()
  const { role: currentUserRole, loadingRole } = useAdminRole()

  const isSuperAdmin = currentUserRole === 'SUPER_ADMIN'
  const isAdmin = currentUserRole === 'ADMIN'
  const isBusy = loading || loadingRole || confirmStatus === 'loading'

  const parsedEmails = useMemo(() => {
    return form.mode === 'multiple'
      ? parseEmails(form.emailsText)
      : { all: [], valid: [], invalid: [], duplicates: [] }
  }, [form.mode, form.emailsText])

  const resetLocalState = () => {
    setForm(initialForm)
    setFormError(null)
    setShowConfirmModal(false)
    setConfirmStatus('confirm')
    setConfirmError(null)
    setConfirmSuccess(null)
    resetState()
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleModeChange = (mode: InviteMode) => {
    if (isBusy) return

    setForm((prev) => ({
      ...prev,
      mode,
      email: mode === 'single' ? prev.email : '',
      emailsText: mode === 'multiple' ? prev.emailsText : '',
      name: mode === 'single' ? prev.name : '',
    }))

    setFormError(null)
    setConfirmError(null)
    setConfirmSuccess(null)
  }

  const validateForm = (): string | null => {
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isBusy) return

    const validationError = validateForm()
    if (validationError) {
      setFormError(validationError)
      return
    }

    setFormError(null)
    setConfirmError(null)
    setConfirmSuccess(null)
    setConfirmStatus('confirm')
    setShowConfirmModal(true)
  }

  const handleConfirmInvite = async () => {
    if (isBusy) return

    setConfirmStatus('loading')
    setConfirmError(null)
    setConfirmSuccess(null)

    try {
      const payload: InviteUserRequest =
        form.mode === 'single'
          ? {
              email: normalizeEmail(form.email),
              name: form.name.trim() || undefined,
            }
          : {
              emails: parsedEmails.valid,
            }

      if (isSuperAdmin) {
        payload.role = form.role
      }

      const response = await inviteUser(payload)
      await onUserInvited?.()

      setConfirmStatus('success')

      if (form.mode === 'single') {
        setConfirmSuccess(
          `La invitación para ${payload.email} se envió correctamente.`
        )
      } else {
        const total = response.summary?.total ?? parsedEmails.valid.length
        const created = response.summary?.created ?? 0
        const resent = response.summary?.resent ?? 0
        const invalid = response.summary?.invalid ?? 0
        const failed = response.summary?.failed ?? 0

        setConfirmSuccess(
          `Se procesaron ${total} invitaciones. Creados: ${created}, reenviados: ${resent}, inválidos: ${invalid}, fallidos: ${failed}.`
        )
      }
    } catch (err) {
      let message = 'No se pudo enviar la invitación. Inténtalo nuevamente.'

      if (err instanceof Error && err.message.trim()) {
        message = err.message
      } else if (error) {
        message = error
      }

      setConfirmStatus('error')
      setConfirmError(message)
    }
  }

  const handleCancelConfirm = () => {
    if (isBusy) return
    setShowConfirmModal(false)
    setConfirmStatus('confirm')
    setConfirmError(null)
    setConfirmSuccess(null)
  }

  const handleCloseResult = () => {
    if (confirmStatus === 'loading') return

    if (confirmStatus === 'success') {
      resetLocalState()
      onClose()
      return
    }

    if (confirmStatus === 'error') {
      setShowConfirmModal(false)
      setConfirmStatus('confirm')
      return
    }

    setShowConfirmModal(false)
  }

  const handleClose = () => {
    if (isBusy) return
    resetLocalState()
    onClose()
  }

  const confirmMessage =
    form.mode === 'single'
      ? `Se enviará una invitación al correo ${normalizeEmail(form.email)}. ¿Deseas continuar?`
      : `Se enviarán invitaciones a ${parsedEmails.valid.length} correo(s) válido(s). ¿Deseas continuar?`

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
        <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Invitar usuario(s)
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Envía invitaciones a uno o varios usuarios administradores.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={isBusy}
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleModeChange('single')}
                disabled={isBusy}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                  form.mode === 'single'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Mail className="h-4 w-4" />
                Un usuario
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('multiple')}
                disabled={isBusy}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                  form.mode === 'multiple'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Users className="h-4 w-4" />
                Varios usuarios
              </button>
            </div>

            {form.mode === 'single' ? (
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Correo
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="usuario@empresa.com"
                  disabled={isBusy}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:bg-slate-50"
                />
              </div>
            ) : (
              <div>
                <label
                  htmlFor="emailsText"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Correos
                </label>
                <textarea
                  id="emailsText"
                  name="emailsText"
                  rows={7}
                  value={form.emailsText}
                  onChange={handleChange}
                  placeholder={`angelfabiano0404@gmail.com\nangelfabiano3030@gmail.com`}
                  disabled={isBusy}
                  className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:bg-slate-50"
                />

                <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Puedes separar los correos por salto de línea, coma, punto y coma o espacio.
                </div>

                {(parsedEmails.valid.length > 0 ||
                  parsedEmails.invalid.length > 0 ||
                  parsedEmails.duplicates.length > 0) && (
                  <div className="mt-3 space-y-2">
                    {parsedEmails.valid.length > 0 && (
                      <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-800">
                        Correos válidos detectados: <strong>{parsedEmails.valid.length}</strong>
                      </div>
                    )}

                    {parsedEmails.duplicates.length > 0 && (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        Correos duplicados ignorados: {parsedEmails.duplicates.join(', ')}
                      </div>
                    )}

                    {parsedEmails.invalid.length > 0 && (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        Correos inválidos: {parsedEmails.invalid.join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {isSuperAdmin && (
              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Rol
                </label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  disabled={isBusy}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:bg-slate-50"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                </select>
              </div>
            )}

            {isAdmin && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Como administrador, puedes enviar invitaciones sin asignar rol.
              </div>
            )}

            {formError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={isBusy}
                className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isBusy}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isBusy && <Loader2 className="h-4 w-4 animate-spin" />}
                {isBusy
                  ? 'Procesando...'
                  : form.mode === 'single'
                  ? 'Enviar invitación'
                  : 'Enviar invitaciones'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        open={showConfirmModal}
        title={
          confirmStatus === 'success'
            ? 'Invitación enviada'
            : confirmStatus === 'error'
            ? 'No se pudo enviar'
            : 'Confirmar invitación'
        }
        message={confirmMessage}
        status={confirmStatus}
        errorMessage={confirmError}
        successMessage={confirmSuccess}
        confirmText={
          form.mode === 'single'
            ? 'Sí, enviar invitación'
            : 'Sí, enviar invitaciones'
        }
        cancelText="No, volver"
        closeText="Cerrar"
        onConfirm={handleConfirmInvite}
        onCancel={handleCancelConfirm}
        onCloseResult={handleCloseResult}
      />
    </>
  )
}
