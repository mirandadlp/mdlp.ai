/* =================================================================
   mdlp.ai — Premium AI Consultant Portfolio
   script.js
   Handles: starfield particles, scroll reveal, nav behaviour,
   animated counters, smooth scrolling, and the contact form.
   ================================================================= */

(function () {
  "use strict";

  // Respect reduced-motion preference for heavier effects
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===============================================================
     0. INTRO TYPEWRITER
     On load, show only the video + centered headline, type it out
     letter by letter, then smoothly reveal the rest of the site.
     =============================================================== */
  (function intro() {
    const body = document.body;
    const introEl = document.getElementById("intro");
    const line1 = document.getElementById("introLine1");
    const line2 = document.getElementById("introLine2");

    // Headline as segments, mirroring the hero: the accent word "transform"
    // renders in the Playfair Display italic accent, everything else in Inter.
    const LINE_1 = [{ t: "A New Era of" }];
    const LINE_2 = [{ t: "AI " }, { t: "Transformation", accent: true }];

    // Timing — tweak these to taste
    const START_DELAY = 450;  // let the video paint before typing
    const CHAR_SPEED  = 60;   // ms per character
    const LINE_PAUSE  = 320;  // pause between the two lines
    const END_PAUSE   = 700;  // hold after finishing before revealing

    // If the overlay is missing, just show the site
    if (!introEl || !line1 || !line2) {
      body.classList.remove("intro-loading");
      return;
    }

    function revealSite() {
      body.classList.remove("intro-loading");
      body.classList.add("intro-loaded");
      introEl.classList.add("is-hidden");
      // remove the overlay from the DOM once it has faded out
      window.setTimeout(function () {
        if (introEl.parentNode) introEl.parentNode.removeChild(introEl);
      }, 1000);
    }

    function lineLength(line) {
      return line.reduce(function (n, seg) { return n + seg.t.length; }, 0);
    }

    // Build a line's HTML revealed up to `count` characters, wrapping the
    // accent segment in the italic accent span.
    function renderLine(line, count) {
      let html = "";
      let remaining = count;
      line.forEach(function (seg) {
        if (remaining <= 0) return;
        const part = seg.t.slice(0, Math.min(seg.t.length, remaining));
        html += seg.accent
          ? '<span class="italic-accent">' + part + "</span>"
          : part;
        remaining -= part.length;
      });
      return html;
    }

    // Reduced motion: show the headline instantly, then reveal
    if (reduceMotion) {
      line1.innerHTML = renderLine(LINE_1, lineLength(LINE_1));
      line2.innerHTML = renderLine(LINE_2, lineLength(LINE_2));
      window.setTimeout(revealSite, 600);
      return;
    }

    // Type a single line character by character, then call done()
    function typeLine(el, line, done) {
      el.classList.add("is-typing");
      const total = lineLength(line);
      let i = 0;
      (function step() {
        el.innerHTML = renderLine(line, i);
        if (i < total) {
          i += 1;
          window.setTimeout(step, CHAR_SPEED);
        } else if (typeof done === "function") {
          done();
        }
      })();
    }

    window.setTimeout(function () {
      typeLine(line1, LINE_1, function () {
        line1.classList.remove("is-typing");
        line2.classList.add("is-typing");           // caret blinks on line 2
        window.setTimeout(function () {
          typeLine(line2, LINE_2, function () {
            window.setTimeout(function () {
              line2.classList.remove("is-typing");
              revealSite();
            }, END_PAUSE);
          });
        }, LINE_PAUSE);
      });
    }, START_DELAY);
  })();

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
     2b. NAV ACTIVE STATE (scroll-spy) — highlight the link for the
     section currently in view, for a clean, oriented navigation.
     =============================================================== */
  const navAnchors = Array.from(
    document.querySelectorAll('#navLinks a[href^="#"]')
  );
  const spySections = navAnchors
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && spySections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          navAnchors.forEach((a) =>
            a.classList.toggle("active", a.getAttribute("href") === id)
          );
        });
      },
      // Trigger around the upper-middle of the viewport
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    spySections.forEach((s) => spy.observe(s));
  }

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
     9. TRAILING STARLET CURSOR
     Replaces the pointer with a glowing star that leaves a trail of
     fading, drifting starlets. Desktop + fine-pointer only.
     =============================================================== */
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (finePointer && !reduceMotion) {
    // The star that rides on the pointer (inline SVG so it needs no assets)
    const star = document.createElement("div");
    star.className = "cursor-star";
    star.innerHTML =
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">' +
      '<path d="M12 0l2.9 8.3L24 12l-9.1 3.7L12 24l-2.9-8.3L0 12l9.1-3.7z"/></svg>';
    document.body.appendChild(star);

    const trailColors = ["#38e8ff", "#8b5cff", "#ff5cf0", "#ffffff"];
    let lastSpawn = 0;

    function spawnStarlet(x, y) {
      const el = document.createElement("div");
      el.className = "starlet";
      const size = Math.random() * 5 + 2;
      const color = trailColors[Math.floor(Math.random() * trailColors.length)];
      el.style.width = size + "px";
      el.style.height = size + "px";
      el.style.left = x + "px";
      el.style.top = y + "px";
      el.style.color = color;          // drives the glow via currentColor
      el.style.background = color;
      document.body.appendChild(el);

      // animate: drift slightly, shrink, and fade out
      const driftX = (Math.random() - 0.5) * 26;
      const driftY = (Math.random() - 0.5) * 26 + 10; // bias downward like falling sparks
      el.animate(
        [
          { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
          { transform: "translate(calc(-50% + " + driftX + "px), calc(-50% + " + driftY + "px)) scale(0)", opacity: 0 }
        ],
        { duration: 700 + Math.random() * 400, easing: "ease-out" }
      ).onfinish = function () { el.remove(); };
    }

    window.addEventListener("mousemove", function (e) {
      // position the main star
      star.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)";

      // throttle starlet spawning so the trail stays elegant, not spammy
      const now = performance.now();
      if (now - lastSpawn > 24) {
        spawnStarlet(e.clientX, e.clientY);
        lastSpawn = now;
      }
    });

    // little pop when clicking
    window.addEventListener("mousedown", function () {
      star.style.transform += " scale(1.6)";
    });
    window.addEventListener("mouseup", function () {
      star.style.transform = star.style.transform.replace(" scale(1.6)", "");
    });

    // hide the star when the pointer leaves the window
    document.addEventListener("mouseleave", function () { star.style.opacity = "0"; });
    document.addEventListener("mouseenter", function () { star.style.opacity = "1"; });
  }

  /* ===============================================================
     10. Footer year
     =============================================================== */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
