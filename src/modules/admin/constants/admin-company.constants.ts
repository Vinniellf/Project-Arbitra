// modules/admin/constants/admin-company.constants.ts

export const ADMIN_COMPANY_STATUS = {
  ALL: 'ALL',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
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
