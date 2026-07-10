# SaludPlus

Sistema de agendamiento de citas médicas: registro de pacientes, reserva/seguimiento de citas, ingreso y pago en recepción, atención médica con historial clínico y recetas, y configuración de agendas/especialidades con reportes administrativos.

Es una aplicación **solo de interfaz (UI)**: Vue 3 (Composition API + `<script setup>`) con Pinia para el estado, persistido en `localStorage`. No hay backend ni base de datos real — todo lo que se guarda vive en el navegador.

Ver [CLAUDE.md](./CLAUDE.md) para el detalle de requisitos funcionales (RF01–RF10) y roles de usuario.

## Requisitos

- Node.js 18+
- npm

## Ejecutar en local

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:9090`.

Otros comandos útiles:

```bash
npm run build     # build de producción a ./dist
npm run preview   # sirve el build de ./dist localmente
```

## Tests end-to-end (Cypress)

Los tests viven en `tests/cypress/e2e/` y cubren los flujos principales (login, registro, nueva cita).

```bash
npm run cypress:open   # abre el runner interactivo de Cypress
npm run cypress:run    # corre los tests en modo headless
npm run test:e2e       # levanta el dev server, espera a que esté listo y corre los tests
```

`test:e2e` es la forma recomendada de correr los tests de punta a punta, ya que se encarga de levantar `npm run dev` y esperar a que `http://localhost:9090` responda antes de ejecutar Cypress.

## Tests end-to-end (Selenium)

Los tests viven en `tests/selenium/` y usan `selenium-webdriver` con Mocha, cubriendo los mismos flujos principales (registro, login, nueva cita) desde un navegador real.

```bash
npm run selenium:run    # corre los tests contra un dev server ya levantado
npm run test:selenium   # levanta el dev server, espera a que esté listo y corre los tests
```

`test:selenium` es la forma recomendada de correrlos, ya que se encarga de levantar `npm run dev` y esperar a que `http://localhost:9090` responda antes de ejecutar los tests.

### Versión .side (Selenium IDE)

`tests/selenium_side/cliente/` tiene los mismos flujos en formato `.side`, el proyecto nativo de la extensión Selenium IDE (Chrome/Firefox) — se abren ahí con **File → Open project** para grabar/inspeccionar/reproducir visualmente.

Para correrlos por CLI se usa un runner propio (`tests/selenium_side/run-side.mjs`) en vez del oficial `selenium-side-runner`, porque esa CLI (v4 alpha) no logra descubrir su propio test interno por un bug de Jest con node_modules:

```bash
npm run selenium:side        # corre los .side contra un dev server ya levantado
npm run test:selenium-side   # levanta el dev server y corre los .side
```

Nota: reproducir estos `.side` directamente desde la extensión en Chrome falla en los pasos de tecleo (`type`/`sendKeys`) con `initKeyEvent is not a function` — es un bug conocido de la extensión (usa una API exclusiva de Firefox) y no depende del contenido del `.side`. El runner de este repo no tiene ese problema porque teclea vía WebDriver real.

## Despliegue (Netlify)

El proyecto incluye [netlify.toml](./netlify.toml) con la configuración de build:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

Además redirige todas las rutas a `index.html` para que funcione el enrutamiento de Vue Router (SPA).

Pasos para desplegar:

1. Conectar el repositorio en Netlify (o usar la Netlify CLI: `netlify init`).
2. Netlify detecta `netlify.toml` y usa `npm run build` como comando y `dist` como carpeta de publicación.
3. Cada push a la rama configurada dispara un build y deploy automático.

Para desplegar manualmente desde local con la Netlify CLI:

```bash
npm run build
netlify deploy --prod
```
