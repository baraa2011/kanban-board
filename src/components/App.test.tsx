import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'
import { BoardProvider } from '../state/BoardContext'

const renderApp = () =>
  render(
    <BoardProvider>
      <App />
    </BoardProvider>,
  )

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates a new list and shows it as a column', () => {
    renderApp()

    const input = screen.getByLabelText(/new list name/i)
    fireEvent.change(input, { target: { value: 'QA' } })

    const addButton = screen.getByRole('button', { name: /add list/i })
    fireEvent.click(addButton)

    expect(screen.getByText('QA')).toBeInTheDocument()
  })
})
