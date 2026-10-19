# Jaime Gaming

Sitio personal de Jaime Gaming, publicado en [jaime-gaming.github.io](https://jaime-gaming.github.io).

## Qué incluye

- Diseño oscuro adaptable a móvil, con perfil en directo, tarjetas visuales y animaciones; respeta la preferencia de movimiento reducido.
- Interfaz en español e inglés.
- Lista de repositorios públicos de la cuenta `jaime-gaming` incluidos los forks. No se muestran repositorios de organizaciones. Los datos se actualizan cada diez minutos.
- Página de detalle por repositorio, con enlaces al proyecto y lectura de su README cuando está disponible. El repositorio `Docs` se excluye de la lista y de sus estadísticas.
- Enlace **Docs** en la navegación y el pie que lleva directamente a la documentación externa (`/Docs`), sin página intermedia.
- Página `/status/` que muestra el estado en directo del panel de incident.io dentro del sitio, con acceso al panel completo.
- Páginas `/terms/` y `/privacy/` con los términos del servicio y la política de privacidad, en español e inglés.
- Calendario de contribuciones diario, navegable con teclado y seleccionable con toque.
- Estado y actividad de Discord mediante Lanyard.
- Pie de página común con navegación, redes sociales, enlace a la documentación (`/Docs`), acceso a la página de estado y avisos legales.
- Interfaz oscura con degradados suaves, rejilla de fondo en el inicio y revelado progresivo al hacer scroll. Al cambiar de idioma, el texto visible se vuelve a escribir carácter a carácter de arriba abajo, como una máquina de escribir, y la animación se omite con movimiento reducido.
- Blog generado desde Markdown. El build también elimina las páginas de posts que ya no tienen fuente.

## Estructura

```
content/                    # Fuentes editables
  home.fragment.html        # Secciones de inicio
  projects.fragment.html    # Listado de proyectos
  status.fragment.html      # Página /status/ con el resumen del panel
  terms.*.html, privacy.*.html # Términos y privacidad en ES/EN
  contact.fragment.html     # Contacto compartido entre inicio y /contact/
  404.fragment.html         # Página de error y detalle de proyectos
  blog/*.md                 # Posts en Markdown
scripts/
  layout.mjs                # Plantilla HTML compartida
  build.mjs                 # Genera páginas estáticas y limpia posts obsoletos
assets/css/style.css        # Estilos
assets/js/i18n.js           # Textos ES/EN
assets/js/main.js           # Sincronización, calendario y presencia
index.html, projects/, blog/, status/, terms/, privacy/, contact/ # Páginas generadas; no editar a mano
```

## Proyectos

La lista consulta únicamente la API pública de GitHub para el usuario `jaime-gaming`. Cada repositorio enlaza a `/projects/<propietario>/<repositorio>/`. GitHub Pages sirve `404.html` para esa ruta y `main.js` carga los datos y el README en el navegador, por lo que las páginas no necesitan generarse una a una.

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

## Documentación, estado y avisos legales

La navegación y el pie enlazan **directamente** a `https://jaime-gaming.github.io/Docs`; la antigua ruta `/docs/` se conserva como redirección `noindex` con `meta refresh`, JavaScript y un enlace manual, y queda fuera del sitemap.

La página `/status/` consulta el resumen público de `statuspage.incident.io/jaime-gaming` y lo presenta dentro del sitio: estado general, componentes y mantenimientos programados, con la fecha de actualización. Si la consulta falla, se indica que el estado no está disponible y se mantiene el botón al panel completo. El panel de incident.io está detrás de un botón de carga: no se solicita nada a ese proveedor hasta que la persona lo pide, y así la página no carga cookies de terceros por defecto. Si la incrustación falla, el resumen y el enlace externo siguen funcionando. El pie enlaza a `/status/` y no al dominio externo.

`/terms/` y `/privacy/` se generan desde `content/terms.{es,en}.html` y `content/privacy.{es,en}.html`. Son documentos extensos, narrados y con la misma estructura en ambos idiomas: **no describen categorías de proyecto ni nombran ninguno**, sino las reglas que se aplican a todos por igual (uso, contenido propio, datos en el dispositivo, programas locales, funciones conectadas, licencias, responsabilidad), más el tratamiento de datos real del sitio. La prueba `legal texts are narrated in full…` falla si aparece cualquier nombre de proyecto o cualquier palabra que revele su temática, de modo que una futura familia de proyectos tampoco pueda colarse por esa vía. Cada documento se sirve como una sola columna de lectura, sin índice interno ni tiempo de lectura; al cambiar de idioma se sustituye completo, sin la animación de escritura, para no reescribir miles de palabras. La versión española se sirve en el HTML y la inglesa se aplica con el selector de idioma usando el mismo sistema de traducciones que el blog. El pie incluye ambos enlaces en la zona legal.

El código no carga analítica ni cookies propias y las tipografías son locales. El panel de estado de terceros solo se carga tras una acción explícita. Si en el futuro se añade publicidad, analítica, pagos o cuentas, habrá que revisar estos textos y añadir la información de identificación que corresponda.

El repositorio `Docs` se excluye de la lista de proyectos, de las estadísticas de GitHub, de las frases del inicio y del detalle `/projects/jaime-gaming/docs/`.

## Build y preview local

```bash
npm install
npm run build
python3 scripts/preview_server.py
```

El servidor local enlaza `0.0.0.0:8000` y sirve `404.html` como fallback para las rutas dinámicas `/projects/<propietario>/<repositorio>/`, igual que GitHub Pages. El build regenera `index.html`, `projects/index.html`, `404.html` y las páginas del blog; los cambios en `assets/` se sirven directamente.

## Datos del perfil y comprobaciones

La presentación sigue el README público de `jaime-gaming/jaime-gaming`: HTML, aprendizaje de JavaScript, TypeScript y Python, juegos compartidos con compañeros y fundador de Pineapple. No se asignan porcentajes de dominio.

La biografía, ubicación, repositorios públicos y seguidores se consultan en la API REST de GitHub junto con los proyectos. No se consultan ni se muestran eventos de actividad pública.

Si la API falla y no hay caché del navegador, se usa `assets/data/github.json`, una captura real con su fecha de consulta. La interfaz la identifica como datos guardados, no como datos en directo. Este archivo no contiene credenciales. El calendario depende de un servicio externo y Discord depende de Lanyard; un error de conexión no se presenta como estado desconectado del usuario.

```sh
npm ci
npm run build
npm test
python3 scripts/preview_server.py
```

Las pruebas comprueban el perfil, los repositorios, el cambio de idioma y la recuperación con datos guardados cuando la API no responde.

## Buscadores

La portada incluye título y descripción específicos de Jaime Gaming, URL canónica, metadatos Open Graph/Twitter y datos estructurados `Person` con los enlaces confirmados de GitHub, YouTube y X. `robots.txt` permite el rastreo y enlaza `sitemap.xml`, que se regenera con las páginas y entradas del blog.

Después de publicar, se puede verificar `https://jaime-gaming.github.io/` en Google Search Console, enviar el sitemap y solicitar la indexación de la portada. La verificación requiere acceso del propietario; no se ha realizado desde este entorno. La indexación y la posición para «Jaime Gaming» dependen de Google, no son inmediatas ni se pueden garantizar.

Los README se obtienen del endpoint oficial `/readme` de GitHub (no se presupone nombre, mayúsculas o extensión), se procesan con Marked y se sanean con DOMPurify. Las bibliotecas se copian al directorio `assets/vendor/` durante el build; sus licencias se conservan allí. El renderizador soporta tablas, código, HTML seguro, listas e imágenes con rutas relativas.

## Inicio y contacto

La cabecera alterna frases preparadas mientras se consulta GitHub. Cuando llegan los datos, usa los tres repositorios personales más recientes, excluyendo forks, repos archivados o deshabilitados. El enlace de cada frase apunta al proyecto correspondiente. «Repos recientes» describe la fuente; no significa que Jaime esté programando en ese momento. El texto deja de escribirse carácter a carácter con movimiento reducido y pausa el efecto cuando la pestaña está oculta.

`content/contact.fragment.html` se reutiliza en la portada y en `/contact/`. Correo y redes tienen enlaces reales incluso sin JavaScript. El botón de copiar sólo aparece con JavaScript y comunica si la copia falla. Los accesos por tema preparan el asunto de un correo; no envían mensajes ni guardan datos.

Referencias de esta revisión: [janiito.com](https://janiito.com/en) por su presentación directa y los proyectos en primer plano, y [mateag.com](https://mateag.com/home/) por el tono personal y la cabecera dinámica. Se conserva la paleta y la estructura propia; no se han copiado sus textos ni recursos.

Además de `npm test`, se revisaron la portada y el contacto en Chromium a 1440 y 390 píxeles, sin desbordamientos horizontales ni errores de JavaScript. La comprobación de navegador utilizó respuestas controladas de GitHub; no verifica la disponibilidad de los servicios externos. El workflow `checks.yml` ejecuta build y pruebas en las ramas de trabajo y las pull requests.

## Estilos y vista previa

Las tipografías se sirven desde `assets/fonts/` con `@font-face` y `font-display: swap`; el build las copia de los paquetes `@fontsource` y conserva sus licencias en `assets/vendor/`. La web no realiza peticiones a Google Fonts ni a otros proveedores de tipografías.

El CSS utiliza una sola definición base por componente: tipografía, anchos, botones, tarjetas, contacto, README, cargas y errores. Se han eliminado las capas de rediseños anteriores, las animaciones permanentes de la tarjeta, la cronología repetida y las estadísticas secundarias duplicadas. Las entradas animadas no esconden contenido.

El build añade a CSS y JavaScript una versión calculada con SHA-256. La vista previa sirve `Cache-Control: no-store`, mantiene las rutas de detalle de proyectos y muestra el 404 del sitio para páginas inexistentes. No sustituye archivos estáticos inexistentes por HTML con estado 200.

La revisión de esta corrección cubrió seis rutas a 320, 390, 768 y 1440 píxeles en Chromium, con respuestas de API controladas, además de movimiento reducido y fallos de conexión. `npm test` comprueba también las versiones de los archivos, la sintaxis del CSS y las respuestas HTTP del servidor de vista previa.

## Iconos, contribuciones y Wave

Los iconos se sirven en un sprite SVG local: las marcas proceden de Simple Icons y los controles de Lucide, sin reinterpretar sus trazados. `scripts/icons.mjs` genera el sprite, valida los nombres usados en las plantillas y mantiene los iconos decorativos fuera del árbol accesible. Las dependencias quedan fijadas por `package-lock.json`; sus licencias y el aviso de marcas se copian a `assets/vendor/`. El loader JG utiliza un punto y una línea de actividad indeterminada, no un porcentaje ficticio, y respeta movimiento reducido.

El inicio combina tres repos recientes con diez frases preparadas, barajadas para las animaciones. Con movimiento reducido conserva una frase estable. Cada frase distingue si enlaza a un repositorio o si es una idea general.

Al seleccionar un día, se consultan commits por autor y fecha UTC e issues/pull requests creados ese día en repositorios personales. GitHub puede limitar estas búsquedas. Se muestran resultados parciales como tales, se cancelan consultas anteriores y los resultados se conservan cinco minutos. El detalle no pretende reconstruir actividad privada, revisiones ni todas las acciones que contabiliza el calendario.

`assets/data/contributions.json` es un respaldo fechado obtenido de la API GraphQL oficial de GitHub: contiene el calendario y resúmenes públicos por día de los repositorios personales. Si falla el servicio del calendario, se utiliza esta captura indicando la fecha. Si falla la búsqueda del detalle, se muestran los resúmenes guardados disponibles, nunca como consultas en directo. No se guardan credenciales ni repositorios privados. Para actualizarlo con GitHub CLI autenticado:

```sh
npm run sync:contributions
npm run build
npm test
```

La entrada `content/blog/lanzamiento-wave.md` se documentó con el README y las notas del tag `v0.1.0` de `jaime-gaming/Wave`, además de los archivos adjuntos de la release. La fecha de lanzamiento anunciada es el 17 de octubre de 2026; la entrada está fechada el 18. La captura procede de `docs/media/home-desktop.png` en ese tag. El artículo distingue el ZIP web publicado de las compilaciones nativas de prueba y explica los límites de almacenamiento local, letras externas y arranque sin conexión.


## Traducciones e iconos publicados

El selector utiliza el globo de Lucide sobre los colores de las banderas española y británica. Cada pulsación alterna español e inglés; el idioma se conserva al navegar y recargar, y el nombre accesible indica el idioma actual y el siguiente. No depende de un servicio de traducción externo.

Los textos de la interfaz, etiquetas accesibles, fechas y metadatos están en `assets/js/i18n.js`. El blog requiere una versión completa en cada idioma: `content/blog/lanzamiento-wave.md` y `content/blog/lanzamiento-wave.en.md` comparten `slug` y fecha. El build agrupa ambas versiones en una sola entrada y URL, y falla si falta una traducción o hay duplicados. El HTML inicial es español; JavaScript aplica el idioma guardado, incluidos artículo, título, descripción, texto alternativo y fecha. No se generan URLs inglesas independientes ni se promete su indexación por separado.

El contenido bilingüe se incorpora como JSON escapado dentro de cada página; no se solicita ni genera traducción al cambiar de idioma.

El cambio de idioma vuelve a escribir la interfaz: `i18n.js` guarda los nodos de texto de cada bloque `[data-i18n]`, los vacía y los revela por caracteres con un pequeño desfase entre bloques, reservando la altura de cada bloque y marcándolo `aria-busy` mientras dura. Quedan fuera el rol escrito del hero (tiene su propio bucle), los documentos largos con `data-content-language`, las regiones `aria-live` y los indicadores de carga. Con `prefers-reduced-motion: reduce` el texto cambia de inmediato y no se reserva altura.

Las descripciones actuales de los proyectos y la biografía pública tienen equivalentes revisados. Si GitHub devuelve una descripción nueva no catalogada, se conserva el original para no sustituir datos recientes por una traducción obsoleta. Los README completos y los títulos de commits/issues se mantienen como documentos originales de GitHub; una nota traducida lo indica y las etiquetas accesibles del renderizador sí cambian de idioma.

Fuentes de los iconos de marca, distribuidos por [Simple Icons](https://github.com/simple-icons/simple-icons):

- GitHub: <https://github.com/logos>
- Discord: <https://discord.com/branding>
- YouTube: <https://www.youtube.com/howyoutubeworks/resources/brand-resources/#logos-icons-and-colors>
- X: <https://x.com>
- Interfaz y globo: [Lucide](https://github.com/lucide-icons/lucide), licencia ISC.

Las pruebas comprueban los trazados contra las bibliotecas, las traducciones completas del blog, la persistencia del selector, los metadatos, las etiquetas del README y el escape del JSON. La revisión en Chromium cubre español/inglés y teclado a 1280, 390 y 320 píxeles, con respuestas externas controladas o bloqueadas; no certifica la disponibilidad de servicios externos.
