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
      <div className="board__form-controls flex flex-col gap-2 md:flex-row">
        <input
          id="new-column"
          name="new-column"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Blockers"
          aria-label="New list name"
          className="board__input w-full px-3 py-2"
        />
        <button
          className="board__button w-full px-4 py-2 md:w-auto"
          type="submit"
          disabled={!name.trim()}
        >
          Add List
        </button>
      </div>
    </form>
  )
}
