import {
  createContext,
  useContext,
  type Dispatch,
  type PropsWithChildren,
  useMemo,
  useEffect,
  useReducer,
} from 'react'
import { boardReducer, initialBoardState } from './boardReducer'
import type { BoardAction, BoardState, Task, Column, Board } from '../types/board'

type BoardContextValue = {
  state: BoardState
  dispatch: Dispatch<BoardAction>
  selectedBoard: Board | null
}

const BoardContext = createContext<BoardContextValue | undefined>(undefined)
const STORAGE_KEY = 'kanban.board.state.v1'
const SELECTED_KEY = 'kanban.selectedBoardId.v1'

const loadPersistedState = (fallback: BoardState) => {
  if (typeof localStorage === 'undefined') return fallback
  const raw = localStorage.getItem(STORAGE_KEY)
  const selectedRaw = localStorage.getItem(SELECTED_KEY)
  if (!raw) return fallback
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return fallback
    const boardsRaw = (parsed as { boards?: unknown }).boards
    if (!Array.isArray(boardsRaw)) return fallback
    const boards: Array<Board | null> = boardsRaw.map((board: unknown) => {
      if (!board || typeof board !== 'object') return null
      const id = (board as { id?: string }).id
      const name = (board as { name?: string }).name
      const columnsRaw = (board as { columns?: unknown }).columns
      if (!Array.isArray(columnsRaw)) return null
      const columns: Array<Column | null> = columnsRaw.map((col: unknown) => {
        if (!col || typeof col !== 'object') return null
        const colId = (col as { id?: string }).id
        const colName = (col as { name?: string }).name
        const tasksRaw = (col as { tasks?: unknown }).tasks
        const tasks: Task[] = Array.isArray(tasksRaw)
          ? tasksRaw
              .map((task: unknown) => {
                if (!task || typeof task !== 'object') return null
                const taskId = (task as { id?: string }).id
                const title = (task as { title?: string }).title
                const description = (task as { description?: string }).description
                const createdAt = (task as { createdAt?: number }).createdAt
                if (
                  typeof taskId !== 'string' ||
                  typeof title !== 'string' ||
                  typeof createdAt !== 'number'
                ) {
                  return null
                }
                return description && typeof description === 'string'
                  ? { id: taskId, title, description, createdAt }
                  : { id: taskId, title, createdAt }
              })
              .filter((task): task is Task => Boolean(task))
          : []
        if (typeof colId !== 'string' || typeof colName !== 'string') return null
        return { id: colId, name: colName, tasks }
      })
      if (columns.some((c) => c === null)) return null
      if (typeof id !== 'string' || typeof name !== 'string') return null
      return { id, name, columns: columns as Column[] }
    })
    if (boards.some((b) => b === null)) return fallback
    const persistedSelected =
      typeof selectedRaw === 'string'
        ? selectedRaw
        : (parsed as { selectedBoardId?: string }).selectedBoardId
    const selectedBoardIdCandidate =
      typeof persistedSelected === 'string' ? persistedSelected : fallback.selectedBoardId
    const selectedBoardId = (boards as Board[]).some((b) => b.id === selectedBoardIdCandidate)
      ? selectedBoardIdCandidate
      : ((boards as Board[])[0]?.id ?? fallback.selectedBoardId)
    return { ...fallback, boards: boards as Board[], selectedBoardId } satisfies BoardState
  } catch {
    return fallback
  }
}

export const BoardProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(boardReducer, initialBoardState, (initial) =>
    loadPersistedState(initial),
  )

  const selectedBoard =
    state.boards.find((board) => board.id === state.selectedBoardId) ?? state.boards[0] ?? null

  useEffect(() => {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ boards: state.boards }))
    localStorage.setItem(SELECTED_KEY, state.selectedBoardId)
  }, [state])

  const value = useMemo(
    () => ({ state, dispatch, selectedBoard }),
    [state, dispatch, selectedBoard],
  )

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBoard = () => {
  const context = useContext(BoardContext)
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider')
  }
  return context
}
