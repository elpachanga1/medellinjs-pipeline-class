import { useState } from 'react'
import './Counter.css'

// 🎯 COMPONENTE PRINCIPAL DEL WORKSHOP
// Este es el componente que vas a modificar en los ejercicios.
// Cada vez que hagas push, GitHub Actions lo va a:
//   1. Verificar con lint
//   2. Probar con tests
//   3. Compilar con Vite
//   4. Publicar en GitHub Pages
function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => setCount((c) => c + 1)
  const decrement = () => setCount((c) => c - 1)
  const reset = () => setCount(0)

  return (
    <div className="counter" data-testid="counter">
      <h2 className="counter-title">Contador de Deploys</h2>

      <p className="counter-description">
        ¿Cuántas veces has desplegado hoy?
      </p>

      <div className="counter-display">
        <span className="counter-value" data-testid="counter-value">
          {count}
        </span>
      </div>

      <div className="counter-buttons">
        <button
          className="btn btn-secondary"
          onClick={decrement}
          aria-label="Decrementar contador"
        >
          −
        </button>

        <button
          className="btn btn-primary"
          onClick={increment}
          aria-label="Incrementar contador"
          data-testid="increment-button"
        >
          +
        </button>

        <button
          className="btn btn-ghost"
          onClick={reset}
          aria-label="Resetear contador"
          data-testid="reset-button"
        >
          Reset
        </button>
      </div>

      {count > 0 && (
        <p className="counter-message" data-testid="counter-message">
          {count === 1 ? '¡Primer deploy del día! 🎉' : `¡${count} deploys! Eres un/a máquina 🔥`}
        </p>
      )}
    </div>
  )
}

export default Counter
