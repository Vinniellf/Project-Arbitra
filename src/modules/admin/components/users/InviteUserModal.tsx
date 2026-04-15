import { Loader2, Mail, Users, X } from 'lucide-react'
import type { InviteMode } from '../../types/admin-user'
import ConfirmModal from '../users/ConfirmModal'
import { useInviteUserModal } from '../../hooks/users/useInviteUserModal'

type InviteUserModalProps = {
  open: boolean
  onClose: () => void
  onUserInvited?: () => Promise<void> | void
}

export default function InviteUserModal({
  open,
  onClose,
  onUserInvited,
}: InviteUserModalProps) {
  const {
    form,
    formError,
    showConfirmModal,
    confirmStatus,
    confirmError,
    confirmSuccess,
    parsedEmails,
    confirmMessage,
    isSuperAdmin,
    isAdmin,
    isBusy,
    handleChange,
    handleModeChange,
    handleSubmit,
    handleConfirmInvite,
    handleCancelConfirm,
    handleCloseResult,
    handleClose,
  } = useInviteUserModal({
    onClose,
    onUserInvited,
  })

  if (!open) return null

  const getModeButtonClass = (mode: InviteMode) =>
    `inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
      form.mode === mode
        ? 'bg-violet-600 text-white shadow-sm'
        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
    }`

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
                className={getModeButtonClass('single')}
              >
                <Mail className="h-4 w-4" />
                Un usuario
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('multiple')}
                disabled={isBusy}
                className={getModeButtonClass('multiple')}
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
                  placeholder={`correo@ejemplo.com\notro@ejemplo.com`}
                  disabled={isBusy}
                  className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:bg-slate-50"
                />

                <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Puedes separar los correos por salto de línea, coma, punto y
                  coma o espacio.
                </div>

                {(parsedEmails.valid.length > 0 ||
                  parsedEmails.invalid.length > 0 ||
                  parsedEmails.duplicates.length > 0) && (
                  <div className="mt-3 space-y-2">
                    {parsedEmails.valid.length > 0 && (
                      <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-800">
                        Correos válidos detectados:{' '}
                        <strong>{parsedEmails.valid.length}</strong>
                      </div>
                    )}

                    {parsedEmails.duplicates.length > 0 && (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        Correos duplicados ignorados:{' '}
                        {parsedEmails.duplicates.join(', ')}
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
