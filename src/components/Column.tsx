import { useEffect, useRef, useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Column as ColumnType } from '../types/board'
import { useBoard } from '../state/BoardContext'
import { NewTaskForm } from './NewTaskForm'
import { SortableTaskCard } from './SortableTaskCard'

type Props = {
  column: ColumnType
}

export const Column = ({ column }: Props) => {
  const { dispatch } = useBoard()
  const hasTasks = column.tasks.length > 0
  const [isEditing, setIsEditing] = useState(false)
  const [draftName, setDraftName] = useState(column.name)
  const inputRef = useRef<HTMLInputElement>(null)
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', columnId: column.id },
  })

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const saveName = () => {
    const trimmed = draftName.trim()
    if (!trimmed) {
      setDraftName(column.name)
      setIsEditing(false)
      return
    }
    if (trimmed !== column.name) {
      dispatch({ type: 'editColumn', payload: { columnId: column.id, name: trimmed } })
    }
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setDraftName(column.name)
    setIsEditing(false)
  }

  const startEdit = () => {
    setDraftName(column.name)
    setIsEditing(true)
  }

  return (
    <article
      ref={setNodeRef}
      className={`column bg-white/95 border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow min-h-[180px] min-w-[260px] flex-shrink-0 flex-0 basis-[280px] snap-start space-y-3 ${
        isOver ? 'ring-2 ring-indigo-200' : ''
      }`}
    >
      <div className="column__title sticky top-0 z-10 flex items-center justify-between gap-2 bg-white pb-2">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                saveName()
              } else if (e.key === 'Escape') {
                e.preventDefault()
                cancelEdit()
              }
            }}
            className="w-full rounded-md border border-slate-200 px-2 py-1 text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            aria-label="Edit column name"
          />
        ) : (
          <>
            <span className="font-semibold text-slate-900">{column.name}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                aria-label="Edit column"
                onClick={startEdit}
                onDoubleClick={startEdit}
              >
                Edit
              </button>
              <button
                type="button"
                className="text-xs font-semibold text-red-500 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                aria-label="Delete column"
                onClick={() => {
                  if (!window.confirm('Delete this column and all tasks?')) return
                  dispatch({ type: 'deleteColumn', payload: { columnId: column.id } })
                }}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      <NewTaskForm columnId={column.id} />

      <SortableContext
        items={column.tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          className={`flex flex-col gap-3 min-h-[80px] rounded-md border border-dashed border-transparent ${
            isOver ? 'border-indigo-200 bg-indigo-50/50' : 'border-transparent'
          }`}
        >
          {hasTasks ? (
            column.tasks.map((task) => (
              <SortableTaskCard key={task.id} task={task} columnId={column.id} />
            ))
          ) : (
            <div className="column__empty text-slate-400 text-sm">No tasks</div>
          )}
        </div>
      </SortableContext>
    </article>
  )
}
