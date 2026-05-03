/* ========================================
   YUME STUDIO — MAIN.JS
   ======================================== */

// ── DOM ELEMENTS ──────────────────────────
const navEl        = document.getElementById("nav");
const navBurger    = document.getElementById("navBurger");
const mobileMenu   = document.getElementById("mobileMenu");
const cookieBanner = document.getElementById("cookieBanner");
const cookieAccept = document.getElementById("cookieAccept");
const cookieDecline= document.getElementById("cookieDecline");
const backToTop    = document.getElementById("backToTop");


// ── COOKIE BANNER ─────────────────────────
function initCookieBanner() {
  if (!cookieBanner) return;

  if (localStorage.getItem("yume-cookie-choice")) {
    cookieBanner.classList.add("hidden");
    return;
  }

  cookieAccept.addEventListener("click", () => {
    localStorage.setItem("yume-cookie-choice", "accepted");
    cookieBanner.classList.add("hidden");
  });

  cookieDecline.addEventListener("click", () => {
    localStorage.setItem("yume-cookie-choice", "declined");
    cookieBanner.classList.add("hidden");
  });
}


// ── MOBILE MENU ───────────────────────────
function initMobileMenu() {
  if (!navBurger || !mobileMenu) return;

  navBurger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("active");
    navBurger.classList.toggle("active", isOpen);
    document.body.classList.toggle("no-scroll", isOpen);
  });

  mobileMenu.querySelectorAll(".mobile-link").forEach(link => {
    link.addEventListener("click", closeMobileMenu);
  });
}

function closeMobileMenu() {
  mobileMenu.classList.remove("active");
  navBurger.classList.remove("active");
  document.body.classList.remove("no-scroll");
}


// ── NAV SCROLL EFFECT ─────────────────────
function initNavScroll() {
  if (!navEl) return;
  window.addEventListener("scroll", () => {
    navEl.classList.toggle("scrolled", window.scrollY > 50);
  }, { passive: true });
}


// ── ACTIVE NAV LINK ───────────────────────
function initActiveNav() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href === page || (page === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}


// ── FADE-UP — INTERSECTION OBSERVER ───────
// CSS animation removed — JS handles this entirely
function initFadeUp() {
  const els = document.querySelectorAll(".fade-up");

  // Set initial hidden state via JS so CSS doesn't conflict
  els.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "opacity 0.65s ease, transform 0.65s ease";
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  els.forEach(el => observer.observe(el));
}


// ── FAQ ACCORDION ─────────────────────────
// Uses .open class — remove the CSS ~ sibling selector and use .faq-a.open instead
function initFAQ() {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector(".faq-q");
    const ans = item.querySelector(".faq-a");
    if (!btn || !ans) return;

    btn.addEventListener("click", () => {
      const isOpen = ans.classList.contains("open");

      // Close all
      items.forEach(i => {
        i.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        i.querySelector(".faq-a").classList.remove("open");
      });

      // Open current if it was closed
      if (!isOpen) {
        btn.setAttribute("aria-expanded", "true");
        ans.classList.add("open");
      }
    });
  });
}


// ── BACK TO TOP ───────────────────────────
function initBackToTop() {
  if (!backToTop) return;

  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


// ── CONNECT FORM ──────────────────────────
function initConnectForm() {
  const form = document.getElementById("connectForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const btn = form.querySelector(".form-submit");
    const msgEl = document.getElementById("formMessage");

    btn.disabled = true;
    btn.textContent = "Sending…";

    // Simulate send — replace fetch block below with real Formspree call
    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.textContent = "Send Message";

      if (msgEl) {
        msgEl.textContent = "Thank you — I'll be in touch within 48 hours.";
        msgEl.className = "form-message success";
        msgEl.style.display = "block";
        setTimeout(() => {
          msgEl.style.display = "none";
        }, 6000);
      }
    }, 800);

    // ── Formspree integration (uncomment when ready) ──
    // fetch("https://formspree.io/f/YOUR_ID", {
    //   method: "POST",
    //   body: new FormData(form),
    //   headers: { Accept: "application/json" }
    // }).then(r => {
    //   if (r.ok) { /* success */ }
    // });
  });
}


// ── SMOOTH SCROLL (internal anchor links) ─
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      closeMobileMenu();
      const offset = (navEl ? navEl.offsetHeight : 0) + 16;
      window.scrollTo({ top: target.offsetTop - offset, behavior: "smooth" });
    });
  });
}


// ── MARQUEE PAUSE ON HOVER ────────────────
function initMarquee() {
  const track = document.querySelector(".marquee-track");
  if (!track) return;
  track.addEventListener("mouseenter", () => track.style.animationPlayState = "paused");
  track.addEventListener("mouseleave", () => track.style.animationPlayState = "running");
}


// ── INIT ──────────────────────────────────
function init() {
  initCookieBanner();
  initMobileMenu();
  initNavScroll();
  initActiveNav();
  initFadeUp();
  initFAQ();
  initBackToTop();
  initConnectForm();
  initSmoothScroll();
  initMarquee();
}

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", init)
  : init();