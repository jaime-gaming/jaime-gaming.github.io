import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { JSDOM } from "jsdom";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const main = await readFile(new URL("../assets/js/main.js", import.meta.url), "utf8");
const i18n = await readFile(new URL("../assets/js/i18n.js", import.meta.url), "utf8");
const saved = JSON.parse(await readFile(new URL("../assets/data/github.json", import.meta.url), "utf8"));

async function openSite(fail = false, setup = () => {}, extraRepos = []) {
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
    else if (url.includes("/repos?")) data = [...saved.data.repos, ...extraRepos].filter((repo) => repo.owner.login.toLowerCase() === (url.includes("/orgs/") ? "pineappleva" : "jaime-gaming"));
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
    assert.equal(doc.querySelector("#profileBio").textContent, dom.window.i18n.dict[doc.documentElement.lang]["about.cardBio"]);
    assert.equal(doc.querySelector("#profileRepos").textContent, String(saved.data.user.public_repos));
    assert.equal(doc.querySelector("#githubSync").dataset.state, "fresh");
    assert.ok(doc.querySelectorAll(".project-card").length > 0);
    assert.equal(doc.querySelectorAll(".skill-bar").length, 0);
    doc.querySelector("#langSwitch").click();
    assert.equal(doc.documentElement.lang, "en");
    assert.equal(doc.querySelector("#profileBio").textContent, dom.window.i18n.dict[doc.documentElement.lang]["about.cardBio"]);
    assert.match(doc.querySelector(".hero__subtitle").textContent, /browser games, web applications and videos/);
  } finally { dom.window.close(); }
});

