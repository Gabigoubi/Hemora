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

  const form = document.querySelector(".form");

  if (form) {
    form.setAttribute("novalidate", true);

    const inputs = form.querySelectorAll(".form__input[required]");

    const cpfInput = document.getElementById("cpf");
    const telInput = document.getElementById("telefone");
    const cepInput = document.getElementById("cep");

    if (cpfInput) {
      cpfInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
        value = value.replace(
          /(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/,
          "$1.$2.$3-$4"
        );
        e.target.value = value;
      });
    }

    if (telInput) {
      telInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = value.replace(/^(\d{2})(\d)/, "($1) $2");
        value = value.replace(/(\(\d{2}\) )(\d{5})(\d)/, "$1$2-$3");
        e.target.value = value;
      });
    }

    if (cepInput) {
      cepInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = value.replace(/^(\d{5})(\d)/, "$1-$2");
        e.target.value = value;
      });
    }

    inputs.forEach((input) => {
      const errorSpan = document.createElement("span");
      errorSpan.className = "form__error-message";
      errorSpan.setAttribute("aria-live", "polite");
      input.insertAdjacentElement("afterend", errorSpan);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let isFormValid = true;
      inputs.forEach((input) => {
        if (!validateInput(input)) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        const successMessage = document.getElementById("form-success");
        if (successMessage) {
          form.style.display = "none";
          successMessage.style.display = "block";
        }
        form.reset();
      } else {
        alert("Por favor, corrija os campos em vermelho antes de enviar.");
      }
    });

    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        validateInput(input);
      });

      input.addEventListener("input", () => {
        if (input.classList.contains("form__input--invalid")) {
          validateInput(input);
        }
      });
    });

    function validateInput(input) {
      const errorSpan = input.nextElementSibling;

      if (input.checkValidity()) {
        input.classList.remove("form__input--invalid");
        if (errorSpan) errorSpan.textContent = "";
        return true;
      } else {
        input.classList.add("form__input--invalid");
        if (errorSpan) errorSpan.textContent = getErrorMessage(input);
        return false;
      }
    }

    function getErrorMessage(input) {
      if (input.validity.valueMissing) {
        return "Este campo é obrigatório.";
      }
      if (input.validity.typeMismatch) {
        return "Por favor, insira um e-mail válido.";
      }
      if (input.validity.patternMismatch) {
        if (input.id === "cpf") return "Formato inválido. Use: 000.000.000-00";
        if (input.id === "telefone")
          return "Formato inválido. Use: (00) 00000-0000";
        if (input.id === "cep") return "Formato inválido. Use: 00000-000";
        if (input.id === "estado") return "Use apenas 2 letras (ex: SP)";
        return "Formato inválido.";
      }
      if (input.validity.tooShort) {
        return `Mínimo de ${input.minLength} caracteres.`;
      }
      return "Valor inválido.";
    }
  }
});
