import type { Task } from '../types/board'

type Props = {
  task: Task
}

export const TaskCard = ({ task }: Props) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900">{task.title}</p>
        <div className="flex gap-2">
          <button
            type="button"
            className="text-xs font-medium text-slate-500 hover:text-slate-700"
            aria-label="Edit task"
          >
            Edit
          </button>
          <button
            type="button"
            className="text-xs font-medium text-red-500 hover:text-red-600"
            aria-label="Delete task"
          >
            Delete
          </button>
        </div>
      </div>
      {task.description && (
        <p className="mt-2 text-xs text-slate-600 line-clamp-2">{task.description}</p>
      )}
    </div>
  )
}
