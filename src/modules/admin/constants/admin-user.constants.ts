export const ADMIN_USER_STATUS = {
  CONFIRMED: 'CONFIRMED',
  FORCE_CHANGE_PASSWORD: 'FORCE_CHANGE_PASSWORD',
} as const

export const ADMIN_USER_ENABLED_FILTER = {
  ALL: 'ALL',
  ENABLED: 'ENABLED',
  DISABLED: 'DISABLED',
} as const

export type AdminUserStatus =
  (typeof ADMIN_USER_STATUS)[keyof typeof ADMIN_USER_STATUS]

export type AdminUserEnabledFilter =
  (typeof ADMIN_USER_ENABLED_FILTER)[keyof typeof ADMIN_USER_ENABLED_FILTER]

type AdminUserStatusMeta = {
  label: string
  badgeClassName: string
}

export const ADMIN_USER_STATUS_META: Record<
  AdminUserStatus,
  AdminUserStatusMeta
> = {
  [ADMIN_USER_STATUS.CONFIRMED]: {
    label: 'Confirmado',
    badgeClassName: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  },
  [ADMIN_USER_STATUS.FORCE_CHANGE_PASSWORD]: {
    label: 'Cambio requerido',
    badgeClassName: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  },
}

export const ADMIN_USER_STATUS_OPTIONS = [
  { label: 'Todos los estados', value: 'ALL' },
  {
    label: ADMIN_USER_STATUS_META[ADMIN_USER_STATUS.CONFIRMED].label,
    value: ADMIN_USER_STATUS.CONFIRMED,
  },
  {
    label:
      ADMIN_USER_STATUS_META[ADMIN_USER_STATUS.FORCE_CHANGE_PASSWORD].label,
    value: ADMIN_USER_STATUS.FORCE_CHANGE_PASSWORD,
  },
] as const

export const ADMIN_USER_ENABLED_OPTIONS = [
  { label: 'Habilitación', value: ADMIN_USER_ENABLED_FILTER.ALL },
  { label: 'Habilitados', value: ADMIN_USER_ENABLED_FILTER.ENABLED },
  { label: 'Deshabilitados', value: ADMIN_USER_ENABLED_FILTER.DISABLED },
] as const

export const DEFAULT_ADMIN_USER_STATUS_LABEL = 'Sin estado'

export const DEFAULT_ADMIN_USER_STATUS_BADGE_CLASS =
  'bg-gray-100 text-gray-700 ring-1 ring-gray-200'
