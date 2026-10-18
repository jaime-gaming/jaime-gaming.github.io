import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { JSDOM } from "jsdom";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const main = await readFile(new URL("../assets/js/main.js", import.meta.url), "utf8");
const i18n = await readFile(new URL("../assets/js/i18n.js", import.meta.url), "utf8");
const saved = JSON.parse(await readFile(new URL("../assets/data/github.json", import.meta.url), "utf8"));

async function openSite(fail = false, setup = () => {}) {
  const dom = new JSDOM(html, { url: "https://jaime-gaming.github.io", runScripts: "outside-only", pretendToBeVisual: true });
  const { window } = dom;
  window.matchMedia = () => ({ matches: true, addEventListener() {} });
  window.setInterval = () => 0;
  window.WebSocket = undefined;
  window.console.warn = () => {};
  window.fetch = async (url) => {
    if (url === "/assets/data/github.json") return { ok: true, json: async () => saved };
    if (fail || !url.startsWith("https://api.github.com/")) throw new Error("Unavailable");
    let data;
    if (url.includes("/events/public")) data = saved.data.events;
    else if (url.includes("/repos?")) data = saved.data.repos.filter((repo) => repo.owner.login.toLowerCase() === (url.includes("/orgs/") ? "pineappleva" : "jaime-gaming"));
    else data = saved.data.user;
    return { ok: true, headers: { get: () => null }, json: async () => data };
  };
  window.localStorage.setItem("lang", "es");
  setup(window);
  window.eval(i18n);
  window.eval(main);
  await new Promise((resolve) => setTimeout(resolve, 100));
  return dom;
}

test("renders real profile and public repositories, and keeps them on language change", async () => {
  const dom = await openSite();
  try {
    const doc = dom.window.document;
    assert.equal(doc.querySelector("#profileBio").textContent, saved.data.user.bio);
    assert.equal(doc.querySelector("#profileRepos").textContent, String(saved.data.user.public_repos));
    assert.equal(doc.querySelector("#githubSync").dataset.state, "fresh");
    assert.ok(doc.querySelectorAll(".project-card").length > 0);
    assert.equal(doc.querySelectorAll(".skill-bar").length, 0);
    doc.querySelector("#langSwitch").click();
    assert.equal(doc.documentElement.lang, "en");
    assert.equal(doc.querySelector("#profileBio").textContent, saved.data.user.bio);
    assert.match(doc.querySelector(".hero__subtitle").textContent, /games, websites and videos/);
  } finally { dom.window.close(); }
});

test("API failure uses dated saved data without claiming to be live or Discord offline", async () => {
  const dom = await openSite(true);
  try {
    const doc = dom.window.document;
    assert.equal(doc.querySelector("#githubSync").dataset.state, "stale");
    assert.equal(doc.querySelector("#githubSyncTime").dateTime, new Date(saved.timestamp).toISOString());
    assert.equal(doc.querySelector("#profileBio").textContent, saved.data.user.bio);
    assert.ok(doc.querySelectorAll(".project-card").length > 0);
    assert.notEqual(doc.querySelector("#lanyardStatus").dataset.status, "offline");
  } finally { dom.window.close(); }
});

test("home removes badges and public activity, mentions Pineapple once and includes verified socials", async () => {
  const dom = await openSite();
  try {
    const doc = dom.window.document;
    assert.equal(doc.querySelectorAll(".hero__badges, #githubActivity, #statOrgRepos, .venture").length, 0);
    assert.equal((doc.body.textContent.match(/Pineapple/g) || []).length, 1);
    assert.ok(doc.querySelector('a[href="https://www.youtube.com/@jaimegaming5731"]'));
    assert.ok(doc.querySelector('a[href="https://x.com/JaimeGamingPro"]'));
    for (const card of doc.querySelectorAll(".project-card")) assert.match(card.href, /\/projects\/jaime-gaming\//);
  } finally { dom.window.close(); }
});

test("SEO metadata and sitemap identify Jaime Gaming and the public site", async () => {
  const dom = new JSDOM(html);
  try {
    const doc = dom.window.document;
    assert.match(doc.title, /^Jaime Gaming/);
    const person = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent);
    assert.equal(person.name, "Jaime Gaming");
    assert.ok(person.sameAs.includes("https://www.youtube.com/@jaimegaming5731"));
    assert.equal(doc.querySelector('meta[name="robots"]').content, "index, follow");
    assert.equal(doc.querySelector('link[rel="canonical"]').href, "https://jaime-gaming.github.io/");
    const sitemap = await readFile(new URL("../sitemap.xml", import.meta.url), "utf8");
    assert.match(sitemap, /<loc>https:\/\/jaime-gaming.github.io\/<\/loc>/);
    const image = doc.querySelector('meta[property="og:image"]').content.replace("https://jaime-gaming.github.io/", "../");
    assert.ok((await readFile(new URL(image, import.meta.url))).length > 0);
  } finally { dom.window.close(); }
});

