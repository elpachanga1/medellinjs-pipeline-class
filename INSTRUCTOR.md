# 🎓 Guía del Instructor

Notas internas para facilitar el workshop. No es necesario compartir este archivo con los estudiantes.

---

## Preparación (antes de la clase)

### Lista de verificación

- [ ] Crear el repo en GitHub (público, para que los forks sean gratuitos en Pages)
- [ ] Habilitar GitHub Pages con **Source: GitHub Actions** en tu repo base
- [ ] Hacer al menos un push exitoso para confirmar que el pipeline corre verde
- [ ] Verificar que la URL `<tu-usuario>.github.io/medellinjs-pipeline-class` responde
- [ ] Tener Node 18+ instalado si quieres demostrar `npm test` en vivo
- [ ] Preparar una pestaña del browser con tu repo de GitHub abierta en **Actions**

### Tiempo estimado por sección

| Sección | Tiempo | Notas |
|---------|--------|-------|
| Intro + conceptos | 10 min | Slide o pizarrón con el diagrama del pipeline |
| Tour del workflow | 15 min | Leer el `.yml` juntos en pantalla |
| Fork + configuración | 15 min | El paso de Settings → Pages se olvida siempre |
| Ejercicio 1 | 15 min | Dejar que lo hagan solos, caminar por el salón |
| Ejercicio 2 | 25 min | El más valioso didácticamente — no apurar |
| Ejercicio 3 | 25 min | Pueden trabajar en parejas |
| Reto extra + Q&A | 15 min | Para quien termina rápido |

---

## Errores comunes y cómo resolverlos

### ❌ Error 1: El sitio carga en blanco o los assets 404

**Síntoma:** GitHub Pages muestra la página pero sin estilos ni scripts, o la URL devuelve 404.

**Causa:** El `base` en `vite.config.js` no coincide con el nombre del repo.

**Solución:**
```js
// vite.config.js
base: '/<nombre-exacto-del-repo>/',
// Ejemplo: si el repo se llama "mi-workshop", debe ser:
base: '/mi-workshop/',
```

Este es el error más frecuente. Anticiparlo en la explicación de la Parte 3 ahorra mucho tiempo.

---

### ❌ Error 2: Job "deploy" falla con "Error: No deployment found"

**Síntoma:** El job de deploy falla en el step `actions/deploy-pages`.

**Causa:** GitHub Pages no está habilitado con Source: GitHub Actions en el repo del estudiante.

**Solución:**
1. Settings → Pages → Source → **GitHub Actions** → Save
2. Volver a lanzar el workflow: Actions → Run workflow

---

### ❌ Error 3: Permission denied / Resource not accessible by integration

**Síntoma:** Error de permisos en el deploy job.

**Causa:** El repo es privado (GitHub Pages requiere plan Pro/Team para repos privados) o los permisos del token no están configurados.

**Solución:**
- Confirmar que el repo sea **público** (Free plan)
- Verificar que el workflow tiene:
  ```yaml
  permissions:
    pages: write
    id-token: write
  ```

---

### ❌ Error 4: ESLint falla con "Cannot find module"

**Síntoma:** El job `lint` falla en `npm run lint` con error de módulo no encontrado.

**Causa:** `npm ci` falló silenciosamente o el `package-lock.json` no está en el repo.

**Solución:**
```bash
# El estudiante debe hacer esto localmente y commitear el lockfile:
npm install
git add package-lock.json
git commit -m "chore: agregar package-lock.json"
git push
```

---

### ❌ Error 5: Tests fallan con "jsdom is not defined"

**Síntoma:** Vitest falla con error relacionado a `jsdom`.

**Causa:** La configuración de `vite.config.js` fue modificada y se quitó `environment: 'jsdom'`.

**Solución:** Verificar que `vite.config.js` tenga:
```js
test: {
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.js'],
  globals: true,
},
```

---

### ❌ Error 6: El primer pipeline tarda más de lo esperado

**Síntoma:** Los jobs tardan 3-4 minutos la primera vez.

**Causa:** Normal — GitHub está descargando la imagen de Ubuntu y no hay cache de npm todavía.

**Solución:** No hacer nada. El segundo run es notablemente más rápido gracias al cache de npm. Úsalo como momento para explicar el concepto de cache en CI.

---

## Preguntas frecuentes de estudiantes

**¿Por qué 3 jobs separados y no todo en uno?**

> Los jobs corren en VMs aisladas. Si los pusieramos todos juntos y el lint falla al minuto 1, habrías esperado 3 minutos para saberlo. Con jobs separados, el feedback es más rápido. Además, lint y test pueden correr en paralelo.

**¿Qué pasa si no tenemos `package-lock.json` en el repo?**

> `npm ci` requiere `package-lock.json` y falla si no existe. Por eso nunca debe ir en `.gitignore`. Solo `node_modules/` va en gitignore.

**¿Podemos usar esto con otro framework como Vue o Angular?**

> Sí, el workflow es casi idéntico. Solo cambia el template al crear el proyecto y posiblemente el nombre del script de build. El concepto es el mismo.

**¿GitHub Pages es para producción real?**

> Para proyectos personales, portfolios, documentación y demos es perfecto. Para aplicaciones con backend, bases de datos o contenido privado necesitas algo diferente. Es 100% adecuado para frontend estático.

**¿Qué son los `@v4`, `@v3` en las actions?**

> Son versiones. Siempre fijar una versión mayor (ej: `@v4`) para que tu workflow no se rompa si la action lanza una versión incompatible. Algunos equipos fijan el hash del commit para máxima seguridad.

---

## Ideas para módulos adicionales (si hay tiempo o en una clase siguiente)

1. **Secrets y environments:** mostrar cómo pasar un API key de forma segura usando `Settings → Secrets`
2. **PR checks:** agregar un workflow de verificación en Pull Requests antes de mergear
3. **Azure Static Web Apps:** mostrar el mismo concepto pero con `azure/static-web-apps-deploy`
4. **Notifications:** enviar un mensaje a Slack o Discord cuando el deploy falla
5. **Matrix builds:** probar en Node 18, 20 y 22 en paralelo con `strategy.matrix`
