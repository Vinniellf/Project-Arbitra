export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  inviteBaseUrl: import.meta.env.VITE_INVITE_USER_BASE_URL,
} as const

if (!API_CONFIG.baseUrl) {
  throw new Error('Falta configurar VITE_API_BASE_URL')
}

if (!API_CONFIG.inviteBaseUrl) {
  throw new Error('Falta configurar VITE_INVITE_USER_BASE_URL')
}
