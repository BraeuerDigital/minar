/* =====================================================================
   MINAR Küche – Logo-Intro (Startseite)
   ---------------------------------------------------------------------
   Phase A  Logo-Aufbau       0,0 – 2,2 s  Sonne → Linien → Siegel → Halbmond
                                           → MINAR (Buchstaben gestaffelt) → Küche
                                           → Unterzeile; Tier erscheint im Stand
   Phase B  Ruhiger Stand     2,2 – 2,9 s  minimale Atmung / Haltungskorrektur
   Phase C  Scharren          2,9 – 4,0 s  Vorderlauf: anheben – vorstrecken – zurückziehen (2×)
   Phase D  Sprung            4,0 – 5,3 s  Gewicht verlagern, ducken, Abdruck, Aufrichten
   Phase E  Endpose           ab 5,3 s     exakt Original-Logo, danach völlig still

   Technik: Vanilla JS + SVG, ein requestAnimationFrame-Loop, keine Bibliothek.
   Rig: tools/logo_anim.py (Original-Silhouette, Gelenkkette Huf → Hüfte → Schulter → Ellbogen,
   Winkel 0 = Original-Pose). Am Ende Umschalten auf die unzerlegte Original-Silhouette.
   Fallbacks: prefers-reduced-motion oder bereits in dieser Sitzung gesehen → sofort statisch.
   ===================================================================== */
