/* =================================================================
   mdlp.io — Premium AI Consultant Portfolio
   script.js
   Handles: starfield particles, scroll reveal, nav behaviour,
   animated counters, smooth scrolling, and the contact form.
   ================================================================= */

(function () {
  "use strict";

  // Respect reduced-motion preference for heavier effects
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===============================================================
     1. STAR-FIELD / PARTICLE CANVAS
     A lightweight animated field of drifting, twinkling stars with
     occasional connecting lines for a "constellation" tech feel.
     =============================================================== */
  const canvas = document.getElementById("starfield");
  const ctx = canvas ? canvas.getContext("2d") : null;
  let stars = [];
  let width = 0;
  let height = 0;
  // Track the pointer so the field subtly parallaxes toward the cursor
  const mouse = { x: -9999, y: -9999 };

  function sizeCanvas() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    // Density scales with screen size, capped for performance
    const count = Math.min(160, Math.floor((width * height) / 11000));
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.4,        // radius
        vx: (Math.random() - 0.5) * 0.18,    // velocity
        vy: (Math.random() - 0.5) * 0.18,
        tw: Math.random() * Math.PI * 2       // twinkle phase
      });
    }
  }

  const palette = ["56,232,255", "139,92,255", "255,92,240", "255,255,255"];

  function drawStars(t) {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      // drift
      s.x += s.vx;
      s.y += s.vy;

      // wrap around edges
      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;

      // gentle pull toward the cursor for parallax life
      const dx = mouse.x - s.x;
      const dy = mouse.y - s.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 120) {
        s.x += dx * 0.0009 * (120 - dist) / 120 * 4;
        s.y += dy * 0.0009 * (120 - dist) / 120 * 4;
      }

      // twinkle
      const twinkle = 0.5 + 0.5 * Math.sin(t * 0.002 + s.tw);
      const color = palette[i % palette.length];

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + color + "," + (0.35 + twinkle * 0.55) + ")";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(" + color + ",0.8)";
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // draw faint connecting lines between nearby stars
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const a = stars[i], b = stars[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = "rgba(120,140,255," + (0.10 * (1 - d / 120)) + ")";
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate(t) {
    drawStars(t);
    requestAnimationFrame(animate);
  }

  if (canvas && ctx && !reduceMotion) {
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);
    window.addEventListener("mousemove", function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener("mouseout", function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });
    requestAnimationFrame(animate);
  } else if (canvas) {
    // Static, subtle dots for reduced-motion users
    sizeCanvas();
    drawStars(0);
  }

  /* ===============================================================
     2. STICKY NAV — add shadow/blur once the user scrolls,
     and update the top scroll-progress bar.
     =============================================================== */
  const nav = document.getElementById("nav");
  const progress = document.getElementById("scrollProgress");

  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 30);

    if (progress) {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? (y / docH) * 100 : 0;
      progress.style.width = pct + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ===============================================================
     3. MOBILE MENU TOGGLE
     =============================================================== */
  const toggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  function closeMenu() {
    if (!toggle || !navLinks) return;
    toggle.classList.remove("open");
    navLinks.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      const open = navLinks.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    // close after clicking any link
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ===============================================================
     4. SCROLL REVEAL — fade/slide elements in as they enter view.
     Counters fire when the hero stats become visible.
     =============================================================== */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: just show everything
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ===============================================================
     5. ANIMATED COUNTERS for the hero stat cards
     =============================================================== */
  const counters = document.querySelectorAll(".stat-card__num");

  function runCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      // easeOutCubic for a satisfying deceleration
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window && counters.length) {
    const co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else {
    counters.forEach(function (c) {
      c.textContent = c.getAttribute("data-count") + (c.getAttribute("data-suffix") || "");
    });
  }

  /* ===============================================================
     6. CARD TILT — subtle 3D tilt toward the cursor on service cards
     =============================================================== */
  if (!reduceMotion) {
    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        const rect = card.getBoundingClientRect();
        const cx = e.clientX - rect.left - rect.width / 2;
        const cy = e.clientY - rect.top - rect.height / 2;
        const rx = (-cy / rect.height) * 6;   // rotateX
        const ry = (cx / rect.width) * 6;     // rotateY
        card.style.transform =
          "translateY(-8px) perspective(700px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ===============================================================
     7. SMOOTH ANCHOR SCROLL (with offset for the fixed nav)
     =============================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      const id = link.getAttribute("href");
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ===============================================================
     8. CONTACT FORM — client-side validation + friendly feedback.
     (No backend here; wire up to your provider of choice.)
     =============================================================== */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        setStatus("Please fill in your name, email, and message.", "error");
        return;
      }
      if (!isEmail(email)) {
        setStatus("Please enter a valid email address.", "error");
        return;
      }

      // Simulate a successful send (replace with a real endpoint / Formspree / API)
      setStatus("Thanks, " + name + "! Your message is on its way — I'll be in touch shortly.", "success");
      form.reset();
    });
  }

  function setStatus(msg, type) {
    if (!status) return;
    status.textContent = msg;
    status.className = "form__status " + type;
  }

  /* ===============================================================
     9. Footer year
     =============================================================== */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
