/* ==========================================
   RUKHSAR QALANDARZADA - PORTFOLIO
   JavaScript
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  // ========================================
  // MOBILE NAVIGATION
  // ========================================

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-link");

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.classList.remove("open");
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("menu-open");
  }

  function openMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.classList.add("open");
    navLinks.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
    document.body.classList.add("menu-open");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu after clicking a navigation link
    navItems.forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    // Close the menu when clicking outside it
    document.addEventListener("click", (event) => {
      const clickedInsideMenu = navLinks.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        closeMenu();
      }
    });

    // Close the menu with Escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Reset navigation when returning to desktop width
    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) {
        closeMenu();
      }
    });
  }

  // ========================================
  // SMOOTH SCROLLING
  // ========================================

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches
            ? "auto"
            : "smooth",
          block: "start",
        });

        // Update the URL hash without jumping
        if (window.location.hash !== targetId) {
          history.replaceState(null, "", targetId);
        }
      }
    });
  });

  // ========================================
  // REVEAL ANIMATIONS
  // ========================================

  const revealElements = document.querySelectorAll(".reveal");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  } else {
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
        rootMargin: "0px 0px -35px 0px",
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  // ========================================
  // ACTIVE NAVIGATION ON SCROLL
  // ========================================

  const sections = document.querySelectorAll(
    "main section[id], header[id]"
  );

  if ("IntersectionObserver" in window && navItems.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.id;

            navItems.forEach((link) => {
              const linkTarget = link.getAttribute("href");
              const isActive = linkTarget === `#${currentId}`;

              link.classList.toggle("active", isActive);

              if (isActive) {
                link.setAttribute("aria-current", "location");
              } else {
                link.removeAttribute("aria-current");
              }
            });
          }
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // ========================================
  // CURRENT YEAR IN FOOTER
  // ========================================

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // ========================================
  // CONTACT FORM
  // ========================================

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (formStatus) {
        formStatus.textContent = "";
        formStatus.className = "form-status";
      }

      // Validate form fields
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const name = document.getElementById("name")?.value.trim();
      const email = document.getElementById("email")?.value.trim();
      const subject = document.getElementById("subject")?.value.trim();
      const message = document.getElementById("message")?.value.trim();

      if (!name || !email || !subject || !message) {
        if (formStatus) {
          formStatus.textContent =
            "Please complete all fields before continuing.";
          formStatus.classList.add("error");
        }

        return;
      }

      if (name.length < 2) {
        if (formStatus) {
          formStatus.textContent =
            "Please enter a name with at least 2 characters.";
          formStatus.classList.add("error");
        }

        return;
      }

      if (message.length < 10) {
        if (formStatus) {
          formStatus.textContent =
            "Please enter a message with at least 10 characters.";
          formStatus.classList.add("error");
        }

        return;
      }

      // Prepare an email using the visitor's default email application
      const recipient = "rqnbk123@gmail.com";

      const emailSubject = encodeURIComponent(
        `Portfolio Contact: ${subject}`
      );

      const emailBody = encodeURIComponent(
        `Hello Rukhsar,\n\n` +
        `My name is: ${name}\n` +
        `My email is: ${email}\n\n` +
        `Message:\n${message}\n\n` +
        `Sent from your portfolio website.`
      );

      const mailtoURL =
        `mailto:${recipient}` +
        `?subject=${emailSubject}` +
        `&body=${emailBody}`;

      if (formStatus) {
        formStatus.textContent =
          "Opening your email application. Please send the email there.";
        formStatus.classList.add("success");
      }

      // Open the visitor's email application
      window.location.href = mailtoURL;
    });
  }

  // ========================================
  // EMAIL ADDRESS COPY SUPPORT
  // ========================================

  const emailLink = document.querySelector(".email-link");

  if (emailLink) {
    emailLink.setAttribute(
      "aria-label",
      "Send an email to rqnbk123@gmail.com"
    );
  }

  // ========================================
  // SOCIAL LINKS
  // ========================================

  const socialLinks = document.querySelectorAll(".social-link");

  socialLinks.forEach((link) => {
    link.setAttribute("rel", "noopener noreferrer");
  });

  // ========================================
  // BACK TO TOP
  // ========================================

  const backToTop = document.querySelector(".back-to-top");

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    });
  }

  // ========================================
  // SKILL BAR ANIMATIONS
  // ========================================

  const skillBars = document.querySelectorAll(".skill-track span");

  if ("IntersectionObserver" in window && !reducedMotion) {
    skillBars.forEach((bar) => {
      const finalWidth = getComputedStyle(bar).width;

      bar.dataset.finalWidth = finalWidth;
      bar.style.width = "0";

      const skillObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const skillBar = entry.target;

              skillBar.style.transition = "width 1s ease";
              skillBar.style.width = skillBar.dataset.finalWidth;

              observer.unobserve(skillBar);
            }
          });
        },
        {
          threshold: 0.4,
        }
      );

      skillObserver.observe(bar);
    });
  }

  // ========================================
  // INITIALIZE PAGE
  // ========================================

  document.body.classList.add("page-loaded");
});