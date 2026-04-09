import { Loader2, X } from 'lucide-react'
import { useState } from 'react'
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

const initialForm: InviteUserRequest = {
  email: '',
  role: 'ADMIN',
  name: '',
}

export default function InviteUserModal({
  open,
  onClose,
  onUserInvited,
}: InviteUserModalProps) {
  const [form, setForm] = useState<InviteUserRequest>(initialForm)
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
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = (): string | null => {
    const email = form.email.trim()

    if (!email) {
      return 'El correo es obligatorio.'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Ingresa un correo válido.'
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
      const payload: InviteUserRequest = {
        email: form.email.trim().toLowerCase(),
        name: form.name?.trim() || undefined,
      }

      if (isSuperAdmin) {
        payload.role = form.role
      }

      await inviteUser(payload)
      await onUserInvited?.()

      setConfirmStatus('success')
      setConfirmSuccess(
        `La invitación para ${payload.email} se envió correctamente.`
      )
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

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Invitar usuario
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Registra un nuevo usuario administrador en Cognito.
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
                  value={form.role ?? 'ADMIN'}
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
                {isBusy ? 'Procesando...' : 'Enviar invitación'}
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
        message={`Se enviará una invitación al correo ${form.email
          .trim()
          .toLowerCase()}. ¿Deseas continuar?`}
        status={confirmStatus}
        errorMessage={confirmError}
        successMessage={confirmSuccess}
        confirmText="Sí, enviar invitación"
        cancelText="No, volver"
        closeText="Cerrar"
        onConfirm={handleConfirmInvite}
        onCancel={handleCancelConfirm}
        onCloseResult={handleCloseResult}
      />
    </>
  )
}
