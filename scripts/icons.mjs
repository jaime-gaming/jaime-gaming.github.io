import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { siGithub, siDiscord, siYoutube, siX } from "simple-icons";

const uiIcons = {
  code: "code-xml", music: "music", mail: "mail", message: "message-circle",
  video: "video", external: "external-link", terminal: "terminal", calendar: "calendar-days",
  commit: "git-commit-horizontal", pull: "git-pull-request", issue: "circle-alert",
  star: "star", fork: "git-fork", arrow: "arrow-up", globe: "globe", file: "file-text", close: "x",
};
const brands = { github: siGithub, discord: siDiscord, youtube: siYoutube, x: siX };
const symbols = Object.entries(uiIcons).map(([name, filename]) => {
  const svg = readFileSync(new URL(`../node_modules/lucide-static/icons/${filename}.svg`, import.meta.url), "utf8");
  const body = svg.replace(/<!--[\s\S]*?-->/g, "").replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").trim();
  return `<symbol id="icon-${name}" viewBox="0 0 24 24">${body}</symbol>`;
});
for (const [name, brand] of Object.entries(brands)) {
  symbols.push(`<symbol id="icon-${name}" viewBox="0 0 24 24"><path d="${brand.path}" fill="currentColor" stroke="none"/></symbol>`);
}
export const iconSprite = `<svg xmlns="http://www.w3.org/2000/svg"><defs>${symbols.join("")}</defs></svg>\n`;
const version = createHash("sha256").update(iconSprite).digest("hex").slice(0, 12);

export function renderIcon(name) {
  if (!(name in uiIcons) && !(name in brands)) throw new Error(`Unknown icon: ${name}`);
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="/assets/img/icons.svg?v=${version}#icon-${name}"></use></svg>`;
}

export function expandIcons(html) {
  return html.replace(/<span data-icon="([a-z]+)"><\/span>/g, (_, name) => renderIcon(name));
}
