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

export interface InviteUserRequest {
  email: string
  role?: 'ADMIN' | 'SUPER_ADMIN'
  name?: string
}

export interface InviteUserResponse {
  message: string
  success?: boolean
  user?: {
    email: string
    role: string
    name?: string
  }
}
