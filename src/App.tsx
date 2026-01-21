import './App.css'
import { useBoard } from './state/BoardContext'
import { Header } from './components/Header'
import { NewColumnForm } from './components/NewColumnForm'
import { Board } from './components/Board'

function App() {
  const {
    state: { columns },
  } = useBoard()

  return (
    <main className="board max-w-screen-xl mx-auto px-6 space-y-4">
      <Header title="Kanban Board" />
      <NewColumnForm />
      <Board columns={columns} />
    </main>
  )
}

export default App
