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
const DOCS_URL = "https://jaime-gaming.github.io/Docs";
const STATUS_PAGE_URL = "https://statuspage.incident.io/jaime-gaming";

const NAV_ITEMS = [
  { href: "/", key: "nav.home", label: "Inicio" },
  { href: "/projects/", key: "nav.projects", label: "Proyectos" },
  { href: "/blog/", key: "nav.blog", label: "Blog" },
  { href: DOCS_URL, key: "nav.docs", label: "Docs" },
  { href: "/contact/", key: "nav.contact", label: "Contacto" },
];

const FOOTER_LINKS = {
  site: [
    { href: "/", key: "nav.home", label: "Inicio" },
    { href: "/projects/", key: "nav.projects", label: "Proyectos" },
    { href: "/blog/", key: "nav.blog", label: "Blog" },
    { href: "/contact/", key: "nav.contact", label: "Contacto" },
  ],
  resources: [
    { href: DOCS_URL, key: "nav.docs", label: "Docs" },
    { href: "/status/", key: "footer.status", label: "Estado del servicio", status: true },
    { href: "https://github.com/jaime-gaming", label: "GitHub", external: true, arrow: true },
    { href: "mailto:jaimegamingpro@gmail.com", key: "footer.email", label: "Correo" },
  ],
};

const LEGAL_LINKS = [
  { href: "/terms/", key: "footer.terms", label: "Términos del servicio" },
  { href: "/privacy/", key: "footer.privacy", label: "Privacidad" },
];

const SOCIAL_LINKS = [
  { href: "https://github.com/jaime-gaming", icon: "github", key: "social.github", label: "GitHub" },
  { href: "https://www.youtube.com/@jaimegaming5731", icon: "youtube", key: "social.youtube", label: "YouTube" },
  { href: "https://x.com/JaimeGamingPro", icon: "x", key: "social.x", label: "X / Twitter" },
  { href: "https://discord.com/users/984083829767675965", icon: "discord", key: "social.discord", label: "Discord" },
  { href: "mailto:jaimegamingpro@gmail.com", icon: "mail", key: "social.email", label: "Correo electrónico" },
];

function navLink(item, { active = false } = {}) {
  const classes = [];
  if (active) classes.push("active");
  const classAttr = classes.length ? ` class="${classes.join(" ")}"` : "";
  return `<a href="${item.href}" data-i18n="${item.key}"${classAttr}>${item.label}</a>`;
}

function footerLink(item) {
  const attrs = item.external ? ' target="_blank" rel="noopener noreferrer"' : "";
  const status = item.status ? '<span class="footer__status-dot" aria-hidden="true"></span>' : "";
  const external = item.arrow ? '<span class="footer__arrow" aria-hidden="true">↗</span>' : "";
  const label = item.key ? `<span data-i18n="${item.key}">${item.label}</span>` : item.label;
  return `<a${item.status ? ' class="footer__status"' : ""} href="${item.href}"${attrs}>${status}${label}${external}</a>`;
}

function footerColumn(titleKey, title, links, ariaKey) {
  return `<nav class="footer__col" aria-label="${title}" data-i18n-aria="${ariaKey}">
      <h2 class="footer__title" data-i18n="${titleKey}">${title}</h2>
      ${links.map(footerLink).join("\n      ")}
    </nav>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isActiveNavItem(item, activePath) {
  if (!item.href.startsWith("/")) return false;
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
  const nav = NAV_ITEMS.map((item) => navLink(item, { active: isActiveNavItem(item, activePath) })).join("\n    ");
  const mobileNav = NAV_ITEMS.map((item) => navLink(item)).join("\n  ");
  const legalLinks = LEGAL_LINKS.map((item) => `<a href="${item.href}" data-i18n="${item.key}">${item.label}</a>`).join("\n      ");
  const footerSocials = SOCIAL_LINKS.map((link) => {
    const attrs = link.href.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a class="social-icon" href="${link.href}" aria-label="${link.label}" data-i18n-aria="${link.key}"${attrs}>${renderIcon(link.icon)}</a>`;
  }).join("\n        ");

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
          <pattern id="languageFlagEs" width="24" height="24" patternUnits="userSpaceOnUse">
            <g><path fill="#aa151b" d="M0 0h24v24H0z"/><path fill="#f1bf00" d="M0 6h24v12H0z"/></g>
          </pattern>
          <pattern id="languageFlagEn" width="24" height="24" patternUnits="userSpaceOnUse">
            <g><path fill="#012169" d="M0 0h24v24H0z"/><path stroke="#fff" stroke-width="5" d="m0 0 24 24M24 0 0 24"/><path stroke="#c8102e" stroke-width="2" d="m0 0 24 24M24 0 0 24"/><path stroke="#fff" stroke-width="8" d="M12 0v24M0 12h24"/><path stroke="#c8102e" stroke-width="4" d="M12 0v24M0 12h24"/></g>
          </pattern>
          <radialGradient id="languageGloss" cx="34%" cy="28%" r="72%">
            <stop offset="0%" stop-color="#fff" stop-opacity=".42"/>
            <stop offset="55%" stop-color="#fff" stop-opacity=".08"/>
            <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle class="flag flag-es" cx="12" cy="12" r="9.5" fill="url(#languageFlagEs)"/>
        <circle class="flag flag-en" cx="12" cy="12" r="9.5" fill="url(#languageFlagEn)"/>
        <circle class="language-globe__gloss" cx="12" cy="12" r="9.5" fill="url(#languageGloss)" aria-hidden="true"/>
        <use href="${assetUrl("/assets/img/icons.svg")}#icon-globe" fill="none" stroke="#0d100d" stroke-opacity=".55" stroke-width="1.9" stroke-linecap="round"/>
        <use href="${assetUrl("/assets/img/icons.svg")}#icon-globe" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width=".9" stroke-linecap="round"/>
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
  <div class="footer__inner">
    <div class="footer__brand">
      <a href="/" class="footer__logo" aria-label="Jaime Gaming — inicio" data-i18n-aria="aria.homeLogo">JG<span class="dot">.</span></a>
      <p class="footer__tagline" data-i18n="footer.tagline">Juegos para navegador, aplicaciones web y vídeos.</p>
      <div class="footer__socials" role="group" aria-label="Redes sociales" data-i18n-aria="aria.socials">
        ${footerSocials}
      </div>
    </div>
    ${footerColumn("footer.site", "Sitio", FOOTER_LINKS.site, "footer.siteAria")}
    ${footerColumn("footer.resources", "Recursos", FOOTER_LINKS.resources, "footer.resourcesAria")}
  </div>
  <div class="footer__bottom">
    <p class="footer__copy">© <span id="year">${new Date().getFullYear()}</span> Jaime Gaming. <span data-i18n="footer.rights">Todos los derechos reservados.</span></p>
    <div class="footer__bottom-actions">
      <nav class="footer__legal" aria-label="Aviso legal" data-i18n-aria="footer.legalAria">
      ${legalLinks}
      </nav>
      <a href="https://github.com/jaime-gaming/jaime-gaming.github.io" target="_blank" rel="noopener noreferrer" data-i18n="footer.source">Código fuente ↗</a>
      <button class="to-top" id="toTop" type="button" aria-label="Volver arriba" data-i18n-aria="aria.backToTop">${renderIcon("arrow")}</button>
    </div>
  </div>
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
