import { useBoard } from '../state/BoardContext'

type Props = {
  title: string
}

export const Header = ({ title }: Props) => {
  const { state, dispatch, selectedBoard } = useBoard()

  const handleSelect = (boardId: string) => {
    dispatch({ type: 'selectBoard', payload: { boardId } })
  }

  const handleNewBoard = () => {
    const name = window.prompt('Board name?')
    const trimmed = name?.trim()
    if (!trimmed) return
    dispatch({ type: 'addBoard', payload: { name: trimmed } })
    dispatch({
      type: 'selectBoard',
      payload: { boardId: trimmed.toLowerCase().replace(/\s+/g, '-') },
    })
  }

  const handleDeleteBoard = () => {
    if (!selectedBoard) return
    if (!window.confirm(`Delete board "${selectedBoard.name}" and its lists/tasks?`)) return
    dispatch({ type: 'DELETE_BOARD', payload: { boardId: selectedBoard.id } })
  }

  return (
    <header className="board__header flex items-center justify-between gap-4 pb-2 border-b border-slate-200 flex-wrap">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
      <div className="flex flex-wrap items-center gap-2">
        <select
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          value={selectedBoard?.id ?? state.selectedBoardId}
          onChange={(e) => handleSelect(e.target.value)}
        >
          {state.boards.map((board) => (
            <option key={board.id} value={board.id}>
              {board.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={handleNewBoard}
        >
          New Board
        </button>
        <button
          type="button"
          className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-red-500 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          onClick={handleDeleteBoard}
          disabled={!selectedBoard}
        >
          Delete Board
        </button>
      </div>
    </header>
  )
}
