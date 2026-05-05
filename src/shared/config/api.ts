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
    update: `${API_CONFIG.baseUrl}${API_ROUTES.profile.update}`,
  },
  user: {
    profile: `${API_CONFIG.baseUrl}${API_ROUTES.user.profile}`,
  },
  pepe: {
    chat: `${API_CONFIG.baseUrl}${API_ROUTES.pepe.send}`,
  },
  memory: {
    get: (sessionId: string) =>
      `${API_CONFIG.baseUrl}${API_ROUTES.memory.get}/${sessionId}`,
  },
  ticketera: {
    create: `${API_CONFIG.baseUrl}${API_ROUTES.ticketera.create}`,
    get: (ticketId: string) =>
      `${API_CONFIG.baseUrl}${API_ROUTES.ticketera.get}/${ticketId}`,
  },
} as const
