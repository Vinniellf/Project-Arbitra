export type InviteMode = 'single' | 'multiple'

export type ConfirmStatus = 'confirm' | 'loading' | 'success' | 'error'

export type InviteFormState = {
  mode: InviteMode
  email: string
  emailsText: string
  role: InviteUserRole
  name: string
}

export type ParsedEmailsResult = {
  all: string[]
  valid: string[]
  invalid: string[]
  duplicates: string[]
}

export type AdminUser = {
  username: string
  email: string | null
  name: string | null
  role: string
  enabled: boolean
  status: string | null
  createdAt: string | null
}

export type ListUsersResponse = {
  users: AdminUser[]
}

export type ToggleAdminUserResponse = {
  message: string
  username: string
  executedBy?: string
  requesterRole?: 'admin' | 'superadmin'
  targetGroups?: string[]
}

export type InviteUserRole = 'ADMIN' | 'SUPER_ADMIN'

export type InviteUserRequest = {
  role?: InviteUserRole
  name?: string
  email?: string
  emails?: string[]
}

export type InviteUserResult = {
  email: string
  success: boolean
  status: 'created' | 'existing' | 'invalid' | 'error'
  message: string
  error?: string
}

export type InviteUserResponse = {
  success?: boolean
  message: string
  summary?: {
    total: number
    created: number
    existing: number
    invalid: number
    failed: number
  }
  results?: InviteUserResult[]
  invitedUsers?: string[]
  failedUsers?: string[]
  user?: {
    email: string
    role: string
    name?: string
  }
}
