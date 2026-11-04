// Theme toggle, mobile menu, active nav link and the Power BI carousel.
(function () {
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  if (saved) root.setAttribute("data-theme", saved);

  document.addEventListener("DOMContentLoaded", function () {
    // ---- Theme ----
    var themeBtn = document.querySelector("[data-theme-toggle]");
    if (themeBtn) {
      var isDark = function () {
        var t = root.getAttribute("data-theme");
        if (t) return t === "dark";
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      };
      var paint = function () { themeBtn.textContent = isDark() ? "☀" : "☾"; };
      paint();
      themeBtn.addEventListener("click", function () {
        var next = isDark() ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try { localStorage.setItem("theme", next); } catch (e) {}
        paint();
      });
    }

    // ---- Mobile menu ----
    var menuBtn = document.querySelector("[data-menu-toggle]");
    var links = document.querySelector(".nav-links");
    if (menuBtn && links) {
      menuBtn.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      links.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          links.classList.remove("open");
          menuBtn.setAttribute("aria-expanded", "false");
        }
      });
    }

    // ---- Highlight the nav link for the section in view ----
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
    if ("IntersectionObserver" in window && navLinks.length) {
      var byId = {};
      navLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          navLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
          var a = byId[en.target.id];
          if (a) a.setAttribute("aria-current", "true");
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      Object.keys(byId).forEach(function (id) {
        var el = document.getElementById(id);
        if (el) io.observe(el);
      });
    }

    // ---- Power BI carousel ----
    var track = document.querySelector("[data-carousel]");
    if (track) {
      var slides = Array.prototype.slice.call(track.querySelectorAll(".slide"));
      var prev = document.querySelector("[data-carousel-prev]");
      var next = document.querySelector("[data-carousel-next]");
      var dotsWrap = document.querySelector("[data-carousel-dots]");
      var dots = [];

      var step = function () {
        if (slides.length < 2) return track.clientWidth;
        return slides[1].offsetLeft - slides[0].offsetLeft;
      };
      var current = function () { return Math.round(track.scrollLeft / step()); };
      var goTo = function (i) {
        i = Math.max(0, Math.min(slides.length - 1, i));
        track.scrollTo({ left: i * step(), behavior: "smooth" });
      };
      var update = function () {
        var i = current();
        var max = track.scrollWidth - track.clientWidth - 2;
        if (prev) prev.disabled = track.scrollLeft <= 2;
        if (next) next.disabled = track.scrollLeft >= max;
        dots.forEach(function (d, k) { d.setAttribute("aria-current", k === i ? "true" : "false"); });
      };

      if (dotsWrap) {
        slides.forEach(function (s, k) {
          var title = s.querySelector("h3");
          var b = document.createElement("button");
          b.setAttribute("aria-label", "Go to " + (title ? title.textContent : "report " + (k + 1)));
          b.addEventListener("click", function () { goTo(k); });
          dotsWrap.appendChild(b);
          dots.push(b);
        });
        if (slides.length < 2) dotsWrap.hidden = true;
      }
      if (prev) prev.addEventListener("click", function () { goTo(current() - 1); });
      if (next) next.addEventListener("click", function () { goTo(current() + 1); });
      track.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { e.preventDefault(); goTo(current() + 1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current() - 1); }
      });

      // A vertical mouse wheel over the carousel (outside the live reports) moves it
      // sideways one report at a time. Past the first or last report, the page scrolls on.
      var locked = false;
      track.addEventListener("wheel", function (e) {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // trackpad sideways swipe: native
        var max = track.scrollWidth - track.clientWidth - 2;
        var dir = e.deltaY > 0 ? 1 : -1;
        if ((dir > 0 && track.scrollLeft >= max) || (dir < 0 && track.scrollLeft <= 2)) return;
        e.preventDefault();
        if (locked) return;
        locked = true;
        goTo(current() + dir);
        setTimeout(function () { locked = false; }, 550);
      }, { passive: false });

      track.addEventListener("scroll", function () { window.requestAnimationFrame(update); }, { passive: true });
      window.addEventListener("resize", update);
      update();
    }

    var year = document.querySelector("[data-year]");
    if (year) year.textContent = new Date().getFullYear();
  });
})();
