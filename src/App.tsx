import './App.css'
import { useBoard } from './state/BoardContext'
import { Header } from './components/Header'
import { NewColumnForm } from './components/NewColumnForm'
import { Board } from './components/Board'

function App() {
  const { selectedBoard } = useBoard()
  const columns = selectedBoard?.columns ?? []

  return (
    <main className="board max-w-screen-xl mx-auto px-6 space-y-6">
      <Header title={selectedBoard?.name ?? 'Kanban Board'} />
      <NewColumnForm />
      <Board columns={columns} />
    </main>
  )
}

export default App
