export function hasRole(userGroups: string[], allowedRoles: string[]): boolean {
  return userGroups.some((group) => allowedRoles.includes(group.toLowerCase()))
}

export function isAdminUser(userGroups: string[]): boolean {
  return hasRole(userGroups, ['admin', 'superadmin'])
}
