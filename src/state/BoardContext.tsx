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
import type { BoardAction, BoardState, Task, Column } from '../types/board'

type BoardContextValue = {
  state: BoardState
  dispatch: Dispatch<BoardAction>
}

const BoardContext = createContext<BoardContextValue | undefined>(undefined)
const STORAGE_KEY = 'kanban.board.state.v1'

const loadPersistedState = (fallback: BoardState) => {
  if (typeof localStorage === 'undefined') return fallback
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return fallback
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return fallback
    if (!Array.isArray(parsed.columns)) return fallback
    const columns: Array<Column | null> = parsed.columns.map((col: unknown) => {
      if (!col || typeof col !== 'object') return null
      const id = (col as { id?: string }).id
      const name = (col as { name?: string }).name
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
      if (typeof id !== 'string' || typeof name !== 'string') return null
      return { id, name, tasks }
    })
    if (columns.some((col: Column | null) => col === null)) return fallback
    return { ...fallback, ...parsed, columns } satisfies BoardState
  } catch {
    return fallback
  }
}

export const BoardProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(boardReducer, initialBoardState, (initial) =>
    loadPersistedState(initial),
  )

  useEffect(() => {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])

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
