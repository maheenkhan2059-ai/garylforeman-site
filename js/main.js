/* Gary L. Foreman — site interactions */
(function () {
  "use strict";

  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Photography filters
  var filters = document.querySelectorAll(".filter");
  var items = document.querySelectorAll(".g-item");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filters.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var cat = btn.dataset.filter;
      items.forEach(function (item) {
        item.classList.toggle("hidden", cat !== "all" && item.dataset.cat !== cat);
      });
    });
  });

  // Order total
  var checks = document.querySelectorAll('.product input[type="checkbox"]');
  var qty = document.querySelector('#order-form input[name="qty"]');
  var totalEl = document.getElementById("total");
  function updateTotal() {
    var sum = 0;
    checks.forEach(function (c) { if (c.checked) sum += parseFloat(c.dataset.price); });
    var q = qty ? Math.max(1, parseInt(qty.value, 10) || 1) : 1;
    if (totalEl) totalEl.textContent = "$" + (sum * q).toFixed(2);
  }
  checks.forEach(function (c) { c.addEventListener("change", updateTotal); });
  if (qty) qty.addEventListener("input", updateTotal);

  // Form submissions (front-end only — connect to a form service / payment processor)
  function handleForm(id, message, validate) {
    var form = document.getElementById(id);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector(".form-note");
      if (validate && !validate()) {
        note.style.color = "var(--rust)";
        note.textContent = "Please select at least one item above.";
        return;
      }
      note.style.color = "";
      note.textContent = message;
      form.reset();
      updateTotal();
    });
  }
  handleForm("booking", "Thank you! Your booking request has been sent. We’ll be in touch shortly.");
  handleForm("order-form", "Thank you! Redirecting you to secure checkout…", function () {
    return Array.prototype.some.call(checks, function (c) { return c.checked; });
  });

  // Scroll reveal
  var revealEls = document.querySelectorAll(".section-head, .split, .feature, .card, .g-item, .video, .topic, .product, .form-card, .banner .container");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
  }
})();
