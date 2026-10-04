/* Lightweight interactions for navigation, GitHub data and live presence. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  const GH_USER = "jaime-gaming";
  const GH_ORG = "PineappleVA";
  const DISCORD_USER_ID = "984083829767675965";
  const EMAIL = "jaimegamingpro@gmail.com";
  const EXCLUDED_REPOS = new Set([
    "jaime-gaming/jaime-gaming",
    "jaime-gaming/jaime-gaming.github.io",
    "pineappleva/.github",
  ]);
  const GH_CACHE_KEY = `gh-cache-v2-${GH_USER}-${GH_ORG.toLowerCase()}`;
  const GH_CACHE_FRESH_MS = 5 * 60 * 1000;
  const GH_REFRESH_INTERVAL = 10 * 60 * 1000;
  const GH_MAX_STALE_MS = 7 * 24 * 60 * 60 * 1000;
  const CONTRIBUTION_CACHE_KEY = `contributions-v1-${GH_USER}`;
  const CONTRIBUTION_CACHE_TTL = 60 * 60 * 1000;
  const CONTRIBUTION_MAX_STALE = 7 * 24 * 60 * 60 * 1000;
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let reducedMotion = reducedMotionQuery.matches;

  const getLang = () => window.currentLang || document.documentElement.lang || "es";
  const locale = () => getLang() === "es" ? "es-ES" : "en-US";
  const numberFmt = (value) => new Intl.NumberFormat(locale()).format(value);

  function textFor(key, fallback = "") {
    const lang = getLang();
    return (window.i18n && window.i18n.dict[lang] && window.i18n.dict[lang][key]) || fallback;
  }

  function escapeHtml(value) {
    const element = document.createElement("div");
    element.textContent = String(value ?? "");
    return element.innerHTML.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function readCacheRecord(key, validate) {
    try {
      const record = JSON.parse(window.localStorage.getItem(key) || "null");
      if (!record || !Number.isFinite(record.timestamp) || !validate(record.data)) return null;
      return record;
    } catch {
      return null;
    }
  }

  function writeCache(key, data, timestamp = Date.now()) {
    const record = { timestamp, data };
    try {
      window.localStorage.setItem(key, JSON.stringify(record));
    } catch {
      // Storage is optional; the live page still works without it.
    }
    return record;
  }

  function formatDate(value, options = {}) {
    const date = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(date.getTime())) return "";
    return date.toLocaleDateString(locale(), options);
  }

  /* Keep the small pieces of page chrome out of the way. */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
  const avatar = document.getElementById("avatarImg");
  const avatarFallback = document.getElementById("avatarFallback");
  if (avatar) {
    avatar.addEventListener("load", () => { if (avatarFallback) avatarFallback.hidden = true; }, { once: true });
    avatar.addEventListener("error", () => {
      avatar.hidden = true;
      if (avatarFallback) avatarFallback.hidden = false;
    }, { once: true });
    avatar.src = `https://github.com/${GH_USER}.png?size=300`;
  }

  const nav = document.querySelector(".nav");
  const progressBar = document.getElementById("progressBar");
  const toTop = document.getElementById("toTop");
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  let scrollFrame = 0;

  function updateScrollChrome() {
    scrollFrame = 0;
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 18);
    if (progressBar) {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0;
      progressBar.style.setProperty("--progress", progress);
    }
  }

  function scheduleScrollUpdate() {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollChrome);
  }

  window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
  window.addEventListener("resize", scheduleScrollUpdate, { passive: true });
  updateScrollChrome();

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  function updateBurgerLabel(open) {
    if (!burger) return;
    const key = open ? "nav.closeMenu" : "nav.openMenu";
    burger.setAttribute("aria-label", textFor(key, open ? "Close menu" : "Open menu"));
  }

  function closeMobileMenu() {
    if (!burger || !mobileMenu) return;
    burger.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("open");
    updateBurgerLabel(false);
  }

  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      const open = burger.getAttribute("aria-expanded") !== "true";
      burger.setAttribute("aria-expanded", String(open));
      mobileMenu.classList.toggle("open", open);
      updateBurgerLabel(open);
    });
    mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobileMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
        closeMobileMenu();
        burger.focus();
      }
    });
    document.addEventListener("click", (event) => {
      if (burger.getAttribute("aria-expanded") === "true" && !burger.contains(event.target) && !mobileMenu.contains(event.target)) {
        closeMobileMenu();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMobileMenu();
    }, { passive: true });
  }

  /* Small social links; labels follow the selected language. */
  const ICONS = {
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.02 3.25 9.27 7.77 10.77.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.96-3.16.69-3.83-1.53-3.83-1.53-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.16a10.9 10.9 0 0 1 5.72 0c2.18-1.47 3.14-1.16 3.14-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.8 1.17 3.04 0 4.35-2.66 5.31-5.19 5.59.41.35.77 1.04.77 2.1 0 1.52-.01 2.74-.01 3.11 0 .3.2.66.79.55A10.53 10.53 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5v-13Zm2.2.5 7.34 5.5a.75.75 0 0 0 .92 0L19.8 6H4.2Zm15.8 1.6-6.86 5.15a2.75 2.75 0 0 1-3.28 0L4 7.6V18h16V7.6Z"/></svg>',
    pineapple: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c.6 1 1.4 1.6 2.4 2-1 .3-1.8.9-2.4 1.8-.6-.9-1.4-1.5-2.4-1.8 1-.4 1.8-1 2.4-2Zm0 5c3.9 0 7 3.8 7 8.5S15.9 22 12 22s-7-2.8-7-6.5S8.1 7 12 7Zm-2.2 4.4c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0l1.8-1.8 1.8 1.8c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4L13.4 9.6c-.4-.4-1-.4-1.4 0l-2.2 1.8Z"/></svg>',
    discord: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.3 5.4A18 18 0 0 0 15.9 4c-.2.4-.5.9-.6 1.3a16.6 16.6 0 0 0-4.6 0A8.9 8.9 0 0 0 10 4a18 18 0 0 0-4.4 1.4C2.7 9.3 2 13 2.3 16.7a18 18 0 0 0 5.5 2.8c.4-.6.8-1.3 1.1-2a11.6 11.6 0 0 1-1.8-.9l.4-.3a12.9 12.9 0 0 0 9 0l.4.3c-.6.3-1.2.6-1.8.9.3.7.7 1.4 1.1 2a18 18 0 0 0 5.5-2.8c.4-4.3-.7-8-2.9-11.3ZM9.7 14.3c-.8 0-1.5-.8-1.5-1.7 0-1 .7-1.7 1.5-1.7.9 0 1.6.8 1.5 1.7 0 .9-.6 1.7-1.5 1.7Zm4.6 0c-.8 0-1.5-.8-1.5-1.7 0-1 .7-1.7 1.5-1.7.9 0 1.6.8 1.5 1.7 0 .9-.6 1.7-1.5 1.7Z"/></svg>',
  };
  const SOCIALS = [
    { id: "github", labelKey: "social.github", url: `https://github.com/${GH_USER}`, icon: ICONS.github },
    { id: "pineapple", labelKey: "social.pineapple", url: `https://github.com/${GH_ORG}`, icon: ICONS.pineapple },
    { id: "discord", labelKey: "social.discord", url: `https://discord.com/users/${DISCORD_USER_ID}`, icon: ICONS.discord },
    { id: "email", labelKey: "social.email", url: `mailto:${EMAIL}`, icon: ICONS.mail },
  ];

  function renderSocials() {
    const hero = document.getElementById("heroSocials");
    const grid = document.getElementById("socialsGrid");
    const labelFor = (social) => escapeHtml(textFor(social.labelKey, social.id));
    const linkAttrs = (url) => url.startsWith("mailto:") ? "" : ' target="_blank" rel="noopener noreferrer"';
    if (hero) {
      hero.innerHTML = SOCIALS.map((social) =>
        `<a class="social-icon" href="${social.url}"${linkAttrs(social.url)} aria-label="${labelFor(social)}">${social.icon}</a>`
      ).join("");
    }
    if (grid) {
      grid.innerHTML = SOCIALS.map((social) =>
        `<a class="social-card reveal" href="${social.url}"${linkAttrs(social.url)} aria-label="${labelFor(social)}">${social.icon}<span>${labelFor(social)}</span></a>`
      ).join("");
      setStaggerDelays(grid);
      observeReveals(grid);
    }
  }

  /* Subtle reveal, with a visible fallback if motion preferences or JS differ. */
  let revealObserver = null;

  function setStaggerDelays(root = document) {
    const selectors = ".skills__grid, .timeline, .projects__grid, .socials__grid";
    const containers = [];
    if (root.matches && root.matches(selectors)) containers.push(root);
    containers.push(...root.querySelectorAll(selectors));
    containers.forEach((container) => {
      Array.from(container.children).forEach((child, index) => {
        if (child.classList.contains("reveal")) child.style.setProperty("--delay", `${Math.min(index, 6) * 75}ms`);
      });
    });
  }

  function bindSpotlights(root = document) {
    if (!finePointer || reducedMotion) return;
    const cards = [];
    if (root.matches && root.matches(".spotlight")) cards.push(root);
    cards.push(...root.querySelectorAll(".spotlight"));
    cards.forEach((card) => {
      if (card.dataset.spotlightBound === "true") return;
      card.dataset.spotlightBound = "true";
      card.addEventListener("pointermove", (event) => {
        if (reducedMotion) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
      }, { passive: true });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--pointer-x", "50%");
        card.style.setProperty("--pointer-y", "50%");
      }, { passive: true });
    });
  }

  function observeReveals(root = document) {
    const items = [];
    if (root.matches && root.matches(".reveal:not(.in-view)")) items.push(root);
    items.push(...root.querySelectorAll(".reveal:not(.in-view)"));
    if (reducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("in-view"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -2% 0px" });
    }
    items.forEach((item) => revealObserver.observe(item));
  }

  setStaggerDelays();
  observeReveals();
  bindSpotlights();
  renderSocials();

  const typedRole = document.getElementById("typedRole");
  let typeTimer = 0;
  let roleIndex = 0;
  let characterIndex = 0;
  let deletingRole = false;

  function startRoleRotation() {
    if (typeTimer) window.clearTimeout(typeTimer);
    typeTimer = 0;
    roleIndex = 0;
    characterIndex = 0;
    deletingRole = false;
    if (!typedRole) return;
    const roles = textFor("hero.roles", []);
    if (!Array.isArray(roles) || !roles.length) return;
    if (reducedMotion) {
      typedRole.textContent = roles[0];
      return;
    }
    function typeNextCharacter() {
      const role = roles[roleIndex % roles.length];
      characterIndex += deletingRole ? -1 : 1;
      typedRole.textContent = role.slice(0, characterIndex);
      let delay = deletingRole ? 34 : 52;
      if (!deletingRole && characterIndex >= role.length) {
        deletingRole = true;
        delay = 1500;
      } else if (deletingRole && characterIndex <= 0) {
        deletingRole = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 330;
      }
      typeTimer = window.setTimeout(typeNextCharacter, delay);
    }
    typedRole.textContent = "";
    typeTimer = window.setTimeout(typeNextCharacter, 180);
  }

  function animateSkillBars() {
    const bars = Array.from(document.querySelectorAll(".skill-bar span:not(.animate)"));
    if (!bars.length) return;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      bars.forEach((bar) => bar.classList.add("animate"));
      return;
    }
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("animate");
        instance.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    bars.forEach((bar) => observer.observe(bar));
  }

  startRoleRotation();
  animateSkillBars();

  function relativeTime(value) {
    const time = new Date(value).getTime();
    if (!Number.isFinite(time)) return "";
    const seconds = Math.round((time - Date.now()) / 1000);
    const distance = Math.abs(seconds);
    const formatter = new Intl.RelativeTimeFormat(locale(), { numeric: "auto" });
    if (distance < 60) return formatter.format(seconds, "second");
    if (distance < 3600) return formatter.format(Math.round(seconds / 60), "minute");
    if (distance < 86400) return formatter.format(Math.round(seconds / 3600), "hour");
    if (distance < 604800) return formatter.format(Math.round(seconds / 86400), "day");
    if (distance < 2629800) return formatter.format(Math.round(seconds / 604800), "week");
    if (distance < 31557600) return formatter.format(Math.round(seconds / 2629800), "month");
    return formatter.format(Math.round(seconds / 31557600), "year");
  }

  function updateRelativeTimes(root = document) {
    root.querySelectorAll("time[data-relative-time]").forEach((time) => {
      time.textContent = relativeTime(time.dateTime || time.getAttribute("datetime"));
    });
    root.querySelectorAll("time[data-calendar-time]").forEach((time) => {
      time.textContent = formatDate(time.dateTime || time.getAttribute("datetime"), { day: "numeric", month: "short", year: "numeric" });
    });
    const syncTime = document.getElementById("githubSyncTime");
    if (syncTime && lastSyncAt) {
      syncTime.dateTime = new Date(lastSyncAt).toISOString();
      syncTime.textContent = `${textFor("github.synced", "Synced")} ${relativeTime(lastSyncAt)}`;
      syncTime.title = formatDate(lastSyncAt, { day: "numeric", month: "short", year: "numeric" });
    }
  }

  /* GitHub public repositories from both the personal account and PineappleVA. */
  function isGithubSnapshot(data) {
    return Boolean(data && data.user && typeof data.user === "object" && Array.isArray(data.repos));
  }

  function getRepoOwner(repo) {
    return (repo && repo.owner && repo.owner.login) || String(repo && repo.full_name || "").split("/")[0] || GH_USER;
  }

  function repoFullName(repo) {
    return `${getRepoOwner(repo)}/${repo && repo.name || ""}`.toLowerCase();
  }

  function publicRepos(repos) {
    if (!Array.isArray(repos)) return [];
    const unique = new Map();
    repos.forEach((repo) => {
      if (!repo || !repo.name || repo.private) return;
      const fullName = repoFullName(repo);
      if (EXCLUDED_REPOS.has(fullName)) return;
      unique.set(fullName, repo);
    });
    return Array.from(unique.values()).sort((a, b) => {
      const aDate = new Date(a.pushed_at || a.updated_at || 0).getTime();
      const bDate = new Date(b.pushed_at || b.updated_at || 0).getTime();
      return bDate - aDate || String(a.name).localeCompare(String(b.name));
    });
  }

  let lastRepos = [];
  let lastProjectError = false;
  let lastGithubSnapshot = null;
  let lastSyncAt = 0;
  let githubSyncState = "loading";
  let githubRequest = null;
  const projectsGrid = document.getElementById("projectsGrid");
  const githubRefreshButton = document.getElementById("githubRefresh");

  function setGithubSyncState(state, timestamp = lastSyncAt) {
    githubSyncState = state;
    const sync = document.getElementById("githubSync");
    const label = document.getElementById("githubSyncLabel");
    const labels = {
      loading: "github.syncLoading",
      updating: "github.syncUpdating",
      fresh: "github.syncFresh",
      stale: "github.syncStale",
      offline: "github.syncOffline",
      error: "github.syncError",
    };
    if (sync) {
      sync.dataset.state = state;
      if (state === "loading" || state === "updating") sync.setAttribute("aria-busy", "true");
      else sync.removeAttribute("aria-busy");
    }
    if (label) label.textContent = textFor(labels[state] || labels.error, "GitHub sync status");
    if (timestamp) lastSyncAt = timestamp;
    updateRelativeTimes();
  }

  function projectCardHtml(repo) {
    const name = escapeHtml(repo.name || "Untitled project");
    const owner = getRepoOwner(repo);
    const description = repo.description
      ? escapeHtml(repo.description)
      : escapeHtml(textFor("projects.noDescription", "More details coming soon."));
    const language = repo.language ? `<span class="project-card__lang">${escapeHtml(repo.language)}</span>` : "";
    const fork = repo.fork ? `<span class="project-card__fork">${escapeHtml(textFor("github.forkLabel", "fork"))}</span>` : "";
    const date = repo.pushed_at || repo.updated_at;
    const isoDate = date && Number.isFinite(new Date(date).getTime()) ? new Date(date).toISOString() : "";
    const relativeDate = isoDate
      ? `<time class="project-card__updated" data-relative-time datetime="${escapeHtml(isoDate)}">${escapeHtml(relativeTime(isoDate))}</time>`
      : "";
    const path = `/projects/${encodeURIComponent(owner.toLowerCase())}/${encodeURIComponent(String(repo.name).toLowerCase())}/`;
    const label = `${repo.name || "Project"} (${owner}) — ${textFor("projects.open", "View project details")}`;

    return `<a class="project-card reveal spotlight" href="${path}" aria-label="${escapeHtml(label)}">
      <span class="project-card__top">
        <span class="project-card__source">${escapeHtml(owner)}${fork}</span>
        ${language}
      </span>
      <span class="project-card__name">${name}</span>
      <span class="project-card__desc">${description}</span>
      <span class="project-card__meta">
        <span>★ <strong>${numberFmt(Number(repo.stargazers_count) || 0)}</strong> ${escapeHtml(textFor("github.starsShort", "stars"))}</span>
        <span>⑂ <strong>${numberFmt(Number(repo.forks_count) || 0)}</strong> ${escapeHtml(textFor("github.forksShort", "forks"))}</span>
        ${relativeDate}
      </span>
      <span class="project-card__arrow" aria-hidden="true">↗</span>
    </a>`;
  }

  function renderProjectsGrid(repos, { error = false } = {}) {
    if (!projectsGrid) return;
    lastProjectError = error;
    const limit = Number(projectsGrid.dataset.limit) || 0;
    const list = limit ? repos.slice(0, limit) : repos;
    if (!list.length) {
      const key = error ? "projects.error" : "projects.empty";
      projectsGrid.innerHTML = `<p class="project-grid__message">${escapeHtml(textFor(key, ""))}</p>`;
      projectsGrid.setAttribute("aria-busy", "false");
      return;
    }
    projectsGrid.innerHTML = list.map(projectCardHtml).join("");
    projectsGrid.setAttribute("aria-busy", "false");
    setStaggerDelays(projectsGrid);
    observeReveals(projectsGrid);
    bindSpotlights(projectsGrid);
    updateRelativeTimes(projectsGrid);
  }

  const countAnimations = new WeakMap();

  function animateCount(element, target) {
    const endValue = Number(target);
    if (!element || !Number.isFinite(endValue)) return;
    const currentValue = Number(element.dataset.value);
    if (currentValue === endValue) {
      element.textContent = numberFmt(endValue);
      return;
    }
    const previousFrame = countAnimations.get(element);
    if (previousFrame) window.cancelAnimationFrame(previousFrame);
    element.dataset.value = String(endValue);
    if (reducedMotion) {
      element.textContent = numberFmt(endValue);
      return;
    }
    const startValue = Number.isFinite(currentValue) ? currentValue : 0;
    const startTime = performance.now();
    const duration = 760;
    const tick = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = numberFmt(Math.round(startValue + (endValue - startValue) * eased));
      if (progress < 1) {
        countAnimations.set(element, window.requestAnimationFrame(tick));
      } else {
        countAnimations.delete(element);
        element.classList.remove("is-updated");
        void element.offsetWidth;
        element.classList.add("is-updated");
        window.setTimeout(() => element.classList.remove("is-updated"), 500);
      }
    };
    countAnimations.set(element, window.requestAnimationFrame(tick));
  }

  function updateStats(snapshot) {
    const repos = publicRepos(snapshot.repos);
    const stars = repos.reduce((sum, repo) => sum + (Number(repo.stargazers_count) || 0), 0);
    const forks = repos.reduce((sum, repo) => sum + (Number(repo.forks_count) || 0), 0);
    const personalRepos = repos.filter((repo) => getRepoOwner(repo).toLowerCase() === GH_USER).length;
    const orgRepos = repos.filter((repo) => getRepoOwner(repo).toLowerCase() === GH_ORG.toLowerCase()).length;
    const languages = new Set(repos.map((repo) => repo.language).filter(Boolean)).size;
    const values = [
      ["statRepos", repos.length],
      ["statStars", stars],
      ["statFollowers", Number(snapshot.user.followers) || 0],
      ["statPersonalRepos", personalRepos],
      ["statOrgRepos", orgRepos],
      ["statForks", forks],
      ["statLanguages", languages],
    ];
    values.forEach(([id, value]) => animateCount(document.getElementById(id), value));
  }

  function applyGithubSnapshot(snapshot, timestamp = Date.now(), state = "fresh") {
    if (!isGithubSnapshot(snapshot)) return;
    lastGithubSnapshot = snapshot;
    lastSyncAt = timestamp;
    lastRepos = publicRepos(snapshot.repos);
    updateStats(snapshot);
    renderProjectsGrid(lastRepos);
    setGithubSyncState(state, timestamp);
  }

  async function fetchAllRepos(owner, options) {
    const route = owner.toLowerCase() === GH_USER ? "users" : "orgs";
    const repositories = [];
    let page = 1;
    let nextUrl = `https://api.github.com/${route}/${encodeURIComponent(owner)}/repos?per_page=100&sort=pushed&page=${page}`;

    while (nextUrl && page <= 20) {
      const response = await fetch(nextUrl, options);
      if (!response.ok) throw new Error(`GitHub repositories error (${response.status})`);
      const batch = await response.json();
      if (!Array.isArray(batch)) throw new Error("Unexpected GitHub repositories response");
      repositories.push(...batch);
      const linkHeader = response.headers && response.headers.get("Link");
      const nextLink = linkHeader && linkHeader.match(/<([^>]+)>;\s*rel="next"/);
      if (nextLink) {
        nextUrl = nextLink[1];
        page += 1;
      } else if (batch.length === 100) {
        page += 1;
        nextUrl = `https://api.github.com/${route}/${encodeURIComponent(owner)}/repos?per_page=100&sort=pushed&page=${page}`;
      } else {
        nextUrl = "";
      }
    }
    return repositories;
  }

  async function fetchGithubSnapshot() {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    const options = {
      cache: "no-store",
      headers: { Accept: "application/vnd.github+json" },
      signal: controller.signal,
    };
    try {
      const [userResponse, personalRepos, organizationRepos] = await Promise.all([
        fetch(`https://api.github.com/users/${GH_USER}`, options),
        fetchAllRepos(GH_USER, options),
        fetchAllRepos(GH_ORG, options),
      ]);
      if (!userResponse.ok) throw new Error(`GitHub profile error (${userResponse.status})`);
      const user = await userResponse.json();
      if (!user || typeof user !== "object") throw new Error("Unexpected GitHub profile response");
      return { user, repos: [...personalRepos, ...organizationRepos] };
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function refreshGithub({ force = false } = {}) {
    if (!projectsGrid) return null;
    if (githubRequest) return githubRequest;
    if (!force && lastSyncAt && Date.now() - lastSyncAt < GH_CACHE_FRESH_MS) return lastGithubSnapshot;
    if (!navigator.onLine) {
      if (lastGithubSnapshot) setGithubSyncState("offline", lastSyncAt);
      else {
        setGithubSyncState("error");
        renderProjectsGrid([], { error: true });
      }
      return null;
    }

    setGithubSyncState("updating", lastSyncAt);
    if (githubRefreshButton) {
      githubRefreshButton.disabled = true;
      githubRefreshButton.setAttribute("aria-busy", "true");
      const label = githubRefreshButton.querySelector("[data-i18n='github.refresh']");
      if (label) label.textContent = textFor("github.refreshing", "Updating…");
    }

    githubRequest = (async () => {
      try {
        const snapshot = await fetchGithubSnapshot();
        const record = writeCache(GH_CACHE_KEY, snapshot);
        applyGithubSnapshot(record.data, record.timestamp, "fresh");
        return snapshot;
      } catch (error) {
        console.warn("GitHub data unavailable:", error);
        if (lastGithubSnapshot) {
          setGithubSyncState(navigator.onLine ? "error" : "offline", lastSyncAt);
          renderProjectsGrid(lastRepos);
        } else {
          setGithubSyncState(navigator.onLine ? "error" : "offline");
          renderProjectsGrid([], { error: true });
        }
        return null;
      } finally {
        githubRequest = null;
        if (githubRefreshButton) {
          githubRefreshButton.disabled = false;
          githubRefreshButton.removeAttribute("aria-busy");
          const label = githubRefreshButton.querySelector("[data-i18n='github.refresh']");
          if (label) label.textContent = textFor("github.refresh", "Refresh");
        }
      }
    })();
    return githubRequest;
  }

  if (projectsGrid) {
    const cached = readCacheRecord(GH_CACHE_KEY, isGithubSnapshot);
    if (cached && Date.now() - cached.timestamp <= GH_MAX_STALE_MS) {
      const age = Date.now() - cached.timestamp;
      applyGithubSnapshot(cached.data, cached.timestamp, age <= GH_CACHE_FRESH_MS ? "fresh" : "stale");
      if (age > GH_CACHE_FRESH_MS) refreshGithub();
    } else {
      setGithubSyncState("loading");
      refreshGithub();
    }
    if (githubRefreshButton) githubRefreshButton.addEventListener("click", () => refreshGithub({ force: true }));
    window.setInterval(() => {
      if (document.visibilityState === "visible") refreshGithub({ force: true });
    }, GH_REFRESH_INTERVAL);
    window.addEventListener("online", () => refreshGithub({ force: true }));
    window.addEventListener("offline", () => {
      if (lastGithubSnapshot) setGithubSyncState("offline", lastSyncAt);
      else setGithubSyncState("error");
    });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && Date.now() - lastSyncAt > GH_CACHE_FRESH_MS) refreshGithub({ force: true });
    });
  }

  window.addEventListener("storage", (event) => {
    if (event.key !== GH_CACHE_KEY || !event.newValue) return;
    try {
      const record = JSON.parse(event.newValue);
      if (isGithubSnapshot(record.data) && record.timestamp > lastSyncAt) applyGithubSnapshot(record.data, record.timestamp, "fresh");
    } catch {
      // Ignore malformed cross-tab cache updates.
    }
  });

  /* A compact, keyboard- and touch-friendly contribution calendar. */
  const contributionCalendar = document.getElementById("contributionCalendar");
  const contributionTotal = document.getElementById("contributionTotal");
  const contributionDetail = document.getElementById("contributionDetail");
  const contributionMonths = document.getElementById("contributionMonths");
  const contributionWeekdays = document.getElementById("contributionWeekdays");
  let selectedContribution = null;
  let contributionRequest = null;

  function isContributionData(data) {
    return Boolean(data && Array.isArray(data.contributions) && data.contributions.length && data.contributions.every((item) => item && /^\d{4}-\d{2}-\d{2}$/.test(item.date)));
  }

  function contributionCountText(count) {
    if (count === 0) return textFor("github.contributionZero", "No contributions");
    if (count === 1) return textFor("github.contributionOne", "1 contribution");
    return textFor("github.contributionMany", "{count} contributions").replace("{count}", numberFmt(count));
  }

  function contributionDateLabel(value) {
    const date = new Date(`${value}T00:00:00Z`);
    return formatDate(date, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  }

  function describeContribution(day) {
    if (!day) return;
    const count = Math.max(0, Number(day.count) || 0);
    if (contributionDetail) contributionDetail.textContent = `${contributionDateLabel(day.date)} · ${contributionCountText(count)}`;
    selectedContribution = day;
  }

  function renderContributionCalendar(data) {
    if (!contributionCalendar) return;
    contributionCalendar.classList.remove("calendar__weeks--message");
    const days = data.contributions;
    const firstDate = new Date(`${days[0].date}T00:00:00Z`);
    const leadingDays = firstDate.getUTCDay();
    const cells = Array(leadingDays).fill(null).concat(days);
    while (cells.length % 7) cells.push(null);
    const weeks = [];
    for (let index = 0; index < cells.length; index += 7) weeks.push(cells.slice(index, index + 7));
    contributionCalendar.style.setProperty("--calendar-columns", weeks.length);

    if (contributionWeekdays) {
      const labels = getLang() === "es" ? ["D", "L", "M", "X", "J", "V", "S"] : ["S", "M", "T", "W", "T", "F", "S"];
      contributionWeekdays.innerHTML = labels.map((label) => `<span>${label}</span>`).join("");
    }

    if (contributionMonths) {
      const months = [];
      const seen = new Set();
      days.forEach((day, index) => {
        const key = day.date.slice(0, 7);
        if (seen.has(key)) return;
        seen.add(key);
        const weekIndex = Math.floor((leadingDays + index) / 7);
        if (months.some((month) => month.weekIndex === weekIndex)) return;
        const date = new Date(`${day.date}T00:00:00Z`);
        months.push({ weekIndex, label: date.toLocaleDateString(locale(), { month: "short", timeZone: "UTC" }) });
      });
      contributionMonths.style.setProperty("--calendar-columns", weeks.length);
      contributionMonths.innerHTML = months.map((month) => `<span style="grid-column:${month.weekIndex + 1}">${escapeHtml(month.label)}</span>`).join("");
    }

    contributionCalendar.innerHTML = weeks.map((week) => `<span class="calendar__week">${week.map((day) => {
      if (!day) return '<span class="calendar__day calendar__day--empty" aria-hidden="true"></span>';
      const count = Math.max(0, Number(day.count) || 0);
      const suppliedLevel = Number(day.level);
      const level = Number.isInteger(suppliedLevel) && suppliedLevel >= 0 && suppliedLevel <= 4
        ? suppliedLevel
        : count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4;
      const description = `${contributionDateLabel(day.date)} · ${contributionCountText(count)}`;
      return `<button class="calendar__day" type="button" data-date="${day.date}" data-count="${count}" data-level="${level}" aria-label="${escapeHtml(description)}" title="${escapeHtml(description)}" tabindex="-1"></button>`;
    }).join("")}</span>`).join("");

    const sum = days.reduce((total, day) => total + (Number(day.count) || 0), 0);
    const apiTotal = Number(data.total && data.total.lastYear);
    if (contributionTotal) contributionTotal.textContent = numberFmt(Number.isFinite(apiTotal) ? apiTotal : sum);
    const firstButton = contributionCalendar.querySelector(".calendar__day:not(.calendar__day--empty)");
    if (firstButton) firstButton.tabIndex = 0;
    if (contributionDetail && !selectedContribution) contributionDetail.textContent = textFor("github.calendarHover", "Hover over a day to see its contributions.");
    if (selectedContribution) describeContribution(selectedContribution);
  }

  function setContributionMessage(key) {
    if (!contributionCalendar) return;
    contributionCalendar.classList.add("calendar__weeks--message");
    contributionCalendar.innerHTML = `<p class="calendar__message" id="contributionMessage" data-i18n="${key}">${escapeHtml(textFor(key, "Contribution data is unavailable."))}</p>`;
    if (contributionTotal) contributionTotal.textContent = "—";
  }

  async function loadContributions({ force = false } = {}) {
    if (!contributionCalendar) return;
    if (contributionRequest) return contributionRequest;
    const cached = readCacheRecord(CONTRIBUTION_CACHE_KEY, isContributionData);
    const age = cached ? Date.now() - cached.timestamp : Infinity;
    if (!force && cached && age <= CONTRIBUTION_MAX_STALE) {
      renderContributionCalendar(cached.data);
      if (age <= CONTRIBUTION_CACHE_TTL) return;
    }
    if (!navigator.onLine) {
      if (!cached || age > CONTRIBUTION_MAX_STALE) setContributionMessage("github.calendarError");
      return;
    }

    contributionRequest = (async () => {
      try {
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`, { cache: "default", headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error(`Contribution API error (${response.status})`);
        const data = await response.json();
        if (!isContributionData(data)) throw new Error("Unexpected contribution data");
        writeCache(CONTRIBUTION_CACHE_KEY, data);
        renderContributionCalendar(data);
      } catch (error) {
        console.warn("Contribution data unavailable:", error);
        if (!cached || age > CONTRIBUTION_MAX_STALE) setContributionMessage("github.calendarError");
      } finally {
        contributionRequest = null;
      }
    })();
    return contributionRequest;
  }

  if (contributionCalendar) {
    contributionCalendar.addEventListener("pointerover", (event) => {
      const button = event.target.closest(".calendar__day[data-date]");
      if (button && contributionCalendar.contains(button)) describeContribution({ date: button.dataset.date, count: Number(button.dataset.count) });
    });
    contributionCalendar.addEventListener("focusin", (event) => {
      const button = event.target.closest(".calendar__day[data-date]");
      if (button) describeContribution({ date: button.dataset.date, count: Number(button.dataset.count) });
    });
    contributionCalendar.addEventListener("click", (event) => {
      const button = event.target.closest(".calendar__day[data-date]");
      if (button) describeContribution({ date: button.dataset.date, count: Number(button.dataset.count) });
    });
    contributionCalendar.addEventListener("keydown", (event) => {
      const moves = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 };
      const move = moves[event.key];
      if (!move) return;
      const buttons = Array.from(contributionCalendar.querySelectorAll(".calendar__day[data-date]"));
      const index = buttons.indexOf(event.target);
      const next = buttons[index + move];
      if (next) {
        event.preventDefault();
        next.focus();
      }
    });
    loadContributions();
  }

  /* Project details use the repository's actual owner, including org repos. */
  const PROJECT_PATH_RE = /^\/projects\/([^/]+)\/([^/]+)\/?$/;
  const LEGACY_PROJECT_PATH_RE = /^\/projects\/([^/]+)\/?$/;
  const projectDetailContainer = document.getElementById("projectDetail");
  const projectDetailSection = document.getElementById("projectDetailSection");
  const notFoundSection = document.getElementById("notFoundSection");

  function safeHttpUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
    } catch {
      return "";
    }
  }

  function renderMarkdownLite(markdown, baseUrl) {
    const escaped = escapeHtml(markdown);
    const lines = escaped.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code.trim()}</code></pre>`).split("\n");
    const output = [];
    let inList = false;
    let inCode = false;

    for (const line of lines) {
      if (line.startsWith("<pre>") || line.startsWith("</pre>") || inCode) {
        output.push(line);
        if (line.includes("<pre>")) inCode = true;
        if (line.includes("</pre>")) inCode = false;
        continue;
      }
      const heading = line.match(/^(#{1,3})\s+(.*)/);
      const listItem = line.match(/^[-*]\s+(.*)/);
      if (heading) {
        if (inList) { output.push("</ul>"); inList = false; }
        const level = heading[1].length;
        output.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      } else if (listItem) {
        if (!inList) { output.push("<ul>"); inList = true; }
        output.push(`<li>${inline(listItem[1])}</li>`);
      } else if (line.trim() === "") {
        if (inList) { output.push("</ul>"); inList = false; }
      } else {
        if (inList) { output.push("</ul>"); inList = false; }
        output.push(`<p>${inline(line)}</p>`);
      }
    }
    if (inList) output.push("</ul>");
    return output.join("\n");

    function safeMarkdownUrl(rawUrl) {
      const decoded = String(rawUrl).replace(/&amp;/g, "&").replace(/&#39;/g, "'").trim();
      try {
        const resolved = new URL(decoded, baseUrl);
        if (resolved.protocol !== "https:" && resolved.protocol !== "http:") return "";
        return escapeHtml(resolved.href);
      } catch {
        return "";
      }
    }

    function inline(value) {
      return value
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, rawUrl) => {
          const src = safeMarkdownUrl(rawUrl);
          return src ? `<img alt="${alt}" src="${src}" loading="lazy" />` : "";
        })
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, rawUrl) => {
          const href = safeMarkdownUrl(rawUrl);
          return href ? `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>` : label;
        })
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>");
    }
  }

  function renderProjectDetail(repo) {
    if (!projectDetailContainer || !projectDetailSection) return;
    const lang = getLang();
    const dict = (window.i18n && window.i18n.dict[lang]) || {};
    const owner = getRepoOwner(repo);
    const fullName = `${owner}/${repo.name}`;
    const pushedAt = repo.pushed_at && Number.isFinite(new Date(repo.pushed_at).getTime()) ? new Date(repo.pushed_at).toISOString() : "";
    const topics = Array.isArray(repo.topics) && repo.topics.length
      ? `<div class="project-detail__topics">${repo.topics.map((topic) => `<span class="topic-tag">${escapeHtml(topic)}</span>`).join("")}</div>`
      : "";
    const githubUrl = safeHttpUrl(repo.html_url);
    const homepage = safeHttpUrl(repo.homepage);
    const forkLabel = repo.fork ? `<span class="project-detail__fork" data-i18n="github.forkLabel">${escapeHtml(dict["github.forkLabel"] || "fork")}</span>` : "";

    if (notFoundSection) notFoundSection.hidden = true;
    projectDetailSection.hidden = false;
    projectDetailContainer.innerHTML = `<div class="project-detail__head reveal">
      <p class="project-detail__owner">${escapeHtml(fullName)} ${forkLabel}</p>
      <h1 class="project-detail__name">${escapeHtml(repo.name)}</h1>
      <p class="project-detail__desc">${repo.description ? escapeHtml(repo.description) : ""}</p>
      <div class="project-detail__meta">
        ${repo.language ? `<span>${escapeHtml(repo.language)}</span>` : ""}
        <span>★ <strong>${numberFmt(Number(repo.stargazers_count) || 0)}</strong> <span data-i18n="project.stars">${escapeHtml(dict["project.stars"] || "stars")}</span></span>
        <span>⑂ <strong>${numberFmt(Number(repo.forks_count) || 0)}</strong> <span data-i18n="project.forks">${escapeHtml(dict["project.forks"] || "forks")}</span></span>
        ${pushedAt ? `<span><span data-i18n="project.updated">${escapeHtml(dict["project.updated"] || "Updated")}</span> <time data-calendar-time datetime="${pushedAt}">${escapeHtml(formatDate(pushedAt, { day: "numeric", month: "short", year: "numeric" }))}</time></span>` : ""}
      </div>
      ${topics}
      <div class="project-detail__actions">
        ${githubUrl ? `<a class="btn btn--primary" href="${escapeHtml(githubUrl)}" target="_blank" rel="noopener noreferrer"><span data-i18n="project.viewOnGithub">${escapeHtml(dict["project.viewOnGithub"] || "View on GitHub")}</span> ↗</a>` : ""}
        ${homepage ? `<a class="btn btn--ghost" href="${escapeHtml(homepage)}" target="_blank" rel="noopener noreferrer"><span data-i18n="project.liveDemo">${escapeHtml(dict["project.liveDemo"] || "Open project")}</span> ↗</a>` : ""}
      </div>
    </div><div class="project-detail__readme reveal" id="projectReadme"></div>`;
    observeReveals(projectDetailContainer);
    updateRelativeTimes(projectDetailContainer);
    loadReadme(repo, document.getElementById("projectReadme"));
  }

  async function loadProjectDetail(owner, name) {
    if (!projectDetailContainer || !projectDetailSection) return;
    try {
      const ownerKey = owner.toLowerCase();
      const nameKey = name.toLowerCase();
      const cacheKey = `gh-repo-v2-${ownerKey}-${nameKey}`;
      const cached = readCacheRecord(cacheKey, (data) => data && typeof data.name === "string");
      let repo = null;
      if (cached && Date.now() - cached.timestamp <= GH_CACHE_FRESH_MS) {
        repo = cached.data;
      } else {
        try {
          const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`, { cache: "no-store", headers: { Accept: "application/vnd.github+json" } });
          if (!response.ok) {
            const error = new Error("Repository request failed");
            error.status = response.status;
            throw error;
          }
          repo = await response.json();
          if (!repo || EXCLUDED_REPOS.has(repoFullName(repo)) || repo.private) {
            const error = new Error("Repository is unavailable");
            error.code = "not-found";
            throw error;
          }
          writeCache(cacheKey, repo);
        } catch (error) {
          const cachedRepo = cached && cached.data;
          const cacheAge = cached ? Date.now() - cached.timestamp : Infinity;
          if (error.code !== "not-found" && error.status !== 404 && cachedRepo && cacheAge <= GH_MAX_STALE_MS && !cachedRepo.private && !EXCLUDED_REPOS.has(repoFullName(cachedRepo))) {
            repo = cachedRepo;
          } else {
            throw error;
          }
        }
      }
      renderProjectDetail(repo);
    } catch (error) {
      console.warn("Project detail unavailable:", error);
      projectDetailSection.hidden = true;
      if (notFoundSection) notFoundSection.hidden = false;
      const title = document.getElementById("notFoundTitle");
      const message = document.getElementById("notFoundMessage");
      const missing = error.code === "not-found" || error.status === 404;
      if (title && message) {
        const titleKey = missing ? "notFound.title" : "project.loadErrorTitle";
        const messageKey = missing ? "notFound.sub" : "project.loadErrorSub";
        title.setAttribute("data-i18n", titleKey);
        message.setAttribute("data-i18n", messageKey);
        title.textContent = textFor(titleKey, missing ? "Page not found" : "Project temporarily unavailable");
        message.textContent = textFor(messageKey, missing ? "The project could not be found." : "GitHub could not be reached right now.");
      }
    }
  }

  async function loadReadme(repo, element) {
    if (!element) return;
    const owner = getRepoOwner(repo);
    const branch = repo.default_branch || "main";
    const baseUrl = `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo.name)}/${encodeURIComponent(branch)}/`;
    try {
      const response = await fetch(`${baseUrl}README.md`, { cache: "default" });
      if (!response.ok) throw new Error("No README available");
      element.innerHTML = renderMarkdownLite(await response.text(), baseUrl);
      observeReveals(element);
    } catch {
      const githubUrl = safeHttpUrl(repo.html_url);
      const branchPath = String(branch).split("/").map(encodeURIComponent).join("/");
      const readmeUrl = githubUrl ? safeHttpUrl(`${githubUrl.replace(/\/$/, "")}/blob/${branchPath}/README.md`) : "";
      const message = escapeHtml(textFor("project.readmeUnavailable", "README preview is unavailable."));
      const link = readmeUrl
        ? ` <a href="${escapeHtml(readmeUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(textFor("project.readmeOnGithub", "Open it on GitHub"))} ↗</a>`
        : "";
      element.innerHTML = `<p class="project-detail__readme-fallback">${message}${link}</p>`;
    }
  }

  const projectRoute = location.pathname.match(PROJECT_PATH_RE);
  const legacyProjectRoute = !projectRoute && location.pathname.match(LEGACY_PROJECT_PATH_RE);
  if (projectRoute && projectDetailSection) {
    try {
      loadProjectDetail(decodeURIComponent(projectRoute[1]), decodeURIComponent(projectRoute[2]));
    } catch {
      if (notFoundSection) notFoundSection.hidden = false;
    }
  } else if (legacyProjectRoute && projectDetailSection) {
    try {
      loadProjectDetail(GH_USER, decodeURIComponent(legacyProjectRoute[1]));
    } catch {
      if (notFoundSection) notFoundSection.hidden = false;
    }
  }

  /* Discord presence via Lanyard's public REST endpoint and WebSocket. */
  const presenceElement = document.getElementById("lanyardStatus");
  const presenceLabel = presenceElement && presenceElement.querySelector("[data-presence-label]");
  const presenceActivity = presenceElement && presenceElement.querySelector("[data-presence-activity]");
  const presenceUrl = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;
  let lastPresence = null;
  let lastPresenceAt = 0;
  let presenceSocket = null;
  let presenceHeartbeat = 0;
  let presenceReconnectTimer = 0;
  let presenceReconnectDelay = 1000;

  function setPresenceConnection(state) {
    if (!presenceElement) return;
    presenceElement.dataset.connection = state;
    if (lastPresence) return;
    const key = state === "reconnecting" ? "discord.reconnecting" : state === "offline" ? "discord.unavailable" : "discord.connecting";
    if (presenceLabel) presenceLabel.textContent = textFor(key, "Connecting to Discord…");
    if (presenceActivity) {
      presenceActivity.hidden = true;
      presenceActivity.textContent = "";
    }
    presenceElement.dataset.status = state === "offline" ? "offline" : "loading";
  }

  function normalizePresence(data) {
    if (data && data.discord_status) return data;
    if (data && data[DISCORD_USER_ID] && data[DISCORD_USER_ID].discord_status) return data[DISCORD_USER_ID];
    return null;
  }

  function activityDescription(data) {
    if (data && data.listening_to_spotify && data.spotify) {
      const spotify = data.spotify;
      return { title: `${textFor("discord.listening", "Listening to")} ${spotify.song || "Spotify"}`, details: [spotify.artist, spotify.album].filter(Boolean).join(" · ") };
    }
    const activities = Array.isArray(data && data.activities) ? data.activities : [];
    const activity = activities.find((item) => item && item.type !== 4) || activities.find(Boolean);
    if (!activity) return null;
    let title = activity.name || "";
    if (activity.type === 0 && title) title = `${textFor("discord.playing", "Playing")} ${title}`;
    else if (activity.type === 1 && title) title = `${textFor("discord.streaming", "Streaming")} ${title}`;
    const details = activity.details || activity.state || "";
    return title || details ? { title, details } : null;
  }

  function renderPresence(data, { localized = false } = {}) {
    if (!presenceElement || !data) return;
    if (!localized) {
      lastPresence = data;
      lastPresenceAt = Date.now();
    }
    const status = ["online", "idle", "dnd", "offline"].includes(data.discord_status) ? data.discord_status : "offline";
    const activity = activityDescription(data);
    if (presenceLabel) presenceLabel.textContent = textFor(`discord.${status}`, status);
    if (presenceActivity) {
      presenceActivity.textContent = activity ? [activity.title, activity.details].filter(Boolean).join(" · ") : "";
      presenceActivity.hidden = !presenceActivity.textContent;
    }
    presenceElement.dataset.status = status;
    presenceElement.setAttribute("aria-label", [textFor(`discord.${status}`, status), activity && activity.title, activity && activity.details].filter(Boolean).join(". "));
  }

  async function fetchPresenceSnapshot() {
    if (!presenceElement || !navigator.onLine) return;
    try {
      const response = await fetch(presenceUrl, { cache: "no-store" });
      if (!response.ok) throw new Error("Presence endpoint unavailable");
      const result = await response.json();
      const presence = normalizePresence(result && result.data);
      if (presence) renderPresence(presence);
    } catch {
      if (!lastPresence) setPresenceConnection("reconnecting");
    }
  }

  function clearPresenceTimers() {
    if (presenceHeartbeat) window.clearInterval(presenceHeartbeat);
    if (presenceReconnectTimer) window.clearTimeout(presenceReconnectTimer);
    presenceHeartbeat = 0;
    presenceReconnectTimer = 0;
  }

  function schedulePresenceReconnect() {
    if (presenceReconnectTimer || document.visibilityState === "hidden" || !navigator.onLine) return;
    setPresenceConnection("reconnecting");
    const delay = Math.min(30000, presenceReconnectDelay) + Math.round(Math.random() * 450);
    presenceReconnectDelay = Math.min(30000, Math.round(presenceReconnectDelay * 1.8));
    presenceReconnectTimer = window.setTimeout(() => {
      presenceReconnectTimer = 0;
      connectPresenceSocket();
    }, delay);
  }

  function connectPresenceSocket() {
    if (!presenceElement || document.visibilityState === "hidden") return;
    if (!navigator.onLine) {
      setPresenceConnection("offline");
      return;
    }
    if (!window.WebSocket) {
      setPresenceConnection(lastPresence ? "reconnecting" : "offline");
      return;
    }
    if (presenceSocket && [WebSocket.OPEN, WebSocket.CONNECTING].includes(presenceSocket.readyState)) return;
    clearPresenceTimers();
    setPresenceConnection(lastPresence ? "reconnecting" : "connecting");
    let socket;
    try {
      socket = new WebSocket("wss://api.lanyard.rest/socket");
    } catch {
      schedulePresenceReconnect();
      return;
    }
    presenceSocket = socket;
    socket.addEventListener("open", () => {
      presenceReconnectDelay = 1000;
      presenceElement.dataset.connection = "connecting";
    });
    socket.addEventListener("message", (event) => {
      let message;
      try { message = JSON.parse(event.data); } catch { return; }
      if (message.op === 1 && message.d && Number(message.d.heartbeat_interval) > 0) {
        if (presenceHeartbeat) window.clearInterval(presenceHeartbeat);
        presenceHeartbeat = window.setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ op: 3 }));
        }, Number(message.d.heartbeat_interval));
        if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_USER_ID } }));
        return;
      }
      if (message.op === 0 && message.d) {
        const presence = normalizePresence(message.d);
        if (presence) renderPresence(presence);
      }
    });
    socket.addEventListener("close", () => {
      if (presenceSocket === socket) presenceSocket = null;
      if (presenceHeartbeat) window.clearInterval(presenceHeartbeat);
      presenceHeartbeat = 0;
      schedulePresenceReconnect();
    });
  }

  function stopPresenceSocket() {
    clearPresenceTimers();
    const socket = presenceSocket;
    presenceSocket = null;
    if (socket && socket.readyState < WebSocket.CLOSING) socket.close(1000, "Page hidden");
  }

  if (presenceElement) {
    setPresenceConnection("connecting");
    fetchPresenceSnapshot();
    connectPresenceSocket();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") stopPresenceSocket();
      else {
        if (Date.now() - lastPresenceAt > 60000) fetchPresenceSnapshot();
        connectPresenceSocket();
      }
    });
    window.addEventListener("online", () => { fetchPresenceSnapshot(); connectPresenceSocket(); });
    window.addEventListener("offline", () => { stopPresenceSocket(); setPresenceConnection("offline"); });
  }

  document.addEventListener("langchange", () => {
    const open = burger && burger.getAttribute("aria-expanded") === "true";
    if (burger) updateBurgerLabel(open);
    renderSocials();
    startRoleRotation();
    if (lastPresence) renderPresence(lastPresence, { localized: true });
    if (lastGithubSnapshot && projectsGrid) {
      updateStats(lastGithubSnapshot);
      renderProjectsGrid(lastRepos, { error: lastProjectError });
      setGithubSyncState(githubSyncState, lastSyncAt);
    } else if (projectsGrid && lastProjectError) renderProjectsGrid([], { error: true });
    if (githubRefreshButton) {
      const label = githubRefreshButton.querySelector("[data-i18n='github.refresh']");
      if (label) label.textContent = textFor(githubRefreshButton.disabled ? "github.refreshing" : "github.refresh", "Refresh");
    }
    if (contributionCalendar) {
      const cached = readCacheRecord(CONTRIBUTION_CACHE_KEY, isContributionData);
      if (cached && Date.now() - cached.timestamp <= CONTRIBUTION_MAX_STALE) renderContributionCalendar(cached.data);
    }
    updateRelativeTimes();
  });

  reducedMotionQuery.addEventListener?.("change", (event) => {
    reducedMotion = event.matches;
    if (reducedMotion) observeReveals();
    else bindSpotlights();
    startRoleRotation();
    animateSkillBars();
  });

  updateRelativeTimes();
  window.setInterval(updateRelativeTimes, 60000);
})();
