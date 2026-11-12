import Counter from './components/Counter.jsx'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 MedellínJS Pipeline Workshop</h1>
        <p className="subtitle">
          Desplegado automáticamente con <strong>GitHub Actions</strong>
        </p>
      </header>

      <main>
        <Counter />
      </main>

      <footer className="app-footer">
        <p>
          Hecho con ❤️ en Medellín •{' '}
          <a
            href="https://github.com/features/actions"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Actions
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
