export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_ADMIN_USERS_API_URL,
  inviteBaseUrl: import.meta.env.VITE_INVITE_USER_API_URL,
} as const

if (!API_CONFIG.baseUrl) {
  throw new Error('Falta configurar VITE_ADMIN_USERS_API_URL')
}

if (!API_CONFIG.inviteBaseUrl) {
  throw new Error('Falta configurar VITE_INVITE_USER_API_URL')
}
