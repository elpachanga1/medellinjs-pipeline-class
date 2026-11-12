# 🚀 MedellínJS — Pipeline Workshop

Proyecto plantilla para el workshop de **GitHub Actions + GitHub Pages**.

Aprenderás a construir un pipeline CI/CD real que:
1. Verifica la calidad del código con **ESLint** (lint)
2. Corre tests unitarios con **Vitest** (test)
3. Compila la app con **Vite** (build)
4. La publica automáticamente en **GitHub Pages** (deploy)

```
lint ──┐
        ├──► deploy ──► 🌐 tu-usuario.github.io/tu-repo
test ──┘
```

---

## Inicio rápido

### 1. Haz fork de este repo

Haz clic en **Fork** (esquina superior derecha) y clona tu fork:

```bash
git clone https://github.com/<tu-usuario>/medellinjs-pipeline-class.git
cd medellinjs-pipeline-class
```

### 2. Instala dependencias y corre el proyecto localmente

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) — deberías ver el contador.

### 3. Corre los tests localmente

```bash
npm test
```

### 4. Habilita GitHub Pages en tu fork

1. Ve a **Settings → Pages** en tu repositorio
2. En **Build and deployment → Source**, selecciona **GitHub Actions**
3. Guarda

### 5. Ajusta el `base` en `vite.config.js`

Abre `vite.config.js` y cambia el nombre del repo:

```js
// Antes:
base: '/medellinjs-pipeline-class/',

// Después (con el nombre de TU fork):
base: '/medellinjs-pipeline-class/',  // si no cambiaste el nombre, déjalo igual
```

### 6. Haz push y observa el pipeline

```bash
git add .
git commit -m "feat: mi primer deploy con GitHub Actions"
git push
```

Ve a la pestaña **Actions** de tu repo para ver el pipeline en tiempo real.

---

## Estructura del proyecto

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml        # El pipeline CI/CD (¡léelo!)
├── src/
│   ├── components/
│   │   ├── Counter.jsx       # Componente principal (aquí haces ejercicios)
│   │   └── Counter.css
│   ├── test/
│   │   ├── setup.js          # Configuración de los tests
│   │   └── Counter.test.jsx  # Tests del Counter
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js            # Configuración de Vite + Vitest
├── package.json
└── .eslintrc.cjs             # Reglas de ESLint
```

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila para producción (genera `dist/`) |
| `npm run preview` | Sirve el build localmente para revisarlo |
| `npm run lint` | Verifica el código con ESLint |
| `npm test` | Corre los tests con Vitest |

---

## Guía del workshop

Consulta [`WORKSHOP.md`](./WORKSHOP.md) para la guía paso a paso de los ejercicios.

Si eres el instructor, consulta [`INSTRUCTOR.md`](./INSTRUCTOR.md).
