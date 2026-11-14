# 📚 Guía del Workshop — GitHub Actions + GitHub Pages

**Duración:** 1:30 – 2 horas  
**Nivel:** Universitarios con conocimiento básico/intermedio de Git

---

## Agenda

| Tiempo | Sección |
|--------|---------|
| 0:00 – 0:10 | Conceptos clave |
| 0:10 – 0:25 | Tour del workflow |
| 0:25 – 0:40 | Fork, configuración y primer deploy |
| 0:40 – 0:55 | Ejercicio 1: cambiar y desplegar |
| 0:55 – 1:20 | Ejercicio 2: romper el pipeline y arreglarlo |
| 1:20 – 1:40 | Ejercicio 3: agregar un test nuevo |
| 1:40 – 2:00 | Reto extra + preguntas |

---

## Parte 1 — Conceptos clave (10 min)

### ¿Qué es GitHub Actions?

GitHub Actions es un sistema de **automatización** integrado en GitHub. Permite ejecutar código automáticamente cuando ocurren eventos en tu repositorio (push, PR, etc.).

### Términos que usaremos hoy

```
┌──────────────────────────────────────────────────┐
│  WORKFLOW (.github/workflows/deploy.yml)         │
│  Archivo YAML que describe toda la automatización│
│                                                  │
│  ┌──────────────┐    ┌──────────────┐            │
│  │   JOB: lint  │    │   JOB: test  │  ← paralelo│
│  │  (una VM)    │    │  (otra VM)   │            │
│  └──────┬───────┘    └──────┬───────┘            │
│         │                   │                    │
│         └─────────┬─────────┘                    │
│                   ▼                              │
│           ┌───────────────┐                      │
│           │  JOB: deploy  │  ← necesita los dos  │
│           │   (otra VM)   │                      │
│           └───────────────┘                      │
└──────────────────────────────────────────────────┘
```

| Concepto | Qué es |
|----------|--------|
| **Workflow** | El archivo `.yml` completo — define todo el proceso |
| **Trigger** | El evento que activa el workflow (`push`, `PR`, manual) |
| **Job** | Un grupo de pasos que corren en una misma máquina virtual |
| **Step** | Un comando individual o una acción dentro de un job |
| **Action** | Un paso reutilizable publicado en el Marketplace (ej: `actions/checkout@v4`) |
| **Runner** | La máquina virtual donde corre el job (`ubuntu-latest`) |
| **Artefacto** | Un archivo generado en un job que se puede pasar a otro job |

### El ciclo completo de hoy

```
1. Escribes código
2. Haces git push
3. GitHub detecta el push (trigger)
4. Lanza VMs en la nube (runners)
5. Instala Node, corre lint, corre tests
6. Si todo pasa → compila y despliega
7. Tu sitio se actualiza en <30 segundos 🎉
```

---

## Parte 2 — Tour del workflow (15 min)

Abre `.github/workflows/deploy.yml` y lee los comentarios juntos con el instructor.

### Puntos clave del archivo

**Los triggers:**
```yaml
on:
  push:
    branches: [main]      # Se activa en cada push a main
  workflow_dispatch:       # Se puede lanzar manualmente
```

**Los permisos:**
```yaml
permissions:
  contents: read   # Leer el código
  pages: write     # Escribir en GitHub Pages
  id-token: write  # Token de identidad (requerido)
```

**La dependencia entre jobs:**
```yaml
deploy:
  needs: [lint, test]   # 🔑 Esta línea es el "gate"
```

**El artefacto:**
```yaml
- uses: actions/upload-pages-artifact@v3
  with:
    path: ./dist          # Solo sube la carpeta compilada
```

**Pregunta para reflexionar:** ¿Por qué usamos `npm ci` en vez de `npm install` en el pipeline?

> `npm ci` siempre instala exactamente lo que dice `package-lock.json`. Es más rápido y predecible en CI porque no resuelve versiones ni modifica el lockfile.

---

## Parte 3 — Fork, configuración y primer deploy (15 min)

### Paso 1: Fork del repo

1. Ve a `github.com/<instructor>/medellinjs-pipeline-class`
2. Clic en **Fork** → **Create fork**

### Paso 2: Clonar tu fork

```bash
git clone https://github.com/<TU-USUARIO>/medellinjs-pipeline-class.git
cd medellinjs-pipeline-class
npm install
```

### Paso 3: Habilitar GitHub Pages

1. En tu fork, ve a **Settings** (arriba a la derecha)
2. En el menú izquierdo: **Pages**
3. En **Source**, selecciona **GitHub Actions**
4. Clic en **Save**

> ⚠️ Este paso es obligatorio. Sin él, el job `deploy` falla aunque todo lo demás pase.

### Paso 4: Ajustar el `base` en `vite.config.js`

Si cambiaste el nombre del repo al hacer fork, actualiza esta línea:

```js
// vite.config.js
base: '/<NOMBRE-DE-TU-REPO>/',
```

Si mantuviste `medellinjs-pipeline-class`, no necesitas cambiar nada.

### Paso 5: Primer push

```bash
git add vite.config.js
git commit -m "config: ajustar base para mi repo"
git push
```

### Paso 6: Observar el pipeline

1. Ve a la pestaña **Actions** de tu repo en GitHub
2. Verás el workflow corriendo
3. Haz clic en él para ver los 3 jobs en tiempo real
4. Cuando termine, el job `deploy` muestra la URL de tu sitio

---

## Ejercicio 1 — Cambiar y desplegar (15 min)

**Objetivo:** Sentir el ciclo completo de push → pipeline → sitio actualizado.

### Qué hacer

Abre `src/components/Counter.jsx` y personaliza el componente. Por ejemplo:

