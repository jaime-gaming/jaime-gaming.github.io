#!/usr/bin/env node

import { readFile, writeFile, mkdir, readdir, rm, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";
import { renderLayout } from "./layout.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT = path.join(ROOT, "content");
const BLOG_SOURCE = path.join(CONTENT, "blog");
const BLOG_OUTPUT = path.join(ROOT, "blog");

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
  const bodyHtml = (await readFragment("home.fragment.html")).replace("{{CONTACT}}", await readFragment("contact.fragment.html"));
  const html = renderLayout({
    title: "Inicio",
    description: "Jaime Gaming, youtuber y programador. Juegos para navegador, vídeos y proyectos web. Aprendiendo JavaScript, TypeScript y Python.",
    bodyHtml,
    activePath: "/",
  });
  await writePage("index.html", html);
}

async function buildProjectsIndex() {
  const bodyHtml = await readFragment("projects.fragment.html");
  const html = renderLayout({
    title: "Proyectos",
    description: "Juegos, pruebas y repositorios públicos de Jaime Gaming, sincronizados desde GitHub.",
    bodyHtml,
    activePath: "/projects/",
  });
  await writePage("projects/index.html", html);
}

async function buildContact() {
  const fragment = await readFragment("contact.fragment.html");
  const bodyHtml = `<div class="contact-page">${fragment.replace('<h2 class="section__title"', '<h1 class="section__title"').replace('>¿Hablamos?</h2>', '>¿Hablamos?</h1>')}</div>`;
  await writePage("contact/index.html", renderLayout({ title: "Contacto", description: "Habla con Jaime Gaming por correo, Discord, YouTube, X o GitHub. Enlaces oficiales y contacto directo.", bodyHtml, activePath: "/contact/" }));
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
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}

async function cleanOrphanedPostPages(posts) {
  const activeSlugs = new Set(posts.map((post) => post.slug));
  let entries = [];
  try {
    entries = await readdir(BLOG_OUTPUT, { withFileTypes: true });
  } catch {
    return;
  }

  await Promise.all(entries
    .filter((entry) => entry.isDirectory() && !activeSlugs.has(entry.name))
    .map(async (entry) => {
      await rm(path.join(BLOG_OUTPUT, entry.name), { recursive: true, force: true });
      console.log(`removed orphaned blog page blog/${entry.name}/`);
    }));
}

async function buildBlog() {
  const posts = await loadPosts();
  await cleanOrphanedPostPages(posts);

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
    : `      <p class="blog__empty reveal" data-i18n="blog.empty">Todavía no hay publicaciones.</p>`;

  const indexBody = `  <section class="section">
    <div class="section__head reveal">
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
  await mkdir(path.join(ROOT, "assets/vendor"), { recursive: true });
  await copyFile(path.join(ROOT, "node_modules/marked/marked.min.js"), path.join(ROOT, "assets/vendor/marked.min.js"));
  await copyFile(path.join(ROOT, "node_modules/dompurify/dist/purify.min.js"), path.join(ROOT, "assets/vendor/purify.min.js"));
  await copyFile(path.join(ROOT, "node_modules/marked/LICENSE.md"), path.join(ROOT, "assets/vendor/marked.LICENSE.txt"));
  await copyFile(path.join(ROOT, "node_modules/dompurify/LICENSE"), path.join(ROOT, "assets/vendor/dompurify.LICENSE.txt"));
  for (const name of ["marked.min.js", "purify.min.js"]) {
    const file = path.join(ROOT, "assets/vendor", name);
    const source = await readFile(file, "utf8");
    await writeFile(file, source.replace(/^\/\*[\s\S]*?\*\/\s*/, "").replace(/\n\/\/# sourceMappingURL=.*$/m, ""));
  }
  await buildHome();
  await buildProjectsIndex();
  await build404();
  await buildContact();
  await buildBlog();
  const posts = await loadPosts();
  const urls = ["/", "/projects/", "/blog/", "/contact/", ...posts.map((post) => `/blog/${post.slug}/`)];
  await writePage("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>https://jaime-gaming.github.io${url}</loc></url>`).join("")}</urlset>\n`);
  await writePage("robots.txt", "User-agent: *\nAllow: /\n\nSitemap: https://jaime-gaming.github.io/sitemap.xml\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
