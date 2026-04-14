import { AlertCircle, AlertTriangle, Info } from 'lucide-react'

type Variant = 'error' | 'warning' | 'info'

type Props = {
  message?: string
  variant?: Variant
  className?: string
}

const styles = {
  error: {
    container: 'border-red-200 bg-red-50 text-red-600',
    icon: 'text-red-500',
    Icon: AlertCircle,
  },
  warning: {
    container: 'border-yellow-200 bg-yellow-50 text-yellow-600',
    icon: 'text-yellow-500',
    Icon: AlertTriangle,
  },
  info: {
    container: 'border-blue-200 bg-blue-50 text-blue-600',
    icon: 'text-blue-500',
    Icon: Info,
  },
}

export const AuthErrorMessage = ({
  message,
  variant = 'error',
  className = '',
}: Props) => {
  if (!message) return null

  const { container, icon, Icon } = styles[variant]

  return (
    <div
      className={`
        mb-4 flex items-start gap-3
        rounded-xl border p-3
        text-sm animate-fade-in
        ${container}
        ${className}
      `}
    >
      <Icon size={18} className={`mt-0.5 shrink-0 ${icon}`} />
      <span className="leading-snug">{message}</span>
    </div>
  )
}
