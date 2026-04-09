export interface AdminUser {
  username: string | null
  email: string | null
  name: string | null
  status: string | null
  enabled: boolean
  createdAt: string | null
}

export interface ListUsersResponse {
  users: AdminUser[]
}

export type InviteUserRole = 'ADMIN' | 'SUPER_ADMIN'

export interface InviteUserRequest {
  email?: string
  emails?: string[]
  role?: InviteUserRole
  name?: string
}

export interface InviteUserResult {
  email: string
  success: boolean
  status: 'created' | 'resent' | 'invalid' | 'error'
  message: string
  error?: string
}

export interface InviteUserResponse {
  success: boolean
  message: string
  summary?: {
    total: number
    created: number
    resent: number
    invalid: number
    failed: number
  }
  results?: InviteUserResult[]
  user?: {
    email: string
    role: string
    name?: string
  }
}
