type TableSkeletonProps = {
  rows?: number
  columns?: number
}

export default function TableSkeleton({
  rows = 5,
  columns = 5,
}: TableSkeletonProps) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-4 py-4">
              <div className="h-3 w-full rounded bg-slate-200" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}
