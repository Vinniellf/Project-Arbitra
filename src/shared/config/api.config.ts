import { API_ROUTES } from './api-routes'

const API_BASE_URL = import.meta.env.VITE_ADMIN_USERS_API_URL
const INVITE_BASE_URL = import.meta.env.VITE_INVITE_USER_API_URL

if (!API_BASE_URL) {
  throw new Error('Falta configurar VITE_ADMIN_USERS_API_URL')
}

if (!INVITE_BASE_URL) {
  throw new Error('Falta configurar VITE_INVITE_USER_API_URL')
}

export const API = {
  admin: {
    users: `${API_BASE_URL}${API_ROUTES.admin.users}`,
    systemUsers: `${API_BASE_URL}${API_ROUTES.admin.systemUsers}`,
    disableUser: `${API_BASE_URL}${API_ROUTES.admin.disableUser}`,
    enableUser: `${API_BASE_URL}${API_ROUTES.admin.enableUser}`,
  },
  invite: {
    create: `${INVITE_BASE_URL}${API_ROUTES.invite.create}`,
  },
} as const
