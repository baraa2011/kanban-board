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

export type BoardState = {
  columns: Column[]
}

export type BoardAction =
  | { type: 'addColumn'; payload: { name: string } }
  | { type: 'removeColumn'; payload: { id: ColumnId } }
  | { type: 'renameColumn'; payload: { id: ColumnId; name: string } }
  | { type: 'reorderColumns'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'addTask'; payload: { columnId: ColumnId; title: string; description?: string } }
