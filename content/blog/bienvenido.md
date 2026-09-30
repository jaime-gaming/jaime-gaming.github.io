---
title: "Bienvenido a mi blog"
date: "2026-09-30"
excerpt: "El primer post de mi nuevo blog, dentro de mi portfolio rediseñado."
lang: "es"
---

Este es el primer post de mi blog. Aquí voy a ir compartiendo lo que aprendo,
los proyectos en los que estoy trabajando y cualquier cosa que me parezca
interesante contar.

## ¿Cómo añado un post nuevo?

Solo tengo que crear un archivo `.md` dentro de `content/blog/`, con este
formato al principio (front matter):

```
---
title: "Título del post"
date: "YYYY-MM-DD"
excerpt: "Resumen corto para la lista de posts"
lang: "es"
---
```

Y debajo, el contenido en Markdown normal. Al hacer push a `main`, la página
se reconstruye sola y el post aparece en `/blog/`.
