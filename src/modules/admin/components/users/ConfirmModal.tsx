import { AlertTriangle, CheckCircle2, Loader2, XCircle } from 'lucide-react'

type ConfirmModalStatus = 'confirm' | 'loading' | 'success' | 'error'

type ConfirmModalProps = {
  open: boolean
  title?: string
  message: string
  status?: ConfirmModalStatus
  errorMessage?: string | null
  successMessage?: string | null
  confirmText?: string
  cancelText?: string
  closeText?: string
  onConfirm: () => void
  onCancel: () => void
  onCloseResult: () => void
}

export default function ConfirmModal({
  open,
  title = 'Confirmar acción',
  message,
  status = 'confirm',
  errorMessage = null,
  successMessage = null,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  closeText = 'Cerrar',
  onConfirm,
  onCancel,
  onCloseResult,
}: ConfirmModalProps) {
  if (!open) return null

  const isLoading = status === 'loading'
  const isSuccess = status === 'success'
  const isError = status === 'error'
  const isConfirm = status === 'confirm'

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.35)]">
        <div className="flex items-start gap-4">
          <div
            className={[
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
              isSuccess
                ? 'bg-green-100 text-green-600'
                : isError
                ? 'bg-red-100 text-red-600'
                : 'bg-amber-100 text-amber-600',
            ].join(' ')}
          >
            {isLoading && <Loader2 className="h-6 w-6 animate-spin" />}
            {isConfirm && <AlertTriangle className="h-6 w-6" />}
            {isSuccess && <CheckCircle2 className="h-6 w-6" />}
            {isError && <XCircle className="h-6 w-6" />}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>

            {isConfirm && (
              <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
            )}

            {isLoading && (
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Procesando invitación, espera un momento...
              </p>
            )}

            {isSuccess && (
              <div className="mt-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {successMessage || 'La invitación se procesó correctamente.'}
              </div>
            )}

            {isError && (
              <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage || 'No se pudo procesar la invitación.'}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {isConfirm && (
            <>
              <button
                type="button"
                onClick={onCancel}
                className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {cancelText}
              </button>

              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
              >
                {confirmText}
              </button>
            </>
          )}

          {isLoading && (
            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white opacity-70"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Procesando...
            </button>
          )}

          {(isSuccess || isError) && (
            <button
              type="button"
              onClick={onCloseResult}
              className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {closeText}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
