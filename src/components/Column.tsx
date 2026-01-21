import type { Column as ColumnType } from '../types/board'
import { NewTaskForm } from './NewTaskForm'
import { TaskCard } from './TaskCard'

type Props = {
  column: ColumnType
}

export const Column = ({ column }: Props) => {
  const hasTasks = column.tasks.length > 0

  return (
    <article className="column bg-white border border-slate-200 rounded-xl p-4 shadow-md min-h-[180px] min-w-[260px] flex-0 basis-[280px] snap-start space-y-4">
      <div className="column__title font-semibold text-slate-900">{column.name}</div>

      <NewTaskForm columnId={column.id} />

      {!hasTasks ? (
        <div className="column__empty text-slate-400 text-sm">No tasks</div>
      ) : (
        <div className="flex flex-col gap-3">
          {column.tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </article>
  )
}
