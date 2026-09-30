/* Main interactions: nav, reveal animations, cursor glow, GitHub data */
(function () {
  const GH_USER = "jaime-gaming";
  const DISCORD_USER_ID = "984083829767675965";
  const EMAIL = "jaimegamingpro@gmail.com";
  /* Dark-mode palette derived from the JAIME GAMING logo: lime-green + red.
     Read from the CSS custom properties (single source of truth in style.css)
     so the JS-generated GitHub image URLs stay in sync if the theme changes. */
  function cssVarHex(varName, fallback) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return value ? value.replace(/^#/, "") : fallback;
  }
  const ACCENT_HEX = cssVarHex("--accent", "c6e83f");
  const BG_HEX = cssVarHex("--bg", "0a0b07");

  /* ----- Year ----- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----- Set GitHub-derived image sources from single source of truth ----- */
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
  window.addEventListener("scroll", () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
  }, { passive: true });
  if (toTop) {
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ----- Mobile menu ----- */
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
      const lang = window.currentLang || "es";
      const key = open ? "nav.closeMenu" : "nav.openMenu";
      const label = (window.i18n && window.i18n.dict[lang][key]) || (open ? "Close menu" : "Open menu");
      burger.setAttribute("aria-label", label);
    });
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        const lang = window.currentLang || "es";
        burger.setAttribute("aria-label", (window.i18n && window.i18n.dict[lang]["nav.openMenu"]) || "Open menu");
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
     { id: "youtube", label: "YouTube", url: "https://youtube.com/@yourhandle", icon: ICONS.youtube } */
  const SOCIALS = [
    { id: "github", label: "GitHub", url: `https://github.com/${GH_USER}`, icon: ICONS.github },
    { id: "pineapple", label: "Pineapple", url: "https://github.com/PineappleVA", icon: ICONS.pineapple },
    { id: "discord", label: "Discord", url: `https://discord.com/users/${DISCORD_USER_ID}`, icon: ICONS.discord },
    { id: "email", label: "Email", url: `mailto:${EMAIL}`, icon: ICONS.mail },
  ].filter((s) => s.url);

  function renderSocials() {
    const hero = document.getElementById("heroSocials");
    const grid = document.getElementById("socialsGrid");
    const linkAttrs = (url) => (url.startsWith("mailto:") ? "" : ' target="_blank" rel="noopener"');

    if (hero) {
      hero.innerHTML = SOCIALS.map(
        (s) => `<a class="social-icon magnetic" href="${s.url}"${linkAttrs(s.url)} aria-label="${s.label}">${s.icon}</a>`
      ).join("");
    }
    if (grid) {
      grid.innerHTML = SOCIALS.map(
        (s) => `<a class="social-card" href="${s.url}"${linkAttrs(s.url)}>${s.icon}<span>${s.label}</span></a>`
      ).join("");
    }
  }
  renderSocials();

  /* ----- Tech marquee ----- */
  function renderMarquee() {
    const track = document.getElementById("marqueeTrack");
    if (!track) return;
    const lang = window.currentLang || "es";
    const items = (window.i18n.dict[lang] && window.i18n.dict[lang]["marquee.items"]) || [];
    const row = items.map((item) => `<span class="marquee__item">${item}<span class="dot-sep">•</span></span>`).join("");
    track.innerHTML = row + row; // duplicate for a seamless loop
  }
  renderMarquee();
  document.addEventListener("langchange", renderMarquee);

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

  /* ----- Cursor glow ----- */
  const glow = document.querySelector(".cursor-glow");
  const canHover = matchMedia("(hover: hover)").matches;
  if (glow && canHover) {
    window.addEventListener("mousemove", (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    });
  }

  /* ----- Magnetic buttons ----- */
  if (canHover) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0, 0)";
      });
    });
  }

  /* ----- Tilt effect on project cards (event-delegated for dynamic content) ----- */
  const projectsGridEl = document.getElementById("projectsGrid");
  if (projectsGridEl && canHover) {
    projectsGridEl.addEventListener("mousemove", (e) => {
      const card = e.target.closest(".project-card");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${py * -6}deg) rotateY(${px * 6}deg) translateY(-4px)`;
    });
    projectsGridEl.addEventListener(
      "mouseout",
      (e) => {
        const card = e.target.closest(".project-card");
        if (card && !card.contains(e.relatedTarget)) card.style.transform = "";
      },
      true
    );
  }

  /* ----- Stagger reveal delays within grouped containers ----- */
  const STAGGER_DELAY_MS = 90; // gap between each sibling's reveal so grids/lists animate in sequence
  document.querySelectorAll(".skills__grid, .timeline").forEach((container) => {
    Array.from(container.children).forEach((child, i) => {
      if (child.classList.contains("reveal")) child.style.setProperty("--delay", `${i * STAGGER_DELAY_MS}ms`);
    });
  });

  /* ----- Reveal on scroll ----- */
  const revealEls = document.querySelectorAll(".reveal");
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

  /* ----- GitHub live data (auto-updates on every page load) ----- */
  const numberFmt = (n) => new Intl.NumberFormat(document.documentElement.lang === "es" ? "es-ES" : "en-US").format(n);

  function animateCount(el, target) {
    if (!el) return;
    if (!canHover || matchMedia("(prefers-reduced-motion: reduce)").matches) {
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

  const GH_CACHE_KEY = `gh-cache-v1-${GH_USER}`;
  const GH_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  function readGithubCache() {
    try {
      const raw = localStorage.getItem(GH_CACHE_KEY);
      if (!raw) return null;
      const cached = JSON.parse(raw);
      if (!cached || typeof cached.timestamp !== "number") return null;
      if (Date.now() - cached.timestamp > GH_CACHE_TTL) return null;
      const { data } = cached;
      if (!data || typeof data.user !== "object" || data.user === null || !Array.isArray(data.repos)) return null;
      return data;
    } catch {
      return null;
    }
  }

  function writeGithubCache(data) {
    try {
      localStorage.setItem(GH_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
    } catch {
      /* ignore quota/storage errors */
    }
  }

  let lastRepos = [];

  async function loadGithub() {
    try {
      let data = readGithubCache();
      if (!data) {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GH_USER}`),
          fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`),
        ]);
        if (!userRes.ok || !reposRes.ok) throw new Error("GitHub API error");
        const user = await userRes.json();
        const repos = await reposRes.json();
        data = { user, repos };
        writeGithubCache(data);
      }

      const publicRepos = Array.isArray(data.repos) ? data.repos.filter((r) => !r.fork) : [];
      const totalStars = publicRepos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

      const statRepos = document.getElementById("statRepos");
      const statStars = document.getElementById("statStars");
      const statFollowers = document.getElementById("statFollowers");
      animateCount(statRepos, data.user.public_repos ?? publicRepos.length);
      animateCount(statStars, totalStars);
      animateCount(statFollowers, data.user.followers ?? 0);

      lastRepos = publicRepos
        .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
        .slice(0, 6);
      renderProjects(lastRepos);
    } catch (err) {
      console.warn("GitHub data unavailable:", err);
      lastRepos = [];
      renderProjects([], { error: true });
    }
  }

  let lastProjectsHadError = false;

  function renderProjects(repos, { error = false } = {}) {
    const grid = document.getElementById("projectsGrid");
    if (!grid) return;
    const lang = window.currentLang || "es";
    lastProjectsHadError = error;

    if (!repos.length) {
      const key = error ? "projects.error" : "projects.empty";
      grid.innerHTML = `<p class="section__sub">${window.i18n.dict[lang][key]}</p>`;
      return;
    }

    grid.innerHTML = repos
      .map((repo) => {
        const desc = repo.description ? escapeHtml(repo.description) : "—";
        return `
        <a class="project-card reveal in-view" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener">
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
      })
      .join("");
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
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

  loadGithub();
  loadLanyard();

  document.addEventListener("langchange", () => {
    renderProjects(lastRepos, { error: lastProjectsHadError });
    if (burger && mobileMenu) {
      const lang = window.currentLang || "es";
      const open = mobileMenu.classList.contains("open");
      const key = open ? "nav.closeMenu" : "nav.openMenu";
      const label = (window.i18n && window.i18n.dict[lang][key]) || (open ? "Close menu" : "Open menu");
      burger.setAttribute("aria-label", label);
    }
  });
})();
