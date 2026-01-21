import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Task } from '../types/board'
import { useBoard } from '../state/BoardContext'

type Props = {
  task: Task
  columnId: string
}

export const TaskCard = ({ task, columnId }: Props) => {
  const { state, dispatch } = useBoard()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')

  const columns = state.columns
  const currentIndex = columns.findIndex((col) => col.id === columnId)
  const prevColumnId = currentIndex > 0 ? columns[currentIndex - 1]?.id : undefined
  const nextColumnId =
    currentIndex >= 0 && currentIndex < columns.length - 1
      ? columns[currentIndex + 1]?.id
      : undefined

  const handleDelete = () => {
    if (!window.confirm('Delete this task?')) return
    dispatch({ type: 'deleteTask', payload: { columnId, taskId: task.id } })
  }

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()
    if (!trimmedTitle) return
    dispatch({
      type: 'editTask',
      payload: {
        columnId,
        taskId: task.id,
        title: trimmedTitle,
        description: trimmedDescription || undefined,
      },
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTitle(task.title)
    setDescription(task.description ?? '')
    setIsEditing(false)
  }

  const moveToColumn = (targetColumnId?: string) => {
    if (!targetColumnId || targetColumnId === columnId) return
    dispatch({
      type: 'moveTask',
      payload: {
        fromColumnId: columnId,
        toColumnId: targetColumnId,
        taskId: task.id,
      },
    })
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      {isEditing ? (
        <form className="flex flex-col gap-2" onSubmit={handleSave}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            aria-label="Task title"
            placeholder="Task title"
            autoFocus
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            aria-label="Task description"
            placeholder="Add details"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
              disabled={!title.trim()}
            >
              Save
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">{task.title}</p>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-xs font-medium text-slate-500 hover:text-slate-700 disabled:text-slate-300"
                aria-label="Move task to previous column"
                disabled={!prevColumnId}
                onClick={() => moveToColumn(prevColumnId)}
              >
                ←
              </button>
              <button
                type="button"
                className="text-xs font-medium text-slate-500 hover:text-slate-700 disabled:text-slate-300"
                aria-label="Move task to next column"
                disabled={!nextColumnId}
                onClick={() => moveToColumn(nextColumnId)}
              >
                →
              </button>
              <button
                type="button"
                className="text-xs font-medium text-slate-500 hover:text-slate-700"
                aria-label="Edit task"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                type="button"
                className="text-xs font-medium text-red-500 hover:text-red-600"
                aria-label="Delete task"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
          {task.description && (
            <p className="mt-2 text-xs text-slate-600 line-clamp-2">{task.description}</p>
          )}
        </>
      )}
    </div>
  )
}
