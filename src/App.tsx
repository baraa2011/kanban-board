import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import { useBoard } from './state/BoardContext'
import { Column } from './components/Column'

function App() {
  const {
    state: { columns },
    dispatch,
  } = useBoard()
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const handleAddColumn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const title = newColumnTitle.trim()
    if (!title) return
    dispatch({ type: 'addColumn', payload: { title } })
    setNewColumnTitle('')
  }

  return (
    <main className="board">
      <header className="board__header">
        <h1>Kanban Board</h1>
        <p className="board__summary">{columns.length} columns</p>
      </header>
      <form className="board__form" onSubmit={handleAddColumn}>
        <label className="board__form-label" htmlFor="new-column">
          Add a new list
        </label>
        <div className="board__form-controls">
          <input
            id="new-column"
            name="new-column"
            type="text"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            placeholder="e.g. Blockers"
            aria-label="New list name"
            className="board__input"
          />
          <button className="board__button" type="submit" disabled={!newColumnTitle.trim()}>
            Add List
          </button>
        </div>
      </form>
      <section className="board__columns">
        {columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </section>
    </main>
  )
}

export default App
