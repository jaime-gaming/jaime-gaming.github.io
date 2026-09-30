/* Main interactions: nav, reveal animations, GitHub data, project pages */
(function () {
  const GH_USER = "jaime-gaming";
  const DISCORD_USER_ID = "984083829767675965";
  const EMAIL = "jaimegamingpro@gmail.com";
  /* Repos that shouldn't show up as "projects": the profile README repo and
     this portfolio site itself. */
  const EXCLUDED_REPOS = new Set(["jaime-gaming", "jaime-gaming.github.io"]);

  /* Theme colors, read from the CSS custom properties (single source of
     truth in style.css) so the JS-generated GitHub image URLs stay in sync
     if the palette changes.
     Note: the `<meta name="theme-color">` tag and assets/img/favicon.svg are
     static assets read before any script runs, so they can't pull from this
     computed value and must be kept in sync with --accent/--bg manually. */
  function cssVarHex(varName, fallback) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return value ? value.replace(/^#/, "") : fallback;
  }
  const ACCENT_HEX = cssVarHex("--accent", "c7dd5e");
  const BG_HEX = cssVarHex("--bg", "0b0b0c");

  const canHover = matchMedia("(hover: hover)").matches;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----- Year ----- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----- Set GitHub-derived image sources ----- */
  function setImgSrc(id, src) {
    const el = document.getElementById(id);
    if (el) el.src = src;
  }
  setImgSrc("avatarImg", `https://github.com/${GH_USER}.png`);
  setImgSrc("contribImg", `https://ghchart.rshah.org/${ACCENT_HEX}/${GH_USER}`);
  setImgSrc(
    "readmeStatsImg",
    `https://github-readme-stats.vercel.app/api?username=${GH_USER}&show_icons=true&hide_border=true&theme=dark&bg_color=${BG_HEX}&title_color=${ACCENT_HEX}&icon_color=${ACCENT_HEX}&text_color=c9c9d9`
  );
  setImgSrc(
    "streakStatsImg",
    `https://streak-stats.demolab.com/?user=${GH_USER}&hide_border=true&theme=dark&background=${BG_HEX}&ring=${ACCENT_HEX}&fire=${ACCENT_HEX}&currStreakLabel=${ACCENT_HEX}`
  );

  /* ----- Nav scrolled state + back to top ----- */
  const nav = document.querySelector(".nav");
  const toTop = document.getElementById("toTop");
  window.addEventListener(
    "scroll",
    () => {
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
    },
    { passive: true }
  );
  if (toTop) {
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ----- Mobile menu ----- */
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");

  function updateBurgerLabel(open) {
    if (!burger) return;
    const lang = window.currentLang || "es";
    const key = open ? "nav.closeMenu" : "nav.openMenu";
    const label = (window.i18n && window.i18n.dict[lang][key]) || (open ? "Close menu" : "Open menu");
    burger.setAttribute("aria-label", label);
  }

  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
      updateBurgerLabel(open);
    });
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        updateBurgerLabel(false);
      })
    );
  }

  /* ----- Socials (single source of truth, rendered into hero + contact) ----- */
  const ICONS = {
    github:
      '<svg viewBox="0 0 24 24"><path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.02 3.25 9.27 7.77 10.77.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.96-3.16.69-3.83-1.53-3.83-1.53-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.16a10.9 10.9 0 0 1 5.72 0c2.18-1.47 3.14-1.16 3.14-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.8 1.17 3.04 0 4.35-2.66 5.31-5.19 5.59.41.35.77 1.04.77 2.1 0 1.52-.01 2.74-.01 3.11 0 .3.2.66.79.55A10.53 10.53 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5Z"/></svg>',
    mail:
      '<svg viewBox="0 0 24 24"><path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5v-13Zm2.2.5 7.34 5.5a.75.75 0 0 0 .92 0L19.8 6H4.2Zm15.8 1.6-6.86 5.15a2.75 2.75 0 0 1-3.28 0L4 7.6V18h16V7.6Z"/></svg>',
    pineapple:
      '<svg viewBox="0 0 24 24"><path d="M12 2c.6 1 1.4 1.6 2.4 2-1 .3-1.8.9-2.4 1.8-.6-.9-1.4-1.5-2.4-1.8 1-.4 1.8-1 2.4-2Zm0 5c3.9 0 7 3.8 7 8.5S15.9 22 12 22s-7-2.8-7-6.5S8.1 7 12 7Zm-2.2 4.4c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0l1.8-1.8 1.8 1.8c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4L13.4 9.6c-.4-.4-1-.4-1.4 0l-2.2 1.8Z"/></svg>',
    discord:
      '<svg viewBox="0 0 24 24"><path d="M20.3 5.4A18 18 0 0 0 15.9 4c-.2.4-.5.9-.6 1.3a16.6 16.6 0 0 0-4.6 0A8.9 8.9 0 0 0 10 4a18 18 0 0 0-4.4 1.4C2.7 9.3 2 13 2.3 16.7a18 18 0 0 0 5.5 2.8c.4-.6.8-1.3 1.1-2a11.6 11.6 0 0 1-1.8-.9l.4-.3a12.9 12.9 0 0 0 9 0l.4.3c-.6.3-1.2.6-1.8.9.3.7.7 1.4 1.1 2a18 18 0 0 0 5.5-2.8c.4-4.3-.7-8-2.9-11.3ZM9.7 14.3c-.8 0-1.5-.8-1.5-1.7 0-1 .7-1.7 1.5-1.7.9 0 1.6.8 1.5 1.7 0 .9-.6 1.7-1.5 1.7Zm4.6 0c-.8 0-1.5-.8-1.5-1.7 0-1 .7-1.7 1.5-1.7.9 0 1.6.8 1.5 1.7 0 .9-.6 1.7-1.5 1.7Z"/></svg>',
  };

  /* To add more networks once you have handles, append objects here, e.g.
     { id: "youtube", labelKey: "social.youtube", url: "https://youtube.com/@yourhandle", icon: ICONS.youtube } */
  const SOCIALS = [
    { id: "github", labelKey: "social.github", url: `https://github.com/${GH_USER}`, icon: ICONS.github },
    { id: "pineapple", labelKey: "social.pineapple", url: "https://github.com/PineappleVA", icon: ICONS.pineapple },
    { id: "discord", labelKey: "social.discord", url: `https://discord.com/users/${DISCORD_USER_ID}`, icon: ICONS.discord },
    { id: "email", labelKey: "social.email", url: `mailto:${EMAIL}`, icon: ICONS.mail },
  ].filter((s) => s.url);

  function renderSocials() {
    const hero = document.getElementById("heroSocials");
    const grid = document.getElementById("socialsGrid");
    const linkAttrs = (url) => (url.startsWith("mailto:") ? "" : ' target="_blank" rel="noopener"');
    const lang = window.currentLang || "es";
    const labelFor = (s) => (window.i18n && window.i18n.dict[lang][s.labelKey]) || s.id;

    if (hero) {
      hero.innerHTML = SOCIALS.map(
        (s) => `<a class="social-icon" href="${s.url}"${linkAttrs(s.url)} aria-label="${labelFor(s)}">${s.icon}</a>`
      ).join("");
    }
    if (grid) {
      grid.innerHTML = SOCIALS.map(
        (s) => `<a class="social-card" href="${s.url}"${linkAttrs(s.url)}>${s.icon}<span>${labelFor(s)}</span></a>`
      ).join("");
    }
  }
  renderSocials();
  document.addEventListener("langchange", renderSocials);

  /* ----- Scroll progress bar ----- */
  const progressBar = document.getElementById("progressBar");
  function updateProgress() {
    if (!progressBar) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = `${pct}%`;
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ----- Stagger reveal delays within grouped containers ----- */
  const STAGGER_DELAY_MS = 90; // gap between each sibling's reveal so grids/lists animate in sequence
  document.querySelectorAll(".skills__grid, .timeline").forEach((container) => {
    Array.from(container.children).forEach((child, i) => {
      if (child.classList.contains("reveal")) child.style.setProperty("--delay", `${i * STAGGER_DELAY_MS}ms`);
    });
  });

  /* ----- Reveal on scroll ----- */
  function observeReveals(root = document) {
    const revealEls = root.querySelectorAll(".reveal:not(.in-view)");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            const bar = entry.target.querySelector(".skill-bar span");
            if (bar) bar.classList.add("animate");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  }
  observeReveals();

  /* ----- Small helpers ----- */
  const numberFmt = (n) => new Intl.NumberFormat(document.documentElement.lang === "es" ? "es-ES" : "en-US").format(n);

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function animateCount(el, target) {
    if (!el) return;
    if (!canHover || reducedMotion) {
      el.textContent = numberFmt(target);
      return;
    }
    const duration = 900;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = numberFmt(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ----- GitHub API cache (shared by the user+repos list fetch) ----- */
  const GH_CACHE_KEY = `gh-cache-v1-${GH_USER}`;
  const GH_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  function readCache(key, ttl, validate) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const cached = JSON.parse(raw);
      if (!cached || typeof cached.timestamp !== "number") return null;
      if (Date.now() - cached.timestamp > ttl) return null;
      if (!validate(cached.data)) return null;
      return cached.data;
    } catch {
      return null;
    }
  }

  function writeCache(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
    } catch {
      /* ignore quota/storage errors */
    }
  }

  function readGithubCache() {
    return readCache(
      GH_CACHE_KEY,
      GH_CACHE_TTL,
      (data) => data && typeof data.user === "object" && data.user !== null && Array.isArray(data.repos)
    );
  }

  async function fetchGithubProfile() {
    let data = readGithubCache();
    if (data) return data;
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GH_USER}`),
      fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`),
    ]);
    if (!userRes.ok || !reposRes.ok) throw new Error("GitHub API error");
    const user = await userRes.json();
    const repos = await reposRes.json();
    data = { user, repos };
    writeCache(GH_CACHE_KEY, data);
    return data;
  }

  function publicNonForkRepos(repos) {
    return Array.isArray(repos)
      ? repos.filter((r) => !r.fork && !EXCLUDED_REPOS.has(r.name.toLowerCase()))
      : [];
  }

  /* ----- Home page: live stats + featured projects ----- */
  let lastRepos = [];
  let lastProjectsHadError = false;

  async function loadGithub() {
    try {
      const data = await fetchGithubProfile();
      const repos = publicNonForkRepos(data.repos);
      const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

      animateCount(document.getElementById("statRepos"), data.user.public_repos ?? repos.length);
      animateCount(document.getElementById("statStars"), totalStars);
      animateCount(document.getElementById("statFollowers"), data.user.followers ?? 0);

      lastRepos = repos.slice().sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
      renderProjectsGrid(lastRepos);
    } catch (err) {
      console.warn("GitHub data unavailable:", err);
      lastRepos = [];
      renderProjectsGrid([], { error: true });
    }
  }

  function renderProjectsGrid(repos, { error = false } = {}) {
    const grid = document.getElementById("projectsGrid");
    if (!grid) return;
    const lang = window.currentLang || "es";
    lastProjectsHadError = error;

    const limit = Number(grid.dataset.limit) || 0;
    const list = limit ? repos.slice(0, limit) : repos;

    if (!list.length) {
      const key = error ? "projects.error" : "projects.empty";
      grid.innerHTML = `<p class="section__sub">${(window.i18n && window.i18n.dict[lang][key]) || ""}</p>`;
      return;
    }

    grid.innerHTML = list.map((repo) => projectCardHtml(repo)).join("");
    observeReveals(grid);
  }

  /* Intentionally simpler than scripts/build.mjs's slugify: GitHub repo names
     only allow alphanumerics, hyphens, underscores and dots (no spaces), and
     API repo lookups are case-insensitive, so lowercasing is enough to build
     a stable `/projects/<slug>/` URL that can be mapped straight back to the
     original repo name when fetching `api.github.com/repos/{user}/{slug}`. */
  function slugify(name) {
    return name.toLowerCase();
  }

  function projectCardHtml(repo) {
    const desc = repo.description ? escapeHtml(repo.description) : "—";
    return `
    <a class="project-card reveal" href="/projects/${slugify(repo.name)}/">
      <div class="project-card__top">
        <span class="project-card__name">${escapeHtml(repo.name)}</span>
        ${repo.language ? `<span class="project-card__lang">${escapeHtml(repo.language)}</span>` : ""}
      </div>
      <p class="project-card__desc">${desc}</p>
      <div class="project-card__meta">
        <span>★ ${repo.stargazers_count ?? 0}</span>
        <span>⑂ ${repo.forks_count ?? 0}</span>
      </div>
    </a>`;
  }

  /* ----- Project detail page (served through GitHub Pages' 404.html
     fallback so /projects/<repo>/ resolves to a real, shareable URL that's
     rendered live from the GitHub API — no rebuild needed for new repos) ----- */
  const PROJECT_PATH_RE = /^\/projects\/([^/]+)\/?$/;

  /* Tiny Markdown-lite renderer for README previews: headings, paragraphs,
     bold/italic, inline code, links, images, fenced code blocks and lists.
     Not a full CommonMark implementation, but covers typical READMEs
     without pulling in a client-side dependency. */
  function renderMarkdownLite(md) {
    const escaped = escapeHtml(md);
    const withCodeBlocks = escaped.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code.trim()}</code></pre>`);
    const lines = withCodeBlocks.split("\n");
    const out = [];
    let inList = false;
    let inCode = false;
    for (const line of lines) {
      if (line.startsWith("<pre>") || line.startsWith("</pre>") || inCode) {
        out.push(line);
        if (line.includes("<pre>")) inCode = true;
        if (line.includes("</pre>")) inCode = false;
        continue;
      }
      const heading = line.match(/^(#{1,3})\s+(.*)/);
      const listItem = line.match(/^[-*]\s+(.*)/);
      if (heading) {
        if (inList) { out.push("</ul>"); inList = false; }
        const level = heading[1].length;
        out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      } else if (listItem) {
        if (!inList) { out.push("<ul>"); inList = true; }
        out.push(`<li>${inline(listItem[1])}</li>`);
      } else if (line.trim() === "") {
        if (inList) { out.push("</ul>"); inList = false; }
      } else {
        if (inList) { out.push("</ul>"); inList = false; }
        out.push(`<p>${inline(line)}</p>`);
      }
    }
    if (inList) out.push("</ul>");
    return out.join("\n");

    function inline(text) {
      return text
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" loading="lazy" />')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>");
    }
  }

  async function loadProjectDetail(slug) {
    const section = document.getElementById("projectDetailSection");
    const notFound = document.getElementById("notFoundSection");
    const container = document.getElementById("projectDetail");
    if (!section || !container) return;

    try {
      const cacheKey = `gh-repo-v1-${GH_USER}-${slug}`;
      let repo = readCache(cacheKey, GH_CACHE_TTL, (d) => d && typeof d.name === "string");
      if (!repo) {
        const res = await fetch(`https://api.github.com/repos/${GH_USER}/${slug}`);
        if (!res.ok) throw new Error("not found");
        repo = await res.json();
        if (EXCLUDED_REPOS.has(repo.name.toLowerCase()) || repo.fork) throw new Error("excluded repo");
        writeCache(cacheKey, repo);
      }

      if (notFound) notFound.hidden = true;
      section.hidden = false;

      const lang = window.currentLang || "es";
      const dict = (window.i18n && window.i18n.dict[lang]) || {};
      const updated = new Date(repo.pushed_at).toLocaleDateString(lang === "en" ? "en-US" : "es-ES");

      const topicsHtml = Array.isArray(repo.topics) && repo.topics.length
        ? `<div class="project-card__topics reveal">${repo.topics.map((t) => `<span class="topic-tag">${escapeHtml(t)}</span>`).join("")}</div>`
        : "";

      container.innerHTML = `
        <div class="project-detail__head reveal">
          <h1 class="project-detail__name">${escapeHtml(repo.name)}</h1>
          <p class="project-detail__desc">${repo.description ? escapeHtml(repo.description) : ""}</p>
          <div class="project-detail__meta">
            ${repo.language ? `<span><strong>${escapeHtml(repo.language)}</strong></span>` : ""}
            <span>★ <strong>${repo.stargazers_count ?? 0}</strong> ${dict["project.stars"] || "stars"}</span>
            <span>⑂ <strong>${repo.forks_count ?? 0}</strong> ${dict["project.forks"] || "forks"}</span>
            <span>${dict["project.updated"] || "Updated"}: <strong>${updated}</strong></span>
          </div>
          ${topicsHtml}
          <div class="hero__cta" style="margin-top:1.5rem">
            <a class="btn btn--primary" href="${repo.html_url}" target="_blank" rel="noopener">${dict["project.viewOnGithub"] || "View on GitHub"}</a>
            ${repo.homepage ? `<a class="btn btn--ghost" href="${repo.homepage}" target="_blank" rel="noopener">${dict["project.liveDemo"] || "Live demo"}</a>` : ""}
          </div>
        </div>
        <div class="project-detail__readme reveal" id="projectReadme"></div>
      `;
      observeReveals(container);
      loadReadme(repo, document.getElementById("projectReadme"));
    } catch (err) {
      console.warn("Project not found:", err);
      section.hidden = true;
      if (notFound) notFound.hidden = false;
    }
  }

  async function loadReadme(repo, el) {
    if (!el) return;
    try {
      const branch = repo.default_branch || "main";
      const res = await fetch(`https://raw.githubusercontent.com/${GH_USER}/${repo.name}/${branch}/README.md`);
      if (!res.ok) throw new Error("no README");
      const text = await res.text();
      el.innerHTML = renderMarkdownLite(text);
    } catch {
      el.remove();
    }
  }

  /* ----- Discord/Lanyard live status (optional, best-effort) ----- */
  async function loadLanyard() {
    const statusEl = document.getElementById("lanyardStatus");
    if (!statusEl) return;
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
      if (!res.ok) throw new Error("Lanyard unavailable");
      const { data } = await res.json();
      const map = { online: "🟢 Online", idle: "🌙 Idle", dnd: "⛔ Do Not Disturb", offline: "⚫ Offline" };
      statusEl.innerHTML = `<span class="status-dot"></span><span>${map[data.discord_status] || data.discord_status}</span>`;
    } catch {
      statusEl.style.display = "none";
    }
  }

  /* ----- Page bootstrap ----- */
  if (document.getElementById("projectDetailSection")) {
    // 404.html doubles as the project-detail route
    const match = location.pathname.match(PROJECT_PATH_RE);
    if (match) {
      loadProjectDetail(decodeURIComponent(match[1]));
    }
  }

  if (document.getElementById("projectsGrid")) {
    loadGithub();
  }

  loadLanyard();

  document.addEventListener("langchange", () => {
    if (document.getElementById("projectsGrid")) renderProjectsGrid(lastRepos, { error: lastProjectsHadError });
    if (burger && mobileMenu) updateBurgerLabel(mobileMenu.classList.contains("open"));
  });
})();
