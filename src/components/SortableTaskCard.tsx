import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../types/board'
import { TaskCard } from './TaskCard'

type Props = {
  task: Task
  columnId: string
}

export const SortableTaskCard = ({ task, columnId }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'task', columnId },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'ring-2 ring-indigo-200 shadow-lg' : ''}`}
    >
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:text-slate-700 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          ⇅
        </button>
      </div>
      <TaskCard task={task} columnId={columnId} />
    </div>
  )
}
