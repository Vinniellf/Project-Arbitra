import { XCircle } from 'lucide-react'

type PageErrorStateProps = {
  title?: string
  message: string
}

export default function PageErrorState({
  title = 'Ocurrió un error',
  message,
}: PageErrorStateProps) {
  return (
    <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
          <XCircle className="h-6 w-6 text-red-600" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="mt-2 text-sm text-red-600">{message}</p>
        </div>
      </div>
    </div>
  )
}
