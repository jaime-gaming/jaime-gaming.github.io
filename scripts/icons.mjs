import { createHash } from "node:crypto";

const paths = {
  x: '<path d="M4 3h4l12 18h-4Zm16 0L4 21"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',
  music: '<path d="M9 18V5l12-2v13M9 8l12-2"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  message: '<path d="M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 1 1 17-5Z"/><path d="M8 10h8m-8 4h5"/>',
  video: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3Z"/>',
  github: '<path d="M9 21v-4c-4 1-4-2-5-2m11 6v-4c0-1-.4-2-1-2 4-.5 6-2 6-6 0-1-.4-2-1-3 .3-1 .3-2 0-3-2 0-3 1-3 1a12 12 0 0 0-8 0S7 3 5 3c-.3 1-.3 2 0 3-.6 1-1 2-1 3 0 4 2 5.5 6 6-.6 0-1 1-1 2"/>',
  external: '<path d="M14 3h7v7m0-7L10 14m1-11H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6"/>',
  terminal: '<rect x="2" y="3" width="20" height="18" rx="2"/><path d="m6 8 4 4-4 4m7 0h5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18m-12 4h2m3 0h2m-7 3h2"/>',
  commit: '<circle cx="12" cy="12" r="4"/><path d="M2 12h6m8 0h6"/>',
  pull: '<circle cx="6" cy="5" r="3"/><circle cx="6" cy="19" r="3"/><circle cx="18" cy="19" r="3"/><path d="M6 8v8m12 0V8a3 3 0 0 0-3-3h-3m3-3-3 3 3 3"/>',
  issue: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6m0 4h.01"/>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>',
  fork: '<circle cx="6" cy="4" r="2"/><circle cx="18" cy="4" r="2"/><circle cx="12" cy="20" r="2"/><path d="M6 6v3c0 3 6 3 6 6v3m6-12v3c0 3-6 3-6 6"/>',
  arrow: '<path d="m7 14 5-5 5 5m-5-5v12M5 3h14"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6M8 13h8m-8 4h5"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
};

export const iconSprite = `<svg xmlns="http://www.w3.org/2000/svg"><defs>${Object.entries(paths).map(([name, body]) => `<symbol id="icon-${name}" viewBox="0 0 24 24">${body}</symbol>`).join("")}</defs></svg>\n`;
const version = createHash("sha256").update(iconSprite).digest("hex").slice(0, 12);

export function renderIcon(name) {
  if (!paths[name]) throw new Error(`Unknown icon: ${name}`);
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="/assets/img/icons.svg?v=${version}#icon-${name}"></use></svg>`;
}

export function expandIcons(html) {
  return html.replace(/<span data-icon="([a-z]+)"><\/span>/g, (_, name) => renderIcon(name));
}
