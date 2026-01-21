import type { Column as ColumnType } from '../types/board'

type Props = {
  column: ColumnType
}

export const Column = ({ column }: Props) => {
  return (
    <article className="column">
      <div className="column__title">{column.title}</div>
      <div className="column__empty">No tasks</div>
    </article>
  )
}
