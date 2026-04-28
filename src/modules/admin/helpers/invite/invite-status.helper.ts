import type { InviteUserResultStatus } from '../../types/admin-user'

export const isCreated = (status: InviteUserResultStatus) =>
  status === 'created'

export const isResent = (status: InviteUserResultStatus) =>
  status === 'resent'

export const isAlreadyActive = (status: InviteUserResultStatus) =>
  status === 'already_active'

export const isDisabled = (status: InviteUserResultStatus) =>
  status === 'disabled'

export const isInvalid = (status: InviteUserResultStatus) =>
  status === 'invalid'

export const isError = (status: InviteUserResultStatus) =>
  status === 'error'
