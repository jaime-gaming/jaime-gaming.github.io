# jaime-gaming.github.io

Personal portfolio site, published via GitHub Pages at [jaime-gaming.github.io](https://jaime-gaming.github.io).

## Features

- Minimalist, animated single-page design (scroll reveals, glow cursor, smooth scrolling)
- Bilingual UI (Spanish / English) with a language switcher (`assets/js/i18n.js`)
- Projects, stats and the GitHub contribution chart are fetched live from the GitHub API on every page load, so the site reflects new repositories/commits automatically without a rebuild
- Fully static (HTML/CSS/vanilla JS) — no build step required for GitHub Pages

## Structure

```
index.html            # Markup for all sections
assets/css/style.css   # Styling, theme tokens, animations
assets/js/i18n.js      # ES/EN translation dictionary + switcher
assets/js/main.js      # Scroll reveals, GitHub API integration, nav behavior
assets/img/favicon.svg # Site favicon
```

## Local preview

Serve the folder with any static file server, e.g.:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
