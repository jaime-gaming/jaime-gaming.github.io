(function () {
  "use strict";
  window.renderProjectMarkdown = function (markdown, repo) {
    const segments = (value) => value.split("/").map(encodeURIComponent).join("/");
    const root = `${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.name)}`;
    const directory = repo.path.includes("/") ? repo.path.slice(0, repo.path.lastIndexOf("/") + 1) : "";
    const rawBase = `https://raw.githubusercontent.com/${root}/${encodeURIComponent(repo.branch)}/${segments(directory)}`;
    const linkBase = `https://github.com/${root}/blob/${encodeURIComponent(repo.branch)}/${segments(directory)}`;
    const renderer = new window.marked.Renderer();
    renderer.checkbox = (checked) => `<span class="readme-checkbox" role="img" aria-label="${checked ? "Completed" : "Not completed"}">${checked ? "☑" : "☐"}</span> `;
    const clean = window.DOMPurify.sanitize(window.marked.parse(markdown, { gfm: true, breaks: false, renderer }), {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ["form", "input", "button", "style", "iframe", "video", "audio"],
      FORBID_ATTR: ["style"],
    });
    const template = document.createElement("template");
    template.innerHTML = clean;
    const slugs = new Map();
    template.content.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((heading) => {
      const slug = heading.textContent.toLowerCase().trim().replace(/[^\p{L}\p{N} _-]/gu, "").replace(/ /g, "-");
      const count = slugs.get(slug) || 0;
      slugs.set(slug, count + 1);
      heading.id = `readme-${slug}${count ? `-${count}` : ""}`;
    });
    template.content.querySelectorAll("a[href], img[src], source[srcset]").forEach((element) => {
      const image = element.tagName === "IMG";
      const attribute = image ? "src" : "href";
      const value = element.getAttribute(attribute);
      if (!value) { element.remove(); return; }
      if (!image && value.startsWith("#")) {
        element.setAttribute("href", `#readme-${value.slice(1)}`);
        return;
      }
      try {
        const rootRelative = value.startsWith("/") && !value.startsWith("//");
        const rootBase = image ? `https://raw.githubusercontent.com/${root}/${encodeURIComponent(repo.branch)}/` : `https://github.com/${root}/blob/${encodeURIComponent(repo.branch)}/`;
        const url = new URL(rootRelative ? value.slice(1) : value, rootRelative ? rootBase : image ? rawBase : linkBase);
        if (!["https:", "http:"].includes(url.protocol) && !(url.protocol === "mailto:" && !image)) throw new Error("Unsafe URL");
        element.setAttribute(attribute, url.href);
        if (image) {
          element.loading = "lazy";
          element.decoding = "async";
          element.removeAttribute("height");
          element.removeAttribute("srcset");
        } else {
          element.target = "_blank";
          element.rel = "noopener noreferrer";
        }
      } catch { element.removeAttribute(attribute); }
    });
    template.content.querySelectorAll("table").forEach((table) => {
      const wrapper = document.createElement("div");
      wrapper.className = "readme-table";
      wrapper.tabIndex = 0;
      wrapper.setAttribute("role", "region");
      wrapper.setAttribute("aria-label", "README table");
      table.replaceWith(wrapper);
      wrapper.append(table);
    });
    return window.DOMPurify.sanitize(template.innerHTML, { ADD_ATTR: ["target"] });
  };
})();
