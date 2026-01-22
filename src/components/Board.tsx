import { useState } from 'react'
import {
  DndContext,
  closestCorners,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { Column as ColumnType, Task } from '../types/board'
import { useBoard } from '../state/BoardContext'
import { Column } from './Column'
import { TaskCard } from './TaskCard'

type Props = {
  columns: ColumnType[]
}

export const Board = ({ columns }: Props) => {
  const { dispatch } = useBoard()
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const findColumnIdByTaskId = (taskId: string) => {
    const column = columns.find((col) => col.tasks.some((task) => task.id === taskId))
    return column?.id
  }

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type !== 'task') return
    setActiveTaskId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTaskId(null)
    if (!over) return
    if (active.id === over.id) return

    const activeId = String(active.id)
    const activeData = active.data.current as { type?: string; columnId?: string } | undefined
    if (activeData?.type !== 'task') return

    const fromColumnId = activeData?.columnId ?? findColumnIdByTaskId(activeId)
    const overData = over.data?.current as { type?: string; columnId?: string } | undefined
    const overId = String(over.id)
    const toColumnId =
      overData?.columnId ??
      (overData?.type === 'column' ? overId : (findColumnIdByTaskId(overId) ?? undefined))

    if (!fromColumnId || !toColumnId) return

    if (fromColumnId === toColumnId) {
      const column = columns.find((col) => col.id === fromColumnId)
      if (!column) return
      const fromIndex = column.tasks.findIndex((task) => task.id === activeId)
      const toIndex =
        overData?.type === 'task'
          ? column.tasks.findIndex((task) => task.id === overId)
          : column.tasks.length - 1

      if (fromIndex === -1 || toIndex === -1) return
      if (fromIndex === toIndex) return

      const orderedTaskIds = arrayMove(
        column.tasks.map((task) => task.id),
        fromIndex,
        toIndex,
      )

      dispatch({
        type: 'reorderTasksInColumn',
        payload: { columnId: fromColumnId, orderedTaskIds },
      })
      return
    }

    dispatch({
      type: 'moveTask',
      payload: { fromColumnId, toColumnId, taskId: activeId },
    })
  }

  const activeTask = activeTaskId
    ? (() => {
        for (const column of columns) {
          const task = column.tasks.find((t) => t.id === activeTaskId)
          if (task) return { task, columnId: column.id }
        }
        return null
      })()
    : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <section className="board__columns flex flex-nowrap gap-4 overflow-x-auto px-1 py-2 -mx-1 snap-x snap-mandatory">
        {columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </section>
      <DragOverlay>
        {activeTask ? (
          <TaskCard task={activeTask.task as Task} columnId={activeTask.columnId} />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
