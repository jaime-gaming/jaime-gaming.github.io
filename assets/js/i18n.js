/* Minimal i18n dictionary and switcher (ES / EN) */
(function () {
  const dict = {
    es: {
      "nav.home": "Inicio",
      "nav.projects": "Proyectos",
      "nav.blog": "Blog",
      "nav.contact": "Contacto",
      "nav.openMenu": "Abrir menú",
      "nav.closeMenu": "Cerrar menú",
      "aria.langSwitch": "Cambiar idioma",
      "aria.backToTop": "Volver arriba",
      "aria.socials": "Redes sociales",
      "social.github": "GitHub",
      "social.pineapple": "Pineapple",
      "social.discord": "Discord",
      "social.email": "Correo",
      "hero.eyebrow": "Hola, soy",
      "hero.subtitle": "Vibe-coder construyendo juegos y proyectos con HTML, y aprendiendo Python día a día.",
      "hero.ctaPrimary": "Ver proyectos",
      "hero.ctaSecondary": "Hablemos",
      "hero.scroll": "scroll",
      "badge.vibecoder": "Vibe-coder",
      "badge.gamedev": "Game Dev",
      "badge.ceo": "CEO @ Pineapple",
      "badge.learning": "Aprendiendo Python",
      "about.title": "Sobre mí",
      "about.text": "Soy un <strong>vibe-coder</strong> que busca programar cosas reales o simplemente seguir aprendiendo a programar. Actualmente soy CEO de <a href=\"https://github.com/PineappleVA\" target=\"_blank\" rel=\"noopener\">Pineapple</a>, y me encanta crear pequeños juegos que comparto con mis compañeros de escuela.",
      "about.statusLoading": "estado en vivo…",
      "timeline.html.title": "HTML, mi punto de partida",
      "timeline.html.desc": "Mi primer lenguaje, y el que sigo usando constantemente para crear juegos y pequeños proyectos.",
      "timeline.share.title": "Compartir con la comunidad",
      "timeline.share.desc": "Creo juegos sencillos que comparto con mis compañeros de escuela para que los prueben y me den feedback.",
      "timeline.python.title": "Ahora, Python",
      "timeline.python.desc": "Actualmente estoy aprendiendo este lenguaje para llevar mis proyectos un paso más allá.",
      "venture.title": "CEO de <span>Pineapple</span>",
      "venture.desc": "Mi propio proyecto/organización en GitHub. Échale un vistazo ↗",
      "skills.title": "Habilidades",
      "skills.html": "Mi primer lenguaje y el que sigo usando constantemente para juegos y proyectos.",
      "skills.python": "Actualmente estoy aprendiendo este lenguaje para ampliar mis proyectos.",
      "skills.gamesTitle": "Desarrollo de juegos",
      "skills.games": "Creo juegos sencillos que comparto con mis compañeros de escuela.",
      "projectsTeaser.title": "Proyectos recientes",
      "projectsTeaser.sub": "Actualizados automáticamente desde GitHub. Cada uno tiene su propia página.",
      "projectsTeaser.viewAll": "Ver todos los proyectos →",
      "projects.title": "Proyectos",
      "projects.sub": "Todos mis repositorios públicos, sincronizados en vivo desde GitHub. Cada uno tiene su propia página.",
      "projects.empty": "Aún no hay repositorios públicos para mostrar.",
      "projects.error": "No se pudieron cargar los proyectos ahora mismo.",
      "project.back": "Volver a proyectos",
      "project.stars": "estrellas",
      "project.forks": "forks",
      "project.updated": "Actualizado",
      "project.viewOnGithub": "Ver en GitHub",
      "project.liveDemo": "Ver demo",
      "notFound.title": "Página no encontrada",
      "notFound.sub": "Puede que el enlace esté roto o la página se haya movido.",
      "notFound.home": "Volver al inicio",
      "blog.title": "Blog",
      "blog.sub": "Notas y novedades sobre lo que estoy construyendo.",
      "blog.empty": "Todavía no hay posts. ¡Vuelve pronto!",
      "blog.back": "Volver al blog",
      "github.title": "Actividad en GitHub",
      "github.sub": "Se sincroniza en vivo con mi perfil.",
      "github.repos": "Repositorios",
      "github.stars": "Estrellas",
      "github.followers": "Seguidores",
      "contact.title": "Hablemos",
      "contact.text": "¿Tienes alguna pregunta o quieres colaborar? Escríbeme, siempre estoy abierto a nuevas ideas.",
      "footer.made": "Hecho con curiosidad y código.",
    },
    en: {
      "nav.home": "Home",
      "nav.projects": "Projects",
      "nav.blog": "Blog",
      "nav.contact": "Contact",
      "nav.openMenu": "Open menu",
      "nav.closeMenu": "Close menu",
      "aria.langSwitch": "Switch language",
      "aria.backToTop": "Back to top",
      "aria.socials": "Social media",
      "social.github": "GitHub",
      "social.pineapple": "Pineapple",
      "social.discord": "Discord",
      "social.email": "Email",
      "hero.eyebrow": "Hi, I'm",
      "hero.subtitle": "Vibe-coder building games and projects with HTML, learning Python along the way.",
      "hero.ctaPrimary": "View projects",
      "hero.ctaSecondary": "Let's talk",
      "hero.scroll": "scroll",
      "badge.vibecoder": "Vibe-coder",
      "badge.gamedev": "Game Dev",
      "badge.ceo": "CEO @ Pineapple",
      "badge.learning": "Learning Python",
      "about.title": "About me",
      "about.text": "I'm a <strong>vibe-coder</strong> looking to program real things or simply keep learning to code. I'm currently CEO of <a href=\"https://github.com/PineappleVA\" target=\"_blank\" rel=\"noopener\">Pineapple</a>, and I love creating small games that I share with my school friends.",
      "about.statusLoading": "live status…",
      "timeline.html.title": "HTML, my starting point",
      "timeline.html.desc": "My first language, and the one I still constantly use to build games and small projects.",
      "timeline.share.title": "Sharing with the community",
      "timeline.share.desc": "I create simple games that I share with my school friends so they can try them and give me feedback.",
      "timeline.python.title": "Now, Python",
      "timeline.python.desc": "I'm currently learning this language to take my projects one step further.",
      "venture.title": "CEO of <span>Pineapple</span>",
      "venture.desc": "My own project/organization on GitHub. Check it out ↗",
      "skills.title": "Skills",
      "skills.html": "My first language, and the one I still constantly use for games and projects.",
      "skills.python": "I'm currently learning this language to expand my projects.",
      "skills.gamesTitle": "Game Dev",
      "skills.games": "I create simple games that I share with my school friends.",
      "projectsTeaser.title": "Recent projects",
      "projectsTeaser.sub": "Automatically updated from GitHub. Each one has its own page.",
      "projectsTeaser.viewAll": "View all projects →",
      "projects.title": "Projects",
      "projects.sub": "All my public repositories, live-synced from GitHub. Each one has its own page.",
      "projects.empty": "No public repositories to show yet.",
      "projects.error": "Couldn't load projects right now.",
      "project.back": "Back to projects",
      "project.stars": "stars",
      "project.forks": "forks",
      "project.updated": "Updated",
      "project.viewOnGithub": "View on GitHub",
      "project.liveDemo": "Live demo",
      "notFound.title": "Page not found",
      "notFound.sub": "The link might be broken or the page may have moved.",
      "notFound.home": "Back to home",
      "blog.title": "Blog",
      "blog.sub": "Notes and updates about what I'm building.",
      "blog.empty": "No posts yet. Check back soon!",
      "blog.back": "Back to blog",
      "github.title": "GitHub activity",
      "github.sub": "Live-synced with my profile.",
      "github.repos": "Repositories",
      "github.stars": "Stars",
      "github.followers": "Followers",
      "contact.title": "Let's talk",
      "contact.text": "Got a question or want to collaborate? Reach out, I'm always open to new ideas.",
      "footer.made": "Made with curiosity and code.",
    },
  };

  function detectDefaultLang() {
    const saved = localStorage.getItem("lang");
    if (saved && dict[saved]) return saved;
    const nav = (navigator.language || "es").slice(0, 2);
    return dict[nav] ? nav : "en";
  }

  function applyLang(lang) {
    document.documentElement.setAttribute("lang", lang);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = dict[lang][key];
      if (value !== undefined) el.innerHTML = value;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      const value = dict[lang][key];
      if (value !== undefined) el.setAttribute("aria-label", value);
    });
    const switchBtn = document.getElementById("langSwitch");
    if (switchBtn) switchBtn.setAttribute("data-active", lang);
    localStorage.setItem("lang", lang);
    window.currentLang = lang;
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
  }

  window.i18n = { dict, applyLang, detectDefaultLang };

  document.addEventListener("DOMContentLoaded", () => {
    const initial = detectDefaultLang();
    applyLang(initial);

    const switchBtn = document.getElementById("langSwitch");
    if (switchBtn) {
      switchBtn.addEventListener("click", () => {
        const next = window.currentLang === "es" ? "en" : "es";
        applyLang(next);
      });
    }
  });
})();
