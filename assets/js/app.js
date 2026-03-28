(function () {
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const backToTop = document.getElementById("backToTop");
  const revealElements = Array.from(document.querySelectorAll(".reveal"));
  const year = document.getElementById("year");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  function closeNav() {
    if (!navToggle || !siteNav) {
      return;
    }

    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Ouvrir le menu");
    siteNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
      document.body.classList.toggle("menu-open", isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("click", (event) => {
      if (!siteNav.classList.contains("is-open")) {
        return;
      }

      if (siteNav.contains(event.target) || navToggle.contains(event.target)) {
        return;
      }

      closeNav();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNav();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeNav();
      }
    });
  }

  if (navLinks.length && sections.length && "IntersectionObserver" in window) {
    const linkById = new Map(
      navLinks.map((link) => [link.getAttribute("href").replace("#", ""), link])
    );

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const activeLink = linkById.get(entry.target.id);
          if (!activeLink) {
            return;
          }

          navLinks.forEach((link) => {
            const isActive = link === activeLink;
            link.classList.toggle("is-active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  } else if (navLinks[0]) {
    navLinks[0].classList.add("is-active");
    navLinks[0].setAttribute("aria-current", "true");
  }

  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle("is-visible", window.scrollY > 500);
    };

    toggleBackToTop();
    window.addEventListener("scroll", toggleBackToTop, { passive: true });

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });
  }

  if (revealElements.length && !prefersReducedMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18
      }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  // ── Lightbox ──────────────────────────────────────────────────
  const lightbox = document.createElement("div");
  lightbox.id = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Image agrandie");
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Fermer">✕</button>
    <img class="lightbox-img" src="" alt="" />
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector(".lightbox-img");
  const lightboxClose = lightbox.querySelector(".lightbox-close");

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add("is-open");
    document.body.classList.add("lightbox-open");
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
  }

  // Rend cliquables toutes les images marquées data-lightbox
  document.querySelectorAll("img[data-lightbox]").forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => openLightbox(img.src, img.alt));
  });

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
  });
})();
