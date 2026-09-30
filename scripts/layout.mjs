/**
 * Shared HTML layout used by every generated page (home, projects, blog).
 * Keeping a single template means the header/nav/footer only need to be
 * edited in one place and stay perfectly in sync across the whole site.
 */

const SITE_NAME = "Jaime Gaming";
const SITE_URL = "https://jaime-gaming.github.io";

const NAV_ITEMS = [
  { href: "/", key: "nav.home", label: "Home" },
  { href: "/projects/", key: "nav.projects", label: "Projects" },
  { href: "/blog/", key: "nav.blog", label: "Blog" },
  { href: "/#contact", key: "nav.contact", label: "Contact" },
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
  const fullTitle = title ? `${escapeHtml(title)} — ${SITE_NAME}` : `${SITE_NAME} — Portfolio`;
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
<meta name="theme-color" content="#0b0b0c" />
<link rel="canonical" href="${SITE_URL}${activePath}" />
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/css/style.css" />
${extraHead}</head>
<body>

<div class="progress-bar" id="progressBar" aria-hidden="true"></div>

<header class="nav">
  <a href="/" class="nav__logo">JG<span class="dot">.</span></a>
  <nav class="nav__links" aria-label="Main navigation">
    ${nav}
  </nav>
  <div class="nav__actions">
    <button class="lang-switch" id="langSwitch" type="button" aria-label="Switch language" data-i18n-aria="aria.langSwitch">
      <span data-lang="es">ES</span>/<span data-lang="en">EN</span>
    </button>
    <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<div class="mobile-menu" id="mobileMenu">
  ${mobileNav}
</div>

<main id="top">
${bodyHtml}
</main>

<footer class="footer">
  <p>© <span id="year"></span> Jaime Gaming. <span data-i18n="footer.made">Hecho con curiosidad y código.</span></p>
  <button class="to-top" id="toTop" aria-label="Back to top" data-i18n-aria="aria.backToTop">↑</button>
</footer>

<script src="/assets/js/i18n.js"></script>
<script src="/assets/js/main.js"></script>
</body>
</html>
`;
}