test("API failure uses dated saved data without claiming to be live or Discord offline", async () => {
  const dom = await openSite(true);
  try {
    const doc = dom.window.document;
    assert.equal(doc.querySelector("#githubSync").dataset.state, "stale");
    assert.equal(doc.querySelector("#githubSyncTime").dateTime, new Date(saved.timestamp).toISOString());
    assert.equal(doc.querySelector("#profileBio").textContent, dom.window.i18n.dict[doc.documentElement.lang]["about.cardBio"]);
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

test("every page links to the external Docs, the internal status page and the legal pages", async () => {
  for (const page of ["index.html", "projects/index.html", "contact/index.html", "status/index.html", "terms/index.html", "privacy/index.html", "blog/index.html", "blog/lanzamiento-wave/index.html", "404.html"]) {
    const dom = new JSDOM(await readFile(new URL(`../${page}`, import.meta.url), "utf8"));
    try {
      const doc = dom.window.document;
      const footer = doc.querySelector("footer.footer");
      assert.ok(footer, `${page}: footer`);
      for (const scope of [doc.querySelector(".nav__links"), doc.querySelector(".mobile-menu")]) {
        const docs = scope.querySelector('a[href="https://jaime-gaming.github.io/Docs"]');
        assert.ok(docs, `${page}: Docs link`);
        assert.equal(docs.getAttribute("target"), null, `${page}: Docs opens directly`);
        assert.equal(docs.textContent, "Docs");
      }
      const docsFooterLink = footer.querySelector('a[href="https://jaime-gaming.github.io/Docs"]');
      assert.ok(docsFooterLink, `${page}: Docs in the footer`);
      assert.equal(docsFooterLink.querySelector(".footer__arrow"), null, `${page}: Docs footer link has no arrow`);
      const statusLink = footer.querySelector('a[href="/status/"]');
      assert.ok(statusLink, `${page}: status page in the footer`);
      assert.ok(statusLink.querySelector(".footer__status-dot"), `${page}: status dot`);
      assert.equal(statusLink.querySelector(".footer__arrow"), null, `${page}: internal status link has no arrow`);
      assert.ok(footer.querySelector('a[href="/terms/"]'), `${page}: terms link`);
      assert.ok(footer.querySelector('a[href="/privacy/"]'), `${page}: privacy link`);
      assert.equal(footer.querySelectorAll(".footer__col a").length, 8);
      assert.equal(footer.querySelectorAll(".footer__socials a").length, 5);
      assert.match(footer.querySelector("#year").textContent, /^\d{4}$/);
    } finally { dom.window.close(); }
  }
});

const statusFixture = {
  page: { id: "page", name: "Jaime Gaming", url: "https://statuspage.incident.io/jaime-gaming", updated_at: "2026-10-19T19:29:19Z" },
  status: { description: "All Systems Operational", indicator: "none" },
  components: [
    { id: "1", name: "Website", status: "operational", position: 0 },
    { id: "2", name: "Docs", status: "operational", position: 1 },
    { id: "3", name: "RNGdle Infinite", status: "degraded_performance", position: 2 },
    { id: "4", name: "Daily Diary", status: "operational", position: 3 },
  ],
  scheduled_maintenances: [{
    id: "m1",
    name: "RNGdle Infinite",
    status: "scheduled",
    incident_updates: [{ body: "A small maintenance window while v0.5.1 ships." }],
  }],
};

const statusPageHtml = await readFile(new URL("../status/index.html", import.meta.url), "utf8");
const statusScripts = await Promise.all(["assets/js/i18n.js", "assets/js/main.js"].map((file) => readFile(new URL(`../${file}`, import.meta.url), "utf8")));

async function openStatusPage(fetchStatus) {
  const dom = new JSDOM(statusPageHtml, {
    url: "https://jaime-gaming.github.io/status/",
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  const { window } = dom;
  window.matchMedia = () => ({ matches: true, addEventListener() {} });
  window.setInterval = () => 0;
  window.console.warn = () => {};
  window.AbortSignal = AbortSignal;
  window.localStorage.setItem("lang", "es");
  window.fetch = fetchStatus;
  for (const script of statusScripts) window.eval(script);
  await new Promise((resolve) => setTimeout(resolve, 80));
  return dom;
}

test("status page renders the live incident.io summary inside the site and keeps an external link", async () => {
  const dom = await openStatusPage(async () => ({ ok: true, json: async () => statusFixture }));
  try {
    const doc = dom.window.document;
    const dict = dom.window.i18n.dict;
    assert.equal(doc.querySelectorAll("h1").length, 1);
    assert.equal(doc.querySelector('link[rel="canonical"]').href, "https://jaime-gaming.github.io/status/");
    assert.equal(doc.querySelector(".status-page__frame iframe"), null, "third-party panel is not loaded before consent");
    const loadButton = doc.getElementById("loadStatusFrame");
    assert.ok(loadButton);
    assert.match(doc.getElementById("statusFramePlaceholder").textContent, /cookies/);
    assert.ok(doc.querySelector('a[href="https://statuspage.incident.io/jaime-gaming"][target="_blank"]'));
    const summary = doc.getElementById("statusSummary");
    assert.equal(summary.dataset.state, "operational");
    assert.equal(summary.getAttribute("aria-busy"), "false");
    assert.equal(doc.getElementById("statusOverall").textContent, dict.es["status.allOperational"]);
    assert.match(doc.getElementById("statusUpdated").textContent, /Actualizado el/);
    assert.equal(doc.querySelectorAll(".status-component").length, 4);
    assert.equal(doc.querySelectorAll(".status-component")[0].querySelector(".status-component__state").textContent, "Operativo");
    assert.equal(doc.querySelector('.status-component[data-status="degraded_performance"] .status-component__state').textContent, "Rendimiento degradado");
    assert.equal(doc.getElementById("statusError").hidden, true);
    assert.equal(doc.getElementById("statusMaintenance").hidden, false);
    assert.match(doc.getElementById("statusMaintenanceBody").textContent, /v0\.5\.1/);

    loadButton.click();
    const frame = doc.querySelector(".status-page__frame iframe");
    assert.equal(frame.getAttribute("src"), "https://statuspage.incident.io/jaime-gaming");
    assert.equal(frame.getAttribute("loading"), "lazy");
    assert.equal(frame.getAttribute("referrerpolicy"), "no-referrer");
    assert.equal(doc.getElementById("statusFramePlaceholder"), null);
    assert.equal(doc.getElementById("loadStatusFrame"), null);

    doc.querySelector("#langSwitch").click();
    assert.equal(doc.getElementById("statusOverall").textContent, "All systems operational");
    assert.equal(doc.querySelector('.status-component[data-status="degraded_performance"] .status-component__state').textContent, "Degraded performance");
    assert.match(doc.getElementById("statusUpdated").textContent, /Updated/);
    assert.match(doc.getElementById("statusMaintenanceBody").textContent, /Text published on the status page/);
    assert.equal(doc.title, "Service status — Jaime Gaming");

    const sitemap = await readFile(new URL("../sitemap.xml", import.meta.url), "utf8");
    assert.match(sitemap, /<loc>https:\/\/jaime-gaming.github.io\/status\/<\/loc>/);
  } finally { dom.window.close(); }
});

test("status page reports an unavailable live summary without pretending everything is fine", async () => {
  const dom = await openStatusPage(async () => { throw new Error("Unavailable"); });
  try {
    const doc = dom.window.document;
    assert.equal(doc.getElementById("statusSummary").dataset.state, "unknown");
    assert.equal(doc.getElementById("statusOverall").textContent, "Estado no disponible");
    assert.equal(doc.getElementById("statusError").hidden, false);
    assert.equal(doc.querySelectorAll(".status-component").length, 0);
    assert.equal(doc.getElementById("statusMaintenance").hidden, true);
    assert.ok(doc.querySelector('a[href="https://statuspage.incident.io/jaime-gaming"][target="_blank"]'));
  } finally { dom.window.close(); }
});

const legalSources = {
  terms: {
    fullTitle: "Términos del servicio",
    es: await readFile(new URL("../content/terms.es.html", import.meta.url), "utf8"),
    en: await readFile(new URL("../content/terms.en.html", import.meta.url), "utf8"),
  },
  privacy: {
    fullTitle: "Privacidad",
    es: await readFile(new URL("../content/privacy.es.html", import.meta.url), "utf8"),
    en: await readFile(new URL("../content/privacy.en.html", import.meta.url), "utf8"),
  },
};

test("legal texts are narrated in full, mirrored in both languages and apply to every project without naming or categorising it", async () => {
  const projectNames = ["Wave", "RNGdle", "jAIgent", "VOID", "Daily Diary", "hellbot", "Pineapple", "attackagi", "Better-Discovery", "FNAS", "tycoon-idle"];
  const projectThemes = [
    /\b(juego|juegos|jugador|jugadora|partida|partidas|reproductor|música|diario|agente|chat|bot|puntuación|recompensa|letras)\b/i,
    /\b(game|games|player|music|diary|agent|chat|bot|score|reward|lyrics)\b/i,
    /inteligencia artificial|artificial intelligence|modelo de lenguaje|language model/i,
  ];
  for (const [slug, source] of Object.entries(legalSources)) {
    for (const lang of ["es", "en"]) {
      const html = source[lang];
      assert.ok(html.length > 9000, `${slug}.${lang}: long-form content (${html.length})`);
      assert.ok((html.match(/<h2>/g) || []).length >= 14, `${slug}.${lang}: structured sections`);
      for (const name of projectNames) {
        assert.doesNotMatch(html, new RegExp(`\\b${name}\\b`), `${slug}.${lang}: names the project ${name}`);
      }
      for (const theme of projectThemes) {
        assert.doesNotMatch(html, theme, `${slug}.${lang}: mentions a project theme`);
      }
      assert.doesNotMatch(html, /Plataforma Europea de Resolución de Litigios|European Online Dispute Resolution|ODR platform/, `${slug}.${lang}: outdated ODR reference`);
    }
    assert.equal((source.es.match(/<h2>/g) || []).length, (source.en.match(/<h2>/g) || []).length, `${slug}: section parity`);
  }
  for (const marker of ["<code>localStorage</code>", "AEPD", "incident.io", "cookies", "tipografías|typefaces"]) {
    assert.match(legalSources.privacy.es, new RegExp(marker, "i"));
    assert.match(legalSources.privacy.en, new RegExp(marker.replace("tipografías|typefaces", "typefaces"), "i"));
  }
  for (const marker of ["ISC", "MIT", "licencia"]) assert.match(legalSources.terms.es, new RegExp(marker));
  for (const marker of ["ISC", "MIT", "licence"]) assert.match(legalSources.terms.en, new RegExp(marker));
  assert.match(legalSources.terms.es, /negligencia grave/);
  assert.match(legalSources.terms.en, /gross negligence/);
  assert.match(legalSources.terms.es, /consumidor/);
  assert.match(legalSources.terms.en, /consumer/);
});

test("terms and privacy pages render both languages, keep their canonical URL and are linked from the footer", async () => {
  const sitemap = await readFile(new URL("../sitemap.xml", import.meta.url), "utf8");
  for (const [slug, source] of Object.entries(legalSources)) {
    const dom = new JSDOM(await readFile(new URL(`../${slug}/index.html`, import.meta.url), "utf8"), {
      url: `https://jaime-gaming.github.io/${slug}/`,
      runScripts: "outside-only",
    });
    try {
      const { window } = dom;
      window.eval(i18n);
      const doc = window.document;
      assert.equal(doc.querySelectorAll("h1").length, 1);
      assert.equal(doc.querySelector("h1").textContent, source.fullTitle);
      assert.equal(doc.querySelector('link[rel="canonical"]').href, `https://jaime-gaming.github.io/${slug}/`);
      assert.match(sitemap, new RegExp(`<loc>https://jaime-gaming.github.io/${slug}/</loc>`));
      const body = doc.querySelector(".legal__body");
      assert.equal(body.hasAttribute("data-content-language"), true);
      assert.ok(body.textContent.length > 8000, `${slug}: rendered content`);
      assert.match(body.textContent, /Última actualización: 19 de octubre de 2026/);
      assert.equal(doc.querySelectorAll("footer a[href$='/terms/'], footer a[href$='/privacy/']").length, 2);
      const spanishTitle = doc.title;
      window.i18n.applyLang("en");
      assert.match(body.textContent, /Last updated: 19 October 2026/);
      assert.ok(body.textContent.length > 8000, `${slug}: rendered English content`);
      assert.equal(body.lang, "en");
      assert.notEqual(doc.title, spanishTitle);
      assert.match(doc.title, /— Jaime Gaming$/);
      assert.doesNotMatch(doc.title, /Términos|Privacidad/);
    } finally { dom.window.close(); }
  }
});

test("typography is self-hosted and no page requests fonts from Google", async () => {
  const css = await readFile(new URL("../assets/css/style.css", import.meta.url), "utf8");
  const faces = css.match(/@font-face \{[^}]+\}/g) || [];
  assert.ok(faces.length >= 9, "self-hosted @font-face rules");
  for (const face of faces) assert.match(face, /url\("\/assets\/fonts\/[a-z0-9-]+\.woff2"\)/);
  for (const file of css.match(/\/assets\/fonts\/[a-z0-9-]+\.woff2/g)) {
    assert.ok((await readFile(new URL(`..${file}`, import.meta.url))).length > 1000, `${file} exists`);
  }
  for (const page of ["index.html", "projects/index.html", "contact/index.html", "status/index.html", "terms/index.html", "privacy/index.html", "blog/index.html", "404.html"]) {
    const html = await readFile(new URL(`../${page}`, import.meta.url), "utf8");
    assert.doesNotMatch(html, /fonts\.(googleapis|gstatic)\.com/, `${page}: no Google Fonts`);
  }
  for (const license of ["dm-sans", "space-grotesk", "ibm-plex-mono"]) {
    assert.ok((await readFile(new URL(`../assets/vendor/${license}.LICENSE.txt`, import.meta.url))).length > 500, `${license} licence`);
  }
});

test("the old /docs/ page redirects to the external documentation without being indexed", async () => {
  const html = await readFile(new URL("../docs/index.html", import.meta.url), "utf8");
  const dom = new JSDOM(html, { url: "https://jaime-gaming.github.io/docs/" });
  try {
    const doc = dom.window.document;
    assert.equal(doc.querySelector('meta[http-equiv="refresh"]').content, "0; url=https://jaime-gaming.github.io/Docs");
    assert.equal(doc.querySelector('meta[name="robots"]').content, "noindex, follow");
    assert.equal(doc.querySelector('link[rel="canonical"]').href, "https://jaime-gaming.github.io/Docs");
    assert.match(html, /window\.location\.replace\("https:\/\/jaime-gaming\.github\.io\/Docs"/);
    assert.equal(doc.querySelector("main a").href, "https://jaime-gaming.github.io/Docs");
    const sitemap = await readFile(new URL("../sitemap.xml", import.meta.url), "utf8");
    assert.doesNotMatch(sitemap, /<loc>https:\/\/jaime-gaming.github.io\/docs\/<\/loc>/);
  } finally { dom.window.close(); }
});

test("the Docs repository is excluded from the public project list", async () => {
  const docsRepo = {
    name: "Docs", full_name: "jaime-gaming/Docs", owner: { login: "jaime-gaming" }, private: false,
    description: "Documentation", html_url: "https://github.com/jaime-gaming/Docs",
    pushed_at: "2026-10-19T12:00:00Z", updated_at: "2026-10-19T12:00:00Z",
    stargazers_count: 0, forks_count: 0, default_branch: "main",
  };
  const dom = await openSite(false, () => {}, [docsRepo]);
  try {
    const doc = dom.window.document;
    assert.equal(doc.querySelector('.project-card[href="/projects/jaime-gaming/docs/"]'), null);
    for (const card of doc.querySelectorAll(".project-card__name")) assert.notEqual(card.textContent, "Docs");
    assert.ok(doc.querySelector('.nav__links a[href="https://jaime-gaming.github.io/Docs"]'));
  } finally { dom.window.close(); }
});

test("every generated page links to the current CSS and JavaScript hashes", async () => {
  const { createHash } = await import("node:crypto");
  for (const page of ["index.html", "projects/index.html", "contact/index.html", "status/index.html", "terms/index.html", "privacy/index.html", "blog/index.html", "blog/lanzamiento-wave/index.html", "404.html"]) {
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
    assert.ok(seen.has(".status-summary"));
    assert.ok(seen.has(".legal__body"));
    assert.doesNotMatch(css, /\.js\s+\.reveal[^}]*opacity:\s*0/);
  } finally { dom.window.close(); }
});

const calendarFixture = { total: { lastYear: 5 }, contributions: [
  { date: "2026-10-16", count: 2, level: 2 },
  { date: "2026-10-17", count: 3, level: 3 },
  { date: "2026-10-18", count: 0, level: 0 },
] };

function withCalendar(window, search) {
  const original = window.fetch;
  window.fetch = async (url, options) => {
    if (url.includes("github-contributions-api")) return { ok: true, json: async () => calendarFixture };
    if (url.includes("api.github.com/search/")) return search(url, options);
    return original(url, options);
  };
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 20));

test("selecting a contribution day lists safe commit and issue links, reuses cache and localizes the panel", async () => {
  let requests = 0;
  const dom = await openSite(false, (window) => withCalendar(window, async (url) => {
    requests++;
    assert.match(decodeURIComponent(url), /user:jaime-gaming/);
    const items = url.includes("/commits?")
      ? [{ html_url: "https://github.com/jaime-gaming/Wave/commit/1234567", sha: "1234567abc", commit: { message: "Fix playback <script>alert(1)</script>\nMore detail" }, repository: { full_name: "jaime-gaming/Wave" } }]
      : [{ html_url: "https://github.com/jaime-gaming/Wave/pull/12", title: "Improve queue", number: 12, pull_request: {}, repository_url: "https://api.github.com/repos/jaime-gaming/Wave" }];
    return { ok: true, json: async () => ({ items, total_count: 1, incomplete_results: false }) };
  }));
  try {
    const doc = dom.window.document;
    const day = doc.querySelector('button[data-date="2026-10-17"]');
    day.click();
    assert.equal(doc.querySelector("#contributionPanel").hidden, false);
    assert.ok(doc.querySelector("#contributionResults .jg-loader__track"));
    await flush();
    assert.equal(doc.querySelectorAll(".contribution-list li").length, 2);
    assert.equal(doc.querySelectorAll("#contributionResults script").length, 0);
    assert.match(doc.querySelector("#contributionResults").textContent, /<script>/);
    assert.equal(day.getAttribute("aria-pressed"), "true");
    day.click(); await flush();
    assert.equal(requests, 2);
    doc.querySelector("#langSwitch").click();
    assert.match(doc.querySelector("#contributionResults").textContent, /Issues and pull requests/);
    doc.querySelector("#closeContributions").click();
    assert.equal(doc.querySelector("#contributionPanel").hidden, true);
    assert.equal(doc.querySelector('button[data-date="2026-10-17"]').getAttribute("aria-expanded"), "false");
  } finally { dom.window.close(); }
});

test("zero-contribution days do not make searches and partial results are labelled", async () => {
  let requests = 0;
  const dom = await openSite(false, (window) => withCalendar(window, async (url) => {
    requests++;
    if (url.includes("/issues?")) return { ok: false, status: 403 };
    return { ok: true, json: async () => ({ items: [], total_count: 0 }) };
  }));
  try {
    const doc = dom.window.document;
    doc.querySelector('button[data-date="2026-10-18"]').click();
    await flush();
    assert.equal(requests, 0);
    assert.match(doc.querySelector("#contributionResults").textContent, /no registra contribuciones/);
    doc.querySelector('button[data-date="2026-10-17"]').click();
    await flush();
    assert.equal(requests, 2);
    assert.match(doc.querySelector("#contributionResults").textContent, /Parte de los resultados/);
    assert.equal(doc.querySelector("#contributionResults").getAttribute("aria-busy"), "false");
  } finally { dom.window.close(); }
});

test("old day responses cannot overwrite a newer day or reopen a closed panel", async () => {
  const pending = [];
  const dom = await openSite(false, (window) => withCalendar(window, (url) => new Promise((resolve) => pending.push({ url, resolve }))));
  try {
    const doc = dom.window.document;
    doc.querySelector('button[data-date="2026-10-16"]').click();
    doc.querySelector('button[data-date="2026-10-18"]').click();
    for (const request of pending) request.resolve({ ok: true, json: async () => ({ items: [], total_count: 0 }) });
    await flush();
    assert.match(doc.querySelector("#contributionPanelTitle").textContent, /18/);
    assert.match(doc.querySelector("#contributionResults").textContent, /no registra contribuciones/);
    doc.querySelector('button[data-date="2026-10-17"]').click();
    doc.querySelector("#closeContributions").click();
    for (const request of pending) request.resolve({ ok: true, json: async () => ({ items: [], total_count: 0 }) });
    await flush();
    assert.equal(doc.querySelector("#contributionPanel").hidden, true);
  } finally { dom.window.close(); }
});

test("calendar and daily summary can use a dated official snapshot when external services fail", async () => {
  const record = JSON.parse(await readFile(new URL("../assets/data/contributions.json", import.meta.url), "utf8"));
  const date = Object.keys(record.details)[0];
  const dom = await openSite(false, (window) => {
    const original = window.fetch;
    window.fetch = async (url, options) => {
      if (url === "/assets/data/contributions.json") return { ok: true, json: async () => record };
      if (url.includes("github-contributions-api") || url.includes("/search/")) throw new Error("Unavailable");
      return original(url, options);
    };
  });
  try {
    const doc = dom.window.document;
    assert.equal(doc.querySelectorAll(".calendar__day[data-date]").length, 365);
    assert.match(doc.querySelector("#contributionSource").textContent, /Datos consultados/);
    doc.querySelector(`button[data-date="${date}"]`).click();
    await flush();
    assert.match(doc.querySelector("#contributionResults").textContent, /Resumen de GitHub guardado/);
    assert.ok(doc.querySelector(".contribution-list a"));
    assert.equal(doc.querySelector("#contributionResults").getAttribute("aria-busy"), "false");
  } finally { dom.window.close(); }
});

test("icons resolve to a local SVG sprite and loaders have no fake progress percentage", async () => {
  const sprite = new JSDOM(await readFile(new URL("../assets/img/icons.svg", import.meta.url), "utf8"), { contentType: "image/svg+xml" });
  const dom = await openSite();
  try {
    const doc = dom.window.document;
    assert.ok(doc.querySelectorAll("svg.icon use").length > 10);
    for (const use of doc.querySelectorAll("svg.icon use")) {
      const id = use.getAttribute("href").split("#")[1];
      assert.ok(sprite.window.document.getElementById(id), id);
      assert.equal(use.parentElement.getAttribute("aria-hidden"), "true");
    }
    assert.doesNotMatch(html, /aria-valuenow/);
    assert.match(html, /jg-loader__track/);
    assert.equal(dom.window.i18n.dict.es["hero.roles"].length, 10);
  } finally { dom.window.close(); sprite.window.close(); }
});

test("Wave launch post links the verified release and preserves platform limitations", async () => {
  const content = await readFile(new URL("../blog/lanzamiento-wave/index.html", import.meta.url), "utf8");
  const dom = new JSDOM(content);
  try {
    const doc = dom.window.document;
    assert.match(doc.querySelector("h1").textContent, /Wave 0.1.0/);
    assert.equal(doc.querySelector("article").lang, "es");
    assert.ok(doc.querySelector('a[href="https://github.com/jaime-gaming/Wave/releases/tag/v0.1.0"]'));
    assert.match(doc.querySelector("article").textContent, /17 de octubre de 2026/);
    assert.match(doc.querySelector("article").textContent, /sin firma o de depuración/);
    assert.match(doc.querySelector("article").textContent, /no es una copia de seguridad/);
    const image = doc.querySelector('img[src="/assets/img/wave-home.png"]');
    assert.ok(image);
    assert.ok((await readFile(new URL("../assets/img/wave-home.png", import.meta.url))).length > 1000);
  } finally { dom.window.close(); }
});

test("failed daily lookups without a saved detail show a real GitHub link and clear the loader", async () => {
  const dom = await openSite(false, (window) => withCalendar(window, async () => ({ ok: false, status: 403 })));
  try {
    const doc = dom.window.document;
    doc.querySelector('button[data-date="2026-10-17"]').click();
    await flush();
    assert.match(doc.querySelector("#contributionResults").textContent, /No se pudo consultar GitHub/);
    assert.equal(doc.querySelectorAll("#contributionResults .jg-loader").length, 0);
    assert.equal(doc.querySelector("#contributionResults").getAttribute("aria-busy"), "false");
    assert.match(doc.querySelector(".contribution-panel__source").href, /from=2026-10-17&to=2026-10-17/);
  } finally { dom.window.close(); }
});

test("blog translates the complete article, dates, image descriptions and SEO without duplicate posts", async () => {
  const post = await readFile(new URL("../blog/lanzamiento-wave/index.html", import.meta.url), "utf8");
  const index = await readFile(new URL("../blog/index.html", import.meta.url), "utf8");
  const dom = new JSDOM(post, { url: "https://jaime-gaming.github.io/blog/lanzamiento-wave/", runScripts: "outside-only" });
  try {
    const { window } = dom;
    window.localStorage.setItem("lang", "es");
    window.eval(i18n);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const doc = window.document;
    const spanishBody = doc.querySelector("article").innerHTML;
    const spanishTitle = doc.title;
    doc.querySelector("#langSwitch").click();
    assert.equal(doc.documentElement.lang, "en");
    assert.equal(doc.querySelector("article").lang, "en");
    assert.equal(doc.querySelectorAll("h1").length, 1);
    assert.equal(doc.querySelector("h1").textContent, "Wave 0.1.0: a player for your own music");
    assert.match(doc.querySelector("article").textContent, /Wave is not a backup/);
    assert.match(doc.querySelector("article").textContent, /unsigned test or debug builds/);
    assert.match(doc.querySelector("article").textContent, /Automatic lookup is initially disabled/);
    assert.match(doc.querySelector("article").textContent, /offline startup are still pending/);
    assert.match(doc.querySelector("article img").alt, /desktop library/);
    assert.equal(doc.querySelector("time").textContent, "October 18, 2026");
    assert.match(doc.title, /a player for your own music/);
    assert.equal(doc.querySelector('meta[property="og:title"]').content, doc.title);
    assert.equal(doc.querySelector('meta[name="twitter:title"]').content, doc.title);
    assert.match(doc.querySelector('meta[name="description"]').content, /first version of Wave/);
    assert.equal(doc.querySelector('meta[property="og:locale"]').content, "en_US");
    assert.equal(window.localStorage.getItem("lang"), "en");
    const listing = new JSDOM(index, { url: "https://jaime-gaming.github.io/blog/", runScripts: "outside-only" });
    try {
      listing.window.localStorage.setItem("lang", window.localStorage.getItem("lang"));
      listing.window.eval(i18n);
      await new Promise((resolve) => setTimeout(resolve, 0));
      assert.equal(listing.window.document.querySelectorAll(".blog-item").length, 1);
      assert.match(listing.window.document.querySelector(".blog-item__title").textContent, /a player for your own music/);
      assert.match(listing.window.document.querySelector(".blog-item__excerpt").textContent, /without an account or subscription/);
      assert.equal(listing.window.document.querySelector("time").textContent, "October 18, 2026");
    } finally { listing.window.close(); }
    doc.querySelector("#langSwitch").click();
    assert.equal(doc.querySelector("article").innerHTML, spanishBody);
    assert.equal(doc.title, spanishTitle);
    assert.equal(doc.querySelector("time").textContent, "18 de octubre de 2026");
    assert.equal(doc.querySelector("article").lang, "es");
  } finally { dom.window.close(); }
});

test("globe alternates flag state with an accessible destination label and persists the selection", async () => {
  const dom = await openSite();
  try {
    const { document: doc } = dom.window;
    const button = doc.getElementById("langSwitch");
    assert.ok(button.querySelector(".language-globe use[href$='#icon-globe']"));
    assert.ok(button.querySelector(".flag-es"));
    assert.ok(button.querySelector(".flag-en"));
    assert.equal(button.querySelectorAll("circle.flag").length, 2);
    assert.ok(button.querySelector(".language-globe__gloss"));
    assert.equal(button.dataset.active, "es");
    assert.equal(button.getAttribute("aria-label"), "Español. Cambiar a inglés");
    button.click();
    assert.equal(button.dataset.active, "en");
    assert.equal(button.classList.contains("is-switching"), true);
    assert.equal(button.title, "English. Switch to Spanish");
    assert.equal(button.getAttribute("aria-label"), button.title);
    assert.equal(doc.querySelector("#languageName").textContent, "English");
    assert.equal(dom.window.localStorage.getItem("lang"), "en");
    assert.equal(doc.title, "Jaime Gaming — games, programming and YouTube");
    button.click();
    assert.equal(button.dataset.active, "es");
    assert.equal(doc.querySelector("#languageName").textContent, "Español");
    assert.equal(doc.querySelector("#profileLocation").textContent, "España");
    assert.match(doc.querySelector('.project-card[href$="/wave/"] .project-card__desc').textContent, /reproductor de música local/);
  } finally { dom.window.close(); }
});

test("brand icons use published Simple Icons paths and interface symbols come from Lucide", async () => {
  const { siGithub, siDiscord, siYoutube, siX } = await import("simple-icons");
  const sprite = new JSDOM(await readFile(new URL("../assets/img/icons.svg", import.meta.url), "utf8"), { contentType: "image/svg+xml" });
  try {
    for (const [name, brand] of Object.entries({ github: siGithub, discord: siDiscord, youtube: siYoutube, x: siX })) {
      const path = sprite.window.document.querySelector(`#icon-${name} path`);
      assert.equal(path.getAttribute("d"), brand.path);
      assert.equal(path.getAttribute("fill"), "currentColor");
      assert.equal(path.getAttribute("stroke"), "none");
    }
    const original = new JSDOM(await readFile(new URL("../node_modules/lucide-static/icons/globe.svg", import.meta.url), "utf8"), { contentType: "image/svg+xml" });
    try {
      assert.deepEqual(Array.from(sprite.window.document.querySelectorAll("#icon-globe path"), (p) => p.getAttribute("d")), Array.from(original.window.document.querySelectorAll("path"), (p) => p.getAttribute("d")));
    } finally { original.window.close(); }
    const contact = new JSDOM(await readFile(new URL("../contact/index.html", import.meta.url), "utf8"));
    try {
      assert.ok(contact.window.document.querySelector('a[href*="discord.com"] use[href$="#icon-discord"]'));
      assert.ok(contact.window.document.querySelector('a[href*="youtube.com"] use[href$="#icon-youtube"]'));
    } finally { contact.window.close(); }
  } finally { sprite.window.close(); }
});

test("localized page payload cannot close its JSON script element", async () => {
  const { renderLayout } = await import("../scripts/layout.mjs");
  const value = '</script><script id="injected">alert(1)</script>';
  const dom = new JSDOM(renderLayout({ title: "Blog", bodyHtml: "", activePath: "/blog/", translations: { en: { fields: { title: value } } } }));
  try {
    assert.equal(dom.window.document.getElementById("injected"), null);
    assert.equal(JSON.parse(dom.window.document.getElementById("pageTranslations").textContent).en.fields.title, value);
  } finally { dom.window.close(); }
});

test("README accessibility labels follow the chosen language without changing the source document", async () => {
  const dom = await openSite();
  try {
    const { window } = dom;
    for (const file of ["assets/vendor/marked.min.js", "assets/vendor/purify.min.js", "assets/js/readme.js"]) window.eval(await readFile(new URL(`../${file}`, import.meta.url), "utf8"));
    const wrapper = window.document.createElement("div");
    wrapper.innerHTML = window.renderProjectMarkdown("- [x] Original task\n\n| A | B |\n| - | - |\n| 1 | 2 |", { owner: "jaime-gaming", name: "Wave", branch: "main", path: "README.md" });
    window.document.body.append(wrapper);
    assert.equal(wrapper.querySelector(".readme-checkbox").getAttribute("aria-label"), "Completado");
    assert.equal(wrapper.querySelector(".readme-table").getAttribute("aria-label"), "Tabla del README");
    window.i18n.applyLang("en");
    assert.equal(wrapper.querySelector(".readme-checkbox").getAttribute("aria-label"), "Completed");
    assert.equal(wrapper.querySelector(".readme-table").getAttribute("aria-label"), "README table");
    assert.match(wrapper.textContent, /Original task/);
  } finally { dom.window.close(); }
});

test("all generated page labels and metadata have both Spanish and English translations", async () => {
  for (const file of ["index.html", "projects/index.html", "contact/index.html", "status/index.html", "terms/index.html", "privacy/index.html", "404.html", "blog/index.html", "blog/lanzamiento-wave/index.html"]) {
    const dom = new JSDOM(await readFile(new URL(`../${file}`, import.meta.url), "utf8"), { url: "https://jaime-gaming.github.io", runScripts: "outside-only" });
    try {
      const { window } = dom;
      window.eval(i18n);
      assert.deepEqual(Object.keys(window.i18n.dict.es).sort(), Object.keys(window.i18n.dict.en).sort());
      for (const lang of ["en", "es"]) {
        window.i18n.applyLang(lang);
        for (const element of window.document.querySelectorAll("[data-i18n], [data-i18n-aria], [data-i18n-title]")) {
          const key = element.dataset.i18n || element.dataset.i18nAria || element.dataset.i18nTitle;
          assert.equal(typeof window.i18n.dict[lang][key], "string", `${file}: ${lang}.${key}`);
        }
        const doc = window.document;
        assert.equal(doc.documentElement.lang, lang);
        assert.equal(doc.querySelector('meta[property="og:title"]').content, doc.title);
        assert.equal(doc.querySelector('meta[name="twitter:title"]').content, doc.title);
        assert.equal(doc.querySelector('meta[property="og:description"]').content, doc.querySelector('meta[name="description"]').content);
        if (lang === "en") assert.doesNotMatch(doc.title, /Proyectos|Contacto|Proyecto|juegos|programación/);
      }
    } finally { dom.window.close(); }
  }
});

test("legal documents render as one readable column without an in-page table of contents", async () => {
  for (const [slug, sections] of [["terms", 20], ["privacy", 15]]) {
    const dom = new JSDOM(await readFile(new URL(`../${slug}/index.html`, import.meta.url), "utf8"), { url: `https://jaime-gaming.github.io/${slug}/` });
    try {
      const doc = dom.window.document;
      const body = doc.querySelector(".legal__body");
      assert.ok(body, `${slug}: legal body`);
      assert.equal(doc.querySelectorAll(".legal__body h2").length, sections, `${slug}: every section is a heading`);
      assert.match(doc.querySelector(".legal__body .legal__updated").textContent, /^Última actualización: 19 de octubre de 2026$/);
      assert.equal(doc.querySelector(".legal__toc"), null, `${slug}: no table of contents`);
      assert.equal(doc.querySelectorAll(".legal__body h2[id]").length, 0, `${slug}: plain headings`);
      assert.ok(doc.querySelector('.legal__body [data-content-key], .legal__body[data-content-key]'));
    } finally { dom.window.close(); }
  }
});

test("home keeps the overview sections used by the stylesheet", async () => {
  const dom = new JSDOM(html);
  try {
    const doc = dom.window.document;
    assert.equal(doc.querySelectorAll(".skill-card").length, 4);
    assert.equal(doc.querySelectorAll(".skill-bar").length, 0);
    assert.ok(doc.querySelector(".profile-card"));
    assert.ok(doc.querySelector("#githubProfile"));
    assert.ok(doc.querySelector("#contributionPanel").hidden);
    assert.ok(doc.querySelector("#typedRole"));
    assert.equal(doc.querySelector("#principles"), null);
    assert.equal(doc.querySelector(".timeline"), null);
    assert.equal(doc.querySelector(".spotlight"), null);
  } finally { dom.window.close(); }
});

test("switching language retypes the page and honours reduced motion", async () => {
  let reduce = false;
  const dom = await openSite(false, (window) => {
    window.matchMedia = (query) => ({
      matches: query.includes("prefers-reduced-motion") ? reduce : true,
      addEventListener() {},
      removeEventListener() {},
    });
  });
  try {
    const { document } = dom.window;
    const dict = dom.window.i18n.dict;
    assert.equal(document.documentElement.lang, "es");
    dom.window.i18n.applyLang("en");
    const blocks = [...document.querySelectorAll("[data-i18n]")]
      .filter((element) => !element.closest("#typedRole, [data-content-language], [aria-live], .jg-loader"));
    assert.ok(blocks.length > 10, "the whole page is retyped");
    assert.ok(blocks.some((element) => element.textContent.trim() === ""), "text is wiped before it is rewritten");
    assert.ok(blocks.some((element) => element.getAttribute("aria-busy") === "true"), "typing marks the block busy");
    await new Promise((resolve) => setTimeout(resolve, 2400));
    const normalize = (value) => value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    for (const element of blocks) {
      const key = element.dataset.i18n;
      assert.equal(normalize(element.textContent), normalize(dict.en[key]), `${key} is fully retyped`);
      assert.equal(element.hasAttribute("aria-busy"), false, `${key} stops being busy`);
      assert.equal(element.style.minHeight, "", `${key} releases its reserved height`);
    }
    reduce = true;
    dom.window.i18n.applyLang("es");
    for (const selector of ['[data-i18n="hero.title"]', '[data-i18n="about.title"]', '[data-i18n="footer.tagline"]']) {
      const element = document.querySelector(selector);
      assert.equal(element.textContent.replace(/\s+/g, " ").trim(), normalize(dict.es[element.dataset.i18n]), `${selector} is instant with reduced motion`);
    }
    assert.equal(document.querySelectorAll('[data-i18n][aria-busy="true"]').length, 0, "reduced motion never starts typing");
  } finally { dom.window.close(); }
});
