import { API_CONFIG } from './api-config'
import { API_ROUTES } from './api-routes'

export const API = {
  admin: {
    inviteUsers: `${API_CONFIG.baseUrl}${API_ROUTES.admin.inviteUsers}`,
    users: `${API_CONFIG.baseUrl}${API_ROUTES.admin.users}`,
    disableUser: `${API_CONFIG.baseUrl}${API_ROUTES.admin.disableUser}`,
    enableUser: `${API_CONFIG.baseUrl}${API_ROUTES.admin.enableUser}`,
    companies: `${API_CONFIG.baseUrl}${API_ROUTES.admin.companies}`,
  },
  profile: {
    update: `${API_CONFIG.baseUrl}${API_ROUTES.profile.update}`, // Ruta antigua
  },
  user: {
    profile: `${API_CONFIG.baseUrl}${API_ROUTES.user.profile}`, // Nueva ruta
  },
  memory: {
    get: (sessionId: string) =>
      `${API_CONFIG.baseUrl}${API_ROUTES.memory.get}/${sessionId}`,
  },
} as const
