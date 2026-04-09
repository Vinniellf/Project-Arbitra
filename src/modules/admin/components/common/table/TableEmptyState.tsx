type TableEmptyStateProps = {
  colSpan: number
  message?: string
}

export default function TableEmptyState({
  colSpan,
  message = 'No se encontraron resultados.',
}: TableEmptyStateProps) {
  return (
    <tbody>
      <tr>
        <td
          colSpan={colSpan}
          className="px-4 py-10 text-center text-sm text-slate-500"
        >
          {message}
        </td>
      </tr>
    </tbody>
  )
}
