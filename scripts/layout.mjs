import { expandIcons, renderIcon } from "./icons.mjs";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

function assetUrl(path) {
  const content = readFileSync(new URL(`..${path}`, import.meta.url));
  const version = createHash("sha256").update(content).digest("hex").slice(0, 12);
  return `${path}?v=${version}`;
}

const SITE_NAME = "Jaime Gaming";
const SITE_URL = "https://jaime-gaming.github.io";

const NAV_ITEMS = [
  { href: "/", key: "nav.home", label: "Inicio" },
  { href: "/projects/", key: "nav.projects", label: "Proyectos" },
  { href: "/blog/", key: "nav.blog", label: "Blog" },
  { href: "/contact/", key: "nav.contact", label: "Contacto" },
];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isActiveNavItem(item, activePath) {
  if (item.href === "/") return activePath === "/";
  if (item.href === "/#contact") return false;
  return activePath === item.href || activePath.startsWith(item.href);
}

export function renderLayout({
  title,
  description,
  bodyHtml,
  activePath = "/",
  extraHead = "",
  translations = {},
}) {
  const fullTitle = activePath === "/" ? "Jaime Gaming — juegos, programación y YouTube" : title ? `${escapeHtml(title)} — ${SITE_NAME}` : SITE_NAME;
  const safeDescription = escapeHtml(description || "");
  const nav = NAV_ITEMS.map((item) => {
    const active = isActiveNavItem(item, activePath) ? " active" : "";
    return `<a href="${item.href}" data-i18n="${item.key}" class="${active.trim()}">${item.label}</a>`;
  }).join("\n    ");
  const mobileNav = NAV_ITEMS.map(
    (item) => `<a href="${item.href}" data-i18n="${item.key}">${item.label}</a>`
  ).join("\n  ");

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${fullTitle}</title>
<meta name="description" content="${safeDescription}" />
<meta name="author" content="Jaime Gaming" />
<meta name="theme-color" content="#10120f" />
<meta name="robots" content="${title === "Proyecto" ? "noindex, follow" : "index, follow"}" />
<meta property="og:type" content="${translations.es?.fields?.["post.body"] ? "article" : "website"}" />
<meta property="og:locale" content="es_ES" />
<meta property="og:site_name" content="Jaime Gaming" />
<meta property="og:title" content="${fullTitle}" />
<meta property="og:description" content="${safeDescription}" />
<meta property="og:url" content="${SITE_URL}${activePath}" />
<meta property="og:image" content="${SITE_URL}/assets/img/social-card.png" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:site" content="@JaimeGamingPro" />
<meta name="twitter:title" content="${fullTitle}" />
<meta name="twitter:description" content="${safeDescription}" />
${activePath === "/" ? `<script type="application/ld+json" id="personStructuredData">${JSON.stringify({ "@context": "https://schema.org", "@type": "Person", "@id": SITE_URL + "/#jaime-gaming", name: "Jaime Gaming", alternateName: ["jaime-gaming", "JaimeGamingPro"], url: SITE_URL + "/", description: "Youtuber y programador. Juegos para navegador y proyectos web.", sameAs: ["https://github.com/jaime-gaming", "https://www.youtube.com/@jaimegaming5731", "https://x.com/JaimeGamingPro"] })}</script>` : ""}

<link rel="canonical" href="${SITE_URL}${activePath}" />
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="${assetUrl("/assets/css/style.css")}" />
${extraHead}</head>
<body data-icons="${assetUrl("/assets/img/icons.svg")}" data-page="${title === "Proyecto" ? "project" : activePath === "/" ? "home" : activePath.split("/")[1]}">

<a class="skip-link" href="#top" data-i18n="aria.skipToContent">Saltar al contenido</a>
<div class="progress-bar" id="progressBar" aria-hidden="true"></div>

<header class="nav">
  <a href="/" class="nav__logo" aria-label="Jaime Gaming — inicio" data-i18n-aria="aria.homeLogo">JG<span class="dot">.</span></a>
  <nav class="nav__links" aria-label="Navegación principal" data-i18n-aria="aria.mainNav">
    ${nav}
  </nav>
  <div class="nav__actions">
    <button class="lang-switch" id="langSwitch" data-active="es" type="button" aria-label="Cambiar idioma" data-i18n-aria="aria.langSwitch">
      <svg class="language-globe" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <defs>
          <pattern id="languageFlag" width="24" height="24" patternUnits="userSpaceOnUse">
            <g class="flag-es"><path fill="#aa151b" d="M0 0h24v24H0z"/><path fill="#f1bf00" d="M0 6h24v12H0z"/></g>
            <g class="flag-en"><path fill="#012169" d="M0 0h24v24H0z"/><path stroke="#fff" stroke-width="5" d="m0 0 24 24M24 0 0 24"/><path stroke="#c8102e" stroke-width="2" d="m0 0 24 24M24 0 0 24"/><path stroke="#fff" stroke-width="8" d="M12 0v24M0 12h24"/><path stroke="#c8102e" stroke-width="4" d="M12 0v24M0 12h24"/></g>
          </pattern>
        </defs>
        <circle cx="12" cy="12" r="9.5" fill="url(#languageFlag)"/>
        <use href="${assetUrl("/assets/img/icons.svg")}#icon-globe" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width=".9" stroke-linecap="round"/>
      </svg>
      <span class="sr-only" id="languageName">Español</span>
    </button>
    <button class="burger" id="burger" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobileMenu" data-i18n-aria="nav.openMenu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<nav class="mobile-menu" id="mobileMenu" aria-label="Navegación móvil" data-i18n-aria="aria.mainNav">
  ${mobileNav}
</nav>

<main id="top">
${expandIcons(bodyHtml)}
</main>

<footer class="footer">
  <p>© <span id="year"></span> Jaime Gaming.</p>
  <button class="to-top" id="toTop" type="button" aria-label="Volver arriba" data-i18n-aria="aria.backToTop">${renderIcon("arrow")}</button>
</footer>

<script type="application/json" id="pageTranslations">${JSON.stringify(translations).replace(/</g, "\\u003c")}</script>
<script src="${assetUrl("/assets/js/i18n.js")}"></script>
<script src="${assetUrl("/assets/vendor/marked.min.js")}"></script>
<script src="${assetUrl("/assets/vendor/purify.min.js")}"></script>
<script src="${assetUrl("/assets/js/readme.js")}"></script>
<script src="${assetUrl("/assets/js/main.js")}"></script>
</body>
</html>
`;
}
