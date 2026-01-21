import type { BoardAction, BoardState, Column } from '../types/board'

const reorder = (list: Column[], fromIndex: number, toIndex: number) => {
  const next = [...list]
  const [removed] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, removed)
  return next
}

export const initialBoardState: BoardState = {
  columns: [
    { id: 'backlog', title: 'Backlog' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'review', title: 'Review' },
    { id: 'done', title: 'Done' },
  ],
}

export const boardReducer = (state: BoardState, action: BoardAction): BoardState => {
  switch (action.type) {
    case 'addColumn': {
      const title = action.payload.title.trim()
      if (!title) {
        return state
      }
      const id = title.toLowerCase().replace(/\s+/g, '-')
      const exists = state.columns.some((col) => col.id === id)
      if (exists) {
        return state
      }
      const column: Column = { id, title }
      return { ...state, columns: [...state.columns, column] }
    }
    case 'removeColumn': {
      return { ...state, columns: state.columns.filter((col) => col.id !== action.payload.id) }
    }
    case 'renameColumn': {
      const title = action.payload.title.trim()
      if (!title) {
        return state
      }
      return {
        ...state,
        columns: state.columns.map((col) =>
          col.id === action.payload.id ? { ...col, title } : col,
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
    default:
      return state
  }
}
