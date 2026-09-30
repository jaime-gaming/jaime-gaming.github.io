/* Main interactions: nav, reveal animations, cursor glow, GitHub data */
(function () {
  const GH_USER = "jaime-gaming";

  /* ----- Year ----- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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
    });
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ----- Cursor glow ----- */
  const glow = document.querySelector(".cursor-glow");
  if (glow && matchMedia("(hover: hover)").matches) {
    window.addEventListener("mousemove", (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    });
  }

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

  async function loadGithub() {
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${GH_USER}`),
        fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`),
      ]);
      if (!userRes.ok || !reposRes.ok) throw new Error("GitHub API error");
      const user = await userRes.json();
      const repos = await reposRes.json();

      const publicRepos = Array.isArray(repos) ? repos.filter((r) => !r.fork) : [];
      const totalStars = publicRepos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

      const statRepos = document.getElementById("statRepos");
      const statStars = document.getElementById("statStars");
      const statFollowers = document.getElementById("statFollowers");
      if (statRepos) statRepos.textContent = numberFmt(user.public_repos ?? publicRepos.length);
      if (statStars) statStars.textContent = numberFmt(totalStars);
      if (statFollowers) statFollowers.textContent = numberFmt(user.followers ?? 0);

      renderProjects(
        publicRepos
          .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
          .slice(0, 6)
      );
    } catch (err) {
      console.warn("GitHub data unavailable:", err);
      renderProjects([]);
    }
  }

  function renderProjects(repos) {
    const grid = document.getElementById("projectsGrid");
    if (!grid) return;
    const lang = window.currentLang || "es";

    if (!repos.length) {
      grid.innerHTML = `<p class="section__sub">${window.i18n.dict[lang]["projects.empty"]}</p>`;
      return;
    }

    grid.innerHTML = repos
      .map((repo) => {
        const desc = repo.description ? escapeHtml(repo.description) : "—";
        return `
        <a class="project-card reveal in-view" href="${repo.html_url}" target="_blank" rel="noopener">
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
      const res = await fetch("https://api.lanyard.rest/v1/users/984083829767675965");
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
    const grid = document.getElementById("projectsGrid");
    if (grid && grid.querySelector(".section__sub")) loadGithub();
  });
})();
