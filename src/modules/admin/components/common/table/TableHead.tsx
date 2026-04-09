type TableColumn = {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
}

type TableHeadProps = {
  columns: TableColumn[]
}

export default function TableHead({ columns }: TableHeadProps) {
  return (
    <thead className="bg-linear-to-r from-slate-50 to-slate-100/80 backdrop-blur-sm">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={`px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 ${
              column.align === 'right'
                ? 'text-right'
                : column.align === 'center'
                  ? 'text-center'
                  : 'text-left'
            }`}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  )
}
