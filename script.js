/* =========================================================
   DIFH3017 — Mental Health Communication Website
   Shared interactions: story timeline, storymap, a11y
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Set active nav link ---------- */
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path) link.classList.add("active");
  });

  /* ---------- Story scene switching ---------- */
  const scenes = document.querySelectorAll(".scene");
  const storyNav = document.getElementById("story-nav");
  const storymap = document.getElementById("storymap");
  const liveRegion = document.getElementById("live-region");

  if (scenes.length && storyNav) {
    let current = 0;

    function showScene(index) {
      if (index < 0 || index >= scenes.length) return;
      current = index;

      scenes.forEach((s, i) => {
        s.style.display = i === index ? "block" : "none";
      });

      // Update nav buttons
      storyNav.querySelectorAll("button").forEach((btn, i) => {
        btn.classList.toggle("active", i === index);
        btn.setAttribute("aria-current", i === index ? "true" : "false");
      });

      // Update storymap
      if (storymap) {
        storymap.querySelectorAll(".map-stop").forEach((stop, i) => {
          stop.classList.toggle("active", i === index);
          stop.setAttribute("aria-current", i === index ? "true" : "false");
        });
      }

      // Announce to screen readers
      if (liveRegion) {
        const title = scenes[index].querySelector(".scene-title");
        liveRegion.textContent = title
          ? `Scene ${index + 1}: ${title.textContent}`
          : `Scene ${index + 1}`;
      }

      // Scroll scene into view
      scenes[index].scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Build nav buttons
    scenes.forEach((s, i) => {
      const btn = document.createElement("button");
      const num = i + 1;
      btn.textContent = num;
      btn.setAttribute("aria-label", `Scene ${num}`);
      btn.addEventListener("click", () => showScene(i));
      storyNav.appendChild(btn);
    });

    // Previous / Next
    document.getElementById("prev-scene")?.addEventListener("click", () => {
      showScene(current - 1);
    });
    document.getElementById("next-scene")?.addEventListener("click", () => showScene(current + 1));

    // Storymap click
    storymap?.querySelectorAll(".map-stop").forEach((stop, i) => {
      stop.addEventListener("click", () => showScene(i));
    });

    // Initialize
    showScene(0);
  }

  /* ---------- Chart reveal ---------- */
  const charts = document.querySelectorAll("[data-chart]");
  if (charts.length) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25 }
      );
      charts.forEach((chart) => io.observe(chart));
    } else {
      charts.forEach((chart) => chart.classList.add("is-visible"));
    }
  }

  /* ---------- Year in footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
