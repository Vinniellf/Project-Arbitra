export const ADMIN_COMPANY_STATUS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

export const ADMIN_COMPANY_STATUS_OPTIONS = [
  {
    label: 'Todos los estados',
    value: ADMIN_COMPANY_STATUS.ALL,
  },
  {
    label: 'Activas',
    value: ADMIN_COMPANY_STATUS.ACTIVE,
  },
  {
    label: 'Inactivas',
    value: ADMIN_COMPANY_STATUS.INACTIVE,
  },
] as const
