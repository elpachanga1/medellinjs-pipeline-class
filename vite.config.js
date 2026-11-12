import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 🔑 IMPORTANTE PARA EL WORKSHOP:
// Cuando GitHub Pages sirve tu sitio en:
//   https://<tu-usuario>.github.io/<nombre-del-repo>/
// Vite necesita saber esa ruta base para que los assets (JS, CSS)
// se carguen correctamente.
//
// Cambia 'medellinjs-pipeline-class' por el nombre de tu repo.
// Si tu sitio va en la raíz del dominio (ej: usuario.github.io sin subruta),
// puedes usar base: '/' o simplemente eliminar esta línea.
export default defineConfig({
  plugins: [react()],
  base: '/medellinjs-pipeline-class/',

  // Configuración de Vitest para los tests
  test: {
    // jsdom simula un navegador en Node.js para poder hacer render de componentes React
    environment: 'jsdom',
    // Carga los matchers extra de @testing-library/jest-dom (toBeInTheDocument, etc.)
    setupFiles: ['./src/test/setup.js'],
    globals: true,
  },
})
