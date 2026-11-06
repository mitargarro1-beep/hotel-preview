/* =========================================================
   HOTEL VISTA GRANDE — script.js
   ========================================================= */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Año automático en el footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header: estado al hacer scroll ---------- */
  const header = document.getElementById("header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 60);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  const setMenu = (open) => {
    if (!menuToggle || !navMenu) return;
    menuToggle.classList.toggle("is-open", open);
    navMenu.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    document.body.style.overflow = open ? "hidden" : "";
  };

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      setMenu(!navMenu.classList.contains("is-open"));
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* ---------- Revelado de elementos con Intersection Observer ---------- */
  const revealElements = document.querySelectorAll("[data-reveal]");

  // Cada elemento usa su propio retardo definido en data-delay (ms)
  revealElements.forEach((el) => {
    const delay = parseInt(el.dataset.delay, 10) || 0;
    el.style.setProperty("--reveal-delay", delay + "ms");
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Contadores animados en estadísticas ---------- */
  const counters = document.querySelectorAll("[data-count]");

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const isDecimal = target % 1 !== 0;
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = target * eased;
      el.textContent = isDecimal ? value.toFixed(1) : Math.floor(value).toString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = isDecimal ? target.toFixed(1) : target.toString();
      }
    };

    requestAnimationFrame(step);
  };

  if (counters.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      counters.forEach((el) => {
        const t = parseFloat(el.dataset.count);
        el.textContent = t % 1 !== 0 ? t.toFixed(1) : t;
      });
    } else {
      const counterObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((el) => counterObserver.observe(el));
    }
  }

  /* ---------- Parallax suave en el hero ---------- */
  const heroImg = document.getElementById("heroImg");
  if (heroImg && !prefersReducedMotion) {
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const offset = Math.min(window.scrollY, window.innerHeight);
          heroImg.style.translate = `0 ${offset * 0.25}px`;
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  /* ---------- Resaltado de enlace activo según sección visible ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav__link");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              const isActive = link.getAttribute("href") === `#${id}`;
              link.style.color = isActive ? "var(--gold)" : "";
            });
          }
        });
      },
      { threshold: 0.45 }
    );
    sections.forEach((s) => activeObserver.observe(s));
  }

  /* ---------- Formulario de contacto (simulado, sin envío real) ---------- */
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");

  if (form) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const setError = (field, message) => {
      const wrapper = field.closest(".field");
      const errorEl = wrapper ? wrapper.querySelector(".field__error") : null;
      if (message) {
        wrapper.classList.add("has-error");
        if (errorEl) errorEl.textContent = message;
      } else {
        wrapper.classList.remove("has-error");
        if (errorEl) errorEl.textContent = "";
      }
    };

    const validateField = (field) => {
      const value = field.value.trim();
      if (field.required && !value) {
        setError(field, "Este campo es obligatorio.");
        return false;
      }
      if (field.type === "email" && value && !emailPattern.test(value)) {
        setError(field, "Ingrese un correo electrónico válido.");
        return false;
      }
      setError(field, "");
      return true;
    };

    form.querySelectorAll("input, textarea").forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.closest(".field").classList.contains("has-error")) validateField(field);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fields = form.querySelectorAll("input, textarea");
      let valid = true;
      fields.forEach((field) => {
        if (!validateField(field)) valid = false;
      });

      if (!valid) {
        const firstError = form.querySelector(".has-error input, .has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Enviando...";

      // Simulación visual: no existe un sistema de reservas real.
      setTimeout(() => {
        btn.textContent = "¡Mensaje recibido!";
        feedback.textContent = "Gracias por su interés. Un miembro de nuestro equipo se comunicará con usted a la brevedad.";
        feedback.classList.add("is-visible");
        form.reset();

        // Reinicia las etiquetas flotantes tras el reset
        form.querySelectorAll(".field label").forEach(() => {});

        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = originalText;
          feedback.classList.remove("is-visible");
        }, 4500);
      }, 1200);
    });
  }

  /* ---------- Desplazamiento suave con compensación del header ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#" || targetId.length < 2) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;

      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  });
})();