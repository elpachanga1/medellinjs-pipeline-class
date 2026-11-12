import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Counter from '../components/Counter.jsx'

// 🧪 TESTS DEL COMPONENTE COUNTER
// Estos tests corren en el job "test" del pipeline antes de desplegar.
// Si cualquiera falla, el deploy no ocurre. Eso es CI/CD real.

describe('Counter component', () => {
  it('muestra el valor inicial en 0', () => {
    render(<Counter />)

    // Buscamos el elemento que muestra el número por su data-testid
    const value = screen.getByTestId('counter-value')
    expect(value).toHaveTextContent('0')
  })

  it('incrementa el contador al hacer click en el botón +', async () => {
    // userEvent simula interacciones reales del usuario (más fiel que fireEvent)
    const user = userEvent.setup()
    render(<Counter />)

    const button = screen.getByTestId('increment-button')
    await user.click(button)

    expect(screen.getByTestId('counter-value')).toHaveTextContent('1')
  })

  it('decrementa el contador al hacer click en el botón −', async () => {
    const user = userEvent.setup()
    render(<Counter />)

    // Primero incrementamos para tener algo que decrementar
    await user.click(screen.getByTestId('increment-button'))
    await user.click(screen.getByTestId('increment-button'))

    // Ahora hacemos click en − (buscamos por aria-label para practicar accesibilidad)
    await user.click(screen.getByRole('button', { name: /decrementar/i }))

    expect(screen.getByTestId('counter-value')).toHaveTextContent('1')
  })

  it('resetea el contador a 0', async () => {
    const user = userEvent.setup()
    render(<Counter />)

    // Incrementar varias veces
    const btn = screen.getByTestId('increment-button')
    await user.click(btn)
    await user.click(btn)
    await user.click(btn)

    // Reset
    await user.click(screen.getByTestId('reset-button'))

    expect(screen.getByTestId('counter-value')).toHaveTextContent('0')
  })

  it('muestra mensaje motivador después del primer click', async () => {
    const user = userEvent.setup()
    render(<Counter />)

    // Antes del primer click no debe existir el mensaje
    expect(screen.queryByTestId('counter-message')).not.toBeInTheDocument()

    await user.click(screen.getByTestId('increment-button'))

    // Después del primer click debe aparecer
    expect(screen.getByTestId('counter-message')).toBeInTheDocument()
    expect(screen.getByTestId('counter-message')).toHaveTextContent(
      /primer deploy/i
    )
  })

  it('oculta el mensaje motivador al resetear', async () => {
    const user = userEvent.setup()
    render(<Counter />)

    await user.click(screen.getByTestId('increment-button'))
    expect(screen.getByTestId('counter-message')).toBeInTheDocument()

    await user.click(screen.getByTestId('reset-button'))
    expect(screen.queryByTestId('counter-message')).not.toBeInTheDocument()
  })
})
