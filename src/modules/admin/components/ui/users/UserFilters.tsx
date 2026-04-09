import FiltersCard from '../../common/filters/FiltersCard'
import SearchInput from '../../common/filters/SearchInput'
import FilterSelect from '../../common/filters/FilterSelect'
import {
  ADMIN_USER_ENABLED_OPTIONS,
  ADMIN_USER_STATUS_OPTIONS,
} from '../../../constants/admin-user.constants'
import { LayoutGrid, Table2, RefreshCw } from 'lucide-react'

type ViewMode = 'cards' | 'table'

type UserFiltersProps = {
  search: string
  statusFilter: string
  enabledFilter: string
  resultsCount: number
  loading?: boolean
  viewMode: ViewMode
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onEnabledFilterChange: (value: string) => void
  onViewModeChange: (value: ViewMode) => void
  onRefresh: () => void
}

export default function UserFilters({
  search,
  statusFilter,
  enabledFilter,
  resultsCount,
  loading = false,
  viewMode,
  onSearchChange,
  onStatusFilterChange,
  onEnabledFilterChange,
  onViewModeChange,
  onRefresh,
}: UserFiltersProps) {
  return (
    <FiltersCard>
      <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        {/* LEFT */}
        <div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center">
          {/* SEARCH */}
          <div className="min-w-0 flex-1 lg:max-w-130">
            <SearchInput
              value={search}
              placeholder="Buscar por email, nombre o username..."
              onChange={onSearchChange}
            />
          </div>

          {/* FILTERS */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center">
            <div className="w-full lg:w-55">
              <FilterSelect
                value={statusFilter}
                onChange={onStatusFilterChange}
                options={ADMIN_USER_STATUS_OPTIONS}
              />
            </div>

            <div className="w-full lg:w-50">
              <FilterSelect
                value={enabledFilter}
                onChange={onEnabledFilterChange}
                options={ADMIN_USER_ENABLED_OPTIONS}
              />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          {/* VIEW TOGGLE */}
          <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                viewMode === 'table'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Table2 className="h-4 w-4" />
              Tabla
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                viewMode === 'cards'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Cards
            </button>
          </div>

          {/* REFRESH */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Actualizar usuarios"
          >
            <RefreshCw className={`h-4.5 w-4.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* RESULTS */}
          <div className="inline-flex min-h-11 items-center rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            {loading ? 'Cargando...' : `Resultados: ${resultsCount}`}
          </div>
        </div>
      </div>
    </FiltersCard>
  )
}
