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
