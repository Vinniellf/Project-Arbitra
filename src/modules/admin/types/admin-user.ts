export type InviteMode = 'single' | 'multiple'

export type ConfirmStatus = 'confirm' | 'loading' | 'success' | 'error'

export type InviteFormState = {
  mode: InviteMode
  email: string
  emailsText: string
  role: InviteUserRole
  name: string
  companyId?: string
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
  companyId?: string
  email?: string
  emails?: string[]
}

export type InviteUserResultStatus =
  | 'created'
  | 'resent'
  | 'already_active'
  | 'disabled'
  | 'invalid'
  | 'error'

export type InviteUserResult = {
  email: string
  success: boolean
  status: InviteUserResultStatus
  message: string
  userId?: string
  companyId?: string | null
  userStatus?: string
  error?: string
  errorName?: string
  errorMessage?: string
  dynamo?: {
    alreadyExists: boolean
    enabled: boolean
  }
}

export type InviteUserResponse = {
  success: boolean
  message: string
  summary?: {
    total: number
    created: number
    resent: number
    alreadyActive: number
    disabled: number
    invalid: number
    failed: number
  }
  results?: InviteUserResult[]
}

export type SystemUser = {
  userId: string
  email: string | null
  name: string | null
  companyId: string | null
  role: string
  status: string | null
  enabled: boolean
  profileCompleted: boolean
  createdAt: string | null
}

export type ListSystemUsersResponse = {
  users: SystemUser[]
  pagination?: {
    limit: number
    nextToken: string | null
  }
}
