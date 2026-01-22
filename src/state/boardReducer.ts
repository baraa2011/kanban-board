import type { BoardAction, BoardState, Column, Task } from '../types/board'

const reorder = (list: Column[], fromIndex: number, toIndex: number) => {
  const next = [...list]
  const [removed] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, removed)
  return next
}

export const initialBoardState: BoardState = {
  columns: [
    { id: 'backlog', name: 'Backlog', tasks: [] },
    { id: 'in-progress', name: 'In Progress', tasks: [] },
    { id: 'review', name: 'Review', tasks: [] },
    { id: 'done', name: 'Done', tasks: [] },
  ],
}

export const boardReducer = (state: BoardState, action: BoardAction): BoardState => {
  switch (action.type) {
    case 'addColumn': {
      const name = action.payload.name.trim()
      if (!name) {
        return state
      }
      const id = name.toLowerCase().replace(/\s+/g, '-')
      const exists = state.columns.some((col) => col.id === id)
      if (exists) {
        return state
      }
      const column: Column = { id, name, tasks: [] }
      return { ...state, columns: [...state.columns, column] }
    }
    case 'removeColumn': {
      return { ...state, columns: state.columns.filter((col) => col.id !== action.payload.id) }
    }
    case 'renameColumn': {
      const name = action.payload.name.trim()
      if (!name) {
        return state
      }
      return {
        ...state,
        columns: state.columns.map((col) =>
          col.id === action.payload.id ? { ...col, name } : col,
        ),
      }
    }
    case 'reorderColumns': {
      const { fromIndex, toIndex } = action.payload
      if (fromIndex === toIndex) return state
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.columns.length ||
        toIndex >= state.columns.length
      ) {
        return state
      }
      return { ...state, columns: reorder(state.columns, fromIndex, toIndex) }
    }
    case 'addTask': {
      const { columnId, title, description } = action.payload
      const trimmedTitle = title.trim()
      const trimmedDescription = description?.trim()
      if (!trimmedTitle) return state
      const nextColumns = state.columns.map((col) => {
        if (col.id !== columnId) return col
        const newTask: Task = {
          id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
          title: trimmedTitle,
          ...(trimmedDescription ? { description: trimmedDescription } : {}),
          createdAt: Date.now(),
        }
        return { ...col, tasks: [...col.tasks, newTask] }
      })
      return { ...state, columns: nextColumns }
    }
    case 'deleteTask':
    case 'DELETE_TASK': {
      const { columnId, taskId } = action.payload
      const nextColumns = state.columns.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) }
          : col,
      )
      return { ...state, columns: nextColumns }
    }
    case 'editTask':
    case 'EDIT_TASK': {
      const { columnId, taskId, title, description } = action.payload
      const trimmedTitle = title.trim()
      const trimmedDescription = description?.trim()
      if (!trimmedTitle) return state
      const nextColumns = state.columns.map((col) => {
        if (col.id !== columnId) return col
        return {
          ...col,
          tasks: col.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  title: trimmedTitle,
                  ...(trimmedDescription !== undefined ? { description: trimmedDescription } : {}),
                }
              : task,
          ),
        }
      })
      return { ...state, columns: nextColumns }
    }
    case 'editColumn': {
      const { columnId, name } = action.payload
      const trimmedName = name.trim()
      if (!trimmedName) return state
      return {
        ...state,
        columns: state.columns.map((col) =>
          col.id === columnId ? { ...col, name: trimmedName } : col,
        ),
      }
    }
    case 'deleteColumn': {
      const { columnId } = action.payload
      return { ...state, columns: state.columns.filter((col) => col.id !== columnId) }
    }
    case 'reorderTasksInColumn': {
      const { columnId, orderedTaskIds } = action.payload
      return {
        ...state,
        columns: state.columns.map((col) => {
          if (col.id !== columnId) return col
          const tasksById = new Map(col.tasks.map((task) => [task.id, task]))
          const reordered = orderedTaskIds
            .map((id) => tasksById.get(id))
            .filter((task): task is Task => Boolean(task))

          const remaining = col.tasks.filter((task) => !orderedTaskIds.includes(task.id))
          return { ...col, tasks: [...reordered, ...remaining] }
        }),
      }
    }
    case 'moveTask':
    case 'MOVE_TASK': {
      const { fromColumnId, toColumnId, taskId } = action.payload
      if (fromColumnId === toColumnId) return state

      let taskToMove: Task | null = null

      const columnsWithoutTask = state.columns.map((col) => {
        if (col.id !== fromColumnId) return col
        const remainingTasks = col.tasks.filter((task) => {
          if (task.id === taskId) {
            taskToMove = task
            return false
          }
          return true
        })
        return { ...col, tasks: remainingTasks }
      })

      if (!taskToMove) return state

      const columnsWithTaskMoved = columnsWithoutTask.map((col) =>
        col.id === toColumnId ? { ...col, tasks: [...col.tasks, taskToMove!] } : col,
      )

      return { ...state, columns: columnsWithTaskMoved }
    }
    default:
      return state
  }
}
