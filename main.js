(function () {
  "use strict";

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      mobileNav.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("nav-open", !isOpen);
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("is-open");
        document.body.classList.remove("nav-open");
      });
    });
  }

  /* Scroll reveal */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* Footer year */
  var yearEl = document.getElementById("current-year");
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  /* Copy email to clipboard (fallback for when no mail client is configured) */
  function copyTextLegacy(text) {
    return new Promise(function (resolve, reject) {
      var input = document.createElement("textarea");
      input.value = text;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      input.setSelectionRange(0, text.length);
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(input);
      ok ? resolve() : reject(new Error("copy failed"));
    });
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () {
        return copyTextLegacy(text);
      });
    }
    return copyTextLegacy(text);
  }

  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    var label = btn.querySelector(".copy-btn-label");
    var defaultText = label ? label.textContent : "";
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy") || "";
      copyText(value).then(
        function () {
          btn.classList.add("is-copied");
          if (label) { label.textContent = "Copied"; }
          setTimeout(function () {
            btn.classList.remove("is-copied");
            if (label) { label.textContent = defaultText; }
          }, 2000);
        },
        function () {
          if (label) { label.textContent = "Copy failed"; }
          setTimeout(function () {
            if (label) { label.textContent = defaultText; }
          }, 2000);
        }
      );
    });
  });
})();
