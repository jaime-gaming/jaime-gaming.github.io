/* Minimal i18n dictionary and switcher (ES / EN) */
(function () {
  const dict = {
    es: {
      "nav.about": "Sobre mí",
      "nav.skills": "Habilidades",
      "nav.projects": "Proyectos",
      "nav.github": "GitHub",
      "nav.contact": "Contacto",
      "hero.eyebrow": "Hola, soy",
      "hero.subtitle": "Vibe-coder construyendo juegos y proyectos con HTML, y aprendiendo Python día a día.",
      "hero.ctaPrimary": "Ver proyectos",
      "hero.scroll": "scroll",
      "about.title": "Sobre mí",
      "about.text": "Soy un <strong>vibe-coder</strong> que busca programar cosas reales o simplemente seguir aprendiendo a programar. Actualmente soy CEO de <a href=\"https://github.com/PineappleVA\" target=\"_blank\" rel=\"noopener\">Pineapple</a>, y me encanta crear pequeños juegos que comparto con mis compañeros de escuela.",
      "about.statusLoading": "estado en vivo…",
      "skills.title": "Habilidades",
      "skills.html": "Mi primer lenguaje y el que sigo usando constantemente para juegos y proyectos.",
      "skills.python": "Actualmente estoy aprendiendo este lenguaje para ampliar mis proyectos.",
      "skills.gamesTitle": "Desarrollo de juegos",
      "skills.games": "Creo juegos sencillos que comparto con mis compañeros de escuela.",
      "projects.title": "Proyectos",
      "projects.sub": "Actualizados automáticamente desde GitHub.",
      "projects.empty": "Aún no hay repositorios públicos para mostrar.",
      "projects.error": "No se pudieron cargar los proyectos ahora mismo.",
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
      "nav.about": "About",
      "nav.skills": "Skills",
      "nav.projects": "Projects",
      "nav.github": "GitHub",
      "nav.contact": "Contact",
      "hero.eyebrow": "Hi, I'm",
      "hero.subtitle": "Vibe-coder building games and projects with HTML, learning Python along the way.",
      "hero.ctaPrimary": "View projects",
      "hero.scroll": "scroll",
      "about.title": "About me",
      "about.text": "I'm a <strong>vibe-coder</strong> looking to program real things or simply keep learning to code. I'm currently CEO of <a href=\"https://github.com/PineappleVA\" target=\"_blank\" rel=\"noopener\">Pineapple</a>, and I love creating small games that I share with my school friends.",
      "about.statusLoading": "live status…",
      "skills.title": "Skills",
      "skills.html": "My first language, and the one I still constantly use for games and projects.",
      "skills.python": "I'm currently learning this language to expand my projects.",
      "skills.gamesTitle": "Game Dev",
      "skills.games": "I create simple games that I share with my school friends.",
      "projects.title": "Projects",
      "projects.sub": "Automatically updated from GitHub.",
      "projects.empty": "No public repositories to show yet.",
      "projects.error": "Couldn't load projects right now.",
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
