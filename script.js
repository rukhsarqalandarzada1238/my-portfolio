
/* =========================================
   RUKHSAR QALANDARZADA - PORTFOLIO
   JavaScript functionality
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const currentYear = document.getElementById("currentYear");

  // Update copyright year
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Mobile navigation
  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.classList.remove("open");
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("menu-open");
  }

  function toggleMenu() {
    if (!menuToggle || !navLinks) return;

    const isOpen = navLinks.classList.toggle("open");

    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    document.body.classList.toggle("menu-open", isOpen);
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", toggleMenu);

    navItems.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      const clickedInsideMenu = navLinks.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) {
        closeMenu();
      }
    });
  }

  // Highlight the active navigation link
  function setActiveLink(id) {
    navItems.forEach((link) => {
      const target = link.getAttribute("href");

      link.classList.toggle("active", target === `#${id}`);
    });
  }

  if ("IntersectionObserver" in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visibleSections.length > 0) {
          setActiveLink(visibleSections[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.15, 0.3, 0.5]
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    window.addEventListener("scroll", () => {
      let currentSection = "home";

      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 180) {
          currentSection = section.id;
        }
      });

      setActiveLink(currentSection);
    });
  }

  // Reveal elements when they enter the viewport
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // Contact form
  // This form opens the visitor's email app.
  // It does not send messages directly from the website.
  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      formStatus.textContent = "";
      formStatus.className = "form-status";

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const formData = new FormData(contactForm);

      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const subject = String(formData.get("subject") || "").trim();
      const message = String(formData.get("message") || "").trim();

      if (name.length < 2) {
        formStatus.textContent =
          "Please enter your name (at least 2 characters).";
        formStatus.classList.add("error");
        return;
      }

      if (message.length < 10) {
        formStatus.textContent =
          "Please write a message with at least 10 characters.";
        formStatus.classList.add("error");
        return;
      }

      const recipient = "rqnbk123@gmail.com";

      const emailSubject = encodeURIComponent(
        `Portfolio contact: ${subject}`
      );

      const emailBody = encodeURIComponent(
        `Hello Rukhsar,\n\n${message}\n\n` +
        `From: ${name}\n` +
        `Reply email: ${email}\n`
      );

      const mailtoLink =
        `mailto:${recipient}?subject=${emailSubject}&body=${emailBody}`;

      formStatus.textContent =
        "Opening your email app. Please send the message there.";
      formStatus.classList.add("success");

      window.location.href = mailtoLink;
    });
  }
});
