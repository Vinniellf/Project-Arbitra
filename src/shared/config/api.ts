import { API_CONFIG } from './api-config'
import { API_ROUTES } from './api-routes'

export const API = {
  admin: {
    users: `${API_CONFIG.baseUrl}${API_ROUTES.admin.users}`,
    systemUsers: `${API_CONFIG.baseUrl}${API_ROUTES.admin.systemUsers}`,
    disableUser: `${API_CONFIG.baseUrl}${API_ROUTES.admin.disableUser}`,
    enableUser: `${API_CONFIG.baseUrl}${API_ROUTES.admin.enableUser}`,
    companies: `${API_CONFIG.baseUrl}${API_ROUTES.admin.companies}`,
  },
  profile: {
    update: `${API_CONFIG.baseUrl}${API_ROUTES.profile.update}`,
  },
  invite: {
    create: `${API_CONFIG.inviteBaseUrl}${API_ROUTES.invite.create}`,
  },
  chat: {
    send: `${API_CONFIG.baseUrl}${API_ROUTES.chat.send}`,
  },
  tickets: {
    create: `${API_CONFIG.baseUrl}${API_ROUTES.tickets.create}`,
    saveDraft: `${API_CONFIG.baseUrl}${API_ROUTES.tickets.saveDraft}`,
  },
} as const