test("README renderer supports GFM, safe HTML, Unicode, relative paths and anchors", async () => {
  const dom = new JSDOM("", { runScripts: "outside-only" });
  try {
    for (const file of ["assets/vendor/marked.min.js", "assets/vendor/purify.min.js", "assets/js/readme.js"]) {
      dom.window.eval(await readFile(new URL(`../${file}`, import.meta.url), "utf8"));
    }
    const markdown = '# Mi juego\n\n[Ir](#mi-juego)\n\n| Nombre | Estado |\n| --- | --- |\n| Acción 🎮 | Listo |\n\n- [x] Hecho\n- Lista\n\n```js\nconst x = "<div>";\n```\n\n![Captura](../img/game.png)\n\n[Guía](guide.md)\n\n![Raíz](/cover.png)\n\n<details><summary>Más</summary>Texto</details>\n<script>alert(1)</script><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">Malo</a>';
    const output = dom.window.renderProjectMarkdown(markdown, { owner: "jaime-gaming", name: "game", branch: "main", path: "docs/README.md" });
    const doc = dom.window.document;
    doc.body.innerHTML = output;
    assert.equal(doc.querySelectorAll(".readme-table table").length, 1);
    assert.match(doc.querySelector("td").textContent, /Acción 🎮/);
    assert.match(doc.querySelector("pre code").textContent, /<div>/);
    assert.ok(doc.querySelector("details summary"));
    assert.equal(doc.querySelector("h1").id, "readme-mi-juego");
    assert.equal(doc.querySelector('a[href^="#"]').getAttribute("href"), "#readme-mi-juego");
    assert.equal(doc.querySelector('img[alt="Captura"]').src, "https://raw.githubusercontent.com/jaime-gaming/game/main/img/game.png");
    assert.equal(doc.querySelector('img[alt="Raíz"]').src, "https://raw.githubusercontent.com/jaime-gaming/game/main/cover.png");
    assert.equal(doc.querySelector('a[href$="guide.md"]').href, "https://github.com/jaime-gaming/game/blob/main/docs/guide.md");
    assert.ok(doc.querySelector(".readme-checkbox"));
    assert.equal(doc.querySelectorAll("script, [onerror], a[href^='javascript:']").length, 0);
  } finally { dom.window.close(); }
});

