import FiltersCard from '../../common/filters/FiltersCard'
import SearchInput from '../../common/filters/SearchInput'
import {
  ADMIN_USER_ENABLED_FILTER,
  type AdminUserEnabledFilter,
} from '../../../constants/admin-user.constants'

import {
  LayoutGrid,
  Table2,
  RefreshCw,
  UserCheck,
  UserX,
  KeyRound,
} from 'lucide-react'

type ViewMode = 'cards' | 'table'

type UserFiltersProps = {
  search: string
  enabledFilter: AdminUserEnabledFilter
  resultsCount: number
  loading?: boolean
  viewMode: ViewMode
  onSearchChange: (value: string) => void
  onEnabledFilterChange: (value: AdminUserEnabledFilter) => void
  onViewModeChange: (value: ViewMode) => void
  onRefresh: () => void
}

export default function UserFilters({
  search,
  enabledFilter = ADMIN_USER_ENABLED_FILTER.ENABLED,
  resultsCount,
  loading = false,
  viewMode,
  onSearchChange,
  onEnabledFilterChange,
  onViewModeChange,
  onRefresh,
}: UserFiltersProps) {
  return (
    <FiltersCard>
      <div className="flex w-full flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-2.5 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1 lg:max-w-120">
            <SearchInput
              value={search}
              placeholder="Buscar por email, nombre o username..."
              onChange={onSearchChange}
            />
          </div>

          <div className="flex flex-col gap-2.5 sm:grid sm:grid-cols-2 lg:flex lg:flex-row lg:items-center">

            <div className="flex w-full items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-sm lg:w-auto">
              <button
                type="button"
                onClick={() =>
                  onEnabledFilterChange(ADMIN_USER_ENABLED_FILTER.ENABLED)
                }
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold whitespace-nowrap transition-all sm:text-sm ${
                  enabledFilter === ADMIN_USER_ENABLED_FILTER.ENABLED
                    ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300 shadow-sm'
                    : 'text-slate-600 hover:bg-emerald-50'
                }`}
              >
                <UserCheck className="h-4 w-4 shrink-0" />
                <span>Habilitados</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onEnabledFilterChange(
                    ADMIN_USER_ENABLED_FILTER.FORCE_CHANGE_PASSWORD
                  )
                }
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold whitespace-nowrap transition-all sm:text-sm ${
                  enabledFilter ===
                  ADMIN_USER_ENABLED_FILTER.FORCE_CHANGE_PASSWORD
                    ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-300 shadow-sm'
                    : 'text-slate-600 hover:bg-amber-50'
                }`}
              >
                <KeyRound className="h-4 w-4 shrink-0" />
                <span>Pendiente cambio</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onEnabledFilterChange(ADMIN_USER_ENABLED_FILTER.DISABLED)
                }
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold whitespace-nowrap transition-all sm:text-sm ${
                  enabledFilter === ADMIN_USER_ENABLED_FILTER.DISABLED
                    ? 'bg-red-100 text-red-700 ring-1 ring-red-300 shadow-sm'
                    : 'text-slate-600 hover:bg-red-50'
                }`}
              >
                <UserX className="h-4 w-4 shrink-0" />
                <span>Deshabilitados</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 xl:justify-end">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition sm:text-sm ${
                viewMode === 'table'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Table2 className="h-4 w-4" />
              <span>Tabla</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition sm:text-sm ${
                viewMode === 'cards'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Cards</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
            />
          </button>

          <div className="inline-flex min-h-10 items-center rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 sm:text-sm">
            {loading ? 'Cargando...' : `Resultados: ${resultsCount}`}
          </div>
        </div>
      </div>
    </FiltersCard>
  )
}
