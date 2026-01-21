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
import type { BoardAction, BoardState } from '../types/board'

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
    return { ...fallback, ...parsed, columns: parsed.columns } satisfies BoardState
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