test("project detail loads the official README endpoint and decodes UTF-8", async () => {
  const page = await readFile(new URL("../404.html", import.meta.url), "utf8");
  const repo = saved.data.repos.find((item) => item.name !== "jaime-gaming" && item.name !== "jaime-gaming.github.io");
  const dom = new JSDOM(page, { url: `https://jaime-gaming.github.io/projects/jaime-gaming/${repo.name}/`, runScripts: "outside-only", pretendToBeVisual: true });
  try {
    const { window } = dom;
    window.matchMedia = () => ({ matches: true, addEventListener() {} });
    window.setInterval = () => 0;
    window.TextDecoder = TextDecoder;
    window.AbortSignal = AbortSignal;
    window.localStorage.setItem("lang", "es");
    const calls = [];
    window.fetch = async (url) => {
      calls.push(url);
      return { ok: true, json: async () => url.endsWith("/readme") ? { encoding: "base64", content: Buffer.from("# Juego 🎮\n\nTexto en español: acción.\n\n![Captura](cover.png)").toString("base64"), path: "Readme.md" } : repo };
    };
    for (const file of ["assets/js/i18n.js", "assets/vendor/marked.min.js", "assets/vendor/purify.min.js", "assets/js/readme.js", "assets/js/main.js"]) {
      window.eval(await readFile(new URL(`../${file}`, import.meta.url), "utf8"));
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.ok(calls.some((url) => url.endsWith("/readme")));
    assert.equal(window.document.querySelector("#projectReadme h1").textContent, "Juego 🎮");
    assert.match(window.document.querySelector("#projectReadme p").textContent, /acción/);
    assert.equal(window.document.querySelector("#projectReadme").hasAttribute("aria-busy"), false);
    const image = window.document.querySelector("#projectReadme img");
    if (image) image.dispatchEvent(new window.Event("error"));
    assert.ok(window.document.querySelector(".readme-image-fallback"));
    assert.match(window.document.querySelector(".readme-image-fallback").textContent, /Captura/);
  } finally { dom.window.close(); }
});

for (const failure of [null, "repo", "readme"]) {
  test(`JG loader follows project and README loading states (${failure || "success"})`, async () => {
    const page = await readFile(new URL("../404.html", import.meta.url), "utf8");
    const repo = saved.data.repos.find((item) => !["jaime-gaming", "jaime-gaming.github.io"].includes(item.name));
    const dom = new JSDOM(page, { url: `https://jaime-gaming.github.io/projects/jaime-gaming/${repo.name}/`, runScripts: "outside-only", pretendToBeVisual: true });
    try {
      const { window } = dom;
      window.matchMedia = () => ({ matches: true, addEventListener() {} });
      window.setInterval = () => 0;
      window.TextDecoder = TextDecoder;
      window.AbortSignal = AbortSignal;
      window.console.warn = () => {};
      window.localStorage.setItem("lang", "es");
      const pending = new Map();
      window.fetch = (url) => new Promise((resolve, reject) => pending.set(url.endsWith("/readme") ? "readme" : "repo", { resolve, reject }));
      for (const file of ["assets/js/i18n.js", "assets/vendor/marked.min.js", "assets/vendor/purify.min.js", "assets/js/readme.js", "assets/js/main.js"]) {
        window.eval(await readFile(new URL(`../${file}`, import.meta.url), "utf8"));
      }
      const doc = window.document;
      assert.equal(doc.querySelector("#projectDetailSection").hidden, false);
      assert.equal(doc.querySelector("#notFoundSection").hidden, true);
      assert.equal(doc.querySelector("#projectDetail").getAttribute("aria-busy"), "true");
      assert.equal(doc.querySelector(".jg-loader__mark").textContent, "JG.");
      assert.equal(doc.querySelector(".jg-loader").getAttribute("role"), "status");
      window.i18n.applyLang("en");
      assert.equal(doc.querySelector(".jg-loader__label").textContent, "Loading project…");
      if (failure === "repo") pending.get("repo").reject(new Error("Unavailable"));
      else pending.get("repo").resolve({ ok: true, json: async () => repo });
      await new Promise((resolve) => setTimeout(resolve, 20));
      if (failure === "repo") {
        assert.equal(doc.querySelector("#notFoundSection").hidden, false);
        assert.equal(doc.querySelectorAll(".jg-loader").length, 0);
      } else {
        assert.equal(doc.querySelector("#projectDetail > .jg-loader"), null);
        assert.equal(doc.querySelector("#projectReadme .jg-loader__label").textContent, "Loading README…");
        if (failure === "readme") pending.get("readme").reject(new Error("Unavailable"));
        else pending.get("readme").resolve({ ok: true, json: async () => ({ encoding: "base64", path: "README.md", content: Buffer.from("# Ready").toString("base64") }) });
        await new Promise((resolve) => setTimeout(resolve, 20));
        assert.equal(doc.querySelectorAll(".jg-loader").length, 0);
        assert.equal(doc.querySelector("#projectReadme").hasAttribute("aria-busy"), false);
        if (failure === "readme") assert.ok(doc.querySelector(".project-detail__readme-fallback"));
        else assert.equal(doc.querySelector("#projectReadme h1").textContent, "Ready");
      }
      assert.equal(doc.querySelector("#projectDetail").hasAttribute("aria-busy"), false);
    } finally { dom.window.close(); }
  });
}

test("hero uses recent owned repositories, excludes forks and archives, and links the displayed project", async () => {
  const dom = await openSite(false, (window) => {
    const originalFetch = window.fetch;
    window.fetch = async (url) => {
      if (!url.includes("/repos?")) return originalFetch(url);
      const owner = { login: "jaime-gaming" };
      const repos = [
        { name: "archived-test", owner, pushed_at: "2099-01-01", archived: true },
        { name: "fork-test", owner, pushed_at: "2099-01-02", fork: true },
        { name: "not-my-repo", owner: { login: "someone-else" }, pushed_at: "2099-01-03" },
        ...saved.data.repos,
      ];
      return { ok: true, headers: { get: () => null }, json: async () => repos };
    };
  });
  try {
    const doc = dom.window.document;
    assert.match(doc.querySelector("#typedRole").textContent, /^Programando RNGdle-Infinite$/);
    assert.match(doc.querySelector("#roleRepoLink").href, /\/projects\/jaime-gaming\/rngdle-infinite\/$/);
    assert.equal(doc.querySelector("#roleRepoLink").hidden, false);
    assert.equal(doc.querySelector("#roleSource").textContent, "Repos recientes · GitHub");
    doc.querySelector("#langSwitch").click();
    assert.equal(doc.querySelector("#typedRole").textContent, "Coding RNGdle-Infinite");
    assert.equal(doc.querySelector("#typedRole").getAttribute("aria-live"), "off");
  } finally { dom.window.close(); }
});

test("hero keeps prepared phrases and no repo link while GitHub is still loading", async () => {
  const dom = await openSite(false, (window) => { window.fetch = () => new Promise(() => {}); });
  try {
    const doc = dom.window.document;
    assert.equal(doc.querySelector("#typedRole").textContent, "Programando algún juego");
    assert.equal(doc.querySelector("#roleRepoLink").hidden, true);
    assert.equal(doc.querySelector("#roleRepoLink").hasAttribute("href"), false);
  } finally { dom.window.close(); }
});

for (const failCopy of [false, true]) {
  test(`contact copy reports ${failCopy ? "failure without claiming success" : "success and localizes mail subjects"}`, async () => {
    let copied = "";
    const dom = await openSite(false, (window) => {
      Object.defineProperty(window.navigator, "clipboard", { value: { writeText: async (value) => {
        if (failCopy) throw new Error("Permission denied");
        copied = value;
      } } });
    });
    try {
      const doc = dom.window.document;
      assert.equal(doc.querySelector("#copyEmail").hidden, false);
      doc.querySelector("#copyEmail").click();
      await new Promise((resolve) => setTimeout(resolve, 10));
      assert.equal(doc.querySelector("#copyEmail").disabled, false);
      if (failCopy) {
        assert.equal(copied, "");
        assert.match(doc.querySelector("#copyFeedback").textContent, /No se pudo copiar/);
      } else {
        assert.equal(copied, "jaimegamingpro@gmail.com");
        assert.equal(doc.querySelector("#copyFeedback").textContent, "¡Copiado!");
      }
      doc.querySelector("#langSwitch").click();
      assert.match(doc.querySelector("#copyFeedback").textContent, failCopy ? /Could not copy/ : /^Copied!$/);
      const link = doc.querySelector('[data-contact-subject="contact.subjectBug"]');
      assert.match(decodeURIComponent(link.href), /subject=I found a bug/);
    } finally { dom.window.close(); }
  });
}

test("contact page has real contact links without JavaScript, one h1, canonical URL and sitemap entry", async () => {
  const content = await readFile(new URL("../contact/index.html", import.meta.url), "utf8");
  const dom = new JSDOM(content, { url: "https://jaime-gaming.github.io/contact/" });
  try {
    const doc = dom.window.document;
    assert.equal(doc.querySelectorAll("h1").length, 1);
    assert.equal(doc.querySelectorAll(".contact-link").length, 4);
    assert.equal(doc.querySelector("#copyEmail").hidden, true);
    assert.equal(doc.querySelectorAll("form").length, 0);
    assert.ok(doc.querySelector('a[href="mailto:jaimegamingpro@gmail.com"]'));
    assert.equal(doc.querySelector('link[rel="canonical"]').href, "https://jaime-gaming.github.io/contact/");
    const sitemap = await readFile(new URL("../sitemap.xml", import.meta.url), "utf8");
    assert.match(sitemap, /<loc>https:\/\/jaime-gaming.github.io\/contact\/<\/loc>/);
  } finally { dom.window.close(); }
});

test("every generated page links to the current CSS and JavaScript hashes", async () => {
  const { createHash } = await import("node:crypto");
  for (const page of ["index.html", "projects/index.html", "contact/index.html", "blog/index.html", "404.html"]) {
    const dom = new JSDOM(await readFile(new URL(`../${page}`, import.meta.url), "utf8"));
    try {
      const doc = dom.window.document;
      for (const element of doc.querySelectorAll('link[rel="stylesheet"], script[src]')) {
        const path = element.getAttribute("href") || element.getAttribute("src");
        if (!path.startsWith("/assets/")) continue;
        const url = new URL(path, "https://jaime-gaming.github.io");
        const content = await readFile(new URL(`..${url.pathname}`, import.meta.url));
        assert.equal(url.searchParams.get("v"), createHash("sha256").update(content).digest("hex").slice(0, 12), `${page}: ${path}`);
      }
    } finally { dom.window.close(); }
  }
});

test("stylesheet parses as one design system without duplicate base selector blocks or hidden reveal content", async () => {
  const css = await readFile(new URL("../assets/css/style.css", import.meta.url), "utf8");
  const dom = new JSDOM("<style></style>");
  try {
    const style = dom.window.document.querySelector("style");
    style.textContent = css;
    assert.ok(style.sheet.cssRules.length > 100);
    const seen = new Set();
    for (const rule of style.sheet.cssRules) {
      if (!rule.selectorText) continue;
      assert.equal(seen.has(rule.selectorText), false, `Repeated base selector: ${rule.selectorText}`);
      seen.add(rule.selectorText);
    }
    assert.ok(seen.has(":root"));
    assert.ok(seen.has(".project-card"));
    assert.ok(seen.has(".contact-layout"));
    assert.ok(seen.has(".jg-loader"));
    assert.doesNotMatch(css, /\.js\s+\.reveal[^}]*opacity:\s*0/);
  } finally { dom.window.close(); }
});
