import { motion } from 'framer-motion'
import { Building, Hash, MapPin, BriefcaseBusiness } from 'lucide-react'

import TableContainer from '../common/table/TableContainer'
import TableHead from '../common/table/TableHead'
import TableEmptyState from '../common/table/TableEmptyState'
import TableSkeleton from '../common/table/TableSkeleton'

import type { Company } from '../../types/company'

import {
  getCompanyStatusBadge,
  getCompanyStatusLabel,
} from '../../helpers/company/company.helpers'

type CompaniesTableProps = {
  companies: Company[]
  loading?: boolean
}

export default function CompaniesTable({
  companies,
  loading = false,
}: CompaniesTableProps) {
  const columns = [
    { key: 'company', label: 'Empresa' },
    { key: 'businessUnit', label: 'Razón social' },
    { key: 'ruc', label: 'RUC' },
    { key: 'site', label: 'Sede' },
    { key: 'status', label: 'Estado', align: 'right' as const },
  ]

  return (
    <TableContainer>
      <table className="min-w-full divide-y divide-slate-200">
        <TableHead columns={columns} />

        {loading ? (
          <TableSkeleton rows={5} columns={columns.length} />
        ) : companies.length === 0 ? (
          <TableEmptyState
            colSpan={columns.length}
            message="No hay empresas registradas."
          />
        ) : (
          <motion.tbody
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.04 },
              },
            }}
            className="divide-y divide-slate-100 bg-white"
          >
            {companies.map((company) => (
              <motion.tr
                key={company.companyId}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.22 }}
                whileHover={{ y: -1 }}
                className="group transition hover:bg-slate-50/70"
              >
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100">
                      <Building className="h-4.5 w-4.5 text-violet-600" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {company.company || '-'}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {company.location || '-'}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5 text-sm text-slate-700">
                    <BriefcaseBusiness className="h-3.5 w-3.5 text-slate-400" />
                    <span>{company.businessUnit || '-'}</span>
                  </div>
                </td>

                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5 text-sm text-slate-700">
                    <Hash className="h-3.5 w-3.5 text-slate-400" />
                    <span>{company.ruc || '-'}</span>
                  </div>
                </td>

                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5 text-sm text-slate-700">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{company.site || '-'}</span>
                  </div>
                </td>

                <td className="px-3 py-3 text-right">
                  <span
                    className={`rounded-md px-2 py-1 text-[11px] font-semibold ${getCompanyStatusBadge(
                      company.status,
                    )}`}
                  >
                    {getCompanyStatusLabel(company.status)}
                  </span>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        )}
      </table>
    </TableContainer>
  )
}
