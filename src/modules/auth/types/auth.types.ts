export type UserGroup = 'admin' | 'superadmin' | 'user'

export interface AuthUser {
  email?: string
  name?: string
  groups: string[]
  isAuthenticated: boolean
}

export type UpdateProfileData = {
  firstName: string
  lastName: string
}