(function () {
  "use strict";
  var svg = document.querySelector(".minar-logo-anim");
  if (!svg || !window.requestAnimationFrame) return;
  var KEY = "minar-logo-intro";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var seen = false;
  try { seen = sessionStorage.getItem(KEY) === "1"; } catch (e) { /* privat */ }
  if (reduce || seen) return;                                   // statisches Logo bleibt stehen

  var $ = function (s) { return svg.querySelector(s); };
  var rig = $(".mg-rig"), stat = $(".mg-static");
  if (!rig || !stat) return;

  /* ---------------- Easing ---------------- */
  var E = {
    lin:   function (t) { return t; },
    sine:  function (t) { return -(Math.cos(Math.PI * t) - 1) / 2; },
    inOut: function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    out:   function (t) { return 1 - Math.pow(1 - t, 3); },
    out4:  function (t) { return 1 - Math.pow(1 - t, 4); },       // kraftvoller Start, weiches Ankommen, kein Überschwingen
    in2:   function (t) { return t * t; }
  };
  // Spur: [[t, wert, easing-zum-wert], …] – Wert zwischen Stützpunkten interpoliert
  function at(track, t) {
    if (t <= track[0][0]) return track[0][1];
    for (var i = 1; i < track.length; i++) {
      var a = track[i - 1], b = track[i];
      if (t <= b[0]) return a[1] + (b[1] - a[1]) * E[b[2] || "inOut"]((t - a[0]) / Math.max(1, b[0] - a[0]));
    }
    return track[track.length - 1][1];
  }
  var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };

  /* ---------------- Phase A: Logo-Aufbau ---------------- */
  // Jedes Element: Start, Dauer, Art des Auftritts
  function box(el) { var b = el.getBBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }
  var build = [];
  function reveal(el, start, dur, kind) { if (el) build.push({ el: el, s: start, d: dur, k: kind, c: box(el) }); }
  reveal($(".lg-sun"), 0, 800, "grow");
  reveal($(".lg-lines"), 450, 650, "draw");
  reveal($(".lg-seal"), 800, 600, "rise");
  reveal($(".lg-moon"), 950, 600, "rise");
  Array.prototype.forEach.call(svg.querySelectorAll(".lg-letter"), function (el, i) { reveal(el, 1150 + i * 75, 560, "lift"); });
  reveal($(".lg-kueche"), 1650, 560, "lift");
  reveal($(".lg-tagline"), 1900, 520, "rise");
  var goatG = $(".lg-goat");
  var GOAT_IN = [1250, 650];                                     // Tier erscheint (bereits im Stand)

  function applyBuild(t) {
    for (var i = 0; i < build.length; i++) {
      var b = build[i], p = clamp01((t - b.s) / b.d), e = E.out(p), tr = "";
      if (b.k === "grow") tr = "translate(" + b.c.x + " " + b.c.y + ") scale(" + (0.9 + 0.1 * e) + ") translate(" + -b.c.x + " " + -b.c.y + ")";
      else if (b.k === "draw") tr = "translate(" + b.c.x + " 0) scale(" + Math.max(0.001, e) + " 1) translate(" + -b.c.x + " 0)";
      else if (b.k === "rise") tr = "translate(0 " + (10 * (1 - e)) + ")";
      else if (b.k === "lift") tr = "translate(0 " + (26 * (1 - e)) + ")";
      b.el.setAttribute("opacity", b.k === "draw" ? Math.min(1, p * 3) : e);
      if (p >= 1) b.el.removeAttribute("transform"); else b.el.setAttribute("transform", tr);
    }
    goatG.setAttribute("opacity", E.out(clamp01((t - GOAT_IN[0]) / GOAT_IN[1])));
  }

  /* ---------------- Tier: Posen & Spuren (Grad) ---------------- */
  var J = {};
  Array.prototype.forEach.call(rig.querySelectorAll("[data-joint]"), function (g) {
    J[g.getAttribute("data-joint")] = { el: g, x: g.getAttribute("data-cx"), y: g.getAttribute("data-cy") };
  });
  // Stand: Hinterbein steil, Rumpf leicht gesenkt, Vorderlauf senkrecht am Boden
  var S = { hind: 16, body: -22, arm: -80, fore: 104 };
  // Scharren: Knie anheben (Huf eingeklappt) → Lauf vorstrecken → zurückziehen
  var LIFT = { arm: -45, fore: 60 }, REACH = { arm: -58, fore: 122 };
  var LIFT2 = { arm: -55, fore: 72 }, REACH2 = { arm: -64, fore: 116 };
  // Ducken vor dem Absprung: Gewicht nach hinten, Rumpf tiefer, Vorderlauf gebeugt
  var C = { hind: 17, body: -28, arm: -47, fore: 57 };

  var T = {
    hind: [[0, S.hind], [3950, S.hind], [4300, C.hind, "inOut"], [4380, C.hind, "lin"], [5300, 0, "out4"]],
    body: [[0, S.body], [2250, S.body],
           [2600, S.body + 0.9, "sine"], [2900, S.body, "sine"],                 // Atmung / Haltungskorrektur
           [3150, S.body - 0.8, "sine"], [3500, S.body + 0.4, "sine"], [3850, S.body, "sine"],  // Mitschwingen beim Scharren
           [4300, C.body, "inOut"], [4380, C.body, "lin"], [5200, 0, "out4"]],
    arm:  [[0, S.arm], [2900, S.arm],
           [3120, LIFT.arm, "inOut"], [3320, REACH.arm, "inOut"], [3500, S.arm, "in2"],      // 1. Scharren
           [3680, LIFT2.arm, "inOut"], [3850, REACH2.arm, "inOut"], [4000, S.arm, "in2"],    // 2. Scharren (kleiner)
           [4300, C.arm, "inOut"], [4340, C.arm, "lin"], [5050, 0, "out4"]],
    fore: [[0, S.fore], [2900, S.fore],
           [3120, LIFT.fore, "inOut"], [3320, REACH.fore, "inOut"], [3500, S.fore, "in2"],
           [3680, LIFT2.fore, "inOut"], [3850, REACH2.fore, "inOut"], [4000, S.fore, "in2"],
           [4300, C.fore, "inOut"], [4320, C.fore, "lin"], [4980, 0, "out4"]]
  };
  var END = 5300;

  function applyRig(t) {
    for (var k in T) {
      var j = J[k]; if (!j) continue;
      j.el.setAttribute("transform", "rotate(" + at(T[k], t).toFixed(3) + " " + j.x + " " + j.y + ")");
    }
  }

  /* ---------------- Start ---------------- */
  // Ausgangszustand sofort setzen (Skript steht direkt hinter dem SVG → vor dem ersten Zeichnen)
  rig.style.display = ""; stat.style.display = "none";
  applyBuild(0); applyRig(0);
  svg.classList.add("is-intro");

  var t0 = null;
  function frame(now) {
    if (t0 === null) t0 = now;
    var t = now - t0;
    applyBuild(t);
    applyRig(Math.min(t, END));
    if (t < END) { requestAnimationFrame(frame); return; }
    // Phase E: Original-Silhouette, alle Hilfstransformationen entfernen → völlig still
    stat.style.display = ""; rig.style.display = "none";
    build.forEach(function (b) { b.el.removeAttribute("transform"); b.el.removeAttribute("opacity"); });
    goatG.removeAttribute("opacity");
    svg.classList.remove("is-intro"); svg.classList.add("is-done");
    try { sessionStorage.setItem(KEY, "1"); } catch (e) { /* privat */ }
  }
  function go() { requestAnimationFrame(function () { requestAnimationFrame(frame); }); }
  // erst starten, wenn die Seite sichtbar ist („erster sichtbarer Aufruf“)
  if (document.visibilityState === "hidden") {
    document.addEventListener("visibilitychange", function onVis() {
      if (document.visibilityState !== "hidden") { document.removeEventListener("visibilitychange", onVis); go(); }
    });
  } else go();
})();