1. Cambia el título `"Contador de Deploys"` por algo tuyo
2. Cambia los mensajes motivadores:
   ```jsx
   // Línea ~54
   {count === 1 ? '¡Primer deploy del día! 🎉' : `¡${count} deploys! Eres un/a máquina 🔥`}
   ```
3. Cambia el título en `src/App.jsx`:
   ```jsx
   <h1>🚀 MedellínJS Pipeline Workshop</h1>
   ```

### Push y observar

```bash
git add src/
git commit -m "feat: personalizar el contador"
git push
```

**Revisa:** ¿Los 3 jobs pasan? ¿El sitio se actualiza con tu cambio?

---

## Ejercicio 2 — Romper el pipeline (25 min)

**Objetivo:** Entender por qué los gates de CI/CD son valiosos.

### Parte A: Romper el lint

1. Abre `src/components/Counter.jsx`
2. Agrega una variable que no se usa:
   ```jsx
   // Al inicio del componente, después del useState
   const variableQueNoUso = "esto va a fallar el lint"
   ```
3. Haz push:
   ```bash
   git add src/components/Counter.jsx
   git commit -m "bug: variable sin usar"
   git push
   ```
4. Ve a **Actions** — el job `lint` falla en rojo ❌
5. **Observa:** el job `deploy` ni siquiera intenta correr

**Pregunta:** ¿Por qué el deploy no corre si el lint falla?

> Porque `deploy` tiene `needs: [lint, test]`. Si lint falla, GitHub Actions cancela los jobs dependientes automáticamente.

### Arreglarlo

```bash
# Elimina la variable que agregaste, luego:
git add src/components/Counter.jsx
git commit -m "fix: remover variable sin usar"
git push
```

### Parte B: Romper un test

1. Abre `src/test/Counter.test.jsx`
2. Modifica el primer test para que falle:
   ```jsx
   // Cambia esto:
   expect(value).toHaveTextContent('0')
   // Por esto (el número incorrecto):
   expect(value).toHaveTextContent('999')
   ```
3. Haz push y observa que el job `test` falla ❌ pero el job `lint` pasa ✅
4. El deploy no ocurre — el sitio en producción no se rompe

**Arreglarlo:**
```bash
# Vuelve el test a '0', luego:
git add src/test/Counter.test.jsx
git commit -m "fix: corregir valor esperado en test"
git push
```

---

## Ejercicio 3 — Agregar un test nuevo (25 min)

**Objetivo:** Escribir un test real y hacer que el pipeline lo valide.

### El reto

Agrega un botón "Doble" en el `Counter` que duplique el valor actual, y escribe el test para él.

### Paso 1: Agregar el botón en `Counter.jsx`

```jsx
// En la función Counter, agrega:
const double = () => setCount((c) => c * 2)

// En el JSX, agrega el botón junto a los otros:
<button
  className="btn btn-secondary"
  onClick={double}
  aria-label="Duplicar contador"
  data-testid="double-button"
>
  ×2
</button>
```

### Paso 2: Escribir el test en `Counter.test.jsx`

Agrega este test al final del `describe`:

```jsx
it('duplica el contador al hacer click en ×2', async () => {
  const user = userEvent.setup()
  render(<Counter />)

  // Llegar a 3 incrementando
  const btn = screen.getByTestId('increment-button')
  await user.click(btn)
  await user.click(btn)
  await user.click(btn)

  // Duplicar
  await user.click(screen.getByTestId('double-button'))

  expect(screen.getByTestId('counter-value')).toHaveTextContent('6')
})
```

### Paso 3: Verificar localmente antes de hacer push

```bash
npm test
```

Deberías ver 7 tests pasando (6 anteriores + 1 nuevo).

### Paso 4: Push

```bash
git add src/
git commit -m "feat: agregar botón para duplicar contador"
git push
```

---

## Reto Extra — Para quien va rápido

### Opción A: Agregar el número del build al sitio

En el workflow, pasa el número del run como variable de entorno:

```yaml
# En el step de build
- name: 🏗️ Build de producción
  run: npm run build
  env:
    VITE_BUILD_NUMBER: ${{ github.run_number }}
```

En `App.jsx`, muéstralo:
```jsx
<p>Build #{import.meta.env.VITE_BUILD_NUMBER}</p>
```

### Opción B: Solo desplegar en tags de versión

Modifica el trigger para que el deploy solo ocurra cuando creas un tag:

```yaml
on:
  push:
    tags:
      - 'v*'   # v1.0, v1.1.0, etc.
  workflow_dispatch:
```

### Opción C: Pull Request preview

Agrega un segundo workflow `.github/workflows/pr-check.yml` que solo corra lint y tests (sin deploy) en cada PR, como gate antes de mergear a main.

---

## Resumen de lo aprendido

| Concepto | Dónde lo viste |
|----------|---------------|
| Workflow YAML | `.github/workflows/deploy.yml` |
| Triggers | `on: push` y `workflow_dispatch` |
| Jobs en paralelo | `lint` y `test` corriendo al mismo tiempo |
| Dependencias con `needs` | `deploy` esperando a `lint` y `test` |
| Actions del Marketplace | `checkout`, `setup-node`, `deploy-pages` |
| Artefactos | `upload-pages-artifact` → `deploy-pages` |
| Gate de calidad | El deploy no corre si lint o test fallan |
| Cache de dependencias | `cache: npm` en `setup-node` |

---

## Recursos para seguir aprendiendo

- [Documentación oficial de GitHub Actions](https://docs.github.com/en/actions)
- [Marketplace de Actions](https://github.com/marketplace?type=actions)
- [Vite — Deploy a GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages)
- [Vitest — Documentación](https://vitest.dev/)
