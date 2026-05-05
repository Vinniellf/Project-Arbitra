export const API_ROUTES = {
  admin: {
    inviteUsers: '/admin/users/invite',
    users: '/admin/users',
    disableUser: '/admin/users/disable',
    enableUser: '/admin/users/enable',
    companies: '/admin/companies',
  },
  profile: {
    update: '/update-profile',
  },
  user: {
    profile: '/user/profile',
  },
  memory: {
    get: '/memory',
  },
  pepe: {
    send: '/pepe/chat',
  },
  ticketera: {
    create: '/ticketera/create_ticket',
    get: '/ticketera',
  },
} as const
