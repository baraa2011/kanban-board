import type { Column as ColumnType } from '../types/board'
import { Column } from './Column'

type Props = {
  columns: ColumnType[]
}

export const Board = ({ columns }: Props) => {
  return (
    <section className="board__columns flex gap-4 overflow-x-auto px-1 py-2 -mx-1 snap-x snap-mandatory">
      {columns.map((column) => (
        <Column key={column.id} column={column} />
      ))}
    </section>
  )
}
