export type ColumnId = string

export type Column = {
  id: ColumnId
  title: string
}

export type BoardState = {
  columns: Column[]
}

export type BoardAction =
  | { type: 'addColumn'; payload: { title: string } }
  | { type: 'removeColumn'; payload: { id: ColumnId } }
  | { type: 'renameColumn'; payload: { id: ColumnId; title: string } }
  | { type: 'reorderColumns'; payload: { fromIndex: number; toIndex: number } }
