import { useEffect, useState } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'

type AdminRole = 'ADMIN' | 'SUPER_ADMIN' | null

type UseAdminRoleReturn = {
  role: AdminRole
  loadingRole: boolean
}

export function useAdminRole(): UseAdminRoleReturn {
  const [role, setRole] = useState<AdminRole>(null)
  const [loadingRole, setLoadingRole] = useState(true)

  useEffect(() => {
    const loadRole = async () => {
      try {
        const session = await fetchAuthSession()
        const groups = session.tokens?.accessToken?.payload['cognito:groups']

        if (Array.isArray(groups)) {
          if (groups.includes('SUPER_ADMIN')) {
            setRole('SUPER_ADMIN')
          } else if (groups.includes('ADMIN')) {
            setRole('ADMIN')
          } else {
            setRole(null)
          }
        } else {
          setRole(null)
        }
      } catch {
        setRole(null)
      } finally {
        setLoadingRole(false)
      }
    }

    void loadRole()
  }, [])

  return {
    role,
    loadingRole,
  }
}
