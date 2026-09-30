#!/usr/bin/env node
/**
 * Static build script for the portfolio.
 *
 * Generates every page from the shared layout in scripts/layout.mjs so the
 * header/nav/footer stay perfectly in sync:
 *   - /index.html          from content/home.fragment.html
 *   - /projects/index.html from content/projects.fragment.html
 *   - /404.html            from content/404.fragment.html (also doubles as
 *                          the client-rendered "project detail" page via
 *                          GitHub Pages' 404 fallback, see assets/js/main.js)
 *   - /blog/index.html     generated from content/blog/*.md front matter
 *   - /blog/<slug>/index.html one per markdown post
 *
 * Project pages are intentionally NOT pre-rendered here: the projects list
 * and each project's detail page are fetched live from the GitHub REST API
 * in the browser (assets/js/main.js), so new repos show up automatically
 * with no rebuild required. Only the blog (hand-authored content) needs a
 * build step, which runs in CI on every push (see .github/workflows/build.yml).
 */
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";
import { renderLayout } from "./layout.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT = path.join(ROOT, "content");
const BLOG_SOURCE = path.join(CONTENT, "blog");

async function readFragment(name) {
  return readFile(path.join(CONTENT, name), "utf8");
}

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(iso, lang = "es") {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(lang === "en" ? "en-US" : "es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

async function writePage(relPath, html) {
  const outPath = path.join(ROOT, relPath);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, html, "utf8");
  console.log(`built ${relPath}`);
}

async function buildHome() {
  const bodyHtml = await readFragment("home.fragment.html");
  const html = renderLayout({
    title: "Jaime Gaming — Portfolio",
    description:
      "Jaime Gaming — vibe-coder, creador de juegos en HTML y aprendiz de Python. CEO de Pineapple.",
    bodyHtml,
    activePath: "/",
  });
  await writePage("index.html", html);
}

async function buildProjectsIndex() {
  const bodyHtml = await readFragment("projects.fragment.html");
  const html = renderLayout({
    title: "Proyectos",
    description: "Todos los repositorios públicos de Jaime Gaming, sincronizados en vivo desde GitHub.",
    bodyHtml,
    activePath: "/projects/",
  });
  await writePage("projects/index.html", html);
}

async function build404() {
  const bodyHtml = await readFragment("404.fragment.html");
  const html = renderLayout({
    title: "Proyecto",
    description: "Detalle de proyecto de Jaime Gaming.",
    bodyHtml,
    activePath: "/projects/",
  });
  await writePage("404.html", html);
}

async function loadPosts() {
  let files = [];
  try {
    files = await readdir(BLOG_SOURCE);
  } catch {
    return [];
  }
  const posts = [];
  for (const file of files) {
    if (!file.endsWith(".md")) continue;
    const raw = await readFile(path.join(BLOG_SOURCE, file), "utf8");
    const { data, content } = matter(raw);
    if (!data.title || !data.date) {
      console.warn(`skipping ${file}: missing required "title" or "date" front matter`);
      continue;
    }
    posts.push({
      slug: data.slug ? slugify(data.slug) : slugify(file.replace(/\.md$/, "")),
      title: data.title,
      date: data.date,
      excerpt: data.excerpt || "",
      lang: data.lang || "es",
      html: marked.parse(content),
    });
  }
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

async function buildBlog() {
  const posts = await loadPosts();

  const listItems = posts.length
    ? posts
        .map(
          (p) => `      <a class="blog-item reveal" href="/blog/${p.slug}/">
        <p class="blog-item__date">${formatDate(p.date, p.lang)}</p>
        <h3 class="blog-item__title">${p.title}</h3>
        <p class="blog-item__excerpt">${p.excerpt}</p>
      </a>`
        )
        .join("\n")
    : `      <p class="blog__empty reveal" data-i18n="blog.empty">Todavía no hay posts. ¡Vuelve pronto!</p>`;

  const indexBody = `  <section class="section">
    <div class="section__head reveal">
      <span class="section__num">/blog</span>
      <h2 class="section__title" data-i18n="blog.title">Blog</h2>
      <p class="section__sub" data-i18n="blog.sub">Notas y novedades sobre lo que estoy construyendo.</p>
    </div>
    <div class="blog__list">
${listItems}
    </div>
  </section>
`;

  await writePage(
    "blog/index.html",
    renderLayout({
      title: "Blog",
      description: "Notas y novedades de Jaime Gaming.",
      bodyHtml: indexBody,
      activePath: "/blog/",
    })
  );

  for (const post of posts) {
    const postBody = `  <section class="section">
    <a href="/blog/" class="back-link reveal">← <span data-i18n="blog.back">Volver al blog</span></a>
    <div class="post-detail__head reveal">
      <p class="post-detail__date">${formatDate(post.date, post.lang)}</p>
      <h1 class="post-detail__title">${post.title}</h1>
    </div>
    <div class="post-detail__body reveal">
${post.html}
    </div>
  </section>
`;
    await writePage(
      `blog/${post.slug}/index.html`,
      renderLayout({
        title: post.title,
        description: post.excerpt || post.title,
        bodyHtml: postBody,
        activePath: `/blog/${post.slug}/`,
      })
    );
  }
}

async function main() {
  await buildHome();
  await buildProjectsIndex();
  await build404();
  await buildBlog();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
