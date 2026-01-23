import { describe, expect, it } from 'vitest'
import { boardReducer, initialBoardState } from '../state/boardReducer'
import type { BoardState } from '../types/board'

const cloneState = (): BoardState => JSON.parse(JSON.stringify(initialBoardState))

const getSelectedBoard = (state: BoardState) =>
  state.boards.find((b) => b.id === state.selectedBoardId) ?? state.boards[0]

describe('boardReducer', () => {
  it('adds a column', () => {
    const next = boardReducer(cloneState(), { type: 'addColumn', payload: { name: 'QA' } })
    const board = getSelectedBoard(next)
    expect(board.columns.some((c) => c.name === 'QA')).toBe(true)
  })

  it('deletes a column', () => {
    const withColumn = boardReducer(cloneState(), { type: 'addColumn', payload: { name: 'QA' } })
    const board = getSelectedBoard(withColumn)
    const qaId = board.columns.find((c) => c.name === 'QA')?.id ?? ''
    const next = boardReducer(withColumn, { type: 'deleteColumn', payload: { columnId: qaId } })
    const boardAfter = getSelectedBoard(next)
    expect(boardAfter.columns.some((c) => c.id === qaId)).toBe(false)
  })

  it('adds a task', () => {
    const state = cloneState()
    const next = boardReducer(state, {
      type: 'addTask',
      payload: { columnId: 'backlog', title: 'Task A', description: 'desc' },
    })
    const board = getSelectedBoard(next)
    const backlog = board.columns.find((c) => c.id === 'backlog')
    expect(backlog?.tasks).toHaveLength(1)
    expect(backlog?.tasks[0].title).toBe('Task A')
  })

  it('edits a task', () => {
    const withTask = boardReducer(cloneState(), {
      type: 'addTask',
      payload: { columnId: 'backlog', title: 'Task A', description: 'desc' },
    })
    const board = getSelectedBoard(withTask)
    const taskId = board.columns.find((c) => c.id === 'backlog')?.tasks[0]?.id as string
    const edited = boardReducer(withTask, {
      type: 'EDIT_TASK',
      payload: { columnId: 'backlog', taskId, title: 'Task B', description: 'new desc' },
    })
    const editedTask = getSelectedBoard(edited).columns.find((c) => c.id === 'backlog')?.tasks[0]
    expect(editedTask?.title).toBe('Task B')
    expect(editedTask?.description).toBe('new desc')
  })

  it('deletes a task', () => {
    const withTask = boardReducer(cloneState(), {
      type: 'addTask',
      payload: { columnId: 'backlog', title: 'Task A', description: 'desc' },
    })
    const board = getSelectedBoard(withTask)
    const taskId = board.columns.find((c) => c.id === 'backlog')?.tasks[0]?.id as string
    const next = boardReducer(withTask, {
      type: 'DELETE_TASK',
      payload: { columnId: 'backlog', taskId },
    })
    const backlog = getSelectedBoard(next).columns.find((c) => c.id === 'backlog')
    expect(backlog?.tasks).toHaveLength(0)
  })

  it('moves a task between columns', () => {
    const withTask = boardReducer(cloneState(), {
      type: 'addTask',
      payload: { columnId: 'backlog', title: 'Task A', description: 'desc' },
    })
    const board = getSelectedBoard(withTask)
    const taskId = board.columns.find((c) => c.id === 'backlog')?.tasks[0]?.id as string
    const moved = boardReducer(withTask, {
      type: 'moveTask',
      payload: { fromColumnId: 'backlog', toColumnId: 'in-progress', taskId },
    })
    const after = getSelectedBoard(moved)
    const backlog = after.columns.find((c) => c.id === 'backlog')
    const inProgress = after.columns.find((c) => c.id === 'in-progress')
    expect(backlog?.tasks.some((t) => t.id === taskId)).toBe(false)
    expect(inProgress?.tasks.some((t) => t.id === taskId)).toBe(true)
  })
})
