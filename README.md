# jaime-gaming.github.io

Personal portfolio site, published via GitHub Pages at [jaime-gaming.github.io](https://jaime-gaming.github.io).

## Features

- Minimalist, dark-mode-only multi-page design (Home, Projects, Blog) with subtle scroll-reveal animations
- Bilingual UI (Spanish / English) with a language switcher (`assets/js/i18n.js`)
- **Projects** are fetched live from the GitHub API in the browser — every public, non-fork repo automatically gets its own page at `/projects/<repo-name>/`, with no rebuild needed when you push a new repo
- **Blog** posts are written as local Markdown files and turned into static pages by a small Node build script
- GitHub stats and the contribution activity are pulled live from the GitHub API on every page load
- A GitHub Action rebuilds and commits the blog/site pages automatically whenever `content/` changes

> **Note:** GitHub API requests are unauthenticated and cached client-side for 5 minutes (per visitor) to reduce calls, but they still share the public rate limit of 60 requests/hour per IP. On rare occasions (e.g. shared corporate/NAT networks) this could cause the "Projects" section to temporarily fall back to its error state; it will recover automatically once the limit resets.

## Structure

```
content/                    # Hand-authored source content
  home.fragment.html        # Home page sections (hero, about, skills, contact...)
  projects.fragment.html    # Full projects-listing page shell
  404.fragment.html         # 404 fallback + project-detail mount point
  blog/*.md                 # Blog posts (Markdown + front matter)
scripts/
  layout.mjs                # Shared header/nav/footer layout used by every page
  build.mjs                 # Build script: generates index.html, projects/index.html,
                             # 404.html and blog/** from the content above
index.html, projects/index.html, 404.html, blog/**   # Generated output (do not hand-edit)
assets/css/style.css        # Design system (colors, type, layout, animations)
assets/js/i18n.js           # ES/EN translation dictionary + switcher
assets/js/main.js           # Nav behavior, GitHub API integration, project rendering
assets/img/favicon.svg      # Site favicon
```

## How project pages work

`/projects/` and every `/projects/<repo-name>/` page are **not** pre-built. GitHub Pages serves `404.html` for any URL that doesn't exist as a real file, so `main.js` inspects the current URL on `404.html` and, if it matches `/projects/<repo-name>/`, fetches that repository's metadata and README live from the GitHub API and renders it in place. This means new public repositories appear automatically with no rebuild or redeploy.

Trade-off: because these pages are technically served as a 404, the HTTP status code stays 404 even though the content renders correctly — this is an accepted limitation of a backend-less GitHub Pages site.

## How to add a blog post

1. Create a new Markdown file in `content/blog/`, e.g. `content/blog/my-post.md`.
2. Add YAML front matter at the top:
   ```md
   ---
   title: "My post title"
   date: "2026-01-01"
   excerpt: "Short one-line summary shown in the blog list."
   lang: "es"
   ---

   Post content in Markdown goes here.
   ```
3. Commit and push to `main`. The `Build site` GitHub Action runs `npm run build` and commits the generated `blog/index.html` and `blog/<slug>/index.html` automatically.

## Local build & preview

```bash
npm install
npm run build          # regenerates index.html, projects/index.html, 404.html, blog/**
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Only files under `content/` and `scripts/` require a rebuild; everything in `assets/` is served as-is.
