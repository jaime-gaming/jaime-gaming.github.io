# Jaime Gaming

Sitio personal de Jaime Gaming, publicado en [jaime-gaming.github.io](https://jaime-gaming.github.io).

## Qué incluye

- Diseño oscuro adaptable a móvil, con perfil en directo, tarjetas visuales y animaciones; respeta la preferencia de movimiento reducido.
- Interfaz en español e inglés.
- Lista de repositorios públicos de la cuenta `jaime-gaming` y de la organización `PineappleVA`, incluidos los forks. Los datos se actualizan cada diez minutos.
- Página de detalle por repositorio, con enlaces al proyecto y lectura de su README cuando está disponible.
- Calendario de contribuciones diario, navegable con teclado y seleccionable con toque.
- Estado y actividad de Discord mediante Lanyard.
- Blog generado desde Markdown. El build también elimina las páginas de posts que ya no tienen fuente.

## Estructura

```
content/                    # Fuentes editables
  home.fragment.html        # Secciones de inicio
  projects.fragment.html    # Listado de proyectos
  404.fragment.html         # Página de error y detalle de proyectos
  blog/*.md                 # Posts en Markdown
scripts/
  layout.mjs                # Plantilla HTML compartida
  build.mjs                 # Genera páginas estáticas y limpia posts obsoletos
assets/css/style.css        # Estilos
assets/js/i18n.js           # Textos ES/EN
assets/js/main.js           # Sincronización, calendario y presencia
index.html, projects/, blog/ # Páginas generadas; no editar a mano
```

## Proyectos

La lista combina las API públicas de GitHub para el usuario `jaime-gaming` y la organización `PineappleVA`. Cada repositorio enlaza a `/projects/<propietario>/<repositorio>/`. GitHub Pages sirve `404.html` para esa ruta y `main.js` carga los datos y el README en el navegador, por lo que las páginas no necesitan generarse una a una.

Las consultas a GitHub son anónimas y comparten el límite público de solicitudes por IP. El sitio conserva una copia local reciente para mostrarla si la API no responde. El calendario usa la API pública `github-contributions-api` de Jogruber; sus respuestas se guardan en la caché del navegador.

## Añadir un post

Crea un archivo Markdown en `content/blog/` con título y fecha en el front matter:

```md
---
title: "Título del post"
date: "2026-10-04"
excerpt: "Resumen breve"
lang: "es"
---

Texto del post.
```

Después ejecuta el build. Al eliminar una fuente, el build quita también la página generada correspondiente.

## Build y preview local

```bash
npm install
npm run build
python3 scripts/preview_server.py
```

El servidor local enlaza `0.0.0.0:8000` y sirve `404.html` como fallback para las rutas dinámicas `/projects/<propietario>/<repositorio>/`, igual que GitHub Pages. El build regenera `index.html`, `projects/index.html`, `404.html` y las páginas del blog; los cambios en `assets/` se sirven directamente.
