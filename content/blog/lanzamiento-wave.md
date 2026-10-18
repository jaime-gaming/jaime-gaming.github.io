---
title: "Wave 0.1.0: un reproductor para tu propia música"
slug: lanzamiento-wave
date: "2026-10-18"
lang: es
excerpt: "He publicado la primera versión de Wave. Un reproductor de música local con biblioteca, playlists, mezclas diarias y letras, sin cuenta ni suscripción."
---

He publicado **Wave 0.1.0**, la primera versión de mi reproductor de música local. El lanzamiento está fechado el **17 de octubre de 2026** y ya se puede descargar el cliente web desde [la publicación de GitHub](https://github.com/jaime-gaming/Wave/releases/tag/v0.1.0).

Wave parte de una idea sencilla: añadir tus propios archivos de audio, organizar la colección y escucharla desde una misma interfaz. No hace falta crear una cuenta, pagar una suscripción ni subir la música a un servidor. No es un catálogo de streaming: la biblioteca comienza vacía y la construyes con los archivos que importas.

![Biblioteca de Wave en escritorio, con álbumes y mezclas diarias](/assets/img/wave-home.png)

*Captura del cliente web de la versión 0.1.0. Las carátulas y la biblioteca que aparecen son contenido de demostración del proyecto.*

## Qué incluye esta primera versión

La biblioteca permite navegar por **canciones, álbumes, artistas y favoritos**, además de buscar dentro de la colección. Puedes crear playlists, ordenar sus canciones y elegir una portada. Durante la reproducción hay una cola editable, un reproductor compacto y una vista ampliada de la canción con su carátula y sus letras.

Las **mezclas diarias** se construyen con las etiquetas de género y artista de tus archivos, no con un servicio remoto de recomendaciones. Puedes abrir una mezcla y revisar todas las canciones antes de reproducirla, escucharla en orden o de forma aleatoria y guardarla como una playlist independiente. Esa copia no cambia cuando se renueva la mezcla del día siguiente. El número de mezclas depende de lo que permita tu biblioteca; una colección pequeña puede mostrar menos opciones.

También hay temas claro y oscuro, colores a partir de las carátulas, opciones de texto ampliado y movimiento reducido. El cliente web adapta su navegación y sus controles al uso desde un teléfono.

## Letras: importadas o buscadas de forma explícita

Puedes añadir texto o archivos **LRC** con letras sincronizadas. También se pueden buscar coincidencias, revisarlas y decidir si se guardan, sin necesidad de iniciar la reproducción de la canción. Las letras guardadas quedan disponibles para escuchas posteriores sin conexión.

Conviene distinguir la biblioteca local de la búsqueda de letras. Las consultas opcionales utilizan **LRCLIB** y envían metadatos de la canción al proveedor, que también recibe información de conexión. La búsqueda automática está desactivada inicialmente y se activa desde Ajustes. Ni la disponibilidad del servicio ni la cobertura de todas las canciones están garantizadas.

## Dónde se guardan los archivos

El cliente web conserva la biblioteca en el almacenamiento del navegador, asociado a su perfil y a la dirección desde la que se abre Wave. No modifica ni elimina tus originales. Borrar una canción de Wave elimina su copia almacenada y sus referencias en las playlists, no el archivo original del dispositivo.

**Wave no es una copia de seguridad.** Borrar los datos del sitio, usar navegación privada o alcanzar los límites de almacenamiento puede hacer que se pierda la biblioteca guardada. Conserva siempre tus archivos originales. Abrir la aplicación desde otra dirección también puede dar acceso a una biblioteca distinta.

Una vez cargada la aplicación, la reproducción local y las letras ya guardadas no necesitan red. Eso no significa que esta versión tenga un inicio sin conexión garantizado: una PWA instalable y el arranque offline completo siguen pendientes.

## Cómo probar Wave

En [Wave 0.1.0](https://github.com/jaime-gaming/Wave/releases/tag/v0.1.0) encontrarás el archivo **Wave-0.1.0-web.zip**, el vídeo de presentación y un archivo de sumas SHA-256. El ZIP web debe descomprimirse y servirse mediante HTTP o HTTPS; no está pensado para abrir directamente su `index.html` como archivo local.

Si prefieres ejecutar el código, necesitas **Node.js 22.12 o posterior, o Node 24**:

```sh
git clone https://github.com/jaime-gaming/Wave.git
cd Wave
npm ci
npm run dev
```

Abre la dirección que indique la terminal y selecciona **Add music** para importar tus archivos. Wave admite, entre otros, MP3, FLAC, WAV, OGG, M4A y AAC, con un máximo de 200 MB por archivo. La reproducción de cada formato depende de los códecs del navegador o del sistema operativo.

## Estado de Windows y Android

El cliente **web es el más completo** de este lanzamiento. El proyecto incluye también aplicaciones nativas independientes: Windows utiliza C# y WPF; Android utiliza Compose. No son simples contenedores de la web.

Es importante no confundirlas con los archivos publicados de esta versión: los paquetes nativos de CI siguen siendo **compilaciones de prueba, sin firma o de depuración**, con diferencias de funciones respecto a la web. Android tiene un alcance más reducido y la integración de audio y dispositivos en Windows continúa en revisión. No se presentan como instaladores oficiales firmados.

## Código y próximos cambios

Wave está publicado con licencia **MIT**. El código, la documentación y las incidencias están en [el repositorio](https://github.com/jaime-gaming/Wave). Para consultar los límites y diferencias entre plataformas, están disponibles [las notas de 0.1.0](https://github.com/jaime-gaming/Wave/blob/v0.1.0/docs/RELEASE_NOTES_0.1.0.md) y [la guía de plataformas](https://github.com/jaime-gaming/Wave/blob/v0.1.0/docs/PLATFORMS.md).

Si pruebas esta versión y encuentras un problema, puedes abrir una incidencia indicando la plataforma, el navegador y los pasos para reproducirlo. También puedes escribirme desde [Contacto](/contact/). Las correcciones y nuevas versiones se podrán seguir en GitHub.
