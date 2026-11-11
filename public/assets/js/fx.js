/* =====================================================================
   MINAR Küche – Interaktions-Effekte („Future Edition“)
   Magnetische Buttons mit Licht-Spot und Roll-Label, 3D-Tilt für Karten,
   Spotlight auf Gerichten, gleitender Navigations-Indikator,
   Scroll-Fortschritt in Flyer-Farben.
   Wird bei „Bewegung reduzieren“ und Touch-Geräten automatisch reduziert.
   ===================================================================== */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Scroll-Fortschritt ---------- */
  var bar = document.createElement("div");
  bar.className = "scroll-progress"; bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  var ticking = false;
  function progress() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ")";
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(progress); } }, { passive: true });
  progress();

  /* ---------- Buttons: Roll-Label ---------- */
  $$(".btn").forEach(function (btn) {
    if (btn.hasAttribute("data-wa-send")) return;            // Text wird dynamisch gesetzt
    var nodes = Array.prototype.slice.call(btn.childNodes).filter(function (n) { return n.nodeType === 3 && n.textContent.trim(); });
    var t = nodes[nodes.length - 1];
    if (!t) return;
    var text = t.textContent.trim();
    var roll = document.createElement("span");
    roll.className = "btn-roll";
    roll.innerHTML = '<span class="btn-label"></span>';
    roll.firstChild.textContent = text;
    roll.firstChild.setAttribute("data-text", text);
    btn.replaceChild(roll, t);
  });

  if (reduce || !finePointer) return;

  /* ---------- Buttons: Licht-Spot + Magnet ---------- */
  document.addEventListener("pointermove", function (e) {
    var btn = e.target.closest && e.target.closest(".btn, .add-btn, .chip, .icon-btn");
    if (!btn) return;
    var r = btn.getBoundingClientRect();
    var x = e.clientX - r.left, y = e.clientY - r.top;
    btn.style.setProperty("--mx", x + "px");
    btn.style.setProperty("--my", y + "px");
    if (btn.classList.contains("btn")) {
      btn.style.setProperty("--tx", ((x / r.width) - .5) * 8 + "px");
      btn.style.setProperty("--ty", ((y / r.height) - .5) * 6 + "px");
    }
  }, { passive: true });
  document.addEventListener("pointerout", function (e) {
    var btn = e.target.closest && e.target.closest(".btn");
    if (btn && !btn.contains(e.relatedTarget)) { btn.style.setProperty("--tx", "0px"); btn.style.setProperty("--ty", "0px"); }
  });

  /* ---------- Karten: 3D-Tilt + Spotlight ---------- */
  var TILT = ".cat-card, .gallery-item";
  var SPOT = ".dish, .contact-card, .step, .side-card, .service-list li, .zone-pills li, .cat-pager a, .order-way";
  document.addEventListener("pointermove", function (e) {
    if (!e.target.closest) return;
    var el = e.target.closest(TILT + "," + SPOT);
    if (!el) return;
    var r = el.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
    el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
    if (el.matches(TILT)) {
      el.style.setProperty("--ry", ((px - .5) * 10).toFixed(2) + "deg");
      el.style.setProperty("--rx", ((.5 - py) * 8).toFixed(2) + "deg");
    }
  }, { passive: true });
  document.addEventListener("pointerout", function (e) {
    var el = e.target.closest && e.target.closest(TILT);
    if (el && !el.contains(e.relatedTarget)) { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); }
  });

  /* ---------- Navigation: gleitender Indikator ---------- */
  var ul = document.querySelector(".main-nav ul");
  if (ul && window.innerWidth > 960) {
    var ind = document.createElement("li");
    ind.className = "nav-indicator"; ind.setAttribute("aria-hidden", "true");
    ul.appendChild(ind);
    var links = $$("a", ul);
    var active = ul.querySelector("a.is-active");
    var move = function (a) {
      if (!a) { ind.style.opacity = "0"; return; }
      ind.style.opacity = "1";
      ind.style.width = a.offsetWidth + "px";
      ind.style.transform = "translateX(" + a.offsetLeft + "px)";
    };
    requestAnimationFrame(function () { move(active); });
    links.forEach(function (a) {
      a.addEventListener("pointerenter", function () { move(a); });
      a.addEventListener("focus", function () { move(a); });
    });
    ul.addEventListener("pointerleave", function () { move(active); });
    window.addEventListener("resize", function () { move(active); });
  }
})();
