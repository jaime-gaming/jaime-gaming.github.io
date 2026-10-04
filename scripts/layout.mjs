/**
 * Shared HTML layout used by every generated page (home, projects, blog).
 * Keeping a single template means the header/nav/footer only need to be
 * edited in one place and stay perfectly in sync across the whole site.
 */

const SITE_NAME = "Jaime Gaming";
const SITE_URL = "https://jaime-gaming.github.io";

const NAV_ITEMS = [
  { href: "/", key: "nav.home", label: "Inicio" },
  { href: "/projects/", key: "nav.projects", label: "Proyectos" },
  { href: "/blog/", key: "nav.blog", label: "Blog" },
  { href: "/#contact", key: "nav.contact", label: "Contacto" },
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
}) {
  const fullTitle = title ? `${escapeHtml(title)} — ${SITE_NAME}` : SITE_NAME;
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
<!-- JG source mark: Jaime Gaming / jaime-gaming.github.io -->
<link rel="canonical" href="${SITE_URL}${activePath}" />
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/css/style.css" />
${extraHead}</head>
<body>

<a class="skip-link" href="#top" data-i18n="aria.skipToContent">Saltar al contenido</a>
<div class="progress-bar" id="progressBar" aria-hidden="true"></div>

<header class="nav">
  <a href="/" class="nav__logo" aria-label="Jaime Gaming — inicio" data-i18n-aria="aria.homeLogo">JG<span class="dot">.</span></a>
  <nav class="nav__links" aria-label="Navegación principal" data-i18n-aria="aria.mainNav">
    ${nav}
  </nav>
  <div class="nav__actions">
    <button class="lang-switch" id="langSwitch" type="button" aria-label="Cambiar idioma" data-i18n-aria="aria.langSwitch">
      <span data-lang="es">ES</span>/<span data-lang="en">EN</span>
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
${bodyHtml}
</main>

<footer class="footer">
  <p>© <span id="year"></span> Jaime Gaming.</p>
  <button class="to-top" id="toTop" type="button" aria-label="Volver arriba" data-i18n-aria="aria.backToTop">↑</button>
</footer>

<script src="/assets/js/i18n.js"></script>
<script src="/assets/js/main.js"></script>
</body>
</html>
`;
}
