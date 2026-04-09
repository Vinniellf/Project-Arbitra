type TableContainerProps = {
  children: React.ReactNode
}

export default function TableContainer({ children }: TableContainerProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">{children}</div>
    </div>
  )
}
