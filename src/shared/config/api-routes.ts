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
  memory: {
    get: '/memory',
  },
} as const
