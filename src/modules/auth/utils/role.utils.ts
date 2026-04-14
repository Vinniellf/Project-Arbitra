export function hasRole(userGroups: string[], allowedRoles: string[]): boolean {
  const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase())

  return userGroups.some((group) =>
    normalizedAllowedRoles.includes(group.toLowerCase())
  )
}

export function isAdminUser(userGroups: string[]): boolean {
  return hasRole(userGroups, ['admin', 'superadmin'])
}
