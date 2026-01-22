export type ColumnId = string

export type Task = {
  id: string
  title: string
  description?: string
  createdAt: number
}

export type Column = {
  id: ColumnId
  name: string
  tasks: Task[]
}

export type Board = {
  id: string
  name: string
  columns: Column[]
}

export type BoardState = {
  boards: Board[]
  selectedBoardId: string
}

export type BoardAction =
  | { type: 'addColumn'; payload: { name: string } }
  | { type: 'removeColumn'; payload: { id: ColumnId } }
  | { type: 'renameColumn'; payload: { id: ColumnId; name: string } }
  | { type: 'reorderColumns'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'addTask'; payload: { columnId: ColumnId; title: string; description?: string } }
  | { type: 'deleteTask'; payload: { columnId: ColumnId; taskId: string } }
  | {
      type: 'editTask'
      payload: { columnId: ColumnId; taskId: string; title: string; description?: string }
    }
  | {
      type: 'EDIT_TASK'
      payload: { columnId: ColumnId; taskId: string; title: string; description?: string }
    }
  | { type: 'editColumn'; payload: { columnId: ColumnId; name: string } }
  | { type: 'deleteColumn'; payload: { columnId: ColumnId } }
  | { type: 'moveTask'; payload: { fromColumnId: ColumnId; toColumnId: ColumnId; taskId: string } }
  | { type: 'MOVE_TASK'; payload: { fromColumnId: ColumnId; toColumnId: ColumnId; taskId: string } }
  | {
      type: 'reorderTasksInColumn'
      payload: { columnId: ColumnId; orderedTaskIds: string[] }
    }
  | { type: 'deleteTask'; payload: { columnId: ColumnId; taskId: string } }
  | { type: 'DELETE_TASK'; payload: { columnId: ColumnId; taskId: string } }
  | { type: 'addBoard'; payload: { name: string } }
  | { type: 'selectBoard'; payload: { boardId: string } }
  | { type: 'ADD_BOARD'; payload: { name: string } }
  | { type: 'SELECT_BOARD'; payload: { boardId: string } }
  | { type: 'DELETE_BOARD'; payload: { boardId: string } }
