export const API_ROUTES = {
  admin: {
    inviteUsers: '/admin/users/invite',
    users: '/admin/users',
    disableUser: '/admin/users/disable',
    enableUser: '/admin/users/enable',
    companies: '/admin/companies',
  },
  profile: {
    update: '/update-profile', // Ruta antigua, se mantiene temporalmente
  },
  user: {
    profile: '/user/profile', // Nueva ruta correcta
  },
  memory: {
    get: '/memory',
  },
  pepe: {
    send: '/pepe/chat', // Ruta que se va a manejar para el chat
  },
} as const

