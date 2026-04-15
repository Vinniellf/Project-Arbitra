import { useMemo, useState } from 'react'
import { useInviteAdminUser } from './useInviteAdminUser'
import { useAdminRole } from '../shared/useAdminRole'
import type {
  ConfirmStatus,
  InviteFormState,
  InviteUserRequest,
  InviteMode,
} from '../../types/admin-user'
import {
  buildInviteConfirmMessage,
  initialInviteForm,
  normalizeEmail,
  parseEmails,
  validateInviteForm,
} from '../../utils/invite-user.utils'

type UseInviteUserModalParams = {
  onClose: () => void
  onUserInvited?: () => Promise<void> | void
}

export function useInviteUserModal({
  onClose,
  onUserInvited,
}: UseInviteUserModalParams) {
  const [form, setForm] = useState<InviteFormState>(initialInviteForm)
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

  const confirmMessage = buildInviteConfirmMessage(
    form.mode,
    form.email,
    parsedEmails.valid.length,
  )

  const resetLocalState = () => {
    setForm(initialInviteForm)
    setFormError(null)
    setShowConfirmModal(false)
    setConfirmStatus('confirm')
    setConfirmError(null)
    setConfirmSuccess(null)
    resetState()
  }

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isBusy) return

    const validationError = validateInviteForm({
      form,
      isSuperAdmin,
      parsedEmails,
    })

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
          `La invitación para ${payload.email} se envió correctamente.`,
        )
        return
      }

      const total = response.summary?.total ?? parsedEmails.valid.length
      const created = response.summary?.created ?? 0
      const existing = response.summary?.existing ?? 0
      const invalid = response.summary?.invalid ?? 0
      const failed = response.summary?.failed ?? 0

      setConfirmSuccess(
        `Se procesaron ${total} invitaciones. Creados: ${created}, existentes: ${existing}, inválidos: ${invalid}, fallidos: ${failed}.`,
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

  return {
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
  }
}
