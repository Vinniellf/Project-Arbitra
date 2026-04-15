import { Users, CheckCircle2, XCircle, KeyRound } from 'lucide-react'
import type { AdminUser } from '../../types/admin-user'
import { getAdminUsersStats } from '../../utils/admin-users.utils'
import StatCard from '../common/stats/StatCard'
import StatsGrid from '../common/stats/StatsGrid'
import StatsSkeleton from '../common/stats/StatsSkeleton'

type UserStatsProps = {
  users: AdminUser[]
  loading?: boolean
}

export default function UserStats({
  users,
  loading = false,
}: UserStatsProps) {
  if (loading) {
    return <StatsSkeleton count={4} />
  }

  const {
    totalUsers,
    enabledUsers,
    disabledUsers,
    forceChangePasswordUsers,
  } = getAdminUsersStats(users)

  return (
    <StatsGrid>
      <StatCard
        label="Total usuarios"
        value={totalUsers}
        icon={<Users className="h-5 w-5 text-violet-600" />}
        iconWrapperClassName="bg-violet-100"
        valueClassName="text-slate-900"
        delay={0.05}
      />

      <StatCard
        label="Habilitados"
        value={enabledUsers}
        icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
        valueClassName="text-emerald-600"
        iconWrapperClassName="bg-emerald-100"
        delay={0.1}
      />

      <StatCard
        label="Deshabilitados"
        value={disabledUsers}
        icon={<XCircle className="h-5 w-5 text-rose-600" />}
        valueClassName="text-rose-600"
        iconWrapperClassName="bg-rose-100"
        delay={0.15}
      />

      <StatCard
        label="Cambio contraseña"
        value={forceChangePasswordUsers}
        icon={<KeyRound className="h-5 w-5 text-amber-600" />}
        valueClassName="text-amber-600"
        iconWrapperClassName="bg-amber-100"
        delay={0.2}
      />
    </StatsGrid>
  )
}
