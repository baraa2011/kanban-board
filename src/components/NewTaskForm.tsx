import { useState } from 'react'
import type { FormEvent } from 'react'
import { useBoard } from '../state/BoardContext'

type Props = {
  columnId: string
}

export const NewTaskForm = ({ columnId }: Props) => {
  const { dispatch } = useBoard()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()
    if (!trimmedTitle) {
      setError('Title is required')
      return
    }

    dispatch({
      type: 'addTask',
      payload: {
        columnId,
        title: trimmedTitle,
        description: trimmedDescription || undefined,
      },
    })

    setTitle('')
    setDescription('')
    setError('')
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700" htmlFor={`${columnId}-title`}>
          Title
        </label>
        <input
          id={`${columnId}-title`}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="Task title"
          aria-label="Task title"
          required
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700" htmlFor={`${columnId}-description`}>
          Description (optional)
        </label>
        <textarea
          id={`${columnId}-description`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="Add details"
          aria-label="Task description"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="self-start rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
        disabled={!title.trim()}
      >
        Add Task
      </button>
    </form>
  )
}
