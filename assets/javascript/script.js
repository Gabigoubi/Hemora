document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const body = document.body;

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("nav-menu--visible");
      body.classList.toggle("nav-open");

      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", !isExpanded);
      navToggle.setAttribute(
        "aria-label",
        isExpanded ? "Abrir menu" : "Fechar menu"
      );
    });
  }

  const themeToggle = document.querySelector(".dark-mode-toggle");

  if (themeToggle) {
    const icon = themeToggle.querySelector(".toggle-icon");

    function setScheme(theme) {
      if (theme === "dark") {
        body.classList.add("dark-mode");
        if (icon) icon.textContent = "☀️";
        themeToggle.setAttribute("aria-label", "Ativar modo claro");
      } else {
        body.classList.remove("dark-mode");
        if (icon) icon.textContent = "🌙";
        themeToggle.setAttribute("aria-label", "Ativar modo escuro");
      }
    }

    themeToggle.addEventListener("click", () => {
      const currentScheme = body.classList.contains("dark-mode")
        ? "light"
        : "dark";
      setScheme(currentScheme);

      localStorage.setItem("themeScheme", currentScheme);
    });

    const savedScheme = localStorage.getItem("themeScheme");
    if (savedScheme) {
      setScheme(savedScheme);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        setScheme("dark");
      } else {
        setScheme("light");
      }
    }
  }
});
