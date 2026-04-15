export const API_ROUTES = {
  admin: {
    users: '/admin/users',
    systemUsers: '/admin/system-users',
    disableUser: '/admin/users/disable',
    enableUser: '/admin/users/enable',
    companies: '/admin/companies',
  },
  invite: {
    create: '/default/invite-user',
  },
} as const
