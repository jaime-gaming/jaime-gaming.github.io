(function () {
  const dict = {
    es: {
      "nav.home": "Inicio",
      "nav.projects": "Proyectos",
      "nav.blog": "Blog",
      "nav.docs": "Docs",
      "nav.contact": "Contacto",
      "nav.openMenu": "Abrir menú",
      "nav.closeMenu": "Cerrar menú",
      "aria.langSwitch": "Español. Cambiar a inglés",
      "aria.homeLogo": "Jaime Gaming — inicio",
      "aria.mainNav": "Navegación principal",
      "aria.backToTop": "Volver arriba",
      "aria.socials": "Redes sociales",
      "aria.interests": "Áreas de interés",
      "aria.profileCard": "Perfil de Jaime Gaming",
      "aria.skipToContent": "Saltar al contenido",
      "social.github": "GitHub",
      "social.discord": "Discord",
      "social.email": "Correo electrónico",

      "hero.title": "Hola, soy <span class=\"hero__title-accent\">Jaime Gaming</span>",
      "hero.subtitle": "Creo juegos para navegador, aplicaciones web y vídeos. En esta página reúno mis proyectos, el código que publico y las novedades de su desarrollo.",
      "hero.current": "EN EL CÓDIGO",
      "hero.roles": ["Programando algún juego", "Desarrollando una herramienta web", "Revisando el código de mis proyectos", "Preparando cambios para esta web", "Trabajando en nuevas funciones", "Probando una interfaz", "Documentando un proyecto", "Explorando nuevas ideas", "Organizando mis repositorios", "Mejorando la experiencia en móvil"],
      "hero.ctaPrimary": "Ver proyectos",
      "hero.ctaSecondary": "Contacto",
      "hero.visualCaption": "También me encontrarás por YouTube.",
      "hero.scroll": "SOBRE MÍ",
      "profile.label": "@jaime-gaming",
      "profile.kicker": "JUEGOS, WEBS Y VÍDEOS",
      "profile.footer": "Ver mi canal de YouTube",

      "about.title": "Sobre mí",
      "about.sub": "Programación, juegos y creación de contenido.",
      "about.text": "Soy Jaime Gaming, programador y creador de contenido. Empecé con HTML y con juegos que compartía con mis compañeros de clase. Desde entonces he ido ampliando mis proyectos: además de juegos, desarrollo aplicaciones y herramientas web. También soy fundador de <a href=\"https://github.com/PineappleVA\" target=\"_blank\" rel=\"noopener noreferrer\">Pineapple</a>.",
      "about.statusLoading": "Conectando con Discord…",
      "about.cardLabel": "EN GITHUB",
      "about.cardTitle": "@jaime-gaming",
      "about.cardText": "Repositorios públicos, código fuente y documentación de los proyectos.",
      "about.cardStamp": "IR A MI GITHUB ↗",

      "skills.title": "Lo que uso",
      "skills.sub": "Las tecnologías que utilizo y las que estoy incorporando a mis proyectos.",
      "skills.html": "Mi punto de partida. Lo utilizo para estructurar páginas, interfaces y juegos para navegador.",
      "skills.python": "Lo estoy aprendiendo mediante proyectos y pruebas. En GitHub comparto también mis repositorios escritos en Python.",
      "skills.gamesTitle": "Desarrollo de juegos",
      "skills.games": "Diseñar una mecánica, probarla y mejorarla con los comentarios que recibo.",

      "projectsTeaser.title": "Proyectos",
      "projectsTeaser.sub": "Lo último que he subido a GitHub.",
      "projectsTeaser.viewAll": "Ver todos los proyectos →",
      "projectsPage.eyebrow": "GitHub",
      "projectsPage.title": "Mis proyectos",
      "projectsPage.sub": "Juegos, aplicaciones y herramientas que publico en GitHub. Cada proyecto incluye su descripción, documentación y enlaces al código o a la aplicación cuando están disponibles.",
      "projects.noDescription": "Sin descripción en GitHub. Dentro tienes el código y su README, si lo hay.",
      "projects.empty": "No hay repositorios públicos para mostrar.",
      "projects.error": "No se pudieron cargar los proyectos. Inténtalo de nuevo más tarde.",
      "projects.open": "Ver detalles del proyecto",
      "project.back": "Volver a proyectos",
      "project.stars": "estrellas",
      "project.forks": "forks",
      "project.updated": "Actualizado",
      "project.viewOnGithub": "Ver en GitHub",
      "project.liveDemo": "Abrir proyecto",
      "project.readmeUnavailable": "No se ha podido cargar la vista previa del README.",
      "project.readmeOnGithub": "Abrir en GitHub",
      "project.loadErrorTitle": "Proyecto temporalmente no disponible",
      "project.loadErrorSub": "No se ha podido conectar con GitHub. Inténtalo de nuevo dentro de un momento.",
      "notFound.title": "Página no encontrada",
      "notFound.sub": "Puede que el enlace esté roto o la página se haya movido.",
      "notFound.home": "Volver al inicio",

      "github.title": "GitHub",
      "github.sub": "Datos públicos de mi cuenta.",
      "github.repos": "Repos de proyectos",
      "github.stars": "Estrellas en proyectos",
      "github.followers": "Seguidores",
      "github.syncLoading": "Conectando con GitHub…",
      "github.syncUpdating": "Actualizando repositorios…",
      "github.synced": "Consultado",
      "github.syncFresh": "Datos de GitHub al día",
      "github.syncStale": "Mostrando los últimos datos guardados",
      "github.syncOffline": "Sin conexión · mostrando los últimos datos guardados",
      "github.syncError": "No se pudo conectar · se conservan los últimos datos",
      "github.refresh": "Actualizar",
      "github.refreshing": "Actualizando…",
      "github.refreshAria": "Actualizar datos de GitHub",
      "github.starsShort": "estrellas",
      "github.forksShort": "forks",
      "github.forkLabel": "fork",
      "github.calendarTitle": "Contribuciones",
      "github.calendarTotal": "contribuciones en el último año",
      "github.calendarLoading": "Cargando contribuciones…",
      "github.calendarError": "No se pudieron cargar las contribuciones.",
      "github.calendarHover": "Selecciona un día para consultar los commits, issues y pull requests públicos que pueda recuperar GitHub.",
      "github.calendarLegend": "Nivel de contribuciones",
      "github.calendarAria": "Contribuciones diarias de GitHub durante el último año",
      "github.detailStats": "Más estadísticas de GitHub",
      "github.personalRepos": "Repos personales visibles",
      "github.forks": "Forks de proyectos",
      "github.languages": "Lenguajes utilizados",
      "github.less": "Menos",
      "github.more": "Más",
      "github.contributionZero": "0 contribuciones",
      "github.contributionOne": "1 contribución",
      "github.contributionMany": "{count} contribuciones",

      "discord.online": "En línea",
      "discord.idle": "Ausente",
      "discord.dnd": "No molestar",
      "discord.offline": "Desconectado",
      "discord.connecting": "Conectando con Discord…",
      "discord.reconnecting": "Reconectando con Discord…",
      "discord.unavailable": "Estado no disponible",
      "discord.playing": "Jugando a",
      "discord.streaming": "En directo",
      "discord.listening": "Escuchando",

      "blog.title": "Blog",
      "blog.sub": "Lanzamientos, novedades y notas sobre el desarrollo de mis proyectos.",
      "blog.empty": "Todavía no hay publicaciones.",
      "blog.back": "Volver al blog",
      "contact.title": "Contacto",
      "contact.text": "Puedes contactarme para comentar un proyecto, proponer una colaboración o comunicar un problema. Elige el correo o la red que prefieras.",
      "about.cardBio": "Creador de contenido y programador",
      "skills.javascript": "Lo utilizo en proyectos web y juegos. Sigo profundizando en la interacción, la lógica y el trabajo con datos.",
      "skills.typescript": "Estoy ampliando mis conocimientos de tipado y desarrollo de aplicaciones. Es el lenguaje principal del repositorio de Wave.",
      "github.profileRepos": "Repos públicos",
      "github.location": "Ubicación",
      "github.profileSource": "Fuente: API pública de GitHub",
      "social.youtube": "YouTube",
      "social.x": "X / Twitter",
      "project.readmeLoading": "Cargando README…",
      "project.imageUnavailable": "Imagen no disponible; abrir original ↗",
      "project.loading": "Cargando proyecto…",
      "projects.loading": "Cargando proyectos…",
      "contact.eyebrow": "CORREO Y REDES",
      "contact.emailLabel": "Por correo",
      "contact.emailDesc": "Para consultas, colaboraciones o mensajes que necesiten más contexto.",
      "contact.send": "Abrir correo ↗",
      "contact.copy": "Copiar dirección",
      "contact.copied": "¡Copiado!",
      "contact.copyError": "No se pudo copiar. Selecciona la dirección y cópiala.",
      "contact.copyHint": "Se abrirá tu aplicación de correo. También puedes copiar la dirección.",
      "contact.socialTitle": "Redes",
      "contact.socialSub": "Mis perfiles públicos y otras formas de contacto.",
      "contact.discordDesc": "Conversaciones y contacto a través de mi perfil.",
      "contact.youtubeDesc": "Vídeos y comentarios sobre el contenido del canal.",
      "contact.xDesc": "Publicaciones y contacto en X.",
      "contact.githubDesc": "Código, documentación, incidencias y propuestas de cambios.",
      "contact.discordHandle": "Mi perfil de Discord",
      "contact.githubHandle": "@jaime-gaming",
      "contact.youtubeHandle": "@jaimegaming5731",
      "contact.xHandle": "@JaimeGamingPro",
      "contact.quickTitle": "Escribir por correo",
      "contact.topicProject": "Proponer un proyecto",
      "contact.topicBug": "Comunicar un problema",
      "contact.topicHello": "Contacto general",
      "contact.subjectProject": "Una idea para un proyecto",
      "contact.subjectBug": "He encontrado un fallo",
      "contact.subjectHello": "Contacto desde la web de Jaime Gaming",
      "hero.roleSource": "Repos recientes · GitHub",
      "hero.roleFallback": "Proyectos e ideas",
      "hero.openRepo": "Abrir repo ↗",
      "about.learning": "Trabajo con HTML y sigo formándome en JavaScript, TypeScript y Python. Publico mis repositorios en GitHub para compartir el código y los cambios. Entre mis proyectos están <a href=\"/projects/jaime-gaming/wave/\">Wave</a>, un reproductor para una biblioteca de música local, y <a href=\"/projects/jaime-gaming/rngdle-infinite/\">RNGdle-Infinite</a>, un juego para navegador.",
      "github.dayPanel": "Detalle de contribuciones",
      "github.closeDay": "Cerrar detalle",
      "github.dayLoading": "Consultando contribuciones…",
      "github.daySaved": "Resumen de GitHub guardado el {date}. La consulta en directo no está disponible.",
      "github.daySavedNotice": "Resumen público de repositorios personales obtenido de GitHub. Los commits se agrupan por repositorio y día UTC; no incluye todas las acciones del calendario ni actividad privada.",
      "github.calendarSource": "Datos consultados el {date}.",
      "github.dayNone": "No se encontraron commits, issues o pull requests públicos para esta fecha.",
      "github.dayError": "No se pudo consultar GitHub. Puedes abrir la actividad de este día directamente en tu perfil.",
      "github.dayNotice": "Resultados de repositorios personales indexados por GitHub, con fechas UTC y hasta 30 registros por categoría. No incluyen todas las acciones que cuenta el calendario, ni actividad privada.",
      "github.daySource": "Ver este día en GitHub",
      "github.dayEmpty": "El calendario no registra contribuciones en esta fecha.",
      "github.dayCommits": "Commits",
      "github.dayIssues": "Issues y pull requests",
      "github.dayPartial": "Parte de los resultados no se ha podido recuperar.",
      "github.dayNoCategory": "Sin resultados públicos en esta categoría.",
      "profile.spain": "España",
      "project.readmeOriginal": "README original de GitHub. Su contenido se muestra en el idioma del repositorio.",
      "readme.completed": "Completado",
      "readme.incomplete": "Sin completar",
      "readme.table": "Tabla del README",
      "footer.tagline": "Juegos para navegador, aplicaciones web y vídeos.",
      "footer.site": "Sitio",
      "footer.siteAria": "Enlaces del sitio",
      "footer.resources": "Recursos",
      "footer.resourcesAria": "Recursos y enlaces externos",
      "footer.status": "Estado del servicio",
      "footer.email": "Correo",
      "footer.rights": "Todos los derechos reservados.",
      "footer.source": "Código fuente ↗",
      "footer.terms": "Términos del servicio",
      "footer.privacy": "Privacidad",
      "footer.legalAria": "Términos y privacidad",
      "status.title": "Estado del servicio",
      "status.sub": "Estado en directo de la web, la documentación y los proyectos, desde el panel oficial de incident.io.",
      "status.note": "Datos del panel oficial de estado",
      "status.open": "Abrir panel completo ↗",
      "status.loading": "Consultando el estado…",
      "status.error": "No se pudo consultar el estado en directo. Puedes abrir el panel completo.",
      "status.updated": "Actualizado el {date}",
      "status.componentsAria": "Componentes del servicio",
      "status.allOperational": "Todos los sistemas operativos",
      "status.minorIssues": "Incidencias menores",
      "status.majorIssues": "Incidencia grave",
      "status.criticalIssues": "Incidencia crítica",
      "status.maintenanceOverall": "Mantenimiento en curso",
      "status.unknown": "Estado no disponible",
      "status.operational": "Operativo",
      "status.degraded": "Rendimiento degradado",
      "status.partial": "Interrupción parcial",
      "status.major": "Interrupción grave",
      "status.underMaintenance": "En mantenimiento",
      "status.maintenanceTitle": "Mantenimiento programado",
      "status.maintenanceBody": "Texto publicado en el panel de estado.",
      "status.frameTitle": "Panel de estado de Jaime Gaming",
      "status.frameNotice": "El panel completo pertenece a incident.io y solo se carga si lo pides. Al cargarlo puede usar sus propias cookies.",
      "status.loadFrame": "Cargar panel incrustado",
      "status.hint": "El resumen se actualiza al abrir esta página. Si el panel incrustado no aparece, ábrelo con el botón superior.",
      "legal.terms.title": "Términos del servicio",
      "legal.terms.sub": "Reglas de uso del sitio y de todos los proyectos.",
      "legal.privacy.title": "Privacidad",
      "legal.privacy.sub": "Qué datos se tratan al visitar el sitio y qué opciones tienes.",
      "meta.home.title": "Jaime Gaming — juegos, programación y YouTube",
      "meta.home.description": "Jaime Gaming, youtuber y programador. Juegos para navegador, vídeos y proyectos web. Aprendiendo JavaScript, TypeScript y Python.",
      "meta.projects.title": "Proyectos — Jaime Gaming",
      "meta.projects.description": "Juegos, pruebas y repositorios públicos de Jaime Gaming, sincronizados desde GitHub.",
      "meta.contact.title": "Contacto — Jaime Gaming",
      "meta.contact.description": "Habla con Jaime Gaming por correo, Discord, YouTube, X o GitHub. Enlaces oficiales y contacto directo.",
      "meta.blog.title": "Blog — Jaime Gaming",
      "meta.blog.description": "Lanzamientos, novedades y notas sobre el desarrollo de los proyectos de Jaime Gaming.",
      "meta.status.title": "Estado del servicio — Jaime Gaming",
      "meta.status.description": "Estado en directo de la web, la documentación y los proyectos de Jaime Gaming.",
      "meta.terms.title": "Términos del servicio — Jaime Gaming",
      "meta.terms.description": "Condiciones de uso del sitio personal de Jaime Gaming.",
      "meta.privacy.title": "Privacidad — Jaime Gaming",
      "meta.privacy.description": "Qué datos se tratan al visitar el sitio de Jaime Gaming y qué opciones tienes.",
      "meta.project.title": "Proyecto — Jaime Gaming",
      "meta.project.description": "Detalle de proyecto de Jaime Gaming.",
    },
    en: {
      "nav.home": "Home",
      "nav.projects": "Projects",
      "nav.blog": "Blog",
      "nav.docs": "Docs",
      "nav.contact": "Contact",
      "nav.openMenu": "Open menu",
      "nav.closeMenu": "Close menu",
      "aria.langSwitch": "English. Switch to Spanish",
      "aria.homeLogo": "Jaime Gaming — home",
      "aria.mainNav": "Main navigation",
      "aria.backToTop": "Back to top",
      "aria.socials": "Social links",
      "aria.interests": "Areas of interest",
      "aria.profileCard": "Jaime Gaming's profile",
      "aria.skipToContent": "Skip to content",
      "social.github": "GitHub",
      "social.discord": "Discord",
      "social.email": "Email",

      "hero.title": "Hello, I’m <span class=\"hero__title-accent\">Jaime Gaming</span>",
      "hero.subtitle": "I create browser games, web applications and videos. This site brings together my projects, public code and development updates.",
      "hero.current": "IN THE CODE",
      "hero.roles": ["Coding a game", "Developing a web tool", "Reviewing project code", "Preparing website updates", "Working on new features", "Testing an interface", "Documenting a project", "Exploring new ideas", "Organizing my repositories", "Improving the mobile experience"],
      "hero.ctaPrimary": "View projects",
      "hero.ctaSecondary": "Contact",
      "hero.visualCaption": "You can find me on YouTube too.",
      "hero.scroll": "ABOUT ME",
      "profile.label": "@jaime-gaming",
      "profile.kicker": "GAMES, WEBSITES & VIDEOS",
      "profile.footer": "Visit my YouTube channel",

      "about.title": "About me",
      "about.sub": "Programming, games and content creation.",
      "about.text": "I’m Jaime Gaming, a programmer and content creator. I started with HTML and games I shared with my classmates. Since then, I’ve expanded into web applications and tools alongside games. I’m also the founder of <a href=\"https://github.com/PineappleVA\" target=\"_blank\" rel=\"noopener noreferrer\">Pineapple</a>.",
      "about.statusLoading": "Connecting to Discord…",
      "about.cardLabel": "ON GITHUB",
      "about.cardTitle": "@jaime-gaming",
      "about.cardText": "Public repositories, source code and project documentation.",
      "about.cardStamp": "MY GITHUB ↗",

      "skills.title": "What I use",
      "skills.sub": "Technologies I use and others I’m introducing into my projects.",
      "skills.html": "Where I started. I use it to structure pages, interfaces and browser games.",
      "skills.python": "I’m learning through projects and experiments. I also share my Python repositories on GitHub.",
      "skills.gamesTitle": "Game development",
      "skills.games": "Shape a mechanic, try it out, and improve it with feedback.",

      "projectsTeaser.title": "Projects",
      "projectsTeaser.sub": "My latest public repos on GitHub.",
      "projectsTeaser.viewAll": "View all projects →",
      "projectsPage.eyebrow": "GitHub",
      "projectsPage.title": "My projects",
      "projectsPage.sub": "Games, applications and tools I publish on GitHub. Each project includes its description, documentation and links to the code or application when available.",
      "projects.noDescription": "No description on GitHub. Open it for the code and README, if there is one.",
      "projects.empty": "There are no public repositories to show.",
      "projects.error": "Couldn't load projects. Please try again later.",
      "projects.open": "View project details",
      "project.back": "Back to projects",
      "project.stars": "stars",
      "project.forks": "forks",
      "project.updated": "Updated",
      "project.viewOnGithub": "View on GitHub",
      "project.liveDemo": "Open project",
      "project.readmeUnavailable": "The README preview couldn't be loaded.",
      "project.readmeOnGithub": "Open it on GitHub",
      "project.loadErrorTitle": "Project temporarily unavailable",
      "project.loadErrorSub": "Couldn't connect to GitHub. Please try again in a moment.",
      "notFound.title": "Page not found",
      "notFound.sub": "The link might be broken or the page may have moved.",
      "notFound.home": "Back to home",

      "github.title": "GitHub",
      "github.sub": "Public data from my account.",
      "github.repos": "Project repos",
      "github.stars": "Project stars",
      "github.followers": "Followers",
      "github.syncLoading": "Connecting to GitHub…",
      "github.syncUpdating": "Updating repositories…",
      "github.synced": "Checked",
      "github.syncFresh": "GitHub data up to date",
      "github.syncStale": "Showing the latest saved data",
      "github.syncOffline": "Offline · showing the latest saved data",
      "github.syncError": "Couldn't connect · keeping the latest saved data",
      "github.refresh": "Refresh",
      "github.refreshing": "Updating…",
      "github.refreshAria": "Refresh GitHub data",
      "github.starsShort": "stars",
      "github.forksShort": "forks",
      "github.forkLabel": "fork",
      "github.calendarTitle": "Contributions",
      "github.calendarTotal": "contributions in the past year",
      "github.calendarLoading": "Loading contributions…",
      "github.calendarError": "Couldn't load contributions.",
      "github.calendarHover": "Select a day to view the public commits, issues and pull requests GitHub can retrieve.",
      "github.calendarLegend": "Contribution levels",
      "github.calendarAria": "Daily GitHub contributions over the past year",
      "github.detailStats": "More GitHub statistics",
      "github.personalRepos": "Visible personal repos",
      "github.forks": "Project forks",
      "github.languages": "Languages used",
      "github.less": "Less",
      "github.more": "More",
      "github.contributionZero": "0 contributions",
      "github.contributionOne": "1 contribution",
      "github.contributionMany": "{count} contributions",

      "discord.online": "Online",
      "discord.idle": "Away",
      "discord.dnd": "Do not disturb",
      "discord.offline": "Offline",
      "discord.connecting": "Connecting to Discord…",
      "discord.reconnecting": "Reconnecting to Discord…",
      "discord.unavailable": "Status unavailable",
      "discord.playing": "Playing",
      "discord.streaming": "Streaming",
      "discord.listening": "Listening to",

      "blog.title": "Blog",
      "blog.sub": "Releases, updates and notes about the development of my projects.",
      "blog.empty": "No posts yet.",
      "blog.back": "Back to the blog",
      "contact.title": "Contact",
      "contact.text": "Contact me to discuss a project, suggest a collaboration or report an issue. Choose email or whichever social platform suits you.",
      "skills.javascript": "I use it in web projects and games, while developing my understanding of interaction, logic and data.",
      "skills.typescript": "I’m building my knowledge of types and application development. It is the main language in Wave’s repository.",
      "github.profileRepos": "Public repos",
      "github.location": "Location",
      "github.profileSource": "Source: GitHub public API",
      "social.youtube": "YouTube",
      "social.x": "X / Twitter",
      "project.readmeLoading": "Loading README…",
      "project.imageUnavailable": "Image unavailable; open original ↗",
      "project.loading": "Loading project…",
      "projects.loading": "Loading projects…",
      "contact.eyebrow": "EMAIL & SOCIALS",
      "contact.emailLabel": "By email",
      "contact.emailDesc": "For enquiries, collaborations or messages that need more context.",
      "contact.send": "Open email ↗",
      "contact.copy": "Copy address",
      "contact.copied": "Copied!",
      "contact.copyError": "Could not copy. Select the address and copy it manually.",
      "contact.copyHint": "Opens your email app. You can also copy the address.",
      "contact.socialTitle": "Socials",
      "contact.socialSub": "My public profiles and other ways to get in touch.",
      "contact.discordDesc": "Conversations through my Discord profile.",
      "contact.youtubeDesc": "Videos and discussions in the channel’s comments.",
      "contact.xDesc": "Posts and contact on X.",
      "contact.githubDesc": "Code, documentation, issues and proposed changes.",
      "contact.discordHandle": "My Discord profile",
      "contact.githubHandle": "@jaime-gaming",
      "contact.youtubeHandle": "@jaimegaming5731",
      "contact.xHandle": "@JaimeGamingPro",
      "contact.quickTitle": "Send an email",
      "contact.topicProject": "Propose a project",
      "contact.topicBug": "Report a problem",
      "contact.topicHello": "General enquiry",
      "contact.subjectProject": "An idea for a project",
      "contact.subjectBug": "I found a bug",
      "contact.subjectHello": "Contact from Jaime Gaming’s website",
      "hero.roleSource": "Recent repos · GitHub",
      "hero.roleFallback": "Projects and ideas",
      "hero.openRepo": "Open repo ↗",
      "about.learning": "I work with HTML and continue learning JavaScript, TypeScript and Python. I publish my repositories on GitHub to share the code and its development. My projects include <a href=\"/projects/jaime-gaming/wave/\">Wave</a>, a player for a local music collection, and <a href=\"/projects/jaime-gaming/rngdle-infinite/\">RNGdle-Infinite</a>, a browser game.",
      "github.dayPanel": "Contribution details",
      "github.closeDay": "Close details",
      "github.dayLoading": "Loading contributions…",
      "github.daySaved": "GitHub summary saved on {date}. Live lookup is unavailable.",
      "github.daySavedNotice": "Public summary from GitHub for personal repositories. Commits are grouped by repository and UTC day; this does not include every calendar action or private activity.",
      "github.calendarSource": "Data checked on {date}.",
      "github.dayNone": "No public commits, issues or pull requests were found for this date.",
      "github.dayError": "GitHub could not be reached. You can open this day’s activity on the profile directly.",
      "github.dayNotice": "Results from personal repositories indexed by GitHub, using UTC dates and up to 30 records per category. This does not include every action counted by the calendar or private activity.",
      "github.daySource": "View this day on GitHub",
      "github.dayEmpty": "The calendar records no contributions on this date.",
      "github.dayCommits": "Commits",
      "github.dayIssues": "Issues and pull requests",
      "github.dayPartial": "Some results could not be retrieved.",
      "github.dayNoCategory": "No public results in this category.",
      "about.cardBio": "YouTuber and programmer",
      "profile.spain": "Spain",
      "project.readmeOriginal": "Original README from GitHub. Its content is displayed in the repository’s language.",
      "readme.completed": "Completed",
      "readme.incomplete": "Not completed",
      "readme.table": "README table",
      "footer.tagline": "Browser games, web applications and videos.",
      "footer.site": "Site",
      "footer.siteAria": "Site links",
      "footer.resources": "Resources",
      "footer.resourcesAria": "Resources and external links",
      "footer.status": "Service status",
      "footer.email": "Email",
      "footer.rights": "All rights reserved.",
      "footer.source": "Source code ↗",
      "footer.terms": "Terms of Service",
      "footer.privacy": "Privacy",
      "footer.legalAria": "Terms and privacy",
      "status.title": "Service status",
      "status.sub": "Live status of the website, documentation and projects, from the official incident.io panel.",
      "status.note": "Data from the official status panel",
      "status.open": "Open full status page ↗",
      "status.loading": "Checking status…",
      "status.error": "Couldn't fetch the live status. You can open the full status page.",
      "status.updated": "Updated {date}",
      "status.componentsAria": "Service components",
      "status.allOperational": "All systems operational",
      "status.minorIssues": "Minor issues",
      "status.majorIssues": "Major incident",
      "status.criticalIssues": "Critical incident",
      "status.maintenanceOverall": "Maintenance in progress",
      "status.unknown": "Status unavailable",
      "status.operational": "Operational",
      "status.degraded": "Degraded performance",
      "status.partial": "Partial outage",
      "status.major": "Major outage",
      "status.underMaintenance": "Under maintenance",
      "status.maintenanceTitle": "Scheduled maintenance",
      "status.maintenanceBody": "Text published on the status page.",
      "status.frameTitle": "Jaime Gaming status page",
      "status.frameNotice": "The full panel belongs to incident.io and is only loaded if you ask for it. Once loaded, it may use its own cookies.",
      "status.loadFrame": "Load embedded panel",
      "status.hint": "The summary refreshes when you open this page. If the embedded panel doesn’t appear, open it with the button above.",
      "legal.terms.title": "Terms of Service",
      "legal.terms.sub": "Rules of use for the site and all of its projects.",
      "legal.privacy.title": "Privacy Policy",
      "legal.privacy.sub": "What data is processed when you visit this site and what choices you have.",
      "meta.home.title": "Jaime Gaming — games, programming and YouTube",
      "meta.home.description": "Jaime Gaming, YouTuber and programmer. Browser games, videos and web projects. Learning JavaScript, TypeScript and Python.",
      "meta.projects.title": "Projects — Jaime Gaming",
      "meta.projects.description": "Games, experiments and public repositories by Jaime Gaming, synced from GitHub.",
      "meta.contact.title": "Contact — Jaime Gaming",
      "meta.contact.description": "Contact Jaime Gaming by email, Discord, YouTube, X or GitHub. Official profiles and direct contact.",
      "meta.blog.title": "Blog — Jaime Gaming",
      "meta.blog.description": "Releases, updates and notes on the development of Jaime Gaming’s projects.",
      "meta.status.title": "Service status — Jaime Gaming",
      "meta.status.description": "Live status of Jaime Gaming's website, documentation and projects.",
      "meta.terms.title": "Terms of Service — Jaime Gaming",
      "meta.terms.description": "Terms of use for Jaime Gaming's personal site.",
      "meta.privacy.title": "Privacy Policy — Jaime Gaming",
      "meta.privacy.description": "What data is processed when you visit Jaime Gaming's site and what choices you have.",
      "meta.project.title": "Project — Jaime Gaming",
      "meta.project.description": "Project details from Jaime Gaming.",
    },
  };

  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch { return null; }
  }

  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch {  }
  }

  function detectDefaultLang() {
    const saved = storageGet("lang");
    if (saved && dict[saved]) return saved;
    const browserLang = (navigator.language || "es").slice(0, 2).toLowerCase();
    return dict[browserLang] ? browserLang : "en";
  }

  let langAppliedOnce = false;
  let typingToken = 0;
  let typingFrame = 0;
  let typingBlocks = [];

  function motionAllowed() {
    return typeof window.matchMedia !== "function" || !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function stopRetyping() {
    typingToken += 1;
    if (typingFrame && typeof window.cancelAnimationFrame === "function") window.cancelAnimationFrame(typingFrame);
    typingFrame = 0;
    typingBlocks.forEach((block) => {
      block.element.removeAttribute("aria-busy");
      block.element.style.minHeight = "";
    });
    typingBlocks = [];
  }

  function collectTypingBlocks() {
    const blocks = [];
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      if (element.closest("#typedRole, [data-content-language], [aria-live], .jg-loader, pre, code, textarea")) return;
      const nodes = [];
      let total = 0;
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
      let node = walker.nextNode();
      while (node) {
        const text = node.nodeValue || "";
        if (text.trim()) {
          nodes.push({ node, text });
          total += text.length;
        }
        node = walker.nextNode();
      }
      if (!nodes.length || total < 2 || total > 320) return;
      blocks.push({ element, nodes, total });
    });
    return blocks;
  }

  function retypePage() {
    stopRetyping();
    if (typeof window.requestAnimationFrame !== "function" || typeof document.createTreeWalker !== "function") return;
    if (!motionAllowed() || document.visibilityState === "hidden") return;
    const blocks = collectTypingBlocks();
    if (!blocks.length) return;
    const token = typingToken;
    const originals = blocks.map((block) => block.nodes.map((entry) => entry.text));
    blocks.forEach((block) => {
      block.height = block.element.getBoundingClientRect().height;
      block.nodes.forEach((entry) => { entry.node.nodeValue = ""; });
      block.element.setAttribute("aria-busy", "true");
      if (block.height > 0) block.element.style.minHeight = `${block.height}px`;
    });
    typingBlocks = blocks;
    let startTime = 0;
    function frame(now) {
      if (token !== typingToken) return;
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      let finished = true;
      blocks.forEach((block, index) => {
        const budget = elapsed - Math.min(index * 15, 380);
        if (budget < 0) { finished = false; return; }
        const speed = Math.max(3, Math.min(13, 900 / block.total));
        const visible = Math.min(block.total, Math.floor(budget / speed));
        let remaining = visible;
        block.nodes.forEach((entry, nodeIndex) => {
          const full = originals[index][nodeIndex];
          const shown = remaining > 0 ? full.slice(0, remaining) : "";
          if (entry.node.nodeValue !== shown) entry.node.nodeValue = shown;
          remaining -= full.length;
        });
        if (visible < block.total) finished = false;
      });
      if (!finished) {
        typingFrame = window.requestAnimationFrame(frame);
        return;
      }
      typingFrame = 0;
      blocks.forEach((block) => {
        block.element.removeAttribute("aria-busy");
        block.element.style.minHeight = "";
      });
      typingBlocks = [];
    }
    typingFrame = window.requestAnimationFrame(frame);
  }

  function applyLang(lang, { persist = true, animate = true } = {}) {
    if (!dict[lang]) lang = "es";
    document.documentElement.setAttribute("lang", lang);
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = dict[lang][element.getAttribute("data-i18n")];
      if (typeof value === "string") element.innerHTML = value;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
      const value = dict[lang][element.getAttribute("data-i18n-aria")];
      if (typeof value === "string") element.setAttribute("aria-label", value);
    });
    document.querySelectorAll("[data-i18n-title]").forEach((element) => {
      const value = dict[lang][element.getAttribute("data-i18n-title")];
      if (typeof value === "string") element.setAttribute("title", value);
    });
    const pageData = JSON.parse(document.getElementById("pageTranslations")?.textContent || "{}")[lang] || {};
    document.querySelectorAll("[data-content-key]").forEach((element) => {
      const value = pageData.fields?.[element.dataset.contentKey];
      if (typeof value !== "string") return;
      if (element.hasAttribute("data-content-language")) {
        element.innerHTML = value;
        element.lang = lang;
      } else element.textContent = value;
    });
    document.querySelectorAll("[data-i18n-date]").forEach((element) => {
      const date = new Date(`${element.getAttribute("datetime")}T00:00:00Z`);
      if (Number.isFinite(date.getTime())) element.textContent = new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
    });
    const page = document.body.dataset.page;
    const title = pageData.title || dict[lang][`meta.${page}.title`];
    const description = pageData.description || dict[lang][`meta.${page}.description`];
    if (title) {
      document.title = title;
      document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach((element) => element.content = title);
    }
    if (description) document.querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]').forEach((element) => element.content = description);
    const structuredData = document.getElementById("personStructuredData");
    if (structuredData && description) {
      const person = JSON.parse(structuredData.textContent);
      person.description = description;
      person.inLanguage = lang;
      structuredData.textContent = JSON.stringify(person);
    }
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.content = lang === "es" ? "es_ES" : "en_US";
    const switchButton = document.getElementById("langSwitch");
    if (switchButton) {
      switchButton.setAttribute("data-active", lang);
      switchButton.title = dict[lang]["aria.langSwitch"];
      const name = document.getElementById("languageName");
      if (name) name.textContent = lang === "es" ? "Español" : "English";
    }
    if (persist) storageSet("lang", lang);
    window.currentLang = lang;
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
    if (animate && langAppliedOnce) retypePage();
    langAppliedOnce = true;
  }

  window.i18n = { dict, applyLang, detectDefaultLang, retypePage };
  document.addEventListener("DOMContentLoaded", () => {
    applyLang(detectDefaultLang());
    const switchButton = document.getElementById("langSwitch");
    if (switchButton) {
      switchButton.addEventListener("click", () => {
        applyLang(window.currentLang === "es" ? "en" : "es");
        switchButton.classList.remove("is-switching");
        void switchButton.offsetWidth;
        switchButton.classList.add("is-switching");
        window.setTimeout(() => switchButton.classList.remove("is-switching"), 760);
      });
    }
  });
  window.addEventListener("storage", (event) => {
    if (event.key === "lang" && dict[event.newValue] && event.newValue !== window.currentLang) applyLang(event.newValue, { persist: false });
  });
})();
