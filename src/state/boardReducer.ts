import type { BoardAction, BoardState, Board, Column, Task } from '../types/board'

const reorder = (list: Column[], fromIndex: number, toIndex: number) => {
  const next = [...list]
  const [removed] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, removed)
  return next
}

const defaultColumns: Column[] = [
  { id: 'backlog', name: 'Backlog', tasks: [] },
  { id: 'in-progress', name: 'In Progress', tasks: [] },
  { id: 'review', name: 'Review', tasks: [] },
  { id: 'done', name: 'Done', tasks: [] },
]

const createEmptyBoard = (name: string, id?: string): Board => ({
  id: id ?? name.toLowerCase().replace(/\s+/g, '-'),
  name,
  columns: [],
})

export const initialBoardState: BoardState = {
  boards: [
    {
      id: 'default-board',
      name: 'My Board',
      columns: defaultColumns,
    },
  ],
  selectedBoardId: 'default-board',
}

const updateSelectedBoard = (state: BoardState, updater: (board: Board) => Board): BoardState => {
  const index = state.boards.findIndex((b) => b.id === state.selectedBoardId)
  if (index === -1) return state
  const board = state.boards[index]
  const updated = updater(board)
  if (updated === board) return state
  const boards = [...state.boards]
  boards[index] = updated
  return { ...state, boards }
}

export const boardReducer = (state: BoardState, action: BoardAction): BoardState => {
  switch (action.type) {
    case 'addBoard':
    case 'ADD_BOARD': {
      const name = action.payload.name.trim()
      if (!name) return state
      const id = name.toLowerCase().replace(/\s+/g, '-')
      const exists = state.boards.some((b) => b.id === id)
      const board: Board = { id, name, columns: [] }
      const nextBoards = exists ? state.boards : [...state.boards, board]
      const selectedBoardId = exists ? state.selectedBoardId : id
      return { boards: nextBoards, selectedBoardId }
    }
    case 'selectBoard':
    case 'SELECT_BOARD': {
      const { boardId } = action.payload
      const exists = state.boards.some((b) => b.id === boardId)
      if (!exists) return state
      return { ...state, selectedBoardId: boardId }
    }
    case 'DELETE_BOARD': {
      const { boardId } = action.payload
      const remaining = state.boards.filter((b) => b.id !== boardId)
      if (remaining.length === 0) {
        const fallback = createEmptyBoard('My Board', 'default-board')
        return { boards: [fallback], selectedBoardId: fallback.id }
      }
      const selectedBoardId =
        state.selectedBoardId === boardId ? remaining[0].id : state.selectedBoardId
      return { boards: remaining, selectedBoardId }
    }
    case 'addColumn': {
      const name = action.payload.name.trim()
      if (!name) {
        return state
      }
      return updateSelectedBoard(state, (board) => {
        const id = name.toLowerCase().replace(/\s+/g, '-')
        const exists = board.columns.some((col) => col.id === id)
        if (exists) return board
        const column: Column = { id, name, tasks: [] }
        return { ...board, columns: [...board.columns, column] }
      })
    }
    case 'removeColumn': {
      return updateSelectedBoard(state, (board) => ({
        ...board,
        columns: board.columns.filter((col) => col.id !== action.payload.id),
      }))
    }
    case 'renameColumn': {
      const name = action.payload.name.trim()
      if (!name) {
        return state
      }
      return updateSelectedBoard(state, (board) => ({
        ...board,
        columns: board.columns.map((col) =>
          col.id === action.payload.id ? { ...col, name } : col,
        ),
      }))
    }
    case 'reorderColumns': {
      const { fromIndex, toIndex } = action.payload
      if (fromIndex === toIndex) return state
      return updateSelectedBoard(state, (board) => {
        if (
          fromIndex < 0 ||
          toIndex < 0 ||
          fromIndex >= board.columns.length ||
          toIndex >= board.columns.length
        ) {
          return board
        }
        return { ...board, columns: reorder(board.columns, fromIndex, toIndex) }
      })
    }
    case 'addTask': {
      const { columnId, title, description } = action.payload
      const trimmedTitle = title.trim()
      const trimmedDescription = description?.trim()
      if (!trimmedTitle) return state
      return updateSelectedBoard(state, (board) => {
        const nextColumns = board.columns.map((col) => {
          if (col.id !== columnId) return col
          const newTask: Task = {
            id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
            title: trimmedTitle,
            ...(trimmedDescription ? { description: trimmedDescription } : {}),
            createdAt: Date.now(),
          }
          return { ...col, tasks: [...col.tasks, newTask] }
        })
        return { ...board, columns: nextColumns }
      })
    }
    case 'deleteTask':
    case 'DELETE_TASK': {
      const { columnId, taskId } = action.payload
      return updateSelectedBoard(state, (board) => ({
        ...board,
        columns: board.columns.map((col) =>
          col.id === columnId
            ? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) }
            : col,
        ),
      }))
    }
    case 'editTask':
    case 'EDIT_TASK': {
      const { columnId, taskId, title, description } = action.payload
      const trimmedTitle = title.trim()
      const trimmedDescription = description?.trim()
      if (!trimmedTitle) return state
      return updateSelectedBoard(state, (board) => {
        const nextColumns = board.columns.map((col) => {
          if (col.id !== columnId) return col
          return {
            ...col,
            tasks: col.tasks.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    title: trimmedTitle,
                    ...(trimmedDescription !== undefined
                      ? { description: trimmedDescription }
                      : {}),
                  }
                : task,
            ),
          }
        })
        return { ...board, columns: nextColumns }
      })
    }
    case 'editColumn': {
      const { columnId, name } = action.payload
      const trimmedName = name.trim()
      if (!trimmedName) return state
      return updateSelectedBoard(state, (board) => ({
        ...board,
        columns: board.columns.map((col) =>
          col.id === columnId ? { ...col, name: trimmedName } : col,
        ),
      }))
    }
    case 'deleteColumn': {
      const { columnId } = action.payload
      return updateSelectedBoard(state, (board) => ({
        ...board,
        columns: board.columns.filter((col) => col.id !== columnId),
      }))
    }
    case 'reorderTasksInColumn': {
      const { columnId, orderedTaskIds } = action.payload
      return updateSelectedBoard(state, (board) => ({
        ...board,
        columns: board.columns.map((col) => {
          if (col.id !== columnId) return col
          const tasksById = new Map(col.tasks.map((task) => [task.id, task]))
          const reordered = orderedTaskIds
            .map((id) => tasksById.get(id))
            .filter((task): task is Task => Boolean(task))

          const remaining = col.tasks.filter((task) => !orderedTaskIds.includes(task.id))
          return { ...col, tasks: [...reordered, ...remaining] }
        }),
      }))
    }
    case 'moveTask':
    case 'MOVE_TASK': {
      const { fromColumnId, toColumnId, taskId } = action.payload
      if (fromColumnId === toColumnId) return state

      return updateSelectedBoard(state, (board) => {
        let taskToMove: Task | null = null

        const columnsWithoutTask = board.columns.map((col) => {
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

        if (!taskToMove) return board

        const columnsWithTaskMoved = columnsWithoutTask.map((col) =>
          col.id === toColumnId ? { ...col, tasks: [...col.tasks, taskToMove!] } : col,
        )

        return { ...board, columns: columnsWithTaskMoved }
      })
    }
    default:
      return state
  }
}
