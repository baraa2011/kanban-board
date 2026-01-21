import { useState } from 'react'
import type { FormEvent } from 'react'
import { useBoard } from '../state/BoardContext'

export const NewColumnForm = () => {
  const { dispatch } = useBoard()
  const [name, setName] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    dispatch({ type: 'addColumn', payload: { name: trimmed } })
    setName('')
  }

  return (
    <form className="board__form" onSubmit={handleSubmit}>
      <label className="board__form-label" htmlFor="new-column">
        Add a new list
      </label>
      <div className="board__form-controls">
        <input
          id="new-column"
          name="new-column"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Blockers"
          aria-label="New list name"
          className="board__input"
        />
        <button className="board__button" type="submit" disabled={!name.trim()}>
          Add List
        </button>
      </div>
    </form>
  )
}
